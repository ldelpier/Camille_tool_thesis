import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Chat.module.css";

type Message = {
  role: "user" | "ai";
  content: string;
};
type ChatPageProps = {
  firstMessage?: string;
};

// Pour l'optimisation du site et pour récupérer le message de la page d'accueil et l'afficher dans le chatbot
// Nous faisons cela en utilisant getServerSideProps pour récupérer les données à chaque requête, ce qui est nécessaire pour afficher le message initial dans le chatbot.Et ça remplace le useEffect qui faisait la même chose.
export async function getServerSideProps(context: any) {
  const { firstMessage } = context.query;
  return {
    props: { 
      firstMessage: firstMessage || "" 
    },
  };
}

export default function ChatPage({ firstMessage }: ChatPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>(
    firstMessage ? [
      { role: "user", content: firstMessage },
    ] : []
  );
  const [input, setInput] = useState("");

  // Pour savoir si le premier message a été envoyé ou pas
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);

  // useEffet envoie le firstMessage à l'API chat dés que la page se charge
  useEffect(() => {
    if (firstMessage && !hasSentFirstMessage) {
      sendMessage(firstMessage, true);
      setHasSentFirstMessage(true);
    }
  }, [firstMessage, hasSentFirstMessage]);

  const sendMessage = async (messageToSent?: string, isFirstMessage = false) => {
    const text = messageToSent || input;
    if (!text.trim()) return;

    if (!isFirstMessage) {
      const userMessage: Message = { role: "user", content: text };
      setMessages((prev) => [...prev, userMessage]);
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();

    const aiMessage: Message = {
      role: "ai",
      content: data.reply || "No response from AI.",
    };

    setMessages((prev) => {
      if (isFirstMessage){
        return [
          {role: "user", content: text}, 
          aiMessage, // la réponse de l'IA
        ];
      }
      return [...prev, aiMessage];
    });

    setInput("");
  };

  const startNewDiscussion = () => {
    setMessages([]);
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
            <button onClick={startNewDiscussion}>New discussion</button>
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
          <button onClick={() => sendMessage()}>➤</button>
        </div>
      </main>
    </div>
  );
}