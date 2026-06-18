"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  created_at: string;
}

interface Props {
  messages: Message[];
  username: string;
  darkMode: boolean;
  loadingMessages: boolean;
  selectedUser: string;
}

export default function MessageList({
  messages,
  username,
  darkMode,
  loadingMessages,
  selectedUser,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 👇 user scroll tracking
  const [isAtBottom, setIsAtBottom] = useState(true);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;

    const threshold = 100;
    const position =
      el.scrollHeight - el.scrollTop - el.clientHeight;

    setIsAtBottom(position < threshold);
  }

  // 👇 auto scroll ONLY if user is at bottom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isAtBottom) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`flex-1 overflow-y-auto p-6 space-y-4 ${
        darkMode
          ? "bg-black/20"
          : "bg-gradient-to-b from-zinc-50 to-white"
      }`}
    >
      {/* Loading */}
      {loadingMessages && (
        <div className="text-center text-sm text-yellow-500 animate-pulse">
          🐝 Syncing messages...
        </div>
      )}

      {/* Empty state */}
      {!selectedUser && (
        <div className="text-center mt-20 text-zinc-500">
          Select a user to start chatting 💬
        </div>
      )}

      {/* Messages */}
      <AnimatePresence>
        {messages.map((msg) => {
          const isMine = msg.sender === username;

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={`flex ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-md
                  px-4 py-3
                  rounded-2xl
                  shadow-sm
                  backdrop-blur-xl
                  border
                  ${
                    isMine
                      ? "bg-blue-600 text-white"
                      : darkMode
                      ? "bg-zinc-800 text-white border-zinc-700"
                      : "bg-white text-black border-zinc-200"
                  }
                `}
              >
                <div className="break-words">
                  {msg.message}
                </div>

                <div
                  className={`text-[11px] mt-2 ${
                    isMine
                      ? "text-zinc-200"
                      : "text-zinc-500"
                  }`}
                >
                  {new Date(
                    msg.created_at
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}