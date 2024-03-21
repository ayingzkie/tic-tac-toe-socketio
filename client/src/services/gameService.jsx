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
  onUpdateBoardDone(socket, callback) {
    socket.on("update_board_done", ({ matrix }) => callback(matrix));
  },
  onUpdateLists(socket, callback) {
    socket.on("on_update_lists", callback);
  },
  onGameStart(socket, callback) {
    socket.on("start_game", callback);
  },
  gameWin(socket, message) {
    socket.emit("game_win", { message });
  },
  onGameWin(socket, callback) {
    socket.on("game_win", ({ message }) => callback(message));
  },
  continueGame(socket, payload) {
    socket.emit("continue_game", { payload });
  },
  onContinue(socket, callback) {
    socket.on("on_continue_game", ({ count }) => callback(count));
  },
  leaveGame(socket, payload) {
    socket.emit("leave_game", payload);
  },
  onLeaveGame(socket, callback) {
    socket.on("on_leave_game", callback);
  },
};
