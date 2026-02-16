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

        // Prompt système pour guider l'IA à répondre de manière pertinente et concise
        const systemPrompt = `
            You are an expert developer in open source project documentation, particularly README.md and CONTRIBUTING.md documentation.
            Your mission is to help new developers onboard into open source projects by analyzing the documentation provided by the user and checking whether it meets the following criteria depending on the type of documentation (README.md or CONTRIBUTING.md):
            For that you will receive the link of the project and you have to find and analyze the README.md and CONTRIBUTING.md files of the project and check if they meet the following criteria:
            Criteria for README.md:
                1. The purpose of the project
                2. Explanation of the code structure
                3. An overview of the code structure and architecture
                4. The main characteristics of the project
                5. An understanding of the community and its practices
                6. A description of the practices, techniques, methods, and technologies used
            Criteria for CONTRIBUTING.md:
                1. Steps to contribute
                2. Tasks suitable for newcomers
                3. Explanation of how to submit a change
                4. Information about the code, tests, and database
                5. Source information to get started with the project
                6. The code of conduct for contributors
            If a point is missing or incomplete, indicate it clearly.
            You must always answer in English, even if the question is in another language. 
            Format of the response is a structured markdown file as follows:
                - ✅ Points present
                - ❌ Points missing
                - ✏️ Suggestions for improvement
        `;
        // Appel à Ollama (gratuit, local)
        const response = await fetch("http://localhost:11434/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify({
                model: "phi", // Vous pouvez changer pour: neural-chat, mistral, etc.
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                stream: false,
            })
        });

        const data = await response.json();

        // Extraire la réponse de l'IA (format Ollama)
        const aiReply = data.message?.content || "No response from AI."; // si message existe, prendre son contenu, sinon message par défaut
        console.log("AI Reply:", aiReply);

        res.status(200).json({ reply: aiReply }); // Réponse de l'IA au format JSON à ma question

    } catch (error) {
        console.error("AI error", error);
        return res.status(500).json({ reply: "Internal Server Error" });
    }
}