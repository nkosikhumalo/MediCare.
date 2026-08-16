import { useNavigate } from "react-router-dom";

function Sidebar({
    open,
    close,
    conversations,
    activeConversation,
    setActiveConversation,
    loadMessages,
    onNewChat,
}) {
    const navigate = useNavigate();

    function handleNewChat() {
        onNewChat?.();
        close();
    }

    return (
        <>
            <div
                className={`sidebar-backdrop ${open ? "show" : ""}`}
                onClick={close}
            />

            <aside className={`sidebar ${open ? "open" : ""}`}>
                <div className="sidebar-header">
                    <span>Conversations</span>
                    <button type="button" onClick={close} aria-label="Close sidebar">
                        ✕
                    </button>
                </div>

                <button type="button" className="new-chat-btn" onClick={handleNewChat}>
                    + New Chat
                </button>

                <div className="conversation-list">
                    {conversations.length === 0 ? (
                        <p className="convo-empty">No conversations yet</p>
                    ) : (
                        <div className="convo-section">
                            <p className="convo-section-label">Recent</p>
                            {conversations.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`convo-item ${activeConversation === chat.id ? "active" : ""}`}
                                    onClick={() => {
                                        setActiveConversation(chat.id);
                                        loadMessages(chat.id);
                                        close();
                                    }}
                                >
                                    <div className="convo-title">{chat.title}</div>
                                    {chat.preview && (
                                        <div className="convo-preview">{chat.preview}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="sidebar-footer">
                    <button
                        type="button"
                        className="settings-btn"
                        onClick={() => navigate("/settings")}
                    >
                        ⚙ Settings
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
