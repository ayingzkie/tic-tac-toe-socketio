export default {
  async joinGame(socket, roomId) {
    return new Promise((resolve, reject) => {
      socket.emit("join_game", { roomId });
      socket.on("room_joined", () => {
        socket.emit("on_update_lists", { message: "on update lists" });
        resolve(true);
      });

      socket.on("room_join_error", ({ error }) => {
        reject(error);
      });
    });
  },
  async updateBoard(socket, matrix) {
    socket.emit("update_board", {
      matrix,
    });
  },
  async onUpdateBoardDone(socket, callback) {
    socket.on("update_board_done", ({ matrix }) => callback(matrix));
  },
  async onUpdateLists(socket, callback) {
    socket.on("on_update_lists", callback);
  },
  async onGameStart(socket, callback) {
    socket.on("start_game", callback);
  },
};
