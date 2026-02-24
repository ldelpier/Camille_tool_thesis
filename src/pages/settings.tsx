import Head from "next/head";
import Link from "next/link";

export default function History() {
  return (
    <>
      <Head>
        <title>Camille-Settings</title>
        <meta name="description" content="Settings page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/rabbitkiki.ico" />
      </Head>
        <main style={{ padding: "2rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>This page is under construction 🚧</h1>
            <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>We are working hard to bring you this feature soon!</p>
            <Link href="/" style={{ fontSize: "1.2rem", color: "#0070f3", textDecoration: "underline" }}>
                Go back to Home and access the chatbot
            </Link>
        </main>
    </>
  );
}