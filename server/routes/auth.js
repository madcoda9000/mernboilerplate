import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateTokens from "../utils/generateTokens.js";
import { signUpBodyValidation, logInBodyValidation, confirmEmailValidation } from "../utils/validationSchema.js";
import doHttpLog from "../utils/httpLogger.js";
import auth from "../middleware/auth.js";
import crypto from "crypto";
import { SendConfirmMail } from "../utils/mailSender.js";
import logger from "../services/logger.service.js";
import * as OTPAuth from "otpauth";
import * as base32 from "hi-base32";

const router = Router();

const generateRandomBase32 = () => {
  const buffer = crypto.randomBytes(15);
  const bbase32 = base32.default.encode(buffer).replace(/=/g, "").substring(0, 24);
  return bbase32;
};

/**
 * POST /v1/auth/startMfaSetup
 * @summary method to setup 2fa for a user
 * @tags Athentication (Authenticated:true | Role:any) - authentication related api endpoints
 * @param {object} request.body.required
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *   "_id": "32645543466443664456"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "OTP for user 364654646798974 generated successfully",
 *  "base32": "6465f6hf+j5gf+j5",
 *  "otpUrl": "otp://xxxxxxx"
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.post("/startMfaSetup", auth, async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    if (req.body._id === null) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "The id parameter is required!", 400);
      return res.status(400).json({ error: true, message: "The User id is required!" });
    }

    const user = await User.findOne({ _id: req.body._id });

    if (!user) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "No user with id " + req.body._id + " exist!", 400);
      return res.status(400).json({ error: true, message: "No user with id " + req.body._id + " exist!" });
    }

    const base32_secret = generateRandomBase32();

    let totp = new OTPAuth.TOTP({
      issuer: process.env.APPLICATION_COMPANYNAME,
      label: process.env.APPLICATION_SWAGGER_APPNAME,
      algorithm: "SHA1",
      digits: 6,
      secret: base32_secret,
    });

    let otpauth_url = totp.toString();

    const update = {
      mfaToken: base32_secret,
    };

    let erg = await User.findByIdAndUpdate({ _id: req.body._id }, update);
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "OTP for user " + req.body._id + " generated successfully", 400);
    res.status(200).json({
      error: false,
      message: "OTP for user " + req.body._id + " generated successfully",
      base32: base32_secret,
      otpUrl: otpauth_url,
    });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|auth.js|/startMfaSetup|" + err.message);
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
});

/**
 * POST /v1/auth/finishMfaSetup
 * @summary method to finish users sfa setup
 * @tags Athentication (Authenticated:true | Role:any) - authentication related api endpoints
 * @param {object} request.body.required
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *   "_id": "32645543466443664456",
 *   "token": "00a6fa25-df29-4701-9077-557932591766"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "john.doe verified by 2fa successfully"
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.post("/finishMfaSetup", auth, async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    if (req.body._id === null) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "The id parameter is required!", 400);
      return res.status(400).json({ error: true, message: "The User id is required!" });
    }
    if (req.body.otpToken === null) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "The otpToken parameter is required!", 400);
      return res.status(400).json({ error: true, message: "The User otpToken is required!" });
    }
    const token = req.body.token;
    const user = await User.findById({ _id: req.body._id });

    if (!user) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "No user with id " + req.body._id + " exist!", 400);
      return res.status(400).json({ error: true, message: "No user with id " + req.body._id + " exist!" });
    }

    let totp = new OTPAuth.TOTP({
      issuer: process.env.APPLICATION_COMPANYNAME,
      label: process.env.APPLICATION_SWAGGER_APPNAME,
      algorithm: "SHA1",
      digits: 6,
      secret: user.mfaToken,
    });

    let delta = totp.validate({ token });

    if (delta === null) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "OTP Token is invalid!", 200);
      return res.status(200).json({
        error: true,
        message: "OTP Token is invalid!",
      });
    }

    const update = {
      mfaEnabled: true,
      mfaVerified: true,
      mfaEnforced: false,
    };
    await User.findByIdAndUpdate({ _id: user._id }, update);

    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, user.userName + " finished 2fa setup successfully", 200);
    res.status(200).json({
      error: false,
      message: user.userName + " finished 2fa setup successfully",
    });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|auth.js|/finishMfaSetup|" + err.message);
    console.log(err);
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
});

/**
 * POST /v1/auth/validateOtp
 * @summary method to validate a otp token
 * @tags Athentication (Authenticated:true | Role:any) - authentication related api endpoints
 * @param {object} request.body.required
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *   "_id": "32645543466443664456",
 *   "token": "00a6fa25-df29-4701-9077-557932591766"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "john.doe verified by 2fa successfully"
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.post("/validateOtp", auth, async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    if (req.body._id === null) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "The id parameter is required!", 400);
      return res.status(400).json({ error: true, message: "The User id is required!" });
    }
    if (req.body.otpToken === null) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "The otpToken parameter is required!", 400);
      return res.status(400).json({ error: true, message: "The User otpToken is required!" });
    }
    const { user_id, token } = req.body;
    const user = await User.findOne({ _id: req.body._id });

    if (!user) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "No user with id " + req.body._id + " exist!", 400);
      return res.status(400).json({ error: true, message: "No user with id " + req.body._id + " exist!" });
    }

    let totp = new OTPAuth.TOTP({
      issuer: process.env.APPLICATION_COMPANYNAME,
      label: process.env.APPLICATION_SWAGGER_APPNAME,
      algorithm: "SHA1",
      digits: 6,
      secret: user.mfaToken,
    });

    let delta = totp.validate({ token });

    if (delta === null) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "OTP Token is invalid!", 200);
      return res.status(200).json({
        error: true,
        message: "OTP Token is invalid!",
      });
    }

    const update = {
      mfaVerified: true,
    };
    await User.findByIdAndUpdate({ _id: req.body._id }, update);

    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, user.userName + " verified by 2fa successfully", 200);
    res.status(200).json({
      error: false,
      message: user.userName + " verified by 2fa successfully",
    });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|auth.js|/validateOtp|" + err.message);
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
});

/**
 * POST /v1/auth/confirmEmail
 * @summary method to confirm a new users email address
 * @tags Athentication (Authenticated:false) - authentication related api endpoints
 * @param {object} request.body.required
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *   "_id": "32645543466443664456",
 *   "email": "user.name@domain.com",
 *   "token": "00a6fa25-df29-4701-9077-557932591766"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "Email address confirmed successfully"
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.post("/confirmEmail", async (req, res) => {
  console.log(req.body);
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    const { error } = confirmEmailValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const mailuser = await User.findOne({ email: req.body.email });
    if (!mailuser) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User with given email does not exist", 400);
      return res.status(400).json({ error: true, message: "User with given email does not exist" });
    }

    if (mailuser.emailVerifyToken !== req.body.token) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Confirmation token is invalid!", 400);
      return res.status(400).json({ error: true, message: "Confirmation token is invalid!" });
    }

    if (mailuser.email !== req.body.email) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Invalid email address!", 400);
      return res.status(400).json({ error: true, message: "Invalid email address" });
    }

    // update user properties
    const update = {
      emailVerifyToken: "",
      emailVerified: true,
      accountLocked: false,
    };

    await User.findByIdAndUpdate({ _id: req.body._id }, update);
    logger.info("AUDIT | " + req.body.email + " | confirmed email sucessfully");
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Account " + req.body.email + " confirmed email sucessfully", 200);
    res.status(200).json({ error: false, message: "Account " + req.body.email + " confirmed email sucessfully" });
  } catch (err) {
    console.log(err);
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|auth.js|/confirmEmail|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /v1/auth/signup
 * @summary method to register a new user
 * @tags Athentication (Authenticated:false) - authentication related api endpoints
 * @param {object} request.body.required - username, password, email
 * @return {object} 201 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "userName": "user.name",
 *   "email": "user.name@domain.com",
 *   "password": "P@ssW0rd!"
 * }
 * @example response - 201 - example success response
 * {
 * 	"error": false,
 *  "message": "Account created successfully"
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.post("/signUp", async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);
    const { error } = signUpBodyValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const mailuser = await User.findOne({ email: req.body.email });
    if (mailuser) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User with given email already exist", 400);
      return res.status(400).json({ error: true, message: "User with given email already exist" });
    }

    const nameuser = await User.findOne({ userName: req.body.userName });
    if (nameuser) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User with given username already exist", 400);
      return res.status(400).json({ error: true, message: "User with given username already exist" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword, emailVerifyToken: crypto.randomUUID(), accountLocked: true }).save();
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Account " + req.body.email + " created sucessfully", 201);
    logger.info("AUDIT | " + req.body.userName + " | registered a new account sucessfully");
    const createdUser = await User.findOne({ email: req.body.email });
    await SendConfirmMail(createdUser);

    res.status(201).json({ error: false, message: "Account " + req.body.email + " created sucessfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, err, 500);
    logger.error("API|auth.js|/signUp|" + err.message);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

/**
 * POST /v1/auth/login
 * @summary method to login
 * @tags Athentication (Authenticated:false) - authentication related api endpoints
 * @param {object} request.body.required - password, email
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @return {object} 401 - Unauthorized Request - application/json
 * @example request - example payload
 * {
 *   "userName": "user.name",
 *   "password": "P@ssW0rd!"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "logged in successfully!.",
 *  "accessToken": "n34olhtohto5zhnb4o5zuhn54ouhn54",
 *  "refreshToken": "g645z454641uh6446654u566466j4",
 *  "user": {
 *  "_id": "dfg5dh46f54nf56g64g4nf64mn",
 *  "firstName": "John",
 *  "lastName": "Doe",
 *  "userName": "user.name",
 *  "email": "user.name@domain.com",
 *  "password": "f6ec8t7c445564z4e7z495727r74z",
 *  "roles": [
 *  "user",
 *  "anotherRole"
 *  ]
 *  }
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "Invalid username or password"
 * }
 * @example response - 401 - example error message
 * {
 *   "error": true,
 *   "message": "Invalid username or password"
 * }
 */
router.post("/logIn", async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);
    const { error } = logInBodyValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const user = await User.findOne({ userName: req.body.userName });
    if (!user) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Invalid username or password", 401);
      return res.status(401).json({ error: true, message: "Invalid username or password" });
    }

    if (user.pwResetToken.trim() !== "") {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "There is an open password reset request.", 401);
      return res.status(401).json({
        error: true,
        message: "Your account is locked currently due to an open password reset request! Please finish your password reset or contact your administrator.",
      });
    }

    if (user.accountLocked === true) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Account locked.", 401);
      return res.status(401).json({ error: true, message: "Your account is locked! Please contact your administrator." });
    }

    const verifiedPassword = await bcrypt.compare(req.body.password, user.password);
    if (!verifiedPassword) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Invalid username or password", 401);
      return res.status(401).json({ error: true, message: "Invalid username or password" });
    }

    const update = {
      mfaVerified: false,
    };
    await User.findByIdAndUpdate({ _id: user._id }, update);

    const { accessToken, refreshToken } = await generateTokens(user);
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, req.body.userName + " logged in sucessfully", 200);
    res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      user,
      message: "Logged in sucessfully",
    });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, err, 500);
    logger.error("API|auth.js|/login|" + err.message);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

export default router;
