import jwtInterceptor from "../components/shared/Auth/jwtInterceptor";
const apiurl = window.BASE_URL;

class EmailService {

    constructor(props) {
        this.getEmailServiceStatus = this.getEmailServiceStatus.bind();
        this.getEsvcLogs = this.getEsvcLogs.bind();
        this.getFinishedEmailJobs = this.getFinishedEmailJobs.bind();
        this.getWaitingEmailJobs = this.getWaitingEmailJobs.bind();
        this.startEmailService = this.startEmailService.bind();
        this.stopEmailService = this.stopEmailService.bind();
    }

    /**
     * method to stop email service
     * @returns a ajax response object
     */
    stopEmailService() {
        return jwtInterceptor.post(apiurl + "/api/EmailService/stopEmailService");
    }

    /**
     * method to start email service
     * @returns a ajax response object
     */
    startEmailService() {
        return jwtInterceptor.post(apiurl + "/api/EmailService/startEmailService");
    }

    /**
     * method to get email service status
     * @returns a ajax response object
     */
    getEmailServiceStatus() {
        return jwtInterceptor.post(apiurl + "/api/EmailService/getEmailServiceStatus");
    }

    /**
     * method to fetch email service logs
     * @returns a ajax response object
     */
    getEsvcLogs(payload) {
        return jwtInterceptor.post(apiurl + "/api/EmailService/getEsvcLogs", payload);
    }

    /**
     * method to get waiting email jobs
     * @returns a ajax response object
     */
    getWaitingEmailJobs(payload) {
        return jwtInterceptor.post(apiurl + "/api/EmailService/getWaitingEmailJobs", payload);
    }

    /**
     * method to get finished email jobs
     * @returns a ajax response object
     */
    getFinishedEmailJobs(payload) {
        return jwtInterceptor.post(apiurl + "/api/EmailService/getFinishedEmailJobs", payload);
    }

}
export default new EmailService();