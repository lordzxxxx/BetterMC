export type SitePageLink = {
  label: string;
  description: string;
  to: string;
};

export const sitePages: SitePageLink[] = [
  { label: "Home", description: "City overview, weather, and key records", to: "/" },
  { label: "Transparency", description: "Full Disclosure and financial records", to: "/transparency" },
  { label: "Government", description: "Officials, offices, records, and hotlines", to: "/government" },
  { label: "Legislation", description: "Ordinances and executive issuances", to: "/legislation" },
  { label: "Hearings", description: "Council sessions and public consultations", to: "/hearings" },
  { label: "Procurement", description: "Bids, awards, reports, and meeting recordings", to: "/procurement/bidding-opportunities" },
  { label: "BAC recordings", description: "Official video and source-linked bid records", to: "/procurement/livestreams" },
  { label: "Barangays", description: "Profiles for all 46 barangays", to: "/barangays" },
  { label: "Education", description: "School and learning institution profiles", to: "/education" },
  { label: "Public services", description: "City and national service pathways", to: "/services" },
  { label: "Document guide", description: "Requirements and custom checklists", to: "/documents" },
  { label: "Participate", description: "Corrections, documents, and feedback", to: "/participate" },
  { label: "About", description: "Editorial policy and methodology", to: "/about" },
];
