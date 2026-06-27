import { AnimatePresence, motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface Region {
  key: string;
  label: string;
  neighborhoods: string[];
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export const PAX_RANGES = ["1-5", "6-15", "16-30", "31-50", "50+"];

type OpenField = "location" | "date" | "pax" | null;

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function formatDay(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatDateRangeLabel(range: DateRange) {
  if (range.start && range.end) {
    return `${formatDay(range.start)} – ${formatDay(range.end)}`;
  }
  if (range.start) {
    return `${formatDay(range.start)} – pick end date`;
  }
  return "When?";
}

function isWithinRange(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  return date > start && date < end;
}

function MonthCalendar({
  range,
  onSelect,
}: {
  range: DateRange;
  onSelect: (date: Date) => void;
}) {
  const [cursor, setCursor] = useState(range.start ?? new Date());

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="w-72 p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="rounded px-2 py-1 text-ink/60 hover:bg-ink/5"
        >
          ‹
        </button>
        <span className="text-sm font-medium text-ink">
          {cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </span>
        <button
          type="button"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="rounded px-2 py-1 text-ink/60 hover:bg-ink/5"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-ink/40">
        {WEEKDAYS.map((day, i) => (
          <span key={`${day}-${i}`}>{day}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <span key={`empty-${i}`} />;
          const date = new Date(year, month, day);
          const isEndpoint =
            (range.start && date.toDateString() === range.start.toDateString()) ||
            (range.end && date.toDateString() === range.end.toDateString());
          const inRange = isWithinRange(date, range.start, range.end);
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelect(date)}
              className={`rounded-full py-1.5 text-sm transition ${
                isEndpoint
                  ? "bg-accent text-white"
                  : inRange
                    ? "bg-accent/15 text-ink"
                    : "text-ink/80 hover:bg-ink/5"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function SearchBar({
  regions,
  location,
  dateRange,
  paxRange,
  onLocationChange,
  onDateRangeChange,
  onPaxRangeChange,
  onSearch,
}: {
  regions: Region[];
  location: string | null;
  dateRange: DateRange;
  paxRange: string | null;
  onLocationChange: (key: string | null) => void;
  onDateRangeChange: (range: DateRange) => void;
  onPaxRangeChange: (range: string) => void;
  onSearch: () => void;
}) {
  const [openField, setOpenField] = useState<OpenField>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedRegion = regions.find((r) => r.key === location) ?? null;
  const [locationQuery, setLocationQuery] = useState(selectedRegion?.label ?? "");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenField(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredRegions = regions.filter((region) => {
    const query = locationQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      region.label.toLowerCase().includes(query) ||
      region.neighborhoods.some((n) => n.toLowerCase().includes(query))
    );
  });

  function handleDateSelect(selected: Date) {
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      onDateRangeChange({ start: selected, end: null });
      return;
    }
    if (selected < dateRange.start) {
      onDateRangeChange({ start: selected, end: dateRange.start });
    } else {
      onDateRangeChange({ start: dateRange.start, end: selected });
    }
    setOpenField(null);
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-3xl sm:w-[70%]"
    >
      <div className="flex flex-col rounded-3xl border border-border bg-white shadow-soft sm:flex-row sm:items-stretch sm:rounded-full">
        <div className="relative flex-1">
          <div
            className={`flex items-center gap-3 px-6 py-4 transition ${
              openField === "location" ? "shadow-[0_0_0_1px_rgba(158,150,235,0.4)]" : ""
            }`}
          >
            <MapPin size={18} className="shrink-0 text-accent" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-medium text-ink/50">
                Location
              </span>
              <input
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  onLocationChange(null);
                  setOpenField("location");
                }}
                onFocus={() => setOpenField("location")}
                placeholder="Where in Singapore?"
                className="w-full truncate bg-transparent text-sm text-ink outline-none placeholder:text-ink/30"
              />
            </span>
          </div>

          <AnimatePresence>
            {openField === "location" && filteredRegions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full z-10 mt-2 w-80 rounded-2xl border border-border bg-white p-4 shadow-floating"
              >
                <p className="mb-2 text-center text-lg">🇸🇬</p>
                <div className="space-y-1">
                  {filteredRegions.map((region) => (
                    <button
                      key={region.key}
                      type="button"
                      onClick={() => {
                        onLocationChange(region.key);
                        setLocationQuery(region.label);
                        setOpenField(null);
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left transition hover:bg-accent/5"
                    >
                      <span className="block text-sm font-semibold text-ink">
                        {region.label}
                      </span>
                      <span className="block text-xs text-ink/50">
                        {region.neighborhoods.join(", ")}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden w-px bg-border sm:block" />

        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setOpenField(openField === "date" ? null : "date")}
            className={`flex w-full items-center gap-3 px-6 py-4 text-left transition ${
              openField === "date" ? "shadow-[0_0_0_1px_rgba(158,150,235,0.4)]" : ""
            }`}
          >
            <Calendar size={18} className="shrink-0 text-accent" />
            <span className="min-w-0">
              <span className="block text-xs font-medium text-ink/50">Date</span>
              <span className="block truncate text-sm text-ink">
                {formatDateRangeLabel(dateRange)}
              </span>
            </span>
          </button>

          <AnimatePresence>
            {openField === "date" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full z-10 mt-2 rounded-2xl border border-border bg-white shadow-floating"
              >
                <MonthCalendar range={dateRange} onSelect={handleDateSelect} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden w-px bg-border sm:block" />

        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setOpenField(openField === "pax" ? null : "pax")}
            className={`flex w-full items-center gap-3 px-6 py-4 text-left transition ${
              openField === "pax" ? "shadow-[0_0_0_1px_rgba(158,150,235,0.4)]" : ""
            }`}
          >
            <Users size={18} className="shrink-0 text-accent" />
            <span className="min-w-0">
              <span className="block text-xs font-medium text-ink/50">
                Team Size
              </span>
              <span className="block truncate text-sm text-ink">
                {paxRange ? `${paxRange} people` : "How many?"}
              </span>
            </span>
          </button>

          <AnimatePresence>
            {openField === "pax" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full z-10 mt-2 w-56 rounded-2xl border border-border bg-white p-3 shadow-floating"
              >
                <div className="space-y-1">
                  {PAX_RANGES.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        onPaxRangeChange(range);
                        setOpenField(null);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                        paxRange === range
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

        <div className="p-2 sm:flex sm:items-center">
          <button
            type="button"
            disabled={!location}
            onClick={onSearch}
            className="w-full rounded-full bg-gradient-to-br from-accentFrom to-accentTo px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:shadow-floating disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 disabled:hover:shadow-none sm:w-auto"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
