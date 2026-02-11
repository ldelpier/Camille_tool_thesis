import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    reply: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    // Autoriser uniquement les requêtes POST
    if (req.method !== "POST") {
        return res.status(405).json({ reply: "Method Not Allowed" });
    }
    try {
        const { message } = req.body; // Récupérer le message de l'utilisateur

        if (!message || typeof message !== "string") {
            return res.status(400).json({ reply: "Invalid message" });
        }
        // Ici, vous pouvez intégrer votre logique pour générer une réponse basée sur le message de l'utilisateur.
        // Par exemple, vous pourriez appeler une API d'IA ou utiliser une bibliothèque de traitement du langage naturel.
        const aiReply = `You said: ${message}`; // Placeholder response de l'IA 

        res.status(200).json({ reply: aiReply }); // Réponse de l'IA au format JSON à ma question

    } catch (error) {
        console.error("AI error", error);
        return res.status(500).json({ reply: "Internal Server Error" });
    }
}