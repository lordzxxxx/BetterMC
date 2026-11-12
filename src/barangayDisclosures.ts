import { type Source } from "./data";
import { infrastructureAwardRecords, type ProcurementAwardRecord } from "./procurementRecords";

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
  {
    label: "COA — Malaybalay City Compliance Audit Report 2025 (city-wide context; not a project register)",
    url: "https://www.coa.gov.ph/wpfd_file/malaybalay-city-compliance-audit-report-2025/",
    verifiedOn: REVIEWED_ON,
  },
  {
    label: "COA — Malaybalay City audit report 2023 (city-wide context; not a project register)",
    url: "https://www.coa.gov.ph/wpfd_file/malaybalay-city-bukidnon/",
    verifiedOn: REVIEWED_ON,
  },
];

const bidResults2025Q3Source: Source = {
  label: "City of Malaybalay — 2025 Q3 Bid Results, Civil Works (FDP Form 10a)",
  url: BID_RESULTS_2025_Q3_URL,
  verifiedOn: REVIEWED_ON,
};

const bidResults2024Q4Source: Source = {
  label: "City of Malaybalay — 2024 Q4 Bid Results, Civil Works (FDP Form 10a)",
  url: BID_RESULTS_2024_Q4_URL,
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
  year: 2024 | 2025 | 2026;
  referenceNumber: string;
  title: string;
  approvedBudget: number;
  winningBidder: string | null;
  status: string;
  source: Source;
};

type PublishedPhilgepsAwardRow = {
  id: string;
  barangaySlug: string;
  barangayName: string;
  record: ProcurementAwardRecord;
};

const philgepsAwardSource = (record: ProcurementAwardRecord): Source => ({
  label: `PhilGEPS award notice — ${record.number}`,
  url: record.sourceUrl,
  verifiedOn: REVIEWED_ON,
});

/*
 * These are award-notice records whose published title names a barangay. A
 * shared project is intentionally shown on each named barangay profile. The
 * source index does not publish a complete contractor, payment, or completion
 * record here, so those fields remain explicitly unavailable.
 */
const publishedPhilgepsAwardRows: PublishedPhilgepsAwardRow[] = [
  { id: "philgeps-itb-2024-012-indalasa", barangaySlug: "indalasa", barangayName: "Indalasa", record: infrastructureAwardRecords[0] },
  { id: "philgeps-itb-2024-009-caburacanan", barangaySlug: "caburacanan", barangayName: "Caburacanan", record: infrastructureAwardRecords[1] },
  { id: "philgeps-itb-2024-004-maligaya", barangaySlug: "maligaya", barangayName: "Maligaya", record: infrastructureAwardRecords[2] },
  { id: "philgeps-itb-2024-010-imbayao", barangaySlug: "imbayao", barangayName: "Imbayao", record: infrastructureAwardRecords[3] },
  { id: "philgeps-itb-2024-059-can-ayan", barangaySlug: "can-ayan", barangayName: "Can-ayan", record: infrastructureAwardRecords[4] },
  { id: "philgeps-itb-2024-034-can-ayan", barangaySlug: "can-ayan", barangayName: "Can-ayan", record: infrastructureAwardRecords[5] },
  { id: "philgeps-itb-2024-058-busdi", barangaySlug: "busdi", barangayName: "Busdi", record: infrastructureAwardRecords[6] },
  { id: "philgeps-itb-2024-030-casisang", barangaySlug: "casisang", barangayName: "Casisang", record: infrastructureAwardRecords[7] },
  { id: "philgeps-itb-2024-030-sumpong", barangaySlug: "sumpong", barangayName: "Sumpong", record: infrastructureAwardRecords[7] },
  { id: "philgeps-itb-2024-020-barangay-1", barangaySlug: "barangay-1", barangayName: "Barangay 1", record: infrastructureAwardRecords[8] },
  { id: "philgeps-itb-2024-023-aglayan", barangaySlug: "aglayan", barangayName: "Aglayan", record: infrastructureAwardRecords[9] },
];

