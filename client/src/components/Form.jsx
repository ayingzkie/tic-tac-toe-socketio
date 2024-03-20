import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import socketService from "../services/socketService";
import gameService from "../services/gameService";
import gameContext from "../context/gameContext";
import RoomLists from "./RoomLists";

const Form = () => {
  const [roomId, setRoomId] = useState("");
  const { setIsInRoom } = useContext(gameContext);

  const handleInputChange = (e) => {
    const value = e.target.value;

    setRoomId(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const socket = socketService.socket;

    if (socket) {
      gameService
        .joinGame(socket, roomId)
        .then(() => {
          alert("Success");
          setIsInRoom(true);
        })
        .catch((error) => alert(error));
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <input
          value={roomId}
          onChange={handleInputChange}
          placeholder="Room ID"
        />
        <button type="submit">Start new game</button>
      </form>
    </Container>
  );
};

const Container = styled.div``;

export default Form;
