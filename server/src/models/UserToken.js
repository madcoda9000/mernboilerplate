import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * @typedef {object} UserToken
 * @property {Schema.Types.ObjectId} userId
 * @property {string} token
 * @property {Date} createdAt
 */
const userTokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 30 * 86400, // 30 days
	},
});

const UserToken = mongoose.model("UserToken", userTokenSchema);

export default UserToken;
