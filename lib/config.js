const corsConfig = {
  cors: {
    origin:
    (origin , callback) => {
      const origins = ["https://web-dev-tasks.vercel.app" , "https://localhost:5173" , "https://192.168.22.131:5173"];
      if(!origin || origins.indexOf(origin) !== -1 ){
        callback(null , true)
      }else{
        callback(new Error("Not allowed by CORS"))
      }
    },
    methods: ["GET", "POST"],
  },
};

const peerConfiguration = {
    "key" : "value"
}

module.exports = { corsConfig , peerConfiguration }