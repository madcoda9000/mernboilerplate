import { ReactNode } from "react"
import { User } from "./GlobalInterfaces"
import { LoginPayload } from "./PayLoadINterfaces"

export interface AuthContextProps {
  user: User | null
  login: (payload: LoginPayload) => Promise<string | undefined>
  logout: () => Promise<void>
  refreshContext: () => void
}

export interface AuthContextProviderProps {
  children: ReactNode
}
