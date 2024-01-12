import { appSettingsPayload } from "@/Interfaces/PayLoadINterfaces"
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
}
export default SettingsService
