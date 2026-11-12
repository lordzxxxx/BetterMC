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
  /** A published bid-opening date, not a construction-start date. */
  biddingDate?: string;
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
  historicalSources: Source[];
  items: BarangayDisclosureItem[];
};

const REVIEWED_ON = "2026-11-12";
const NTA_Q1_URL =
  "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/20-OF-THE-NATIONAL-TAX-ALLOTMENT-UTILIZATION2026-Q1.pdf";
const APP_URL =
  "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/ANNUAL-PROCUREMENT-PLAN-2026.pdf";
const FDP_HUB_URL = "https://sakata.malaybalaycity.gov.ph/full-disclosure/";
const BID_RESULTS_2024_Q4_URL =
  "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/BID-RESULTS-ON-CIVIL-WORKS-GOOD-AND-SERVICES-AND-CONSULTING-SERVICES2024-Q4.pdf";
const BID_RESULTS_2025_Q3_URL =
  "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/BID-RESULTS-ON-CIVIL-WORKS-GOOD-AND-SERVICES-AND-CONSULTING-SERVICES2025-Q3.pdf";
const BID_RESULTS_2026_Q1_URL =
  "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/BID-RESULTS-ON-CIVIL-WORKS-GOOD-AND-SERVICES-AND-CONSULTING-SERVICES2026-Q1.pdf";

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

/**
 * Available on every barangay microsite as a historical audit trail. A file is
 * not assigned to a barangay unless its row explicitly names that barangay.
 */
const historicalSources: Source[] = [
  {
    label: "City of Malaybalay — 2023 Annual Procurement Plan",
    url: "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/08/ANNUAL-PROCUREMENT-PLAN-2023.xlsx-APP-2023.pdf",
    verifiedOn: REVIEWED_ON,
  },
  {
    label: "City of Malaybalay — 2024 Q4 Bid Results (FDP Form 10)",
    url: BID_RESULTS_2024_Q4_URL,
    verifiedOn: REVIEWED_ON,
  },
  {
    label: "City of Malaybalay — 2025 Q3 Bid Results (FDP Form 10)",
    url: BID_RESULTS_2025_Q3_URL,
    verifiedOn: REVIEWED_ON,
  },
  {
    label: "City of Malaybalay — 2026 Q1 Bid Results (FDP Form 10)",
    url: BID_RESULTS_2026_Q1_URL,
    verifiedOn: REVIEWED_ON,
  },
];

const bidResults2025Q3Source: Source = {
  label: "City of Malaybalay — 2025 Q3 Bid Results, Civil Works (FDP Form 10a)",
  url: BID_RESULTS_2025_Q3_URL,
  verifiedOn: REVIEWED_ON,
};

const bidResults2026Q1Source: Source = {
  label: "City of Malaybalay — 2026 Q1 Bid Results, Civil Works (FDP Form 10a)",
  url: BID_RESULTS_2026_Q1_URL,
  verifiedOn: REVIEWED_ON,
};

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

type PublishedBidResultRow = {
  id: string;
  barangaySlug: string;
  barangayName: string;
  year: 2025 | 2026;
  referenceNumber: string;
  title: string;
  approvedBudget: number;
  winningBidder: string | null;
  status: string;
  source: Source;
};

/*
 * Direct transcriptions from the City’s FDP Form 10a tables. These forms list
 * an approved budget and bidder outcome, but do not establish a notice-to-
 * proceed date, physical accomplishment, variation order, payment, or final
 * audited cost. Those fields deliberately remain unpublished in this portal.
 */
