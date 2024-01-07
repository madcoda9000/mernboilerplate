import jwtInterceptor from "../components/shared/Auth/jwtInterceptor";
const apiurl = window.BASE_URL;

class SecretsService {

    constructor(props) {
        this.getRolesForUser = this.getRolesForUser.bind();
        this.getSecretsPaged = this.getSecretsPaged.bind();
        this.getPassword = this.getPassword.bind();
        this.getUsername = this.getUsername.bind();
        this.getSecretDescription = this.getSecretDescription.bind();
        this.getSingleSecretDecr = this.getSingleSecretDecr.bind();  
        this.getSecret = this.getSecret.bind();   
        this.updateSecret = this.updateSecret.bind();  
        this.getSecretHistory = this.getSecretHistory.bind();
        this.getSecretHistoryPassword = this.getSecretHistoryPassword.bind();
        this.getSecretHistoryUsername = this.getSecretHistoryUsername.bind();
        this.getSecretsDecr = this.getSecretsDecr.bind();
        this.getSecretHistoryDescription = this.getSecretHistoryDescription.bind();
        this.deleteSecret = this.deleteSecret.bind();
        this.checkIfSecretExists = this.checkIfSecretExists.bind();
        this.importSecret = this.importSecret.bind();
    }

    /**
     * @name importSecret
     * @description method to import a secret
     * @param {Array} payload post params
     * @returns ajax response object
     */
    importSecret(payload) {
        return jwtInterceptor.post(apiurl + "/api/Secrets/importSecret", payload);
    }

    /**
     * @name checkIfSecretExists
     * @description method to check if a secret exists
     * @param {Array} payload post params
     * @returns ajax response object
     */
    checkIfSecretExists(payload) {
        return jwtInterceptor.post(apiurl + "/api/Secrets/checkIfSecretExists", payload);
    }

    /**
     * @name deleteSecret
     * @description method to delete a secret
     * @param {Array} payload post params
     * @returns ajax response object
     */
    deleteSecret(payload) {
        return jwtInterceptor.post(apiurl + "/api/Secrets/deleteSecret", payload);
    }

    /**
     * @name getSecretsDecr
     * @description method to fetch a list of decrypted secrets
     * @returns ajax response object
     */
    getSecretsDecr() {
        return jwtInterceptor.post(apiurl + "/api/Secrets/getSecretsDecr");
    }

    /**
     * @name getSecretHistoryDescription
     * @description get the description of a secrtes history entry
     * @param {Array} payload post params
     * @returns ajax reponse object
     */
    getSecretHistoryDescription(payload) {
        return jwtInterceptor.post(apiurl + "/api/Secrets/getSecretHistoryDescription", payload);
    }

    /**
     * @name getSecretHistoryUsername
     * @description mehtod to  feth a secrets history username
     * @param {Array} payload post params
     * @returns ajax reponse object
     */
    getSecretHistoryUsername(payload) {
        return jwtInterceptor.post(apiurl + "/api/Secrets/getSecretHistoryUsername", payload);
    }

    /**
     * @name getSecretHistoryPassword
     * @description mehtod to fetch a secrets history password
     * @param {Array} payload post params
     * @returns ajax reponse object
     */
    getSecretHistoryPassword(payload) {
        return jwtInterceptor.post(apiurl + "/api/Secrets/getSecretHistoryPassword", payload);
    }

    /**
     * @name getSecretHistory
     * @description mehtod to get a secrets history
     * @param {Array} payload post params
     * @returns ajax reponse object
     */
    getSecretHistory(payload) {
        return jwtInterceptor.post(apiurl + "/api/Secrets/getSecretHistory", payload);
    }

    /**
     * @name updateSecret
     * @description mehtod to update a secret onject
     * @param {Array} payload post params
     * @returns ajax reponse object
     */
    updateSecret(payload) {
        return jwtInterceptor.post(apiurl + "/api/Secrets/updateSecret", payload);
    }

    /**
     * @name getSecret
     * @description method to fetch a single secret
     * @param {Array} paylod post params
     * @returns ajax respponse object
     */
    getSecret(payload) {
        return jwtInterceptor.post(apiurl + "/api/Secrets/getSecret", payload);
    }

    /**
     * @name newSecret
     * @description method to create a new secret
     * @param {Array} payload post parameters
     * @returns ajax respponse object
     */
    newSecret(payload) {
        return jwtInterceptor.post(apiurl + "/api/Secrets/newSecret", payload);
    }

    /**
     * @name getSecretDescription
     * @description method to fetch a secrets description
     * @param {Array} payload post parameters
     * @returns ajax respponse object
     */
    getSecretDescription(payload) {
        return jwtInterceptor.post(apiurl + "/api/Secrets/getSecretDescription", payload);
    }

    /**
     * @name getSingleSecretDecr
     * @description method to fetch a single decrypted secret 
     * @param {Array} payload post parameters
     * @returns ajax respponse object
     */
    getSingleSecretDecr(payload) {
        return jwtInterceptor.post(apiurl + "/api/Secrets/getSingleSecretDecr", payload);
    }

    /**
     * @name getUsername
     * @description method to fetch the username of a secret
     * @param {Array} payload post parameters
     * @returns ajax respponse object
     */
    getUsername(payload) {
        return jwtInterceptor.post(apiurl + "/api/Secrets/getUsername", payload);
    }

    /**
     * @name getPassword
     * @description method to fetch a secrets password
     * @param {Array} payload post parameters
     * @returns ajax respponse object
     */
    getPassword(payload) {
        return jwtInterceptor.post(apiurl + "/api/Secrets/getPassword", payload);
    }

    /**
     * @name getRolesForUser
     * @description method to roles assigned to a user
     * @param {Array} payload post parameters
     * @returns ajax respponse object
     */
    getRolesForUser() {
        return jwtInterceptor.post(apiurl + "/api/Secrets/getRolesForUser");
    }

    /**
     * @name getSecretsPaged
     * @description method to fetch a paged list of secrets
     * @param {Array} payload post parameters
     * @returns ajax respponse object
     */
    getSecretsPaged(payload) {
        return jwtInterceptor.post(apiurl + "/api/Secrets/getSecretsPaged", payload);
    }
}
export default new SecretsService();