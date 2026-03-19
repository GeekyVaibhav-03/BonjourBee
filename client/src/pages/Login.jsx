import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.jsx";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = location.state?.from || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!email || !password) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      const user = await login({ email, password });
      if (user.role === "parent") {
        navigate("/parent-dashboard", { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bb-card w-full p-6 sm:p-7"
      >
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="mt-1 text-sm text-slate-400">Login to continue your French journey.</p>

        {error ? <div className="bb-error mt-4">{error}</div> : null}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="bb-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="bb-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="bb-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="bb-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="bb-btn bb-btn-primary w-full py-2.5" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          New here?{" "}
          <Link className="font-semibold text-amber-300 hover:text-amber-200" to="/signup">
            Create an account
          </Link>
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-3 text-xs text-slate-400 underline hover:text-slate-200"
        >
          Back to landing page
        </button>
      </motion.div>
    </div>
  );
}
