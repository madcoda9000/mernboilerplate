import Quote from "../models/Quote.js";
import logger from "../services/logger.service.js";
import * as fs from "fs";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);

const SeedQuotes = async () => {
  logger.info("SEEDER | try to seed initial quotes of the day");

  try {
    const foundQuote = await Quote.findOne({ genre: "age" });

    if (!foundQuote) {
      const data = await readFileAsync("./data/quotes.json", "utf8");
      const jsonData = JSON.parse(data);

      for (const p of jsonData) {
        let qt = new Quote(p);
        await qt.save();
      }

      logger.info("SEEDER | Quotes seeded successfully!");
    } else {
      logger.info("SEEDER | Quotes of the day seeded already.");
    }
  } catch (error) {
    logger.error("SEEDER | Error seeding quotes: " + error.message);
  }
};

export default SeedQuotes;
