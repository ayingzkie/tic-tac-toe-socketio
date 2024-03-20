export default {
  async joinGame(socket, roomId) {
    return new Promise((resolve, reject) => {
      socket.emit("join", { roomId });
      socket.on("join_success", () => {
        socket.emit("on_update_lists", { message: "on update lists" });
        resolve(true);
      });

      socket.on("join_error", ({ error }) => {
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
    socket.on("on_update_lists", () => callback());
  },
};
