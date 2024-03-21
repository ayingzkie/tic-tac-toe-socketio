import { Fragment, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import gameContext from "../context/gameContext";
import gameService from "../services/gameService";
import socketService from "../services/socketService";
import axiosInstance from "../utils/axios";

const Board = () => {
  const defualtMatrix = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const [matrix, setMatrix] = useState(defualtMatrix);

  const [message, setMessage] = useState("");
  const [votes, setVotes] = useState(0);
  const [isVoted, setIsVoted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [winCount, setWinCount] = useState(0);
  const [loseCount, setLoseCount] = useState(0);
  const [drawCount, setDrawCount] = useState(0);

  const {
    playerSymbol,
    setPlayerSymbol,
    isGameStarted,
    setIsGameStarted,
    isPlayerTurn,
    setIsPlayerTurn,
    setIsInRoom,
    roomId,
    setRoomId,
  } = useContext(gameContext);

  const resetGame = () => {
    setMessage("");
    setMatrix(defualtMatrix);
    setIsVoted(false);
    setVotes(0);
  };

  const checkGameState = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
      let row = [];
      for (let j = 0; j < matrix[i].length; j++) {
        row.push(matrix[i][j]);
      }

      if (row.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (row.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    for (let i = 0; i < matrix.length; i++) {
      let column = [];
      for (let j = 0; j < matrix[i].length; j++) {
        column.push(matrix[j][i]);
      }

      if (column.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (column.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    if (matrix[1][1]) {
      if (matrix[0][0] === matrix[1][1] && matrix[2][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }

      if (matrix[2][0] === matrix[1][1] && matrix[0][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }
    }

    //Check for a tie
    if (matrix.every((m) => m.every((v) => v !== null))) {
      return [true, true];
    }

    return [false, false];
  };

  const handleClick = (row, col, symbol) => {
    const newMatrix = [...matrix];
    const socket = socketService.socket;

    if (newMatrix[row][col] === null || newMatrix[row][col] === "null") {
      newMatrix[row][col] = symbol;
      setMatrix(newMatrix);
    } else {
      return;
    }

    if (socket) {
      gameService.updateBoard(socket, { matrix: newMatrix });
      const [currentIsWinner, otherIsWinner] = checkGameState(matrix);

      if (currentIsWinner && otherIsWinner) {
        gameService.gameWin(socket, { message: "It's a tie!", isDraw: true });
        setMessage("It's a tie!");
      } else if (currentIsWinner && !otherIsWinner) {
        gameService.gameWin(socket, { message: "You lose!", isLose: true });
        setMessage("You won!");
        setWinCount((prev) => prev + 1);
      }
    }

    setIsPlayerTurn(false);
  };

  const renderBoard = () => {
    return matrix.map((row, rowIdx) => {
      return (
        <Row>
          {row.map((col, colIdx) => {
            return (
              <Cell
                key={`cell__${rowIdx}-${colIdx}`}
                onClick={() => handleClick(rowIdx, colIdx, playerSymbol)}
              >
                {col}
              </Cell>
            );
          })}
        </Row>
      );
    });
  };

  const handleUpdateMove = () => {
    const socket = socketService.socket;
    if (socket) {
      gameService.onUpdateBoardDone(socket, ({ matrix }) => {
        setMatrix(matrix);
        setIsPlayerTurn(true);

        checkGameState(matrix);
      });
    }
  };

  const handleStartGame = () => {
    const socket = socketService.socket;
    if (socket) {
      gameService.onGameStart(socket, (options) => {
        if (!message) {
          setMessage("");
        }
        setMatrix(defualtMatrix);
        setIsGameStarted(true);
        setPlayerSymbol(options.player);
        setRoomId(options.roomId);
        if (options.start) setIsPlayerTurn(true);
        else setIsPlayerTurn(false);
      });
    }
  };

  const handleGameWinner = () => {
    const socket = socketService.socket;
    if (socket) {
      gameService.onGameWin(socket, ({ message, isLose, isDraw }) => {
        setMessage(message);
        setIsPlayerTurn(false);
        if (isLose) setLoseCount((prev) => prev + 1);
        if (isDraw) setDrawCount((prev) => prev + 1);
      });
    }
  };

  const handleContinue = () => {
    const socket = socketService.socket;
    const newCount = votes + 1;

    setVotes((prev) => prev + 1);
    setIsVoted(true);

    if (socket) {
      gameService.continueGame(socket);
    }

    if (newCount === 2) {
      setIsPlayerTurn(true);
    }
  };

  const handleOnContinue = () => {
    const socket = socketService.socket;

    if (socket) {
      gameService.onContinue(socket, (count) => {
        setVotes((prev) => prev + 1);

        setMessage("Other player wants to play another round");
      });
    }
  };
  const handleStop = () => {
    setIsInRoom(false);
    const socket = socketService.socket;

    if (socket) {
      gameService.leaveGame(socket, {
        roomId,
        playerName,
        winCount,
        loseCount,
        drawCount,
      });
    }
  };

  const handleOnLeaveGame = () => {
    const socket = socketService.socket;

    if (socket) {
      gameService.onLeaveGame(socket, () => {
        setMessage(
          "Pleayer is the leaveing the game. \n Waiting for player to join."
        );
      });
    }
  };

  const hanldePlayerNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const saveCurrentResult = (roomId, winner, loser) => {
    axiosInstance.post("/save", {
      roomId,
      winner,
      loser,
    });
  };

  useEffect(() => {
    handleStartGame();
    handleUpdateMove();
    handleGameWinner();
    handleOnLeaveGame();
    handleOnContinue();
  }, []);

  useEffect(() => {
    if (votes === 2) {
      resetGame();
    }
  }, [votes]);

  return (
    <Container>
      <h1>Room ID: {roomId}</h1>
      <form>
        Enter your name:{" "}
        <input value={playerName} onChange={hanldePlayerNameChange} />
      </form>
      <h3>
        Stats: Draw={drawCount} | Lose={loseCount} | Win={winCount}
      </h3>
      {isGameStarted && (
        <h3>Your playing as {String(playerSymbol).toUpperCase()}</h3>
      )}
      {!isGameStarted && <h2>Waiting for other player....</h2>}
      {(!isGameStarted || !isPlayerTurn) && (
        <Overlay>
          {message && (
            <Fragment>
              <h3>{message}</h3>
              <button disabled={isVoted} onClick={handleContinue}>
                Continue
              </button>
              <button onClick={handleStop}>Stop</button>
            </Fragment>
          )}
        </Overlay>
      )}
      {renderBoard()}
    </Container>
  );
};

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 99999;

  background: rgba(0, 0, 0, 0.5);

  font-size: 2rem;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;
`;

const Row = styled.div`
  display: flex;
`;

const Cell = styled.div`
  border: 1px solid black;
  width: 100px;
  height: 100px;
  font-size: 2em;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Board;
