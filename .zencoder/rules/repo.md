# Repo Overview

- Root: MERN scaffold for Offline-First STEM Learning Platform
- Client: React + Vite PWA with Service Worker, Dexie (IndexedDB), i18n, Phaser demo game
- Server: Express + MongoDB with sample routes for progress, analytics, content

## Structure
- client/
  - index.html, vite.config.js, package.json
  - public/ (manifest.webmanifest, sw.js, icons/)
  - src/
    - App.jsx, main.jsx, styles.css, i18n.js, locales/
    - games/ (AdditionGame.jsx)
    - db/ (indexedDb.js)
    - sync/ (syncClient.js)
    - api/ (client.js)
- server/
  - package.json
  - src/
    - index.js, db/mongo.js
    - routes/ (progress.js, analytics.js, content.js)
    - models/ (Progress.js)

## Notes
- Client registers service worker at /sw.js (served from client/public)
- API base URL uses VITE_API_URL (default http://localhost:4000)
- MongoDB URI via MONGO_URI (default mongodb://127.0.0.1:27017/stem)