import jwtInterceptor from "@/components/Auth/jwtInterceptor"
import { AxiosResponse } from "axios"
declare const window: {
  BASE_URL: string
} & Window
const apiurl = window.BASE_URL
const api = (endpoint: string) => `${apiurl}/v1/${endpoint}`

class QuotesService {
  /**
   * method to fetch a quote of the day
   * @returns {Promise<AxiosResponse>}
   */
  static getQuoteOfTheDay(): Promise<AxiosResponse> {
    return jwtInterceptor.get(api("quotes/getQuoteOfTheDay"))
  }
}
export default QuotesService
