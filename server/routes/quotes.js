import { Router } from "express";
import Quote from "../models/Quote.js";
import crypto from "crypto";
import doHttpLog from "../utils/httpLogger.js";
import logger from "../services/logger.service.js";

const router = Router();

/**
 * GET /v1/quotes/getQuoteOfTheDay
 * @summary method to fetch a random quote of the day
 * @tags Quotes (Authenticated:false) - quotes related api endpoints
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example response - 200 - example success response
 * {
 * "error": false,
 * "message": "Quote of the day fetched sucessfully",
 * "quote": {
 *   "quote": "blablablablablaaaa",
 *   "author": "john doe",
 *   "genre": "age"
 *  }
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.get("/getQuoteOfTheDay", async (req, res) => {
  const mid = crypto.randomBytes(16).toString("hex");
  try {
    // Get the count of all quotes
    Quote.find({ genre: "computers" })
      .count()
      .exec(function (err, count) {
        // Get a random entry
        var random = Math.floor(Math.random() * count);

        // Again query all quotes but only fetch one offset by our random #
        Quote.findOne({ genre: "computers" })
          .skip(random)
          .exec(function (err, result) {
            // Tada! random quote
            doHttpLog("RES", mid, req.method, req.originalUrl, req.ip, "Quote of the day fetched sucessfully", 200);
            res.status(200).json({ error: false, message: "Quote of the day fetched sucessfully", quote: result });
          });
      });
  } catch (err) {
    doHttpLog("RES", mid, req.method, req.originalUrl, err.message, 500);
    logger.error("API|quotes.js|/getQuoteOfTheDay|" + err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
