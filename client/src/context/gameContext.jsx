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
};

export default React.createContext(defaultValue);
