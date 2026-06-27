import { FormEvent, useState } from "react";
import AuthGate, { loadAuth } from "../components/AuthGate";
import ConfirmationScreen from "../components/ConfirmationScreen";
import { AMENITIES, HostSubmission, SPACE_TYPES, VC_NETWORKS } from "../types";

const inputClass =
  "w-full rounded-lg border border-border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-accent";
const labelClass = "mb-1.5 block text-sm font-medium text-white/80";

export default function ListSpace() {
  const [authed, setAuthed] = useState(() => !!loadAuth());
  const [submitted, setSubmitted] = useState(false);

  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [vcNetwork, setVcNetwork] = useState<string>(VC_NETWORKS[0]);
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [spaceType, setSpaceType] = useState<string>(SPACE_TYPES[0]);
  const [capacity, setCapacity] = useState("");
  const [availability, setAvailability] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [monthlyHours, setMonthlyHours] = useState("");
  const [suggestRate, setSuggestRate] = useState(false);
  const [rate, setRate] = useState("");

  function toggleAmenity(amenity: string) {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const submission: HostSubmission = {
      id: crypto.randomUUID(),
      company,
      website,
      contactName,
      contactEmail,
      vcNetwork,
      city,
      neighborhood,
      spaceType,
      capacity: Number(capacity) || 0,
      availability,
      amenities,
      monthlyHours: Number(monthlyHours) || 0,
      rate: suggestRate ? "suggest" : Number(rate) || 0,
      status: "New",
      submittedAt: new Date().toISOString(),
    };

    const existing: HostSubmission[] = JSON.parse(
      localStorage.getItem("nexus_hosts") ?? "[]",
    );
    localStorage.setItem(
      "nexus_hosts",
      JSON.stringify([...existing, submission]),
    );

    setSubmitted(true);
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-6 py-16">
        <AuthGate onAuthed={() => setAuthed(true)} />
      </div>
    );
  }

  if (submitted) {
    return <ConfirmationScreen />;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">List your space</h1>
      <p className="mt-2 text-white/60">
        Tell us about the space you have available — we'll match it with
        portfolio companies looking for exactly this.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Company name</label>
            <input
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input
              required
              type="url"
              placeholder="https://"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Contact name</label>
            <input
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Contact email</label>
            <input
              required
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>VC / investor network</label>
            <select
              value={vcNetwork}
              onChange={(e) => setVcNetwork(e.target.value)}
              className={inputClass}
            >
              {VC_NETWORKS.map((network) => (
                <option
                  key={network}
                  value={network}
                  className="bg-background text-white"
                >
                  {network}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Space type</label>
            <select
              value={spaceType}
              onChange={(e) => setSpaceType(e.target.value)}
              className={inputClass}
            >
              {SPACE_TYPES.map((type) => (
                <option
                  key={type}
                  value={type}
                  className="bg-background text-white"
                >
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Neighborhood</label>
            <input
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Capacity (people)</label>
            <input
              required
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Monthly hours available</label>
            <input
              type="number"
              min="0"
              value={monthlyHours}
              onChange={(e) => setMonthlyHours(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Available days / times</label>
          <input
            placeholder="e.g. Weekdays 9am–6pm"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Amenities</label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {AMENITIES.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2 text-sm text-white/80"
              >
                <input
                  type="checkbox"
                  checked={amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="h-4 w-4 rounded border-border bg-white/5 accent-accent"
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Desired rate per hour</label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="0"
              disabled={suggestRate}
              placeholder="$ per hour"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className={`${inputClass} max-w-xs disabled:opacity-40`}
            />
            <label className="flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={suggestRate}
                onChange={(e) => setSuggestRate(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-white/5 accent-accent"
              />
              Suggest a rate for me
            </label>
          </div>
        </div>

        <div>
          <label className={labelClass}>Photos (optional)</label>
          <input type="file" accept="image/*" multiple className={inputClass} />
        </div>

        <button
          type="submit"
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:shadow-[0_0_24px_rgba(99,102,241,0.55)]"
        >
          Submit listing
        </button>
      </form>
    </div>
  );
}
