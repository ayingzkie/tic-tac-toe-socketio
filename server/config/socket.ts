import { Server } from "socket.io";
import { useSocketServer } from "socket-controllers";
import Container from "typedi";
import { Server as HttpServer } from "http";
import { dirname } from "path";
import { MainController } from "../controllers/MainController";
import { RoomController } from "../controllers/RoomController";
import { GameController } from "../controllers/gameController";

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
