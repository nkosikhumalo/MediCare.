import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { speak } from "../services/speechService";
import { ragChat } from "../services/aiService";
import { saveMessage, createConversation } from "../services/chatService";

function ChatInput({
    setMessages,
    activeConversation,
    setActiveConversation,
    setConversations,
    isLoading,
    setIsLoading,
}) {
    const { language } = useLanguage();
    const { user, clearAuth } = useAuth();

    const [text, setText] = useState("");
    const [listening, setListening] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const recognitionRef = useRef(null);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    const languageMap = {
        EN: "en-ZA", AF: "af-ZA", ZU: "zu-ZA", XH: "xh-ZA",
        ST: "st-ZA", TN: "tn-ZA", SS: "ss-ZA", VE: "ve-ZA",
        TS: "ts-ZA", NR: "nr-ZA", NSO: "nso-ZA",
    };

    // Auto-grow textarea
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 140) + "px";
    }, [text]);

    function chooseFile(e) {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
    }

    async function send() {
        if ((!text.trim() && !selectedFile) || isLoading) return;
        const userText = text.trim();
        setText("");
        setSelectedFile(null);
        await sendText(userText);
    }

    async function sendText(userText) {
        if (!userText?.trim() || isLoading) return;

        let convId = activeConversation;
        if (!convId) {
            try {
                const conv = await createConversation(user?.id, userText.slice(0, 45) || "New Conversation");
                convId = conv.id;
                setActiveConversation(convId);
                setConversations(prev => [conv, ...prev]);
            } catch (err) {
                console.error("Failed to create conversation:", err);
                if (err.code === "UNAUTHORIZED") {
                    clearAuth();
                    window.location.href = "/login";
                    return;
                }
            }
        }

        const userMsg = { id: Date.now(), sender: "user", text: userText };
        setMessages(prev => [...prev, userMsg]);

        if (convId) saveMessage(convId, "user", userText).catch(console.error);

        setIsLoading(true);
        try {
            const data = await ragChat(userText, convId ? String(convId) : undefined);
            const reply = data.reply || data.answer || "No response";
            const botMsg = { id: Date.now() + 1, sender: "bot", text: reply };
            setMessages(prev => [...prev, botMsg]);
            if (convId) saveMessage(convId, "bot", reply).catch(console.error);
            speak(reply, language);
        } catch (err) {
            console.error("RAG chat error:", err);
            if (err.code === "UNAUTHORIZED") {
                clearAuth();
                window.location.href = "/login";
                return;
            }
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "bot",
                    text: err.message?.includes("unavailable")
                        ? "Candor is temporarily unavailable. Please try again in a moment."
                        : "Sorry, something went wrong. Please try again.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    }

    function startListening() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert("Speech recognition not supported."); return; }
        const r = new SR();
        r.lang = languageMap[language] || "en-ZA";
        r.interimResults = true;
        r.continuous = false;
        r.onstart = () => setListening(true);
        r.onend = () => setListening(false);
        r.onerror = () => setListening(false);
        r.onresult = (e) => {
            let t = "";
            for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
            setText(t);
        };
        recognitionRef.current = r;
        r.start();
    }

    function stopListening() { recognitionRef.current?.stop(); }

    const canSend = (text.trim() || selectedFile) && !isLoading;

    return (
        <div className="input-wrap">
            <input type="file" hidden ref={fileInputRef}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={chooseFile} />

            <div className="input-inner">
                <button type="button" className="input-btn" title="Attach file"
                    onClick={() => fileInputRef.current.click()}>
                    📎
                </button>

                <div className="input-field">
                    {selectedFile && (
                        <div className="selected-file">
                            📄 {selectedFile.name}
                            <button type="button" onClick={() => setSelectedFile(null)}>✕</button>
                        </div>
                    )}
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isLoading ? "Candor is thinking…" : "Ask Candor anything about your policy…"}
                        disabled={isLoading}
                    />
                </div>

                {canSend ? (
                    <button type="button" className="input-btn send" onClick={send}
                        disabled={isLoading} title="Send">
                        ↑
                    </button>
                ) : (
                    <button type="button"
                        className={`input-btn ${listening ? "listening" : ""}`}
                        onClick={listening ? stopListening : startListening}
                        title={listening ? "Stop listening" : "Voice input"}>
                        {listening ? "🎤" : "🎙"}
                    </button>
                )}
            </div>
            <p className="input-hint">Candor may make mistakes. Always verify important information.</p>
        </div>
    );
}

export default ChatInput;
