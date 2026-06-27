import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthGate, { loadAuth } from "../components/AuthGate";
import RoleGate from "../components/RoleGate";
import SearchBar, { DateRange } from "../components/SearchBar";
import SpaceCard from "../components/SpaceCard";
import { getAllListings, SG_REGIONS } from "../data/listings";

function parseDateParam(value: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export default function Find() {
  const [authed, setAuthed] = useState(() => !!loadAuth());
  const [searchParams, setSearchParams] = useSearchParams();

  const [location, setLocation] = useState<string | null>(
    searchParams.get("location"),
  );
  const [dateRange, setDateRange] = useState<DateRange>({
    start: parseDateParam(searchParams.get("dateStart")),
    end: parseDateParam(searchParams.get("dateEnd")),
  });
  const [paxRange, setPaxRange] = useState<string | null>(
    searchParams.get("pax"),
  );
  const [appliedLocation, setAppliedLocation] = useState<string | null>(
    searchParams.get("location"),
  );
  const [appliedPaxRange, setAppliedPaxRange] = useState<string | null>(
    searchParams.get("pax"),
  );

  function handleSearch() {
    if (!location) return;
    setAppliedLocation(location);
    setAppliedPaxRange(paxRange);

    const params: Record<string, string> = { location };
    if (dateRange.start) params.dateStart = dateRange.start.toISOString().slice(0, 10);
    if (dateRange.end) params.dateEnd = dateRange.end.toISOString().slice(0, 10);
    if (paxRange) params.pax = paxRange;
    setSearchParams(params);
  }

  function minTeamSize(range: string): number {
    return Number(range.replace("+", "").split("-")[0]) || 0;
  }

  const results = getAllListings().filter((listing) => {
    if (appliedLocation && listing.regionKey !== appliedLocation) return false;
    if (appliedPaxRange && listing.capacity < minTeamSize(appliedPaxRange)) {
      return false;
    }
    return true;
  });

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

  return (
    <div className="px-6 pb-24 pt-20">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          Find your space in Singapore.
        </h1>
        <p className="mt-3 text-ink/60">
          Search trusted offices across the network.
        </p>
      </div>

      <div className="relative z-20 mt-10">
        <SearchBar
          regions={SG_REGIONS}
          location={location}
          dateRange={dateRange}
          paxRange={paxRange}
          onLocationChange={setLocation}
          onDateRangeChange={setDateRange}
          onPaxRangeChange={setPaxRange}
          onSearch={handleSearch}
        />
      </div>

      {results.length > 0 ? (
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((listing, index) => (
            <SpaceCard key={listing.id} listing={listing} index={index} />
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-16 max-w-md text-center">
          <p className="text-lg font-semibold text-ink">No spaces match your search</p>
          <p className="mt-2 text-sm text-ink/60">
            Try a different location or a smaller team size.
          </p>
        </div>
      )}
    </div>
  );
}
