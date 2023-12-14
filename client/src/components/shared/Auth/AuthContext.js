import axios from "axios";
import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { isMobile } from 'react-device-detect';
import {makeAuditEntry} from "../Utils";

const apiurl = window.BASE_URL;
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    if (sessionStorage.getItem("accessToken")) {
      const tokens = JSON.parse(sessionStorage.getItem("accessToken"));
      const decodedToken = jwtDecode(tokens);
      console.log("AuthContext: AUTH:true");
      return decodedToken;
    }
    console.log('AuthContext: no accessToken | ACTION: logout');
    navigate('/login');
  });

  const handleUserAction = (apiResponse, action) => {
    sessionStorage.setItem("accessToken", JSON.stringify(apiResponse.data.accessToken));
    sessionStorage.setItem("refreshToken", JSON.stringify(apiResponse.data.refreshToken));
    setUser(jwtDecode(apiResponse.data.accessToken));

    if(action!==null && action==='login') {
      var us = jwtDecode(apiResponse.data.accessToken);
      var logonType = us.ldapEnabled===true ? 'ldap' : 'db';
      makeAuditEntry(us.userName, 'info', us.userName + ' ' + logonType + ' login in successfully.');
    }

    navigate( isMobile ? "/Mobile/MHome" : "/Home");
  };


  const login = async (payload) => {
    try {
      const apiResponse = await axios.post(apiurl + "/v1/auth/login", payload);
      if (apiResponse.data.error === false) {   
        handleUserAction(apiResponse, 'login');
      } else if (apiResponse.data.error === true) {
        return apiResponse.data.message;
      }
    } catch (error) {
      return error.response.data.message;     
    }
  };

  const logout = async () => {
    if (sessionStorage.getItem("refreshToken")) {
      const payload = {
        refreshToken: JSON.parse(sessionStorage.getItem("refreshToken"))
      }
      await axios.post(apiurl + "/v1/auth/logout", payload);
    }

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");     

    setUser(null);
    navigate("/login?msg=lgo");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;