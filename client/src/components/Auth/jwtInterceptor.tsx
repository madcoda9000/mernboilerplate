import axios from "axios"
declare const window: {
  BASE_URL: string
} & Window
const apiurl = window.BASE_URL
const jwtInterceoptor = axios.create({ withCredentials: true })

axios.defaults.withCredentials = true

jwtInterceoptor.interceptors.request.use((config) => {
  config.withCredentials = true
  return config
})

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
export default jwtInterceoptor
