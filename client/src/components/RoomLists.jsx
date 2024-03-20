import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getRoomLists } from "../utils/api";
import socketService from "../services/socketService";
import gameService from "../services/gameService";
import gameContext from "../context/gameContext";

const RoomLists = () => {
  const { roomLists, setRoomLists, setIsInRoom } = useContext(gameContext);

  async function fetchRooms() {
    const { data } = await getRoomLists();
    console.log(data);
    setRoomLists(data?.rooms || []);
  }

  function initSocketService() {
    const socket = socketService.socket;
    if (socket) {
      gameService.onUpdateLists(socket, () => {
        fetchRooms();
      });
    }
  }

  function joinGame(roomId) {
    const socket = socketService.socket;

    if (socket) {
      gameService.joinGame(socket, roomId).then(() => {
        setIsInRoom(true);
      });
    }
  }

  function formatRoomName(name) {
    const newName = String(name).split("-");
    return [newName[1]];
  }

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
      <table>
        <thead>
          <tr>
            <td>RoomID</td>
            <td>Participants</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {roomLists.map((list) => {
            return (
              <tr>
                <td>{formatRoomName(list.name)}</td>
                <td>{list.count}</td>
                <td>
                  {list.count < 2 ? (
                    <button onClick={() => joinGame(formatRoomName(list.name))}>
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
      </table>
    </Container>
  );
};

const Container = styled.div``;

export default RoomLists;
