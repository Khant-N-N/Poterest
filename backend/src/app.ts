import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import userRouter from "./routes/user.route";
import MongoStore from "connect-mongo";
import session from "express-session";
import env from "./utils/ValidEnv";
import postRouter from "./routes/post.route";
import { requireAuth } from "./utils/auth";

const app = express();

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

export default app;
