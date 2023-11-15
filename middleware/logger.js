import format from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";

const newUuid = uuid();
const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";

export const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH_mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

export const logger = (req, res, next) => {
  // if (req.headers.origin && req.headers.origin !== SERVER_URL){

  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  //   }
  next();
};
