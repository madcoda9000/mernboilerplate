import { Router, json } from "express";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";
import Setting from "../models/Setting.js";
import crypto from "crypto";
import doHttpLog from "../utils/httpLogger.js";
import { updateAppSettingsValidation, updateLdapSettingsValidation, updateMailSettingsValidation, updateNotifSettingsValidation } from "../utils/validationSchema.js";
import logger from "../services/logger.service.js";
import { sendNotifOnObjectUpdate, sendNotifOnObjectCreation, sendObjectMail } from "../utils/mailSender.js"

const router = Router();

/**
 * GET /v1/settings/getNotifSettings
 * @summary method to fetch a list of notification settings
 * @tags Settings (Authenticated:true | Role:admins) - settings related api endpoints
 * @return {object} 200 - success response - application/json
 * @example response - 200 - example success response
 * {
  "error": false,
  "message": "returned notification settings list..",
  "settings": [
    {
        "scope": "notif",
        "name": "setting1",
        "value": "setting1_value"
    },
    {
        "scope": "notif",
        "name": "setting2",
        "value": "setting2_value"
    }
  ]
}
 */
router.get("/getNotifSettings", async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    var sett = await Setting.find({ scope: "notif" });
    if (sett) {
      const jsonData = {};
      sett.forEach((item) => {
        jsonData[item.name] = item.value;
      });
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "returned ldap settings list..", 200);
      return res.status(200).json({
        error: false,
        message: "returned notification settings list..",
        settings: jsonData,
      });
    } else {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "No Data from query!", 400);
      return res.status(400).json({
        error: true,
        message: "No data from query!",
      });
    }
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|settings.js|/getNotifSettings|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /v1/settings/getLdapSettings
 * @summary method to fetch a list of ldap settings
 * @tags Settings (Authenticated:true | Role:admins) - settings related api endpoints
 * @return {object} 200 - success response - application/json
 * @example response - 200 - example success response
 * {
  "error": false,
  "message": "returned ldap settings list..",
  "settings": [
    {
        "scope": "ldap",
        "name": "setting1",
        "value": "setting1_value"
    },
    {
        "scope": "ldap",
        "name": "setting2",
        "value": "setting2_value"
    }
  ]
}
 */
router.get("/getLdapSettings", async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    var sett = await Setting.find({ scope: "ldap" });
    if (sett) {
      const jsonData = {};
      sett.forEach((item) => {
        jsonData[item.name] = item.value;
      });
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "returned ldap settings list..", 200);
      return res.status(200).json({
        error: false,
        message: "returned ldap settings list..",
        settings: jsonData,
      });
    } else {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "No Data from query!", 400);
      return res.status(400).json({
        error: true,
        message: "No data from query!",
      });
    }
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|settings.js|/getLdapSettings|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /v1/settings/getMailSettings
 * @summary method to fetch a list of mail settings
 * @tags Settings (Authenticated:true | Role:admins) - settings related api endpoints
 * @return {object} 200 - success response - application/json
 * @example response - 200 - example success response
 * {
  "error": false,
  "message": "returned mail settings list..",
  "settings": [
    {
        "scope": "mail",
        "name": "setting1",
        "value": "setting1_value"
    },
    {
        "scope": "mail",
        "name": "setting2",
        "value": "setting2_value"
    }
  ]
}
 */
router.get("/getMailSettings", async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    var sett = await Setting.find({ scope: "mail" });
    if (sett) {
      const jsonData = {};
      sett.forEach((item) => {
        jsonData[item.name] = item.value;
      });
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "returned mail settings list..", 200);
      return res.status(200).json({
        error: false,
        message: "returned mail settings list..",
        settings: jsonData,
      });
    } else {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "No Data from query!", 400);
      return res.status(400).json({
        error: true,
        message: "No data from query!",
      });
    }
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|settings.js|/getMailSettings|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /v1/settings/getAppSettings
 * @summary method to fetch a list of app settings
 * @tags Settings (Authenticated:false) - settings related api endpoints
 * @return {object} 200 - success response - application/json
 * @example response - 200 - example success response
 * {
  "error": false,
  "message": "returned app settings list..",
  "settings": [
    {
        "scope": "app",
        "name": "setting1",
        "value": "setting1_value"
    },
    {
        "scope": "app",
        "name": "setting2",
        "value": "setting2_value"
    }
  ]
}
 */
