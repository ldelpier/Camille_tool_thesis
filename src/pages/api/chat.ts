import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

type Data = {
    reply: string;
    conversationId?: number; // Ajout de l'ID de la conversation dans la réponse
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
        const { message, conversationId: clientConversationId } = req.body; // Récupérer le message de l'utilisateur

        if (!message || typeof message !== "string") {
            return res.status(400).json({ reply: "Invalid message" });
        }

        // Prompt système pour guider l'IA à répondre de manière pertinente et concise
        let systemPrompt = "";
        // Rule based system prompt to adapt the AI's response
        const basePromptRules = `
            - Use Markdown formatting
            - Output ONLY the template below
            - One bullet per criterion
            - Each bullet must contain a short justification (max 12 words)
            - Do not write paragraphs
            - Do NOT merge criteria into one line
            - Do NOT repeat the file content
            - Always write in English
            - Use emojis exactly as shown
            - Do not add any text outside the template
        `;
        // Templates for answer 
        const responseTemplate = `
            RESPONSE TEMPLATE:
            ✅ Points present
                - Criterion : short justification
                - Criterion : short justification
            
            ❌ Points missing
                - Criterion : short justification
                - Criterion : short justification
            
            ✏️ Suggestions for improvement
                - One short actionable suggestion
                - One short actionable suggestion
                - One short actionable suggestion
        `;
        // README prompt
        if (message.toLowerCase().includes("readme")) {
            systemPrompt = `You are an expert in open-source documentation analysis.
            Your task is to analyze the README.md file of a given project and evaluate whether each criterion below is PRESENT or MISSING, with a short justification.
            Criteria:
            1. Purpose of the project
            2. Explanation of the code structure
            3. Overview of the architecture
            4. Main characteristics of the project
            5. Community and contribution practices
            6. Practices, techniques, methods, and technologies used
            ${basePromptRules}
            ${responseTemplate}
        `;
        // CONTRIBUTING prompt
        } else if (message.toLowerCase().includes("contributing")) {
            systemPrompt = `You are an expert in open-source documentation analysis.
            Your task is to analyze the CONTRIBUTING.md file of a given project and evaluate whether each criterion below is PRESENT or MISSING, with a short justification.
            Criteria:
                1. Steps to contribute
                2. Tasks suitable for newcomers
                3. Explanation of how to submit a change
                4. Information about the code, tests, and database
                5. Source information to get started with the project
                6. The code of conduct for contributors
            ${basePromptRules}
            ${responseTemplate}
        `;
        // DOCUMENTATION prompt
        } else {
            systemPrompt = `You are an expert in open-source documentation analysis.
            Your task is to analyze the CONTRIBUTING.md file of a given project and evaluate whether each criterion below is PRESENT or MISSING, with a short justification.
            Criteria:
                1. The project has a clear and concise README.md file that provides an overview of the project, its purpose, and how to get started.
                2. The project has a CONTRIBUTING.md file that outlines the guidelines for contributing to the project, including how to submit issues and pull requests.
                3. The project has a clear and concise documentation that help the onboarding of new developers.
            ${basePromptRules}
            ${responseTemplate}
        `;}
        ;
        // Appel à Ollama
        const response = await fetch("http://localhost:11434/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify({
                model: "mistral", // Vous pouvez changer pour: neural-chat, mistral, etc.
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                stream: false,
            })
        });

        const data = await response.json();

        // Extraire la réponse de l'IA (format Ollama)
        const aiReply = data.message?.content || data.choices?.[0]?.message?.content || "No response from AI."; // si message existe, prendre son contenu, sinon prendre le contenu du premier choix, sinon message par défaut

        let conversationId: number;

        if (clientConversationId) {
            // Réutiliser l'ID existant
            conversationId = clientConversationId;
        } else {
            // Créer un nouvel ID seulement pour la première fois
            const lastConversation = db.prepare("SELECT MAX(conversation_id) as max FROM conversations").get() as { max: number } | undefined;
            conversationId = (lastConversation?.max || 0) + 1;
        }

        // Enregistrer les messages avec le même conversationId
        db.prepare("INSERT INTO conversations (conversation_id, role, content) VALUES (?, ?, ?)").run(conversationId, "User", message);
        db.prepare("INSERT INTO conversations (conversation_id, role, content) VALUES (?, ?, ?)").run(conversationId, "AI", aiReply);

        res.status(200).json({ reply: aiReply, conversationId }); // Réponse de l'IA au format JSON à ma question

    } catch (error) {
        console.error("AI error", error);
        return res.status(500).json({ reply: "Internal Server Error" });
    }
}