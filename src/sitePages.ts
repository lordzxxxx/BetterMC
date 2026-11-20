import { governmentOffices } from "./governmentOffices";

export type SitePageLink = {
  label: string;
  description: string;
  to: string;
};

export const sitePages: SitePageLink[] = [
  { label: "Home", description: "City overview, weather, and civic directories", to: "/" },
  { label: "City Offices", description: `${governmentOffices.length} city offices, personnel, PESO & special bodies`, to: "/offices" },
  { label: "Public services", description: "City and national service pathways", to: "/services" },
  { label: "Barangays", description: "Profiles for all 46 barangays", to: "/barangays" },
  { label: "Government", description: "Officials and published measures", to: "/government" },
  { label: "Transparency", description: "Full Disclosure and budget transparency", to: "/transparency" },
  { label: "Procurement", description: "BAC records, recordings, bids, and award notices", to: "/procurement/livestreams" },
  { label: "Education", description: "School and learning institution profiles", to: "/education" },
  { label: "Legislation", description: "Ordinances and executive issuances", to: "/legislation" },
  { label: "Hearings", description: "Council sessions and public consultations", to: "/hearings" },
  { label: "Document guide", description: "Requirements and custom checklists", to: "/documents" },
  { label: "Participate", description: "Corrections, documents, and feedback", to: "/participate" },
  { label: "About", description: "Editorial policy and methodology", to: "/about" },
];
