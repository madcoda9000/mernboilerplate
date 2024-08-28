import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

/**
 * role schema
 * @typedef {object} Setting
 * @property {string} scope - the settings scope
 * @property {string} name - the name of the settings parameter
 * @property {string} value - the value of the settings
 */
const logsSchema = new mongoose.Schema({
  /**
   * the settings scope
   * @type {string}
   */
  scope: {
    type: String,
  },
  /**
   * the name of the settings parameter
   * @type {string}
   */
  name: {
    type: String,
  },
  /**
   * the value of the settings
   * @type {string}
   */
  value: {
    type: String,
  },
})
logsSchema.plugin(mongoosePaginate)
const Setting = mongoose.model("Setting", logsSchema)

export default Setting
