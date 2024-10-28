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

/**
 * Auth context provider function that handles user authentication actions like login, logout, and context refresh.
 *
 * @param {AuthContextProviderProps} children - The children elements to be rendered within the AuthContextProvider.
 */
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

  /**
   * Handles user authentication actions after a successful login response.
   *
   * @param {AxiosResponse} apiResponse - The response object from the API.
   * @param {string | null} action - The action to be taken after successful login. Can be "login" or null.
   */
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

  /**
   * Performs a login request to the API using the given payload.
   * If the request is successful, sets the user object in the context and navigates to the home page.
   * If the request fails, returns the error message.
   *
   * @param {LoginPayload} payload - The payload to be sent to the API.
   * @returns {Promise<string | undefined>} - A promise that resolves to an error message if the request fails, or undefined if the request is successful.
   */
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

  /**
   * Logs the user out by removing the user from session storage and making a request to the API to invalidate the user's session.
   * After the request is made, navigates the user to the login page with a query parameter indicating that the user was logged out.
   *
   * @returns {Promise<void>} - A promise that resolves when the user is logged out.
   */
  const logout = async (): Promise<void> => {
    await axios.get(apiurl + "/v1/auth/logout", { withCredentials: true })

    sessionStorage.removeItem("user")

    setUser(null)
    navigate("/login?msg=lgo")
  }

  /**
   * Refreshes the user object in the context by reading the user from session storage again.
   * This function is used in case the user object has been changed outside of the context, for example
   * when the user's role has been updated in the database.
   */
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

export const useAuthContext = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext muss innerhalb von AuthContextProvider verwendet werden.")
  }
  return context
}
