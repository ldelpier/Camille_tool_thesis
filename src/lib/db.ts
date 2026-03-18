import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

//Utiliser /tmp sur Vercel
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel
    ?'/tmp/conversations.db'
    // Vérifier si le fichier de base de données existe, sinon le créer
    : path.join(process.cwd(), "src", "data", "conversations.db");


// Créer le dossier local si on est pas sur Vercel et qu'il n'existe pas
if (!isVercel) {
    const dbDir = path.join(process.cwd(), "src", "data");
    if (!fs.existsSync(dbDir)){
        fs.mkdirSync(dbDir, { recursive: true });
    }
}

const db = new Database(dbPath);

// Création de la table "conversations" si elle n'existe pas déjà
db.prepare(`
    CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

export default db;