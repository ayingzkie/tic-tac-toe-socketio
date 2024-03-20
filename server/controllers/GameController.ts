import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import { Service } from "typedi";
import socket from "../config/socket";

@SocketController()
@Service()
export class GameController {
  private getRoom(socket: Socket) {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    const gameRoom = socketRooms && socketRooms[0];

    return gameRoom;
  }

  @OnMessage("update_board")
  updateDone(@ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    const gameRoom = this.getRoom(socket);
    socket.to(gameRoom).emit("update_board_done", { matrix: message.matrix });
  }
}
