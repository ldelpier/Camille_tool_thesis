import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/History.module.css";

type Conversation = {
  id: number;
  role: "user" | "ai";
  content: string;
  created_at: string;
};

export default function History() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    // Fetch la conversation depuis l'API history
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/history");
        const data = await response.json();
        setConversations(data.conversations || []);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className={styles.containerHistory}>
      {/*C'est ce qui se trouve dans l'onglet*/}
      <Head>
        <title>History</title>
        {/*Il faudra penser à mettre une icon */}
      </Head>
      <main className={styles.historyArea}>
        <h1 className={styles.title}>Conversation History</h1>
        {conversations.map((conv) => (
          <div key={conv.id} className={`${styles.conversationItem} ${
          conv.role === "user" ? styles.userMessage : styles.aiMessage
          }`}>
            <strong>{conv.role === "user" ? "User" : "AI"}:</strong> 
            <p>{conv.content}</p>
          </div>
        ))}
      </main>
    </div>
  );
}