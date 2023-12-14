import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";

/**
 * @description use model
 * @typedef {object} User
 * @property {string} firstName
 * @property {string} userName
 * @property {string} email
 * @property {string} password
 * @property {string[]} roles 
 * @property {boolean} mfaEnforced
 * @property {boolean} mfaEnabled
 * @property {string} emailVerifyToken
 * @property {string} pwResetToken
 * @property {boolean} emailVerified
 * @property {boolean} accountLocked
 */
const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	roles: {
		type: [String],
		default: ["users"],
	},
	mfaEnforced: {
		type: Boolean,
		default: false,
	},
	mfaEnabled: {
		type: Boolean,
		default: false,
	},
	mfaToken: {
		type: String,
		required: false,
		default: ''
	},
	mfaVerified: {
		type: Boolean,
		required:false,
		default:false
	},
	emailVerifyToken: {
		type: String,
		required: false,
		default: '',
	},
	pwResetToken: {
		type: String,
		required: false,
		default: ''
	},
	emailVerified: {
		type: Boolean,
		default: false,
	},
	accountLocked: {
		type: Boolean,
		default: false,
	},
	ldapEnabled: {
		type: Boolean,
		default: false,
	}
});
userSchema.plugin(mongoosePaginate);
const User = mongoose.model("User", userSchema);

export default User;
