import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

/**
 * role schema
 * @typedef {object} Role - the role
 * @property {string} roleName - The name of the role
 */
const roleSchema = new mongoose.Schema({
  /**
   * role name
   * @type {string}
   * @required true
   * @unique true
   */
  roleName: {
    type: String,
    required: true,
    unique: true,
  },
})
roleSchema.plugin(mongoosePaginate)
const Role = mongoose.model("Role", roleSchema)

export default Role
