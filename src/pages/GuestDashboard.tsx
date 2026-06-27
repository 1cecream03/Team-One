import { useEffect, useState } from "react";
import AuthGate, { loadAuth } from "../components/AuthGate";
import ChatThread from "../components/ChatThread";
import Modal from "../components/Modal";
import Panel from "../components/Panel";
import RoleGate from "../components/RoleGate";
import { BookingMessage, GuestSubmission, SubmissionStatus } from "../types";

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  New: "bg-accent/20 text-accent",
  Contacted: "bg-yellow-500/20 text-yellow-300",
  Matched: "bg-emerald-500/20 text-emerald-300",
  Completed: "bg-white/10 text-white/60",
  Rejected: "bg-red-500/20 text-red-300",
};

function loadGuests(): GuestSubmission[] {
  return JSON.parse(localStorage.getItem("nexus_guests") ?? "[]");
}

export default function GuestDashboard() {
  const [authed, setAuthed] = useState(() => !!loadAuth());
  const [guests, setGuests] = useState<GuestSubmission[]>([]);
  const [chatGuestId, setChatGuestId] = useState<string | null>(null);

  useEffect(() => {
    if (authed) {
      setGuests(loadGuests());
    }
  }, [authed]);

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-6 py-16">
        <AuthGate onAuthed={() => setAuthed(true)} />
      </div>
    );
  }

  if (loadAuth()?.role !== "guest") {
    return (
      <RoleGate
        requiredRole="guest"
        redirectTo="/dashboard/host"
        redirectLabel="Go to Host Dashboard"
      />
    );
  }

  const email = loadAuth()?.email ?? "";
  const myBookings = guests.filter((g) => g.contactEmail === email);
  const chatGuest = myBookings.find((g) => g.id === chatGuestId) ?? null;

  function sendGuestMessage(id: string, text: string) {
    const message: BookingMessage = {
      sender: "guest",
      text,
      at: new Date().toISOString(),
    };
    const updated = guests.map((g) =>
      g.id === id ? { ...g, messages: [...(g.messages ?? []), message] } : g,
    );
    setGuests(updated);
    localStorage.setItem("nexus_guests", JSON.stringify(updated));
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold sm:text-3xl">My bookings</h1>
      <p className="mt-1 text-sm text-white/60">Signed in as {email}</p>

      <div className="mt-8 space-y-3">
        {myBookings.length === 0 ? (
          <p className="text-sm text-white/40">
            No booking requests yet — find a space from /find.
          </p>
        ) : (
          myBookings.map((guest) => (
            <button
              key={guest.id}
              type="button"
              onClick={() => setChatGuestId(guest.id)}
              className="w-full rounded-xl border border-border bg-white/5 p-4 text-left transition hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{guest.spaceType}</p>
                  <p className="text-sm text-white/60">
                    {guest.cityPreference} · {guest.dateRange}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[guest.status]}`}
                >
                  {guest.status}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-white/50">
                <span>{guest.budgetRange}</span>
                <span>
                  Message{guest.messages?.length ? ` (${guest.messages.length})` : ""}
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {chatGuest && (
        <Modal onClose={() => setChatGuestId(null)}>
          <Panel>
            <h1 className="text-xl font-bold">{chatGuest.spaceType}</h1>
            <p className="mt-1 text-sm text-white/60">
              {chatGuest.cityPreference} · {chatGuest.dateRange}
            </p>

            <div className="mt-4">
              <ChatThread
                messages={chatGuest.messages ?? []}
                currentSender="guest"
                otherName="Host"
                onSend={(text) => sendGuestMessage(chatGuest.id, text)}
              />
            </div>

            <button
              type="button"
              onClick={() => setChatGuestId(null)}
              className="mt-4 w-full rounded-full border border-border px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:border-white/30"
            >
              Close
            </button>
          </Panel>
        </Modal>
      )}
    </div>
  );
}
