import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import http from "../api/http";
import { useAuth } from "../auth/AuthProvider";
import LoadingView from "../components/ui/LoadingView";
import PageHeading from "../components/ui/PageHeading";

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function Profile() {
  const { user, refreshProfile, updateProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({
    name: "",
    age: "",
    level: "A1",
    dailyGoal: 20,
    childEmail: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [profile, statPayload] = await Promise.all([refreshProfile(), http.get("/stats")]);

        setForm((prev) => ({
          ...prev,
          name: profile.name || "",
          age: String(profile.age || ""),
          level: profile.level || "A1",
          dailyGoal: profile.dailyGoal || 20,
        }));

        setStats(statPayload.data);
      } catch (loadError) {
        setError(loadError?.response?.data?.error || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [refreshProfile]);

  const setField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const profileMetrics = useMemo(() => {
    const metrics = stats?.metrics || {};
    return [
      { label: "XP", value: user?.xp || 0 },
      { label: "Streak", value: user?.streak || 0 },
      { label: "Lessons", value: metrics.completedLessons || 0 },
      { label: "Weekly Time", value: `${metrics.weeklyTimeSpent || 0} min` },
    ];
  }, [stats?.metrics, user]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!form.age || Number(form.age) < 5) {
      setError("Valid age is required");
      return;
    }

    if (form.newPassword && form.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setSaving(true);

    try {
      await updateProfile({
        name: form.name.trim(),
        age: Number(form.age),
        level: form.level,
        dailyGoal: Number(form.dailyGoal),
        childEmail: form.childEmail.trim() || undefined,
        currentPassword: form.currentPassword || undefined,
        newPassword: form.newPassword || undefined,
      });

      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        childEmail: "",
      }));
      setSuccess("Profile updated successfully");
    } catch (saveError) {
      setError(saveError.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingView label="Loading profile..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeading title="Profile" subtitle="Update personal details, learning preferences, and password." />

      <section className="bb-section-grid bb-section-grid-4">
        {profileMetrics.map((metric) => (
          <div key={metric.label} className="bb-card p-4 text-center">
            <p className="text-xs uppercase text-slate-400">{metric.label}</p>
            <p className="mt-1 text-xl font-bold text-white">{metric.value}</p>
          </div>
        ))}
      </section>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bb-card grid gap-4 p-5"
        onSubmit={submit}
      >
        {error ? <div className="bb-error">{error}</div> : null}
        {success ? (
          <div className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        <div className="bb-section-grid bb-section-grid-2">
          <div>
            <label className="bb-label" htmlFor="name">
              Name
            </label>
            <input id="name" className="bb-input" value={form.name} onChange={setField("name")} />
          </div>

          <div>
            <label className="bb-label" htmlFor="age">
              Age
            </label>
            <input id="age" className="bb-input" type="number" min="5" max="99" value={form.age} onChange={setField("age")} />
          </div>
        </div>

        <div className="bb-section-grid bb-section-grid-2">
          <div>
            <label className="bb-label" htmlFor="level">
              CEFR Level
            </label>
            <select id="level" className="bb-input" value={form.level} onChange={setField("level")}>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="bb-label" htmlFor="dailyGoal">
              Daily Goal (minutes)
            </label>
            <input
              id="dailyGoal"
              className="bb-input"
              type="number"
              min="5"
              value={form.dailyGoal}
              onChange={setField("dailyGoal")}
            />
          </div>
        </div>

        {user?.role === "parent" ? (
          <div>
            <label className="bb-label" htmlFor="childEmail">
              Link Child Email
            </label>
            <input
              id="childEmail"
              className="bb-input"
              type="email"
              placeholder="student@example.com"
              value={form.childEmail}
              onChange={setField("childEmail")}
            />
          </div>
        ) : null}

        <div className="bb-section-grid bb-section-grid-2">
          <div>
            <label className="bb-label" htmlFor="currentPassword">
              Current Password (for change)
            </label>
            <input
              id="currentPassword"
              className="bb-input"
              type="password"
              value={form.currentPassword}
              onChange={setField("currentPassword")}
            />
          </div>

          <div>
            <label className="bb-label" htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              className="bb-input"
              type="password"
              value={form.newPassword}
              onChange={setField("newPassword")}
            />
          </div>
        </div>

        <button className="bb-btn bb-btn-primary mt-1 w-full py-2.5" disabled={saving} type="submit">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </motion.form>
    </div>
  );
}
