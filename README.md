# AI Interviewer

A full-stack AI-powered interview preparation platform that generates personalized technical interview questions from your resume, evaluates your answers in real-time, and provides actionable feedback — all powered by a local LLM via Ollama. Your data never leaves your machine.

![Dark Theme](https://img.shields.io/badge/theme-dark%20editorial-1a1d27?style=flat-square)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs)
![Ollama](https://img.shields.io/badge/LLM-Ollama%20%2F%20Llama3-white?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-4169E1?style=flat-square&logo=postgresql)

---

## How It Works

1. **Paste your resume** (or upload a PDF/DOCX) and enter your target role
2. The AI generates **5 tailored interview questions** that progressively increase in difficulty
3. Answer each question at your own pace
4. Get an **instant score (0–10)**, detailed feedback, and actionable tips for each answer
5. Review, edit, and re-submit answers to improve

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Tailwind CSS 3, Zustand, React Router 7 |
| **Backend** | Node.js, Express 5, Multer (file uploads) |
| **Database** | PostgreSQL |
| **AI/LLM** | Ollama (Llama 3) — runs 100% locally |
| **File Parsing** | pdf-parse, Mammoth (DOCX) |

---

## Project Structure

```
AI-Interviewer/
├── ai-interview-backend/
│   ├── src/
│   │   ├── config/          # DB pool & Ollama LLM integration
│   │   ├── controllers/     # Route handlers (session, resume, question, answer)
│   │   ├── middlewares/      # Session middleware
│   │   ├── routes/           # Express route definitions
│   │   ├── services/         # Business logic (question generation, answer evaluation)
│   │   ├── utils/            # Resume parser (PDF/DOCX)
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Entry point
│   └── schema.sql            # Database schema
│
├── ai-interview-frontend/
│   ├── src/
│   │   ├── api/              # Axios API client
│   │   ├── components/       # Navbar, QuestionCard, QuestionGrid, SkeletonCard,
│   │   │                     # InterviewModal, Spinner
│   │   ├── pages/            # HomeView, QuestionsDashboardView
│   │   ├── store/            # Zustand state management
│   │   ├── App.js            # Root layout with mesh gradient background
│   │   └── index.css         # Tailwind base, component & utility layers
│   └── tailwind.config.js    # Custom dark theme tokens & animations
│
└── README.md
```

---

## Prerequisites

- **Node.js** v18+
- **PostgreSQL** running locally or remotely
- **Ollama** installed with the `llama3` model pulled

```bash
# Install Ollama: https://ollama.com
ollama pull llama3
```

---

## Setup

### 1. Database

Create a PostgreSQL database and run the schema:

```bash
createdb ai_interview
psql -d ai_interview -f ai-interview-backend/schema.sql
```

### 2. Backend

```bash
cd ai-interview-backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/ai_interview
OLLAMA_API_URL=http://localhost:11434
PORT=5000
```

Start the server:

```bash
npm run dev
```

### 3. Frontend

```bash
cd ai-interview-frontend
npm install
npm start
```

The app opens at **http://localhost:3000**.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/session/create` | Create a new session |
| `POST` | `/api/session/reset` | Reset the current session |
| `POST` | `/api/resume` | Submit resume text and target role |
| `POST` | `/api/resume/parse` | Upload and parse a PDF/DOCX file |
| `POST` | `/api/questions` | Generate interview questions via LLM |
| `GET` | `/api/questions` | Retrieve generated questions |
| `POST` | `/api/answers` | Submit an answer for evaluation |

---

## Database Schema

```sql
sessions    (id UUID, created_at TIMESTAMP)
resumes     (id UUID, session_id, content TEXT, role TEXT)
questions   (id SERIAL, session_id, question TEXT)
answers     (id SERIAL, session_id, question_id, answer TEXT, score INT, feedback TEXT, tips TEXT[])
```

