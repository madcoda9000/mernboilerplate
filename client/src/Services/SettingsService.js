import jwtInterceptor from "../components/shared/Auth/jwtInterceptor";
const apiurl = window.BASE_URL;

class SettingsService {

    constructor(props) {
        this.getApplicationSettings = this.getApplicationSettings.bind();
        this.updateAppSettings = this.updateAppSettings.bind();
    }

    /* FETCH METHODS */

    /**
     * @description method to fetch application settings
     * @returns a ajax response object
     */
    getApplicationSettings() {
        return jwtInterceptor.get(apiurl + "/v1/settings/getAppSettings");
    }

    /**
     * @description method to update app settings
     * @param {*} payload the json payload
     * @returns a ajax response object
     */
    updateAppSettings(payload) {
        return jwtInterceptor.put(apiurl + "/v1/settings/updateAppSettings", payload);
    }

    

}
export default new SettingsService()