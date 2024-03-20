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
  justify-content: center;
  height: 100vh;
  flex-direction: column;
`;

export default Game;
