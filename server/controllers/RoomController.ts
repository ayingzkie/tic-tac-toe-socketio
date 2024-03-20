import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Service } from "typedi";
import socket from "../config/socket";
import { Server, Socket } from "socket.io";

@SocketController()
@Service()
export class RoomController {
  @OnMessage("join")
  join(
    @ConnectedSocket() socket: Socket,
    @SocketIO() io: Server,
    @MessageBody() message: any
  ) {
    console.log("New user is joining", message);

    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );

    if (
      socketRooms.length > 0 ||
      (connectedSockets && connectedSockets.size === 2)
    ) {
      socket.emit("join_error", {
        error: "Error in joining room",
      });
    } else {
      socket.emit("join_success");
      socket.join(`created-${message.roomId}`);
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
