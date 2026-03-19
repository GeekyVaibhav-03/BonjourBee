import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import http from "../api/http";
import LoadingView from "../components/ui/LoadingView";
import PageHeading from "../components/ui/PageHeading";
import ProgressBar from "../components/ui/ProgressBar";

const milestones = [100, 250, 500, 1000, 2000];

export default function Achievements() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await http.get("/stats");
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch achievements", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingView label="Loading achievements..." />;
  }

  const user = stats?.user;
  const badges = user?.badges || [];
  const xp = user?.xp || 0;

  return (
    <div className="space-y-6">
      <PageHeading
        title="Achievements"
        subtitle="Track your badges, XP milestones, and consistency." 
      />

      <section className="bb-card p-5">
        <h2 className="text-lg font-semibold text-white">Badge Collection</h2>
        <p className="mt-1 text-sm text-slate-400">Unlocked by completing lessons, XP targets, and streaks.</p>

        <div className="mt-4 bb-section-grid bb-section-grid-3">
          {badges.length === 0 ? (
            <p className="text-sm text-slate-400">No badges yet. Finish a lesson to unlock your first one.</p>
          ) : (
            badges.map((badge, index) => (
              <motion.article
                key={badge}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-amber-300/30 bg-amber-300/10 p-4"
              >
                <p className="text-sm font-semibold text-amber-200">🏅 {badge}</p>
              </motion.article>
            ))
          )}
        </div>
      </section>

      <section className="bb-card p-5">
        <h2 className="text-lg font-semibold text-white">XP Milestones</h2>
        <div className="mt-4 space-y-3">
          {milestones.map((milestone) => {
            const progress = Math.min(100, Math.round((xp / milestone) * 100));
            const unlocked = xp >= milestone;

            return (
              <div key={milestone} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-200">{milestone} XP</span>
                  <span className={unlocked ? "text-emerald-300" : "text-slate-400"}>
                    {unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
                <ProgressBar value={progress} showLabel={false} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
