import { io } from "socket.io-client";

export default {
  socket: null,
  connect(url) {
    return new Promise((resolve, reject) => {
      this.socket = io(url);

      if (!this.socket) reject();

      this.socket.on("connect", () => {
        resolve(this.socket);
      });

      this.socket.on("connect_error", (error) => {
        console.log(error);
        reject(error);
      });
    });
  },
};
