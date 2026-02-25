import db from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

// Formatae données dans l'historique
type Data = {
    conversations?: any[];
    error?: string;
    message?: string;
};

// Les méthodes qui sont faites dans la BD
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "GET") {
    try {
        const rows_conversations = db.prepare("SELECT * FROM conversations ORDER BY conversation_id DESC, created_at ASC").all();
        return res.status(200).json({ conversations: rows_conversations });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ error: "Failed to fetch conversations" });
    }}
    else if (req.method === "DELETE") {
        try {
            db.prepare("DELETE FROM conversations").run();
            return res.status(200).json({ message: "All conversations deleted" });
        } catch (error) {
            console.error("Error deleting conversations:", error);
            res.status(500).json({ error: "Failed to delete conversations" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}