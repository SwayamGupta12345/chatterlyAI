![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)


# Chatterly — Full Multi-Service Open Source AI Chat Platform

Chatterly is a full-stack AI chat system built with a **Next.js frontend** and **three independent backend services**, deployed separately due to platform constraints (Vercel + Render free tiers).

This repository contains:
- The **official frontend**
- All **system documentation**
- Links to all backend microservices
- Setup guides for contributors

Live App → https://chatterlyai.vercel.app

---

## 📌 System Architecture
Chatterly consists of **4 repositories working together**:

| Service | Repo Link | Tech | Deploy |
|--------|-----------|------|--------|
| Frontend (Main) | https://github.com/SwayamGupta12345/chatterly | Next.js | Vercel |
| Backend API | https://github.com/SwayamGupta12345/chatterly-backend | Node.js | Render |
| Secondary Backend | https://github.com/SwayamGupta12345/chatterly-backend-2 | Node.js | Render |
| Agentic Backend | https://github.com/SwayamGupta12345/chatterly-agentic | Python/CrewAI | Render |

Full architecture → [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

---

## 🚀 Local Development

If you want to run everything locally:

### 1. Start Backend 1  
Follow instructions here:  
https://github.com/SwayamGupta12345/chatterly-backend

### 2. Start Backend 2  
https://github.com/SwayamGupta12345/chatterly-backend-2

### 3. Start Agentic Service  
https://github.com/SwayamGupta12345/chatterly-agentic

### 4. Start Frontend  

Clone the repository and install dependencies:

```bash
git clone https://github.com/rishugoyal805/ChatterlyAI.git
cd ChatterlyAI
npm install    
```

### Development

```bash
npm run dev
```

---

## 🧩 Contributing
Start here → [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md)

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

