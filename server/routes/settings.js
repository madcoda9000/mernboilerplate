import { Router, json } from "express";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";
import Setting from "../models/Setting.js";
import crypto from "crypto";
import doHttpLog from "../utils/httpLogger.js";
import { updateAppSettingsValidation } from "../utils/validationSchema.js";
import logger from "../services/logger.service.js";

const router = Router();

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
    res.status(200).json({ error: false, message: "Application settings updated successfully" });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|settings.js|/updateAppSettings|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
