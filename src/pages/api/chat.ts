import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";
import Groq from "groq-sdk";

// Formatage ddes données dans la conversation
type Data = {
    reply: string;
    conversationId?: number;
};

// Détecter si le message contient une URL GitHub 
function extractGitHubUrl(message: string): string | null {
    const match = message.match(/https:\/\/github\.com\/[^\s]+/);
    return match ? match[0] : null;
}

// URL GiHub en URL raw pour lire le contenu
function convertToRawUrl(githubUrl: string): string {
    return githubUrl
        .replace("github.com", "raw.githubusercontent.com")
        .replace("/blob/", "/");
}

// Fetch le contenu depuis GitHub
async function fetchGitHubFileContent(githubUrl: string): Promise<string | null> {
    try {
        const rawUrl = convertToRawUrl(githubUrl);
        const response = await fetch(rawUrl);

        if (!response.ok) {
            console.error(`Erreur lors du fetch GitHub : ${response.status}`);
            return null;
        }

        return await response.text();
    } catch (error) {
        console.error("Erreur fetch GitHub :", error);
        return null;
    }
}
// PROMPTS //
// Prompt system global 
const systemPrompt = `
You are a documentation compliance analyzer for open-source projects.
Your task is to verify whether specific criteria are EXPLICITLY present (✅) in a given document.
Strict rules:
    - Use ONLY the provided document content.
    - Do NOT infer or assume information.
    - A criterion is "✅" ONLY if it is clearly written in the document.
    - If not explicitly found, mark it as "❌".
    - For every "✅" criterion, you MUST quote a short exact excerpt from the document as 🔎.
    - If no quote exists, the criterion must be "❌".
    - Do NOT rewrite or summarize the document.
    - Do NOT add explanations outside the JSON format.
    - Always respond in English.
    - Output must be valid JSON only.
Allowed values: "✅" or "❌".
`;

// User Prompt README
function buildReadmePrompt(fileContent: string) { return `
    Here is the README.md file to analyze:
    """
    ${fileContent}
    """
    Check the document against the following criteria:
        1. Purpose of the project
        2. Getting started instructions (how to run or install the project)
        3. Main features of the project
        4. Community and contribution practices (link to the contributing file and community-related matters)
        5. License information (indicate the link to it)
    Return the result in this exact JSON format:
    {
    "Purpose": { "status": "✅|❌", "🔎": "short quote or null" },
    "Getting_started": { "status": "✅|❌", "🔎": "short quote or null" },
    "Main_features": { "status": "✅|❌", "🔎": "short quote or null" },
    "Community_contribution": { "status": "✅|❌", "🔎": "short quote or null" },
    "License": { "status": "✅|❌", "🔎": "short quote or null" }
    }`;
}

// User Prompt CONTRIBUTING
function buildContributingPrompt(fileContent: string) { return `
    Here is the CONTRIBUTING.md file to analyze:
    """
    ${fileContent}
    """
    Check the document against the following criteria:
        1. Steps to contribute (How to contribute to the project, what can we do)
        2. Tasks suitable for newcomers (where find good first issues, beginners-friendly task list)
        3. Explanation of how to submit a change (PR, commits, branches)
        4. Information about the code (Tech stack, setup, the structure of the repository)
        5. Code of conduct for contributors (Rules of behavior, indicate if there is a link to it)
    Return the result in this exact JSON format:
    {
    "Steps_to_contribute": { "status": "✅|❌", "🔎": "short quote or null" },
    "Tasks_for_newcomers": { "status": "✅|❌", "🔎": "short quote or null" },
    "Submit_change_explanation": { "status": "✅|❌", "🔎": "short quote or null" },
    "Code_information": { "status": "✅|❌", "🔎": "short quote or null" },
    "Code_of_conduct": { "status": "✅|❌", "🔎": "short quote or null" }
    }`;
}

// User Prompt Document
function buildDocumentationPrompt(fileContent: string) { return `
    Here is the documentation file to analyze:
    """
    ${fileContent}
    """
    Check whether the document fulfills its intended purpose.
    Criteria:
        1. Clear explanation of its purpose
        2. Instructions or guidelines are clearly written
        3. Target audience is identifiable
        4. Rules or conventions are explicitly defined (if applicable)
        5. Examples or usage instructions are provided
    Return the result in this exact JSON format:
    {
    "Purpose_explained": { "status": "✅|❌", "🔎": "short quote or null" },
    "Clear_instructions": { "status": "✅|❌", "🔎": "short quote or null" },
    "Target_audience": { "status": "✅|❌", "🔎": "short quote or null" },
    "Rules_defined": { "status": "✅|❌", "🔎": "short quote or null" },
    "Examples_or_usage": { "status": "✅|❌", "🔎": "short quote or null" }
    }`;
}

// CLE API 
const groqai = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    // Autoriser uniquement les requêtes POST
    if (req.method !== "POST") {
        return res.status(405).json({ reply: "Method Not Allowed" });
    }
    try {
        // Récupérer le message de l'utilisateur
        const { message, conversationId: clientConversationId } = req.body; 

        if (!message || typeof message !== "string") {
            return res.status(400).json({ reply: "Invalid message" });
        }

        // Détection URL dans le message
        let userPrompt = message;
        const githubUrl = extractGitHubUrl(message);
        let fileContent: string | null = null;

        if (githubUrl) {
            fileContent = await fetchGitHubFileContent(githubUrl);
            if (!fileContent) {
                return res.status(400).json({ reply: "Unable to fetch the file from GitHub. Please check the URL and make sure the repository is public." });
            }

            if (message.toLowerCase().includes("readme")) { 
                userPrompt = buildReadmePrompt(fileContent);
            } else if (message.toLowerCase().includes("contributing")) {
                userPrompt = buildContributingPrompt(fileContent);
            } else {
                userPrompt = buildDocumentationPrompt(fileContent);
            }
        } else {
            return res.status(400).json({reply: "Please provide a valid GitHub URL to analyse."});
        }

        // Appel à API Groq
        const response = await groqai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0,
            max_completion_tokens: 1000,
        });

        const aiReply = response.choices[0]?.message?.content;
        if (!aiReply){
            return res.status(500).json({reply: "Empty response from Groq"});
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
        res.status(200).json({ reply: aiReply, conversationId }); 

    } catch (error: any) {
        console.error("AI error", error);
        if (error?.status === 429) {
            return res.status(429).json({ reply: "Quota limit reached. Please try again tomorrow." });
        }
        else if (error?.status === 413){
            return res.status(413).json({ reply: "The message is too big, please reduce your message."});
        }
        return res.status(500).json({ reply: "Internal Server Error" });
    }
}