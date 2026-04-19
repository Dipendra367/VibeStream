<div align="center">

<br/>

# 🎵 VibeStream

### *Redefining how you experience YouTube audio.*

**Build your queue. Hit play. Let the music flow — without distractions.**

<br/>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-vibe--stream--mu.vercel.app-6c63ff?style=for-the-badge&logoColor=white)](https://vibe-stream-mu.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-91%25-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-Vite-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br/>

---

</div>

## ✨ What is VibeStream?

VibeStream is a clean, distraction-free YouTube audio player that puts the music front and center. No cluttered feeds, no autoplay rabbit holes — just you, your queue, and the sound you came for.

Search for any track on YouTube, build your personal playlist on the fly, and enjoy uninterrupted playback the way it should be.

<br/>

## 🚀 Features

- 🔍 **YouTube-Powered Search** — Find any song, artist, or mix instantly using the YouTube API
- 📋 **Custom Queue Builder** — Add tracks in any order and manage your session playlist
- ▶️ **Seamless Playback** — Audio-focused player with smooth controls and no video clutter
- ⚡ **Blazing Fast** — Built with Vite for near-instant load times and hot module replacement
- 📱 **Responsive Design** — Works beautifully on desktop and mobile
- 🎨 **Minimal UI** — Clean, focused interface so nothing gets between you and the music

<br/>

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 |
| **Language** | TypeScript |
| **Build Tool** | Vite |
| **State Management** | Zustand |
| **Auth & Database** | Firebase / Firestore |
| **Styling** | CSS |
| **Linting** | ESLint |
| **Deployment** | Vercel |
| **API** | YouTube Data API v3 |

<br/>

## 📦 Getting Started

### Prerequisites

- Node.js `v18+`
- A [YouTube Data API v3](https://console.cloud.google.com/) key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Dipendra367/VibeStream.git
cd VibeStream

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

### Configure your `.env`

Open `.env` and fill in your keys:

```env
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173` and start vibing. 🎶

<br/>

## 🏗️ Project Structure

```
VibeStream/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   └── hero.png
│   ├── components/
│   │   ├── BackgroundVisualizer.tsx  # Animated audio visualizer background
│   │   ├── MusicWave.tsx             # Music wave animation
│   │   ├── Player.tsx                # Core audio player controls
│   │   ├── Queue.tsx                 # Full queue panel
│   │   ├── QueueItem.tsx             # Individual queue track card
│   │   └── SearchBar.tsx             # YouTube search input
│   ├── context/
│   │   └── AuthContext.tsx           # Firebase auth context
│   ├── lib/
│   │   └── firestoreQueue.ts         # Firestore queue persistence logic
│   ├── pages/
│   │   ├── AboutUs.tsx
│   │   ├── ContactUs.tsx
│   │   ├── MainApp.tsx               # Main player page
│   │   └── Welcome.tsx               # Landing / auth page
│   ├── store/
│   │   └── usePlayerStore.ts         # Global player state (Zustand)
│   ├── App.tsx
│   ├── firebase.ts                   # Firebase config & init
│   └── main.tsx                      # App entry point
├── .env.example
├── vite.config.ts
└── vercel.json
```

<br/>

## 🌐 Deployment

VibeStream is deployed on **Vercel** with zero configuration. To deploy your own fork:

1. Fork this repository
2. Import it into [Vercel](https://vercel.com/)
3. Add your `VITE_YOUTUBE_API_KEY` as an environment variable in Vercel's dashboard
4. Hit **Deploy** — you're live!

<br/>

## 🤝 Contributing

Contributions, ideas, and feedback are welcome! Feel free to open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/awesome-feature`
3. Commit your changes: `git commit -m 'Add awesome feature'`
4. Push to the branch: `git push origin feature/awesome-feature`
5. Open a Pull Request

<br/>

## 👨‍💻 Author

**Dipendra Thapa**

[![GitHub](https://img.shields.io/badge/GitHub-Dipendra367-181717?style=flat-square&logo=github)](https://github.com/Dipendra367)

<br/>

---

<div align="center">

Made with ❤️ and good music.

⭐ **If VibeStream made your day better, drop a star!** ⭐

</div>
