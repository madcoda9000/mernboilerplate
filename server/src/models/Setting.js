import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";

/**
 * role schema
 * @typedef {object} Setting
 * @property {string} scope - the settings scope
 * @property {string} name - the name of the settings parameter
 * @property {string} value - the value of the settings
 */
const logsSchema = new mongoose.Schema({
    scope: {
		type: String,
	},
    name: {
		type: String,
	},
    value: {
		type: String,
	},
});
logsSchema.plugin(mongoosePaginate);
const Setting = mongoose.model("Setting", logsSchema);

export default Setting;