const corsConfig = {
  cors: {
    origin: [
      "https://192.168.22.131:5173",
      "https://localhost:5173",
      "https://web-dev-tasks-server.onrender.com",
    ],
    methods: ["GET", "POST"],
  },
};

const peerConfiguration = {
    "key" : "value"
}

module.exports = [ corsConfig , peerConfiguration ]