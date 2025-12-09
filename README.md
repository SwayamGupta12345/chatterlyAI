![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)


# ChatterlyAI — Full Multi-Service Open Source AI Chat Platform

ChatterlyAI is a full-stack AI chat system built with a **Next.js frontend** and **three independent backend services**, deployed separately due to platform constraints (Vercel + Render free tiers).

<img width="1919" height="907" alt="Screenshot 2025-12-09 211708" src="https://github.com/user-attachments/assets/61068eee-f25d-4bf7-8c5f-70d39a1365c0" />

##What this project does
This is an complete collabrative AI chatbot that can also be accessed, changed, worked-in and all the other by other person or friend in real-time with an complete chat system integrated directly into it so there there is not hassel in changing apps to send an ai message or refreshing everything just there and easey to handle


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
Can run on localhost: 3001

### 2. Start Backend 2  
Follow instructions here: https://github.com/SwayamGupta12345/ChatterlyAI-backend-2
Can run on localhost: 3002

### 3. Start Agentic Service 
Follow instructions here: https://github.com/SwayamGupta12345/ChatterlyAI-agentic
Can run on localhost: 8080

### 4. Start Frontend  

## Environment Variables
Can run on localhost: 3000
Rename `.env.example` to `.env.local ` and fill values for local development:
```
NEXTAUTH_URL=<localhost_url>
NEXTAUTH_SECRET=<your_nextauth_secret>
MONGODB_URI=<your_mongodb_connection_string>
MONGODB_DB=<your_database_name>
JWT_SECRET=<your_jwt_secret>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>

HF_API_KEY=<your_huggingface_api_key>

CLOUDINARY_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_SECRET=<your_cloudinary_api_secret>
CLOUDINARY_URL=cloudinary://<your_cloudinary_api_key>:<your_cloudinary_api_secret>@<your_cloudinary_cloud_name>

NEXT_PUBLIC_AGENTIC_BACKEND_URL=<your_agentic_backend_url> #https://github.com/SwayamGupta12345/ChatterlyAI-agentic
NEXT_PUBLIC_AI_SOCKET_BACKEND_URL=<your_ai_socket_backend_url> # https://github.com/SwayamGupta12345/ChatterlyAI-backend-2
NEXT_PUBLIC_CHAT_SOCKET_BACKEND_URL=<your_chat_socket_backend_url> #https://github.com/SwayamGupta12345/ChatterlyAI-backend
```

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

It doesn't matter on which port you run the services on just confirm proper urls are used in sending the API request and receiving the request ( PAY SPECIAL ATTENTION TO "CORS")

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

