import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import UserService from "../../../Services/UsersService";
import {isMobile} from 'react-device-detect';
import AuthContext from "./AuthContext";

const ProtectedRoute = ({ children, accessBy, request }) => {
    const { user } = useContext(AuthContext);
    const [mfaVerify, setMfaVerify] = useState(false);
    const [doLogout, setDoLogout] = useState(false);
  
    useEffect(() => {         
        if (user && user.mfaEnabled===true && sessionStorage.getItem("acc")) {
          console.log('ProtectedRoute : useEffect : ' + user.username);
          var mfatoken = sessionStorage.getItem("acc");
          let ppayload = {
            mfaToken: mfatoken,
            userId: user.sid
          }
          const checkMfaToken = () => {
            if (sessionStorage.getItem("acc")) {
              UserService.verifyMfaAuth(ppayload).then((response) => {
                if (response.data.success === true) {
                  setMfaVerify(response.data.success);
                  console.log('ProtectedRoute: AUTH:true | checkMfaToken:token verified');
                  setDoLogout(false);
                } else {
                  console.log('ProtectedRoute: checkMfaToken: token verification failed');
                  console.log('ProtectedRoute: checkMfaToken: removing tokens');
                  sessionStorage.removeItem("tokens");
                  setDoLogout(true);
                }
              });
            } else {
              console.log('ProtectedRoute: checkMfaToken: no mfa token found');
              console.log('ProtectedRoute: checkMfaToken: removing tokens');
              sessionStorage.removeItem("tokens");
              setDoLogout(true);
            }
          }
          checkMfaToken();
        }
    },);
  
    if (accessBy === "non-authenticated") {
      return children
    } else if (accessBy === "authenticated") {
      if (user) {
        if(doLogout===true && user.mfaEnabled==='True') {
          console.log('dologout');
          if(isMobile) {return <Navigate to="/Mobile/Mlogin"></Navigate>;} else {return <Navigate to="/login"></Navigate>;}
        }
        if (user.mfaEnforced === true && user.mfaEnabled === false) {
          console.log('ProtectedRoute: REQUEST: ' + request);
          console.log('ProtectedRoute: AUTH:true | MFA:enforced | ACTION:/MfaSetup');        
          if(request==='/MfaSetup' || request==='/Mobile/MMfaSetup') {
            return children;
          } else {
            if(isMobile) {return <Navigate to="/Mobile/MMfaSetup"></Navigate>;} else {return <Navigate to="/MfaSetup"></Navigate>;}
          }
        }
        else if (user.mfaEnforced === false && user.mfaEnabled === true && !sessionStorage.getItem("acc")) {
          console.log('ProtectedRoute: REQUEST: ' + request);
          console.log('ProtectedRoute: AUTH:true | MFA:enabled | ACTION:/MfaLogin');
          if(request==='/MfaLogin' || request==='/Mobile/MMfaLogin') {
            return children;
          } else {
            if(isMobile) { return <Navigate to="/Mobile/MMfaLogin"></Navigate>;} else { return <Navigate to="/MfaLogin"></Navigate>;}
           
          }
        }
        else if (user.mfaEnforced === false && user.mfaEnabled === true && sessionStorage.getItem("acc")) {
          console.log('ProtectedRoute: REQUEST: ' + request + ' (verifying mfa token)');
          if (mfaVerify) {
            console.log('ProtectedRoute: AUTH:true | MFA:verified | ACTION:' + request);
            return children;
          }
        }
        else if (user.mfaEnforced === false && user.mfaEnabled === false) {
          console.log('ProtectedRoute: REQUEST: ' + request);
          console.log('ProtectedRoute: AUTH:true | MFA:disabled | ACTION:' + request);
          return children;
        }
        else {
          console.log('Protectedroute: no rule matched. returning login');
          window.location.href = "/login";
        }
      } else {
        console.log('Protectedroute: no user object');
        window.location.href = "/login";
      }
    }
    //return <Navigate to="/login"></Navigate>;
  };
  
  export default ProtectedRoute;