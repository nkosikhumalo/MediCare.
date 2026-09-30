import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {

    const [darkMode, setDarkMode] = useState(() => {

        return localStorage.getItem("theme") === "dark";

    });

    useEffect(() => {

        if (darkMode) {

            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");

        } else {

            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");

        }

    }, [darkMode]);

    function toggleTheme() {

        setDarkMode(prev => !prev);

    }

    return (

        <ThemeContext.Provider
            value={{
                darkMode,
                toggleTheme
            }}
        >

            {children}

        </ThemeContext.Provider>

    );

}

// Context hooks share their provider module by design; neither is a component export.
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {

    return useContext(ThemeContext);

}