import React from "react";

const defaultValue = {
  isInRoom: false,
  setIsInRoom: () => {},
  playerSymbol: "x",
  setPlayerSymbol: () => {},
  roomLists: [],
  setRoomLists: () => {},
};

export default React.createContext(defaultValue);
