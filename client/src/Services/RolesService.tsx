import { newRolePayload, roleIdPayload } from "@/Interfaces/PayLoadINterfaces"
import jwtInterceptor from "@/components/Auth/jwtInterceptor"
import { AxiosResponse } from "axios"

declare const window: {
  BASE_URL: string
} & Window
const apiurl = window.BASE_URL
const api = (endpoint: string) => `${apiurl}/v1/${endpoint}`

class RolesService {
  /**
   * @description method to check if a role exists
   * @param {newRolePayload} payload post parameters
   * @returns {Promise<AxiosResponse>}
   */
  static checkIfRoleExists(payload: newRolePayload): Promise<AxiosResponse> {
    return jwtInterceptor.post(api("roles/checkIfRoleExists"), payload)
  }

  /**
   * @description method to create a new role
   * @param {newRolePayload} payload post parameters
   * @returns {Promise<AxiosResponse>}
   */
  static createRole(payload: newRolePayload): Promise<AxiosResponse> {
    return jwtInterceptor.post(api("roles/createRole"), payload)
  }

  /**
   * @description methosd to fetch a paginated list of roles
   * @param {number} page
   * @param {number} pageSize
   * @param {string} searchParam
   * @returns {Promise<AxiosResponse>}
   */
  static getRoles(page: number, pageSize: number, searchParam: string): Promise<AxiosResponse> {
    return jwtInterceptor.get(api("roles/paginated/" + page + "/" + pageSize + "/" + searchParam))
  }

  /**
   * @description Method to delete a role
   * @param {roleIdPayload} payload
   * @returns {Promise<AxiosResponse>}
   */
  deleteRole(payload: roleIdPayload): Promise<AxiosResponse> {
    return jwtInterceptor.post(api("roles/deleteRole"), payload)
  }
}
export default RolesService
