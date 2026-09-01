import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = token.split(".")[1];
        const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
        const claims = JSON.parse(atob(padded.replace(/-/g, "+").replace(/_/g, "/")));
        if (!claims.exp) return false;
        return claims.exp * 1000 <= Date.now() + 30_000;
    } catch {
        return true;
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => {
        const t = sessionStorage.getItem("token");
        if (t && isTokenExpired(t)) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            return null;
        }
        return t;
    });

    const [user, setUser] = useState(() => {
        try {
            if (!sessionStorage.getItem("token") || isTokenExpired(sessionStorage.getItem("token"))) {
                return null;
            }
            const u = sessionStorage.getItem("user");
            return u ? JSON.parse(u) : null;
        } catch {
            sessionStorage.removeItem("user");
            return null;
        }
    });

    // Periodically drop expired sessions
    useEffect(() => {
        if (!token) return;
        const id = setInterval(() => {
            if (isTokenExpired(token)) clearAuth();
        }, 60_000);
        return () => clearInterval(id);
    }, [token]);

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
        <AuthContext.Provider value={{ token, user, saveAuth, clearAuth, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
