import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";

@SocketController()
export class RoomController {
  @OnMessage("join_game")
  public async joinGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    console.log("New User joining room: ", message);

    const newRoomName = `created-${message.roomId}`;

    const connectedSockets = io.sockets.adapter.rooms.get(newRoomName);
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );

    if (
      socketRooms.length > 0 ||
      (connectedSockets && connectedSockets.size === 2)
    ) {
      socket.emit("room_join_error", {
        error: "Room is full please choose another room to play!",
      });
    } else {
      await socket.join(newRoomName);
      socket.emit("room_joined");

      if (io.sockets.adapter.rooms.get(newRoomName)?.size === 2) {
        socket.emit("start_game", { start: true, player: "x" });
        socket
          .to(newRoomName)
          .emit("start_game", { start: false, player: "o" });
      }
    }
  }

  @OnMessage("on_update_lists")
  onUpdateRoomLists(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    console.log(message, "@message");
    socket.broadcast.emit("on_update_lists");
  }
}
