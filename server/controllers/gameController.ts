import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
} from "socket-controllers";
import { Socket } from "socket.io";
import socket from "../config/socket";

@SocketController()
export class GameController {
  private getRoom(socket: Socket) {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    const gameRoom = socketRooms && socketRooms[0];

    return gameRoom;
  }

  @OnMessage("update_board")
  public async updateDone(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const gameRoom = this.getRoom(socket);
    socket.to(gameRoom).emit("update_board_done", { matrix: message.matrix });
  }

  @OnMessage("game_win")
  public async gameWinner(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any
  ) {
    const { message, isDraw, isLose } = body;
    const gameRoom = this.getRoom(socket);

    socket.to(gameRoom).emit("game_win", { message, isDraw, isLose });
  }
}
