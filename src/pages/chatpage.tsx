import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Chat.module.css";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ChatPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const { firstMessage } = router.query;
    if (typeof firstMessage === "string" && firstMessage.trim()) {
      const userMessage: Message = { role: "user", content: firstMessage };
      const aiMessage: Message = {
        role: "ai",
        content: "This is a placeholder response from the AI. It will be replaced with actual answers in the future.",
      };
      setMessages([userMessage, aiMessage]);
    }
  }, [router.query]);

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
          <title>CHAT modify</title>
          {/*Il faudra penser à mettre une icon */}
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
        {sidebarOpen && (
          <Link href="/" style={{textDecoration: 'none'}}>
            <button className={styles.backButton}>Back to Home</button>
          </Link>
        )}
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