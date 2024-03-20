import { io } from "socket.io-client";

class SocketService {
  socket = null;

  connect(url) {
    const apiUrl = url || import.meta.env.VITE_API_URL;
    return new Promise((resolve, reject) => {
      this.socket = io(apiUrl);

      if (!this.socket) reject();

      this.socket.on("connect", () => {
        resolve(this.socket);
      });

      this.socket.on("connect_error", (error) => {
        console.log(error);
        reject(error);
      });
    });
  }
}

export default new SocketService();
