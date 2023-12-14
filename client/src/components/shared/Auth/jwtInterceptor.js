import axios from "axios";
const apiurl = window.BASE_URL;

const jwtInterceoptor = axios.create({});

jwtInterceoptor.interceptors.request.use((config) => {
  let accTok = JSON.parse(sessionStorage.getItem("accessToken")); 
  config.headers["x-access-token"] = `${accTok}`;
  return config;
});

jwtInterceoptor.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.message === 'Network Error' || error.response.status === 429) {
      window.location = "/Status429";
    }
    else if (error.response.status === 403) {
      console.log('403' + error.response);
      //window.location = "/Status403";
    }
    else if (error.response.status === 500) {
      console.log('ERROR 500: ' + error.message);
    }
    else if (error.response.status === 401 ) {
      try {
        let refTok = JSON.parse(sessionStorage.getItem("refreshToken"));
        const payload = {
          refreshToken: refTok,
        };

        let apiResponse = await axios.post(apiurl + "/v1/auth/createNewAccessToken", payload);
        console.log('JwtInterceptor: token refreshed');
        sessionStorage.setItem("accessToken", JSON.stringify(apiResponse.data.accessToken));
        error.config.headers[
          "x-access-token"
        ] = `${apiResponse.data.accessToken}`;

        // Set the retry flag to indicate that the request is being retried after token refresh
        error.config.retry = true;

        return axios(error.config).catch((retryError) => {
          if(retryError.response.status===403) {
            window.location = "/Status403";
            console.error('Error during token refresh retry1:', retryError);
          } else if(retryError.response.status===400) {
            console.error('Error during token refresh retry2:', retryError);
            window.location = "/login";
          }
        });
      } catch (refreshError) {
        console.error('Error during token refresh:', refreshError);
        window.location = "/login";
      }
    }
    else {
      return Promise.reject(error);
    }
  }
);
export default jwtInterceoptor;