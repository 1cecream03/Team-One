import { FormEvent, useState } from "react";
import { loadAuth } from "./AuthGate";
import Modal from "./Modal";
import Panel from "./Panel";
import { SpaceListing } from "../data/listings";
import { BookingMessage, GuestSubmission } from "../types";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";
const labelClass = "mb-1.5 block text-sm font-medium text-ink/70";

function formatDate(value: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export default function BookingModal({
  listing,
  checkIn,
  checkOut,
  guests,
  total,
  onClose,
}: {
  listing: SpaceListing;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  onClose: () => void;
}) {
  const [paid, setPaid] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [note, setNote] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const auth = loadAuth();
    const messages: BookingMessage[] = note.trim()
      ? [{ sender: "guest", text: note.trim(), at: new Date().toISOString() }]
      : [];
    const submission: GuestSubmission = {
      id: crypto.randomUUID(),
      company: "Guest visit",
      website: "",
      contactName: "Guest",
      contactEmail: auth?.email ?? "guest@rift.dev",
      vcNetwork: listing.vcNetwork,
      cityPreference: listing.neighborhood,
      spaceType: listing.spaceType,
      dateRange: `${formatDate(checkIn)} – ${formatDate(checkOut)}`,
      frequency: "one-off",
      teamSize: guests,
      amenities: listing.amenities,
      budgetRange: `$${total}`,
      status: "New",
      submittedAt: new Date().toISOString(),
      messages,
    };

    const existing: GuestSubmission[] = JSON.parse(
      localStorage.getItem("rift_guests") ?? "[]",
    );
    localStorage.setItem(
      "rift_guests",
      JSON.stringify([...existing, submission]),
    );

    setPaid(true);
  }

  if (paid) {
    return (
      <Modal onClose={onClose}>
        <Panel className="text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-2xl text-accent">
            ✓
          </div>
          <h1 className="text-2xl font-bold">Booking request sent</h1>
          <p className="mt-3 text-sm text-ink/60">
            Your request for {listing.name} is with the host. Access details
            will unlock here once they confirm.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:scale-105 hover:border-ink/20"
          >
            Done
          </button>
        </Panel>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <Panel>
        <h1 className="text-2xl font-bold">Confirm & pay</h1>
        <p className="mt-2 text-sm text-ink/60">
          {listing.name} · {formatDate(checkIn)} – {formatDate(checkOut)} ·{" "}
          {guests} {guests === 1 ? "person" : "people"}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className={labelClass}>Card number</label>
            <input
              required
              inputMode="numeric"
              maxLength={19}
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Expiry</label>
              <input
                required
                placeholder="MM/YY"
                maxLength={5}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>CVC</label>
              <input
                required
                maxLength={4}
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Message to host (optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. We'll need the room set up boardroom-style"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex justify-between border-t border-border pt-4 text-sm font-semibold text-ink">
            <span>Total</span>
            <span>S${total}</span>
          </div>

          <p className="text-xs text-ink/40">
            Funds are held until the host confirms — you won't be charged
            until your request is accepted.
          </p>

          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-br from-accentFrom to-accentTo px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:shadow-floating"
          >
            Pay S${total}
          </button>
        </form>
      </Panel>
    </Modal>
  );
}
