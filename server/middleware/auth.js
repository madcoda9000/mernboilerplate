import jwt from "jsonwebtoken"
import doHttpLog from "../utils/httpLogger.js"
import crypto from "crypto"
import { enviromentConfig } from "../config/enviromentConfig.js"
import logger from "../services/logger.service.js"

// Cache the access token key
const { accessTokenPrivateKey } = enviromentConfig.jwt

/**
 * @description Middleware to authenticate the user using JWT from cookies.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const auth = async (req, res, next) => {
  const mid = crypto.randomBytes(16).toString("hex")
  const accToken = req.cookies.accessToken

  if (!accToken) {
    const message = "Access Denied: No token cookie provided"
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, message, 401)
    return res.status(401).json({ error: true, message })
  }

  try {
    const tokenDetails = jwt.verify(accToken, accessTokenPrivateKey)
    req.user = tokenDetails
    next()
  } catch (err) {
    logger.error("SERVER | Cookie token verification failed.", err)
    const message = "Access Denied: Invalid cookie token"
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, message, 401)
    return res.status(401).json({ error: true, message })
  }
}

export default auth
