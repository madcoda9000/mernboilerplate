export interface User {
  _id: string
  firstName: string
  lastName: string
  userName: string
  email: string
  password: string
  roles: Array<string>
  mfaEnforced: false
  mfaEnabled: false
  mfaToken: string
  mfaVerified: boolean
  emailVerifyToken: string
  pwResetToken: string
  emailVerified: boolean
  accountLocked: boolean
  ldapEnabled: boolean
  __v: number
}
export interface Role {
  _id: string | undefined
  roleName: string | undefined
}
export interface AppSettings {
  showMfaEnableBanner: string | undefined
  showQuoteOfTheDay: string | undefined
  showRegisterLink: string | undefined
  showResetPasswordLink: string | undefined
}
export interface Quote {
  quote: string | undefined
  author: string | undefined
  genre: string | undefined
}
