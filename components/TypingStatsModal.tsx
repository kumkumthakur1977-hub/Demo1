"use client";

import { motion, AnimatePresence } from "framer-motion";

interface TypingStatsModalProps {
  open: boolean;
  darkMode: boolean;
  onClose: () => void;
}

export default function TypingStatsModal({
  open,
  darkMode,
  onClose,
}: TypingStatsModalProps) {
  const stats = JSON.parse(
    typeof window !== "undefined"
      ? localStorage.getItem("typing_stats") || "{}"
      : "{}"
  );

  const rank =
    (stats.averageWpm || 0) < 20
      ? "🐣 Rookie Agent"
      : (stats.averageWpm || 0) < 40
      ? "🐝 Hive Worker"
      : (stats.averageWpm || 0) < 60
      ? "⚡ Speed Agent"
      : (stats.averageWpm || 0) < 80
      ? "🔥 Elite Agent"
      : "👑 Queen Bee";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="
            fixed
            inset-0
            bg-black/60
            flex
            items-center
            justify-center
            p-5
            z-50
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`
              w-full
              max-w-md
              rounded-3xl
              p-6
              border
              backdrop-blur-2xl
              shadow-2xl
              ${
                darkMode
                  ? "bg-black/70 border-yellow-500/20 text-white"
                  : "bg-white/80 border-yellow-500/20 text-black"
              }
            `}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                🐝 Agent Performance Report
              </h2>

              <button
                onClick={onClose}
                className="text-red-500 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Stats */}
            <div className="space-y-4">

              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="text-sm text-zinc-500">
                  Average WPM
                </div>
                <div className="text-2xl font-bold">
                  {stats.averageWpm || 0}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="text-sm text-zinc-500">
                  Best WPM
                </div>
                <div className="text-2xl font-bold">
                  {stats.bestWpm || 0}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="text-sm text-zinc-500">
                  Total Messages
                </div>
                <div className="text-2xl font-bold">
                  {stats.totalMessages || 0}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="text-sm text-zinc-500">
                  Total Words
                </div>
                <div className="text-2xl font-bold">
                  {stats.totalWords || 0}
                </div>
              </div>

              {/* Rank */}
              <div className="text-center mt-4">
                <div className="text-sm text-zinc-500">
                  Current Rank
                </div>
                <div className="text-xl font-bold mt-1">
                  {rank}
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}