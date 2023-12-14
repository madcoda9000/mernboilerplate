import mongoose from "mongoose";
import logger from "../services/logger.service.js";

const dbConnect = () => {
	const connectionParams = { useNewUrlParser: true };
	mongoose.set('strictQuery', false);
	
	let connStr = "mongodb://" + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PASSWORD + "@" + process.env.MONGO_HOST + ":" + process.env.MONGO_PORT + "/" + process.env.MONGO_DB_NAME + "?authSource=" + process.env.MONGO_AUTHSOURCE;
	mongoose.connect(connStr, connectionParams);

	mongoose.connection.on("connected", () => {
		logger.info("DATABASE | Connected to database sucessfully");
	});

	mongoose.connection.on("error", (err) => {
		logger.error("DATABASE | Error while connecting to database :" + err);
	});

	mongoose.connection.on("disconnected", () => {
		logger.info("DATABASE | Mongodb connection disconnected");
	});
};

export default dbConnect;
