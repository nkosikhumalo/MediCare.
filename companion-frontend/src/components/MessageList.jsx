import ReactMarkdown from "react-markdown";

function MessageList({ messages, isLoading, bottomRef }) {
    const isEmpty = messages.length === 0 && !isLoading;

    return (
        <main className="chat-body">
            {isEmpty ? (
                <div className="chat-empty">
                    <div className="chat-empty-mark">m</div>
                    <h1 className="chat-empty-title">Candor</h1>
                    <p className="chat-empty-sub">
                        Ask anything about your policy, claims, or cover.
                    </p>
                </div>
            ) : (
                <div className="messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-row ${msg.sender}`}>
                            <div className="avatar">
                                {msg.sender === "bot" ? "m" : "U"}
                            </div>
                            <div className="bubble">
                                {msg.sender === "bot" ? (
                                    <ReactMarkdown>{msg.message || msg.text}</ReactMarkdown>
                                ) : (
                                    msg.message || msg.text
                                )}
                                {msg.attachment && (
                                    <div className="attachment">📎 {msg.attachment}</div>
                                )}
                                {msg.actions?.length > 0 && (
                                    <div className="message-actions">
                                        {msg.actions.map((a) => (
                                            <button key={a.label} type="button" onClick={a.onClick}>
                                                {a.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message-row bot">
                            <div className="avatar">m</div>
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
