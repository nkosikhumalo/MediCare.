import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/settings.css";

function Settings() {
    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(
        document.body.classList.contains("dark")
    );

    function toggleTheme() {
        const next = !darkMode;
        setDarkMode(next);
        document.body.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
    }

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
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                        <h3>Appearance</h3>
                    </div>
                    <p>Switch between light and dark mode.</p>
                    <button onClick={toggleTheme} className={darkMode ? "setting-btn-active" : ""}>
                        {darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    </button>
                </div>

                {/* About */}
                <div className="setting-card">
                    <div className="setting-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <h3>About Candor</h3>
                    </div>
                    <p>
                        Candor is your AI companion for MediCare — helping you understand your health cover,
                        submit claims, update personal details, and explore your options, all in plain language.
                    </p>
                    <div className="setting-meta">
                        <span>Version 1.0.0</span>
                        <span>MediCare © 2026</span>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Settings;
