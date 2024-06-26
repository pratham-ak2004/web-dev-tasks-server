import { CorsOptions, CorsOptionsDelegate } from "cors";

export const corsConfig: CorsOptions | CorsOptionsDelegate = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    const origins = [
      "https://web-dev-tasks.vercel.app",
      "https://localhost:5173",
      "https://192.168.22.131:5173",
    ];
    if (!origin || origins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  methods: ["GET", "POST"],
};

export const peerConfiguration = {
  key: "value",
};
