import { FormEvent, useState } from "react";
import ConfirmationScreen from "../components/ConfirmationScreen";
import {
  AMENITIES,
  GUEST_PROFILE_KEY,
  GuestProfile,
  GuestSubmission,
  SPACE_TYPES,
  VC_NETWORKS,
} from "../types";

const inputClass =
  "w-full rounded-lg border border-border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-accent";
const labelClass = "mb-1.5 block text-sm font-medium text-white/80";

function loadProfile(): GuestProfile | null {
  const raw = localStorage.getItem(GUEST_PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function RegisterStep({
  onRegistered,
}: {
  onRegistered: (profile: GuestProfile) => void;
}) {
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [vcNetwork, setVcNetwork] = useState<string>(VC_NETWORKS[0]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const profile: GuestProfile = {
      company,
      website,
      contactName,
      contactEmail,
      vcNetwork,
    };
    localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(profile));
    onRegistered(profile);
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">Verify your company</h1>
      <p className="mt-2 text-white/60">
        Before you can request space, confirm who you are and which VC
        network backs you. We only ask once.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
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

        <button
          type="submit"
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:shadow-[0_0_24px_rgba(99,102,241,0.55)]"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

export default function FindSpace() {
  const [profile, setProfile] = useState<GuestProfile | null>(loadProfile);
  const [submitted, setSubmitted] = useState(false);

  const [cityPreference, setCityPreference] = useState("");
  const [spaceType, setSpaceType] = useState<string>(SPACE_TYPES[0]);
  const [dateRange, setDateRange] = useState("");
  const [frequency, setFrequency] = useState<"one-off" | "recurring">(
    "one-off",
  );
  const [teamSize, setTeamSize] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState("");

  function toggleAmenity(amenity: string) {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!profile) return;

    const submission: GuestSubmission = {
      id: crypto.randomUUID(),
      ...profile,
      cityPreference,
      spaceType,
      dateRange,
      frequency,
      teamSize: Number(teamSize) || 0,
      amenities,
      budgetRange,
      status: "New",
      submittedAt: new Date().toISOString(),
    };

    const existing: GuestSubmission[] = JSON.parse(
      localStorage.getItem("nexus_guests") ?? "[]",
    );
    localStorage.setItem(
      "nexus_guests",
      JSON.stringify([...existing, submission]),
    );

    setSubmitted(true);
  }

  if (!profile) {
    return <RegisterStep onRegistered={setProfile} />;
  }

  if (submitted) {
    return <ConfirmationScreen />;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">Find a space</h1>
      <p className="mt-2 text-white/60">
        Tell us what you need — we'll match you with available space from
        companies in your portfolio network.
      </p>

      <div className="mt-6 rounded-lg border border-border bg-white/5 px-4 py-3 text-sm text-white/70">
        Requesting as <span className="text-white">{profile.company}</span> (
        {profile.vcNetwork})
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Space type needed</label>
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
            <label className={labelClass}>City preference</label>
            <input
              required
              value={cityPreference}
              onChange={(e) => setCityPreference(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Team size</label>
            <input
              required
              type="number"
              min="1"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Date range</label>
            <input
              placeholder="e.g. Aug 1 – Aug 15"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Budget range per session</label>
            <input
              placeholder="e.g. $200–$400"
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Frequency</label>
          <div className="flex gap-6 text-sm text-white/80">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="frequency"
                checked={frequency === "one-off"}
                onChange={() => setFrequency("one-off")}
                className="h-4 w-4 accent-accent"
              />
              One-off
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="frequency"
                checked={frequency === "recurring"}
                onChange={() => setFrequency("recurring")}
                className="h-4 w-4 accent-accent"
              />
              Recurring
            </label>
          </div>
        </div>

        <div>
          <label className={labelClass}>Must-have amenities</label>
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

        <button
          type="submit"
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:shadow-[0_0_24px_rgba(99,102,241,0.55)]"
        >
          Submit request
        </button>
      </form>
    </div>
  );
}
