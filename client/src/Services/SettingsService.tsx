import {
  appSettingsPayload,
  ldapSettingsPayload,
  mailSettingsPayload,
  notifSettingsPayload,
} from "@/Interfaces/PayLoadINterfaces"
import jwtInterceptor from "@/components/Auth/jwtInterceptor"
import { AxiosResponse } from "axios"
declare const window: {
  BASE_URL: string
} & Window
const apiurl = window.BASE_URL
const api = (endpoint: string) => `${apiurl}/v1/${endpoint}`

class SettingsService {
  /**
   * @description method to fetch application settings
   * @returns {Promise<AxiosResponse>}
   */
  static getApplicationSettings(): Promise<AxiosResponse> {
    return jwtInterceptor.get(api("settings/getAppSettings"))
  }

  /**
   * @description method to update app settings
   * @param {appSettingsPayload} payload the json payload
   * @returns {Promise<AxiosResponse>}
   */
  static updateAppSettings(payload: appSettingsPayload): Promise<AxiosResponse> {
    return jwtInterceptor.put(api("settings/updateAppSettings"), payload)
  }

  /**
   * @description method to fetch mail settings
   * @returns {Promise<AxiosResponse>}
   */
  static getMailSettings(): Promise<AxiosResponse> {
    return jwtInterceptor.get(api("settings/getMailSettings"))
  }

  /**
   * @description method to update mail settings
   * @param {mailSettingsPayload} payload the json payload
   * @returns {Promise<AxiosResponse>}
   */
  static updateMailSettings(payload: mailSettingsPayload): Promise<AxiosResponse> {
    return jwtInterceptor.put(api("settings/updateMailSettings"), payload)
  }

  /**
   * @description method to fetch ldap settings
   * @returns {Promise<AxiosResponse>}
   */
  static getLdapSettings(): Promise<AxiosResponse> {
    return jwtInterceptor.get(api("settings/getLdapSettings"))
  }

  /**
   * @description method to update ldap settings
   * @param {ldapSettingsPayload} payload the json payload
   * @returns {Promise<AxiosResponse>}
   */
  static updateLdapSettings(payload: ldapSettingsPayload): Promise<AxiosResponse> {
    return jwtInterceptor.put(api("settings/updateLdapSettings"), payload)
  }

  /**
   * @description method to fetch notification settings
   * @returns {Promise<AxiosResponse>}
   */
  static getNotifSettings(): Promise<AxiosResponse> {
    return jwtInterceptor.get(api("settings/getNotifSettings"))
  }

  /**
   * @description method to update notification settings
   * @param {notifSettingsPayload} payload the json payload
   * @returns {Promise<AxiosResponse>}
   */
  static updateNotifSettings(payload: notifSettingsPayload): Promise<AxiosResponse> {
    return jwtInterceptor.put(api("settings/updateNotifSettings"), payload)
  }
}
export default SettingsService
