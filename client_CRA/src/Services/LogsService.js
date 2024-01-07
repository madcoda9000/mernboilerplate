import jwtInterceptor from "../components/shared/Auth/jwtInterceptor";
const apiurl = window.BASE_URL;

class LogsService {

    constructor(props) {
        this.getAuditLogs = this.getAuditLogs.bind();
        this.getSystemLogs = this.getSystemLogs.bind();
        this.getRequestLogs = this.getRequestLogs.bind();
        this.createAuditEntry = this.createAuditEntry.bind();
    }

    /* fetch methods */

    /**
     * method to fetchj all audit logs
     * @param {int} page
     * @param {int} count
     * @param {string} searchParam
     * @returns a ajax response object
     */
    getAuditLogs(page,count,searchParam) {
        return jwtInterceptor.get(apiurl + "/v1/logs/getAuditLogs/"  + page + "/" + count + '/' + searchParam);
    }

    /**
     * method to fetchj all system logs
     * @param {int} page
     * @param {int} count
     * @param {string} searchParam
     * @returns a ajax response object
     */
    getSystemLogs(page,count,searchParam) {
        return jwtInterceptor.get(apiurl + "/v1/logs/getSystemLogs/"  + page + "/" + count + '/' + searchParam);
    }

    /**
     * method to fetchj all request logs
     * @param {int} page
     * @param {int} count
     * @param {string} searchParam
     * @returns a ajax response object
     */
    getRequestLogs(page,count,searchParam) {
        return jwtInterceptor.get(apiurl + "/v1/logs/getRequestLogs/"  + page + "/" + count + '/' + searchParam);
    }

    /* post methods */
    /**
     * method to create an audit entry
     * @param {payload} payload the json payload
     * @returns a ajax response object
     */
    createAuditEntry(payload) {
        return jwtInterceptor.post(apiurl + "/v1/logs/createAuditEntry", payload);
    }

}
export default new LogsService();