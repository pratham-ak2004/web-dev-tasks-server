const socketIo = require("socket.io");

// Function to create socket for webRTC application
function createWebRTCSocket(httpServer, corsConfig) {
  const io = new socketIo.Server(httpServer, corsConfig).of("/stream");

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
  });

  return io;
}

module.exports = createWebRTCSocket;
