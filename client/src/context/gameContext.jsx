import React from "react";

const defaultValue = {
  isInRoom: false,
  setIsInRoom: () => {},
  playerSymbol: "x",
  setPlayerSymbol: () => {},
  roomLists: [],
  setRoomLists: () => {},
  isPlayerTurn: false,
  setIsPlayerTurn: () => {},
  isGameStarted: false,
  setIsGameStarted: () => {},
  playerName: "",
  setPlayerName: () => {},
  roomId: "",
  setRoomId: () => {},
};

export default React.createContext(defaultValue);
