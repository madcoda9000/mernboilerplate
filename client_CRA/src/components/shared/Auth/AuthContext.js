import axios from "axios";
import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { makeAuditEntry } from "../Utils";

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
    console.log("AuthContext: no accessToken | ACTION: logout");
    navigate("/login");
  });

  const handleUserAction = (apiResponse, action) => {
    sessionStorage.setItem("user", JSON.stringify(apiResponse.data.user));
    setUser(apiResponse.data.user);

    if (action !== null && action === "login") {
      var us = apiResponse.data.user;
      var logonType = us.ldapEnabled === true ? "ldap" : "db";
      makeAuditEntry(us.userName, "info", us.userName + " " + logonType + " login in successfully.");
      if (us.mfaEnforced === true) {
        console.log("AuthContext: login:success | ACTION: MfaSetup");
        navigate("/MfaSetup");
      } else if (us.mfaEnabled === true) {
        console.log("AuthContext: login:success | ACTION: MfaLogin");
        navigate("/MfaLogin");
      } else if (us.mfaEnforced === false && us.mfaEnabled === false) {
        console.log("AuthContext: login:success | ACTION: /Home");
        navigate("/Home");
      }
    } else {
      console.log("AuthContext: login:success | ACTION: /Home");
      navigate(isMobile ? "/Mobile/MHome" : "/Home");
    }
  };

  const login = async (payload) => {
    try {
      const apiResponse = await axios.post(apiurl + "/v1/auth/login", payload, { headers: { "Content-Type": "application/json" }, withCredentials: true });
      if (apiResponse.data.error === false) {
        handleUserAction(apiResponse, "login");
      } else if (apiResponse.data.error === true) {
        return apiResponse.data.message;
      }
    } catch (error) {
      console.log(error);
      return error.response.data.message;
    }
  };

  const logout = async () => {
    await axios.get(apiurl + "/v1/auth/logout", { withCredentials: true });

    sessionStorage.removeItem("user");

    setUser(null);
    navigate("/login?msg=lgo");
  };

  const refreshContext = () => {
    var tok = sessionStorage.getItem("user");
    setUser(JSON.parse(tok));
  };

  return <AuthContext.Provider value={{ user, login, logout, refreshContext }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
