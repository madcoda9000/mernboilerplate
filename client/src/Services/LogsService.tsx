import { AuditEntryPayload } from "@/Interfaces/PayLoadINterfaces"
import jwtInterceptor from "@/components/Auth/jwtInterceptor"
import { AxiosResponse } from "axios"
declare const window: {
  BASE_URL: string
} & Window
const apiurl = window.BASE_URL
const api = (endpoint: string) => `${apiurl}/v1/${endpoint}`

class LogsService {
  /**
   * Methode zum Abrufen aller Audit-Logs.
   * @param {number} page
   * @param {number} count
   * @param {string} searchParam
   * @returns {Promise<AxiosResponse>} Promise für die Ajax-Antwort
   */
  static getAuditLogs(page: number, count: number, searchParam: string): Promise<AxiosResponse> {
    return jwtInterceptor.get(api("logs/getAuditLogs/" + page + "/" + count + "/" + searchParam))
  }

  /**
   * Methode zum Abrufen aller System-Logs.
   * @param {number} page
   * @param {number} count
   * @param {string} searchParam
   * @returns {Promise<AxiosResponse>} Promise für die Ajax-Antwort
   */
  static getSystemLogs(page: number, count: number, searchParam: string): Promise<AxiosResponse> {
    return jwtInterceptor.get(api("logs/getSystemLogs/" + page + "/" + count + "/" + searchParam))
  }

  /**
   * Methode zum Abrufen aller Request-Logs.
   * @param {number} page
   * @param {number} count
   * @param {string} searchParam
   * @returns {Promise<AxiosResponse>} Promise für die Ajax-Antwort
   */
  static getRequestLogs(page: number, count: number, searchParam: string): Promise<AxiosResponse> {
    return jwtInterceptor.get(api("logs/getRequestLogs/" + page + "/" + count + "/" + searchParam))
  }

  /**
   * Methode zum Erstellen eines Audit-Eintrags.
   * @param {AuditEntryPayload} payload - JSON-Payload
   * @returns {Promise<AxiosResponse>} Promise für die Ajax-Antwort
   */
  static createAuditEntry(payload: AuditEntryPayload): Promise<AxiosResponse> {
    return jwtInterceptor.post(api("logs/createAuditEntry"), payload)
  }
}
export default LogsService
