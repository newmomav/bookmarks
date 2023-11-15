import express from "express";
import dotenv from "dotenv";
dotenv.config();
import "./utils/mongodb.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import { logger } from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT;

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on port:${PORT}`);
});
