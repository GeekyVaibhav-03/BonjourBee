import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import App from "./App.jsx";
import "./styles.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

const registerServiceWorker = () => {
  navigator.serviceWorker.register("/sw.js").catch((error) => {
    console.error("Service worker registration failed", error);
  });
};

const unregisterServiceWorkersInDev = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations.map((registration) => registration.unregister())
  );

  if ("caches" in window) {
    const cacheNames = await window.caches.keys();
    await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
  }
};

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    if (import.meta.env.PROD) {
      registerServiceWorker();
      return;
    }

    unregisterServiceWorkersInDev().catch((error) => {
      console.warn("Failed to clear service workers in development", error);
    });
  });
}
