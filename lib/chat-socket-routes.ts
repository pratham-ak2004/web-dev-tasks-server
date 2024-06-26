import { type Server } from "socket.io";

// Function to create socket for chat application
function createChatSocket(socketServer:Server) {
  const io = socketServer.of("/chat");

  io.on("connection", (socket) => {
    // socket connection/disconnection logs
    socket.join(socket.handshake.query.room || "public");
    console.log(
      `Chat socket connected to ${socket.handshake.query.room || "default public"}`
    );

    socket.on("disconnect", () => {
      console.log(
        `Socket disconnected from ${
          socket.handshake.query.room || "default public"
        }`
      );
    });

    // socket functions
    socket.on("send", (data) => {
      io.to(socket.handshake.query.room || "public").emit("receive", data);
    });
  });

  return io;
}

export { createChatSocket }