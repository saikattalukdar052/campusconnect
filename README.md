# 🎓 CampusConnect

CampusConnect is an **AI-powered campus event management platform** that helps students discover, explore, and register for college events in one place.  
It also provides event organizers with a simple interface to publish and manage events in real time.

🚀 **Live Demo:**  
https://campusconnect-time-phi.vercel.app

---

## ✨ Features

### 👩‍🎓 For Students
- Browse all campus events in one place
- Filter events by category (Technical, Cultural, Sports, etc.)
- Register and unregister for events
- AI-powered assistant to find events using natural language
- Responsive UI (works on mobile & desktop)

### 🧑‍💼 For Admins / Organizers
- Secure admin access
- Create and publish new events
- Add event posters, venue, date, time, capacity, and price
- Update or delete events instantly
- Cloud-based data storage (Supabase)

### 🤖 AI Assistant
- Ask questions like:
  - *“What events are happening today?”*
  - *“Any technical workshops this week?”*
- Powered by **Google Gemini AI**
- Uses real event data for contextual responses

---

## 🛠 Tech Stack

| Layer | Technology |
|-----|-----------|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| Backend / Database | Supabase |
| AI | Google Gemini API |
| Deployment | Vercel |
| Version Control | Git + GitHub |

---

## 📌 Use Cases

- Centralized digital notice board for colleges
- Event discovery platform for students
- Event management tool for college clubs
- AI-powered campus assistant
- Academic / final-year project
- Resume-ready real-world application

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root and add:


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
