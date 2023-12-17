import jwtInterceptor from "../components/shared/Auth/jwtInterceptor";
const apiurl = window.BASE_URL;

class QuotesService {
  onstructor(props) {
    this.getQuoteOfTheDay = this.getQuoteOfTheDay.bind();
  }

  /**
   * method to fetch a quote of the day
   * @returns a ajax response object
   */
  getQuoteOfTheDay() {
    return jwtInterceptor.get(apiurl + "/v1/quotes/getQuoteOfTheDay");
  }
}

export default new QuotesService();
