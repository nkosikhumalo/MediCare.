import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

import "../styles/settings.css";

function Settings() {

    const navigate = useNavigate();

    const { language, changeLanguage } = useLanguage();

    const [voice, setVoice] = useState(
        localStorage.getItem("voice") !== "off"
    );

    const [darkMode, setDarkMode] = useState(
        document.body.classList.contains("dark")
    );

    const languages = [
        { code: "EN", name: "English" },
        { code: "AF", name: "Afrikaans" },
        { code: "ZU", name: "isiZulu" },
        { code: "XH", name: "isiXhosa" },
        { code: "ST", name: "Sesotho" },
        { code: "TN", name: "Setswana" },
        { code: "SS", name: "siSwati" },
        { code: "VE", name: "Tshivenda" },
        { code: "TS", name: "Xitsonga" },
        { code: "NR", name: "isiNdebele" },
        { code: "NSO", name: "Sepedi" }
    ];

    function toggleTheme() {

        const value = !darkMode;

        setDarkMode(value);

        document.body.classList.toggle("dark", value);

        localStorage.setItem(
            "theme",
            value ? "dark" : "light"
        );

    }

    function toggleVoice() {

        const value = !voice;

        setVoice(value);

        localStorage.setItem(
            "voice",
            value ? "on" : "off"
        );

    }

    function changeLanguageSetting(e) {
        changeLanguage(e.target.value);
        localStorage.setItem("language", e.target.value);
    }

    return (
        <div className="settings-page">
            <div className="settings-header">
                <button className="back-btn" onClick={() => navigate("/chat")}>← Back</button>
                <h1>Settings</h1>
            </div>

            <div className="settings-body">
                <div className="setting-card">
                    <h3>🌙 Appearance</h3>
                    <p>Switch between light and dark mode.</p>
                    <button onClick={toggleTheme}>
                        {darkMode ? "☀️  Switch to Light Mode" : "🌙  Switch to Dark Mode"}
                    </button>
                </div>

                <div className="setting-card">
                    <h3>🌐 Language</h3>
                    <p>Choose your preferred language for responses.</p>
                    <select value={language} onChange={changeLanguageSetting}>
                        {languages.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>
                </div>

                <div className="setting-card">
                    <h3>🔊 Voice Responses</h3>
                    <p>Let Candor read responses aloud using your device's text-to-speech.</p>
                    <button onClick={toggleVoice} style={{ background: voice ? "#2E9E4B" : undefined }}>
                        {voice ? "🔊  Voice Responses ON" : "🔇  Voice Responses OFF"}
                    </button>
                </div>

                <div className="setting-card">
                    <h3>ℹ️ About Candor</h3>
                    <p>
                        Candor is your AI companion designed to help policyholders
                        understand their Myriad life insurance policies, submit claims,
                        update personal details, and explore cover options — all in plain language.
                    </p>
                </div>
            </div>
        </div>
    );

}

export default Settings;