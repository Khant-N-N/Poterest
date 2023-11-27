import mongoose from "mongoose";
import "dotenv/config";
import app from "./app";
import env from "./utils/ValidEnv";

mongoose
  .connect(env.MONGO_CONNECT!)
  .then(() => {
    console.log("mongodb connected");
    app.listen(env.PORT, () => {
      console.log("server is running on " + env.PORT);
    });
  })
  .catch(console.error);
