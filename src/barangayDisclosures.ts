import { type Source } from "./data";

export type BarangayDisclosureCategory =
  | "budget"
  | "projects"
  | "bids"
  | "accomplishments";

export type BarangayDisclosureItem = {
  id: string;
  barangayName: string;
  barangaySlug: string;
  category: BarangayDisclosureCategory;
  subcategory: string;
  referenceNumber: string;
  title: string;
  period: string;
  approvedBudget: number | null;
  utilizedAmount: number | null;
  completionRate: string;
  status: string;
  implementingOffice: string;
  contractDuration: string;
  imageUrl: string;
  badgeUrl: string;
  imageCaption: string;
  summary: string;
  discussion: {
    whatThisRecordShows: string;
    budgetAndAuditContext: string;
    howToVerify: string;
  };
  primarySource: Source;
  backupSources: Source[];
};

export type BarangayFullDisclosureProfile = {
  barangayName: string;
  barangaySlug: string;
  /** Directly listed in the City's FDP Form 7, not a calculated barangay NTA. */
  bdp2026Budget: number;
  bdp2026ProjectTitle: string;
  bdp2026Status: string;
  items: BarangayDisclosureItem[];
};

const REVIEWED_ON = "2026-11-12";
const NTA_Q1_URL =
  "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/20-OF-THE-NATIONAL-TAX-ALLOTMENT-UTILIZATION2026-Q1.pdf";
const APP_URL =
  "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/ANNUAL-PROCUREMENT-PLAN-2026.pdf";
const FDP_HUB_URL = "https://sakata.malaybalaycity.gov.ph/full-disclosure/";

const ntaSource: Source = {
  label: "City of Malaybalay — 2026 Q1 20% National Tax Allotment Utilization (FDP Form 7)",
  url: NTA_Q1_URL,
  verifiedOn: REVIEWED_ON,
};

const backupSources: Source[] = [
  {
    label: "City of Malaybalay — 2026 Annual Procurement Plan",
    url: APP_URL,
    verifiedOn: REVIEWED_ON,
  },
  {
    label: "City of Malaybalay — Full Disclosure portal",
    url: FDP_HUB_URL,
    verifiedOn: REVIEWED_ON,
  },
];

type PublishedBarangayProject = {
  name: string;
  slug: string;
  title: string;
  status: string;
  duration?: string;
};

/*
 * Direct transcription of the “Barangay Development Projects” section of the
 * City Government's 2026 Q1 FDP Form 7. Each entry has a ₱1,000,000 published
 * project cost. The source does not publish contractor, award, disbursement,
 * variation, or completion figures for these individual entries.
 */
type PublishedBarangayProjectRow = readonly [
  name: string,
  slug: string,
  title: string,
  status: string,
  duration?: string,
];

