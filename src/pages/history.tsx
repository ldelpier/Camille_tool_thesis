import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/History.module.css";

// Formatage conversation
type Conversation = {
  id: number;
  conversation_id: number;
  role: "User" | "AI";
  content: string;
  created_at: string;
};

export default function History() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Grouper les conversations par conversation_id pour l'affichage
  const groupedConversations = conversations.reduce<Record<number, Conversation[]>>((groups, conv) => {
    if (!groups[conv.conversation_id]) {groups[conv.conversation_id] = [];}
    groups[conv.conversation_id].push(conv);
    return groups;
  }, {});

  // Suppression de l'historique en entier
  const deleteHistory = async () => {
    if (!confirm("Are you sure you want to delete the conversation history? This action cannot be undone.")) {
      return;
    }
    try {
      const response = await fetch("/api/history", {method: "DELETE"});
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
      {/*Ce qui se trouve dans l'onglet*/}
      <Head>
        <title>Camille-History</title>
        <link rel="icon" href="/rabbitkiki.ico" />
      </Head>

      {/*La page historique*/}
      <main className={styles.historyArea}>
        <h1 className={styles.titleHisto}>Conversation History</h1>
        {/*Emplacement des boutons conversation et suppression*/}
        <div className={styles.buttonContainerHisto}>
          <Link href="/chatpage" style={{textDecoration: 'none'}}>
            <button className={styles.chatButton}>Conversation</button>
          </Link>
          <button className={styles.deleteButton} onClick={deleteHistory}>Delete history</button>
        </div>
        {/*Affichage des conversations*/}
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