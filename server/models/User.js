import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

/**
 * @description use model
 * @typedef {object} User
 * @property {string} firstName - The user's first name
 * @property {string} lastName - The user's last name
 * @property {string} userName - The user's username
 * @property {string} email - The user's email address (unique)
 * @property {string} password - The user's password
 * @property {string[]} roles - The user's roles (default: ["users"])
 * @property {boolean} mfaEnforced - Whether MFA is enforced for the user (default: false)
 * @property {boolean} mfaEnabled - Whether MFA is enabled for the user (default: false)
 * @property {string} mfaToken - The user's MFA token (optional)
 * @property {boolean} mfaVerified - Whether the user's MFA token is verified (optional)
 * @property {string} emailVerifyToken - Whether the user's email address verify token (optional)
 * @property {string} pwResetToken - The user's password reset token (optional)
 * @property {boolean} emailVerified - Whether the user's email address is verified (default: false)
 * @property {boolean} accountLocked - Whether the user's account is locked (default: true)
 * @property {boolean} ldapEnabled - Whether the user should use ldap login (default: false)
 */
const userSchema = new mongoose.Schema({
  /**
   * The user's first name
   * @type {string}
   * @required
   */
  firstName: {
    type: String,
    required: true,
  },
  /**
   * The user's last name
   * @type {string}
   * @required
   */
  lastName: {
    type: String,
    required: true,
  },
  /**
   * The user's username
   * @type {string}
   * @required
   */
  userName: {
    type: String,
    required: true,
  },
  /**
   * The user's email address
   * @type {string}
   * @required
   */
  email: {
    type: String,
    required: true,
    unique: true,
  },
  /**
   * The user's password
   * @type {string}
   * @required
   */
  password: {
    type: String,
    required: true,
  },
  /**
   * The user's roles
   * @type {string[]}
   * @default ["users"]
   */
  roles: {
    type: [String],
    default: ["users"],
  },
  /**
   * Whether MFA is enforced for the user
   * @type {boolean}
   * @default false
   */
  mfaEnforced: {
    type: Boolean,
    default: false,
  },
  /**
   * Whether MFA is enabled for the user
   * @type {boolean}
   * @default false
   */
  mfaEnabled: {
    type: Boolean,
    default: false,
  },
  /**
   * The user's MFA token
   * @type {string}
   * @default ""
   */
  mfaToken: {
    type: String,
    required: false,
    default: "",
  },
  /**
   * Whether the user's MFA token is verified
   * @type {boolean}
   * @default false
   */
  mfaVerified: {
    type: Boolean,
    required: false,
    default: false,
  },
  /**
   * The user's email address verify token
   * @type {string}
   * @default ""
   */
  emailVerifyToken: {
    type: String,
    required: false,
    default: "",
  },
  /**
   * The user's password reset token
   * @type {string}
   * @default ""
   */
  pwResetToken: {
    type: String,
    required: false,
    default: "",
  },
  /**
   * Whether the user's email address is verified
   * @type {boolean}
   * @default false
   */
  emailVerified: {
    type: Boolean,
    default: false,
  },
  /**
   * Whether the user's account is locked
   * @type {boolean}
   * @default false
   */
  accountLocked: {
    type: Boolean,
    default: false,
  },
  /**
   * Whether the user should use ldap login
   * @type {boolean}
   * @default false
   */
  ldapEnabled: {
    type: Boolean,
    default: false,
  },
})

userSchema.plugin(mongoosePaginate)
const User = mongoose.model("User", userSchema)

export default User
