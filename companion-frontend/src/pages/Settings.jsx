import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import "../styles/settings.css";

const SA_PROVINCES = [
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
    "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape",
];

export default function Settings() {
    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(document.body.classList.contains("dark"));

    function toggleTheme() {
        const next = !darkMode;
        setDarkMode(next);
        document.body.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
    }

    // ── Address update ────────────────────────────────────────────────────────
    const [address, setAddress] = useState({
        streetAddress: "", suburb: "", city: "", province: "Gauteng", postalCode: "",
    });
    const [document_, setDocument_] = useState(null);
    const [addrErrors, setAddrErrors] = useState({});
    const [addrLoading, setAddrLoading] = useState(false);
    const [addrResult, setAddrResult] = useState(null);
    const [addrApiError, setAddrApiError] = useState(null);
    const [loadingCurrent, setLoadingCurrent] = useState(true);

    // Load current address on mount
    useEffect(() => {
        apiFetch("/api/self-service/address")
            .then(data => {
                setAddress({
                    streetAddress: data.streetAddress || "",
                    suburb: data.suburb || "",
                    city: data.city || "",
                    province: data.province || "Gauteng",
                    postalCode: data.postalCode || "",
                });
            })
            .catch(() => {}) // silently ignore — user can still fill in manually
            .finally(() => setLoadingCurrent(false));
    }, []);

    function handleAddrChange(e) {
        const { name, value } = e.target;
        setAddress(p => ({ ...p, [name]: value }));
        setAddrErrors(p => ({ ...p, [name]: "" }));
        setAddrResult(null);
        setAddrApiError(null);
    }

    function validateAddr() {
        const errs = {};
        if (!address.streetAddress.trim()) errs.streetAddress = "Street address is required";
        if (!address.city.trim()) errs.city = "City is required";
        if (!address.province) errs.province = "Province is required";
        if (address.postalCode && !/^\d{4}$/.test(address.postalCode)) errs.postalCode = "Postal code must be 4 digits";
        return errs;
    }

    async function submitAddress() {
        const errs = validateAddr();
        if (Object.keys(errs).length) { setAddrErrors(errs); return; }

        setAddrLoading(true);
        setAddrApiError(null);
        setAddrResult(null);

        try {
            const formData = new FormData();
            formData.append("streetAddress", address.streetAddress);
            formData.append("suburb", address.suburb || "");
            formData.append("city", address.city);
            formData.append("province", address.province);
            formData.append("postalCode", address.postalCode || "");
            if (document_) formData.append("document", document_);

            const token = sessionStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_BASE || "http://localhost:5000"}/api/self-service/address`, {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
            setAddrResult(data);
            setDocument_(null);
        } catch (err) {
            setAddrApiError(err.message || "Update failed. Please try again.");
        } finally {
            setAddrLoading(false);
        }
    }

    const isProvinceChange = address.province && address.province !== "Gauteng";

    return (
        <div className="settings-page">
            <div className="settings-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" style={{ marginRight: 5 }}>
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back
                </button>
                <h1>Settings</h1>
            </div>

            <div className="settings-body">

                {/* Appearance */}
                <div className="setting-card">
                    <div className="setting-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                        <h3>Appearance</h3>
                    </div>
                    <p>Switch between light and dark mode.</p>
                    <button onClick={toggleTheme} className={darkMode ? "setting-btn-active" : ""}>
                        {darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    </button>
                </div>

                {/* Address update */}
                <div className="setting-card">
                    <div className="setting-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <h3>Update address</h3>
                    </div>
                    <p>Keep your residential address up to date. A province change requires proof of residence.</p>

                    {loadingCurrent ? (
                        <p className="addr-loading">Loading current address…</p>
                    ) : (
                        <>
                            <div className="addr-form">
                                <div className="addr-field">
                                    <label>Street address *</label>
                                    <input name="streetAddress" value={address.streetAddress}
                                        onChange={handleAddrChange} placeholder="e.g. 12 Jacaranda Avenue" />
                                    {addrErrors.streetAddress && <span className="addr-err">{addrErrors.streetAddress}</span>}
                                </div>

                                <div className="addr-row">
                                    <div className="addr-field">
                                        <label>Suburb</label>
                                        <input name="suburb" value={address.suburb}
                                            onChange={handleAddrChange} placeholder="e.g. Waterkloof" />
                                    </div>
                                    <div className="addr-field">
                                        <label>City *</label>
                                        <input name="city" value={address.city}
                                            onChange={handleAddrChange} placeholder="e.g. Pretoria" />
                                        {addrErrors.city && <span className="addr-err">{addrErrors.city}</span>}
                                    </div>
                                </div>

                                <div className="addr-row">
                                    <div className="addr-field">
                                        <label>Province *</label>
                                        <select name="province" value={address.province} onChange={handleAddrChange}>
                                            {SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                        {addrErrors.province && <span className="addr-err">{addrErrors.province}</span>}
                                    </div>
                                    <div className="addr-field">
                                        <label>Postal code</label>
                                        <input name="postalCode" value={address.postalCode}
                                            onChange={handleAddrChange} placeholder="e.g. 0181" maxLength={4} />
                                        {addrErrors.postalCode && <span className="addr-err">{addrErrors.postalCode}</span>}
                                    </div>
                                </div>

                                {isProvinceChange && (
                                    <div className="addr-province-notice">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                        Province change detected — please attach a proof of residence (utility bill, bank statement, etc.)
                                    </div>
                                )}

                                <div className="addr-field">
                                    <label>Proof of residence {isProvinceChange ? "*" : "(optional)"}</label>
                                    <div className="addr-file-wrap">
                                        <label className="addr-file-btn">
                                            {document_ ? document_.name : "Choose file…"}
                                            <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={e => { setDocument_(e.target.files[0] || null); setAddrResult(null); }} />
                                        </label>
                                        {document_ && (
                                            <button className="addr-file-clear" onClick={() => setDocument_(null)} type="button">✕</button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {addrApiError && <p className="addr-api-err">{addrApiError}</p>}

                            {addrResult && (
                                <div className={`addr-result addr-result-${addrResult.status === "APPROVED" ? "ok" : "warn"}`}>
                                    <strong>{addrResult.status === "APPROVED" ? "✓ Updated" : "⚠ " + addrResult.status}</strong>
                                    <p>{addrResult.message}</p>
                                    {addrResult.referenceId && (
                                        <span className="addr-ref">Ref: {addrResult.referenceId}</span>
                                    )}
                                </div>
                            )}

                            <button className="setting-btn-primary" onClick={submitAddress} disabled={addrLoading}>
                                {addrLoading ? "Saving…" : "Save address"}
                            </button>
                        </>
                    )}
                </div>

                {/* About */}
                <div className="setting-card">
                    <div className="setting-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <h3>About Candor</h3>
                    </div>
                    <p>Candor is your AI companion for MediCare — helping you understand your cover, submit claims, update personal details, and explore your options, all in plain language.</p>
                    <div className="setting-meta">
                        <span>Version 1.0.0</span>
                        <span>MediCare © 2026</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