const publishedBidResultRows: PublishedBidResultRow[] = [
  { id: "2025-112-bangcud", barangaySlug: "bangcud", barangayName: "Bangcud", year: 2025, referenceNumber: "2025-112", title: "Construction of MP Building (SVP)", approvedBudget: 1_000_000, winningBidder: "Enix Engineering Services", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-114-cabangahan", barangaySlug: "cabangahan", barangayName: "Cabangahan", year: 2025, referenceNumber: "2025-114", title: "Construction of 2-storey MP Building, Phase I (SVP)", approvedBudget: 998_237.95, winningBidder: "Enix Engineering Services", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-117-patpat", barangaySlug: "patpat", barangayName: "Patpat", year: 2025, referenceNumber: "2025-117", title: "Barangay road concreting at Purok 1 (SVP)", approvedBudget: 996_323.17, winningBidder: "Trismegistus Construction", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-121-capitan-angel", barangaySlug: "capitan-angel", barangayName: "Capitan Angel", year: 2025, referenceNumber: "2025-121", title: "Improvement of barangay covered court (SVP)", approvedBudget: 999_902.86, winningBidder: "Trismegistus Construction", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-122-kibalabag", barangaySlug: "kibalabag", barangayName: "Kibalabag", year: 2025, referenceNumber: "2025-122", title: "Improvement of tribal hall (SVP)", approvedBudget: 999_986.68, winningBidder: "Trismegistus Construction", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-123-dalwangan", barangaySlug: "dalwangan", barangayName: "Dalwangan", year: 2025, referenceNumber: "2025-123", title: "Construction of Barangay Operation Center, Phase II (SVP)", approvedBudget: 999_958.10, winningBidder: "3Rex Myno Builders' Construction Services", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-124-violeta", barangaySlug: "violeta", barangayName: "Violeta", year: 2025, referenceNumber: "2025-124", title: "Construction of daycare center with fence, Phase II, Purok 6 (SVP)", approvedBudget: 1_000_000, winningBidder: "J22M Construction Services", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-125-casisang", barangaySlug: "casisang", barangayName: "Casisang", year: 2025, referenceNumber: "2025-125", title: "Construction of reservoir with fence at Purok 24 (SVP)", approvedBudget: 1_000_000, winningBidder: "ARMJVJ Construction Services", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-128-laguitas", barangaySlug: "laguitas", barangayName: "Laguitas", year: 2025, referenceNumber: "2025-128", title: "Construction of Laguitas Elementary School stage", approvedBudget: 4_581_627.83, winningBidder: "Khim Construction", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-129-silae", barangaySlug: "silae", barangayName: "Silae", year: 2025, referenceNumber: "2025-129", title: "Construction of MP Building", approvedBudget: 2_500_000, winningBidder: "Trismegistus Construction", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-134-imbayao", barangaySlug: "imbayao", barangayName: "Imbayao", year: 2025, referenceNumber: "2025-134", title: "Improvement of multi-purpose (administration) building (re-bid)", approvedBudget: 3_125_625.79, winningBidder: "Pagadian Aggregates & Marketing", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-137-linabo", barangaySlug: "linabo", barangayName: "Linabo", year: 2025, referenceNumber: "2025-137", title: "Construction of Purok Center at Sitio Cabacungan", approvedBudget: 1_800_000, winningBidder: "Doydora Enterprises", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-138-bangcud", barangaySlug: "bangcud", barangayName: "Bangcud", year: 2025, referenceNumber: "2025-138", title: "Improvement of covered court", approvedBudget: 2_121_487.05, winningBidder: "DomeralD Construction and Supply", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-139-caburacanan", barangaySlug: "caburacanan", barangayName: "Caburacanan", year: 2025, referenceNumber: "2025-139", title: "Construction of IP Tulogan", approvedBudget: 2_000_000, winningBidder: "SOV Builders and Construction Supply Corp.", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-155-sumpong", barangaySlug: "sumpong", barangayName: "Sumpong", year: 2025, referenceNumber: "2025-155", title: "Construction of pathway from Claro M. Recto to Tilanduca Street (SVP)", approvedBudget: 483_000, winningBidder: "Rysha Enterprises", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-170-casisang", barangaySlug: "casisang", barangayName: "Casisang", year: 2025, referenceNumber: "2025-170", title: "Renovation of Malaybalay City Animal Breeding Center (semen processing laboratory)", approvedBudget: 1_997_811.21, winningBidder: "Trivium Construction and Supply Corporation", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2025-173-sumpong", barangaySlug: "sumpong", barangayName: "Sumpong", year: 2025, referenceNumber: "2025-173", title: "Liga Building Extension", approvedBudget: 4_999_988.84, winningBidder: "Trivium Construction and Supply Corporation", status: "Winning bidder listed in the City bid-results form", source: bidResults2025Q3Source },
  { id: "2026-006-zamboanguita", barangaySlug: "zamboanguita", barangayName: "Zamboanguita", year: 2026, referenceNumber: "2026-006", title: "Completion of perimeter fence at barangay plaza (SVP)", approvedBudget: 999_931.89, winningBidder: "Hexus Construction", status: "Winning bidder listed; final award amount not transcribed", source: bidResults2026Q1Source },
  { id: "2026-012-bangcud", barangaySlug: "bangcud", barangayName: "Bangcud", year: 2026, referenceNumber: "2026-012", title: "Concreting of road", approvedBudget: 9_999_566.07, winningBidder: "Mamawag Construction", status: "Winning bidder listed; final award amount not transcribed", source: bidResults2026Q1Source },
  { id: "2026-013-apo-macote", barangaySlug: "apo-macote", barangayName: "Apo Macote", year: 2026, referenceNumber: "2026-013", title: "Concreting of road", approvedBudget: 29_999_989.75, winningBidder: "RRN Construction & Development Corporation", status: "Winning bidder listed; final award amount not transcribed", source: bidResults2026Q1Source },
  { id: "2026-019-dalwangan", barangaySlug: "dalwangan", barangayName: "Dalwangan", year: 2026, referenceNumber: "2026-019", title: "Construction of basketball goal (SVP), Purok Green Valley", approvedBudget: 300_000, winningBidder: "Hexus Construction", status: "Winning bidder listed; final award amount not transcribed", source: bidResults2026Q1Source },
  { id: "2026-037-san-jose", barangaySlug: "san-jose", barangayName: "San Jose", year: 2026, referenceNumber: "2026-037", title: "Construction of concrete perimeter fence at health center (SVP)", approvedBudget: 1_000_000, winningBidder: "Ragambo Corporation", status: "Winning bidder listed; final award amount not transcribed", source: bidResults2026Q1Source },
  { id: "2026-038-capitan-angel", barangaySlug: "capitan-angel", barangayName: "Capitan Angel", year: 2026, referenceNumber: "2026-038", title: "Improvement of covered court (SVP)", approvedBudget: 1_000_000, winningBidder: "Hexus Construction", status: "Winning bidder listed; final award amount not transcribed", source: bidResults2026Q1Source },
  { id: "2026-039-st-peter", barangaySlug: "st-peter", barangayName: "St. Peter", year: 2026, referenceNumber: "2026-039", title: "Improvement of MP Building (SVP)", approvedBudget: 1_000_000, winningBidder: "Hexus Construction", status: "Winning bidder listed; final award amount not transcribed", source: bidResults2026Q1Source },
  { id: "2026-041-cabangahan", barangaySlug: "cabangahan", barangayName: "Cabangahan", year: 2026, referenceNumber: "2026-041", title: "Improvement of drainage system, Purok 7 (SVP)", approvedBudget: 549_532.43, winningBidder: "Maryam Construction", status: "Winning bidder listed; final award amount not transcribed", source: bidResults2026Q1Source },
  { id: "2026-022-kalasungay", barangaySlug: "kalasungay", barangayName: "Kalasungay", year: 2026, referenceNumber: "2026-022", title: "Construction of covered court, Purok 6", approvedBudget: 6_000_000, winningBidder: "Khim Construction", status: "Winning bidder listed; final award amount not transcribed", source: bidResults2026Q1Source },
  { id: "2026-023-magsaysay", barangaySlug: "magsaysay", barangayName: "Magsaysay", year: 2026, referenceNumber: "2026-023", title: "Construction of 1-storey 2-classroom building at Magsaysay Elementary School", approvedBudget: 3_770_000, winningBidder: "ARMJVJ Construction Services", status: "Winning bidder listed; final award amount not transcribed", source: bidResults2026Q1Source },
  { id: "2026-024-laguitas", barangaySlug: "laguitas", barangayName: "Laguitas", year: 2026, referenceNumber: "2026-024", title: "Concreting of road section, Purok 1", approvedBudget: 5_000_000, winningBidder: "Mamawag Construction", status: "Winning bidder listed; final award amount not transcribed", source: bidResults2026Q1Source },
  { id: "2026-026-linabo", barangaySlug: "linabo", barangayName: "Linabo", year: 2026, referenceNumber: "2026-026", title: "Concreting of road section to Flores Village Subdivision", approvedBudget: 6_000_000, winningBidder: "Mamawag Construction", status: "Winning bidder listed; final award amount not transcribed", source: bidResults2026Q1Source },
];

function toBidDisclosureItem(row: PublishedBidResultRow): BarangayDisclosureItem {
  return {
    id: row.id,
    barangayName: row.barangayName,
    barangaySlug: row.barangaySlug,
    category: "bids",
    subcategory: "City bid result — Civil Works (FDP Form 10a)",
    referenceNumber: `FDP Form 10a · ${row.year} · ${row.referenceNumber}`,
    title: row.title,
    period: `${row.year} Q${row.year === 2025 ? "3" : "1"}`,
    approvedBudget: row.approvedBudget,
    utilizedAmount: null,
    completionRate: "Physical accomplishment not published in this bid-results row",
    status: row.status,
    implementingOffice: row.winningBidder ?? "No winning bidder listed",
    contractDuration: "Not transcribed; confirm in the primary source",
    imageUrl: `/images/barangay-heroes/${row.barangaySlug}.webp`,
    badgeUrl: `/images/barangays/${row.barangaySlug}.webp`,
    imageCaption: `${row.barangayName} — source-linked bid-result context`,
    summary: `The City’s ${row.year} bid-results form identifies “${row.title}” in ${row.barangayName} with an approved budget of ₱${row.approvedBudget.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${row.winningBidder ? ` and lists ${row.winningBidder} as the bidder outcome` : ""}. It does not establish a notice-to-proceed date, payment, or physical completion.`,
    discussion: {
      whatThisRecordShows: `This City FDP Form 10a row is a procurement result for ${row.title} in ${row.barangayName}. It publishes the approved budget and the bidder outcome recorded in the City form.`,
      budgetAndAuditContext: "An approved budget is not the final audited cost. A bidder listed in a bid-result report does not, by itself, prove payment, completion, a change order, or a physical accomplishment rate.",
      howToVerify: "Open the City’s primary FDP Form 10a and search the reference number or barangay name. Cross-check any later notice of award, notice to proceed, disbursement, completion, or COA record before treating it as completed work.",
    },
    primarySource: row.source,
    backupSources: [
      {
        label: "City of Malaybalay — Full Disclosure portal",
        url: FDP_HUB_URL,
        verifiedOn: REVIEWED_ON,
      },
      {
        label: "City of Malaybalay — Annual Procurement Plan",
        url: APP_URL,
        verifiedOn: REVIEWED_ON,
      },
    ],
  };
}

const bidDisclosureByBarangay = new Map<string, BarangayDisclosureItem[]>();
for (const record of publishedBidResultRows) {
  const bucket = bidDisclosureByBarangay.get(record.barangaySlug) ?? [];
  bucket.push(toBidDisclosureItem(record));
  bidDisclosureByBarangay.set(record.barangaySlug, bucket);
}

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
    historicalSources,
    items: [item, ...(bidDisclosureByBarangay.get(project.slug) ?? [])],
  };
}

export const barangayFullDisclosures = publishedProjects.map(toProfile);

export const barangayDisclosureBySlug = new Map<string, BarangayFullDisclosureProfile>(
  barangayFullDisclosures.map((profile) => [profile.barangaySlug, profile]),
);
