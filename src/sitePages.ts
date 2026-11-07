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
  { label: "Procurement", description: "Bidding opportunities and award notices", to: "/procurement/bidding-opportunities" },
  { label: "Barangays", description: "Profiles for all 46 barangays", to: "/barangays" },
  { label: "Public services", description: "City and national service pathways", to: "/services" },
  { label: "Participate", description: "Corrections, documents, and feedback", to: "/participate" },
  { label: "About", description: "Editorial policy and methodology", to: "/about" },
];
