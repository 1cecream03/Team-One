import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar, { DateRange, Region } from "../components/SearchBar";
import SpaceCard, { SpaceListing } from "../components/SpaceCard";

const SG_REGIONS: Region[] = [
  {
    key: "central",
    label: "Central",
    neighborhoods: ["CBD", "Raffles Place", "Tanjong Pagar"],
  },
  {
    key: "north",
    label: "North",
    neighborhoods: ["Woodlands", "Yishun", "Sembawang"],
  },
  {
    key: "north-east",
    label: "North-East",
    neighborhoods: ["Punggol", "Sengkang", "Hougang"],
  },
  {
    key: "east",
    label: "East",
    neighborhoods: ["Tampines", "Changi", "Bedok"],
  },
  {
    key: "west",
    label: "West",
    neighborhoods: ["Jurong", "Buona Vista", "one-north"],
  },
];

const LISTINGS: SpaceListing[] = [
  { id: "1", name: "The Boardroom @ Tanjong Pagar", regionKey: "central", regionLabel: "Central", capacity: 20, rate: 45 },
  { id: "2", name: "Raffles Place Sky Suite", regionKey: "central", regionLabel: "Central", capacity: 12, rate: 60 },
  { id: "3", name: "Woodlands Collaboration Hub", regionKey: "north", regionLabel: "North", capacity: 30, rate: 35 },
  { id: "4", name: "Yishun Innovation Floor", regionKey: "north", regionLabel: "North", capacity: 15, rate: 28 },
  { id: "5", name: "Punggol Waterfront Office", regionKey: "north-east", regionLabel: "North-East", capacity: 18, rate: 32 },
  { id: "6", name: "Sengkang Event Loft", regionKey: "north-east", regionLabel: "North-East", capacity: 50, rate: 70 },
  { id: "7", name: "Tampines Hub Boardroom", regionKey: "east", regionLabel: "East", capacity: 10, rate: 30 },
  { id: "8", name: "Changi Business Park Floor", regionKey: "east", regionLabel: "East", capacity: 40, rate: 55 },
  { id: "9", name: "one-north Maker Space", regionKey: "west", regionLabel: "West", capacity: 25, rate: 38 },
  { id: "10", name: "Jurong Lakeside Office", regionKey: "west", regionLabel: "West", capacity: 22, rate: 33 },
];

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
