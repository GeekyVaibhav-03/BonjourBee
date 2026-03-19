import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import http from "../api/http";
import { useAuth } from "../auth/AuthProvider";
import LoadingView from "../components/ui/LoadingView";
import PageHeading from "../components/ui/PageHeading";
import ProgressBar from "../components/ui/ProgressBar";
import StatCard from "../components/ui/StatCard";
import { getZoneTheme } from "../utils/zoneTheme";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await http.get("/stats");
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const activeUser = stats?.user || user;
  const theme = getZoneTheme(activeUser?.zone);

  const cards = useMemo(() => {
    const metrics = stats?.metrics || {};
    return [
      { title: "Current Level", value: activeUser?.level || "A1", icon: "🎯" },
      { title: "XP Points", value: activeUser?.xp || 0, icon: "⚡" },
      { title: "Daily Streak", value: activeUser?.streak || 0, icon: "🔥" },
      {
        title: "Lessons Completed",
        value: metrics.completedLessons || 0,
        icon: "📚",
      },
    ];
  }, [activeUser, stats?.metrics]);

  if (loading) {
    return <LoadingView label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title={`Bonjour, ${activeUser?.name || "Learner"}`}
        subtitle={`Welcome to ${theme.emoji} ${theme.label}. Here is your latest progress snapshot.`}
        action={
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${theme.chip}`}>
            {theme.label}
          </span>
        }
      />

      <section className="bb-section-grid bb-section-grid-4">
        {cards.map((card, index) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            delay={index * 0.06}
          />
        ))}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bb-card border ${theme.cardAccent} p-5`}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Overall Progress</h2>
            <p className="text-sm text-slate-400">
              Target CEFR path from A1 to C2 with personalized recommendations.
            </p>
          </div>
          <Link className="bb-btn bb-btn-primary" to="/lessons">
            Continue Learning
          </Link>
        </div>
        <ProgressBar value={stats?.metrics?.progressPercent || 0} />
      </motion.section>

      <section className="bb-section-grid bb-section-grid-2">
        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bb-card p-5"
        >
          <h3 className="text-lg font-semibold text-white">Recommended Lessons</h3>
          <p className="mt-1 text-sm text-slate-400">Based on your current level and progress.</p>

          <div className="mt-4 space-y-3">
            {(stats?.recommendedLessons || []).length === 0 ? (
              <p className="text-sm text-slate-400">No recommendations yet. Explore all lessons.</p>
            ) : (
              stats.recommendedLessons.map((lesson) => (
                <Link
                  key={lesson._id}
                  to={`/lesson/${lesson._id}`}
                  className="block rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-amber-300/40 hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-100">{lesson.title}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {lesson.level} • {lesson.type} • {lesson.durationMinutes} min
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-200">+{lesson.xpReward} XP</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bb-card p-5"
        >
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <p className="mt-1 text-sm text-slate-400">Your latest completed and in-progress lessons.</p>

          <div className="mt-4 space-y-3">
            {(stats?.recentActivity || []).length === 0 ? (
              <p className="text-sm text-slate-400">No activity yet. Start your first lesson today.</p>
            ) : (
              stats.recentActivity.map((activity) => (
                <div key={activity.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-100">{activity.lessonTitle}</p>
                    <span className="text-xs text-slate-400">
                      {new Date(activity.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                    <span>Score: {activity.score}</span>
                    <span>Time: {activity.timeSpentMinutes} min</span>
                    <span>{activity.completed ? "Completed" : "In Progress"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.article>
      </section>
    </div>
  );
}
