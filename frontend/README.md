# 🎨 Voxen Frontend

This directory contains the frontend application for **Voxen**, built with **Next.js 15 (App Router)**, **Tailwind CSS**, and **TypeScript**. It provides a modern, responsive, and interactive user interface for the video streaming platform.

## 📁 Directory Structure

The project follows the standard Next.js App Router structure:

```
src/
├── app/                  # App Router pages and layouts
│   ├── (auth)/           # Auth related routes (implied grouping)
│   │   ├── login/        # Login page
│   │   ├── register/     # Registration page
│   │   └── ...           # Password reset flows
│   ├── channel/[id]/     # Dynamic channel/profile pages
│   ├── watch/            # Video player page
│   ├── dashboard/        # User dashboard/studio
│   ├── layout.tsx        # Root layout with providers
│   ├── page.tsx          # Home page
│   └── ...               # Other feature routes (history, liked, etc.)
├── components/           # Reusable UI components
│   ├── Navbar.tsx        # Main navigation bar
│   ├── Sidebar.tsx       # App sidebar navigation
│   ├── VideoCard.tsx     # Reusable video thumbnail component
│   └── ...               # Other UI elements
├── context/              # React Context providers (Auth, Theme, etc.)
└── lib/                  # Utility functions and configurations
```

## 🧩 Key Components

### Navigation & Layout
- **`Navbar.tsx`**: The top navigation bar containing the logo, search bar, and user profile/notifications.
- **`Sidebar.tsx`**: Collapsible sidebar for quick navigation to Home, Subscriptions, History, etc.
- **`ClientLayout.tsx`**: wrapper to handle client-side layout logic.

### Video & Content
- **`VideoCard.tsx`**: Displays video thumbnails, duration, title, and channel info. Used in grids on Home, Channel, and Search pages.
- **`MovieRow.tsx`**: A horizontal scrollable row layout for displaying lists of videos/movies.
- **`CommentSection.tsx`**: Handles displaying and posting comments on the Watch page.

### Interaction
- **`LiveChat.tsx`**: Real-time chat interface for live streams.
- **`NotificationDropdown.tsx`**: UI for displaying user notifications.
- **`CursorParticles.tsx`**: A visual effect component for cursor interactions.

## 🚀 Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000) inside your browser.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context & Hooks
- **Icons**: Lucide React / React Icons
