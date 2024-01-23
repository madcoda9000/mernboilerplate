export interface LoginPayload {
  userName: string | undefined
  password: string | undefined
}
export interface AuditEntryPayload {
  user: string | undefined
  level: string | undefined
  message: string | undefined
}
export interface validateOtpPayload {
  _id: string | undefined
  token: string | undefined
}
export interface finishMfaSetupPayload {
  _id: string | undefined
  token: string | undefined
}
export interface disableMfaPayload {
  _id: string | undefined
  execUserId: string | undefined
}
export interface startMfaSetupPayload {
  _id: string | undefined
}
export interface forgotPw1Payload {
  email: string | undefined
}
export interface forgotPw2Payload {
  email: string | undefined
  token: string | undefined
  password: string | undefined
}
export interface userIdPayload {
  _id: string | undefined
}
export interface changePasswordPayload {
  _id: string | undefined
  oldPassword: string | undefined
  newPassword: string | undefined
}
export interface changeEmailPayload {
  _id: string | undefined
  email: string | undefined
}
export interface newUserPayload {
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
export interface roleIdPayload {
  _id: string | undefined
}
export interface newRolePayload {
  roleName: string | undefined
}
export interface appSettingsPayload {
  showRegisterLink: string | undefined
  showResetPasswordLink: string | undefined
  showMfaEnableBanner: string | undefined
  showQuoteOfTheDay: string | undefined
}
export interface registerPayload {
  userName: string | undefined
  firstName: string | undefined
  lastName: string | undefined
  email: string | undefined
  password: string | undefined
}
export interface mailSettingsPayload {
  smtpServer: string | undefined
  smtpPort: string | undefined
  smtpUsername: string | undefined
  smtpPassword: string | undefined
  smtpTls: boolean | undefined
  smtpSenderAddress: string | undefined
}
export interface ldapSettingsPayload {
  ldapBaseDn: string | undefined
  ldapDomainController: string | undefined
  ldapDomainName: string | undefined
  ldapEnabled: boolean | undefined
  ldapGroup: string | undefined
}
export interface notifSettingsPayload {
  sendNotifOnObjectCreation: string | undefined
  sendNotifOnObjectDeletion: string | undefined
  sendNotifOnObjectUpdate: string | undefined
  sendNotifOnUserSelfRegister: string | undefined
  sendWelcomeMailOnUserCreation: string | undefined
}
