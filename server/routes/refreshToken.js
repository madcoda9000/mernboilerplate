import { Router } from "express"
import UserToken from "../models/UserToken.js"
import User from "../models/User.js"
import jwt from "jsonwebtoken"
import verifyRefreshToken from "../utils/verifyRefreshToken.js"
import { refreshTokenBodyValidation } from "../utils/validationSchema.js"
import doHttpLog from "../utils/httpLogger.js"
import crypto from "crypto"
import logger from "../services/logger.service.js"
import { enviromentConfig } from "../config/enviromentConfig.js"

const router = Router()

/**
 * GET /v1/auth/createNewAccessToken
 * @summary method to create a new acess token
 * @tags Athentication (Authenticated:false) - authentication related api endpoints
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "Access token created successfully",
 *  "accessToken": "v36z88r72u5tru4hbg5667i4671ni7"
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.get("/createNewAccessToken", async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex")
  doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip)

  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    doHttpLog(
      "RES",
      mid,
      req.method,
      req.originalUrl,
      req.ip,
      "Access Denied: No refreshToken cookie provided",
      401
    )
    return res
      .status(401)
      .json({ error: true, message: "Access Denied: No refreshToken cookie provided" })
  }

  let verifyMfaState = false
  let reqUser = null
  const checkTok = await UserToken.findOne({ token: refreshToken })
  if (checkTok) {
    reqUser = await User.findById({ _id: checkTok.userId })
    reqUser.password = ""
    reqUser.mfaToken = ""
    if (reqUser) {
      verifyMfaState = reqUser.mfaVerified
    }
  }

  verifyRefreshToken(refreshToken)
    .then(({ tokenDetails }) => {
      const payload = {
        _id: tokenDetails._id,
        firstName: tokenDetails.firstName,
        lastName: tokenDetails.lastName,
        userName: tokenDetails.userName,
        email: tokenDetails.email,
        roles: tokenDetails.roles,
        mfaEnabled: tokenDetails.mfaEnabled,
        mfaEnforced: tokenDetails.mfaEnforced,
        mfaVerified: verifyMfaState,
      }
      const accessToken = jwt.sign(payload, enviromentConfig.jwt.accessTokenPrivateKey, {
        expiresIn: "1m",
      })
      doHttpLog(
        "RES",
        mid,
        req.method,
        req.originalUrl,
        req.ip,
        "Access token created successfully",
        200
      )

      // Set HTTP-only cookie with the access token
      let mdate = new Date()
      mdate.setTime(mdate.getTime() + 1 * 60 * 1000)
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // Set to true in production if using HTTPS
        sameSite: "strict", // Adjust as needed based on your application's requirements
        expires: mdate,
      })

      res.status(200).json({
        error: false,
        reqUser,
        message: "Access token created successfully",
      })
    })
    .catch((err) => {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, err.message, 400)
      logger.error("API|refreshToken.js|/createNewAccessToken|" + err.message)
      res.status(400).json(err)
    })
})

/**
 * GET /v1/auth/logout
 * @summary method to logout
 * @tags Athentication (Authenticated:false) - authentication related api endpoints
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "Logged Out Sucessfully"
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.get("/logout", async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex")
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip)
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      doHttpLog(
        "RES",
        mid,
        req.method,
        req.originalUrl,
        req.ip,
        "Access Denied: No refreshToken cookie provided",
        401
      )
      return res
        .status(401)
        .json({ error: true, message: "Access Denied: No refreshToken cookie provided" })
    }

    const userToken = await UserToken.findOne({ token: refreshToken })
    if (!userToken) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Logged Out Sucessfully", 200)
      return res.status(200).json({ error: false, message: "Logged Out Sucessfully" })
    }

    const us = await User.findOne({ _id: userToken.userId })
    await userToken.deleteOne()
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Logged Out Sucessfully", 200)
    if (us) {
      let upd = {
        mfaVerified: false,
      }
      await User.findByIdAndUpdate({ _id: us._id }, upd)
      logger.info("AUDIT | " + us.userName + " | Logged out sucessfully")
    }
    res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({ error: false, message: "Logged Out Sucessfully" })
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, err, 500)
    logger.error("API|refreshToken.js|/logout|" + err.message)
    res.status(500).json({ error: true, message: "Internal Server Error" })
  }
})

export default router
