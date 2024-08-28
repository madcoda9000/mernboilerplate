import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

/**
 * role schema
 * @typedef {object} Logs
 * @property {timestamp} timestamp - the actual timestamp
 * @property {string} level - the log level
 * @property {string} message - the log level
 * @property {string} hostname - the logged hostname
 */
const logsSchema = new mongoose.Schema({
  /**
   * the actual timestamp
   * @type {Date}
   * @required true
   * @unique true
   * @default Date.now
   */
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
    unique: true,
  },
  /**
   * the log level
   * @type {string}
   */ 
  level: {
    type: String,
  },
  /**
   * the log level
   * @type {string}
   */
  message: {
    type: String,
  },
  /**
   * the logged hostname
   * @type {string}
   */
  hostname: {
    type: String,
  },
})
logsSchema.plugin(mongoosePaginate)
const Logs = mongoose.model("Logs", logsSchema)

export default Logs
