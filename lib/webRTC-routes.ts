import { type Server } from "socket.io";

// Function to create socket for webRTC application
function createWebRTCSocket(socketServer:Server) {
  const io = socketServer.of("/stream");

  let users:any = [];
  let offers:any = [];
  let iceCandidates:any = [];

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
      users = users.filter((user:any) => user.socketId !== socket.id);
      offers = offers.filter((offer:any) => offer.socketId !== socket.id)
      iceCandidates = iceCandidates.filter((iceCandidate:any) => iceCandidate.socketId !== socket.id)
    });

    // socket functions
    // Get preivous offers
    io.emit('getPreviousOffers' , offers.filter((offer:any) => offer.room === (socket.handshake.query.room || "public")))

    socket.on("newOffer", (data) => {
      offers.push({ ...data, socketId: socket.id , room : socket.handshake.query.room || "public" });
      socket.to(socket.handshake.query.room || "public").emit("getOffer", data);
    });

    socket.on('newIceCandidate' , (data) => {
      iceCandidates.push({ ...data, socketId: socket.id , room : socket.handshake.query.room || "public" });
      io.emit('getIceCandidates' , iceCandidates.filter((iceCandidate:any) => iceCandidate.socketId === data.socketId && iceCandidate.room === (socket.handshake.query.room || "public")))
    })

    socket.on('newAnswer',(data) => {
      io.to(data.to).emit('getAnswer' , {...data, socketId : socket.id , room : socket.handshake.query.room || "public"})
    })

    socket.on("getIceCandidates",(data)=> {
      const payload = iceCandidates.filter((iceCandidate:any) => iceCandidate.socketId === data.socketId)
      io.to(socket.id).emit("receiveIceCandidate" , payload)
    });
  });

  return io;
}

export { createWebRTCSocket }