import React from "react";
import { motion } from "framer-motion";

export default function StatCard({ title, value, subtitle, icon, delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bb-card"
    >
      <div className="mb-2 text-2xl">{icon}</div>
      <p className="text-sm uppercase tracking-wider text-slate-400">{title}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
    </motion.article>
  );
}
