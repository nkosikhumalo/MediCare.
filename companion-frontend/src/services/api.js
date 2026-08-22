/** Shared API base for the Node.js BFF.
 *  On Android (Capacitor), localhost won't resolve — use the machine's LAN IP.
 *  Set VITE_API_BASE in .env.local to override (e.g. http://10.245.65.75:5000).
 */
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export function getToken() {
    return sessionStorage.getItem("token");
}

export function authHeaders(extra = {}) {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}

/**
 * Fetch wrapper that surfaces API error messages and handles auth failures.
 */
export async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            ...authHeaders(),
            ...(options.headers || {}),
        },
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        const msg = data.message || "Session expired. Please log in again.";
        const err = new Error(msg);
        err.status = 401;
        err.code = "UNAUTHORIZED";
        throw err;
    }

    if (!res.ok) {
        const err = new Error(data.message || data.error || `HTTP ${res.status}`);
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}
