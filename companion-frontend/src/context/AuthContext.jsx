import { createContext, useContext, useEffect, useState } from "react";
import { getSession, logout } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(false); // Boolean compatibility flag; JWT itself stays HttpOnly.
    const [user, setUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        // Remove legacy browser-readable credentials left by earlier builds.
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        let active = true;
        getSession()
            .then(({ user: sessionUser }) => {
                if (!active) return;
                setUser(sessionUser);
                setToken(true);
            })
            .catch(() => {
                if (!active) return;
                setUser(null);
                setToken(false);
            })
            .finally(() => { if (active) setAuthReady(true); });

        const onExpired = () => {
            setUser(null);
            setToken(false);
            setAuthReady(true);
        };
        const onConsentChanged = (event) => {
            if (event.detail !== "accepted") {
                setUser(null);
                setToken(false);
                setAuthReady(true);
                return;
            }
            setAuthReady(false);
            getSession()
                .then(({ user: sessionUser }) => { if (active) { setUser(sessionUser); setToken(true); } })
                .catch(() => { if (active) { setUser(null); setToken(false); } })
                .finally(() => { if (active) setAuthReady(true); });
        };
        window.addEventListener("auth:expired", onExpired);
        window.addEventListener("cookie-consent-changed", onConsentChanged);
        return () => {
            active = false;
            window.removeEventListener("auth:expired", onExpired);
            window.removeEventListener("cookie-consent-changed", onConsentChanged);
        };
    }, []);

    function saveAuth(nextUser) {
        setUser(nextUser);
        setToken(true);
        setAuthReady(true);
    }

    function clearAuth() {
        setUser(null);
        setToken(false);
        setAuthReady(true);
        void logout();
    }

    return (
        <AuthContext.Provider value={{ token, user, authReady, saveAuth, clearAuth, isAuthenticated: token }}>
            {children}
        </AuthContext.Provider>
    );
}

// Context hooks share their provider module by design; neither is a component export.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}