router.get("/getAppSettings", async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    var sett = await Setting.find({ scope: "app" });
    if (sett) {
      const jsonData = {};
      sett.forEach((item) => {
        jsonData[item.name] = item.value;
      });
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "returned app settings list..", 200);
      return res.status(200).json({
        error: false,
        message: "returned appsettings list..",
        settings: jsonData,
      });
    } else {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "No Data from query!", 400);
      return res.status(400).json({
        error: true,
        message: "No data from query!",
      });
    }
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|settings.js|/getAppSettings|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT /v1/settings/updateAppSettings
 * @summary method to update application settings
 * @tags Settings (Authenticated:true | Role:admins) - settings related api endpoints
 * @param {object} request.body.required - the application settings
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "showMfaEnableBanner": "true",
 *  "showRegisterLink": "true",
 *  "showResetPasswordLink": "true"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "Application settings updated successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.put("/updateAppSettings", auth, roleCheck("admins"), async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");

  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    const { error } = updateAppSettingsValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const settingNames = ["showMfaEnableBanner", "showRegisterLink", "showResetPasswordLink", "showQuoteOfTheDay"];
    const settings = await Promise.all(settingNames.map((name) => Setting.findOne({ name })));

    if (settings.some((setting) => !setting)) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Setting not found", 400);
      return res.status(400).json({ error: true, message: "Setting not found" });
    }

    const updates = settingNames.map((name, index) => ({
      name,
      value: req.body[name],
    }));

    await Promise.all(updates.map((update) => Setting.updateOne({ name: update.name }, { $set: { value: update.value } })));

    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Application settings updated successfully", 200);
    var lo = await sendNotifOnObjectUpdate();
    if (lo) {
      sendObjectMail("App Settings", "Settings", "modified");
    }
    res.status(200).json({ error: false, message: "Application settings updated successfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|settings.js|/updateAppSettings|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT /v1/settings/updateMailSettings
 * @summary method to update mail settings
 * @tags Settings (Authenticated:true | Role:admins) - settings related api endpoints
 * @param {object} request.body.required - the mail settings
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "smtpServer": "",
 *  "smtpPort": "",
 *  "smtpUsername": "",
 *  "smtpPassword": "",
 *  "smtpTls": ""
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "Mail settings updated successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.put("/updateMailSettings", auth, roleCheck("admins"), async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");

  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    const { error } = updateMailSettingsValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const settingNames = ["smtpServer", "smtpPort", "smtpUsername", "smtpPassword", "smtpTls", "smtpSenderAddress"];
    const settings = await Promise.all(settingNames.map((name) => Setting.findOne({ name })));

    if (settings.some((setting) => !setting)) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Setting not found", 400);
      return res.status(400).json({ error: true, message: "Setting not found" });
    }

    const updates = settingNames.map((name, index) => ({
      name,
      value: req.body[name],
    }));

    await Promise.all(updates.map((update) => Setting.updateOne({ name: update.name }, { $set: { value: update.value } })));

    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Mail settings updated successfully", 200);
    var lo = await sendNotifOnObjectUpdate();
    if (lo) {
      sendObjectMail("Mail Settings", "Settings", "modified");
    }
    res.status(200).json({ error: false, message: "Mail settings updated successfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|settings.js|/updateMailSettings|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT /v1/settings/updateLdapSettings
 * @summary method to update ldap settings
 * @tags Settings (Authenticated:true | Role:admins) - settings related api endpoints
 * @param {object} request.body.required - the ldap settings
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "LdapBaseDn": "",
 *  "LdapDomainController": "",
 *  "LdapDomainName": "",
 *  "LdapEnabled": "false",
 *  "LdapGroup": ""
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "ldap settings updated successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.put("/updateLdapSettings", auth, roleCheck("admins"), async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");

  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    const { error } = updateLdapSettingsValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const settingNames = ["ldapBaseDn", "ldapDomainController", "ldapDomainName", "ldapEnabled", "ldapGroup"];
    const settings = await Promise.all(settingNames.map((name) => Setting.findOne({ name })));

    if (settings.some((setting) => !setting)) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Setting not found", 400);
      return res.status(400).json({ error: true, message: "Setting not found" });
    }

    const updates = settingNames.map((name, index) => ({
      name,
      value: req.body[name],
    }));

    await Promise.all(updates.map((update) => Setting.updateOne({ name: update.name }, { $set: { value: update.value } })));

    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Ldap settings updated successfully", 200);
    var lo = await sendNotifOnObjectUpdate();
    if (lo) {
      sendObjectMail("LDAP Settings", "Settings", "modified");
    }
    res.status(200).json({ error: false, message: "Ldap settings updated successfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|settings.js|/updateLdapSettings|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT /v1/settings/updateNotifSettings
 * @summary method to update notification settings
 * @tags Settings (Authenticated:true | Role:admins) - settings related api endpoints
 * @param {object} request.body.required - the ldap settings
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "sendNotifOnObjectCreation": "false",
 *  "sendNotifOnObjectDeletion": "flase",
 *  "sendNotifOnObjectUpdate": "false",
 *  "sendNotifOnUserSelfRegister": "false",
 *  "sendWelcomeMailOnUserCreation": "false"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "notification settings updated successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.put("/updateNotifSettings", auth, roleCheck("admins"), async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");

  try {
    doHttpLog("REQ", mid, req.method, req.originalUrl, req.ip);

    const { error } = updateNotifSettingsValidation(req.body);
    if (error) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, error.details[0].message, 400);
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const settingNames = ["sendWelcomeMailOnUserCreation", "sendNotifOnUserSelfRegister", "sendNotifOnObjectUpdate", "sendNotifOnObjectDeletion", "sendNotifOnObjectCreation", "notifReceiver", "notifReciverFirstname", "notifReceiverLastname"];
    const settings = await Promise.all(settingNames.map((name) => Setting.findOne({ name })));

    if (settings.some((setting) => !setting)) {
      doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Setting not found", 400);
      return res.status(400).json({ error: true, message: "Setting not found" });
    }

    const updates = settingNames.map((name, index) => ({
      name,
      value: req.body[name],
    }));

    await Promise.all(updates.map((update) => Setting.updateOne({ name: update.name }, { $set: { value: update.value } })));

    doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Notification settings updated successfully", 200);
    var lo = await sendNotifOnObjectUpdate();
    if (lo) {
      sendObjectMail("Notification Settings", "Settings", "modified");
    }
    res.status(200).json({ error: false, message: "Notification settings updated successfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|settings.js|/updateNotifSettings|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
