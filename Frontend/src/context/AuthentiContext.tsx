import {createContext, useState, useContext, type ReactNode} from 'react';

type AuthentiContextType = {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
};

const AuthentiContext = createContext<AuthentiContextType | undefined>(undefined);

export const AuthentiProvider = ({children}: {children: ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    return(
        <AuthentiContext.Provider value={{isAuthenticated, login, logout}}>
            {children}
        </AuthentiContext.Provider>
    );
};

export const useAuthenti = (): AuthentiContextType => {
    const context = useContext(AuthentiContext);
    if(!context){
        throw new Error('useAuthenti must be used within an AuthentiProvider')
    }
    return context;
}