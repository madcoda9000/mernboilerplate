import Quote from "../models/Quote.js";
import logger from "../services/logger.service.js";
import csvtojson from "csvtojson";
import * as fs from "fs";

/**
 * @summary method to seed initial quotes
 */
const SeedQuotes = async () => {
  logger.info("SEEDER | try to seed intial quotes of the day");

  // check if role was seeded already, else seed roles
  const foundQuote = await Quote.findOne({ genre: "age" });

  if (!foundQuote) {
    // create array of quotes
    //const impQuotes = await csvtojson().fromFile("./data/quotes_all.csv");
    fs.readFile("./data/quotes.json", "utf8", (error, data) => {
      if (error) {
        console.log(error);
        return;
      }
      const jsonData = JSON.parse(data);
      jsonData.map(async (p, index) => {
        let qt = new Quote(p);
        await qt.save((err, result) => {
          if (index === jsonData.length - 1) {
            logger.info("SEEDER | quotes seeded successfully!");
          }
        });
      });
    });
  } else {
    logger.info("SEEDER | Quotes of the day seeded already.");
  }
};

export default SeedQuotes;
