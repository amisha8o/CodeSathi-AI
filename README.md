
# 🤖 CodeSathi AI

### Your Intelligent AI-Powered Programming Assistant

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini AI" />
</p>

<p align="center">
  <b>Ask questions. Understand code. Learn faster.</b>
</p>

<p align="center">
  CodeSathi AI is an AI-powered programming assistant designed to help developers explore coding concepts, understand technical explanations, and get structured answers with code examples through a clean and interactive web interface.
</p>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Project Highlights](#-project-highlights)
- [Technology Stack](#-technology-stack)
- [Project Status](#-project-status)

---

## 📖 About the Project

**CodeSathi AI** is a full-stack web application that brings AI-assisted programming help into a simple, accessible interface.

The application uses a React-based frontend and a Node.js/Express backend to communicate with Google's Gemini AI. Users can submit programming questions, view formatted answers, and manage conversations using the chat interface.

The project focuses on making coding assistance easier to access while demonstrating practical full-stack development skills, REST API integration, AI service integration, and frontend state management.

### 🎯 Project Objectives

- Build an interactive AI-powered programming assistant.
- Integrate a frontend application with a backend REST API.
- Generate AI responses using the Gemini API.
- Present explanations and code snippets in a readable format.
- Support conversation history and chat management.
- Apply basic backend security practices, request validation, and rate limiting.
- Create a foundation for future enhancements and public deployment.

---

## ✨ Project Highlights

| Feature | Description |
|---|---|
| 🤖 AI Coding Assistance | Submit programming questions and receive AI-generated responses. |
| 💻 Code Presentation | Display code snippets in a structured, syntax-highlighted format. |
| 📝 Markdown Rendering | Render formatted text, lists, and code blocks. |
| 💬 Chat History | Keep conversations available in browser storage. |
| ➕ New Chat | Start a separate conversation. |
| 🗑️ Chat Management | Delete individual chats or clear saved conversations. |
| 🔌 REST API Integration | Connect the React frontend to the Express backend. |
| 🔐 Environment-Based Secrets | Keep the Gemini API key in backend environment configuration. |
| ⚡ Request Validation | Validate incoming questions before processing them. |
| 🛡️ Rate Limiting | Limit repeated requests to the AI endpoint. |

---

## 🧰 Technology Stack

### Frontend
- **React** — component-based user interface.
- **Vite** — frontend development server and build tooling.
- **JavaScript** — application logic and interactions.
- **CSS** — styling and responsive interface.
- **React Markdown** — render Markdown-formatted AI responses.
- **Remark GFM** — support GitHub-Flavored Markdown features.
- **React Syntax Highlighter** — display formatted code snippets.

### Backend
- **Node.js** — JavaScript runtime.
- **Express.js** — HTTP server and REST API routes.
- **Google Gemini API** — AI-powered response generation.
- **dotenv** — load configuration from environment variables.
- **CORS** — configure cross-origin requests.

### Development Tools
- **Git** — source control.
- **GitHub** — repository hosting and project collaboration.
- **npm** — dependency management.

---

## 📊 Project Status

- [x] React frontend implemented
- [x] Express backend implemented
- [x] Gemini AI integration tested locally
- [x] Markdown and code formatting
- [x] Browser-based chat history
- [x] New Chat and chat deletion
- [x] Backend health endpoint
- [x] Production frontend build verified
- [x] Code lint checks passed
- [x] Initial source code pushed to GitHub
- [ ] Add final application screenshots
- [ ] Deploy frontend and backend publicly
- [ ] Add the verified live demo URL

---

**Repository:** [github.com/amisha8o/CodeSathi-AI](https://github.com/amisha8o/CodeSathi-AI)

---

## 🖥️ Application Preview

CodeSathi AI provides an interactive interface for asking programming questions, viewing AI-generated answers, and managing coding conversations.

### 1. Home Page & Chat Interface

The main interface allows users to enter programming questions and interact with the AI assistant.

<!-- Replace the path below with the actual home page screenshot -->
<!-- Save the screenshot inside the repository's screenshots folder -->

<p align="center">
  <img width="1467" height="911" alt="image" src="https://github.com/user-attachments/assets/de8eba80-713b-48b6-ad6d-46fb77f7ffa6" />

</p>

### 2. AI-Generated Response

The assistant displays generated explanations with Markdown formatting and readable code blocks.

<p align="center">
  <img width="1382" height="895" alt="image" src="https://github.com/user-attachments/assets/29ccf373-b277-44ff-aea3-c5ff56b41e1b" />

</p>

### 3. Chat History & Conversation Management

Users can start new conversations, revisit saved chats, and delete conversations using the chat management features.

<p align="center">
  <img width="1030" height="887" alt="image" src="https://github.com/user-attachments/assets/0c979a8a-c98f-41a5-9694-b30ec4accfb1" />

</p>
---
---

## 🏛️ System Architecture

CodeSathi AI follows a client-server architecture in which the React frontend communicates with a Node.js/Express backend, and the backend integrates with Google's Gemini AI service.

```text
┌──────────────────────────┐
│          User            │
│  Enters a coding prompt  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│     React + Vite UI      │
│  Chat, history, display  │
└────────────┬─────────────┘
             │ HTTP Request
             ▼
┌──────────────────────────┐
│     Express Backend      │
│ Validation and API logic │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      Gemini AI API       │
│  Generates AI response   │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│  Backend returns answer  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│   Frontend renders text  │
│  Markdown and code blocks│
└──────────────────────────┘
```

### 🔄 How It Works

1. **Prompt Input:** The user enters a programming question in the chat interface.
2. **Frontend Validation:** The application checks that the question is not empty before sending a request.
3. **API Request:** The frontend sends the question to the Express backend.
4. **Backend Processing:** The backend validates the incoming request and applies configured rate limits.
5. **AI Integration:** The backend sends the request to Gemini using the server-side API key.
6. **Response Handling:** The backend processes the result and returns a response to the frontend.
7. **Answer Display:** The frontend renders the answer with Markdown formatting and readable code snippets.
8. **Conversation Management:** Chat history can be saved and managed in browser storage.

### 🔐 Security Considerations

- The Gemini API key is configured on the backend using environment variables.
- API requests are validated before processing.
- Rate limiting helps restrict repeated requests to the AI endpoint.
- CORS configuration controls which frontend origin can access the backend.
- Environment files and dependency directories are excluded from Git using `.gitignore`.

---

## ⚙️ Installation & Local Setup

Follow these steps to download, configure, and run CodeSathi AI on your local machine.

### 📋 Prerequisites

Before starting, make sure you have:

- [Node.js](https://nodejs.org/) installed.
- npm (included with Node.js).
- Git installed.
- A Google Gemini API key for AI response generation.

### 1️⃣ Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/amisha8o/CodeSathi-AI.git
cd CodeSathi-AI
```

### 2️⃣ Install Backend Dependencies

Navigate to the server directory:

```bash
cd server
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file inside the `server` directory.

Add the following configuration:

```env
GEMINI_API_KEY=your_gemini_api_key
CLIENT_ORIGIN=http://localhost:5173
PORT=5000
```

Replace `your_gemini_api_key` with your own Gemini API key.

**Important:** Never publish your actual API key or commit the `.env` file to GitHub.

### 4️⃣ Start the Backend Server

From the `server` directory, use the start command configured in `server/package.json`.

For example, if the package defines a `start` script:

```bash
npm start
```

Keep this terminal running.

### 5️⃣ Install Frontend Dependencies

Open a second terminal and navigate to the frontend directory from the project root:

```bash
cd client
npm install
```

### 6️⃣ Start the Frontend

Run the Vite development server:

```bash
npm run dev
```

Open the local URL printed in the terminal. The default Vite development address is usually:

```text
http://localhost:5173
```

### 7️⃣ Verify the Backend

With the backend running, open:

```text
http://localhost:5000/api/health
```

A healthy server should return a successful response indicating that the CodeSathi AI backend is running.

### ✅ Troubleshooting

| Problem | What to check |
|---|---|
| Backend connection error | Confirm the backend server is running on port `5000`. |
| AI request fails | Verify the Gemini API key and API availability. |
| CORS error | Check that `CLIENT_ORIGIN` matches the frontend origin. |
| Missing dependencies | Run `npm install` in the relevant `client` or `server` directory. |
| Environment variable not found | Confirm the `.env` file is inside `server` and restart the backend. |

---

## 🔌 API Documentation

CodeSathi AI uses a backend REST API to process programming questions and communicate with the Gemini AI service.

### Base URL

**Local development:**

```text
http://localhost:5000
```

### API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Check the backend root route. |
| `GET` | `/api/health` | Check backend health. |
| `POST` | `/api/ask` | Submit a programming question and receive an AI-generated response. |

### 1. Health Check

**Request**

```http
GET /api/health
```

**Purpose:** Verifies that the backend server is running.

### 2. Ask a Programming Question

**Request**

```http
POST /api/ask
Content-Type: application/json
```

**Example request body**

```json
{
  "question": "Explain binary search in Java with an example."
}
```

The backend validates the request, communicates with the Gemini AI service, and returns the generated answer according to the API response format.

> **Note:** The exact response fields depend on the implementation in `server/server.js`. Refer to the source code for the definitive response schema.

### ⚠️ Error Handling

The backend is designed to handle invalid input and AI service failures.

Potential error scenarios include:

- Empty or invalid programming questions.
- Questions that exceed the configured length limit.
- Requests exceeding the rate limit.
- Gemini API quota or authentication errors.
- Temporary AI service availability issues.
- Network or server errors.

The frontend should display an understandable error message when a request fails, rather than leaving the user without feedback.

---

## 🛡️ Security & Reliability

Security and reliability are important parts of the CodeSathi AI architecture.

- **Environment Variables:** Store the Gemini API key in the backend `.env` file.
- **Input Validation:** Reject invalid or empty questions.
- **Request Size Limit:** Restrict the size of incoming JSON requests.
- **Rate Limiting:** Limit repeated requests to the AI endpoint.
- **CORS Configuration:** Configure allowed frontend origins.
- **Error Handling:** Handle AI service failures and return appropriate error responses.
- **Secret Exclusion:** Use `.gitignore` to prevent environment files and dependency folders from being committed.

### Security Best Practices

1. Never expose the Gemini API key in frontend JavaScript.
2. Never commit `.env` files to the public repository.
3. Use environment variables for production configuration.
4. Configure CORS with the deployed frontend's exact origin.
5. Monitor API usage and configure suitable limits for public access.

---

## 🚀 Deployment Guide

CodeSathi AI can be deployed using separate hosting services for the frontend and backend.

### Recommended Deployment Platforms

| Component | Platform | Configuration |
|---|---|---|
| Frontend | Vercel | React + Vite |
| Backend | Render | Node.js + Express |
| AI Service | Google Gemini API | API key stored as an environment variable |

### Frontend Deployment — Vercel

1. Push the latest project changes to GitHub.
2. Import the `CodeSathi-AI` repository into Vercel.
3. Set the **Root Directory** to `client`.
4. Configure the build command as `npm run build`.
5. Set the output directory to `dist`.
6. Configure the production API URL using the environment variable `VITE_API_URL`.
7. Deploy the application after configuring the backend URL.

### Backend Deployment — Render

1. Create a new Web Service and connect the GitHub repository.
2. Set the **Root Directory** to `server`.
3. Configure the build command as `npm install`.
4. Set the start command according to the backend's `package.json`.
5. Add the required environment variables:

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |
| `CLIENT_ORIGIN` | Deployed frontend URL |
| `PORT` | Port configuration supported by the hosting platform |

6. Deploy the backend and verify its health endpoint.

### Production Checklist

- [ ] Configure the production frontend API URL.
- [ ] Configure backend CORS for the deployed frontend.
- [ ] Store API keys securely in hosting environment variables.
- [ ] Verify AI responses on the deployed application.
- [ ] Test chat history and other frontend features.
- [ ] Add the verified live demo URL to this README.

> **Note:** The live demo link will be added after deployment and testing are complete.

---

## 🧪 Testing & Quality Checks

CodeSathi AI has been tested locally to verify its core functionality and development workflow.

### Verification Checklist

- [x] Frontend runs locally using Vite.
- [x] Backend runs locally using Express.
- [x] Gemini API integration tested successfully.
- [x] AI responses display in the application.
- [x] Markdown and code syntax highlighting work.
- [x] Chat history is stored in the browser.
- [x] New Chat and chat deletion features work.
- [x] Backend health endpoint responds successfully.
- [x] Frontend production build completes successfully.
- [x] ESLint checks pass without warnings or errors.

### Before Production Release

- [ ] Test the deployed frontend and backend.
- [ ] Verify production environment variables and CORS settings.
- [ ] Test invalid inputs and API error handling.
- [ ] Confirm that the Gemini API key is never exposed in frontend code.
- [ ] Add the verified live demo URL.

> **Testing note:** The checks above reflect local verification. Production deployment checks will be completed after the application is deployed.

---

## 📁 Project Structure

```text
CodeSathi-AI/
├── client/                 # React + Vite frontend
│   ├── public/             # Static assets
│   ├── src/                # React application source
│   ├── package.json        # Frontend dependencies and scripts
│   └── vite.config.js      # Vite configuration
│
├── server/                 # Node.js + Express backend
│   ├── server.js           # Backend entry point (if named server.js)
│   ├── package.json        # Backend dependencies and scripts
│   └── .env                # Local environment variables (not committed)
│
├── .gitignore
└── README.md
```

> **Note:** The tree is illustrative. Actual files and folders may vary depending on the current repository structure.

## 🔮 Future Improvements

- Add streaming responses for a more interactive AI experience.
- Support multiple programming languages and code explanations.
- Improve error messages and loading indicators.
- Add secure server-side conversation persistence.
- Introduce automated tests for frontend and backend functionality.
- Add a publicly accessible live demo after deployment.

## 👩‍💻 Author

**Amisha Kumari**

- GitHub: [@amisha8o](https://github.com/amisha8o)
- Project Repository: [CodeSathi AI](https://github.com/amisha8o/CodeSathi-AI)

---

*Built to make programming concepts easier to understand with AI.*




