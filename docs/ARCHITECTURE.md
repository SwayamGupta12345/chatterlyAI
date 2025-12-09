# System Architecture (Chatterly)

Chatterly is composed of **four independently deployed services** that communicate via REST APIs.

Frontend (Next.js)
↓
Backend (Node.js)
↓
Backend-2 (Node.js)
↓
Agentic Service (Python / CrewAI)


Reason for separate repos:
- Vercel free tier → frontend only
- Render free tier → limited ports/memory
- Microservice isolation for ML workloads

Each service exposes standard JSON APIs.
