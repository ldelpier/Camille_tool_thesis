# 👥 Contributing to Camille
## 📽️ Overview
Contributions to Camille project include code, documentation, answering user questions, running the project's infrastructure.
The Camille project welcomes all contributions from anyone willing to work in good faith with other contributors and the community. No contribution is too small and all contributions are valued.

## 📚 Content
1. Code of Conduct
2. Information about the code
3. How to join the project
4. Build your workplace
5. Steps to Contribute
6. Task for Newcomers
7. How to submit a change
    - Pull Request
    - Reviewing pull requests
    - Labeler
8. Repositories
9. Talk to the community

## 🧑‍🤝‍🧑 Code of Conduct <!-- il faut mettre le lien correct (celui du main)>
This project adheres to a [Code of Conduct](https://github.com/ldelpier/master_thesis/blob/documentation/CODE_OF_CONDUCT.md). By participating, you agree to uphold a welcoming, inclusive, and respectful environment.

## ℹ️ Information about the code 
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
        - `index.tsx` — Home page (`/`).
        - `chatpage.tsx` — Chat interface page, accessible after sending a message from the home page.
        - `history.tsx` — Conversation history (archive) page.
        - `setting.tsx` — Settings page (not yet implemented).
        - `_app.tsx` — Custom App component (used to initialize pages).
        - `_document.tsx` — Custom Document component (used to extend the HTML document structure).
- **`styles/`**
    contains the global style of the application and the style of the index, chatpage, history pages.

## 🔄 How to join the project
To join the project, there are some stepsto follow 
1. Take information about the project by reading the README.md file in the seed of the project.
2. Find a issue or a part of the project you want work on.
3. Fork the project to make the change you want.
4. Create a branch to make your change following this format : new_name and the name gives us a idea on what you are working on.
5. Commit your change with explicit name and a short description if need it to understand your changes.
6. When your change is rock solid, make a pull request to add you change to the main project.
That is it. You join our project, Welcome !
For the moment it is all I can find for this "how to join the project"

## 🚀 Steps to Contribute
is not the same thing than how to join ? 
There are several way to make a contribution, you have a new idea of feature that you want to implement, you want to change something because there is a bug or you want to help in the non code part to be include in this amazing community of open source. 
### New idea 
This is the steps to follow if you want to propose a new idea: 
- Check if your idea does not exist yet in the project by looking in the branch for example
- It does not exist yet, great! Open a new **discussion** to suggest your new feature 
- Provide details such as:
  - The problem your feature solves.
  - How it could be implemented.
- The new feature must be validated by an administrator before being inserted into the project. <!-- this is temporary and it will be change if the project succeeded>
- Once the idea is accepted, make a new branch with an explicite name.
- Commit change on your branch. The change must be accompanied by documentation.
- Pull request your branch on the main branch of the project.
### Fix a bug 
This is steps to follow if you want to fix a bug:
- Check if the bug is already reported in the **Issues** tab.
- If not, open a new **Issue** <!-- il faut mettre un lien si j'ai un template>
- The commit of the fix must be documented 
### 📝 Improve Documentation
- Make a good documentation to make the project accessible to everyone.
- Contribute by fixing typos, clarifying explanations, or adding useful examples.
- Write it in an easy english
- Make all this change in the right branch.
- <!-- il faut mettre un lien si j'ai un template>

## 👌 Task for news contributors
There should be a list of task/issue that are "easy" and well documented for newcomers 
Or at least where newcomers could find information about it 

## 📬 How to submit a change
To submit a change, you should have made a change and commit it in the right branch. When you are happy with your change, that is working, documented and tested, you can submit your change. But how to do that ? By following the next steps.
If you need an information or help, never hesitate to open a discussion.
### 📜 Pull Resquest
A pull request allows a developer to notify members of their team that they have completed a feature. It also allows finished functionality to be put on the main repository.
A template should be created to bring a bit of formality to the project and help developpers to write clear and usefull pull request.
Each pull request made should be review by at least one other contributor. 
### 🖊️ Reviewing pull requests
All contributors who review and provide feedback on Pull Requests have a responsibility to both the project and the individual making the contribution.
Reviews and feedback must be helpful, insightful, and geared towards improving the contribution.
If pull request is blocked, there will be an pedagogic and nice explanation so a simple no will be not accepted as a justification.
Be open to having your mind changed. Be open to working with the contributor to make the pull request better.

Reviews that are dismissive or disrespectful of the contributor or any other reviewers are strictly counter to the Code of Conduct.
When reviewing a pull request, the primary goals are for the codebase to improve and for the person submitting the request to succeed. Whatever happens, the submitters should come away from the experience feeling like their effort was not wasted or unappreciated especially when it come from a new contributor because they are an opporunity to grow the community. 

Focus first on the most significant aspects of the change :

    Does this change make sense ?
    Does this change make the project better, even if only incrementally?
    Are there clear bugs or larger scale issues that need attending to?
    Is the commit message readable and correct? If it contains a breaking change is it clear enough?
    The change come with a test and a documentation ? 

Then focus on relative performance, perfect grammar and so on. It is important but we need a list a priorities.

When changes are necessary, request them, do not demand them, and do not assume that the submitter already knows how to add a test or run a benchmark. Specific performance optimization techniques, coding styles, and conventions change over time. The first impression you give to a new contributor never does. If your comments were addressed but were not folded automatically after new commits or if they proved to be mistaken, please, hide them with the appropriate reason to keep the conversation flow concise and relevant.
Be aware of the person behind the code!

If a pull request appears to be abandoned or stalled, it is polite to first check with the contributor to see
if they intend to continue the work before checking if they would mind if you took it over.
When doing so, it is courteous to give the original contributor credit for the work they started by using an Author: meta-data tag in the commit.

Regarding the approval of changes, any administrator is authorized to approve any other contributor's work and collaborators are not permitted to approve their own pull requests.
Collaborators indicate that they have reviewed and approve of the changes in a pull request either by using GitHub's Approval Workflow, which is preferred, or by leaving an LGTM ("Looks Good To Me") comment.
When explicitly using the "Changes requested" component of the GitHub Approval Workflow, show empathy.
That is, do not be rude or abrupt with your feedback and offer concrete suggestions for improvement, if possible. If you're not sure how a particular change can be improved, say so. When you have suggestd changes in the pull resquest, it is a good idea to follow up them. Make sure that your review is not vague, dismissive, or unconstructive. 

Use Changes requested to block a pull request from landing. When doing so, explain why you believe the pull request should not land along with an explanation of what may be an acceptable alternative course, if any. If you are stuck for idea, try using the criteria above. 
For the submitter : be patient, accept that there are different opinions, performance is not everything and try ! 
### 🏷️ Labeler
Once a template for pull request has been created, labels may appear to provide more structure and guidance for the pull request. 

## 📁 Repositories
At least three repositories should be described here: 
- the one containing the source code
- the one containing the documentation and templates
- and finally the one with the gitHb action. 

## 🦜 Talk to the community
For the moment, the community is composed of one person but I am sure that it will change and maybe a reddit or a discord will be created and a link to these chat channel will be added here. 
