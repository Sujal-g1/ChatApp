<h1 align="center">💬 Zinglee</h1>

<p align="center">
  Private, Permission-Based Real-Time Chat Platform 🚀
</p>

<p align="center">
  <b>Discord-style control + WhatsApp simplicity + modern UI</b>
</p>

<p align="center">
  ⚡ Real-Time • 🔐 Privacy First • 🎤 Voice Enabled • 🎨 Modern UI
</p>

---

> 💡 **Try it, explore it, and share your thoughts!**  
> Your feedback helps shape Zinglee 🚀

---

## 🧠 What is Zinglee?

Zinglee is a **real-time chat application built around privacy and control**.

Unlike traditional chat apps where anyone can message or call you, Zinglee introduces a:

> 🔐 **Permission-first communication model**

Users decide:
- Who can message them  
- Who can interact with them  
- (Future) Who can call them  

---

## 🚀 What Zinglee Solves

Most apps allow:
- ❌ Unwanted messages  
- ❌ Random calls  
- ❌ Spam interactions  

Zinglee changes that with:

### 🔐 Permission-Based Communication
- Messaging only between allowed users  
- Friend-based interaction system  
- Future: request-to-call system  

---

## ✨ Core Features (Implemented)

### 🔐 Authentication System
- Email & Password login  
- Google Sign-In (Firebase)  
- Secure JWT-based sessions  

---

### 💬 Real-Time Chat
- Instant messaging using Socket.IO  
- Live updates (no refresh needed)  
- Seen / unseen message tracking  

---

### 🤝 Friend System
- Unique **Zinglee ID** for each user  
- Search users using ID  
- Send / accept friend requests  
- Only friends can chat  

---

### 🎤 Voice Messaging (Custom Built)
- Record → Preview → Send / Cancel  
- No default browser audio UI  
- Custom audio message bubbles  
- Play / Pause toggle  
- Only one audio plays at a time  

---

### 🖼️ Media Sharing
- Send images instantly  
- Stored using Cloudinary  

---

### 🟢 Presence System
- Real-time online / offline status  
- Socket-based tracking  

---

### 🔔 Smart Message Tracking
- Unseen message count per user  
- Auto mark messages as seen  

---

### 🎨 Modern UI System
- Glassmorphism + gradient design  
- Smooth animations (Framer Motion)  
- Clean chat bubbles (text, image, audio)  

---

## 🧭 How to Use

1. 🔐 **Sign Up / Login**
   - Create an account or login  
   - You will receive your unique **Zinglee ID**

2. 🔎 **Find Friends**
   - Search users using their Zinglee ID  

3. 🤝 **Send Friend Request**
   - Add them as a friend  
   - Once accepted, you can chat  

4. 💬 **Start Chatting**
   - Send messages  
   - Share images  
   - Send voice messages 🎤  

---

> 💡 Your friends must sign up to connect with you.

---

## ⚠️ Important Usage Note

> 🚨 **Desktop Recommended (Important)**  
> Zinglee is currently **optimized for Desktop use only**.  
> Mobile UI is not fully responsive yet and may break or feel inconsistent.

---

## 🖥️ Live App

- 🌐 Frontend: https://zinglee.vercel.app  
- 🔧 Backend: https://zinglee-backend.onrender.com  

👉 **Use Desktop for best experience**

---

## ⚠️ Mobile Limitations

- Chat layout and sidebars  
- Voice recording UI  
- Audio playback alignment  
- Some animations & interactions  

---

## 🧠 Architecture Overview

Zinglee follows a **real-time client-server architecture**:

Frontend (React + Vite)
↓
Socket + REST API
↓
Backend (Node + Express)
↓
MongoDB (Database)
↓
Firebase (Auth)


---

### 🔄 Flow Example (Messaging)

1. User sends message  
2. Backend stores in MongoDB  
3. Socket emits to receiver  
4. Receiver gets message instantly  
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
- Lucide React  

---

### ⚙️ Backend
- Node.js + Express  
- MongoDB + Mongoose  
- Socket.IO  
- Firebase Admin SDK  
- JWT Authentication  
- Cloudinary  

---

## 📂 Project Structure

frontend/
backend/
├── controllers/
├── models/
├── routes/
├── middleware/
└── config/


---

## 🚧 Future Improvements & Vision

Zinglee is evolving into a **complete communication ecosystem**.

---

### 🧑‍🤝‍🧑 Communities (Build Hub)
- Public & Private communities  
- Join via unique codes  
- Community chat system  
- Central hub UI  

---

### 📞 Audio & Video Calling
- Permission-based calling  
- Request → Accept / Decline flow  
- WebRTC integration  

---

### 🔐 Advanced Privacy Controls
- Control who can message  
- Control who can call  
- Block / restrict users  

---

### 💬 Messaging Enhancements
- Reactions (👍 ❤️ 😂)  
- Replies / threads  
- Typing indicators  
- Message editing  

---

### 📱 Mobile Support
- Fully responsive UI  
- Optimized touch interactions  
- Improved voice recording UX  

---

### 🔊 Voice System Upgrade
- Real waveform visualization  
- Audio progress bar  
- Playback speed control  

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

If you like this project:
- Star ⭐ the repo  
- Share it 🚀  
- Give feedback 💡  

---

## 📌 Status

Core Chat System: ✅ Done
Voice Messaging: ✅ Done
Friend System: ✅ Done
UI/UX: 🔄 Improving
Communities Feature: 🔄 Planned
Mobile Support: ❌ Pending


---

## 🚀 Vision

Zinglee aims to become a **secure, permission-based communication platform** combining:

- Messaging  
- Communities  
- Media sharing  
- Real-time interaction  

All within a **fast, modern, and clean UI**.

