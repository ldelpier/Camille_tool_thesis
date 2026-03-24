import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Home.module.css";

// Pour l'optimisation du site 
export async function getStaticProps() {
  return {
    props: {}
  };
}

export default function Home() {
  const[project, setProject] = useState("");
  const router = useRouter();
  
  // Gérer le bouton pour aller à la page conversation
  const handleStart = () => {
    if (!project.trim()) return;
    router.push({
      pathname: "/chatpage",
      query: { firstMessage: project },
    });
  }
  return (
    <>
      {/*Ce qui se trouve dans l'onglet*/}
      <Head>
        <title>Camille</title>
        <meta name="description" content="Tool description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/rabbitkiki.ico" />
      </Head>

      <div className={styles.page}>
        {/*Titre*/}
        <h1 className={styles.titleHome}>CAMILLE</h1>
          {/*Expplication*/}
          <div className={styles.explanationSection}>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p className={styles.explanationText}>
              This tool was developed as part of a university thesis. 
              Its purpose is to assist the open source community in writing project documentation, particularly files for integrating new members into a project. 
              The targeted documents are README and CONTRIBUTION files. 
              The tool was designed to help open source project contributors to create and maintain the documentation of their projects. 
              It provides a chatbot that will identify the missing information in the documentation and suggest relevant content to fill those gaps.
            </p>
          </div>

        {/*Commencer la conversation (input)*/}
        <div className={styles.inputSection}>
          <input
            type="text"
            placeholder="Please put here the URL of the file"
            className={styles.input}
            value={project}
            onChange={(e) => setProject(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
          />
            <button className={styles.uploadButton} onClick={handleStart}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 16 16 12 12 8" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
        </div>

        {/*Les critères à gauche et l'image bot à droite*/}
        <div className={styles.mainContent}>
          <div className={styles.criteriaSection}>
            <h2 className={styles.sectionTitle}>Examples URL</h2>
            <ul className={styles.criteriaList}>
              <li>
                <span className={styles.bullet}>○</span>
                <span className={styles.criteriaText}>
                  <Link href={"https://github.com/godotengine/godot/blob/master/README.md"} style={{textDecoration: 'none'}}>
                    Godot Engine's README
                  </Link>
                  {" "}
                  https://github.com/godotengine/godot/blob/master/README.md
                </span>
              </li>
              <li>
                <span className={styles.bullet}>○</span>
                <span className={styles.criteriaText}>
                  <Link href={"https://github.com/TEAMMATES/teammates/blob/master/README.md"} style={{textDecoration: 'none'}}>
                    TEAMMATES' README
                  </Link>
                  {" "}
                  https://github.com/TEAMMATES/teammates/blob/master/README.md
                </span>
              </li>
              <li>
                <span className={styles.bullet}>○</span>
                <span className={styles.criteriaText}>
                  <Link href={"https://github.com/tensorflow/tensorflow/blob/master/CONTRIBUTING.md"} style={{textDecoration: 'none'}}>
                    Tensorflow's CONTRIBUTING 
                  </Link>
                  {" "}
                  https://github.com/tensorflow/tensorflow/blob/master/CONTRIBUTING.md
                </span>
              </li>
              <li>
                <span className={styles.bullet}>○</span>
                <span className={styles.criteriaText}>
                  <Link href={"https://github.com/nodejs/node/blob/main/CONTRIBUTING.md"} style={{textDecoration: 'none'}}>
                    Node.js' CONTRIBUTING
                  </Link>
                  {" "}
                  https://github.com/nodejs/node/blob/main/CONTRIBUTING.md
                </span>
              </li>
            </ul>
          </div>
          <Image 
          src="/memoire_chatbot.png" 
          alt="Description de l'image" 
          width={500} 
          height={350}
          />
        </div>
      </div>
    </>
  );
}
