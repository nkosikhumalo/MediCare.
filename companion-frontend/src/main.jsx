import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

import "./styles/global.css";

class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { error: null }; }
    static getDerivedStateFromError(error) { return { error }; }
    render() {
        if (this.state.error) {
            return (
                <div style={{ padding: 40, fontFamily: "Arial", color: "#c00" }}>
                    <h2>Something went wrong</h2>
                    <pre style={{ marginTop: 16, fontSize: 13, color: "#333", whiteSpace: "pre-wrap" }}>
                        {this.state.error.toString()}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <ErrorBoundary>
        <AuthProvider>
            <ThemeProvider>
                <LanguageProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </LanguageProvider>
            </ThemeProvider>
        </AuthProvider>
    </ErrorBoundary>
);