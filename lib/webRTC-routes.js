// Function to create socket for webRTC application
function createWebRTCSocket(socketServer, corsConfig) {
  const io = socketServer.of("/stream");

  let users = [];
  let offers = [];
  let iceCandidates = [];

  io.on("connection", (socket) => {
    // socket connection/disconnection logs
    socket.join(socket.handshake.query.room || "public");
    console.log(
      `WebRTC socket connected to ${
        socket.handshake.query.room || "default public"
      }`
    );
    users.push({
      socketId: socket.id,
      room: socket.handshake.query.room || "public",
      userName: socket.handshake.auth.userName || "Anonymus",
    });

    socket.on("disconnect", () => {
      console.log(
        `Socket disconnected from ${
          socket.handshake.query.room || "default public"
        }`
      );
      users = users.filter((user) => user.socketId !== socket.id);
      offers = offers.filter((offer) => offer.socketId !== socket.id)
      iceCandidates = iceCandidates.filter((iceCandidate) => iceCandidate.socketId !== socket.id)
    });

    // socket functions
    // Get preivous offers
    io.emit('getPreviousOffers' , offers.filter((offer) => offer.room === (socket.handshake.query.room || "public")))

    socket.on("newOffer", (data) => {
      offers.push({ ...data, socketId: socket.id , room : socket.handshake.query.room || "public" });
      socket.to(socket.handshake.query.room).emit("getOffer", data);
    });

    socket.on('newIceCandidate' , (data) => {
      iceCandidates.push({ ...data, socketId: socket.id , room : socket.handshake.query.room || "public" });
      io.emit('getIceCandidates' , iceCandidates.filter((iceCandidate) => iceCandidate.socketId === data.socketId && iceCandidate.room === (socket.handshake.query.room || "public")))
    })

    socket.on('newAnswer',(data) => {
      io.to(data.to).emit('getAnswer' , {...data, socketId : socket.id , room : socket.handshake.query.room || "public"})
    })

    socket.on("getIceCandidates",(data)=> {
      const payload = iceCandidates.filter((iceCandidate) => iceCandidate.socketId === data.socketId)
      io.to(socket.id).emit("receiveIceCandidate" , payload)
    });
  });

  return io;
}

module.exports = createWebRTCSocket;
