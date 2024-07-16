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
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
    unique: true,
  },
  level: {
    type: String,
  },
  message: {
    type: String,
  },
  hostname: {
    type: String,
  },
})
logsSchema.plugin(mongoosePaginate)
const Logs = mongoose.model("Logs", logsSchema)

export default Logs
