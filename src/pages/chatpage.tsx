import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
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
      {/*C'est ce qui se trouve dans l'onglet*/}
        <Head>
          <title>Name of the tool</title>
          <meta name="description" content="Tool description" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" /> {/*Il faudra penser à changer l'icon */}
        </Head>
      {/* Barre latéral */}
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
        
        {/* Retour vers home */}
        <Link href="/">
          <button className={styles.backButton}>Back to Home</button>
        </Link>
      </aside>

      {/* zone conversation */}
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