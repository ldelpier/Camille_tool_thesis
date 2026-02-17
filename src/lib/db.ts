import Database from "better-sqlite3";

const db = new Database("conversations.db");

// Création de la table "conversations" si elle n'existe pas déjà
db.prepare(`
    CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

export default db;