import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

// Formatage ddes données dans la conversation
type Data = {
    reply: string;
    conversationId?: number; 
    quickReplies?: QuickReply[];
};
// Formatage des quick replies
type QuickReply = {
    label: string;
    target: string;
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
        // Récupérer le message de l'utilisateur
        const { message, conversationId: clientConversationId, mode, quickReplyTarget } = req.body; 

        if (!message || typeof message !== "string") {
            return res.status(400).json({ reply: "Invalid message" });
        }

        let systemPrompt = "";
        // Les règles du prompt pour la réponse de l'IA
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
        // Template pour la réponse 
        const responseTemplate = `
            RESPONSE TEMPLATE:
            ✅ Present points
                - on its own line
                - each suggestion must start with "-"
                - Criterion : short justification
            
            ❌ Missing points
                - on its own line
                - each suggestion must start with "-"
                - Criterion : short justification
            
            The section "✏️ Suggestions for improvement" must be:
            - on its own line
            - each suggestion must start with "-"
            - no other bullets allowed in this section
        `;
        // JSON instruction 
        const jsonInstruction = `
            Return a valid JSON object with exactly these fields:
            {
                "reply": "string (the markdown analysis)",
                "quickReplies": [
                    { "label": "short suggestion", "target": "snake_case_identifier" }
                ]
            }
            Do not add any text outside the JSON object.
            If there are NO suggestions for improvement, quickReplies must be an empty array.
            Do not invent suggestions. 
        `;
        // Quick reply handling prompt
        if (mode === "quick_reply") {
            systemPrompt = `You are an expert in open-source documentation analysis.
            The user just selected this improvement topic: "${quickReplyTarget}".
            Analyze the repository content of the project and give a polite and pedagogical recommendation to the user.
            Do not repeat the file content or provide generic advice.
            Provide concrete examples and actionable advice related to this specific topic.
            ${jsonInstruction}
            ${basePromptRules}

        `;
        // README prompt
        } else if (message.toLowerCase().includes("readme")) {
            systemPrompt = `You are an expert in open-source documentation analysis.
            Your task is to analyze the README.md file of a given project and evaluate whether each criterion below is PRESENT or MISSING, with a short justification.
            Criteria:
                1. Purpose of the project
                2. Getting start to help user of the project to run the project
                3. Explanation of the code structure which provide a view of the files of the project and explain how the project is organized.
                4. Main characteristics of the project which are the main feature of the project
                5. Community and contribution practices
                6. Licence
                If criteria is a link or a redirection to another files it is ok because it present in the README.me.
            ${jsonInstruction}
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
            ${jsonInstruction}
            ${basePromptRules}
            ${responseTemplate}
        `;
        // DOCUMENTATION prompt
        } else {
            systemPrompt = `You are an expert in open-source documentation analysis.
            Your task is to analyze the documentation files of a given project and evaluate whether the documentation is well written or not and if it respect its putpose.
            For example, does the Code of conduct of the project explain correctly the rules of interaction between contributors ? Yes,it respect its purpose
            ${jsonInstruction}
            ${basePromptRules}
            ${responseTemplate}
        `;}
        ;

        // Appel à Ollama
        const response = await fetch("http://localhost:11434/api/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                model: "mistral",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                stream: false,
                temperature: 0,
            })
        });

        const data = await response.json();

        // Extraire la réponse de l'IA (format Ollama)
        // si message existe, prendre son contenu, sinon prendre le contenu du premier choix, sinon message par défaut
        const rawContent = data.message?.content || data.choices?.[0]?.message?.content;

        let aiReply = "No  response from AI.";
        let quickReplies: QuickReply[] = [];

        // Afficher les quick replies
        try {
            const parsed = JSON.parse(rawContent);
            aiReply = parsed.reply;
            const hasSuggestion = aiReply.includes("✏️ Suggestions for improvement") && 
            parsed.quickReplies && 
            parsed.quickReplies.length > 0;

            if (hasSuggestion){
                quickReplies = parsed.quickReplies;
            } else {
                quickReplies = []; 
            }
        } catch (err) {
            console.error("JSON parse error:", rawContent);
            aiReply = rawContent;
        }

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

        // Réponse de l'IA au format JSON à ma question
        res.status(200).json({ reply: aiReply, conversationId, quickReplies }); 

    } catch (error) {
        console.error("AI error", error);
        return res.status(500).json({ reply: "Internal Server Error" });
    }
}