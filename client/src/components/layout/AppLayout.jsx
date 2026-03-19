import React from "react";
import Navbar from "./Navbar";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen text-slate-100">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
