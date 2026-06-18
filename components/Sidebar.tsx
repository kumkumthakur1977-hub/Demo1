"use client";

interface User {
  username: string;
}

interface SidebarProps {
  username: string;
  users: User[];
  selectedUser: string;
  searchTerm: string;
  darkMode: boolean;
  lastMessages: Record<string, string>;
  onSearchChange: (value: string) => void;
  onSelectUser: (username: string) => void;
  onToggleTheme: () => void;
  onLogout: () => void;
  onShowStats: () => void;
}

export default function Sidebar({
  username,
  users,
  selectedUser,
  searchTerm,
  darkMode,
  lastMessages,
  onSearchChange,
  onSelectUser,
  onToggleTheme,
  onLogout,
  onShowStats,
}: SidebarProps) {
  return (
    <div
      className={`
        w-80
        flex
        flex-col
        border-r
        backdrop-blur-2xl
        ${
          darkMode
            ? "bg-black/50 border-yellow-500/10"
            : "bg-white/60 border-yellow-500/10"
        }
      `}
    >
      {/* Logo */}
      <div className="p-6 border-b border-yellow-500/10">

        <div className="flex items-center gap-3">

          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-gradient-to-br
              from-yellow-400
              to-amber-500
              flex
              items-center
              justify-center
              text-2xl
              shadow-lg
              shadow-yellow-500/30
            "
          >
            🐝
          </div>

          <div>
            <h1
              className={`
                text-2xl
                font-black
                ${
                  darkMode
                    ? "text-white"
                    : "text-black"
                }
              `}
            >
              HoneyBEE
            </h1>

            <p className="text-xs text-yellow-500">
              Secret Communication Network
            </p>
          </div>

        </div>

        {/* Agent */}
        <div
          className="
            mt-5
            rounded-2xl
            p-4
            border
            border-yellow-500/10
            bg-yellow-500/5
          "
        >
          <div className="text-xs text-yellow-500 mb-1">
            ACTIVE AGENT
          </div>

          <div
            className={`font-semibold ${
              darkMode
                ? "text-white"
                : "text-black"
            }`}
          >
            @{username}
          </div>

          <div className="text-green-500 text-xs mt-1">
            ● Active In Hive
          </div>
        </div>

      </div>

      {/* Actions */}
      <div className="p-4 flex gap-2">

        <button
          onClick={onShowStats}
          className="
            flex-1
            py-3
            rounded-xl
            bg-yellow-500/10
            border
            border-yellow-500/20
            hover:bg-yellow-500/20
            transition
          "
        >
          📊
        </button>

        <button
          onClick={onToggleTheme}
          className="
            flex-1
            py-3
            rounded-xl
            bg-yellow-500/10
            border
            border-yellow-500/20
            hover:bg-yellow-500/20
            transition
          "
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <button
          onClick={onLogout}
          className="
            flex-1
            py-3
            rounded-xl
            bg-red-500/10
            border
            border-red-500/20
            hover:bg-red-500/20
            transition
          "
        >
          🚪
        </button>

      </div>

      {/* Search */}
      <div className="px-4 pb-4">

        <input
          value={searchTerm}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          placeholder="🔎 Search agents..."
          className={`
            w-full
            px-4
            py-3
            rounded-2xl
            border
            outline-none
            ${
              darkMode
                ? "bg-white/5 text-white border-white/10"
                : "bg-white border-zinc-200"
            }
          `}
        />

      </div>

      {/* Users */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">

        {users.map((user) => (
          <button
            key={user.username}
            onClick={() =>
              onSelectUser(user.username)
            }
            className={`
              w-full
              text-left
              mb-2
              p-3
              rounded-2xl
              transition
              border
              ${
                selectedUser === user.username
                  ? "bg-yellow-500/15 border-yellow-500/30"
                  : darkMode
                  ? "bg-white/5 border-white/5 hover:bg-white/10"
                  : "bg-white/50 border-white/50 hover:bg-white"
              }
            `}
          >
            <div className="flex items-center gap-3">

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-gradient-to-br
                  from-yellow-400
                  to-amber-500
                  text-black
                  flex
                  items-center
                  justify-center
                  font-bold
                "
              >
                {user.username
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="flex-1 overflow-hidden">

                <div
                  className={`font-semibold truncate ${
                    darkMode
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  Agent {user.username}
                </div>

                <div
                  className={`text-xs truncate ${
                    darkMode
                      ? "text-zinc-400"
                      : "text-zinc-500"
                  }`}
                >
                  {lastMessages[user.username] ||
                    "Encrypted channel available"}
                </div>

              </div>

              <div className="text-green-500 text-xs">
                ●
              </div>

            </div>
          </button>
        ))}

      </div>

      {/* Footer */}
      <div
        className="
          p-4
          border-t
          border-yellow-500/10
          text-center
          text-xs
          text-zinc-500
        "
      >
        🐝 Hive Network v1.0
      </div>

    </div>
  );
}