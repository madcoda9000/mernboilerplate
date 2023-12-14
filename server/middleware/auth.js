import jwt from "jsonwebtoken";
import doHttpLog from "../utils/httpLogger.js";
import crypto from "crypto";

const auth = async (req, res, next) => {
	const mid = crypto.randomBytes(16).toString("hex");
	const token = req.header("x-access-token");
	if (!token) {
		doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"Access Denied: No token provided",401);
		return res
			.status(401)
			.json({ error: true, message: "Access Denied: No token provided" });	
	}

	try {
		const tokenDetails = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_PRIVATE_KEY
		);
		req.user = tokenDetails;
		next();
	} catch (err) {
		doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"Access Denied: Invalid token",401);
		console.log(err);
		res
			.status(401)
			.json({ error: true, message: "Access Denied: Invalid token" });
	}
};

export default auth;
