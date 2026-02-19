import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Message = {
  role: "user" | "ai";
  content: string;
};

interface ConversationContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  conversationId: number | null;
  setConversationId: (id: number | null) => void;
  resetConversation: () => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);

  // Charger la conversation depuis localStorage au montage
  useEffect(() => {
    const saved = localStorage.getItem("currentConversation");
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed.messages || []);
      setConversationId(parsed.conversationId || null);
    }
  }, []);

  // Sauvegarder la conversation dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(
      "currentConversation",
      JSON.stringify({ messages, conversationId })
    );
  }, [messages, conversationId]);

  const resetConversation = () => {
    setMessages([]);
    setConversationId(null);
    localStorage.removeItem("currentConversation");

  };

  return (
    <ConversationContext.Provider
      value={{ messages, setMessages, conversationId, setConversationId, resetConversation }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) throw new Error("useConversation must be used within a ConversationProvider");
  return context;
};
