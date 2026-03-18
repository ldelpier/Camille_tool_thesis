import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ConversationProvider } from "@/context/conversationContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConversationProvider>
      <Component {...pageProps} />
    </ConversationProvider>
  );
}
