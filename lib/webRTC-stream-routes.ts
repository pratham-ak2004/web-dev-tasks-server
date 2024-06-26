import { type Socket, type Server } from "socket.io";

type user = {
  id: string;
  socketId: string;
  // type : offerer or answerer
};

type call = {
  id: string;
  offerer: user;
  answerer: user;
  offer: RTCSessionDescription;
  offerIceCandidates: RTCIceCandidate[];
  answer: RTCSessionDescription;
  answereIceCandidates: RTCIceCandidate[];
};

function createWebRTCStream(socketServer: Server) {
  const io = socketServer.of("/video-call");

  const users: user[] = [];
  const calls: call[] = [];

  io.on("connection", (socket: Socket) => {
    console.log("Socket connected : " , socket.id);

    socket.on('disconnect',(reason) => {
      console.log("Socket disconnected : " , socket.id , " Reason : " , reason);
    })
    
  });
}

export { createWebRTCStream }