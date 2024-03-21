export default {
  closeRoom(socket) {
    socket.emit("close_room");
  },
};