function toPhilgepsAwardDisclosureItem(row: PublishedPhilgepsAwardRow): BarangayDisclosureItem {
  const source = philgepsAwardSource(row.record);
  return {
    id: row.id,
    barangayName: row.barangayName,
    barangaySlug: row.barangaySlug,
    category: "bids",
    subcategory: "PhilGEPS award notice — infrastructure",
    referenceNumber: `PhilGEPS · ${row.record.number}`,
    title: row.record.title,
    period: String(row.record.year),
    approvedBudget: null,
    utilizedAmount: null,
    completionRate: "Not published in the award-notice index",
    status: "Award notice indexed; payment and completion not established",
    implementingOffice: "Contractor and award amount not transcribed from the indexed record",
    contractDuration: "Not published in the indexed record",
    imageUrl: `/images/barangay-heroes/${row.barangaySlug}.webp`,
    badgeUrl: `/images/barangays/${row.barangaySlug}.webp`,
    imageCaption: `${row.barangayName} — PhilGEPS award-notice context`,
    summary: `The indexed PhilGEPS award notice names ${row.barangayName} in “${row.record.title}.” The linked notice must be opened to verify any contractor, award amount, schedule, payment, or completion details; BetterMC does not infer those fields from the title alone, and this index does not establish completion.`,
    discussion: {
      whatThisRecordShows: `This is a source-linked PhilGEPS award notice whose title names ${row.barangayName}. It is an award index entry, not proof that the project was paid for or completed.`,
      budgetAndAuditContext: "The indexed record does not provide a transcribed approved budget, final contract cost, change order, disbursement, or physical accomplishment figure in this portal.",
      howToVerify: "Open the primary PhilGEPS notice, then cross-check the City Full Disclosure portal, later BAC records, notices to proceed, disbursement records, and COA audit materials before treating the work as completed.",
    },
    primarySource: source,
    backupSources: [
      { label: "City of Malaybalay — Full Disclosure portal", url: FDP_HUB_URL, verifiedOn: REVIEWED_ON },
      { label: "City of Malaybalay — Full Disclosure procurement archive", url: "https://sakata.malaybalaycity.gov.ph/awarded-projects/", verifiedOn: REVIEWED_ON },
    ],
  };
}

/*
 * Direct transcriptions from the City’s FDP Form 10a tables. These forms list
 * an approved budget and bidder outcome, but do not establish a notice-to-
 * proceed date, physical accomplishment, variation order, payment, or final
 * audited cost. Those fields deliberately remain unpublished in this portal.
 */
