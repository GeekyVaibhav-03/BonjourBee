import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import http from "../api/http";
import LoadingView from "../components/ui/LoadingView";
import PageHeading from "../components/ui/PageHeading";
import { getZoneTheme } from "../utils/zoneTheme";

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const startedAtRef = useRef(Date.now());

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const { data } = await http.get(`/lessons/${id}`);
        setLesson(data.lesson);
      } catch (fetchError) {
        setError(fetchError?.response?.data?.error || "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const questions = lesson?.quiz || [];
  const activeQuestion = questions[activeQuestionIndex];
  const theme = getZoneTheme(lesson?.zone);

  const tutorialVideoUrl = useMemo(() => {
    const rawUrl = lesson?.videoUrl;
    if (!rawUrl) {
      return "";
    }

    try {
      const parsed = new URL(rawUrl);
      const host = parsed.hostname.replace("www.", "").toLowerCase();

      if (host === "youtu.be") {
        const videoId = parsed.pathname.replace(/^\//, "");
        if (!videoId) {
          return rawUrl;
        }

        const embed = new URL(`https://www.youtube.com/embed/${videoId}`);
        const list = parsed.searchParams.get("list");
        if (list) {
          embed.searchParams.set("list", list);
        }
        return embed.toString();
      }

      if (host.endsWith("youtube.com")) {
        if (parsed.pathname.startsWith("/embed/")) {
          return rawUrl;
        }

        const videoId = parsed.searchParams.get("v");
        if (!videoId) {
          return rawUrl;
        }

        const embed = new URL(`https://www.youtube.com/embed/${videoId}`);
        const list = parsed.searchParams.get("list");
        const index = parsed.searchParams.get("index");
        if (list) {
          embed.searchParams.set("list", list);
        }
        if (index) {
          embed.searchParams.set("index", index);
        }
        return embed.toString();
      }

      return rawUrl;
    } catch (_) {
      return rawUrl;
    }
  }, [lesson?.videoUrl]);

  const score = useMemo(() => {
    if (!questions.length) return 0;
    const correct = questions.reduce((count, question, index) => {
      return answers[index] === question.answer ? count + 1 : count;
    }, 0);

    return Math.round((correct / questions.length) * 100);
  }, [answers, questions]);

  const startVoicePractice = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setTranscript("SpeechRecognition is not available in this browser. Use this as a placeholder.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);
    recognition.onerror = () => {
      setRecording(false);
      setTranscript("Voice capture failed. Please try again.");
    };
    recognition.onresult = (event) => {
      const spokenText = event.results?.[0]?.[0]?.transcript || "";
      setTranscript(spokenText);
    };

    recognition.start();
  };

  const submitProgress = async () => {
    try {
      const elapsedMinutes = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 60000));
      const { data } = await http.post("/progress/update", {
        lessonId: lesson._id,
        completed: true,
        score,
        quizScore: score,
        timeSpentMinutes: elapsedMinutes,
      });

      setResult({
        score,
        xpDelta: data.xpDelta,
      });
    } catch (submitError) {
      setError(submitError?.response?.data?.error || "Failed to save progress");
    }
  };

  if (loading) {
    return <LoadingView label="Loading lesson player..." />;
  }

  if (!lesson) {
    return (
      <div className="bb-card p-6 text-sm text-slate-300">
        {error || "Lesson not found."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title={lesson.title}
        subtitle={`${theme.emoji} ${theme.label} • ${lesson.level} • ${lesson.type} • ${lesson.durationMinutes} min • +${lesson.xpReward} XP`}
        action={
          <button className="bb-btn bb-btn-ghost" onClick={() => navigate("/lessons")}>
            Back to Lessons
          </button>
        }
      />

      <section className={`bb-card border ${theme.cardAccent} p-5`}>
        <h2 className="text-lg font-semibold text-white">Lesson Content</h2>
        <p className="mt-2 text-sm text-slate-300">{lesson.content || lesson.description}</p>
      </section>

      {tutorialVideoUrl ? (
        <section className="bb-card p-5">
          <h2 className="text-lg font-semibold text-white">Video Tutorial</h2>
          <p className="mt-1 text-sm text-slate-400">Watch the guided lesson video for this topic.</p>

          <div className="mt-4 aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/40">
            <iframe
              title={`${lesson.title} tutorial video`}
              src={tutorialVideoUrl}
              loading="lazy"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          <a
            href={lesson.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-amber-200 underline"
          >
            Open in YouTube
          </a>
        </section>
      ) : null}

      {(lesson.type === "audio" || lesson.audioUrl) && (
        <section className="bb-card p-5">
          <h2 className="text-lg font-semibold text-white">Audio Playback</h2>
          <p className="mt-1 text-sm text-slate-400">Play and repeat to practice pronunciation.</p>
          <audio className="mt-4 w-full" controls src={lesson.audioUrl}>
            Your browser does not support audio playback.
          </audio>
        </section>
      )}

      {(lesson.type === "speaking" || lesson.type === "audio") && (
        <section className="bb-card p-5">
          <h2 className="text-lg font-semibold text-white">Voice Practice</h2>
          <p className="mt-1 text-sm text-slate-400">
            Use Web Speech API for quick speaking checks.
          </p>

          <button className="bb-btn bb-btn-primary mt-4" onClick={startVoicePractice} disabled={recording}>
            {recording ? "Listening..." : "Start Recording"}
          </button>

          <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
            {transcript || "Your spoken text will appear here."}
          </div>
        </section>
      )}

      <section className="bb-card p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Quiz Questions</h2>
          <span className="text-xs text-slate-400">
            {questions.length ? `Question ${activeQuestionIndex + 1} of ${questions.length}` : "No quiz"}
          </span>
        </div>

        {!questions.length ? (
          <p className="mt-3 text-sm text-slate-400">This lesson has no quiz questions.</p>
        ) : (
          <motion.div
            key={activeQuestionIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <p className="text-sm text-slate-200">{activeQuestion.question}</p>
            <div className="mt-3 grid gap-2">
              {activeQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      [activeQuestionIndex]: option,
                    }))
                  }
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                    answers[activeQuestionIndex] === option
                      ? "border-amber-300/40 bg-amber-300/15 text-amber-100"
                      : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            className="bb-btn bb-btn-ghost"
            disabled={activeQuestionIndex === 0}
            onClick={() => setActiveQuestionIndex((prev) => Math.max(prev - 1, 0))}
          >
            Previous
          </button>
          <button
            className="bb-btn bb-btn-ghost"
            disabled={activeQuestionIndex >= questions.length - 1 || questions.length === 0}
            onClick={() => setActiveQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))}
          >
            Next
          </button>
          <button className="bb-btn bb-btn-primary ml-auto" onClick={submitProgress}>
            Complete Lesson
          </button>
        </div>
      </section>

      {result ? (
        <section className="bb-card border border-emerald-300/30 bg-emerald-500/10 p-5">
          <h2 className="text-lg font-semibold text-emerald-200">Lesson Completed</h2>
          <p className="mt-2 text-sm text-emerald-100">
            Quiz score: {result.score}% • XP gained: +{result.xpDelta}
          </p>
          <Link to="/dashboard" className="bb-btn bb-btn-primary mt-4">
            Go to Dashboard
          </Link>
        </section>
      ) : null}

      {error ? <div className="bb-error">{error}</div> : null}
    </div>
  );
}
