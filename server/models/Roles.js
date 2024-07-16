import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

/**
 * role schema
 * @typedef {object} Role
 * @property {string} roleName - The name of the role
 */
const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
  },
})
roleSchema.plugin(mongoosePaginate)
const Role = mongoose.model("Role", roleSchema)

export default Role
