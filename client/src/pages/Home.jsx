import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  const featureCards = [
    {
      title: "Lesson Player",
      text: "Audio, speaking practice, and quizzes in one focused flow.",
      icon: "🎧",
    },
    {
      title: "Gamification",
      text: "Earn XP, keep streaks alive, and unlock achievement badges.",
      icon: "🏆",
    },
    {
      title: "Parent Insights",
      text: "Track child progress with weekly reports and learning time.",
      icon: "👨‍👩‍👧",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bb-card overflow-hidden px-6 py-10 sm:px-10"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 inline-flex items-center rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200">
            French Learning Platform
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            BonjourBee
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Complete MERN-powered learning platform with JWT authentication, adaptive zones,
            lesson player, parent analytics, and gamified progress tracking.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="bb-btn bb-btn-primary px-5 py-2.5">
                Continue as {user?.name}
              </Link>
            ) : (
              <>
                <Link to="/signup" className="bb-btn bb-btn-primary px-5 py-2.5">
                  Create Account
                </Link>
                <Link to="/login" className="bb-btn bb-btn-ghost px-5 py-2.5">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.section>

      <section className="bb-section-grid bb-section-grid-3">
        {featureCards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="bb-card px-5 py-5"
          >
            <p className="text-2xl">{card.icon}</p>
            <h3 className="mt-3 text-lg font-semibold text-white">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{card.text}</p>
          </motion.article>
        ))}
      </section>
    </div>
  );
}
