import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import socketService from "../services/socketService";
import gameService from "../services/gameService";
import gameContext from "../context/gameContext";

const Form = () => {
  const [roomId, setRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setIsInRoom, playerName, setPlayerName } = useContext(gameContext);
  const handleInputChange = (e) => {
    const value = e.target.value;

    setRoomId(value);
  };

  const handleInputPlayer = (e) => {
    const value = e.target.value;
    setPlayerName(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const socket = socketService.socket;
    if (!roomId || roomId === "" || !socket) return;
    setIsLoading(true);
    const joined = await gameService
      .joinGame(socket, roomId)
      .catch((error) => console.log(error));

    if (joined) setIsInRoom(true);

    setIsLoading(false);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <input
          value={playerName}
          onChange={handleInputPlayer}
          placeholder="Player name"
        />
        <input
          value={roomId}
          onChange={handleInputChange}
          placeholder="Room ID"
        />
        <button type="submit" disabled={isLoading}>
          Start new game
        </button>
      </form>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  form {
    display: flex;
    flex-direction: column;
    margin: auto;
    width: fit-content;
    gap: 8px;
  }
`;

export default Form;
