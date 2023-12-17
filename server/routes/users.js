import { Router } from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import roleCheck from "../middleware/roleCheck.js";
import doHttpLog from "../utils/httpLogger.js";
import crypto from "crypto";
import {
  createUserValidation,
  deleteUserValidation,
  updateUserValidation,
  patchUserEmailValidation,
  changePasswordValidation,
  forgotpw2Validation,
  unenforceMfaValidation,
  disableMfaValidation,
} from "../utils/validationSchema.js";
import bcrypt, { hash } from "bcrypt";
import logger from "../services/logger.service.js";
import { sendPwResetMail } from "../utils/mailSender.js";

const router = Router();

/**
 * POST /v1/users/forgotPw2
 * @summary method to finish a password reset for a user
 * @tags Users (Authenticated:false) - users related api endpoints
 * @param {object} request.body.required - the new password
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "email": "john.doe@mail.com",
 *  "token": "s6gd4ds654ghd64hdf64hfg6jgf4u7958tr7h8trf",
 *  "password": "&%$Rbkjbkb)(654dfsgf)"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "Your password was changed successfully!"
 * }
 * @example response - 500 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.post("/forgotPw2", async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    const { error } = forgotpw2Validation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const us = await User.findOne({ email: req.body.email });
    if (!us) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User with " + req.body.email + " not found", 200);
      return res.status(200).json({ error: true, message: "User with " + req.body.email + " not found" });
    }

    console.log(us.pwResetToken);
    console.log(req.body.token);
    if (us.pwResetToken !== req.body.token) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Invalid reset token!", 200);
      return res.status(200).json({ error: true, message: "Invalid reset token!" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const update = {
      password: hashPassword,
      accountLocked: false,
      pwResetToken: "",
    };
    await User.findByIdAndUpdate({ _id: us._id }, update);
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Account " + us.userName + " resetted password sucessfully", 201);
    res.status(201).json({ error: false, message: "Account " + us.userName + " resetted password sucessfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|users.js|/forgotPw2|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /v1/users/forgotPw1
 * @summary method to initiate a password reset for a user
 * @tags Users (Authenticated:false) - users related api endpoints
 * @param {object} request.body.required - the email address
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "email": "john.doe@mail.com"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "Account deactivated. Please take a look into your inbox"
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.post("/forgotPw1", async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    if (req.body.email === undefined || req.body.email === null) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "The email parameter is required!", 400);
      return res.status(400).json({ error: true, message: "The email parameter is required!" });
    }

    const user = await User.findOne({ email: req.body.email });

    if (user && user.pwResetToken.trim() !== "") {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "There is an open password reset request.", 200);
      return res.status(200).json({
        error: true,
        message: "Your account is locked currently due to an open password reset request! Please finish your password reset or contact your administrator.",
      });
    }

    if (user) {
      const token = crypto.randomBytes(16).toString("hex");
      const update = {
        accountLocked: true,
        pwResetToken: token,
      };
      await User.findByIdAndUpdate({ _id: user._id }, update);
      await sendPwResetMail(user, token);
      doHttpLog(
        "RES",
        mid,
        req.method,
        req.originalUrl,
        req.ip,
        "Account deactivated, password reset mail sended successfully. Please take a look into your inbox.",
        200
      );
      res.status(200).json({ error: false, message: "Account deactivated, password reset mail sended successfully. Please take a look into your inbox." });
    } else {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "user user with email address " + req.body.email + " not found.", 200);
      res.status(200).json({ error: true, message: "user user with email address " + req.body.email + " not found." });
    }
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|users.js|/forgotPw1|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /v1/users/user/{userId}
 * @summary method to fetch user details
 * @tags Users (Authenticated:true | Role:any) - users related api endpoints
 * @param {string} userId.query - the users id
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "returned user details.",
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
 *  ],
 *  "emailVerifyToken": "",
 *  "pwResetToken": "",
 *  "mfaEnabled": false,
 *  "mfaEnforced": false,
 *  "accountLocked": false,
 *  "ldapEnabled": false
 *  }
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.get("/user/:userId", auth, async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    if (req.params.userId === undefined || req.params.userId === null) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "The userId parameter is required!", 400);
      return res.status(400).json({ error: true, message: "The userId parameter is required!" });
    }
    const user = await User.findOne({ _id: req.params.userId });
    if (user) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Returning User details.", 200);
      res.status(200).json({
        error: false,
        user: user,
        message: "returned user details!",
      });
    } else {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "user user with " + req.body.email + " not found.", 500);
      res.status(500).json({ message: "user user with " + req.body.email + " not found." });
    }
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|users.js|/user|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /v1/users/createUser
 * @summary method to create a new user
 * @tags Users (Authenticated:true | Role:admins) - users related api endpoints
 * @param {object} request.body.required - the user
 * @return {object} 201 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "firstName": "John",
 *  "lastName": "Doe",
 *  "userName": "user.name",
 *  "email": "user.name@domain.com",
 *  "password": "GreatPasswordHere!",
 *  "roles": ["role1","role2"],
 *  "mfaEnforced": false,
 *  "mfaEnabled": false,
 *  "ldapEnabled": false,
 * }
 * @example response - 201 - example success response
 * {
 * 	"error": false,
 *  "message": "user created successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.post("/createUser", auth, roleCheck("admins"), async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    const { error } = createUserValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const mailuser = await User.findOne({ email: req.body.email });
    if (mailuser) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Cannot create user. Email address exists already!", 400);
      res.status(400).json({
        error: true,
        message: "Cannot create user. Email address exists already!",
      });
    }

    const nameuser = await User.findOne({ userName: req.body.userName });
    if (nameuser) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Cannot create user. Username exists already!", 400);
      res.status(400).json({
        error: true,
        message: "Cannot create user. Username exists already!",
      });
    }

    // create a new user
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      password: hashPassword,
      roles: req.body.roles,
      mfaEnforced: req.body.mfaEnforced,
      mfaEnabled: false,
      ldapEnabled: req.body.ldapEnabled,
      emailVerified: req.body.emailVerified === null ? false : true,
    });
    await newUser.save();
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Account " + req.body.email + " created sucessfully", 201);
    res.status(201).json({ error: false, message: "Account " + req.body.email + " created sucessfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|users.js|/createUser|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /v1/users/deleteUser
 * @summary method to delete a user
 * @tags Users (Authenticated:true | Role:admins) - users related api endpoints
 * @param {object} request.body.required - the users id
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "_id": "46355473634654436576"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "user deleted successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.post("/deleteUser", auth, roleCheck("admins"), async (req, res) => {
  try {
    const mid = crypto.randomBytes(16).toString("hex");
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    const { error } = deleteUserValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const iduser = await User.findOne({ _id: req.body._id });
    if (!iduser) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User with id " + req.body._id + " not found!", 400);
      res.status(400).json({
        error: true,
        message: "User with id " + req.body._id + " not found!",
      });
    } else {
      await iduser.delete();
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User deleted sucessfully", 200);
      res.status(200).json({ error: false, message: "User deleted sucessfully" });
    }
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|users.js|/deleteUser|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT /v1/users/updateUser
 * @summary method to update a user
 * @tags Users (Authenticated:true | Role:admins) - users related api endpoints
 * @param {object} request.body.required - the user
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "_id": "3465644556734573541",
 *  "firstName": "John",
 *  "lastName": "Doe",
 *  "userName": "user.name",
 *  "email": "user.name@domain.com",
 *  "password": "",
 *  "roles": ["role1","role2"],
 *  "mfaEnforced": false,
 *  "mfaEnabled": false,
 *  "ldapEnabled": false
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "Account user.name@domain.com updated successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.put("/updateUser", auth, roleCheck("admins"), async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    const { error } = updateUserValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const iduser = await User.findOne({ _id: req.body._id });
    if (!iduser) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User with id " + req.body._id + " not found!", 400);
      res.status(400).json({
        error: true,
        message: "User with id " + req.body._id + " not found!",
      });
    }

    // update user properties
    const update = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      userName: req.body.userName,
      roles: req.body.roles,
      mfaEnforced: req.body.mfaEnforced,
      mfaEnabled: req.body.mfaEnabled,
      ldapEnabled: req.body.ldapEnabled,
    };
    await User.findByIdAndUpdate({ _id: req.body._id }, update);

    // check if we have to set a new password
    if (req.body.password !== "") {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      let pUpdate = {
        password: hashPassword,
      };
      await User.findByIdAndUpdate({ _id: req.body._id }, pUpdate);
    }

    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Account " + req.body.userName + " updated sucessfully", 201);
    res.status(201).json({ error: false, message: "Account " + req.body.userName + " updated sucessfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|users.js|/updateUser|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * PATCH /v1/users/changeEmailAddress
 * @summary method to update a users email address
 * @tags Users (Authenticated:true | Role:any) - users related api endpoints
 * @param {object} request.body.required - the user
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "_id": "3465644556734573541",
 *  "email": "user.name@domain.com"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "Email address updated successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.patch("/changeEmailAddress", auth, async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);
  const { error } = patchUserEmailValidation(req.body);
  if (error) {
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
    return res.status(400).json({ error: true, message: error.details[0].message });
  }

  const iduser = await User.findOne({ _id: req.body._id });
  if (!iduser) {
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User with id " + req.body._id + " not found!", 400);
    res.status(400).json({
      error: true,
      message: "User with id " + req.body._id + " not found!",
    });
  }

  // update user properties
  await User.findByIdAndUpdate({ _id: req.body._id }, { email: req.body.email });
  doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Account " + iduser.userName + " updated sucessfully", 200);
  res.status(200).json({ error: false, message: "Account " + iduser.userName + " updated sucessfully" });
});

/**
 * PATCH /v1/users/changePassword
 * @summary method to change a users password
 * @tags Users (Authenticated:true | Role:any) - users related api endpoints
 * @param {object} request.body.required - the user
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "_id": "64654167496464",
 *  "oldPassword": "3465644556734573541",
 *  "newPassword": "gvdgu09(/ZUHU)HFDSI"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "Password changed successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.patch("/changePassword", auth, async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);
  const { error } = changePasswordValidation(req.body);
  if (error) {
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
    return res.status(400).json({ error: true, message: error.details[0].message });
  }

  const iduser = await User.findOne({ _id: req.body._id });
  if (!iduser) {
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User with id " + req.body._id + " not found!", 400);
    res.status(400).json({
      error: true,
      message: "User with id " + req.body._id + " not found!",
    });
  }

  const salt = await bcrypt.genSalt(Number(process.env.SALT));

  // compare old password
  const verifiedPassword = await bcrypt.compare(req.body.oldPassword, iduser.password);
  if (!verifiedPassword) {
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Old password is wrong!", 200);
    res.status(200).json({
      error: true,
      message: "Old password is wrong!",
    });
  } else {
    // update user properties
    const hashPassword = await bcrypt.hash(req.body.newPassword, salt);
    await User.findByIdAndUpdate({ _id: req.body._id }, { password: hashPassword });
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Account " + iduser.userName + " changed password sucessfully", 201);
    res.status(201).json({ error: false, message: "Account " + iduser.userName + " changed password sucessfully" });
  }
});

/**
 * GET /v1/users/paginated/{page}/{pageSize}/{searchParam}
 * @summary method to fetch a paged users list 
 * @tags Users (Authenticated:true | Role:admins) - users related api endpoints
 * @param {number} page.query - the page (default 1)
 * @param {number} pageSize.query - the page size (default 10)
 * @param {string} searchParam.query - the optional search parameter
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example response - 200 - example success response
 * {
  "error": false,
  "message": "returned paginated users list..",
  "paginatedResult": {
    "docs": [
      {
        "_id": "65532f838bf9b985305c3eff",
        "firstName": "John",
        "lastName": "Doe",
        "userName": "john.doe",
        "email": "john.doe@local.app",
        "password": "$2b$10$TYiE4YZTGrt6MYjzVOEN3.L6zRmgfhgdfhdhfdshgV/EWp.nPK.khs1WS",
        "roles": [
          "users"
        ],
		"emailVerifyToken": "",
		"pwResetToken": "",
		"mfaEnabled": false,
        "mfaEnforced": false,
        "accountLocked": false,
        "ldapEnabled": false,
        "__v": 0
      }
    ],
    "total": 1,
    "limit": "10",
    "page": "1",
    "pages": 1
  }
}
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.get("/paginated/:page/:pageSize/:searchParam?", auth, roleCheck("admins"), async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    if (req.params.page === undefined || req.params.page === null) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "The page parameter is required!", 400);
      return res.status(400).json({ error: true, message: "The page parameter is required!" });
    }

    if (req.params.pageSize === undefined || req.params.pageSize === null) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "The pageSize parameter is required!", 400);
      return res.status(400).json({ error: true, message: "The pageSize parameter is required!" });
    }
    if (req.params.searchParam) {
      var query = {
        $or: [
          { userName: { $regex: ".*" + req.params.searchParam + ".*" } },
          { firstName: { $regex: ".*" + req.params.searchParam + ".*" } },
          { lastName: { $regex: ".*" + req.params.searchParam + ".*" } },
          { email: { $regex: ".*" + req.params.searchParam + ".*" } },
        ],
      };
      User.paginate(query, { page: req.params.page, limit: req.params.pageSize }, function (error, paginatedResults) {
        if (error) {
          doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.message, 400);
          return res.status(400).json({
            error: true,
            message: error.message,
          });
        } else {
          doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "returned paginated users list..", 200);
          return res.status(200).json({
            error: false,
            message: "returned paginated users list..",
            paginatedResult: paginatedResults,
          });
        }
      });
    } else {
      User.paginate({}, { page: req.params.page, limit: req.params.pageSize }, function (error, paginatedResults) {
        if (error) {
          doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.message, 400);
          return res.status(400).json({
            error: true,
            message: error.message,
          });
        } else {
          doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "returned paginated users list..", 200);
          return res.status(200).json({
            error: false,
            message: "returned paginated users list..",
            paginatedResult: paginatedResults,
          });
        }
      });
    }
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|users.js|/paginated|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * PATCH /v1/users/lockUser
 * @summary method to lock a user account
 * @tags Users (Authenticated:true | Role:admins) - users related api endpoints
 * @param {object} request.body.required - the users id
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "_id": "46355473634654436576"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "user account locked successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.patch("/lockUser", auth, roleCheck("admins"), async (req, res) => {
  try {
    const mid = crypto.randomBytes(16).toString("hex");
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    const { error } = unenforceMfaValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const iduser = await User.findOne({ _id: req.body._id });
    if (!iduser) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User with id " + req.body._id + " not found!", 400);
      res.status(400).json({
        error: true,
        message: "User with id " + req.body._id + " not found!",
      });
    }

    // update user properties
    const update = {
      accountLocked: true,
    };
    await User.findByIdAndUpdate({ _id: req.body._id }, update);
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Account " + req.body._id + " locked sucessfully", 200);
    res.status(200).json({ error: false, message: "Account " + req.body._id + " locked sucessfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|users.js|/lockUser|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * PATCH /v1/users/unlockUser
 * @summary method to unlock a user account
 * @tags Users (Authenticated:true | Role:admins) - users related api endpoints
 * @param {object} request.body.required - the users id
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "_id": "46355473634654436576"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "user account unlocked successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.patch("/unlockUser", auth, roleCheck("admins"), async (req, res) => {
  try {
    const mid = crypto.randomBytes(16).toString("hex");
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    const { error } = unenforceMfaValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const iduser = await User.findOne({ _id: req.body._id });
    if (!iduser) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User with id " + req.body._id + " not found!", 400);
      res.status(400).json({
        error: true,
        message: "User with id " + req.body._id + " not found!",
      });
    }

    // update user properties
    const update = {
      accountLocked: false,
    };
    await User.findByIdAndUpdate({ _id: req.body._id }, update);
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Account " + req.body._id + " unlocked sucessfully", 200);
    res.status(200).json({ error: false, message: "Account " + req.body._id + " unlocked sucessfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|users.js|/unlockUser|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * PATCH /v1/users/enableLdap
 * @summary method to enable ldap a user account
 * @tags Users (Authenticated:true | Role:admins) - users related api endpoints
 * @param {object} request.body.required - the users id
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "_id": "46355473634654436576"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "ldap enabled successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.patch("/enableLdap", auth, roleCheck("admins"), async (req, res) => {
  try {
    const mid = crypto.randomBytes(16).toString("hex");
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    const { error } = deleteUserValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const iduser = await User.findOne({ _id: req.body._id });
    if (!iduser) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User with id " + req.body._id + " not found!", 400);
      res.status(400).json({
        error: true,
        message: "User with id " + req.body._id + " not found!",
      });
    }

    // update user properties
    const update = {
      ldapEnabled: true,
    };
    await User.findByIdAndUpdate({ _id: req.body._id }, update);
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Account " + req.body._id + " ldap enabled sucessfully", 200);
    res.status(200).json({ error: false, message: "Account " + req.body._id + " ldap enabled sucessfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|users.js|/enableLdap|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * PATCH /v1/users/disableLdap
 * @summary method to disable ldap for a user account
 * @tags Users (Authenticated:true | Role:admins) - users related api endpoints
 * @param {object} request.body.required - the users id
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "_id": "46355473634654436576"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "ldap disabled successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.patch("/disableLdap", auth, roleCheck("admins"), async (req, res) => {
  try {
    const mid = crypto.randomBytes(16).toString("hex");
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    const { error } = deleteUserValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const iduser = await User.findOne({ _id: req.body._id });
    if (!iduser) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User with id " + req.body._id + " not found!", 400);
      res.status(400).json({
        error: true,
        message: "User with id " + req.body._id + " not found!",
      });
    }

    // update user properties
    const update = {
      ldapEnabled: false,
    };
    await User.findByIdAndUpdate({ _id: req.body._id }, update);
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Account " + req.body._id + " ldap disabled sucessfully", 200);
    res.status(200).json({ error: false, message: "Account " + req.body._id + " ldap disabled sucessfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|users.js|/disableLdap|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * PATCH /v1/users/enforceMfa
 * @summary method to enforce mfa a user account
 * @tags Users (Authenticated:true | Role:admins) - users related api endpoints
 * @param {object} request.body.required - the users id
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "_id": "46355473634654436576"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "mfa enforced successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.patch("/enforceMfa", auth, roleCheck("admins"), async (req, res) => {
  try {
    const mid = crypto.randomBytes(16).toString("hex");
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    const { error } = unenforceMfaValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const iduser = await User.findOne({ _id: req.body._id });
    if (!iduser) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User with id " + req.body._id + " not found!", 400);
      res.status(400).json({
        error: true,
        message: "User with id " + req.body._id + " not found!",
      });
    }

    // update user properties
    const update = {
      mfaEnforced: true,
    };
    await User.findByIdAndUpdate({ _id: req.body._id }, update);
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Account " + req.body._id + " mfa enforced sucessfully", 200);
    res.status(200).json({ error: false, message: "Account " + req.body._id + " mfa enforced sucessfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|users.js|/enforceMfa|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * PATCH /v1/users/unenforceMfa
 * @summary method to disable mfa enforcement for a user account
 * @tags Users (Authenticated:true | Role:admins) - users related api endpoints
 * @param {object} request.body.required - the users id
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "_id": "46355473634654436576"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "mfa enforcement disabled successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.patch("/unenforceMfa", auth, roleCheck("admins"), async (req, res) => {
  try {
    const mid = crypto.randomBytes(16).toString("hex");
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    const { error } = unenforceMfaValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const iduser = await User.findOne({ _id: req.body._id });
    if (!iduser) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User with id " + req.body._id + " not found!", 400);
      res.status(400).json({
        error: true,
        message: "User with id " + req.body._id + " not found!",
      });
    }

    // update user properties
    const update = {
      mfaEnforced: false,
    };
    await User.findByIdAndUpdate({ _id: req.body._id }, update);
    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Account " + req.body._id + " mfa enforcement disabled sucessfully", 200);
    res.status(200).json({ error: false, message: "Account " + req.body._id + " mfa enforcement disabled sucessfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|users.js|/unenforceMfa|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * PATCH /v1/users/disableMfa
 * @summary method to disable mfa for a user account
 * @tags Users (Authenticated:true | Role:any) - users related api endpoints
 * @param {object} request.body.required - the users id
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "_id": "46355473634654436576",
 *  "execUserId": "1759759137437771"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "mfa disabled successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.patch("/disableMfa", async (req, res) => {
  try {
    const mid = crypto.randomBytes(16).toString("hex");
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    const { error } = disableMfaValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const iduser = await User.findOne({ _id: req.body._id });
    const execUser = await User.findOne({ _id: req.body.execUserId });
    if (!iduser) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "User with id " + req.body._id + " not found!", 400);
      res.status(400).json({
        error: true,
        message: "User with id " + req.body._id + " not found!",
      });
    }

    if (!execUser) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Executing User with id " + req.body._id + " not found!", 400);
      res.status(400).json({
        error: true,
        message: "Executing User with id " + req.body._id + " not found!",
      });
    }

    // check if the executing user is an admin or if the executing user is dectivating 2fa for the own account
    let allowed = false;
    if (execUser.roles.includes("admins")) {
      allowed = true;
    }
    if (iduser._id === execUser._id) {
      allowed = true;
    }

    if (!allowed) {
      doHttpLog(
        "RES",
        mid,
        req.method,
        req.originalUrl,
        req.ip,
        "Executing User " + execUser.userName + " has no permission to disable 2fa for user " + iduser.userName,
        400
      );
      res.status(400).json({
        error: true,
        message: "Executing User " + execUser.userName + " has no permission to disable 2fa for user " + iduser.userName,
      });
    }
    // update user properties
    const update = {
      mfaEnabled: false,
    };
    await User.findByIdAndUpdate({ _id: req.body._id }, update);
    doHttpLog(
      "RES",
      mid,
      req.method,
      req.originalUrl,
      req.ip,
      "Account " + iduser.userName + " mfa disabled by user " + execUser.userName + " sucessfully",
      200
    );
    res.status(200).json({ error: false, message: "Account " + iduser.userName + " mfa disabled by user " + execUser.userName + " sucessfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|users.js|/disableMfa|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
