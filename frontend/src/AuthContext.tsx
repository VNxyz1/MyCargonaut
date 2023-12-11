import {createContext, useState, useContext, ReactNode, useEffect} from 'react';

type AuthContextType = {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    checkLoginStatus: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedAuthStatus = localStorage.getItem('isAuthenticated');
        return storedAuthStatus ? JSON.parse(storedAuthStatus) : false;
    });

    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/auth/login');
            const data = await response.json();

            console.log("CLIENT - AUTH-CONTEXT: CHECK LOGIN STATE - LOGGEDIN: " + data.isLoggedIn)

            if (data.isLoggedIn) {
                login();
            } else {
                logout();
            }
        } catch (error) {
            console.error('Error checking login status:', error);
        }
    };

    const login = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', JSON.stringify(true));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };


    const contextValue: AuthContextType = {
        isAuthenticated,
        login,
        logout,
        checkLoginStatus,
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);


    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };