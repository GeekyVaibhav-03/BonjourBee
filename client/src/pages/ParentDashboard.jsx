import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import http from "../api/http";
import LoadingView from "../components/ui/LoadingView";
import PageHeading from "../components/ui/PageHeading";
import ProgressBar from "../components/ui/ProgressBar";

export default function ParentDashboard() {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await http.get("/stats");
        setPayload(data);
      } catch (error) {
        console.error("Failed to fetch parent dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingView label="Loading parent dashboard..." />;
  }

  const childrenStats = payload?.childrenStats || [];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Parent Dashboard"
        subtitle="Monitor child progress, weekly reports, and learning consistency."
      />

      {childrenStats.length === 0 ? (
        <section className="bb-card p-5 text-sm text-slate-300">
          No linked student accounts yet. Add a child email in Profile settings to connect accounts.
        </section>
      ) : (
        childrenStats.map((child, index) => (
          <motion.section
            key={child.user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="bb-card p-5"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold text-white">{child.user.name}</h2>
                <p className="text-sm text-slate-400">
                  Level {child.user.level} • {child.user.zone} zone • streak {child.user.streak}
                </p>
              </div>
              <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
                {child.user.xp} XP
              </span>
            </div>

            <div className="bb-section-grid bb-section-grid-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                <p className="text-xs uppercase text-slate-400">Weekly Time</p>
                <p className="mt-1 text-lg font-semibold text-white">{child.metrics.weeklyTimeSpent} min</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                <p className="text-xs uppercase text-slate-400">Total Time</p>
                <p className="mt-1 text-lg font-semibold text-white">{child.metrics.totalTimeSpent} min</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                <p className="text-xs uppercase text-slate-400">Lessons Completed</p>
                <p className="mt-1 text-lg font-semibold text-white">{child.metrics.completedLessons}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-sm text-slate-300">Level Progress</p>
              <ProgressBar value={child.metrics.progressPercent} />
            </div>

            <div className="mt-4">
              <p className="mb-2 text-sm text-slate-300">Weekly Report Highlights</p>
              <div className="space-y-2 text-sm text-slate-400">
                <p>Recent lessons completed: {child.metrics.completedLessons}</p>
                <p>Badges unlocked: {(child.user.badges || []).length}</p>
                <p>Recommended: keep daily streak active with short lessons.</p>
              </div>
            </div>
          </motion.section>
        ))
      )}
    </div>
  );
}
