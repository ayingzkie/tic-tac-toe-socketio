import { Server } from "socket.io";
import { SocketControllers } from "socket-controllers";
import Container from "typedi";
import { Server as HttpServer } from "http";
import { MainController } from "../controllers/MainController";
import { RoomController } from "../controllers/RoomController";
import { GameController } from "../controllers/GameController";

export default (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  try {
    new SocketControllers({
      io,
      container: Container,
      controllers: [MainController, RoomController, GameController],
    });
  } catch (e) {
    console.log(e);
  }

  return io;
};
