import { ReactNode } from "react"
import { User } from "./GlobalInterfaces"
import { loginPayload } from "./PayLoadINterfaces"

export interface AuthContextProps {
  user: User | null
  login: (payload: loginPayload) => Promise<string | undefined>
  logout: () => Promise<void>
  refreshContext: () => void
}

export interface AuthContextProviderProps {
  children: ReactNode
}
