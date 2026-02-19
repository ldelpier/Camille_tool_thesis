import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import styles from "../styles/Chat.module.css";
import { useConversation, Message } from "../context/conversationContext";


type ChatPageProps = {
  firstMessage?: string;
};

// Pour l'optimisation du site et pour récupérer le message de la page d'accueil et l'afficher dans le chatbot
// Nous faisons cela en utilisant getServerSideProps pour récupérer les données à chaque requête, ce qui est nécessaire pour afficher le message initial dans le chatbot.Et ça remplace le useEffect qui faisait la même chose.
export async function getServerSideProps(context: any) {
  const { firstMessage } = context.query;
  return {
    props: {firstMessage: firstMessage || "" },
  };
}

export default function ChatPage({ firstMessage }: ChatPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false); // Pour savoir si le premier message a été envoyé ou pas
  const {messages, setMessages, conversationId, setConversationId, resetConversation} = useConversation();

  // Envoyer fistMessage seulement s'il n'y a pas de conversation en cours en utilisant useEffet
  useEffect(() => {
    if (firstMessage && !hasSentFirstMessage && messages.length === 0) {
      sendMessage(firstMessage, true);
      setHasSentFirstMessage(true);
    }
  }, [firstMessage, hasSentFirstMessage, messages]);

  // Fonction pour envoyer un message à l'API et recevoir la réponse de l'IA
  const sendMessage = async (messageToSent?: string, isFirstMessage = false) => {
    const text = messageToSent || input;
    if (!text.trim()) return;

    if (!isFirstMessage) {
      const userMessage: Message = { role: "user", content: text };
      setMessages((prev: Message[]) => [...prev, userMessage]);
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({message: text, conversationId}),
    });

    const data = await response.json();
    // Récupère l'Id de la conversation renvoyé par l'API
    if (data.conversationId && !conversationId) {
      setConversationId(data.conversationId);
    }

    const aiMessage: Message = {
      role: "ai",
      content: data.reply || "No response from AI.",
    };

    setMessages((prev: Message[]) => {
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

  return (
    <div className={styles.containerChat}>
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
            <button onClick={resetConversation}>New discussion</button>
            <Link href="/history" style={{textDecoration: 'none'}}>
              <button>Archives</button>
            </Link>
            <Link href="/settings" style={{textDecoration: 'none'}}>
              <button>Settings</button>
            </Link>
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
            <div key={index} className={msg.role === "user" ? styles.userMessage : styles.aiMessage}>
              {msg.role === "ai" ? (<ReactMarkdown>{msg.content}</ReactMarkdown>) : 
              ( <p>{msg.content}</p>
              )}
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