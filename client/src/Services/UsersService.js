import jwtInterceptor from "../components/shared/Auth/jwtInterceptor";
const apiurl = window.BASE_URL;

class UsersService {

    constructor(props) {
        this.getUsersPaginated = this.getUsersPaginated.bind();
        this.getUser = this.getUser.bind();
        this.createUser = this.createUser.bind();
        this.lockUser = this.lockUser.bind();
        this.unlockUser = this.unlockUser.bind();
        this.updateUser = this.updateUser.bind();
        this.deleteUser = this.deleteUser.bind();
        this.disableLdap = this.disableLdap.bind();
        this.enableLdap = this.enableLdap.bind()
        this.disableMfa = this.disableMfa.bind();
        this.enableMfaEnforce = this.enableMfaEnforce.bind();
        this.disableMfaEnforce = this.disableMfaEnforce.bind();
        this.forgotPw1 = this.forgotPw1.bind();
        this.forgotPw2 = this.forgotPw2.bind();
        this.validateOtp = this.validateOtp.bind();
        this.startMfaSetup = this.startMfaSetup.bind();
        this.finishMfaSetup = this.finishMfaSetup.bind();
    }

    /**
     * @description method one to validate an otp token for a user
     * @param {*} payload 
     * @returns a ajax response object
     */
    validateOtp(payload) {
        return jwtInterceptor.post(apiurl + "/v1/auth/validateOtp", payload);
    }

    /**
     * @description method one to finish 2fa setup
     * @param {*} payload 
     * @returns a ajax response object
     */
    finishMfaSetup(payload) {
        return jwtInterceptor.post(apiurl + "/v1/auth/finishMfaSetup", payload);
    }

    /**
     * @description method one to initiate 2fa setup
     * @param {*} payload 
     * @returns a ajax response object
     */
    startMfaSetup(payload) {
        return jwtInterceptor.post(apiurl + "/v1/auth/startMfaSetup", payload);
    }

    /**
     * @description method one to reset user password self service
     * @param {*} payload 
     * @returns a ajax response object
     */
    forgotPw1(payload) {
        return jwtInterceptor.post(apiurl + "/v1/users/forgotPw1", payload);
    }

    /**
     * @description method two to reset user password self service
     * @param {*} payload 
     * @returns a ajax response object
     */
    forgotPw2(payload) {
        return jwtInterceptor.post(apiurl + "/v1/users/forgotPw2", payload);
    }

    /**
     * method to lock a user account
     * @param {*} payload post params
     * @returns 
     */
    lockUser(payload) {
        return jwtInterceptor.put(apiurl + "/v1/users/lockUser", payload);
    }

    /**
     * method to unlock a user account
     * @param {*} payload post params
     * @returns 
     */
    unlockUser(payload) {
        return jwtInterceptor.put(apiurl + "/v1/users/unlockUser", payload);
    }

    /**
     * method to update user data
     * @param {*} payload post params
     * @returns 
     */
    updateUser(payload) {
        return jwtInterceptor.put(apiurl + "/v1/users/updateUser", payload);
    }

    /**
     * method to change a users password
     * @param {*} payload the post params
     * @returns 
     */
    changePassword(payload) {
        return jwtInterceptor.patch(apiurl + "/v1/users/changePassword", payload);
    }

    /**
     * method to change a users email address
     * @param {*} payload the post params
     * @returns 
     */
    changeEmailAddress(payload) {
        return jwtInterceptor.patch(apiurl + "/v1/users/changeEmailAddress", payload);
    }

    /**
     * method to delete a user
     * @param {*} payload post parameters
     * @returns 
     */
    deleteUser(payload) {
        return jwtInterceptor.post(apiurl + "/v1/users/deleteUser", payload);
    }

    /**
     * Method to create a user
     * @param {*} payload post parameters
     * @returns 
     */
    createUser(payload) {
        return jwtInterceptor.post(apiurl + "/v1/users/createUser", payload);
    }

    /**
     * Method to setup mfa
     * @param {*} payload post parameters
     * @returns 
     */
    setMfaSetup(payload) {
        return jwtInterceptor.post(apiurl + "/api/Authenticate/setMfaSetup", payload);
    }

    /**
     * Method to fetch mfa setup for user
     * @param {*} userId get parameter userId
     * @returns 
     */
    getMfaSetup(userId) {
        return jwtInterceptor.get(apiurl + "/api/Authenticate/getMfaSetup?userId=" + userId);
    }

    /**
     * Method to fetch a paginated list of users
     * @param {int} page
     * @param {int} count
     * @param {string} searchParam
     * @returns a ajax response object
     */
    getUsersPaginated(page, count, searchParam) {
        return jwtInterceptor.get(apiurl + "/v1/users/paginated/" + page + "/" + count + '/' + searchParam); 
    }

    /**
     * Method to fetch a paginated list of users
     * @param {int} id
     * @returns a ajax response object
     */
    getUser(id) {
        return jwtInterceptor.get(apiurl + "/v1/users/user/" + id); 
    }

    /**
     * Method to disable MFA fro a user
     * @param {*} payload 
     * @returns a ajax response object
     */
    disableMfa(payload) {
        return jwtInterceptor.post(apiurl + "/v1/users/disableMfa", payload); 
    }

    /**
     * Method to enable ldap for a user
     * @param {*} payload 
     * @returns a ajax response object
     */
    enableLdap(payload) {
        return jwtInterceptor.put(apiurl + "/v1/users/enableLdap", payload); 
    }

    /**
     * Methos to disable ldap for a user
     * @param {*} payload 
     * @returns a ajax response object
     */
    disableLdap(payload) {
        return jwtInterceptor.put(apiurl + "/v1/users/disableLdap",  payload); 
    }

    /**
     * Method to enable mfa enforcement for a user
     * @param {*} payload 
     * @returns a ajax response object
     */
    enableMfaEnforce(payload) {
        return jwtInterceptor.put(apiurl + "/v1/users/enforceMfa",  payload);
    }

    /**
     * Method to disable mfa enforcement for a user
     * @param {*} payload 
     * @returns a ajax response object
     */
    disableMfaEnforce(payload) {
        return jwtInterceptor.put(apiurl + "/v1/users/unenforceMfa",  payload);
    }
}
export default new UsersService();