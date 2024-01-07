import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @description Component to chek if a user is authenticated and is a member of a given role.
 * @param {string} requiredRole the name of the required role. Use 'any' to allow everyone.
 */
const RoleChecker = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      const decodedToken = JSON.parse(sessionStorage.getItem("user"));
      console.log("ROLECHECK: fetched user from session storage");
      console.log("ROLECHECK: ForcedRole:" + props.requiredRole + " | UserRoles:" + decodedToken.roles);
      if (!decodedToken) {
        navigate("/login");
      }
      if (props.requiredRole !== "any" && !decodedToken.roles.includes(props.requiredRole)) {
        console.log("wech hier");
        //navigate("/Status403");
      }
    } else {
      console.log("ROLECHECK: fetching user from session storage failed!");
      navigate("/login");
    }
  }, [navigate, props.requiredRole]);
};

export default RoleChecker;
