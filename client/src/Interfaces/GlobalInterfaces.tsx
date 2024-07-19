/**
 * Represents a user in the system.
 */
export interface User {
  _id: string
  firstName: string
  lastName: string
  userName: string
  email: string
  password: string
  roles: string[]
  mfaEnforced: boolean
  mfaEnabled: boolean
  mfaToken: string
  mfaVerified: boolean
  emailVerifyToken: string
  pwResetToken: string
  emailVerified: boolean
  accountLocked: boolean
  ldapEnabled: boolean
  __v: number
}

/**
 * Represents a role in the system.
 */
export interface Role {
  _id: string | undefined
  roleName: string | undefined
}

/**
 * Represents application settings.
 */
export interface AppSettings {
  showMfaEnableBanner: string | undefined
  showQuoteOfTheDay: string | undefined
  showRegisterLink: string | undefined
  showResetPasswordLink: string | undefined
}

/**
 * Represents a quote in the system.
 */
export interface Quote {
  quote: string | undefined
  author: string | undefined
  genre: string | undefined
}

/**
 * Represents a user class with default values.
 */
export class UserClass implements User {
  _id: string = ""
  firstName: string = ""
  lastName: string = ""
  userName: string = ""
  email: string = ""
  password: string = ""
  roles: string[] = []
  mfaEnforced: boolean = false
  mfaEnabled: boolean = false
  mfaToken: string = ""
  mfaVerified: boolean = false
  emailVerifyToken: string = ""
  pwResetToken: string = ""
  emailVerified: boolean = false
  accountLocked: boolean = false
  ldapEnabled: boolean = false
  __v: number = 0

  /**
   * Constructs a new UserClass instance.
   * @param {Partial<User>} init - Optional parameter to initialize the UserClass object.
   */
  constructor(init?: Partial<User>) {
    Object.assign(this, init)
  }
}
