import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {

    const [language, setLanguage] = useState(() => {

        return localStorage.getItem("language") || "EN";

    });

    function changeLanguage(lang) {

        setLanguage(lang);

        localStorage.setItem("language", lang);

    }

    return (

        <LanguageContext.Provider
            value={{
                language,
                changeLanguage
            }}
        >

            {children}

        </LanguageContext.Provider>

    );

}

// Context hooks share their provider module by design; neither is a component export.
// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {

    return useContext(LanguageContext);

}