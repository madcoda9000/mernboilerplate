import jwtInterceptor from "../components/shared/Auth/jwtInterceptor";
const apiurl = window.BASE_URL;

class RolesService {

    constructor(props) {
        this.getRoles = this.getRoles.bind();
        this.createRole = this.createRole.bind();
        this.deleteRole = this.deleteRole.bind();
        this.checkIfRoleExists = this.checkIfRoleExists.bind();
    }

    /**
     * method to check if a role exists
     * @param {*} payload post parameters
     * @returns ajax response object
     */
    checkIfRoleExists(payload) {
        return jwtInterceptor.post(apiurl + "/v1/roles/checkIfRoleExists", payload);
    }

    /**
     * method to create a new role
     * @param {*} payload post parameters
     * @returns 
     */
    createRole(payload) {
        return jwtInterceptor.post(apiurl + "/v1/roles/createRole", payload);
    }

    /* fetch methods */

    /**
     * @description methosd to fetch a paginated list of roles
     * @param {*} page 
     * @param {*} pageSize 
     * @param {*} searchParam 
     * @returns a ajax response
     */
    getRoles(page, pageSize, searchParam) {
        return jwtInterceptor.get(apiurl + "/v1/roles/paginated/" + page + "/" + pageSize + "/" + searchParam);
    }

    /* delete methods */

    /**
     * Method to delete a role
     * @param {*} payload 
     * @returns a ajax response
     */
    deleteRole(payload) {
        return jwtInterceptor.post(apiurl + "/v1/roles/deleteRole", payload);
    }

}
export default new RolesService();