import {createContext, useState, useContext, type ReactNode, useEffect} from 'react';

type AuthentiContextType = {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
};

const AuthentiContext = createContext<AuthentiContextType | undefined>(undefined);

export const AuthentiProvider = ({children}: {children: ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        
    };
    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    if (loading) return null;

    return(
        <AuthentiContext.Provider value={{isAuthenticated, login, logout}}>
            {children}
        </AuthentiContext.Provider>
    );
};

export const useAuthenti = () => {
    const context = useContext(AuthentiContext);
    if(!context){
        throw new Error('useAuthenti must be used within an AuthentiProvider')
    }
    return context;
}