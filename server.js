const { Server } = require("socket.io");
const express = require("express");
const {createServer} = require("https");
const fs = require("fs");

// express server
const app = express();

const key = fs.readFileSync("./certificates/cert.key");
const cert = fs.readFileSync("./certificates/cert.crt");

// HTTP server
const server = createServer(
  {
    key: key,
    cert: cert,
    cors: {
      origin: [
        "https://192.168.22.131",
        "https://localhost",
        "https://web-dev-tasks-server.onrender.com",
      ],
    },
  },
  app
);
// Socket io server
const io = new Server(server, {
  cors: {
    origin: [
      "https://192.168.22.131:5173",
      "https://localhost:5173",
      "https://web-dev-tasks-server.onrender.com",
    ],
    methods: ["GET", "POST"],
  },
});

let availableOffers = [];
let connectedUsers = []

// Socket connection
io.on("connection", (socket) => {
  // console.log(io.engine.clientsCount);
  console.log("User connected", socket.handshake.auth.userName);

  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("send", (data) => {
    io.to(data.room).emit("receive", {
      text: data.text,
      by: data.by,
      time: data.time,
    });
  });

  // socket for webRTC
  connectedUsers.push({
    id: socket.id,
    name: socket.handshake.auth.userName,
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.handshake.auth.userName);
    connectedUsers = connectedUsers.filter((user) => user.id !== socket.id);
    availableOffers = availableOffers.filter((offer) => offer.socketId !== socket.id);
  });

  io.emit('getAvailableOffers',availableOffers)

  socket.on('newOffer',(data) => {
    availableOffers.push(data);
    socket.broadcast.emit('newOfferAwaiting', data);
  })


});

io.on("connection_error", (err) => {
  console.log(err);
});

// Express functions (REST API's)
app.get("/", (req, res) => {
  res.send("Hello World");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
