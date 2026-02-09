import { useState } from "react";
import styles from "../styles/Chat.module.css";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };

    const aiMessage: Message = {
      role: "ai",
      content: "This is a placeholder response from the AI. It will be replaced with actual answers in the future.",
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.closed : ""}`}>
        <button className={styles.toggleBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>

        {sidebarOpen && (
          <div className={styles.sidebarmenu}>
            <button>New discussion</button>
            <button>Archives</button>
            <button>Settings</button>
          </div>
        )}
      </aside>

      {/* Chat area */}
      <main className={styles.chatArea}>
        <div className={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === "user" ? styles.userMessage : styles.aiMessage}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            placeholder="write your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>➤</button>
        </div>
      </main>
    </div>
  );
}