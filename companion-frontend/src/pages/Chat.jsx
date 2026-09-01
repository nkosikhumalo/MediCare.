import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";
import { useAuth } from "../context/AuthContext";
import { getConversations, getMessages } from "../services/chatService";

import "../styles/chat.css";

function Chat() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const userId = user?.id;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const bottomRef = useRef(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!token) { navigate("/login"); return; }
        loadConversations();
    }, [token]);

    // Auto-scroll to bottom on new messages or loading state
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    async function loadConversations() {
        if (!userId) return;
        try {
            const data = await getConversations(userId);
            const list = Array.isArray(data) ? data : [];
            setConversations(list);
            // Do NOT auto-select — user starts fresh every session.
            // They pick from sidebar or just type to create a new one.
        } catch (err) {
            console.error("Failed loading conversations:", err);
            if (err.code === "UNAUTHORIZED") {
                navigate("/login");
            }
        }
    }

    async function loadMessages(conversationId) {
        if (!conversationId) return;
        try {
            const data = await getMessages(conversationId);
            const rows = Array.isArray(data) ? data : [];
            // Normalize DB rows (field: message) to UI shape (field: text)
            setMessages(rows.map(r => ({ ...r, text: r.message || r.text })));
        } catch (err) {
            console.error("Failed loading messages:", err);
        }
    }

    function startNewChat() {
        setActiveConversation(null);
        setMessages([]);
    }

    return (
        <div className="chat-app">
            <Sidebar
                open={sidebarOpen}
                close={() => setSidebarOpen(false)}
                conversations={conversations}
                activeConversation={activeConversation}
                setActiveConversation={(id) => {
                    setActiveConversation(id);
                    loadMessages(id);
                }}
                loadMessages={loadMessages}
                onNewChat={startNewChat}
                setConversations={setConversations}
            />

            <div className="chat-main">
                <ChatHeader openSidebar={() => setSidebarOpen(true)} />

                <MessageList messages={messages} isLoading={isLoading} bottomRef={bottomRef} />

                <ChatInput
                    activeConversation={activeConversation}
                    setActiveConversation={setActiveConversation}
                    setMessages={setMessages}
                    setConversations={setConversations}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                />
            </div>
        </div>
    );
}

export default Chat;
