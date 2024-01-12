import axios, { AxiosError, AxiosResponse } from "axios"
import { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isMobile } from "react-device-detect"
import LogsService from "@/Services/LogsService"
import { AuditEntryPayload, LoginPayload } from "@/Interfaces/PayLoadINterfaces"
import { AuthContextProps, AuthContextProviderProps } from "@/Interfaces/AuthContextInterfaces"
import { User } from "@/Interfaces/GlobalInterfaces"

declare const window: {
  BASE_URL: string
} & Window

const apiurl = window.BASE_URL
const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(() => {
    if (sessionStorage.getItem("user")) {
      const tokens = JSON.parse(sessionStorage.getItem("user")!)
      if (tokens) {
        console.log("AuthContext: AUTH:true")
        return tokens as User
      } else {
        console.log("AuthContext: AUTH:false | no user object")
        return null
      }
    }
    console.log("AuthContext: AUTH:false | no user object")
    return null
  })

  const handleUserAction = (apiResponse: AxiosResponse, action: string | null) => {
    sessionStorage.setItem("user", JSON.stringify(apiResponse.data.user))
    setUser(apiResponse.data.user)

    if (action !== null && action === "login") {
      const us = apiResponse.data.user
      const logonType = us.ldapEnabled === true ? "ldap" : "db"
      const payload: AuditEntryPayload = {
        user: us.userName,
        level: "info",
        message: us.userName + " " + logonType + " login in successfully.",
      }
      LogsService.createAuditEntry(payload)
      if (us.mfaEnforced === true) {
        console.log("AuthContext: login:success | ACTION: MfaSetup")
        navigate("/MfaSetup")
      } else if (us.mfaEnabled === true) {
        console.log("AuthContext: login:success | ACTION: MfaLogin")
        navigate("/MfaLogin")
      } else if (us.mfaEnforced === false && us.mfaEnabled === false) {
        console.log("AuthContext: login:success | ACTION: /Home")
        navigate("/Home")
      }
    } else {
      console.log("AuthContext: login:success | ACTION: /Home")
      navigate(isMobile ? "/Mobile/MHome" : "/Home")
    }
  }

  const login = async (payload: LoginPayload): Promise<string | undefined> => {
    try {
      const apiResponse = await axios.post(apiurl + "/v1/auth/login", payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      if (apiResponse.data.error === false) {
        handleUserAction(apiResponse, "login")
      } else if (apiResponse.data.error === true) {
        return apiResponse.data.message
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return error.response?.data?.message
      } else {
        return String(error)
      }
    }
  }

  const logout = async (): Promise<void> => {
    await axios.get(apiurl + "/v1/auth/logout", { withCredentials: true })

    sessionStorage.removeItem("user")

    setUser(null)
    navigate("/login?msg=lgo")
  }

  const refreshContext = () => {
    const tok = sessionStorage.getItem("user")
    setUser(JSON.parse(tok!))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshContext }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook für den einfacheren Zugriff auf den AuthContext
export const useAuthContext = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext muss innerhalb von AuthContextProvider verwendet werden.")
  }
  return context
}
