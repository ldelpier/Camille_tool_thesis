import db from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    conversations?: any[];
    error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "GET") {
    try {
        const rows_conversations = db.prepare("SELECT * FROM conversations ORDER BY conversation_id DESC, created_at ASC").all();
        res.status(200).json({ conversations: rows_conversations });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ error: "Failed to fetch conversations" });
    }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}