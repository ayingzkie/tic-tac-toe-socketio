import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
} from "socket-controllers";
import { Socket } from "socket.io";

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
    console.log(message.matrix, "@message");
    socket.to(gameRoom).emit("update_board_done", { matrix: message.matrix });
  }
}
