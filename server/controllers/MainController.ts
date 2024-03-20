import {
  ConnectedSocket,
  MessageBody,
  OnConnect,
  OnMessage,
  SocketController,
} from "socket-controllers";
import { Socket } from "socket.io";
import { Service } from "typedi";

@SocketController()
export class MainController {
  @OnConnect()
  public async connection(@ConnectedSocket() socket: Socket) {
    console.log("connected!" + socket.id);
  }
}
