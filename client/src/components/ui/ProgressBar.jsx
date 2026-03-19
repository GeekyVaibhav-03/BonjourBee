import React from "react";

export default function ProgressBar({ value = 0, showLabel = true }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div>
      {showLabel ? (
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
