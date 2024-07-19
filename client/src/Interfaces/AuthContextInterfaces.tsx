import { ReactNode } from "react"
import { User } from "@/Interfaces/GlobalInterfaces"
import { LoginPayload } from "@/Interfaces/PayLoadINterfaces"

/**
 * Represents the props for the AuthContext.
 */
export interface AuthContextProps {
  /**
   * The currently authenticated user.
   */
  user: User | null

  /**
   * Performs a login with the provided payload.
   *
   * @param payload - The login payload.
   * @returns A Promise that resolves with a string or undefined.
   */
  login: (payload: LoginPayload) => Promise<string | undefined>

  /**
   * Performs a logout.
   *
   * @returns A Promise that resolves when the logout is complete.
   */
  logout: () => Promise<void>

  /**
   * Refreshes the context.
   */
  refreshContext: () => void
}

/**
 * Represents the props for the AuthContextProvider.
 */
export interface AuthContextProviderProps {
  /**
   * The child components.
   */
  children: ReactNode
}
