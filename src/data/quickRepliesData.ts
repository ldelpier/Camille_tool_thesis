export type QuickReply = {
    label: string;
    target: string; 
};

export type QuickReplyEntry = {
    label: string;
    recommendation: string;
};

export const quickRepliesData: Record<string, QuickReplyEntry> = {
    // Recommandation README
    Main_features: {
        label: "✨ List the main features", 
        recommendation: "**Recommendation — Main features** \n\nYour README doesn't highlight the features of the project. Add a short features list so users quickly understand the value and what makes your project special.\nThis section explains the features that make your project unique and different from what already exists. \n\nExample:\n```\n*Features*\n- 🎆 Special technology that stands out from the ordinary\n- 💬 Chat interface with AI-powered feedback\n- 📊 Compliance report per criterion\n- ❓ Does a feature need an explanation to use it?\n```",
    },
    // Recommandation CONTRIBUTING
    Steps_to_contribute: {
        label: "🪜 Add contribution steps",
        recommendation: "**Recommendation — Steps to contribute** \n\nYour CONTRIBUTING file doesn't explain how to contribute to this project. Add a step-by-step guide.\n\nQuestions:\n```- Where can we contribute in this project (code, documentation, ...)?\n- What can we do to contribute (new feature, fix bug, ...)?\n- How can we contribute, is there a template to follow?\nEach way to contribute schould be documented with a clear, precise, non-ambigus explanation.\n\nExemple 'How contribute': \n1. Add a new feature\n2. Fix a bug\n```",
    },
    Tasks_for_newcomers: {
        label: "🌱 Add newcomer-friendly tasks",
        recommendation: "**Recommendation — Tasks for newcomers** \n\nThere is no mention of beginner-friendly issues. A process that explain how find 'easy' tasks or make a list directly in this CONTRIBUTING file.\n Try to be clear and precise because entering in a new project can be a bit confusing in the beginning\n\nExample:\n```\n- 🏷️ Use GitHub labels like `good first issue` and mention them in the CONTRIBUTING file.\n- 🔗 A link to onbaording document of the project.\n```",
    },
};