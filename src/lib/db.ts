import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Vérifier si le fichier de base de données existe, sinon le créer
const dbDir = path.join(process.cwd(), "src","data");
const dbPath = path.join(dbDir, "conversations.db");

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
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