/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom design system colors
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // Primary blue
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        secondary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981", // Success green
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        accent: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444", // Error red
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        neutral: {
          50: "#f8fafc", // Light gray background
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        gray: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e5e7eb", // Soft gray for borders
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280", // Dark gray for body text
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937", // Darker gray for headings
          900: "#111827",
          950: "#030712",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 2px 8px 0 rgb(0 0 0 / 0.1)",
        card: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        card: "12px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        progress: "progress 0.5s ease-out",
        "pulse-success": "pulseSuccess 0.6s ease-out",
        "pulse-error": "pulseError 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        progress: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        pulseSuccess: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.4)" },
          "50%": { boxShadow: "0 0 0 10px rgba(16, 185, 129, 0)" },
        },
        pulseError: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(239, 68, 68, 0.4)" },
          "50%": { boxShadow: "0 0 0 10px rgba(239, 68, 68, 0)" },
        },
      },
    },
  },
  plugins: [],
};
