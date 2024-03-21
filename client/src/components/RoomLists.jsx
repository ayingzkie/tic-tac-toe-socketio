import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getRoomLists } from "../utils/api";
import socketService from "../services/socketService";
import gameService from "../services/gameService";
import gameContext from "../context/gameContext";
import Table from "./styled/Table";

const RoomLists = () => {
  const { roomLists, setRoomLists, setIsInRoom } = useContext(gameContext);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRooms = async () => {
    const { data } = await getRoomLists();
    console.log(data);
    setRoomLists(data?.rooms || []);
  };

  const initSocketService = () => {
    const socket = socketService.socket;
    if (socket) {
      gameService.onUpdateLists(socket, () => {
        fetchRooms();
      });
    }
  };

  const joinGame = async (roomId) => {
    const socket = socketService.socket;
    if (!roomId || roomId === "" || !socket) return;
    setIsLoading(true);
    const joined = await gameService
      .joinGame(socket, roomId)
      .catch((error) => console.log(error));

    if (joined) setIsInRoom(true);

    setIsLoading(false);
  };

  const formatRoomName = (name) => {
    const newName = String(name).split("-");
    return [newName[1]];
  };

  useEffect(() => {
    fetchRooms();
    const button = window.document.getElementById("initSocket");
    setTimeout(() => {
      button.click();
    }, 100);
  }, []);

  return (
    <Container>
      <button id="initSocket" hidden onClick={initSocketService}>
        click
      </button>
      <h2>Room lists</h2>
      <Table border={1} cellSpacing={0}>
        <thead>
          <tr>
            <td>RoomID</td>
            <td>Participants</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {roomLists.map((list, idx) => {
            return (
              <tr key={`${list.name}-${idx}`}>
                <td>{formatRoomName(list.name)}</td>
                <td>{list.count}</td>
                <td>
                  {list.count < 2 ? (
                    <button
                      disabled={isLoading}
                      onClick={() => joinGame(formatRoomName(list.name))}
                    >
                      Join
                    </button>
                  ) : (
                    "Full"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

const Container = styled.div``;

export default RoomLists;
