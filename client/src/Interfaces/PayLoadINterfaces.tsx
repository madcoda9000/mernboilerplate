/**
 * @typedef {Object} LoginPayload
 * @property {string | undefined} userName
 * @property {string | undefined} password
 */
export interface LoginPayload {
  userName: string | undefined
  password: string | undefined
}

/**
 * @typedef {Object} AuditEntryPayload
 * @property {string | undefined} user
 * @property {string | undefined} level
 * @property {string | undefined} message
 */
export interface AuditEntryPayload {
  user: string | undefined
  level: string | undefined
  message: string | undefined
}

/**
 * @typedef {Object} validateOtpPayload
 * @property {string | undefined} _id
 * @property {string | undefined} token
 */
export interface validateOtpPayload {
  _id: string | undefined
  token: string | undefined
}

/**
 * @typedef {Object} finishMfaSetupPayload
 * @property {string | undefined} _id
 * @property {string | undefined} token
 */
export interface finishMfaSetupPayload {
  _id: string | undefined
  token: string | undefined
}

/**
 * @typedef {Object} disableMfaPayload
 * @property {string | undefined} _id
 * @property {string | undefined} execUserId
 */
export interface disableMfaPayload {
  _id: string | undefined
  execUserId: string | undefined
}

/**
 * @typedef {Object} startMfaSetupPayload
 * @property {string | undefined} _id
 */
export interface startMfaSetupPayload {
  _id: string | undefined
}

/**
 * @typedef {Object} forgotPw1Payload
 * @property {string | undefined} email
 */
export interface forgotPw1Payload {
  email: string | undefined
}

/**
 * @typedef {Object} forgotPw2Payload
 * @property {string | undefined} email
 * @property {string | undefined} token
 * @property {string | undefined} password
 */
export interface forgotPw2Payload {
  email: string | undefined
  token: string | undefined
  password: string | undefined
}

/**
 * @typedef {Object} userIdPayload
 * @property {string | undefined} _id
 */
export interface userIdPayload {
  _id: string | undefined
}

/**
 * @typedef {Object} changePasswordPayload
 * @property {string | undefined} _id
 * @property {string | undefined} oldPassword
 * @property {string | undefined} newPassword
 */
export interface changePasswordPayload {
  _id: string | undefined
  oldPassword: string | undefined
  newPassword: string | undefined
}

/**
 * @typedef {Object} changeEmailPayload
 * @property {string | undefined} _id
 * @property {string | undefined} email
 */
export interface changeEmailPayload {
  _id: string | undefined
  email: string | undefined
}

/**
 * @typedef {Object} newUserPayload
 * @property {string} userName
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {boolean} emailVerified
 * @property {boolean} accountLocked
 * @property {boolean} ldapEnabled
 * @property {boolean} mfaEnabled
 * @property {boolean} mfaEnforced
 * @property {string} password
 * @property {Array<string> | undefined} roles
 */
export interface newUserPayload {
  userName: string
  firstName: string
  lastName: string
  email: string
  emailVerified: boolean
  accountLocked: boolean
  ldapEnabled: boolean
  mfaEnabled: boolean
  mfaEnforced: boolean
  password: string
  roles: Array<string> | undefined
}

/**
 * @typedef {Object} editUserPayload
 * @property {string | undefined} userName
 * @property {string | undefined} firstName
 * @property {string | undefined} lastName
 * @property {string | undefined} email
 * @property {string | undefined} password
 * @property {boolean} emailVerified
 * @property {boolean} accountLocked
 * @property {boolean} ldapEnabled
 * @property {boolean} mfaEnabled
 * @property {boolean} mfaEnforced
 * @property {Array<string> | undefined} roles
 */
export interface editUserPayload {
  userName: string | undefined
  firstName: string | undefined
  lastName: string | undefined
  email: string | undefined
  password: string | undefined
  emailVerified: boolean
  accountLocked: boolean
  ldapEnabled: boolean
  mfaEnabled: boolean
  mfaEnforced: boolean
  roles: Array<string> | undefined
}

/**
 * @typedef {Object} roleIdPayload
 * @property {string | undefined} _id
 */
export interface roleIdPayload {
  _id: string | undefined
}

/**
 * @typedef {Object} newRolePayload
 * @property {string | undefined} roleName
 */
export interface newRolePayload {
  roleName: string | undefined
}

/**
 * @typedef {Object} appSettingsPayload
 * @property {string | undefined} showRegisterLink
 * @property {string | undefined} showResetPasswordLink
 * @property {string | undefined} showMfaEnableBanner
 * @property {string | undefined} showQuoteOfTheDay
 */
export interface appSettingsPayload {
  showRegisterLink: string | undefined
  showResetPasswordLink: string | undefined
  showMfaEnableBanner: string | undefined
  showQuoteOfTheDay: string | undefined
}

/**
 * @typedef {Object} registerPayload
 * @property {string | undefined} userName
 * @property {string | undefined} firstName
 * @property {string | undefined} lastName
 * @property {string | undefined} email
 * @property {string | undefined} password
 */
export interface registerPayload {
  userName: string | undefined
  firstName: string | undefined
  lastName: string | undefined
  email: string | undefined
  password: string | undefined
}

/**
 * @typedef {Object} mailSettingsPayload
 * @property {string | undefined} smtpServer
 * @property {string | undefined} smtpPort
 * @property {string | undefined} smtpUsername
 * @property {string | undefined} smtpPassword
 * @property {boolean | undefined} smtpTls
 * @property {string | undefined} smtpSenderAddress
 */
export interface mailSettingsPayload {
  smtpServer: string | undefined
  smtpPort: string | undefined
  smtpUsername: string | undefined
  smtpPassword: string | undefined
  smtpTls: boolean | undefined
  smtpSenderAddress: string | undefined
}

/**
 * @typedef {Object} ldapSettingsPayload
 * @property {string | undefined} ldapBaseDn
 * @property {string | undefined} ldapDomainController
 * @property {string | undefined} ldapDomainName
 * @property {boolean | undefined} ldapEnabled
 * @property {string | undefined} ldapGroup
 */
export interface ldapSettingsPayload {
  ldapBaseDn: string | undefined
  ldapDomainController: string | undefined
  ldapDomainName: string | undefined
  ldapEnabled: boolean | undefined
  ldapGroup: string | undefined
}

/**
 * @typedef {Object} notifSettingsPayload
 * @property {string | undefined} sendNotifOnObjectCreation
 * @property {string | undefined} sendNotifOnObjectDeletion
 * @property {string | undefined} sendNotifOnObjectUpdate
 * @property {string | undefined} sendNotifOnUserSelfRegister
 * @property {string | undefined} sendWelcomeMailOnUserCreation
 * @property {string | undefined} notifReceiver
 * @property {string | undefined} notifReciverFirstname
 * @property {string | undefined} notifReceiverLastname
 */
export interface notifSettingsPayload {
  sendNotifOnObjectCreation: string | undefined
  sendNotifOnObjectDeletion: string | undefined
  sendNotifOnObjectUpdate: string | undefined
  sendNotifOnUserSelfRegister: string | undefined
  sendWelcomeMailOnUserCreation: string | undefined
  notifReceiver: string | undefined
  notifReciverFirstname: string | undefined
  notifReceiverLastname: string | undefined
}
