import { FormEvent, useState } from "react";
import { BookingMessage } from "../types";

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatThread({
  messages,
  currentSender,
  otherName,
  onSend,
}: {
  messages: BookingMessage[];
  currentSender: "host" | "guest";
  otherName: string;
  onSend: (text: string) => void;
}) {
  const [reply, setReply] = useState("");

  function handleSend(event: FormEvent) {
    event.preventDefault();
    if (!reply.trim()) return;
    onSend(reply.trim());
    setReply("");
  }

  return (
    <div>
      <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-border bg-white/5 p-3">
        {messages.length === 0 && (
          <p className="text-sm text-white/40">No messages yet.</p>
        )}
        {messages.map((message, i) => (
          <div
            key={i}
            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              message.sender === currentSender
                ? "ml-auto bg-accent text-white"
                : "bg-white/10 text-white/90"
            }`}
          >
            <p>{message.text}</p>
            <p className="mt-1 text-[10px] opacity-60">
              {message.sender === currentSender ? "You" : otherName} ·{" "}
              {formatTime(message.at)}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="mt-3 flex gap-2">
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder={`Reply as ${currentSender}…`}
          className="w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          Send
        </button>
      </form>
    </div>
  );
}
