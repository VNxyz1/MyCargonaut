import {createContext, useState, useContext, ReactNode, useEffect} from 'react';

type AuthContextType = {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    checkLoginStatus: () => Promise<void>;
};

const AuthService = createContext<AuthContextType | undefined>(undefined);

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
        <AuthService.Provider value={contextValue}>
            {children}
        </AuthService.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthService);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };

/*-----Routen-----*/
export const logoutUser = async (): Promise<boolean> => {
    try {
        const res = await fetch("/auth/logout", {
            method: "POST",
            headers: { "Content-type": "application/json" },
        });

        if (res.ok) {
            return true;
        } else {
            console.error("Logout failed.");
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};
