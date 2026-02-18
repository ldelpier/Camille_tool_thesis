import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/History.module.css";

type Conversation = {
  id: number;
  conversation_id: number;
  role: "User" | "AI";
  content: string;
  created_at: string;
};

export default function History() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Grouper les conversations par conversation_id pour les afficher par conversation
  const groupedConversations = conversations.reduce<Record<number, Conversation[]>>((groups, conv) => {
    if (!groups[conv.conversation_id]) {
      groups[conv.conversation_id] = [];
    }
    groups[conv.conversation_id].push(conv);
    return groups;
  }, {});

  const deleteHistory = async () => {
    if (!confirm("Are you sure you want to delete the conversation history? This action cannot be undone.")) {
      return;
    }
    try {
      const response = await fetch("/api/history", {
        method: "DELETE",
      });
      if (response.ok) {
        setConversations([]);
      } else {
        console.error("Failed to delete history");
      }
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };

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
        <h1 className={styles.titleHisto}>Conversation History</h1>
        <Link href="/chatpage" style={{textDecoration: 'none'}}>
          <button className={styles.chatButton}>Conversation</button>
        </Link>
        <button className={styles.deleteButton} onClick={deleteHistory}>Delete history</button>
        {Object.values(groupedConversations).map((group: Conversation[], index) => (
          <div key={index} className={styles.conversationItem}>
            {group.map((conv) => (
              <div key={conv.id}>
                <strong>{conv.role}:</strong> 
                <p>{conv.content}</p>
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  );
}