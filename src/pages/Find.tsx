import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar, { DateRange } from "../components/SearchBar";
import SpaceCard from "../components/SpaceCard";
import { LISTINGS, SG_REGIONS } from "../data/listings";

function parseDateParam(value: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export default function Find() {
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

  function handleSearch() {
    if (!location) return;
    setAppliedLocation(location);

    const params: Record<string, string> = { location };
    if (dateRange.start) params.dateStart = dateRange.start.toISOString().slice(0, 10);
    if (dateRange.end) params.dateEnd = dateRange.end.toISOString().slice(0, 10);
    if (paxRange) params.pax = paxRange;
    setSearchParams(params);
  }

  const results = appliedLocation
    ? LISTINGS.filter((listing) => listing.regionKey === appliedLocation)
    : LISTINGS;

  return (
    <div className="px-6 pb-24 pt-20">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          Find your space in Singapore.
        </h1>
        <p className="mt-3 text-white/60">
          Search trusted offices across the network.
        </p>
      </div>

      <div className="mt-10">
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

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((listing, index) => (
          <SpaceCard key={listing.id} listing={listing} index={index} />
        ))}
      </div>
    </div>
  );
}
