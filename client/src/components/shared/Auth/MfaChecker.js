import {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const MfaChecker = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem("accessToken")) {
            const tokens = JSON.parse(sessionStorage.getItem("accessToken"));
            const decodedToken = jwtDecode(tokens);
            console.log('MFACHECK: fetched user from token');
            console.log('MFACHECK: mfaEnabled:' + decodedToken.mfaEnabled + ' | mfaEnforced:' + decodedToken.mfaEnforced + ' | mfaVerified: ' + decodedToken.mfaVerified );

            if(decodedToken.mfaEnabled===true && decodedToken.mfaVerified===false) {
                navigate("/MfaLogin");
            }

            if(decodedToken.mfaEnabled===false && decodedToken.mfaVerified===false && decodedToken.mfaEnforced===true) {
                navigate("/MfaSetup");
            }
        } else {
            console.log('MFACHECK: fetching user from token failed!');
            navigate('/login');
        }
    },[navigate]);
}

export default MfaChecker;