import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import styles from "../styles/Chat.module.css";
import { useConversation, Message } from "../context/conversationContext";
import LoadingBar from "../components/loadingBar";
import { quickRepliesData, QuickReply } from "../data/quickRepliesData";

// Avoir le message de la page d'acceuil
type ChatPageProps = {
  firstMessage?: string;
};

// Pour l'optimisation du site et récupération du message de Home pour l'afficher dans la conversation
// Utilisation getServerSideProps pour récupérer les données à chaque requête et afficher le message initial dans le chatbot.
export async function getServerSideProps(context: any) {
  const { firstMessage } = context.query;
  return {
    props: {firstMessage: firstMessage || "" },
  };
}

export default function ChatPage({ firstMessage }: ChatPageProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false); 
  const {messages, setMessages, conversationId, setConversationId, resetConversation} = useConversation();

  // Envoyer fistMessage seulement s'il n'y a pas de conversation en cours
  useEffect(() => {
    if (firstMessage && !hasSentFirstMessage && messages.length === 0) {
      sendMessage(firstMessage, true);
      setHasSentFirstMessage(true);
    }
  }, [firstMessage, hasSentFirstMessage, messages]);

  // Détecter la source de la navigation, si c'est home reset tout
  useEffect(() => {
    if (firstMessage) {
      resetConversation();
      sendMessage(firstMessage, true);
      setHasSentFirstMessage(true);
    }
  }, [firstMessage]);

  // Recommendation faite main
  const handlerQuickReply = (qr: QuickReply) => {
    const entry = quickRepliesData[qr.target];
    if (!entry) return;

    const userMessage: Message = {
      role: "user",
      content: qr.label,
    };

    const recommendationMessage: Message = {
      role: "ai",
      content: entry.recommendation, 
      quickReplies: [],
      isRecommendation: true,
    };

    setMessages((prev: Message[]) => [...prev, userMessage, recommendationMessage]);
  };

  // Fonction pour envoyer un message à l'API et recevoir la réponse de l'IA avec le message à envoyer, le premier message et des données supplémentaires
  const sendMessage = async (messageToSent?: string, isFirstMessage = false) => {
    setIsLoading(true);
    
    const text = messageToSent || input;
    if (!text.trim()) return;

    if (!isFirstMessage) {
      const userMessage: Message = { role: "user", content: text };
      setMessages((prev: Message[]) => [...prev, userMessage]);
    }

    const setErrorMessage = (content: string) => {
      const errorMessage: Message = { role: "ai", content, quickReplies: [] };
      setMessages((prev: Message[]) => {
        if (isFirstMessage) {
          return [{ role: "user", content: text }, errorMessage];
        }
        return [...prev, errorMessage];
      });
    };
    
    try{
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text, 
          conversationId: conversationId || null,
        }),
      });

      const textResponse = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(textResponse);
      } catch {
        // La réponse n'est pas du JSON (erreur Next.js, timeout, etc.)
        setErrorMessage("An error occurred, please try again.");
        return;
      }

      // Gestion des erreurs 
      if (!response.ok){
        setErrorMessage(data.reply || "An error occured, please try again.");
        return;
      }

      // Récupère l'Id de la conversation renvoyé par l'API
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      //Parser la réponse, la mettre en forme ; détecter les missing points pour les quick replies
      let formattedContent = data.reply || "No response from AI.";
      let quickReplies: QuickReply[] = [];

      try {
        const cleaned = data.reply.replace(/```json|```/g, "").trim();
        const result = JSON.parse(cleaned);

        const lines = Object.entries(result).map(([key, value]: any) => {
          const quote = value["🔎"] ? ` — 🔎 *"${value["🔎"]}"*` : "";
          return `- **${key.replace(/_/g, " ")}** : ${value.status}${quote}`;
        });
        formattedContent = lines.join("\n");

        quickReplies = Object
          .entries(result)
          .filter(([key, value]: any) => value.status === "❌" && quickRepliesData[key])
          .map(([key]: any) => ({
            label: quickRepliesData[key].label, 
            target: key,
          }));

      } catch(error){
        console.error("Invalid JSON from AI", error);
      }

      const aiMessage: Message = {
        role: "ai",
        content: formattedContent,
        quickReplies,
      };

      setMessages((prev: Message[]) => {
        if (isFirstMessage){
          return [
            {role: "user", content: text}, 
            aiMessage,
          ];
        }
        return [...prev, aiMessage];
      });
      setInput("");
    } catch (error){
      console.error("Network error:", error);
      const errorMessage: Message = {
        role: "ai",
        content: "Network error, please check your connection.",
        quickReplies: [],
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally{
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.containerChat}>
      {/*Ce qui se trouve dans l'onglet*/}
      <Head>
        <title>Camille-URLbot</title>
        <link rel="icon" href="/rabbitkiki.ico" />
      </Head>

      {/*Barre latéral*/}
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
        {/*Retour vers home*/}
        {sidebarOpen && (
          <Link href="/" style={{textDecoration: 'none'}}>
            <button className={styles.backButton}>Back to Home</button>
          </Link>
        )}
      </aside>

      {/*zone conversation*/}
      <main className={styles.chatArea}>
        <div className={styles.messages}>
          {messages.map((msg, index) => (
            <div key={index} className={msg.role === "user" ? styles.userMessage : styles.aiMessage}>
              {msg.role === "ai" ? (
                <>
                  <span className={styles.labelSource}>
                    {msg.isRecommendation ?"✍️ Generate by Camille's designer" : "🤖 Generate by IA"}
                  </span>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className={styles.quickReplies}>
                      {msg.quickReplies.map((qr, i) => (
                        <button key={i} className={styles.quickRepliesButton} onClick={() => handlerQuickReply(qr)}>
                          {qr.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
                ) : (
                  <p>{msg.content}</p>
                )}
            </div>
          ))}
          {/*Afficher la loadbar*/}
          {isLoading && <LoadingBar />}
          {!isLoading && <p>{messages.length} messages displayed</p>}
        </div>

        {/*Zone d'écriture*/}
        <div className={styles.inputArea}>
          <input
            type="text"
            placeholder="Please enter the URL of your README/CONTRIBUTING file here"
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