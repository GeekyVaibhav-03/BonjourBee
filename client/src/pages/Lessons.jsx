import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import http from "../api/http";
import { useAuth } from "../auth/AuthProvider";
import LoadingView from "../components/ui/LoadingView";
import PageHeading from "../components/ui/PageHeading";
import { getZoneTheme } from "../utils/zoneTheme";

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const types = ["all", "audio", "speaking", "game"];
const learningActivityBadges = {
  puzzle: "Puzzle Solver",
  quiz: "Quiz Finisher",
  tutorial: "Tutorial Explorer",
};
const masterLearningBadge = "French Learning Games Champion";

export default function Lessons() {
  const { user } = useAuth();
  const theme = getZoneTheme(user?.zone);
  const [selectedLevel, setSelectedLevel] = useState(user?.level || "A1");
  const [selectedType, setSelectedType] = useState("all");
  const [lessons, setLessons] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityMessage, setActivityMessage] = useState("");
  const [activityError, setActivityError] = useState("");
  const [activeAward, setActiveAward] = useState("");
  const inFlightActivities = useRef(new Set());

  const completion = useMemo(() => {
    const earned = new Set(badges || []);
    return {
      puzzle: earned.has(learningActivityBadges.puzzle),
      quiz: earned.has(learningActivityBadges.quiz),
      tutorial: earned.has(learningActivityBadges.tutorial),
      master: earned.has(masterLearningBadge),
    };
  }, [badges]);

  const completeLearningActivity = useCallback(
    async (activity) => {
      if (!learningActivityBadges[activity]) {
        return;
      }

      const earned = new Set(badges || []);
      if (earned.has(learningActivityBadges[activity])) {
        return;
      }

      if (inFlightActivities.current.has(activity)) {
        return;
      }

      inFlightActivities.current.add(activity);
      setActiveAward(activity);
      setActivityError("");

      try {
        const { data } = await http.post("/progress/activity-complete", { activity });
        setBadges(data.badges || []);

        if (Array.isArray(data.newlyAwarded) && data.newlyAwarded.length > 0) {
          setActivityMessage(`Badge unlocked: ${data.newlyAwarded.join(", ")}`);
        } else {
          setActivityMessage(data.message || "Activity already completed.");
        }
      } catch (error) {
        setActivityError(error?.response?.data?.error || "Failed to save activity completion.");
      } finally {
        inFlightActivities.current.delete(activity);
        setActiveAward("");
      }
    },
    [badges],
  );

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const params = {
          level: selectedLevel,
          zone: user?.zone,
        };

        if (selectedType !== "all") {
          params.type = selectedType;
        }

        const { data } = await http.get("/lessons", { params });
        setLessons(data.lessons || []);
      } catch (error) {
        console.error("Failed to load lessons", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLessons();
    }
  }, [selectedLevel, selectedType, user]);

  useEffect(() => {
    const fetchBadgeStatus = async () => {
      try {
        const { data } = await http.get("/stats");
        setBadges(data?.user?.badges || []);
      } catch (error) {
        console.error("Failed to load learning activity badges", error);
      }
    };

    if (user) {
      fetchBadgeStatus();
    }
  }, [user]);

  useEffect(() => {
    const onIframeMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type !== "bonjourbee-mini-game-complete") {
        return;
      }

      if (event.data?.activity) {
        completeLearningActivity(event.data.activity);
      }
    };

    window.addEventListener("message", onIframeMessage);
    return () => window.removeEventListener("message", onIframeMessage);
  }, [completeLearningActivity]);

  const summary = useMemo(
    () => ({
      total: lessons.length,
      audio: lessons.filter((lesson) => lesson.type === "audio").length,
      speaking: lessons.filter((lesson) => lesson.type === "speaking").length,
      game: lessons.filter((lesson) => lesson.type === "game").length,
    }),
    [lessons],
  );

  if (loading) {
    return <LoadingView label="Loading lessons..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Lessons"
        subtitle={`Choose ${theme.label.toLowerCase()} lessons and continue from your CEFR level.`}
      />

      <section className={`bb-card border ${theme.cardAccent} p-5`}>
        <div className="bb-section-grid bb-section-grid-2">
          <div>
            <label className="bb-label" htmlFor="levelFilter">
              Level
            </label>
            <select
              id="levelFilter"
              className="bb-input"
              value={selectedLevel}
              onChange={(event) => setSelectedLevel(event.target.value)}
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="bb-label" htmlFor="typeFilter">
              Type
            </label>
            <select
              id="typeFilter"
              className="bb-input"
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
          <span className={`rounded-full border px-3 py-1 font-semibold ${theme.chip}`}>
            {theme.emoji} {theme.label}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">Total: {summary.total}</span>
          <span className="rounded-full border border-white/10 px-3 py-1">Audio: {summary.audio}</span>
          <span className="rounded-full border border-white/10 px-3 py-1">Speaking: {summary.speaking}</span>
          <span className="rounded-full border border-white/10 px-3 py-1">Game: {summary.game}</span>
        </div>
      </section>

      <section className="bb-card space-y-5 p-5">
        <div>
          <h2 className="text-xl font-semibold text-white">French Games Lab</h2>
          <p className="mt-1 text-sm text-slate-400">
            Complete black-theme interactive activities with sectioned challenge paths to unlock badges in Achievements.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span
            className={`rounded-full border px-3 py-1 font-semibold ${
              completion.puzzle
                ? "border-emerald-300/30 bg-emerald-500/15 text-emerald-200"
                : "border-white/10 text-slate-300"
            }`}
          >
            Puzzle: {completion.puzzle ? "Completed" : "Pending"}
          </span>
          <span
            className={`rounded-full border px-3 py-1 font-semibold ${
              completion.quiz
                ? "border-emerald-300/30 bg-emerald-500/15 text-emerald-200"
                : "border-white/10 text-slate-300"
            }`}
          >
            Quiz: {completion.quiz ? "Completed" : "Pending"}
          </span>
          <span
            className={`rounded-full border px-3 py-1 font-semibold ${
              completion.tutorial
                ? "border-emerald-300/30 bg-emerald-500/15 text-emerald-200"
                : "border-white/10 text-slate-300"
            }`}
          >
            Tutorial: {completion.tutorial ? "Completed" : "Pending"}
          </span>
          <span
            className={`rounded-full border px-3 py-1 font-semibold ${
              completion.master
                ? "border-amber-300/30 bg-amber-500/15 text-amber-200"
                : "border-white/10 text-slate-300"
            }`}
          >
            Master Badge: {completion.master ? "Unlocked" : "Locked"}
          </span>
        </div>

        {activityMessage ? (
          <p className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
            {activityMessage}
          </p>
        ) : null}

        {activityError ? (
          <p className="bb-error">{activityError}</p>
        ) : null}

        <div className="bb-section-grid bb-section-grid-2">
          <article className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
            <div className="border-b border-white/10 px-4 py-3">
              <h3 className="text-base font-semibold text-white">Word Puzzle</h3>
              <p className="mt-1 text-xs text-slate-400">10 challenges split into 3 sections: Core Basics, Food and Travel, Daily Conversation.</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-300">
                <span className="rounded-full border border-white/10 px-2 py-0.5">Core Basics 4</span>
                <span className="rounded-full border border-white/10 px-2 py-0.5">Food and Travel 3</span>
                <span className="rounded-full border border-white/10 px-2 py-0.5">Daily Conversation 3</span>
              </div>
            </div>
            <iframe
              title="French lessons word puzzle"
              src="/learning-games/french-puzzle.html"
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
              className="h-[460px] w-full bg-[#07080d]"
            />
            <div className="border-t border-white/10 p-3">
              <button
                className="bb-btn bb-btn-ghost w-full"
                disabled={completion.puzzle || activeAward === "puzzle"}
                onClick={() => completeLearningActivity("puzzle")}
              >
                {completion.puzzle
                  ? "Puzzle Badge Earned"
                  : activeAward === "puzzle"
                    ? "Saving..."
                    : "Mark Puzzle Complete"}
              </button>
            </div>
          </article>

          <article className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
            <div className="border-b border-white/10 px-4 py-3">
              <h3 className="text-base font-semibold text-white">Quick Quiz</h3>
              <p className="mt-1 text-xs text-slate-400">10 challenges split into 3 sections: Vocabulary, Grammar Builder, Conversation Skills.</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-300">
                <span className="rounded-full border border-white/10 px-2 py-0.5">Vocabulary 4</span>
                <span className="rounded-full border border-white/10 px-2 py-0.5">Grammar 3</span>
                <span className="rounded-full border border-white/10 px-2 py-0.5">Conversation 3</span>
              </div>
            </div>
            <iframe
              title="French lessons quick quiz"
              src="/learning-games/french-quiz.html"
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
              className="h-[460px] w-full bg-[#07080d]"
            />
            <div className="border-t border-white/10 p-3">
              <button
                className="bb-btn bb-btn-ghost w-full"
                disabled={completion.quiz || activeAward === "quiz"}
                onClick={() => completeLearningActivity("quiz")}
              >
                {completion.quiz
                  ? "Quiz Badge Earned"
                  : activeAward === "quiz"
                    ? "Saving..."
                    : "Mark Quiz Complete"}
              </button>
            </div>
          </article>
        </div>

        <article className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
          <div className="border-b border-white/10 px-4 py-3">
            <h3 className="text-base font-semibold text-white">Beginner Tutorial Playlist</h3>
            <p className="mt-1 text-xs text-slate-400">Watch the beginner tutorial and mark it complete.</p>
          </div>
          <div className="aspect-video w-full">
            <iframe
              title="French beginner tutorial playlist"
              src="https://www.youtube.com/embed/videoseries?list=PLhPqxcTpoRSNYyuovAVKTHX8f3UGHBCi3"
              loading="lazy"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="border-t border-white/10 p-3">
            <button
              className="bb-btn bb-btn-primary w-full"
              disabled={completion.tutorial || activeAward === "tutorial"}
              onClick={() => completeLearningActivity("tutorial")}
            >
              {completion.tutorial
                ? "Tutorial Badge Earned"
                : activeAward === "tutorial"
                  ? "Saving..."
                  : "Mark Tutorial Complete"}
            </button>
          </div>
        </article>
      </section>

      <section className="bb-section-grid bb-section-grid-3">
        {lessons.length === 0 ? (
          <div className="bb-card p-5 text-sm text-slate-400">
            No lessons found for this filter.
          </div>
        ) : (
          lessons.map((lesson, index) => (
            <motion.article
              key={lesson._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="bb-card flex flex-col p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-md border border-amber-300/30 bg-amber-300/10 px-2 py-1 text-xs font-semibold uppercase text-amber-200">
                  {lesson.type}
                </span>
                <span className="text-xs text-slate-400">{lesson.level}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{lesson.description}</p>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>{lesson.durationMinutes} min</span>
                <span>+{lesson.xpReward} XP</span>
              </div>

              <Link to={`/lesson/${lesson._id}`} className="bb-btn bb-btn-primary mt-4 w-full">
                Open Lesson Player
              </Link>
            </motion.article>
          ))
        )}
      </section>
    </div>
  );
}
