import { Router } from "express";
import UserToken from "../models/UserToken.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import verifyRefreshToken from "../utils/verifyRefreshToken.js";
import { refreshTokenBodyValidation } from "../utils/validationSchema.js";
import doHttpLog from "../utils/httpLogger.js";
import crypto from "crypto";
import logger from "../services/logger.service.js";
import { enviromentConfig } from "../config/enviromentConfig.js";

const router = Router();

/**
 * POST /v1/auth/createNewAccessToken
 * @summary method to create a new acess token
 * @tags Athentication (Authenticated:false) - authentication related api endpoints
 * @param {object} request.body.required - password, email
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *   "refreshToken": "541t6ver7zc2974tes4erzz6+er4zrt3"
 * }
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
router.post("/createNewAccessToken", async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);
  const { error } = refreshTokenBodyValidation(req.body);
  if (error) {
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
    return res.status(400).json({ error: true, message: error.details[0].message });
  }

  let verifyMfaState = false;
  const checkTok = await UserToken.findOne({ token: req.body.refreshToken });
  if (checkTok) {
    const checkUs = await User.findById({ _id: checkTok.userId });
    if (checkUs) {
      verifyMfaState = checkUs.mfaVerified;
    }
  }

  verifyRefreshToken(req.body.refreshToken)
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
      };
      const accessToken = jwt.sign(payload, enviromentConfig.jwt.accessTokenPrivateKey, { expiresIn: "1m" });
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Access token created successfully", 200);
      res.status(200).json({
        error: false,
        accessToken,
        message: "Access token created successfully",
      });
    })
    .catch((err) => {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, err.message, 400);
      logger.error("API|refreshToken.js|/createNewAccessToken|" + err.message);
      res.status(400).json(err);
    });
});

/**
 * POST /v1/auth/logout
 * @summary method to logout
 * @tags Athentication (Authenticated:false) - authentication related api endpoints
 * @param {object} request.body.required - password, email
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *   "refreshToken": "sdg4ed8hr6d1bd6fz7hr4edf4hbdf4bn9df4"
 * }
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
router.post("/logout", async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);
    const { error } = refreshTokenBodyValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const userToken = await UserToken.findOne({ token: req.body.refreshToken });
    if (!userToken) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Logged Out Sucessfully", 200);
      return res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
    }

    const us = await User.findOne({ _id: userToken.userId });
    await userToken.remove();
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Logged Out Sucessfully", 200);
    if (us) {
      let upd = {
        mfaVerified: false,
      };
      await User.findByIdAndUpdate({ _id: us._id }, upd);
      logger.info("AUDIT | " + us.userName + " | Logged out sucessfully");
    }
    res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, err, 500);
    logger.error("API|refreshToken.js|/logout|" + err.message);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

export default router;
