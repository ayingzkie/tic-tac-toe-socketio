import styled from "styled-components";
import Board from "./Board";

const Game = () => {
  return (
    <Container>
      <Board />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
`;

export default Game;
