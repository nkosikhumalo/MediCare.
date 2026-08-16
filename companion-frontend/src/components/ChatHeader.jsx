import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

function ChatHeader({ openSidebar, onOpenWhatIf, canUseWhatIf }) {
    const navigate = useNavigate();
    const { darkMode, toggleTheme } = useTheme();
    const { language, changeLanguage } = useLanguage();
    const [showLanguages, setShowLanguages] = useState(false);

    const languages = ["EN", "AF", "ZU", "XH", "ST", "TN", "SS", "VE", "TS", "NR", "NSO"];

    return (
        <header className="chat-header">
            <div className="header-left">
                <button className="menu-btn" onClick={openSidebar} title="Open conversations">
                    ☰
                </button>
                <button className="back-home-btn" onClick={() => navigate("/home")}>
                    ← Home
                </button>
            </div>

            <div className="brand">
                <div className="brand-name"><span>C</span>andor</div>
                <div className="brand-sub">CANDOR AI</div>
            </div>

            <div className="controls">
                {canUseWhatIf && (
                    <button className="whatif-btn" onClick={onOpenWhatIf}>What-If ✦</button>
                )}
                <button onClick={() => setShowLanguages(!showLanguages)}>
                    {language} 🌐
                </button>
                {showLanguages && (
                    <div className="language-menu">
                        {languages.map((lang) => (
                            <div key={lang} className="language-item"
                                onClick={() => { changeLanguage(lang); setShowLanguages(false); }}>
                                {lang}
                            </div>
                        ))}
                    </div>
                )}
                <button onClick={toggleTheme} title="Toggle theme">
                    {darkMode ? "☀️" : "🌙"}
                </button>
            </div>
        </header>
    );
}

export default ChatHeader;
