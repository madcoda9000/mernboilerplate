import {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/**
 * @description Component to chek if a user is authenticated and is a member of a given role.
 * @param {string} requiredRole the name of the required role. Use 'any' to allow everyone. 
 */
const RoleChecker = (props) => {

    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem("accessToken")) {
            const tokens = JSON.parse(sessionStorage.getItem("accessToken"));
            const decodedToken = jwtDecode(tokens);
            console.log('ROLECHECK: fetched user from token');
            console.log('ROLECHECK: ForcedRole:' + props.requiredRole + ' | UserRoles:' + decodedToken.roles);
            if(!decodedToken) {
                navigate('/login');
            } 
            if(props.requiredRole!=='any' && !decodedToken.roles.includes(props.requiredRole)) {
                console.log('wech hier');
                //navigate("/Status403");
            }

        } else {
            console.log('ROLECHECK: fetching user from token failed!');
            navigate('/login');
        }

        
    },[navigate, props.requiredRole]);
}

export default RoleChecker;