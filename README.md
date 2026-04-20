# 💬 Zinglee — Private, Permission-Based Chat

Zinglee is a **real-time chat application built around privacy and control**.

Unlike traditional chat apps where anyone can message or call you once they have your contact, Zinglee introduces a **permission-first communication model** — where users decide **who can interact with them and how**.

> 💡 Think: **Discord-style communication + WhatsApp simplicity + stronger privacy controls**

---

## 🚀 What Zinglee Actually Does

Zinglee is not just a chat app.

It is designed to solve a real problem:

👉 **Uncontrolled communication**

Most apps allow:
- unsolicited messages  
- random calls  
- spam or unwanted interaction  

Zinglee changes that by introducing:

### 🔐 Permission-Based Communication
- Users must be **allowed** before interacting
- Messaging is controlled
- Future: calls require explicit approval

---

## ✨ Core Features

### 🔐 Authentication System
- Email & Password login
- Google Sign-In (Firebase)
- Secure JWT-based sessions

---

### 💬 Real-Time Messaging Engine
- Instant messaging using WebSockets (Socket.io)
- Bi-directional communication (no refresh needed)
- Live message updates

---

### 🟢 Presence System
- See who is **online/offline in real time**
- Powered by socket connection mapping

---

### 👤 User Identity & Profiles
- Profile image upload (Cloudinary)
- Bio & display name
- Identity tied to secure backend

---

### 🔔 Smart Message Tracking
- Unseen message count per user
- Auto-mark messages as seen
- Real-time updates

---

### 🎨 Modern UI System
- Glassmorphism design
- Multiple dynamic themes
- Smooth animations using Framer Motion

---

## 🧠 How It Works (Architecture)

Zinglee follows a **client-server real-time architecture**:

Frontend (React + Vite)
↓
Socket + REST API
↓
Backend (Node + Express)
↓
MongoDB (Database)
↓
Firebase (Auth verification)



---

### 🔄 Flow Example (Google Login)

1. User clicks **Google Sign-In**
2. Firebase authenticates user
3. Frontend receives **ID Token**
4. Token is sent to backend
5. Backend verifies token using Firebase Admin SDK
6. User is created/fetched in MongoDB
7. JWT is generated
8. User is logged in

---

### 💬 Flow Example (Messaging)

1. User sends message  
2. Backend stores message in MongoDB  
3. Socket emits message to receiver  
4. Receiver UI updates instantly  
5. Message marked as seen  

---

## 🛠️ Tech Stack

### 🎨 Frontend
- React (Vite)
- Context API
- Axios
- Socket.io Client
- Firebase SDK
- Framer Motion

### ⚙️ Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- Firebase Admin SDK
- JWT Authentication
- Cloudinary

---

## 📂 Project Structure
ChatApp/
│
├── frontend/ # React client
├── backend/ # Express API + Socket server
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── config/


---

---

## 🌍 Live App

- 🌐 Frontend: https://zinglee.vercel.app  
- 🔧 Backend: https://zinglee-backend.onrender.com  

---

## 🚀 Future Improvements & Vision

Zinglee is evolving into a **secure, permission-based communication platform**, inspired by Discord but designed to stay simple.

---

### 📞 Audio & Video Calling (Permission-Based)
- 1:1 audio & video calls
- Request-to-call system (accept / decline)
- No direct calling without consent
- WebRTC-based implementation

---

### 🔐 Advanced Privacy Controls
- Control who can message you
- Control who can call you
- Block / restrict users
- Session & device management

---

### 🧑‍🤝‍🧑 Social Layer
- Friend request system
- Presence states (Online, Idle, DND)
- Private vs public profiles

---

### 🏠 Rooms & Channels (Discord-Inspired)
- Chat rooms / groups
- Topic-based channels
- Lightweight server structure
- Role-based permissions

---

### 💬 Messaging Enhancements
- Reactions (👍 ❤️ 😂)
- Replies / threads
- Typing indicators
- Message editing

---

### 📁 Media & File Sharing
- File uploads
- Media previews
- Optimized storage

---

### 🔔 Notifications
- Real-time alerts
- Mentions (@user)
- Mute controls

---

## 🔒 Why Zinglee?

Most chat apps optimize for **engagement**.  
Zinglee optimizes for **control and privacy**.

✔ No unwanted communication  
✔ No random calls  
✔ Only intentional interactions  

---

## 👨‍💻 Author

**Sujal (Syraxx)**  
GitHub: https://github.com/Sujal-g1  

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!


