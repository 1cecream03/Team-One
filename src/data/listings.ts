import { HostSubmission } from "../types";

export interface Region {
  key: string;
  label: string;
  neighborhoods: string[];
}

export interface SpaceListing {
  id: string;
  name: string;
  regionKey: string;
  regionLabel: string;
  neighborhood: string;
  capacity: number;
  rate: number;
  vcNetwork: string;
  spaceType: string;
  amenities: string[];
  description: string;
  images: string[];
}

const OFFICE_PHOTO_IDS = [
  "1497366216548-37526070297c",
  "1497366811353-6870744d04b2",
  "1524758631624-e2822e304c36",
  "1497032205916-ac775f0649ae",
  "1554469384-e58fac16e23a",
  "1604328698692-f76ea9498e76",
  "1497215728101-856f4ea42174",
  "1556761175-5973dc0f32e7",
  "1486406146926-c627a92ad1ab",
  "1517502884422-41eaead166d4",
];

function unsplash(photoId: string, width: number, height: number): string {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&q=80`;
}

function imagesFor(index: number): string[] {
  const count = OFFICE_PHOTO_IDS.length;
  return [
    unsplash(OFFICE_PHOTO_IDS[index % count], 1200, 800),
    unsplash(OFFICE_PHOTO_IDS[(index + 3) % count], 600, 400),
    unsplash(OFFICE_PHOTO_IDS[(index + 6) % count], 600, 400),
  ];
}

export const SG_REGIONS: Region[] = [
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

const LISTINGS_BASE: Omit<SpaceListing, "images">[] = [
  { id: "1", name: "The Boardroom @ Tanjong Pagar", regionKey: "central", regionLabel: "Central", neighborhood: "Tanjong Pagar", capacity: 20, rate: 45, vcNetwork: "VC1", spaceType: "Boardroom", amenities: ["Fast Wi-Fi", "A/V equipment", "24/7 access"], description: "A glass-walled boardroom on the 30th floor, built for investor updates and all-hands. Floor-to-ceiling views of the CBD." },
  { id: "2", name: "Raffles Place Sky Suite", regionKey: "central", regionLabel: "Central", neighborhood: "Raffles Place", capacity: 12, rate: 60, vcNetwork: "Sequoia", spaceType: "Private office", amenities: ["Fast Wi-Fi", "Catering kitchen", "Parking"], description: "A private executive suite steps from Raffles Place MRT. Ideal for leadership offsites and investor meetings." },
  { id: "3", name: "Woodlands Collaboration Hub", regionKey: "north", regionLabel: "North", neighborhood: "Woodlands", capacity: 30, rate: 35, vcNetwork: "Accel", spaceType: "Floor", amenities: ["Fast Wi-Fi", "A/V equipment", "Parking"], description: "An open-plan floor with breakout pods, built for cross-team sprints and workshops." },
  { id: "4", name: "Yishun Innovation Floor", regionKey: "north", regionLabel: "North", neighborhood: "Yishun", capacity: 15, rate: 28, vcNetwork: "YC", spaceType: "Floor", amenities: ["Fast Wi-Fi", "24/7 access"], description: "A quiet, dedicated floor for product teams that need focus time away from HQ." },
  { id: "5", name: "Punggol Waterfront Office", regionKey: "north-east", regionLabel: "North-East", neighborhood: "Punggol", capacity: 18, rate: 32, vcNetwork: "General Catalyst", spaceType: "Private office", amenities: ["Fast Wi-Fi", "Catering kitchen"], description: "A bright, waterfront office with an outdoor terrace — popular for half-day strategy sessions." },
  { id: "6", name: "Sengkang Event Loft", regionKey: "north-east", regionLabel: "North-East", neighborhood: "Sengkang", capacity: 50, rate: 70, vcNetwork: "VC2", spaceType: "Event space", amenities: ["A/V equipment", "Catering kitchen", "Parking"], description: "A double-height loft space for demo days, town halls, and portfolio-wide events." },
  { id: "7", name: "Tampines Hub Boardroom", regionKey: "east", regionLabel: "East", neighborhood: "Tampines", capacity: 10, rate: 30, vcNetwork: "VC3", spaceType: "Boardroom", amenities: ["Fast Wi-Fi", "A/V equipment"], description: "A compact boardroom with dual screens, well suited for board meetings and pitch rehearsals." },
  { id: "8", name: "Changi Business Park Floor", regionKey: "east", regionLabel: "East", neighborhood: "Changi", capacity: 40, rate: 55, vcNetwork: "VC4", spaceType: "Floor", amenities: ["Fast Wi-Fi", "Parking", "24/7 access"], description: "A full floor near Changi Business Park with 24/7 access — built for teams running irregular hours." },
  { id: "9", name: "one-north Maker Space", regionKey: "west", regionLabel: "West", neighborhood: "one-north", capacity: 25, rate: 38, vcNetwork: "YC", spaceType: "Floor", amenities: ["Fast Wi-Fi", "A/V equipment", "Catering kitchen"], description: "A hands-on maker space surrounded by one-north's deep tech ecosystem." },
  { id: "10", name: "Jurong Lakeside Office", regionKey: "west", regionLabel: "West", neighborhood: "Jurong", capacity: 22, rate: 33, vcNetwork: "VC5", spaceType: "Private office", amenities: ["Fast Wi-Fi", "Parking"], description: "A calm, lakeside office away from the city centre — good for deep-work weeks." },
];

export const LISTINGS: SpaceListing[] = LISTINGS_BASE.map((listing, index) => ({
  ...listing,
  images: imagesFor(index),
}));

function regionForCity(city: string, neighborhood: string) {
  const query = `${city} ${neighborhood}`.toLowerCase();
  const match = SG_REGIONS.find(
    (region) =>
      query.includes(region.label.toLowerCase()) ||
      region.neighborhoods.some((n) => query.includes(n.toLowerCase())),
  );
  return match ?? SG_REGIONS[0];
}

function hostSubmissionToListing(
  host: HostSubmission,
  index: number,
): SpaceListing {
  const region = regionForCity(host.city, host.neighborhood);
  return {
    id: `host-${host.id}`,
    name: host.company,
    regionKey: region.key,
    regionLabel: region.label,
    neighborhood: host.neighborhood || host.city,
    capacity: host.capacity,
    rate: typeof host.rate === "number" ? host.rate : 40,
    vcNetwork: host.vcNetwork,
    spaceType: host.spaceType,
    amenities: host.amenities,
    description: `Listed by a ${host.vcNetwork} portfolio company. Available ${
      host.availability || "by arrangement"
    }.`,
    images: imagesFor(index),
  };
}

function loadHostListings(): SpaceListing[] {
  const hosts: HostSubmission[] = JSON.parse(
    localStorage.getItem("nexus_hosts") ?? "[]",
  );
  return hosts.map((host, index) =>
    hostSubmissionToListing(host, LISTINGS_BASE.length + index),
  );
}

export function getAllListings(): SpaceListing[] {
  return [...LISTINGS, ...loadHostListings()];
}

export function getListingById(id: string): SpaceListing | undefined {
  return getAllListings().find((listing) => listing.id === id);
}
