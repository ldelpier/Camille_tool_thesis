# 🐰 Camille
## 📽️ Overview
Camille is a web site designed to help Open Source community. In this repository, you will find a tool that can help you write documentation for OS projects.
Discover it and make it your own!

## 📚 Content
This is the content of README.md
1. Purpose of the project
2. Explanation of the code structure
3. Overview of the architecture
4. Getting started
5. Main characteristics of the project
6. Community and contribution practices
7. Practices, techniques, methods, and technologies used


## 🧭 Purpose of the project
This project is being carried out as part of a university thesis. It aims to assist the open source community with the documentation. Documentation is often overlooked in open source projects, yet it is an important part of the project. It enables new developers to join the project efficiently, but also help mainteners to maintain it.
The tool we have designed is meant to facilitate the process of writing README and CONTRIBUTING files by explicitly flagging missing information based on criteria found in the literature and providing some recommendations.
The tool uses LLM model, so there may be hallucinations and the answers may not be 100% correct 😅.

## 👩‍🏫 Explanation of the code structure
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app). It uses the **Next.js Page Router**, which is based on a file-system routing mechanism: each file inside the `pages/` directory automatically becomes a route in the application. For example, `pages/index.tsx` maps to `/`, and files inside `pages/api/` are treated as API endpoints instead of frontend pages.
To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

The structure of the code is explained in the [CONTRIBUTING.md](https://github.com/ldelpier/master_thesis/blob/front_back/CONTRIBUTION.md).

## 🎬 Getting started
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎖️ Main characteristics of the project
As mentioned above, this projects uses LLMs. To do this, we use Ollama with the Mistral model. This model can of course be changed if it no longer meets our requirements.
Another important point concerns the documentation : we focus on README and CONTRIBUTING files from open source projects on GitHub, but we can extend this to other types of documentation.

## 👥 Community and contribution practices
The administrators of this project is Louise Delpierre (for the moment).
Any contribution is welcome if it is made with respect and a desire to help, rather than to judge and criticise.
If you want to contribute by improving or adding something to this project, please go check [CONTRIBUTING.md](https://github.com/ldelpier/master_thesis/blob/front_back/CONTRIBUTION.md). <!-- il faut mettre un lien correct (celui du main)>

## ✒️ Practices, techniques, methods, and technologies used
Currently, I don't know what to say about practice, techniques, methods, and so on. However, I can say this : make the best we can, the smallest change is a change and a great start to begin. Document what you make for you and for others so try to explain like you have to explain to a child of 7 year 😉.
About the technologies used here, we use the framework "Next.js" and we also use SQLite for the database. The languages are :
- javascript (typescript)
- css (manually so no framework)



<!--## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.-->
