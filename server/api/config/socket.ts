import { Server } from "socket.io";
import { useSocketServer } from "socket-controllers";
import Container from "typedi";
import { Server as HttpServer } from "http";
import { dirname } from "path";
import { GameController } from "../controllers/gameController";
import { MainController } from "../controllers/mainController";
import { RoomController } from "../controllers/roomController";

export default (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  useSocketServer(io, {
    controllers: [MainController, RoomController, GameController],
  });

  return io;
};
