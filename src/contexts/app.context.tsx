import React, { createContext, useState } from "react"
import { User } from "src/types/user.type"
import { getAccessTokentoLocalStorages, getProfileFromLS } from "src/utils/auth"

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
}

const DEFAULT_VALUE: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokentoLocalStorages()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
}

export const AppContext = createContext<AppContextInterface>(DEFAULT_VALUE)

export const ContextProvider = ({ children }: { children: React.ReactNode; }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(DEFAULT_VALUE.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(DEFAULT_VALUE.profile)
  return <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile }}>
    {children}
  </AppContext.Provider>
}
