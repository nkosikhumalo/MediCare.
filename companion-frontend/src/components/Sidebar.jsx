import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteConversation } from "../services/chatService";

function Sidebar({
    open,
    close,
    conversations,
    activeConversation,
    setActiveConversation,
    loadMessages,
    onNewChat,
    setConversations,
}) {
    const navigate = useNavigate();
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    function handleNewChat() {
        onNewChat?.();
        close();
    }

    function requestDelete(e, chatId) {
        e.stopPropagation();
        setConfirmDeleteId(chatId);
    }

    function cancelDelete(e) {
        e?.stopPropagation();
        setConfirmDeleteId(null);
    }

    async function confirmDelete(e, chatId) {
        e.stopPropagation();
        setConfirmDeleteId(null);
        setDeletingId(chatId);
        try {
            await deleteConversation(chatId);
            setConversations(prev => prev.filter(c => c.id !== chatId));
            if (activeConversation === chatId) setActiveConversation(null);
        } catch (err) {
            console.error("Failed to delete conversation:", err);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <>
            <div className={`sidebar-backdrop ${open ? "show" : ""}`} onClick={close} />

            <aside className={`sidebar ${open ? "open" : ""}`}>
                <div className="sidebar-header">
                    <span>Conversations</span>
                    <button type="button" onClick={close} aria-label="Close sidebar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <button type="button" className="new-chat-btn" onClick={handleNewChat}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Chat
                </button>

                <div className="conversation-list">
                    {conversations.length === 0 ? (
                        <p className="convo-empty">No conversations yet</p>
                    ) : (
                        <div className="convo-section">
                            <p className="convo-section-label">Recent</p>
                            {conversations.map((chat) => (
                                <div key={chat.id}>
                                    <div
                                        className={`convo-item ${activeConversation === chat.id ? "active" : ""}`}
                                        onClick={() => {
                                            if (confirmDeleteId === chat.id) return;
                                            setActiveConversation(chat.id);
                                            loadMessages(chat.id);
                                            close();
                                        }}
                                    >
                                        <div className="convo-title">{chat.title}</div>
                                        {chat.preview && <div className="convo-preview">{chat.preview}</div>}

                                        {deletingId === chat.id ? (
                                            <div className="convo-deleting">Deleting…</div>
                                        ) : (
                                            <button
                                                type="button"
                                                className="convo-delete-btn"
                                                onClick={(e) => requestDelete(e, chat.id)}
                                                aria-label="Delete conversation"
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                    <path d="M10 11v6M14 11v6" />
                                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Inline confirmation — replaces browser confirm() */}
                                    {confirmDeleteId === chat.id && (
                                        <div className="convo-confirm" onClick={e => e.stopPropagation()}>
                                            <span>Remove this conversation?</span>
                                            <div className="convo-confirm-actions">
                                                <button type="button" className="convo-confirm-yes" onClick={(e) => confirmDelete(e, chat.id)}>Delete</button>
                                                <button type="button" className="convo-confirm-no" onClick={cancelDelete}>Cancel</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="sidebar-footer">
                    <button type="button" className="settings-btn" onClick={() => navigate("/settings")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        Settings
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
