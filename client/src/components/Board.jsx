import { Fragment, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import gameContext from "../context/gameContext";
import gameService from "../services/gameService";
import socketService from "../services/socketService";

const Board = () => {
  const [matrix, setMatrix] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  const [message, setMessage] = useState("");

  const {
    playerSymbol,
    setPlayerSymbol,
    isGameStarted,
    setIsGameStarted,
    isPlayerTurn,
    setIsPlayerTurn,
    setIsInRoom,
  } = useContext(gameContext);

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
    }

    if (socket) {
      setIsPlayerTurn(false);
      gameService.updateBoard(socket, { matrix: newMatrix });
      const [currentIsWinner, otherIsWinner] = checkGameState(matrix);

      if (currentIsWinner && otherIsWinner) {
        gameService.gameWin(socket, { message: "It's a tie!" });
        setMessage("It's a tie!");
      } else if (currentIsWinner && !otherIsWinner) {
        gameService.gameWin(socket, { message: "You lose!" });
        setMessage("You won!");
      }
    }
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
        setIsGameStarted(true);
        setPlayerSymbol(options.player);
        if (options.start) setIsPlayerTurn(true);
        else setIsPlayerTurn(false);
      });
    }
  };

  const handleGameWinner = () => {
    const socket = socketService.socket;
    if (socket) {
      gameService.onGameWin(socket, ({ message }) => {
        setMessage(message);
        setIsPlayerTurn(false);
      });
    }
  };

  const handleOnContinue = () => {
    setIsInRoom(false);
  };

  useEffect(() => {
    handleStartGame();
    handleUpdateMove();
    handleGameWinner();
  }, []);

  return (
    <Container>
      {!isGameStarted && <h2>Waiting for other player....</h2>}
      {(!isGameStarted || !isPlayerTurn) && (
        <Overlay>
          {message && (
            <Fragment>
              <h3>{message}</h3>
              <button onClick={handleOnContinue}>Continue</button>
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
