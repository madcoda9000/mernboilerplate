import winston from "winston";
import dotenv from "dotenv";
import "winston-mongodb";
import { enviromentConfig } from "../config/enviromentConfig.js";

dotenv.config();

const { combine, timestamp, printf, colorize, metadata, errors } = winston.format;
const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});
const connStr =
  "mongodb://" +
  enviromentConfig.database.userName +
  ":" +
  enviromentConfig.database.password +
  "@" +
  enviromentConfig.database.host +
  ":" +
  enviromentConfig.database.port +
  "/" +
  enviromentConfig.database.dbName +
  "?authSource=" +
  enviromentConfig.database.authSource;

// create transports array
const transArr = [];

// define console colors
winston.addColors({
  error: "red",
  warn: "yellow",
  info: "cyan",
  http: "magenta",
  verbose: "grey",
  debug: "grey",
  silly: "grey",
});

// add file transport
if (enviromentConfig.app.enableFileLog === "true") {
  transArr.push(
    new winston.transports.File({
      level: "silly",
      filename: "./logs/app.log",
      handleExceptions: true,
      json: false,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
      timestamp: function () {
        return new Date().toLocaleTimeString();
      },
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        printf((log) => `[${log.timestamp}] ${log.level}: ${log.message}`)
      ),
    })
  );
}

// add console transport
if (enviromentConfig.app.enableConsoleLog === "true") {
  transArr.push(
    new winston.transports.Console({
      level: "silly",
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: function () {
        return new Date().toLocaleTimeString();
      },
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        printf((log) => `[${log.timestamp}] ${log.level}: ${log.message}`)
      ),
    })
  );
}

// add database transport
if (enviromentConfig.app.enableDbLog === "true") {
  transArr.push(
    new winston.transports.MongoDB({
      level: "silly",
      db: connStr,
      options: { useUnifiedTopology: true },
      collection: "logs",
      capped: false,
      expireAfterSeconds: 2592000,
      leaveConnectionOpen: false,
      storeHost: true,
      colorize: false,
      timestamp: function () {
        return new Date().toLocaleTimeString();
      },
      format: combine(errors({ stack: true }), timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }), metadata()),
    })
  );
}

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: transArr,
  exceptionHandlers: [new winston.transports.File({ filename: "./logs/exceptions.log" })],
  exitOnError: false,
});

export default logger;
