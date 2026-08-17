import { createContext, useContext } from "react";

// Auth is mocked out for frontend development.
// All pages are accessible without a real token.
const AuthContext = createContext(null);

const MOCK_USER = { id: 1, username: "dev", email: "dev@medicare.local" };
const MOCK_TOKEN = "mock-token";

export function AuthProvider({ children }) {
    function saveAuth() { }
    function clearAuth() { }

    return (
        <AuthContext.Provider value={{
            token: MOCK_TOKEN,
            user: MOCK_USER,
            saveAuth,
            clearAuth,
            isAuthenticated: true,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
