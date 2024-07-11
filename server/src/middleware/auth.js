import jwt from "jsonwebtoken"
import doHttpLog from "../utils/httpLogger.js"
import crypto from "crypto"
import { enviromentConfig } from "../config/enviromentConfig.js"
import logger from "../services/logger.service.js"

const auth = async (req, res, next) => {
  const mid = crypto.randomBytes(16).toString("hex")
  const token = req.header("x-access-token")
  const accToken = req.cookies.accessToken

  if (!accToken) {
    doHttpLog(
      "RES",
      mid,
      req.method,
      req.originalUrl,
      req.ip,
      "Access Denied: No token cookie provided",
      401
    )
    return res.status(401).json({ error: true, message: "Access Denied: No token cookie provided" })
  }

  try {
    const tokenDetails = jwt.verify(accToken, enviromentConfig.jwt.accessTokenPrivateKey)
    req.user = tokenDetails

    //logger.info("SERVER | Cookie token verified successfully");

    next()
  } catch (err) {
    logger.error("SERVER | Cookie token verification failed.")
    doHttpLog(
      "RES",
      mid,
      req.method,
      req.originalUrl,
      req.ip,
      "Access Denied: Invalid cookie token",
      401
    )
    console.log(err)
    res.status(401).json({ error: true, message: "Access Denied: Invalid cookie token" })
  }
  /*
  if (!token) {
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Access Denied: No token provided", 401);
    return res.status(401).json({ error: true, message: "Access Denied: No token provided" });
  }

  try {
    const tokenDetails = jwt.verify(token, enviromentConfig.jwt.accessTokenPrivateKey);
    req.user = tokenDetails;
    next();
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Access Denied: Invalid token", 401);
    console.log(err);
    res.status(401).json({ error: true, message: "Access Denied: Invalid token" });
  }
  */
}

export default auth