const publishedBidResultRows: PublishedBidResultRow[] = [
  { id: "2024-155-linabo", barangaySlug: "linabo", barangayName: "Linabo", year: 2024, referenceNumber: "2024-155", title: "Construction of multi-purpose hall at Purok 6, Lalawan", approvedBudget: 2_299_662.88, winningBidder: "Johairy Builders", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-144-casisang", barangaySlug: "casisang", barangayName: "Casisang", year: 2024, referenceNumber: "2024-144", title: "Proposed construction of Casisang Central School ALS e-classroom (re-bid)", approvedBudget: 1_497_900, winningBidder: "Doydora Enterprises", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-167-capitan-angel", barangaySlug: "capitan-angel", barangayName: "Capitan Angel", year: 2024, referenceNumber: "2024-167", title: "Construction of flood control (SVP)", approvedBudget: 400_000, winningBidder: "CQ Haribon Construction", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-168-barangay-3", barangaySlug: "barangay-3", barangayName: "Barangay 3", year: 2024, referenceNumber: "2024-168", title: "Construction of concrete perimeter fence (SVP)", approvedBudget: 499_367.09, winningBidder: "Mamawag Construction", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-169-barangay-10", barangaySlug: "barangay-10", barangayName: "Barangay 10", year: 2024, referenceNumber: "2024-169", title: "Repair/rehabilitation of multi-purpose facility", approvedBudget: 499_464.31, winningBidder: "LLV Construction", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-170-barangay-1", barangaySlug: "barangay-1", barangayName: "Barangay 1", year: 2024, referenceNumber: "2024-170", title: "Additional riprapping along Kalawaig Creek (SVP)", approvedBudget: 969_149.65, winningBidder: "Mamawag Construction", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-171-can-ayan", barangaySlug: "can-ayan", barangayName: "Can-ayan", year: 2024, referenceNumber: "2024-171", title: "Construction of school drainage system at Kilap-agan Elementary School (SVP)", approvedBudget: 998_917.55, winningBidder: "DJH Construction & General Merchandise", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-185-simaya", barangaySlug: "simaya", barangayName: "Simaya", year: 2024, referenceNumber: "2024-185", title: "Completion of entrance steel gate, Phase 2, at Purok 2 (SVP)", approvedBudget: 500_000, winningBidder: "J22M Construction Services", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-187-casisang", barangaySlug: "casisang", barangayName: "Casisang", year: 2024, referenceNumber: "2024-187", title: "Construction of CMP main gate (SVP)", approvedBudget: 900_000, winningBidder: "J22M Construction Services", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-188-simaya", barangaySlug: "simaya", barangayName: "Simaya", year: 2024, referenceNumber: "2024-188", title: "Construction of comfort room with water tank at Purok 9 (SVP)", approvedBudget: 495_255.94, winningBidder: "Sandiv Construction Services", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-153-mapulo", barangaySlug: "mapulo", barangayName: "Mapulo", year: 2024, referenceNumber: "2024-153", title: "Establishment of CDRRMO extension operation center for Upper Pulangui District (re-bid)", approvedBudget: 1_799_950.86, winningBidder: null, status: "No bidder listed in the City bid-results row", source: bidResults2024Q4Source },
  { id: "2024-166-barangay-1", barangaySlug: "barangay-1", barangayName: "Barangay 1", year: 2024, referenceNumber: "2024-166", title: "Completion of multi-purpose building (Malaybalay City Health), Phase 4", approvedBudget: 30_000_000, winningBidder: "L & L Construction", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-172-kulaman", barangaySlug: "kulaman", barangayName: "Kulaman", year: 2024, referenceNumber: "2024-172", title: "Improvement of irrigation structure for Binanglasan Irrigators Association", approvedBudget: 1_994_994.06, winningBidder: "SOV Builders and Construction Supply Corporation", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-173-manalog", barangaySlug: "manalog", barangayName: "Manalog", year: 2024, referenceNumber: "2024-173", title: "Construction of multi-purpose commodity shed, Lot 1", approvedBudget: 626_946.12, winningBidder: null, status: "Waiting for Sangguniang Panlungsod resolution", source: bidResults2024Q4Source },
  { id: "2024-174-capitan-angel", barangaySlug: "capitan-angel", barangayName: "Capitan Angel", year: 2024, referenceNumber: "2024-174", title: "Construction of multi-purpose commodity shed, Lot 2", approvedBudget: 633_425.91, winningBidder: null, status: "Waiting for Sangguniang Panlungsod resolution", source: bidResults2024Q4Source },
  { id: "2024-175-san-martin", barangaySlug: "san-martin", barangayName: "San Martin", year: 2024, referenceNumber: "2024-175", title: "Construction of multi-purpose commodity shed, Lot 3", approvedBudget: 603_146.36, winningBidder: null, status: "Waiting for Sangguniang Panlungsod resolution", source: bidResults2024Q4Source },
  { id: "2024-176-miglamin", barangaySlug: "miglamin", barangayName: "Miglamin", year: 2024, referenceNumber: "2024-176", title: "Construction of multi-purpose commodity shed, Lot 4", approvedBudget: 602_855.18, winningBidder: null, status: "Waiting for Sangguniang Panlungsod resolution", source: bidResults2024Q4Source },
  { id: "2024-177-mapayag", barangaySlug: "mapayag", barangayName: "Mapayag", year: 2024, referenceNumber: "2024-177", title: "Riprapping of creeks along road section", approvedBudget: 1_166_172.57, winningBidder: "Mamawag Construction", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-178-simaya", barangaySlug: "simaya", barangayName: "Simaya", year: 2024, referenceNumber: "2024-178", title: "Completion of mini covered court at Binalbagan Elementary School", approvedBudget: 1_439_366.54, winningBidder: "MJTP Construction", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-179-laguitas", barangaySlug: "laguitas", barangayName: "Laguitas", year: 2024, referenceNumber: "2024-179", title: "Repair of footbridge at Sitio Balangbang", approvedBudget: 2_468_486.71, winningBidder: "SOV Builders and Construction Supply Corporation", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-180-mapayag", barangaySlug: "mapayag", barangayName: "Mapayag", year: 2024, referenceNumber: "2024-180", title: "Construction of RCBC at Magsaysay–Mapayag Road, Sitio Tamogawe", approvedBudget: 3_995_168.58, winningBidder: "Mi Amore Construction Services", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-181-patpat", barangaySlug: "patpat", barangayName: "Patpat", year: 2024, referenceNumber: "2024-181", title: "Improvement of stage at Purok 4", approvedBudget: 2_939_007.60, winningBidder: "Mi Amore Construction Services", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-182-sinanglanan", barangaySlug: "sinanglanan", barangayName: "Sinanglanan", year: 2024, referenceNumber: "2024-182", title: "Construction of multi-purpose hall stage and flooring at San Martin–Sinanglanan Elementary School", approvedBudget: 1_944_876.46, winningBidder: "MJTP Construction", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-189-violeta", barangaySlug: "violeta", barangayName: "Violeta", year: 2024, referenceNumber: "2024-189", title: "Construction of day care center at Purok 6", approvedBudget: 1_000_000, winningBidder: "Rysha Enterprises", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-190-apo-macote", barangaySlug: "apo-macote", barangayName: "Apo Macote", year: 2024, referenceNumber: "2024-190", title: "Installation of box culvert in Purok 3", approvedBudget: 3_490_229.43, winningBidder: "Mi Amore Construction Services", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-193-barangay-2", barangaySlug: "barangay-2", barangayName: "Barangay 2", year: 2024, referenceNumber: "2024-193", title: "Construction of multi-purpose building", approvedBudget: 7_500_000, winningBidder: "E & H Construction and Supply", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-195-sinanglanan", barangaySlug: "sinanglanan", barangayName: "Sinanglanan", year: 2024, referenceNumber: "2024-195", title: "Construction of women's and PWD center (SVP)", approvedBudget: 149_995.05, winningBidder: "Sandiv Construction Services", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-196-kalasungay", barangaySlug: "kalasungay", barangayName: "Kalasungay", year: 2024, referenceNumber: "2024-196", title: "Rehabilitation/repair of road from Purok 1, Capt. Anghel to Karang-Karang (SVP)", approvedBudget: 999_962.19, winningBidder: null, status: "Project cancelled in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-198-casisang", barangaySlug: "casisang", barangayName: "Casisang", year: 2024, referenceNumber: "2024-198", title: "Construction of mini covered court multi-purpose hall at Natid-asan Elementary School", approvedBudget: 1_999_545.26, winningBidder: "MJTP Construction", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-199-dalwangan", barangaySlug: "dalwangan", barangayName: "Dalwangan", year: 2024, referenceNumber: "2024-199", title: "Construction of covered court stage at New Ilocos", approvedBudget: 3_373_441.84, winningBidder: null, status: "Bid-result row published; bidder outcome not shown in the source row", source: bidResults2024Q4Source },
  { id: "2024-200-casisang", barangaySlug: "casisang", barangayName: "Casisang", year: 2024, referenceNumber: "2024-200", title: "Construction of CMP multi-purpose building", approvedBudget: 2_100_000, winningBidder: "Khim Construction", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-143-bangcud", barangaySlug: "bangcud", barangayName: "Bangcud", year: 2024, referenceNumber: "2024-143", title: "Road concreting of Purok 3 (re-bid)", approvedBudget: 1_999_700.54, winningBidder: "RBA-ALZ Construction Services", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-152-busdi", barangaySlug: "busdi", barangayName: "Busdi", year: 2024, referenceNumber: "2024-152", title: "Construction of Purok Center at Sitio Nabawang (re-bid)", approvedBudget: 2_499_568.78, winningBidder: "Mi Amore Construction Services", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-205-maligaya", barangaySlug: "maligaya", barangayName: "Maligaya", year: 2024, referenceNumber: "2024-205", title: "Construction of school feeding center kitchen with comfort room at Bagong Silang Elementary School", approvedBudget: 1_500_000, winningBidder: "SOV Builders and Construction Supply Corporation", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-206-barangay-9", barangaySlug: "barangay-9", barangayName: "Barangay 9", year: 2024, referenceNumber: "2024-206", title: "Repair/improvement of veterinary service building", approvedBudget: 2_000_000, winningBidder: "WDC Builders and Supplies", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-207-linabo", barangaySlug: "linabo", barangayName: "Linabo", year: 2024, referenceNumber: "2024-207", title: "Road construction/concreting to Elementary School Paiwaig", approvedBudget: 5_000_000, winningBidder: "RBA-ALZ Construction Services", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-208-capitan-angel", barangaySlug: "capitan-angel", barangayName: "Capitan Angel", year: 2024, referenceNumber: "2024-208", title: "Construction of dirty kitchen, Phase 2 (SVP)", approvedBudget: 600_000, winningBidder: "CQ Haribon Construction", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-209-san-martin", barangaySlug: "san-martin", barangayName: "San Martin", year: 2024, referenceNumber: "2024-209", title: "Construction of drainage canal at Puroks 2, 3 and 4 (SVP)", approvedBudget: 999_999.45, winningBidder: "Xintoy Construction", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-210-maligaya", barangaySlug: "maligaya", barangayName: "Maligaya", year: 2024, referenceNumber: "2024-210", title: "Concreting of Purok road", approvedBudget: 953_437.98, winningBidder: "Z & L Construction and Supplies Corporation", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-211-managok", barangaySlug: "managok", barangayName: "Managok", year: 2024, referenceNumber: "2024-211", title: "Construction of slope protection at Sitio Relis (SVP)", approvedBudget: 557_920.86, winningBidder: "Sandiv Construction Services", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-212-barangay-3", barangaySlug: "barangay-3", barangayName: "Barangay 3", year: 2024, referenceNumber: "2024-212", title: "Construction of covered canal (SVP)", approvedBudget: 199_791.06, winningBidder: "Z & L Construction and Supplies Corporation", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-145-sto-nino", barangaySlug: "sto-nino", barangayName: "Sto. Niño", year: 2024, referenceNumber: "2024-145", title: "Construction of canal lining for Cabugon Irrigators Association (re-bid)", approvedBudget: 1_499_094.19, winningBidder: "Rysha Enterprises", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-197-sinanglanan", barangaySlug: "sinanglanan", barangayName: "Sinanglanan", year: 2024, referenceNumber: "2024-197", title: "Construction of drainage reuse structure and canal lining for SCIA at Purok 4 (re-bid)", approvedBudget: 1_998_234.76, winningBidder: "Xintoy Construction", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-213-san-martin", barangaySlug: "san-martin", barangayName: "San Martin", year: 2024, referenceNumber: "2024-213", title: "Construction of 2-storey multi-purpose building", approvedBudget: 3_987_601.68, winningBidder: "Xintoy Construction", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-214-linabo", barangaySlug: "linabo", barangayName: "Linabo", year: 2024, referenceNumber: "2024-214", title: "Construction of stage at Lalawan Elementary School", approvedBudget: 2_808_305.75, winningBidder: "Xintoy Construction", status: "Winning bidder and bid amount listed in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-216-barangay-6", barangaySlug: "barangay-6", barangayName: "Barangay 6", year: 2024, referenceNumber: "2024-216", title: "Construction of drainage system and pathway", approvedBudget: 5_141_403.26, winningBidder: null, status: "Project cancelled in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-217-manalog", barangaySlug: "manalog", barangayName: "Manalog", year: 2024, referenceNumber: "2024-217", title: "Rehabilitation of farm-to-market road", approvedBudget: 1_991_203.45, winningBidder: null, status: "First failure / no bidder in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-086-casisang", barangaySlug: "casisang", barangayName: "Casisang", year: 2024, referenceNumber: "2024-086", title: "Construction of multi-purpose building, Phase I (re-bid), Purok 17", approvedBudget: 50_000_000, winningBidder: null, status: "Bid-result row published; bidder outcome not shown in the source row", source: bidResults2024Q4Source },
  { id: "2024-220-miglamin", barangaySlug: "miglamin", barangayName: "Miglamin", year: 2024, referenceNumber: "2024-220", title: "Road concreting at Miglamin National High School", approvedBudget: 7_996_920.18, winningBidder: null, status: "Bid-result row published; bidder outcome not shown in the source row", source: bidResults2024Q4Source },
  { id: "2024-221-managok", barangaySlug: "managok", barangayName: "Managok", year: 2024, referenceNumber: "2024-221", title: "Rehabilitation of multi-purpose building, Purok 8", approvedBudget: 2_442_135.14, winningBidder: null, status: "Bid-result row published; bidder outcome not shown in the source row", source: bidResults2024Q4Source },
  { id: "2024-222-managok", barangaySlug: "managok", barangayName: "Managok", year: 2024, referenceNumber: "2024-222", title: "Construction of RCBC at Purok 6", approvedBudget: 3_137_712.35, winningBidder: null, status: "Bid-result row published; bidder outcome not shown in the source row", source: bidResults2024Q4Source },
  { id: "2024-223-dalwangan", barangaySlug: "dalwangan", barangayName: "Dalwangan", year: 2024, referenceNumber: "2024-223", title: "Additional four units of Daraghuyan Tribal Village", approvedBudget: 2_057_617.41, winningBidder: null, status: "Bid-result row published; bidder outcome not shown in the source row", source: bidResults2024Q4Source },
  { id: "2024-225-indalasa", barangaySlug: "indalasa", barangayName: "Indalasa", year: 2024, referenceNumber: "2024-225", title: "Construction of covered court benches, Phase II (SVP)", approvedBudget: 958_797.19, winningBidder: null, status: "Bid-result row published; bidder outcome not shown in the source row", source: bidResults2024Q4Source },
  { id: "2024-226-kulaman", barangaySlug: "kulaman", barangayName: "Kulaman", year: 2024, referenceNumber: "2024-226", title: "Construction of one-unit, one-classroom building, Phase I (SVP)", approvedBudget: 999_861.11, winningBidder: null, status: "Bid-result row published; bidder outcome not shown in the source row", source: bidResults2024Q4Source },
  { id: "2024-227-st-peter", barangaySlug: "st-peter", barangayName: "St. Peter", year: 2024, referenceNumber: "2024-227", title: "Rehabilitation/repair of barangay roads with spillway at Purok 6 (SVP)", approvedBudget: 993_391.55, winningBidder: null, status: "No bidder listed; first and second publication shown in the City form", source: bidResults2024Q4Source },
  { id: "2024-228-sto-nino", barangaySlug: "sto-nino", barangayName: "Sto. Niño", year: 2024, referenceNumber: "2024-228", title: "Construction of box culvert at Purok 4 (SVP)", approvedBudget: 543_173.76, winningBidder: null, status: "Bid-result row published; bidder outcome not shown in the source row", source: bidResults2024Q4Source },
  { id: "2024-229-aglayan", barangaySlug: "aglayan", barangayName: "Aglayan", year: 2024, referenceNumber: "2024-229", title: "Construction of concrete fence at Super Health Center (SVP)", approvedBudget: 930_881.86, winningBidder: null, status: "Bid-result row published; bidder outcome not shown in the source row", source: bidResults2024Q4Source },
  { id: "2024-230-can-ayan", barangaySlug: "can-ayan", barangayName: "Can-ayan", year: 2024, referenceNumber: "2024-230", title: "Construction of river bank lining (SVP), Kilap-agan", approvedBudget: 747_326.48, winningBidder: null, status: "Bid-result row published; bidder outcome not shown in the source row", source: bidResults2024Q4Source },
  { id: "2024-231-managok", barangaySlug: "managok", barangayName: "Managok", year: 2024, referenceNumber: "2024-231", title: "Construction of movable basketball goal at Purok 11 (SVP)", approvedBudget: 221_000, winningBidder: null, status: "No bidder listed; first and second publication shown in the City form", source: bidResults2024Q4Source },
  { id: "2024-232-silae", barangaySlug: "silae", barangayName: "Silae", year: 2024, referenceNumber: "2024-232", title: "Completion of barangay covered court (SVP)", approvedBudget: 1_000_000, winningBidder: null, status: "Bid-result row published; bidder outcome not shown in the source row", source: bidResults2024Q4Source },
  { id: "2024-233-aglayan", barangaySlug: "aglayan", barangayName: "Aglayan", year: 2024, referenceNumber: "2024-233", title: "Concreting of access road for Aglayan National High School", approvedBudget: 1_007_642.36, winningBidder: null, status: "First failure / no bidder in the City bid-results form", source: bidResults2024Q4Source },
  { id: "2024-234-linabo", barangaySlug: "linabo", barangayName: "Linabo", year: 2024, referenceNumber: "2024-234", title: "Construction of new satellite building of barangay health center at Purok 7, Paiwaig (SVP)", approvedBudget: 999_933.24, winningBidder: null, status: "Bid-result row published; bidder outcome not shown in the source row", source: bidResults2024Q4Source },
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
  const period = row.year === 2024 ? "2024 Q4" : row.year === 2025 ? "2025 Q3" : "2026 Q1";
  return {
    id: row.id,
    barangayName: row.barangayName,
    barangaySlug: row.barangaySlug,
    category: "bids",
    subcategory: "City bid result — Civil Works (FDP Form 10a)",
    referenceNumber: `FDP Form 10a · ${row.year} · ${row.referenceNumber}`,
    title: row.title,
    period,
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

const philgepsDisclosureByBarangay = new Map<string, BarangayDisclosureItem[]>();
for (const record of publishedPhilgepsAwardRows) {
  const bucket = philgepsDisclosureByBarangay.get(record.barangaySlug) ?? [];
  bucket.push(toPhilgepsAwardDisclosureItem(record));
  philgepsDisclosureByBarangay.set(record.barangaySlug, bucket);
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
    items: [
      item,
      ...(bidDisclosureByBarangay.get(project.slug) ?? []),
      ...(philgepsDisclosureByBarangay.get(project.slug) ?? []),
    ],
  };
}

export const barangayFullDisclosures = publishedProjects.map(toProfile);

export const barangayDisclosureBySlug = new Map<string, BarangayFullDisclosureProfile>(
  barangayFullDisclosures.map((profile) => [profile.barangaySlug, profile]),
);
