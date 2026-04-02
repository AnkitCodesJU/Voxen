# Voxen 🎥

**Voxen** is a full-featured video streaming and social media platform that combines the best of video sharing with community interaction. Built with a modern tech stack, it offers a seamless experience for creators and viewers alike.

---

## 🛠 Tech Stack

The project relies on a robust ecosystem of modern web technologies.

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,nodejs,express,mongodb,postman,git,github" />
  </a>
</p>

### Frontend
*   **Next.js** (App Router)
*   **React**
*   **TypeScript**
*   **Tailwind CSS**
*   **Framer Motion**
*   **Axios**

### Backend
*   **Node.js**
*   **Express.js**
*   **MongoDB & Mongoose**
*   **JWT & Bcrypt** (Auth)
*   **Cloudinary** (Media Storage)
*   **Multer**

---

## ✨ Features

### 🔐 Authentication & User Management
*   **Secure Auth**: Register and Login with JWT-based authentication (Access & Refresh tokens).
*   **Profile Management**: Update avatar, cover image, and account details.
*   **Password Security**: Change password and "Forgot Password" functionality.
*   **Channel Profile**: View other users' channels, including subscriber counts and videos.

### 📹 Video Platform
*   **Video Playback**: Smooth video streaming experience.
*   **Uploads**: Publishing videos with titles, descriptions, and thumbnails.
*   **Engagement**: Like, Dislike, and Comment on videos.
*   **Library**: "Watch Later" list and Watch History tracking.
*   **Movies**: Dedicated section for movies.

### 🔴 Live Classes
*   **Live Stream Hub**: View currently live and upcoming scheduled classes.

### 💬 Social & Community
*   **Tweets/Posts**: Create text-based posts to engage with subscribers.
*   **Subscriptions**: Subscribe/Unsubscribe to creators.
*   **Comments**: Threaded discussions on videos and tweets.

### 📊 Dashboard
*   **Stats**: Overview of channel performance (views, subscribers).
*   **Content Management**: Manage uploaded videos and publish status.

---

## 🚀 Roadmap / Yet to Do

The following features are planned or currently in development:

- [ ] **TV Shows/Series Integration**: Full implementation of the Series section (currently `Coming Soon`).
- [ ] **Real-time Notifications UI**: Frontend interface for the notification system (Backend logic is ready).
- [ ] **Asset Cleanup**: Auto-deletion of Cloudinary assets when videos are deleted.
- [ ] **Email Service Integration**: Replace mocked password reset with a real email provider (e.g., SendGrid/Resend).
- [ ] **Live Chat**: Real-time chat functionality for Live Classes.
- [ ] **Advanced Search**: Filters for upload date, duration, and popularity.
- [ ] **Comments on Tweets**: Full UI implementation for tweet comments.
- [ ] **Playlist Management**: Custom user-created playlists beyond "Watch Later".

---

## 🏃‍♂️ Getting Started

### Prerequisites
*   Node.js installed
*   MongoDB URI
*   Cloudinary Credentials

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/AnkitCodesJU/Voxen.git
    cd Voxen
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create .env file with PORT, MONGO_URI, CLOUDINARY details, ACCESS_TOKEN_SECRET, etc.
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    # Create .env.local if needed
    npm run dev
    ```

---

_Built with ❤️ by [Ankit Roy](https://github.com/AnkitCodesJU)_
