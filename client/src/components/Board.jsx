import { useContext, useEffect, useState } from "react";
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
  const { playerSymbol, setPlayerSymbol } = useContext(gameContext);

  async function handleClick(row, col, symbol) {
    const newMatrix = [...matrix];
    const socket = socketService.socket;

    if (newMatrix[row][col] === null || newMatrix[row][col] === "null") {
      newMatrix[row][col] = symbol;

      setMatrix(newMatrix);
    }

    if (socket) {
      gameService.updateBoard(socket, { matrix: newMatrix });
    }
  }

  function renderBoard() {
    return matrix.map((row, rowIdx) => {
      return row.map((col, colIdx) => (
        <Cell
          key={`cell__${rowIdx}-${colIdx}`}
          onClick={() => handleClick(rowIdx, colIdx, "x")}
        >
          {col}
        </Cell>
      ));
    });
  }

  function handleUpdateMove() {
    const socket = socketService.socket;
    if (socket) {
      gameService.onUpdateBoardDone(socket, ({ matrix }) => {
        setMatrix(matrix);
      });
    }
  }

  useEffect(() => {
    handleUpdateMove();
  }, []);

  return <Container>{renderBoard()}</Container>;
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  justify-content: center;
  gap: 8px;
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
