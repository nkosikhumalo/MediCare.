import { useState } from "react";
import ReactMarkdown from "react-markdown";

function speakText(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-ZA";
    utterance.rate = 1;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith("en"));
    if (match) utterance.voice = match;
    window.speechSynthesis.speak(utterance);
}

function SpeakerBtn({ text }) {
    const [speaking, setSpeaking] = useState(false);

    function toggle() {
        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        } else {
            if (!window.speechSynthesis) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "en-ZA";
            const voices = window.speechSynthesis.getVoices();
            const match = voices.find(v => v.lang.startsWith("en"));
            if (match) utterance.voice = match;
            utterance.onend = () => setSpeaking(false);
            utterance.onerror = () => setSpeaking(false);
            window.speechSynthesis.speak(utterance);
            setSpeaking(true);
        }
    }

    return (
        <button
            type="button"
            className={`msg-speak-btn ${speaking ? "msg-speak-active" : ""}`}
            onClick={toggle}
            aria-label={speaking ? "Stop reading" : "Read aloud"}
            title={speaking ? "Stop" : "Read aloud"}
        >
            {speaking ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
                    <rect x="6" y="6" width="4" height="12" rx="1" fill="currentColor" stroke="none" />
                    <rect x="14" y="6" width="4" height="12" rx="1" fill="currentColor" stroke="none" />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
            )}
        </button>
    );
}

function MessageList({ messages, isLoading, bottomRef }) {
    const isEmpty = messages.length === 0 && !isLoading;

    return (
        <main className="chat-body">
            {isEmpty ? (
                <div className="chat-empty">
                    <div className="chat-empty-mark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="26" height="26">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <h1 className="chat-empty-title">MediCare AI</h1>
                    <p className="chat-empty-sub">
                        Ask anything about your policy, claims, or cover.
                    </p>
                </div>
            ) : (
                <div className="messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-row ${msg.sender}`}>
                            <div className="avatar">
                                {msg.sender === "bot" ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                )}
                            </div>
                            <div className="bubble">
                                {msg.sender === "bot" ? (
                                    <ReactMarkdown>{msg.message || msg.text}</ReactMarkdown>
                                ) : (
                                    msg.message || msg.text
                                )}
                                {msg.attachment && (
                                    <div className="attachment">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12" style={{ marginRight: 4 }}>
                                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                        </svg>
                                        {msg.attachment}
                                    </div>
                                )}
                                {msg.sender === "bot" && (
                                    <SpeakerBtn text={msg.message || msg.text || ""} />
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message-row bot">
                            <div className="avatar">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                            </div>
                            <div className="bubble typing-indicator">
                                <span /><span /><span />
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            )}
        </main>
    );
}

export default MessageList;
