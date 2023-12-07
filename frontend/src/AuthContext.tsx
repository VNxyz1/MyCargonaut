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
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/auth/login');
            const data = await response.json();

            console.log("AUTH-CONTEXT: CHECK LOGIN STATE - LOGGEDIN: " + data.isLoggedIn)

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
        console.log("AUTH-CONTEXT: SET LOGIN")
        setIsAuthenticated(true);
    };

    const logout = () => {
        console.log("AUTH-CONTEXT: SET LOGOUT")
        setIsAuthenticated(false);
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
