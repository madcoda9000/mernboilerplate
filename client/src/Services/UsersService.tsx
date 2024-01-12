import { User } from "@/Interfaces/GlobalInterfaces"
import {
  changeEmailPayload,
  changePasswordPayload,
  finishMfaSetupPayload,
  forgotPw1Payload,
  forgotPw2Payload,
  newUserPayload,
  startMfaSetupPayload,
  userIdPayload,
  validateOtpPayload,
} from "@/Interfaces/PayLoadINterfaces"
import jwtInterceptor from "@/components/Auth/jwtInterceptor"
import { AxiosResponse } from "axios"

declare const window: {
  BASE_URL: string
} & Window

const apiurl = window.BASE_URL
const api = (endpoint: string) => `${apiurl}/v1/${endpoint}`

class UsersService {
  /**
   * @description method to validate an otp token for a user
   * @param {validateOtpPayload} payload
   * @returns {Promise<AxiosResponse>} Promise für die Ajax-Antwort
   */
  static validateOtp(payload: validateOtpPayload): Promise<AxiosResponse> {
    return jwtInterceptor.post(api("auth/validateOtp"), payload)
  }

  /**
   * @description method to finish 2fa setup
   * @param {finishMfaSetupPayload} payload
   * @returns {Promise<AxiosResponse>}
   */
  static finishMfaSetup(payload: finishMfaSetupPayload): Promise<AxiosResponse> {
    return jwtInterceptor.post(api("auth/finishMfaSetup"), payload)
  }

  /**
   * @description method to initiate 2fa setup
   * @param {startMfaSetupPayload} payload
   * @returns {Promise<AxiosResponse>}
   */
  static startMfaSetup(payload: startMfaSetupPayload): Promise<AxiosResponse> {
    return jwtInterceptor.post(api("auth/startMfaSetup"), payload)
  }

  /**
   * @description method to reset user password self service
   * @param {forgotPw1Payload} payload
   * @returns {Promise<AxiosResponse>}
   */
  static forgotPw1(payload: forgotPw1Payload): Promise<AxiosResponse> {
    return jwtInterceptor.post(api("users/forgotPw1"), payload)
  }

  /**
   * @description method to reset user password self service
   * @param {forgotPw2Payload} payload
   * @returns {Promise<AxiosResponse>}
   */
  static forgotPw2(payload: forgotPw2Payload): Promise<AxiosResponse> {
    return jwtInterceptor.post(api("users/forgotPw2"), payload)
  }

  /**
   * @description method to lock a user account
   * @param {userIdPayload} payload post params
   * @returns {Promise<AxiosResponse>}
   */
  static lockUser(payload: userIdPayload): Promise<AxiosResponse> {
    return jwtInterceptor.patch(api("users/lockUser"), payload)
  }

  /**
   * @description method to unlock a user account
   * @param {userIdPayload} payload post params
   * @returns {Promise<AxiosResponse>}
   */
  static unlockUser(payload: userIdPayload): Promise<AxiosResponse> {
    return jwtInterceptor.patch(api("users/unlockUser"), payload)
  }

  /**
   * @description method to update user data
   * @param {User} payload post params
   * @returns {Promise<AxiosResponse>}
   */
  static updateUser(payload: User): Promise<AxiosResponse> {
    return jwtInterceptor.put(api("users/updateUser"), payload)
  }

  /**
   * @description method to change a users password
   * @param {changePasswordPayload} payload the post params
   * @returns {Promise<AxiosResponse>}
   */
  static changePassword(payload: changePasswordPayload): Promise<AxiosResponse> {
    return jwtInterceptor.patch(api("users/changePassword"), payload)
  }

  /**
   * @description method to change a users email address
   * @param {changeEmailPayload} payload the post params
   * @returns {Promise<AxiosResponse>}
   */
  static changeEmailAddress(payload: changeEmailPayload): Promise<AxiosResponse> {
    return jwtInterceptor.patch(api("users/changeEmailAddress"), payload)
  }

  /**
   * @description method to delete a user
   * @param {userIdPayload} payload post parameters
   * @returns {Promise<AxiosResponse>}
   */
  static deleteUser(payload: userIdPayload): Promise<AxiosResponse> {
    return jwtInterceptor.post(api("users/deleteUser"), payload)
  }

  /**
   * @description Method to create a user
   * @param {newUserPayload} payload post parameters
   * @returns {Promise<AxiosResponse>}
   */
  static createUser(payload: newUserPayload): Promise<AxiosResponse> {
    return jwtInterceptor.post(api("users/createUser"), payload)
  }

  /**
   * @description Method to fetch a paginated list of users
   * @param {number} page
   * @param {number} count
   * @param {string} searchParam
   * @returns {Promise<AxiosResponse>}}
   */
  static getUsersPaginated(
    page: number,
    count: number,
    searchParam: string
  ): Promise<AxiosResponse> {
    return jwtInterceptor.get(api("users/paginated/" + page + "/" + count + "/" + searchParam))
  }

  /**
   * @description Method to fetch a single user
   * @param {string} id
   * @returns {Promise<AxiosResponse>}
   */
  static getUser(id: string): Promise<AxiosResponse> {
    return jwtInterceptor.get(api("users/user/" + id))
  }

  /**
   * @description Method to disable MFA fro a user
   * @param {userIdPayload} payload
   * @returns {Promise<AxiosResponse>}
   */
  static disableMfa(payload: userIdPayload): Promise<AxiosResponse> {
    return jwtInterceptor.patch(api("users/disableMfa"), payload)
  }

  /**
   * @description Method to enable ldap for a user
   * @param {userIdPayload} payload
   * @returns {Promise<AxiosResponse>}
   */
  static enableLdap(payload: userIdPayload): Promise<AxiosResponse> {
    return jwtInterceptor.patch(api("users/enableLdap"), payload)
  }

  /**
   * @description Method to disable ldap for a user
   * @param {userIdPayload} payload
   * @returns {Promise<AxiosResponse>}
   */
  static disableLdap(payload: userIdPayload): Promise<AxiosResponse> {
    return jwtInterceptor.patch(api("users/disableLdap"), payload)
  }

  /**
   * @description Method to enable mfa enforcement for a user
   * @param {userIdPayload} payload
   * @returns {Promise<AxiosResponse>}
   */
  static enableMfaEnforce(payload: userIdPayload): Promise<AxiosResponse> {
    return jwtInterceptor.patch(api("users/enforceMfa"), payload)
  }

  /**
   * @description Method to disable mfa enforcement for a user
   * @param {userIdPayload} payload
   * @returns {Promise<AxiosResponse>}
   */
  static disableMfaEnforce(payload: userIdPayload): Promise<AxiosResponse> {
    return jwtInterceptor.patch(api("users/unenforceMfa"), payload)
  }
}

export default UsersService
