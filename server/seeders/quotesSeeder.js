import Quote from "../models/Quote.js"
import logger from "../services/logger.service.js"
import * as fs from "fs"
import { promisify } from "util"

const readFileAsync = promisify(fs.readFile)

const SeedQuotes = async () => {
  try {
    const foundQuote = await Quote.findOne({ genre: "age" })

    if (!foundQuote) {
      logger.info("SEEDER | try to seed initial quotes of the day")

      const data = await readFileAsync("./data/quotes.json", "utf8")
      const jsonData = JSON.parse(data)

      const totalQuotes = jsonData.length
      const batchSize = 100 // Adjust the batch size as needed
      const numBatches = Math.ceil(totalQuotes / batchSize)

      logger.info(`SEEDER | Total quotes to import: ${totalQuotes}`)

      for (let i = 0; i < numBatches; i++) {
        const startIndex = i * batchSize
        const endIndex = Math.min((i + 1) * batchSize, totalQuotes)
        const batchQuotes = jsonData.slice(startIndex, endIndex)

        await Quote.insertMany(batchQuotes)
        logger.info(`SEEDER | Imported ${endIndex} quotes out of ${totalQuotes}`)
      }

      logger.info("SEEDER | Quotes seeded successfully!")
    }
  } catch (error) {
    logger.error("SEEDER | Error seeding quotes: " + error.message)
  }
}

export default SeedQuotes
