import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import AuthGate, { loadAuth } from "../components/AuthGate";
import BookingModal from "../components/BookingModal";
import RoleGate from "../components/RoleGate";
import { PAX_RANGES } from "../components/SearchBar";
import { getListingById } from "../data/listings";

function minTeamSize(range: string): number {
  return Number(range.replace("+", "").split("-")[0]) || 0;
}

const microLabelClass =
  "block text-[10px] font-bold uppercase tracking-wide text-ink/40";
const gridInputClass =
  "mt-0.5 w-full border-none bg-transparent p-0 text-sm text-ink outline-none";

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
  const listing = id ? getListingById(id) : undefined;
  const [authed, setAuthed] = useState(() => !!loadAuth());
  const [bookingOpen, setBookingOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestRange, setGuestRange] = useState<string | null>(null);
  const [paxOpen, setPaxOpen] = useState(false);
  const paxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (paxRef.current && !paxRef.current.contains(event.target as Node)) {
        setPaxOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          className="mt-6 inline-block rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-ink shadow-soft transition hover:scale-105 hover:border-ink/20"
        >
          Back to search
        </Link>
      </div>
    );
  }

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
        redirectTo="/list"
        redirectLabel="List a space instead"
      />
    );
  }

  const guestsNum = guestRange ? minTeamSize(guestRange) : 0;
  const canReserve = days > 0 && guestsNum > 0 && guestsNum <= listing.capacity;
  const availableRanges = PAX_RANGES.filter(
    (range) => minTeamSize(range) <= listing.capacity,
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link to="/find" className="text-sm text-ink/60 transition hover:text-ink">
        ← Back to search
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-2 overflow-hidden rounded-3xl shadow-soft sm:grid-cols-2">
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
          <p className="mt-2 text-sm text-ink/60">
            Hosted by a {listing.vcNetwork} portfolio company
          </p>
          <p className="mt-6 max-w-xl text-ink/70">{listing.description}</p>

          <div className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
              Amenities
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {listing.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full border border-border bg-accent/5 px-3 py-1.5 text-xs text-ink/80"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="h-fit w-full max-w-xs rounded-3xl border border-border bg-white p-6 shadow-soft">
          {/* Header: pricing */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-ink underline decoration-accent decoration-2">
              S${days > 0 ? total : listing.rate}
            </span>
            {days === 0 && (
              <span className="text-sm font-normal text-ink/50">/ hr</span>
            )}
          </div>
          <p className="mt-1 text-xs text-ink/50">
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
            <div ref={paxRef} className="relative border-t border-border">
              <button
                type="button"
                onClick={() => setPaxOpen((open) => !open)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left"
              >
                <div>
                  <span className={microLabelClass}>Guests</span>
                  <span className="mt-0.5 block text-sm text-ink">
                    {guestRange ? `${guestRange} people` : `Up to ${listing.capacity}`}
                  </span>
                </div>
                <ChevronDown size={16} className="shrink-0 text-ink/40" />
              </button>

              <AnimatePresence>
                {paxOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full z-10 mt-2 w-56 rounded-2xl border border-border bg-white p-3 shadow-floating"
                  >
                    <div className="space-y-1">
                      {availableRanges.map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() => {
                            setGuestRange(range);
                            setPaxOpen(false);
                          }}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                            guestRange === range
                              ? "bg-accent text-white"
                              : "text-ink/80 hover:bg-accent/5"
                          }`}
                        >
                          {range} people
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Informational banner */}
          <div className="mt-4 rounded-xl bg-accent/5 px-3 py-2 text-center text-xs text-ink/60">
            You won't be charged until the host{" "}
            <span className="font-semibold text-ink">confirms</span>.
          </div>

          {/* CTA */}
          <button
            type="button"
            disabled={!canReserve}
            onClick={() => setBookingOpen(true)}
            className="mt-4 block w-full rounded-full bg-gradient-to-br from-accentFrom to-accentTo px-6 py-3.5 text-center text-base font-bold text-white transition hover:scale-105 hover:shadow-floating disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {days > 0 ? `Request to book · S$${total}` : "Request to book"}
          </button>

          {/* Footer microcopy */}
          <p className="mt-3 text-center text-xs text-ink/40">
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
