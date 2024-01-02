import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MfaChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      const decodedToken = JSON.parse(sessionStorage.getItem("user"));
      console.log("MFACHECK: fetched user from session storage");
      console.log(
        "MFACHECK: mfaEnabled:" + decodedToken.mfaEnabled + " | mfaEnforced:" + decodedToken.mfaEnforced + " | mfaVerified: " + decodedToken.mfaVerified
      );

      if (decodedToken.mfaEnabled === true && decodedToken.mfaVerified === undefined) {
        navigate("/MfaLogin");
      }

      if (decodedToken.mfaEnabled === true && decodedToken.mfaVerified === false) {
        navigate("/MfaLogin");
      }

      if (decodedToken.mfaEnabled === false && decodedToken.mfaVerified === false && decodedToken.mfaEnforced === true) {
        navigate("/MfaSetup");
      }
    } else {
      console.log("MFACHECK: fetching user from session storage failed!");
      navigate("/login");
    }
  }, [navigate]);
};

export default MfaChecker;
