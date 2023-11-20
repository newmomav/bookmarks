import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { logEvents } from "../middleware/logger.js";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(() => console.log("Connection error"));

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
