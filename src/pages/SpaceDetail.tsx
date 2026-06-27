import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import BookingModal from "../components/BookingModal";
import { LISTINGS } from "../data/listings";

const microLabelClass =
  "block text-[10px] font-bold uppercase tracking-wide text-white/40";
const gridInputClass =
  "mt-0.5 w-full border-none bg-transparent p-0 text-sm text-white outline-none [color-scheme:dark]";

const HOURS_PER_DAY = 8;

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export default function SpaceDetail() {
  const { id } = useParams();
  const listing = LISTINGS.find((l) => l.id === id);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");

  const days = nightsBetween(checkIn, checkOut);
  const total = useMemo(
    () => (listing ? listing.rate * HOURS_PER_DAY * days : 0),
    [listing, days],
  );

  if (!listing) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-2xl font-bold">Listing not found</h1>
        <Link
          to="/find"
          className="mt-6 inline-block rounded-full border border-border px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:border-white/30"
        >
          Back to search
        </Link>
      </div>
    );
  }

  const guestsNum = Number(guests) || 0;
  const canReserve =
    days > 0 && guestsNum > 0 && guestsNum <= listing.capacity;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link to="/find" className="text-sm text-white/60 transition hover:text-white">
        ← Back to search
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-2 overflow-hidden rounded-2xl sm:grid-cols-2">
        <img
          src={listing.images[0]}
          alt={listing.name}
          className="aspect-[4/3] w-full object-cover sm:aspect-auto sm:h-full"
        />
        <div className="grid grid-cols-2 gap-2">
          {listing.images.slice(1, 3).map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${listing.name} ${i + 2}`}
              className="aspect-square w-full object-cover"
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:justify-between">
        <div>
          <span className="inline-block rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
            {listing.regionLabel} · {listing.neighborhood}
          </span>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{listing.name}</h1>
          <p className="mt-2 text-sm text-white/60">
            Hosted by a {listing.vcNetwork} portfolio company
          </p>
          <p className="mt-6 max-w-xl text-white/70">{listing.description}</p>

          <div className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
              Amenities
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {listing.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full border border-border bg-white/5 px-3 py-1.5 text-xs text-white/80"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="h-fit w-full max-w-xs rounded-xl border border-border bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
          {/* Header: pricing */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white underline decoration-2">
              S${days > 0 ? total : listing.rate}
            </span>
            {days === 0 && (
              <span className="text-sm font-normal text-white/50">/ hr</span>
            )}
          </div>
          <p className="mt-1 text-xs text-white/50">
            {days > 0
              ? `${days} day${days > 1 ? "s" : ""} · ${HOURS_PER_DAY}hrs/day`
              : "Per hour"}
          </p>

          {/* Unified input grid */}
          <div className="mt-5 rounded-lg border border-border">
            <div className="grid grid-cols-2">
              <div className="px-3 py-2.5">
                <label className={microLabelClass}>Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className={gridInputClass}
                />
              </div>
              <div className="border-l border-border px-3 py-2.5">
                <label className={microLabelClass}>Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || undefined}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className={gridInputClass}
                />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border px-3 py-2.5">
              <div>
                <label className={microLabelClass}>Guests</label>
                <input
                  type="number"
                  min="1"
                  max={listing.capacity}
                  placeholder={`Up to ${listing.capacity}`}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className={`${gridInputClass} w-20`}
                />
              </div>
              <ChevronDown size={16} className="shrink-0 text-white/40" />
            </div>
          </div>

          {/* Informational banner */}
          <div className="mt-4 rounded-md bg-white/5 px-3 py-2 text-center text-xs text-white/60">
            You won't be charged until the host{" "}
            <span className="font-semibold text-white">confirms</span>.
          </div>

          {/* CTA */}
          <button
            type="button"
            disabled={!canReserve}
            onClick={() => setBookingOpen(true)}
            className="mt-4 block w-full rounded-lg bg-accent px-6 py-3.5 text-center text-base font-bold text-white transition hover:scale-105 hover:shadow-[0_0_24px_rgba(99,102,241,0.55)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {days > 0 ? `Request to book · S$${total}` : "Request to book"}
          </button>

          {/* Footer microcopy */}
          <p className="mt-3 text-center text-xs text-white/40">
            No commitment until your request is accepted.
          </p>
        </div>
      </div>

      {bookingOpen && (
        <BookingModal
          listing={listing}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guestsNum}
          total={total}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  );
}
