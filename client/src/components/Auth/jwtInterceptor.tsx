import axios from "axios"

/**
 * Declare the global window object and its properties.
 * @typedef {Object} Window
 */

/**
 * Declare the global window object.
 * @type {Object}
 * @property {string} BASE_URL - The base URL of the API.
 * @property {Window} window - The global window object.
 */
declare const window: {
  BASE_URL: string
} & Window

/**
 * The base URL of the API.
 * @type {string}
 */
const apiurl = window.BASE_URL

/**
 * Create an instance of axios with the JWT interceptor.
 * @type {Object}
 * @property {Object} defaults - The default configuration options for axios.
 * @property {Object} interceptors - The interceptors for request and response.
 */
const jwtInterceoptor = axios.create({ withCredentials: true })

/**
 * Set the default configuration options for axios.
 * @type {Object}
 * @property {boolean} withCredentials - Whether to include credentials (cookies, authorization headers) in cross-origin requests.
 */
axios.defaults.withCredentials = true

/**
 * Add a request interceptor to the JWT interceptor.
 * @param {Object} config - The configuration options for the request.
 * @returns {Object} - The modified configuration options.
 */
jwtInterceoptor.interceptors.request.use((config) => {
  config.withCredentials = true
  return config
})

/**
 * Add a response interceptor to the JWT interceptor.
 * @param {Object} response - The response object.
 * @returns {Object} - The modified response object.
 */
jwtInterceoptor.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error.message === "Network Error" || error.response.status === 429) {
      window.location = "/Status429"
    } else if (error.response.status === 403) {
      console.log("403" + error.response)
      //window.location = "/Status403";
    } else if (error.response.status === 500) {
      console.log("ERROR 500: " + error.message)
    } else if (error.response.status === 401) {
      try {
        let apiResponse = await axios.get(apiurl + "/v1/auth/createNewAccessToken", {
          withCredentials: true,
        })
        console.log("JwtInterceptor: token refreshed")
        sessionStorage.setItem("user", JSON.stringify(apiResponse.data.reqUser))

        // Set the retry flag to indicate that the request is being retried after token refresh
        error.config.retry = true

        return axios(error.config).catch((retryError) => {
          if (retryError.response.status === 403) {
            window.location = "/Status403"
            console.error("Error during token refresh retry1:", retryError)
          } else if (retryError.response.status === 400) {
            console.error("Error during token refresh retry2:", retryError)
            window.location = "/login"
          }
        })
      } catch (refreshError) {
        console.error("Error during token refresh:", refreshError)
        window.location = "/login"
      }
    } else {
      return Promise.reject(error)
    }
  }
)

/**
 * Export the JWT interceptor.
 * @type {Object}
 */
export default jwtInterceoptor
