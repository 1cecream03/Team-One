import { FormEvent, useEffect, useState } from "react";
import Panel from "../components/Panel";
import { GuestSubmission, HostSubmission, SubmissionStatus } from "../types";

const ADMIN_PASSWORD = "rift2035";

const STATUS_ORDER: SubmissionStatus[] = [
  "New",
  "Contacted",
  "Matched",
  "Completed",
];

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  New: "bg-accent/20 text-accent",
  Contacted: "bg-yellow-500/20 text-yellow-300",
  Matched: "bg-emerald-500/20 text-emerald-300",
  Completed: "bg-ink/10 text-ink/60",
  Rejected: "bg-red-500/20 text-red-300",
};

function nextStatus(status: SubmissionStatus): SubmissionStatus {
  const index = STATUS_ORDER.indexOf(status);
  return STATUS_ORDER[(index + 1) % STATUS_ORDER.length];
}

function loadHosts(): HostSubmission[] {
  return JSON.parse(localStorage.getItem("rift_hosts") ?? "[]");
}

function loadGuests(): GuestSubmission[] {
  return JSON.parse(localStorage.getItem("rift_guests") ?? "[]");
}

function buildMailto(host: HostSubmission, guest: GuestSubmission) {
  const subject = `Rift introduction: ${host.company} x ${guest.company}`;
  const body = [
    `Hi ${host.contactName} and ${guest.contactName},`,
    "",
    `Introducing you both via Rift — ${host.company} has space available in ${host.city}, and ${guest.company} is looking for ${guest.spaceType.toLowerCase()} space in ${guest.cityPreference}.`,
    "",
    `${host.company}: ${host.contactName} (${host.contactEmail})`,
    `${guest.company}: ${guest.contactName} (${guest.contactEmail})`,
    "",
    "Feel free to take it from here — happy matching!",
    "— Rift Concierge",
  ].join("\n");

  return `mailto:${host.contactEmail},${guest.contactEmail}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

function StatusTag({
  status,
  onClick,
}: {
  status: SubmissionStatus;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${STATUS_STYLES[status]}`}
    >
      {status}
    </button>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState(false);

  const [hosts, setHosts] = useState<HostSubmission[]>([]);
  const [guests, setGuests] = useState<GuestSubmission[]>([]);
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  useEffect(() => {
    if (authed) {
      setHosts(loadHosts());
      setGuests(loadGuests());
    }
  }, [authed]);

  function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  function cycleHostStatus(id: string) {
    const updated = hosts.map((h) =>
      h.id === id ? { ...h, status: nextStatus(h.status) } : h,
    );
    setHosts(updated);
    localStorage.setItem("rift_hosts", JSON.stringify(updated));
  }

  function cycleGuestStatus(id: string) {
    const updated = guests.map((g) =>
      g.id === id ? { ...g, status: nextStatus(g.status) } : g,
    );
    setGuests(updated);
    localStorage.setItem("rift_guests", JSON.stringify(updated));
  }

  const selectedHost = hosts.find((h) => h.id === selectedHostId) ?? null;
  const selectedGuest = guests.find((g) => g.id === selectedGuestId) ?? null;

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-6 py-32">
        <Panel>
          <h1 className="text-2xl font-bold">Admin access</h1>
          <p className="mt-2 text-sm text-ink/60">
            Enter the admin password to continue.
          </p>
          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-3">
            <input
              type="password"
              autoFocus
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
            {error && (
              <p className="text-sm text-red-400">Incorrect password.</p>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-br from-accentFrom to-accentTo px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-105"
            >
              Enter
            </button>
          </form>
        </Panel>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-bold sm:text-3xl">Admin dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">
        Select one host and one guest card to match them.
      </p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">
            Host submissions
          </h2>
          <div className="space-y-3">
            {hosts.length === 0 && (
              <p className="text-sm text-ink/40">No host submissions yet.</p>
            )}
            {hosts.map((host) => (
              <button
                key={host.id}
                type="button"
                onClick={() =>
                  setSelectedHostId(
                    selectedHostId === host.id ? null : host.id,
                  )
                }
                className={`w-full rounded-2xl border p-4 text-left shadow-soft transition ${
                  selectedHostId === host.id
                    ? "border-accent bg-accent/10"
                    : "border-border bg-white hover:bg-accent/5"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{host.company}</p>
                    <p className="text-sm text-ink/60">{host.contactName}</p>
                  </div>
                  <StatusTag
                    status={host.status}
                    onClick={() => cycleHostStatus(host.id)}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/50">
                  <span>{host.vcNetwork}</span>
                  <span>{host.city}</span>
                  <span>{host.spaceType}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">
            Guest submissions
          </h2>
          <div className="space-y-3">
            {guests.length === 0 && (
              <p className="text-sm text-ink/40">No guest submissions yet.</p>
            )}
            {guests.map((guest) => (
              <button
                key={guest.id}
                type="button"
                onClick={() =>
                  setSelectedGuestId(
                    selectedGuestId === guest.id ? null : guest.id,
                  )
                }
                className={`w-full rounded-2xl border p-4 text-left shadow-soft transition ${
                  selectedGuestId === guest.id
                    ? "border-accent bg-accent/10"
                    : "border-border bg-white hover:bg-accent/5"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{guest.company}</p>
                    <p className="text-sm text-ink/60">{guest.contactName}</p>
                  </div>
                  <StatusTag
                    status={guest.status}
                    onClick={() => cycleGuestStatus(guest.id)}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/50">
                  <span>{guest.vcNetwork}</span>
                  <span>{guest.cityPreference}</span>
                  <span>{guest.spaceType}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedHost && selectedGuest && (
        <div className="fixed bottom-6 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 px-2 sm:w-auto">
          <a
            href={buildMailto(selectedHost, selectedGuest)}
            className="block truncate rounded-full bg-gradient-to-br from-accentFrom to-accentTo px-6 py-3 text-center text-sm font-semibold text-white shadow-floating transition hover:scale-105"
          >
            Match {selectedHost.company} × {selectedGuest.company} — send intro
            email
          </a>
        </div>
      )}
    </div>
  );
}
