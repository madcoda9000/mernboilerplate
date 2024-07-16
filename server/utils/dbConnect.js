import mongoose from "mongoose"
import logger from "../services/logger.service.js"
import { enviromentConfig } from "../config/enviromentConfig.js"

const dbConnect = () => {
  const connectionParams = { useNewUrlParser: true }
  mongoose.set("strictQuery", false)

  let connStr =
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
    enviromentConfig.database.authSource
  mongoose.connect(connStr)

  mongoose.connection.on("connected", () => {
    logger.info("DATABASE | Connected to database sucessfully")
  })

  mongoose.connection.on("error", (err) => {
    logger.error("DATABASE | Error while connecting to database :" + err)
  })

  mongoose.connection.on("disconnected", () => {
    logger.info("DATABASE | Mongodb connection disconnected")
  })
}

export default dbConnect
