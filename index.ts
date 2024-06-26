// Library imports
import express from "express";
// import https from 'https' // user http or https library as required
import http from 'http'
import { readFileSync } from "fs";
import cors from 'cors'
import { corsConfig } from "./lib/config";
import { Server } from "socket.io";

// user initialization
const PORT = 3000;
import { createChatSocket } from "./lib/chat-socket-routes";
import { createWebRTCSocket } from "./lib/webRTC-routes";
import { createWebRTCStream } from "./lib/webRTC-stream-routes";
import { router } from "./lib/api-routes";

// Express app initialization
const app = express()
  .use(cors(corsConfig))
  .use(router);

//  HTTPS server initialization
const server = http.createServer(
  // {
  //   key: readFileSync("./certificates/cert.key"),
  //   cert: readFileSync("./certificates/cert.crt"),
  // },
  app
); // pass app at the last after specifying the certificates

// Socket initializtion
const socketServer = new Server(server, {cors : corsConfig});
const ioChat = createChatSocket(socketServer);
const ioWebRTC = createWebRTCSocket(socketServer);
const ioWebRTCWebCall = createWebRTCStream(socketServer);

// Start server
server.listen(PORT , () => {
  console.log("Server Listening to Port : ", PORT );
});