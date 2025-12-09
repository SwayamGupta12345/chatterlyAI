![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)


# ChatterlyAI — Full Multi-Service Open Source AI Chat Platform

ChatterlyAI is a full-stack AI chat system built with a **Next.js frontend** and **three independent backend services**, deployed separately due to platform constraints (Vercel + Render free tiers).

This repository contains:
- The **official frontend**
- All **system documentation**
- Links to all backend microservices
- Setup guides for contributors

Live App → https://Chatterlyai.vercel.app

---

## 📌 System Architecture
ChatterlyAI consists of **4 repositories working together**:

| Service | Repo Link | Tech | Deploy |
|--------|-----------|------|--------|
| Frontend (Main) | https://github.com/SwayamGupta12345/ChatterlyAI | Next.js | Vercel |
| Backend API | https://github.com/SwayamGupta12345/ChatterlyAI-backend | Node.js | Render |
| Secondary Backend | https://github.com/SwayamGupta12345/ChatterlyAI-backend-2 | Node.js | Render |
| Agentic Backend | https://github.com/SwayamGupta12345/ChatterlyAI-agentic | Python/CrewAI | Render |

Full architecture → [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

---

## 🚀 Local Development

If you want to run everything locally:

### 1. Start Backend 1  
Follow instructions here: https://github.com/SwayamGupta12345/ChatterlyAI-backend

### 2. Start Backend 2  
Follow instructions here: https://github.com/SwayamGupta12345/ChatterlyAI-backend-2

### 3. Start Agentic Service 
Follow instructions here: https://github.com/SwayamGupta12345/ChatterlyAI-agentic

### 4. Start Frontend  

## Environment Variables
Rename `environment-variables.txt` to `.env.local ` and fill values for local development:


Clone the repository and install dependencies:

```bash
git clone https://github.com/SwayamGupta12345/ChatterlyAI.git
cd ChatterlyAI
npm install    
```

### Development

```bash
npm run dev
```

---

## 🧩 Contributing
Contributions are welcome!  
Start here → [`CONTRIBUTING.md`](./CONTRIBUTING.md)

If you're new:
- Check `good-first-issues`
- Open small PRs
- Ask questions in Issues

---
## 🗺 Roadmap
See → [`docs/ROADMAP.md`](./docs/ROADMAP.md)

---

## 📜 License
This project is licensed under the CC BY-NC 4.0 License.  
You may use, modify, and share it for non-commercial purposes with attribution.

