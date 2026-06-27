export type SubmissionStatus =
  | "New"
  | "Contacted"
  | "Matched"
  | "Completed"
  | "Rejected";

export const VC_NETWORKS = [
  "VC1",
  "VC2",
  "VC3",
  "VC4",
  "VC5",
  "Other",
] as const;

export const SPACE_TYPES = [
  "Private office",
  "Floor",
  "Boardroom",
  "Event space",
] as const;

export const AMENITIES = [
  "Fast Wi-Fi",
  "A/V equipment",
  "Catering kitchen",
  "Parking",
  "24/7 access",
] as const;

export interface HostSubmission {
  id: string;
  company: string;
  website: string;
  contactName: string;
  contactEmail: string;
  vcNetwork: string;
  city: string;
  neighborhood: string;
  spaceType: string;
  capacity: number;
  availability: string;
  amenities: string[];
  monthlyHours: number;
  rate: number | "suggest";
  status: SubmissionStatus;
  submittedAt: string;
}

export const AUTH_KEY = "nexus_auth";
export const AUTH_CHANGE_EVENT = "nexus-auth-change";

export type UserRole = "host" | "guest";

export interface AuthSession {
  email: string;
  role: UserRole;
}

export interface BookingMessage {
  sender: "guest" | "host";
  text: string;
  at: string;
}

export interface GuestSubmission {
  id: string;
  company: string;
  website: string;
  contactName: string;
  contactEmail: string;
  vcNetwork: string;
  cityPreference: string;
  spaceType: string;
  dateRange: string;
  frequency: "one-off" | "recurring";
  teamSize: number;
  amenities: string[];
  budgetRange: string;
  status: SubmissionStatus;
  submittedAt: string;
  messages?: BookingMessage[];
}
