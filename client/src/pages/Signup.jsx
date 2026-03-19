import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const initialForm = {
  name: "",
  age: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "student",
  parentEmail: "",
  childEmail: "",
};

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const zoneLabel = useMemo(() => {
    const age = Number(form.age);
    if (!Number.isFinite(age)) return "";
    if (age >= 5 && age <= 10) return "Kids Zone";
    if (age >= 11 && age <= 16) return "Teen Zone";
    return "Adult Zone";
  }, [form.age]);

  const setField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    const age = Number(form.age);
    if (!Number.isFinite(age) || age < 5 || age > 99) return "Age must be between 5 and 99";
    if (!form.email.trim()) return "Email is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const user = await signup({
        name: form.name.trim(),
        age: Number(form.age),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        parentEmail: form.parentEmail.trim() || undefined,
        childEmail: form.childEmail.trim() || undefined,
      });

      if (user.role === "parent") {
        navigate("/parent-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (signupError) {
      setError(signupError?.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl items-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bb-card w-full p-6 sm:p-8"
      >
        <h1 className="text-2xl font-bold text-white">Create Account</h1>
        <p className="mt-1 text-sm text-slate-400">Student and parent registrations are supported.</p>

        {error ? <div className="bb-error mt-4">{error}</div> : null}

        <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          <div className="bb-section-grid bb-section-grid-2">
            <div>
              <label className="bb-label" htmlFor="name">
                Full Name
              </label>
              <input id="name" className="bb-input" value={form.name} onChange={setField("name")} />
            </div>

            <div>
              <label className="bb-label" htmlFor="age">
                Age
              </label>
              <input
                id="age"
                className="bb-input"
                type="number"
                min="5"
                max="99"
                value={form.age}
                onChange={setField("age")}
              />
            </div>
          </div>

          {zoneLabel ? (
            <p className="text-xs text-amber-200">You will be placed in {zoneLabel} based on age.</p>
          ) : null}

          <div>
            <label className="bb-label" htmlFor="role">
              Role
            </label>
            <select id="role" className="bb-input" value={form.role} onChange={setField("role")}>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>
          </div>

          {form.role === "student" ? (
            <div>
              <label className="bb-label" htmlFor="parentEmail">
                Parent Email (optional, to link account)
              </label>
              <input
                id="parentEmail"
                className="bb-input"
                type="email"
                value={form.parentEmail}
                onChange={setField("parentEmail")}
              />
            </div>
          ) : null}

          {form.role === "parent" ? (
            <div>
              <label className="bb-label" htmlFor="childEmail">
                Child Email (optional, to link account)
              </label>
              <input
                id="childEmail"
                className="bb-input"
                type="email"
                value={form.childEmail}
                onChange={setField("childEmail")}
              />
            </div>
          ) : null}

          <div>
            <label className="bb-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="bb-input"
              type="email"
              value={form.email}
              onChange={setField("email")}
            />
          </div>

          <div className="bb-section-grid bb-section-grid-2">
            <div>
              <label className="bb-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="bb-input"
                type="password"
                value={form.password}
                onChange={setField("password")}
              />
            </div>

            <div>
              <label className="bb-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                className="bb-input"
                type="password"
                value={form.confirmPassword}
                onChange={setField("confirmPassword")}
              />
            </div>
          </div>

          <button type="submit" className="bb-btn bb-btn-primary mt-2 w-full py-2.5" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          Already registered?{" "}
          <Link className="font-semibold text-amber-300 hover:text-amber-200" to="/login">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
