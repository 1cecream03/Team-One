import { FormEvent, useState } from "react";
import Panel from "./Panel";
import { AUTH_CHANGE_EVENT, AUTH_KEY, AuthSession, UserRole } from "../types";

const inputClass =
  "w-full rounded-lg border border-border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-accent";
const labelClass = "mb-1.5 block text-sm font-medium text-white/80";

export function loadAuth(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export default function AuthGate({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [role, setRole] = useState<UserRole>("guest");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const session: AuthSession = { email, role };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    onAuthed();
  }

  return (
    <Panel>
        <div className="mb-6 flex gap-2 rounded-full border border-border bg-white/5 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 rounded-full py-2 transition ${
              mode === "signin" ? "bg-accent text-white" : "text-white/60"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-full py-2 transition ${
              mode === "register" ? "bg-accent text-white" : "text-white/60"
            }`}
          >
            Create account
          </button>
        </div>

        <h1 className="text-2xl font-bold">
          {mode === "signin" ? "Welcome back" : "Join your network"}
        </h1>
        <p className="mt-2 text-sm text-white/60">
          {mode === "signin"
            ? "Sign in with your company email to continue."
            : "Create an account with your company email to continue."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className={labelClass}>I am a…</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("guest")}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  role === "guest"
                    ? "border-accent bg-accent/15 text-white"
                    : "border-border bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                Guest — booking space
              </button>
              <button
                type="button"
                onClick={() => setRole("host")}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  role === "host"
                    ? "border-accent bg-accent/15 text-white"
                    : "border-border bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                Host — listing space
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Work email</label>
            <input
              required
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              required
              type="password"
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:shadow-[0_0_24px_rgba(99,102,241,0.55)]"
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
    </Panel>
  );
}