const publishedProjectRows: PublishedBarangayProjectRow[] = [
  ["Barangay 1","barangay-1","Construction of Covered Canal","With PR; procurement ongoing","60 calendar days"],
  ["Barangay 2","barangay-2","Improvement of Multi-Purpose Building","With PR; procurement ongoing","30 calendar days"],
  ["Barangay 3","barangay-3","Construction of Multi-Purpose Building, Purok 3","No PR listed"],
  ["Barangay 4","barangay-4","Construction of Multi-Purpose Building","No PR listed"],
  ["Barangay 5","barangay-5","Construction of Drainage Canals","No PR listed"],
  ["Barangay 6","barangay-6","Improvement of Multi-Purpose Building","No PR listed"],
  ["Barangay 7","barangay-7","Construction of Drainage Canal","No PR listed"],
  ["Barangay 8","barangay-8","Improvement of Multi-Purpose Building","No PR listed"],
  ["Barangay 9","barangay-9","Improvement of Multi-Purpose Building","No PR listed"],
  ["Barangay 10","barangay-10","Purchase of Lot for Resettlement Area","No PR listed"],
  ["Barangay 11","barangay-11","Completion of Stage","No PR listed"],
  ["Aglayan","aglayan","Installation of Solar Panel System","With PR; procurement ongoing","45 calendar days"],
  ["Apo Macote","apo-macote","Completion of Lying-in Clinic","No PR listed"],
  ["Bangcud","bangcud","Construction of BDRRMO Building (Additional Fund)","With PR; procurement ongoing","60 calendar days"],
  ["Busdi","busdi","Completion of Tulogan","With PR; procurement ongoing","75 calendar days"],
  ["Cabangahan","cabangahan","Construction of Multi-Purpose Building, Annex II, Phase III","No PR listed"],
  ["Caburacanan","caburacanan","Barangay Road Concreting","With PR; procurement ongoing","75 calendar days"],
  ["Can-ayan","can-ayan","Construction of BPSO Outpost","With PR; procurement ongoing","60 calendar days"],
  ["Capitan Angel","capitan-angel","Improvement of Covered Court","With PR; procurement ongoing","60 calendar days"],
  ["Casisang","casisang","Improvement of Water System","With PR; procurement ongoing","75 calendar days"],
  ["Dalwangan","dalwangan","Construction of Comfort Rooms at Barangay Covered Court","With PR; procurement ongoing","75 calendar days"],
  ["Imbayao","imbayao","Barangay Covered Court Stage","No PR listed"],
  ["Indalasa","indalasa","Improvement of Covered Court","With PR; procurement ongoing","60 calendar days"],
  ["Kalasungay","kalasungay","Rehabilitation/Repair of Multi-Purpose Building","No PR listed"],
  ["Kibalabag","kibalabag","Construction of Health Center, Phase 2","For reversion"],
  ["Kulaman","kulaman","Construction of Health Center, Phase 1","No PR listed"],
  ["Laguitas","laguitas","Improvement of Multi-Purpose Building (BHS), Purok 4","With PR; procurement ongoing","60 calendar days"],
  ["Linabo","linabo","Construction of Box Culvert and Canal Lining","No PR listed"],
  ["Magsaysay","magsaysay","Improvement of Water System","With PR; procurement ongoing","60 calendar days"],
  ["Maligaya","maligaya","Concreting of Road, Puroks 2 and 6","No PR listed"],
  ["Manalog","manalog","Purchase of Rescue Vehicle","No PR listed"],
  ["Managok","managok","Construction of Multi-Purpose Building, Phase II","With PR; procurement ongoing","45 calendar days"],
  ["Mapayag","mapayag","Construction of Slope Protection","No PR listed"],
  ["Mapulo","mapulo","Improvement of Multi-Purpose Building, Upper Barangay Mapulo","With PR; procurement ongoing","90 calendar days"],
  ["Miglamin","miglamin","Construction of Niches at Barangay Cemetery","No PR listed"],
  ["Patpat","patpat","Purchase of Lot for Resettlement Area","No PR listed"],
  ["San Jose","san-jose","Construction of Concrete Perimeter Fence at Health Center","With PR; procurement ongoing","75 calendar days"],
  ["San Martin","san-martin","Improvement of Multi-Purpose Building","With PR; procurement ongoing","45 calendar days"],
  ["Silae","silae","Purchase of Lot for Resettlement Area","No PR listed"],
  ["Simaya","simaya","RCBC, pathways, and Memorial Park comfort-room package","Mixed: reversion, no PR, and procurement ongoing","45 calendar days for the comfort-room component"],
  ["Sinanglanan","sinanglanan","Rehabilitation/Improvement of Water Systems, Puroks 1 and 4","For reversion"],
  ["St. Peter","st-peter","Improvement of Multi-Purpose Building","With PR; procurement ongoing","45 calendar days"],
  ["Sto. Niño","sto-nino","Purchase of Lot for Resettlement Area","No PR listed"],
  ["Sumpong","sumpong","Improvement of Pathway","No PR listed"],
  ["Violeta","violeta","Improvement of Covered Court (Electrical Works with High-Volume Ceiling Fans)","No PR listed"],
  ["Zamboanguita","zamboanguita","Completion of Perimeter Fence at Barangay Plaza","Contracting period","90 calendar days"],
];

const publishedProjects: PublishedBarangayProject[] = publishedProjectRows.map(([
  name,
  slug,
  title,
  status,
  duration,
]) => ({
  name,
  slug,
  title,
  status,
  duration,
}));

function toProfile(project: PublishedBarangayProject): BarangayFullDisclosureProfile {
  const item: BarangayDisclosureItem = {
    id: `${project.slug}-city-bdp-2026-q1`,
    barangayName: project.name,
    barangaySlug: project.slug,
    category: "projects",
    subcategory: "City 20% Development Fund — Barangay Development Projects",
    referenceNumber: `FDP Form 7 · 2026 Q1 · ${project.name}`,
    title: project.title,
    period: "2026 Q1",
    approvedBudget: 1_000_000,
    utilizedAmount: null,
    completionRate: "Not published in the source entry",
    status: project.status,
    implementingOffice: "City Government of Malaybalay (specific implementing office not stated in the entry)",
    contractDuration: project.duration ?? "Not published",
    imageUrl: `/images/barangay-heroes/${project.slug}.webp`,
    badgeUrl: `/images/barangays/${project.slug}.webp`,
    imageCaption: `${project.name} — source-linked public-record context`,
    summary: `The City Government's 2026 Q1 20% National Tax Allotment Utilization Report lists “${project.title}” for ${project.name} with a ₱1,000,000 approved project cost. This program/status entry is not proof of a contract award, disbursement, physical completion, or final cost.`,
    discussion: {
      whatThisRecordShows: `This is the ${project.name} entry in the City's “Barangay Development Projects” section of FDP Form 7 for 2026 Q1. It lists a ₱1,000,000 project cost and the published status: ${project.status}.`,
      budgetAndAuditContext: "This is a city 20% Development Fund utilization record. It does not establish the barangay's complete annual budget, National Tax Allotment share, contractor, award amount, change order, or completion. Those claims require their own published document.",
      howToVerify: "Open the primary FDP Form 7 and search for the barangay name in the “Barangay Development Projects” section. Use the Full Disclosure portal and annual procurement plan to check for later procurement or utilization updates.",
    },
    primarySource: ntaSource,
    backupSources,
  };

  return {
    barangayName: project.name,
    barangaySlug: project.slug,
    bdp2026Budget: 1_000_000,
    bdp2026ProjectTitle: project.title,
    bdp2026Status: project.status,
    items: [item],
  };
}

export const barangayFullDisclosures = publishedProjects.map(toProfile);

export const barangayDisclosureBySlug = new Map<string, BarangayFullDisclosureProfile>(
  barangayFullDisclosures.map((profile) => [profile.barangaySlug, profile]),
);
