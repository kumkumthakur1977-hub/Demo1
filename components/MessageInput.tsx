"use client";

import { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";

interface MessageInputProps {
  selectedUser: string;
  darkMode: boolean;
  onSend: (message: string) => void;
}

export default function MessageInput({
  selectedUser,
  darkMode,
  onSend,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  const [typingStartedAt, setTypingStartedAt] =
    useState<number | null>(null);

  useEffect(() => {
    if (!selectedUser) return;

    const draft = localStorage.getItem(
      `draft-${selectedUser}`
    );

    setMessage(draft || "");
  }, [selectedUser]);

  function handleEmojiClick(
    emojiData: any
  ) {
    const updated =
      message + emojiData.emoji;

    setMessage(updated);

    localStorage.setItem(
      `draft-${selectedUser}`,
      updated
    );
  }

  function saveTypingStats(text: string) {
    if (!typingStartedAt) return;

    const words =
      text.trim().length === 0
        ? 0
        : text.trim().split(/\s+/).length;

    if (words === 0) return;

    const minutes =
      (Date.now() - typingStartedAt) /
      60000;

    const currentWpm = Math.round(
      words / Math.max(minutes, 0.01)
    );

    const stats = JSON.parse(
      localStorage.getItem(
        "typing_stats"
      ) || "{}"
    );

    const totalMessages =
      (stats.totalMessages || 0) + 1;

    const totalWords =
      (stats.totalWords || 0) + words;

    const bestWpm = Math.max(
      stats.bestWpm || 0,
      currentWpm
    );

    const averageWpm = Math.round(
      (
        (stats.averageWpm || 0) *
          (totalMessages - 1) +
        currentWpm
      ) / totalMessages
    );

    localStorage.setItem(
      "typing_stats",
      JSON.stringify({
        totalMessages,
        totalWords,
        bestWpm,
        averageWpm,
      })
    );
  }

  function send() {
    if (!message.trim()) return;

    saveTypingStats(message);

    onSend(message);

    localStorage.removeItem(
      `draft-${selectedUser}`
    );

    setMessage("");
    setTypingStartedAt(null);
  }

  return (
    <div
      className="
        border-t
        border-yellow-500/10
        backdrop-blur-xl
        bg-black/20
        p-4
      "
    >
      <div className="flex items-center gap-3">

        {/* Emoji */}
        <div className="relative">

          <button
            onClick={() =>
              setShowEmojiPicker(
                !showEmojiPicker
              )
            }
            className="
              w-12
              h-12
              rounded-2xl
              bg-yellow-500/10
              border
              border-yellow-500/20
              text-2xl
              hover:scale-105
              transition
            "
          >
            😀
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-16 left-0 z-50">
              <EmojiPicker
                onEmojiClick={
                  handleEmojiClick
                }
              />
            </div>
          )}

        </div>

        {/* Input */}
        <input
          type="text"
          value={message}
          placeholder="📡 Transmit encrypted signal..."
          onChange={(e) => {
            const value =
              e.target.value;

            setMessage(value);

            if (!typingStartedAt) {
              setTypingStartedAt(
                Date.now()
              );
            }

            localStorage.setItem(
              `draft-${selectedUser}`,
              value
            );
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              send();
            }
          }}
          className="
            flex-1
            px-5
            py-4
            rounded-2xl
            bg-white/5
            border
            border-white/10
            text-white
            placeholder:text-zinc-500
            outline-none
            focus:border-yellow-500/40
            transition
          "
        />

        {/* Send */}
        <button
          onClick={send}
          className="
            px-6
            py-4
            rounded-2xl
            font-semibold
            text-black
            bg-gradient-to-r
            from-yellow-400
            to-amber-500
            hover:scale-105
            transition
            shadow-lg
            shadow-yellow-500/20
          "
        >
          📡 Transmit
        </button>

      </div>

      {/* Draft Notice */}
      {message.length > 0 && (
        <div className="mt-2 text-xs text-zinc-500 px-2">
          Draft automatically secured.
        </div>
      )}
    </div>
  );
}