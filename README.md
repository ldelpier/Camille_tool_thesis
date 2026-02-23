# Camille
## ![Rabbitkiki](image.png) Overview 
Camille is a web site designed to help Open Source community. In this repository, you will find a tool that can help you write documentation for OS projects. 
Discover it and make it your own! 

## 📚 Content
This is the content of README.md
- **`Purpose of the project`**
- **`Explanation of the code structure`**
- **`Overview of the architecture`**
- **`Getting started`**

## 🧭 Purpose of the project 
This project is being carried out as part of a university thesis. It aims to assist the open source community with the documentation. Documentation is often overlooked in open source projects, yet it is an important part of the project. It enables new developers to join the project efficiently, but also help mainteners to maintain it. 
The tool we have designed is meant to facilitate the process of writing README and CONTRIBUTING files by explicitly flagging missing information based on criteria found in the literature and providing some recommendations. 
The tool uses LLM model, so there may be hallucinations and the answers may not be 100% correct 😅.

## 👩‍🏫 Explanation of the code structure 
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app). It uses the **Next.js Page Router**, which is based on a file-system routing mechanism: each file inside the `pages/` directory automatically becomes a route in the application. For example, `pages/index.tsx` maps to `/`, and files inside `pages/api/` are treated as API endpoints instead of frontend pages.
The project is organized into the following main directories:
### `public/`
Contains static assets such as images in various formats. Files in this directory are served directly at the root path. 
### `src/`
This is the main source folder of the project. It contains four subdirectories:
- **`data/`**
    Contains the conversation database (data storage for chat history).
- **`lib/`**
    Contains the database initialization.
- **`pages/`**
    This is the core of the application when using the Next.js Page Router. It contains both frontend pages and backend API routes:
    - **`pages/api/`**
        Contains API routes:
        - The **chat.ts**, which connects the frontend to the LLM model and manages conversation history.
        - The **history.ts**, which allows you to retrieve and manage stored conversations.
    - Other files in `pages/` define the frontend of the website:
        - `index.tsx` — Home page (`/`)
        - `chatpage.tsx` — Chat interface page, accessible after sending a message from the home page
        - `history.tsx` — Conversation history (archive) page
        - `setting.tsx` — Settings page (not yet implemented)
        - `_app.tsx` — Custom App component (used to initialize pages)
        - `_document.tsx` — Custom Document component (used to extend the HTML document structure)
- **`styles/`**
    contains the global style of the application and the style of the index, chatpage, history pages. 

## 🗼Overview of the architecture 
what i put there ? 

## Getting started 
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
## Main characteristics of the project 
LLM 
blabla 
## Community and contribution practices 
agile 
## Practices, techniques, methods, and technologies used 
... 


<!--## The routes do not exist yet (work in progress)

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.-->
