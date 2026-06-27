import { useEffect, useState } from "react";
import AuthGate, { loadAuth } from "../components/AuthGate";
import ChatThread from "../components/ChatThread";
import Modal from "../components/Modal";
import Panel from "../components/Panel";
import RoleGate from "../components/RoleGate";
import { BookingMessage, GuestSubmission, HostSubmission, SubmissionStatus } from "../types";

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  New: "bg-accent/20 text-accent",
  Contacted: "bg-yellow-500/20 text-yellow-300",
  Matched: "bg-emerald-500/20 text-emerald-300",
  Completed: "bg-ink/10 text-ink/60",
  Rejected: "bg-red-500/20 text-red-300",
};

function loadHosts(): HostSubmission[] {
  return JSON.parse(localStorage.getItem("rift_hosts") ?? "[]");
}

function loadGuests(): GuestSubmission[] {
  return JSON.parse(localStorage.getItem("rift_guests") ?? "[]");
}

export default function HostDashboard() {
  const [authed, setAuthed] = useState(() => !!loadAuth());
  const [hosts, setHosts] = useState<HostSubmission[]>([]);
  const [guests, setGuests] = useState<GuestSubmission[]>([]);
  const [chatGuestId, setChatGuestId] = useState<string | null>(null);

  useEffect(() => {
    if (authed) {
      setHosts(loadHosts());
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

  if (loadAuth()?.role !== "host") {
    return (
      <RoleGate
        requiredRole="host"
        redirectTo="/dashboard/guest"
        redirectLabel="Go to My Bookings"
      />
    );
  }

  const email = loadAuth()?.email ?? "";
  const myListings = hosts.filter((h) => h.contactEmail === email);
  const chatGuest = guests.find((g) => g.id === chatGuestId) ?? null;

  function sendHostMessage(id: string, text: string) {
    const message: BookingMessage = {
      sender: "host",
      text,
      at: new Date().toISOString(),
    };
    const updated = guests.map((g) =>
      g.id === id ? { ...g, messages: [...(g.messages ?? []), message] } : g,
    );
    setGuests(updated);
    localStorage.setItem("rift_guests", JSON.stringify(updated));
  }

  function acceptBooking(id: string) {
    const updated = guests.map((g) =>
      g.id === id ? { ...g, status: "Matched" as SubmissionStatus } : g,
    );
    setGuests(updated);
    localStorage.setItem("rift_guests", JSON.stringify(updated));
  }

  function rejectBooking(id: string) {
    const updated = guests.map((g) =>
      g.id === id ? { ...g, status: "Rejected" as SubmissionStatus } : g,
    );
    setGuests(updated);
    localStorage.setItem("rift_guests", JSON.stringify(updated));
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold sm:text-3xl">Host dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">
        Signed in as {email}
      </p>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">
          My listings
        </h2>
        {myListings.length === 0 ? (
          <p className="text-sm text-ink/40">
            You haven't listed a space yet — submit one from /list.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {myListings.map((host) => (
              <div
                key={host.id}
                className="rounded-2xl border border-border bg-white p-4 shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-ink">{host.company}</p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[host.status]}`}
                  >
                    {host.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/50">
                  <span>{host.city}</span>
                  <span>{host.spaceType}</span>
                  <span>Up to {host.capacity} people</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">
          Booking requests
        </h2>
        {guests.length === 0 ? (
          <p className="text-sm text-ink/40">No booking requests yet.</p>
        ) : (
          <div className="space-y-3">
            {guests.map((guest) => (
              <button
                key={guest.id}
                type="button"
                onClick={() => setChatGuestId(guest.id)}
                className="w-full rounded-2xl border border-border bg-white p-4 text-left shadow-soft transition hover:bg-accent/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{guest.company}</p>
                    <p className="text-sm text-ink/60">{guest.contactName}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[guest.status]}`}
                  >
                    {guest.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-ink/50">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span>{guest.cityPreference}</span>
                    <span>{guest.spaceType}</span>
                    <span>{guest.dateRange}</span>
                  </div>
                  <span>
                    Message{guest.messages?.length ? ` (${guest.messages.length})` : ""}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {chatGuest && (
        <Modal onClose={() => setChatGuestId(null)}>
          <Panel>
            <h1 className="text-xl font-bold">{chatGuest.company}</h1>
            <p className="mt-1 text-sm text-ink/60">
              {chatGuest.contactName} · {chatGuest.spaceType} in{" "}
              {chatGuest.cityPreference}
            </p>

            <div className="mt-4">
              <ChatThread
                messages={chatGuest.messages ?? []}
                currentSender="host"
                otherName={chatGuest.contactName}
                onSend={(text) => sendHostMessage(chatGuest.id, text)}
              />
            </div>

            {chatGuest.status === "Rejected" && (
              <p className="mt-4 text-sm text-red-600">
                You rejected this booking request.
              </p>
            )}

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => acceptBooking(chatGuest.id)}
                disabled={
                  chatGuest.status === "Matched" ||
                  chatGuest.status === "Completed" ||
                  chatGuest.status === "Rejected"
                }
                className="flex-1 rounded-full bg-gradient-to-br from-accentFrom to-accentTo px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:shadow-floating disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {chatGuest.status === "Matched" || chatGuest.status === "Completed"
                  ? "Booking accepted"
                  : "Accept booking"}
              </button>
              <button
                type="button"
                onClick={() => rejectBooking(chatGuest.id)}
                disabled={
                  chatGuest.status === "Matched" ||
                  chatGuest.status === "Completed" ||
                  chatGuest.status === "Rejected"
                }
                className="flex-1 rounded-full border border-red-300 px-6 py-3 text-sm font-semibold text-red-600 transition hover:scale-105 hover:border-red-400 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
              >
                {chatGuest.status === "Rejected" ? "Booking rejected" : "Reject"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setChatGuestId(null)}
              className="mt-3 w-full rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:scale-105 hover:border-ink/20"
            >
              Close
            </button>
          </Panel>
        </Modal>
      )}
    </div>
  );
}
