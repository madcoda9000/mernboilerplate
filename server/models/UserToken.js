import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * @typedef {object} UserToken - the user token
 * @property {Schema.Types.ObjectId} userId - the users object id
 * @property {string} token - the jwt token
 * @property {Date} createdAt - the created timestamp
 */
const userTokenSchema = new Schema({
	/**
	 * user id
	 * @type {Schema.Types.ObjectId}
	 * @required true
	 */
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	/**
	 * token
	 * @type {string}
	 * @required true
	 */
	token: {
		type: String,
		required: true,
	},
	/**
	 * created at
	 * @type {Date}
	 * @default Date.now
	 * @expires 30 days
	 */
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 30 * 86400, // 30 days
	},
});

const UserToken = mongoose.model("UserToken", userTokenSchema);

export default UserToken;
