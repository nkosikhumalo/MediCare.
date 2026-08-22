import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => sessionStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    function saveAuth(nextToken, nextUser) {
        sessionStorage.setItem("token", nextToken);
        sessionStorage.setItem("user", JSON.stringify(nextUser));
        setToken(nextToken);
        setUser(nextUser);
    }

    function clearAuth() {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{
            token,
            user,
            saveAuth,
            clearAuth,
            isAuthenticated: Boolean(token),
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
