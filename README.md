# Artista 🎨

> **Where African Art Lives** — A social discovery platform for African creatives.

Artista is a Pinterest-meets-Instagram platform built specifically for African artists to share, discover, and connect around art — starting in Nigeria.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Auth | Email/password + Google + Apple sign-in with role selection |
| 🏠 Feed | Infinite-scroll 2-column post grid with like/save/comment |
| 🔍 Explore | Mosaic grid search by artwork, artist, tag, or medium |
| 📤 Upload | Drag-and-drop artwork upload with title, tags, medium |
| 👤 Profiles | Artist portfolio page with gallery + about tab |
| 💬 Messages | Real-time DM sidebar with threaded chat |
| 🔔 Notifications | Aggregated activity feed (likes, comments, follows) |
| 🛡️ Admin | Dashboard for user/post management and moderation |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Routing | React Router v6 |
| State | Zustand |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| Toasts | React Hot Toast |
| Upload | React Dropzone |
| Build | Vite |
| Backend (prod) | Firebase Auth + Firestore + Cloud Functions |
| Media (prod) | Cloudinary |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/artista.git
cd artista

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the app.

---

## 🏗 Project Structure

```
artista/
├── src/
│   ├── components/
│   │   ├── feed/         # ArtCard, ArtworkDetail
│   │   ├── layout/       # Navbar
│   │   ├── ui/           # Avatar, Button (shared)
│   │   └── upload/       # UploadModal
│   ├── lib/
│   │   ├── mockData.ts   # Sample data for demo
│   │   └── utils.ts      # Helper functions
│   ├── pages/
│   │   ├── Landing.tsx   # Public marketing page
│   │   ├── Auth.tsx      # Login + Signup
│   │   ├── Feed.tsx      # Main home feed
│   │   ├── Explore.tsx   # Search & discover
│   │   ├── Profile.tsx   # Artist profile
│   │   ├── Messages.tsx  # Direct messaging
│   │   ├── Notifications.tsx
│   │   └── Admin.tsx     # Moderation dashboard
│   ├── store/
│   │   └── index.ts      # Zustand stores
│   ├── types/
│   │   └── index.ts      # TypeScript types
│   └── App.tsx           # Router
└── ...config files
```

---

## 🔥 Firebase Setup (Production)

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email, Google, Apple)
3. Create a **Firestore** database
4. Copy your config and create `src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MSG_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

5. Create `.env.local` with your values (see `.env.example`)

---

## 🌐 Firestore Data Model

```
/users/{userId}
  - displayName, email, username, bio, role, avatar
  - followersCount, followingCount, worksCount
  - artInterests[], location, website

/posts/{postId}
  - authorId, title, description, imageUrl
  - medium, tags[], dimensions
  - likesCount, commentsCount, savesCount
  - createdAt, forSale

/posts/{postId}/comments/{commentId}
  - authorId, content, likesCount, createdAt

/interactions/{userId_postId}
  - liked, saved, createdAt

/chats/{chatId}
  - participants[], updatedAt

/chats/{chatId}/messages/{msgId}
  - senderId, content, read, createdAt

/notifications/{userId}/items/{notifId}
  - type, fromUserId, postId?, read, createdAt
```

---

## 📦 Build for Production

```bash
npm run build
```

Output goes to `dist/` — ready to deploy to Vercel, Netlify, or Firebase Hosting.

### Deploy to Vercel (recommended)

```bash
npm i -g vercel
vercel --prod
```

### Deploy to Firebase Hosting

```bash
npm i -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Brand Terracotta | `#C0532B` |
| Ink (text) | `#1A1209` |
| Cream (bg) | `#F9F4EC` |
| Gold | `#D4A853` |
| Violet | `#593EFF` |
| Deep (dark bg) | `#0E0B1F` |
| Display font | Playfair Display |
| Body font | DM Sans |

---

## 📋 Roadmap

- [x] MVP: Auth, Feed, Explore, Upload, Profiles, Messages, Notifications, Admin
- [ ] Firebase integration (replace mock data)
- [ ] Real-time feed with Firestore listeners
- [ ] Push notifications (FCM)
- [ ] Image optimization via Cloudinary
- [ ] For Sale / Marketplace feature
- [ ] Verified artist badges
- [ ] Analytics dashboard
- [ ] iOS & Android apps (React Native)

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit changes (`git commit -m 'feat: add my feature'`)
4. Push to branch (`git push origin feat/my-feature`)
5. Open a Pull Request

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

*Built with ❤️ for African creatives · Lagos, Nigeria*
