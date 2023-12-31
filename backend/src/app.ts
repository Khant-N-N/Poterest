import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import userRouter from "./routes/user.route";
import chatRouter from "./routes/chat.route";
import MongoStore from "connect-mongo";
import session from "express-session";
import env from "./utils/ValidEnv";
import postRouter from "./routes/post.route";
import { requireAuth } from "./utils/auth";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(
  cors({
    origin: ["http://localhost:5173" || ""],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // enable credentials (cookies, authorization headers, etc.)
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.use(
  session({
    name: "poterest_kies",
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECT,
    }),
    cookie: {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      // sameSite: "none",
      // secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use("/api/user", userRouter);
app.use("/api/posts", requireAuth, postRouter);

const chatNameSpace = io.of("/chat");

chatNameSpace.on("connection", (sock) => {
  console.log("User connected to the chat");

  sock.emit("welcome", { message: "Welcome to the chat!" });

  sock.on("disconnect", () => {
    console.log("User disconnected from the chat");
  });
});

app.use("/api/chat", requireAuth, chatRouter);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error has occured";
  let status = 500;
  if (isHttpError(error)) {
    status = error.status;
    errorMessage = error.message;
  }
  res.status(status).json({ error: errorMessage });
});

export { io };
export default app;
