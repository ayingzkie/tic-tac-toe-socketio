import { Socket } from "engine.io";
import {
  ConnectedSocket,
  MessageBody,
  OnConnect,
  OnMessage,
  SocketController,
} from "socket-controllers";
import { Service } from "typedi";

@SocketController()
@Service()
export class MainController {
  @OnConnect()
  connection(@ConnectedSocket() socket: Socket) {
    console.log("connected!");
  }
}
