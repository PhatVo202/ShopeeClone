import React, { createContext, useState } from "react"
import { getAccessTokentoLocalStorages } from "src/utils/auth"

interface AppContextInterface {
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

interface MyContextProviderProps {
    children: React.ReactNode;
}

const DEFAULT_VALUE: AppContextInterface = {
    isAuthenticated: Boolean(getAccessTokentoLocalStorages()),
    setIsAuthenticated: () => null
}

export const AppContext = createContext<AppContextInterface>(DEFAULT_VALUE)

export const ContextProvider = ({ children }: MyContextProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(DEFAULT_VALUE.isAuthenticated)

    return <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        {children}
    </AppContext.Provider>
}
