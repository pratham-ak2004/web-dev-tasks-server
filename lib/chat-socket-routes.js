const socketIo = require("socket.io");

// Function to create socket for chat application
function createChatSocket(httpServer, corsConfig) {
  const io = new socketIo.Server(httpServer, corsConfig).of("/chat");

  io.on("connection", (socket) => {
    // socket connection/disconnection logs
    socket.join(socket.handshake.query.room || "public");
    console.log(
      `Socket connected to ${socket.handshake.query.room || "default public"}`
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

module.exports = createChatSocket;
