import React from "react";
import { motion } from "framer-motion";

export default function LoadingView({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bb-card flex items-center gap-3 px-5 py-4"
      >
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
        <span className="text-sm text-slate-200">{label}</span>
      </motion.div>
    </div>
  );
}
