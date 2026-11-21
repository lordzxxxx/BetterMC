import { governmentOffices } from "./governmentOffices";

export type SitePageGroup =
  | "Directories & Services"
  | "Governance, Budget & Public Works"
  | "Hearings, Safety & Info";

export type SitePageLink = {
  label: string;
  description: string;
  to: string;
  group: SitePageGroup;
};

export const sitePageGroups: readonly SitePageGroup[] = [
  "Directories & Services",
  "Governance, Budget & Public Works",
  "Hearings, Safety & Info",
];

export const sitePages: SitePageLink[] = [
  {
    label: "Home",
    description: "City overview, weather, and civic directories",
    to: "/",
    group: "Directories & Services",
  },
  {
    label: "City Offices",
    description: `${governmentOffices.length} city offices, personnel, PESO & special bodies`,
    to: "/offices",
    group: "Directories & Services",
  },
  {
    label: "Public services",
    description: "City and national service pathways",
    to: "/services",
    group: "Directories & Services",
  },
  {
    label: "Document guide",
    description: "Requirements and custom checklists",
    to: "/documents",
    group: "Directories & Services",
  },
  {
    label: "Barangays",
    description: "Profiles for all 46 barangays",
    to: "/barangays",
    group: "Directories & Services",
  },
  {
    label: "Education",
    description: "School and learning institution profiles",
    to: "/education",
    group: "Directories & Services",
  },
  {
    label: "Government",
    description: "Officials and published measures",
    to: "/government",
    group: "Governance, Budget & Public Works",
  },
  {
    label: "Legislation",
    description: "Ordinances and executive issuances",
    to: "/legislation",
    group: "Governance, Budget & Public Works",
  },
  {
    label: "Budget",
    description: "Operating actuals, 20% NTA, and HGAB tracker",
    to: "/budget",
    group: "Governance, Budget & Public Works",
  },
  {
    label: "Transparency",
    description: "Full Disclosure Catalog reports (2022–2026)",
    to: "/transparency",
    group: "Governance, Budget & Public Works",
  },
  {
    label: "Procurement",
    description: "BAC records, recordings, bids, and award notices",
    to: "/procurement/livestreams",
    group: "Governance, Budget & Public Works",
  },
  {
    label: "Infrastructure",
    description: "DPWH and city civil-works project awards",
    to: "/procurement/infrastructure-awards",
    group: "Governance, Budget & Public Works",
  },
  {
    label: "Hearings",
    description: "Council sessions and public consultations",
    to: "/hearings",
    group: "Hearings, Safety & Info",
  },
  {
    label: "Emergency contacts",
    description: "24/7 hotlines, BFP, PNP, CDRRMO, and rescue",
    to: "/offices?sector=Public%20Safety%20%26%20Emergency",
    group: "Hearings, Safety & Info",
  },
  {
    label: "Participate",
    description: "Corrections, documents, and feedback",
    to: "/participate",
    group: "Hearings, Safety & Info",
  },
  {
    label: "About",
    description: "Editorial policy and methodology",
    to: "/about",
    group: "Hearings, Safety & Info",
  },
];
