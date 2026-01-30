# 🚀 Voxen Backend

**Voxen** is a scalable backend designed for modern video-driven applications — from **social media platforms** and **edtech systems** to **lecture streaming** and **1-to-many video rendering** setups.

---

## 🌐 Overview

Voxen provides a flexible backend structure that can be extended to power:
- 🎥 YouTube-style video sharing platforms
- 🎓 Online education & lecture platforms
- 📡 Live-streaming and content delivery apps
- 💬 Any other social or media-driven ecosystem

---

## 📁 Directory Structure

The backend is structured for modularity and scalability:

```
src/
├── controllers/       # Request handlers (logic layer)
│   ├── user.controller.js
│   ├── video.controller.js
│   ├── tweet.controller.js
│   └── ...
├── models/            # Mongoose schemas (data layer)
│   ├── user.model.js
│   ├── video.model.js
│   └── ...
├── routes/            # API Route definitions
│   ├── user.routes.js
│   ├── video.routes.js
│   └── ...
├── middlewares/       # Custom middlewares (Auth, Multer, Error handling)
│   ├── auth.middleware.js
│   └── multer.middleware.js
├── utils/             # Helper functions (Cloudinary, AsyncHandlers)
│   ├── cloudinary.js
│   └── ApiError.js
├── db/                # Database connection logic
├── app.js             # Express app configuration
└── index.js           # Server entry point
```

---

## 🛠 API Modules

The backend is divided into several key functional modules:

### 👤 User Management (`user.controller.js`)
- Authentication (Register, Login, Logout, Refresh Token)
- Profile management (Avatar, Cover Image, Password update)
- Watch history & Playlist management

### 📹 Video & Streaming (`video.controller.js`)
- Video upload & publishing
- Toggle existing video visibility
- Increment view counts

### 🐦 Social Features (`tweet.controller.js` & `comment.controller.js`)
- Create and manage text-based posts (Tweets)
- Recursive/Threaded comments on Videos and Tweets

### 👍 Engagement (`like.controller.js` & `subscription.controller.js`)
- Toggle likes on Videos, Comments, and Tweets
- Channel subscription management
- Get subscriber/subscribed channel lists

### 🔔 Notifications (`notification.controller.js`)
- System for notifying users of interactions

---

## ⚙️ Tech Stack

- **Node.js** — server runtime
- **Express.js** — backend framework
- **MongoDB** — scalable database
- **JWT** — authentication and authorization
- **Multer** — for media uploads
- **Cloudinary** — for third party media storage

---

## ✨ Features

- 🔐 Secure authentication & session management
- 📺 Video upload and streaming endpoints
- 🧑‍🏫 One-to-many lecture/streaming support
- 💬 Commenting, liking, and engagement modules
- 🧱 Modular and extensible architecture

---

## 🧩 Future Goals

- 💬 Add real-time chat & notifications
- 🧱 Expand to microservices architecture
- 📱 Enable mobile client support

---

## 🧑‍💻 Author

**Ankit Roy**
Backend Developer | Competitive Programmer | Web Enthusiast

🔗 [GitHub Profile](https://github.com/AnkitCodesJU)
🔗 [LinkedIn](https://www.linkedin.com/in/ankit-roy-ju362/)
