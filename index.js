// Library imports
const express = require("express");
const https = require("https"); // user http or https library as required
const { readFileSync } = require("fs");
const cors = require("cors");
const { corsConfig } = require('./lib/config')

// user initialization
const PORT = 3000;
const createChatSocket = require("./lib/chat-socket-routes");
const createWebRTCSocket = require('./lib/webRTC-routes')

// Express app initialization
const app = express({
  cors: ["*"],
})
  .use(cors())
  .use(require("./lib/api-routes"));

//  HTTPS server initialization
const server = https.createServer(
  {
    key: readFileSync("./certificates/cert.key"),
    cert: readFileSync("./certificates/cert.crt"),
  },
  app
); // pass app at the last after specifying the certificates

// Socket initializtion
const ioChat = createChatSocket(server , corsConfig);
const ioWebRTC = createWebRTCSocket(server.corsConfig)

// Start server
server.listen(PORT || 3000, () => {
  console.log("Server Listening to Port : ", PORT || 3000);
});
