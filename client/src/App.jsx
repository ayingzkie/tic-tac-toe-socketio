import { Fragment, useEffect, useState } from "react";
import "./App.css";
import socketService from "./services/socketService";
import GameContext from "./context/gameContext";
import Form from "./components/Form";
import Game from "./components/Game";
import RoomLists from "./components/RoomLists";
import History from "./components/History";
import Board from "./components/Board";

function App() {
  const [playerSymbol, setPlayerSymbol] = useState("x");
  const [isInRoom, setIsInRoom] = useState(false);
  const [roomLists, setRoomLists] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");

  async function connectSocket() {
    const socket = await socketService.connect();
  }

  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <GameContext.Provider
      value={{
        isInRoom,
        setIsInRoom,
        playerSymbol,
        setPlayerSymbol,
        roomLists,
        setRoomLists,
        isPlayerTurn,
        setIsPlayerTurn,
        isGameStarted,
        setIsGameStarted,
        playerName,
        setPlayerName,
        roomId,
        setRoomId,
      }}
    >
      <div className="container">
        {!isInRoom && (
          <Fragment>
            <aside className="side-content">
              <RoomLists />
              <History />
            </aside>
            <Form />
          </Fragment>
        )}
      </div>
      {isInRoom && <Board />}
    </GameContext.Provider>
  );
}

export default App;
