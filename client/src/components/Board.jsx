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
  const {
    playerSymbol,
    setPlayerSymbol,
    isGameStarted,
    setIsGameStarted,
    isPlayerTurn,
    setIsPlayerTurn,
  } = useContext(gameContext);

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

  useEffect(() => {
    handleStartGame();
    handleUpdateMove();
  }, []);

  return (
    <Container>
      {!isGameStarted && <h2>Waiting for other player....</h2>}
      {(!isGameStarted || !isPlayerTurn) && <Overlay />}
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
