import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <>
      {/*C'est ce qui se trouve dans l'onglet*/}
      <Head>
        <title>Name of the tool</title>
        <meta name="description" content="Tool description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" /> {/*Il faudra penser à changer l'icon */}
      </Head>

      <div className={styles.page}>
        {/* Titre */}
        <h1 className={styles.title}>NAME OF THE TOOL</h1>
        
          {/* Expplication - Left side */}
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

        {/* Pour entrer dans le chatbot c'est ici qu'il nous faudra un lien vers la deuxième page */}
        <div className={styles.inputSection}>
          <input
            type="text"
            placeholder="Give your project"
            className={styles.input}
          />
          <button className={styles.uploadButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 16 16 12 12 8" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
        </div>
        <div className={styles.mainContent}>
          {/* Les critères */}
          <div className={styles.criteriaSection}>
            <h2 className={styles.sectionTitle}>Criteria</h2>
            <ul className={styles.criteriaList}>
              <li>
                <span className={styles.bullet}>○</span>
                <span className={styles.criteriaText}>
                  The README file should provide a description of the project's purpose
                </span>
              </li>
              <li>
                <span className={styles.bullet}>○</span>
                <span className={styles.criteriaText}>
                  The CONTRIBUTION file should include the guidelines for contributing to the project
                </span>
              </li>
              <li>
                <span className={styles.bullet}>○</span>
                <span className={styles.criteriaText}>
                  The README file and the CONTRIBUTION file should be up to date with the latest changes in the project
                </span>
              </li>
            </ul>
          </div>
        {/* Image ChatBot */}
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
