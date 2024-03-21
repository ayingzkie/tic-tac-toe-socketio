import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import GameResultModel from "../models/GameResult.model";

@SocketController()
export class RoomController {
  private getRoom(socket: Socket) {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    const gameRoom = socketRooms && socketRooms[0];

    return gameRoom;
  }

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
        socket.emit("start_game", {
          start: true,
          player: "x",
          roomId: newRoomName,
        });
        socket.to(newRoomName).emit("start_game", {
          start: false,
          player: "o",
          roomId: newRoomName,
        });
      }
    }
  }

  @OnMessage("leave_game")
  async eaveGame(@ConnectedSocket() socket: Socket, @MessageBody() body: any) {
    const { roomId, playerName, winCount, loseCount, drawCount } = body;
    const room = this.getRoom(socket);
    await socket.leave(room);
    socket.to(room).emit("on_leave_game");

    console.log(body, "@save result");

    const afterSave = await GameResultModel.create({
      roomId,
      playerName,
      winCount,
      loseCount,
      drawCount,
    });

    console.log(afterSave, "@after save");
  }

  @OnMessage("on_update_lists")
  onUpdateRoomLists(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    console.log(message, "@message");
    socket.broadcast.emit("on_update_lists");
  }

  @OnMessage("continue_game")
  continueGame(@ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    const room = this.getRoom(socket);

    if (message.count === 2) {
      socket.emit("on_continue_game", { count: message.count });
    }

    socket.to(room).emit("on_continue_game", { count: message.count });
  }
}
