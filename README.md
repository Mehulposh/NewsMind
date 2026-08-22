# NewsMind

NewsMind is a full-stack, AI-powered news aggregation platform. It pulls articles from RSS feeds on a schedule, enriches them with AI-generated summaries, embeddings, sentiment, and topic clusters, then serves them through a React dashboard with semantic search, a RAG-based chat assistant, personalized recommendations, and email newsletter digests.

## Features

- **RSS Aggregation** — Fetches and parses configurable RSS feeds (`rss-parser`) on a cron schedule (default every 30 minutes), storing new articles in MongoDB and pushing live updates over Socket.IO.
- **AI Summarization** — Generates concise 2–3 sentence summaries for each article using Groq's `llama-3.3-70b-versatile` via LangChain, with a graceful plain-text fallback when no API key is configured.
- **Semantic Search (RAG)** — Embeds articles (Voyage AI `voyage-3-lite`, with a deterministic hash-based fallback embedding) and supports vector search through MongoDB Atlas Vector Search, falling back to in-memory cosine similarity when Atlas search isn't available.
- **Conversational News Chat** — A RAG chat endpoint that retrieves relevant articles for a user's question and has the LLM answer with numbered source citations, with chat history persisted per session.
- **Duplicate Detection & Topic Clustering** — Automatically flags near-duplicate articles and groups related articles into topic clusters based on embedding similarity.
- **Personalized Recommendations** — Scores unread articles for each user using their bookmark/read history, topic preferences, and embedding similarity to build a personalized feed, plus a trending-topics endpoint.
- **AI Newsletter Generation** — Builds an HTML digest newsletter tailored to a user's topic preferences from recent articles.
- **Auth** — Email/password (JWT) and Google OAuth2 login via Passport, with role-based access control (`user` / `admin`).
- **Admin Tools** — Endpoints for analytics, user management, duplicate/cluster review, feed management, and newsletter generation.
- **Realtime Updates** — Socket.IO broadcasts when new articles are fetched, so connected clients update live.
- **Frontend Dashboard** — React + Vite + Tailwind SPA with search, article detail, bookmarks, chat, admin panel, and light/dark theming (Zustand for state).

## Tech Stack

**Backend**
- Node.js, Express
- MongoDB + Mongoose (optionally MongoDB Atlas Vector Search)
- Redis (`ioredis`) for optional caching
- Socket.IO for realtime updates
- `node-cron` for scheduled feed fetching
- LangChain + `@langchain/groq` for LLM calls (summaries, chat, newsletters)
- Voyage AI for embeddings (with local fallback)
- Passport (JWT + Google OAuth2) for authentication
- Cloudinary for image uploads
- `rss-parser` for RSS/Atom feed parsing

**Frontend**
- React 18 + Vite
- Tailwind CSS
- React Router v7
- Zustand for state management (auth, articles, theme)
- Axios, Socket.IO client
- Framer Motion, Lucide React icons, React Hot Toast

## Project Structure

```
NewsMind/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup (middleware, routes)
│   │   ├── server.js              # HTTP server, Socket.IO, cron scheduler entrypoint
│   │   ├── config/                # DB, Redis, Passport, Cloudinary, vector index config
│   │   ├── controllers/           # Route handlers (auth, articles, search, admin)
│   │   ├── middleware/            # Auth guards, validation, error handling
│   │   ├── models/                # Mongoose schemas (User, Article, Feed, Newsletter, ChatMessage)
│   │   ├── routes/                # Express routers
│   │   ├── services/
│   │   │   ├── ai/                # Summarization, embeddings, RAG chat, recommendations,
│   │   │   │                      # clustering, duplicate detection
│   │   │   └── rss/               # Feed parsing + aggregation into MongoDB
│   │   └── scripts/seed.js        # Seeds an admin user and default feeds, runs an initial fetch
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/            # Navbar, Footer, ArticleCard, ProtectedRoute
    │   ├── pages/                 # Home, Search, Chat, Dashboard, Admin, Bookmarks, Auth, etc.
    │   ├── store/                 # Zustand stores (auth, articles, theme)
    │   ├── services/api.js        # Axios API client
    │   └── App.jsx                # Route definitions
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local instance or Atlas cluster)
- Redis (optional — caching is skipped if not configured)
- API keys (optional but recommended for full functionality): Groq, Voyage AI, Google OAuth, Cloudinary

### 1. Clone the repository

```bash
git clone https://github.com/Mehulposh/NewsMind.git
cd NewsMind
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the following variables:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb://localhost:27017/newsmind
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# AI providers (optional — features fall back to non-AI behavior without these)
GROQ_API_KEY=
VOYAGE_API_KEY=

# Cloudinary (optional, for image uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# RSS fetch schedule (cron syntax)
RSS_CRON_SCHEDULE=*/30 * * * *
```

Seed the database with an admin account and default RSS feeds, and run an initial fetch:

```bash
npm run seed
```

This creates an admin user (`admin@newsmind.ai` / `admin123` — change this immediately in production) and populates feeds like TechCrunch, BBC News, The Verge, Ars Technica, Hacker News, and more.

Start the backend:

```bash
npm run dev     # with nodemon
# or
npm start
```

The API will be available at `http://localhost:5000`, with a health check at `GET /api/health`.

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Overview

| Area | Route prefix | Notes |
|---|---|---|
| Auth | `/api/auth` | Register, login, Google OAuth, get current user, update preferences |
| Articles | `/api/articles` | List, trending, bookmarks, feeds, single article, AI summary, bookmark toggle |
| Search | `/api/search` | Semantic search, RAG chat, chat history/sessions |
| Admin | `/api` | Recommendations, trending topics, clusters, duplicates, newsletters, analytics, user/feed management |

Most read endpoints are public or support optional auth (for personalization); write/admin endpoints require a valid JWT and, where noted, the `admin` role.

## Notes on Optional Integrations

Several AI/infra integrations are designed to degrade gracefully so the app runs without every API key configured:

- No `GROQ_API_KEY` → summaries fall back to a truncated excerpt; RAG chat falls back to a plain list of matching articles instead of an LLM-generated answer.
- No `VOYAGE_API_KEY` → embeddings are generated with a lightweight deterministic hashing function instead of a real embedding model.
- No `REDIS_URL` → caching is simply skipped.
- No `GOOGLE_CLIENT_ID` → Google OAuth login is disabled; email/password auth still works.
- No MongoDB Atlas Vector Search index → semantic search falls back to in-memory cosine similarity over recent articles.

For production-quality search and chat results, configuring Groq and Voyage AI keys (and optionally an Atlas Vector Search index using the mapping in `backend/src/config/vectorSearchIndex.json`) is recommended.

## License

No license file is currently included in this repository. Add one (e.g. MIT) if you intend for others to reuse this code.
