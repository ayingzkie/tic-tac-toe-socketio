import { Fragment, useEffect, useState } from "react";
import "./App.css";
import socketService from "./services/socketService";
import GameContext from "./context/gameContext";
import Form from "./components/Form";
import Game from "./components/Game";
import RoomLists from "./components/RoomLists";

function App() {
  const [playerSymbol, setPlayerSymbol] = useState("x");
  const [isInRoom, setIsInRoom] = useState(false);
  const [roomLists, setRoomLists] = useState([]);
  async function connectSocket() {
    const socket = await socketService.connect("http://192.168.68.100:3000");
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
      {isInRoom && <Game />}
    </GameContext.Provider>
  );
}

export default App;
