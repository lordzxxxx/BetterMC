import type { Source } from "./data";

export const PUBLIC_INFO_REVIEWED_ON = "2026-11-18";

export const OFFICIAL_CITY_FB_URL =
  "https://www.facebook.com/profile.php?id=100063747444247";
export const OFFICIAL_BAC_FB_URL = "https://www.facebook.com/bacmalaybalay";
export const OFFICIAL_BAC_COMMENT_URL =
  "https://www.facebook.com/bacmalaybalay?comment_id=Y29tbWVudDoxNjQxNTA4MTI0NDIwNjUxXzk3OTA3MDEwODE3NTExNg%3D%3D";
export const OFFICIAL_BAC_VIDEO_URL =
  "https://www.facebook.com/100063747444247/videos/bids-and-awards-committee-meeting-18-november-2026/1641508124420651/";
export const BETTERGOV_HEARINGS_URL = "https://budget.bettergov.ph/hearings";
export const BETTERGOV_HGAB_2027_URL =
  "https://budget.bettergov.ph/hgab/2027/overview";

export type NewsCardCategory =
  | "City Announcements"
  | "Resolutions & Ordinances"
  | "Council & Legislative"
  | "Hearings & Sessions"
  | "Procurement & Bidding"
  | "Public Advisories";

export type VerificationTier =
  | "Confirmed Official Record"
  | "Verified Public Announcement"
  | "Reported / Pending Official Copy";

export type NewsletterUpdateCard = {
  id: string;
  title: string;
  description: string;
  publishedDate: string;
  category: NewsCardCategory;
  verificationStatus: VerificationTier;
  sourceAttribution: string;
  sourceUrl: string;
  internalRoute: string;
  secondarySourceUrl?: string;
  secondarySourceLabel?: string;
};

export const newsletterUpdates: NewsletterUpdateCard[] = [
  {
    id: "news-ord-1118-skfa-2026",
    title: "Ordinance No. 1118, s. 2026: Annual SK Functionality Audit Institutionalized",
    description:
      "The 10th Sangguniang Panlungsod enacted Ordinance No. 1118 establishing annual assessment mechanisms, evaluation criteria, incentives, and funding for Sangguniang Kabataan councils across all 46 barangays.",
    publishedDate: "August 18, 2026",
    category: "Resolutions & Ordinances",
    verificationStatus: "Confirmed Official Record",
    sourceAttribution: "City Government of Malaybalay — Public Announcements Archive",
    sourceUrl: "https://sakata.malaybalaycity.gov.ph/ordinance-no-1118-series-of-2026/",
    internalRoute: "/legislation/ordinance-no-1118-series-of-2026",
    secondarySourceUrl: OFFICIAL_CITY_FB_URL,
    secondarySourceLabel: "City Government Facebook Page",
  },
  {
    id: "news-dhsud-local-shelter-plan-2026",
    title: "DHSUD-10 Approves Malaybalay City FY 2026 Local Shelter Plan (LSP)",
    description:
      "Malaybalay City became the first LGU in Northern Mindanao to secure DHSUD-10 approval for a Local Shelter Plan fully aligned with its Comprehensive Land Use Plan (CLUP) and national housing frameworks.",
    publishedDate: "February 2026",
    category: "City Announcements",
    verificationStatus: "Verified Public Announcement",
    sourceAttribution: "Philippine Information Agency (PIA-10) & City Government of Malaybalay",
    sourceUrl: "https://pia.gov.ph/",
    internalRoute: "/budget",
    secondarySourceUrl: OFFICIAL_CITY_FB_URL,
    secondarySourceLabel: "Official LGU Facebook Page",
  },
  {
    id: "news-sp-2027-budget-hearing",
    title: "SP Committee on Finance Conducts Public Hearings on Proposed 2027 Annual Budget",
    description:
      "Committee deliberations at the SP Session Hall brought together council members, department heads, and the secretariat to review executive budget proposals for FY 2027 prior to plenary enactment.",
    publishedDate: "November 2026",
    category: "Hearings & Sessions",
    verificationStatus: "Reported / Pending Official Copy",
    sourceAttribution: "City Government of Malaybalay FB Page & BetterGov.PH Hearings Framework",
    sourceUrl: OFFICIAL_CITY_FB_URL,
    internalRoute: "/hearings",
    secondarySourceUrl: BETTERGOV_HEARINGS_URL,
    secondarySourceLabel: "BetterGov.PH Hearings Reference",
  },
  {
    id: "news-bac-2026-bidding-and-livestreams",
    title: "BAC LGU Malaybalay 2026 Bidding Opportunities & Livestreamed Proceedings",
    description:
      "212 source-linked 2026 Invitations to Bid (up to ITB-2026-206) and Q1/Q2 FDP Form 10a civil-works bid results are indexed alongside BAC LGU Malaybalay livestream documentation.",
    publishedDate: "November 18, 2026",
    category: "Procurement & Bidding",
    verificationStatus: "Confirmed Official Record",
    sourceAttribution: "BAC LGU Malaybalay Portal & Official Facebook Page",
    sourceUrl: "https://sites.google.com/site/malaybalay221/awarded-projects?authuser=0",
    internalRoute: "/procurement/livestreams",
    secondarySourceUrl: OFFICIAL_BAC_FB_URL,
    secondarySourceLabel: "BAC LGU Malaybalay Facebook",
  },
  {
    id: "news-ord-1095-motorela-fare-matrix",
    title: "Ordinance No. 1095, s. 2026: Automatic and 'Pakyaw' Motorela Fare Matrix Amendment",
    description:
      "Updates Section 4 of Ordinance No. 1023, s. 2023 governing the automatic fare matrix and pakyaw fare rules for motorela public utility operations across Malaybalay City.",
    publishedDate: "March 25, 2026",
    category: "Council & Legislative",
    verificationStatus: "Confirmed Official Record",
    sourceAttribution: "10th Sangguniang Panlungsod — Official Publication Archive",
    sourceUrl: "https://sakata.malaybalaycity.gov.ph/ordinance-no-1095-series-of-2026/",
    internalRoute: "/legislation/ordinance-no-1095-series-of-2026",
  },
  {
    id: "news-eo-23-energy-fuel-advisory",
    title: "Executive Order No. 23, s. 2026: City Government Energy-Saving & Fuel-Reduction Advisory",
    description:
      "Directs all city departments and operating units to enforce strict electricity conservation and vehicle fuel-efficiency measures across public facilities.",
    publishedDate: "March 10, 2026",
    category: "Public Advisories",
    verificationStatus: "Confirmed Official Record",
    sourceAttribution: "Office of the City Mayor — Public Announcements",
    sourceUrl: "https://sakata.malaybalaycity.gov.ph/executive-order-no-203/",
    internalRoute: "/legislation/executive-order-no-23-series-of-2026",
    secondarySourceUrl: OFFICIAL_CITY_FB_URL,
    secondarySourceLabel: "Official LGU Facebook Page",
  },
  {
    id: "news-ord-1092-rpt-month",
    title: "Ordinance No. 1092, s. 2026: Adoption of March as Real Property Tax Month",
    description:
      "Adopts Provincial Ordinance No. 2025-013R declaring March of every year as Real Property Tax Month to encourage timely assessment and tax compliance.",
    publishedDate: "May 19, 2026",
    category: "Resolutions & Ordinances",
    verificationStatus: "Confirmed Official Record",
    sourceAttribution: "10th Sangguniang Panlungsod — Official Publication Archive",
    sourceUrl: "https://sakata.malaybalaycity.gov.ph/ordinance-no-1092-series-of-2026/",
    internalRoute: "/legislation/ordinance-no-1092-series-of-2026",
  },
  {
    id: "news-eo-19-pmeis-monitoring",
    title: "PMEIS Project Monitoring & Evaluation System Operationalized",
    description:
      "Establishes the institutional framework for tracking city government project implementation, physical progress, and inter-office accountability under EO 19, s. 2026.",
    publishedDate: "March 4, 2026",
    category: "City Announcements",
    verificationStatus: "Confirmed Official Record",
    sourceAttribution: "Office of the City Mayor — Public Announcements",
    sourceUrl: "https://sakata.malaybalaycity.gov.ph/executive-order-no-19/",
    internalRoute: "/legislation/executive-order-no-19-series-of-2026",
  },
];

export type CivicDiscussionCard = {
  id: string;
  title: string;
  category: string;
  publishedDate: string;
  verificationBadge: VerificationTier;
  background: string;
  keyPoints: string[];
  implications: string;
  verificationNote: string;
  internalRoute: string;
  primarySource: Source;
  supportingSources: Source[];
};

export const civicDiscussionCards: CivicDiscussionCard[] = [
  {
    id: "discussion-bac-livestream-reforms",
    title: "Livestreamed Public Bidding & Procurement Transparency in Malaybalay City",
    category: "Procurement & Open Governance Discussion",
    publishedDate: "Reviewed November 18, 2026",
    verificationBadge: "Confirmed Official Record",
    background:
      "Since mid-2022, the City Government of Malaybalay has mandated the live broadcasting of Bids and Awards Committee (BAC) proceedings on Facebook alongside quarterly publication of FDP Form 10a Bid Results and Google Drive ITB packets.",
    keyPoints: [
      "212 Invitations to Bid for 2026 (up to ITB-2026-206) are publicly indexed with downloadable bidding documents.",
      "2026 Q1 FDP Form 10a confirms winning bidders for major civil works, including Apo Macote road concreting (₱30.0M ABC) and Bangcud road concreting (₱10.0M ABC).",
      "City officials reported ₱361.87M in cumulative procurement savings from mid-2022 through 2025 (₱241.92M in 2022–2024 and ₱119.95M in 2025), which media reports state were reallocated to antivenom supply, mobile clinics, scholarships, and disaster housing.",
    ],
    implications:
      "Residents, competing contractors, and barangay officials can cross-check whether an announced project is still at the Invitation to Bid stage, has a recorded winning bidder in FDP Form 10a, or is awaiting a Sangguniang Panlungsod resolution.",
    verificationNote:
      "Confirmed: FDP Form 10a bid results, 212 ITB notices, and the public BAC meeting video dated 18 November 2026. Reported statement: ₱361.87M cumulative procurement savings figure from PDI/Coverstory.ph. The video's spoken content and timestamps have not been transcribed or reviewed.",
    internalRoute: "/procurement/livestreams",
    primarySource: {
      label: "BAC LGU Malaybalay Official Portal & FDP Form 10a Archive",
      url: "https://sites.google.com/site/malaybalay221/awarded-projects?authuser=0",
      verifiedOn: PUBLIC_INFO_REVIEWED_ON,
    },
    supportingSources: [
      {
        label: "BAC LGU Malaybalay Facebook Page",
        url: OFFICIAL_BAC_FB_URL,
        verifiedOn: PUBLIC_INFO_REVIEWED_ON,
      },
      {
        label: "Philippine Daily Inquirer — Transparency pays for Malaybalay City",
        url: "https://newsinfo.inquirer.net/2172582/transparency-pays-for-malaybalay-city/amp",
        verifiedOn: PUBLIC_INFO_REVIEWED_ON,
      },
    ],
  },
  {
    id: "discussion-budget-2026-2027-alignment",
    title: "Understanding Malaybalay City Budget Allocations vs. National FY 2027 HGAB Proposals",
    category: "Budget & Fiscal Transparency Discussion",
    publishedDate: "Reviewed November 18, 2026",
    verificationBadge: "Confirmed Official Record",
    background:
      "Public infrastructure and services in Malaybalay City draw from two distinct fiscal streams: (1) local City Government funds (Internal Revenue Allotment / NTA share, local business and real property taxes, and 20% Development Fund) and (2) national agency appropriations (DPWH, DepEd, CHED/BukSU, DA, NIA) tracked in the FY 2027 House General Appropriations Bill (HB 10858).",
    keyPoints: [
      "Local Actuals (2025 Q2 SRE): ₱1.380B current operating income and ₱744.88M operating expenditures across General Public Services (₱502.33M), Social Services (₱110.59M), and Economic Services (₱87.15M).",
      "Local Barangay Development (2026 Q1 FDP Form 7): Every one of the 46 barangays is allocated ₱1,000,000.00 (₱46.0M total) under the City's 20% NTA Development Fund.",
      "National Context (BetterGov.PH HGAB 2027): Tracks HB 10858 vs. NEP line items affecting Bukidnon 2nd DEO and Bukidnon State University, while the local SP Finance Committee reviews Malaybalay's Proposed 2027 Annual Budget.",
    ],
    implications:
      "Separating local LGU appropriations from national DPWH or HGAB line items prevents double-counting and clarifies whether the City Engineering Office or DPWH District Engineering Office is accountable for a specific road or multi-purpose building.",
    verificationNote:
      "Confirmed: 2025 Q2 SRE, 2026 Q1 FDP Form 7, and 2026 DPWH Transparency Portal contracts. Proposed / Pending: Local FY 2027 City Appropriation Ordinance and national FY 2027 HGAB bicameral enactment.",
    internalRoute: "/budget",
    primarySource: {
      label: "City of Malaybalay Full Disclosure Portal (2025–2026 Financial Statements)",
      url: "https://sakata.malaybalaycity.gov.ph/full-disclosure/",
      verifiedOn: PUBLIC_INFO_REVIEWED_ON,
    },
    supportingSources: [
      {
        label: "BetterGov.PH — FY 2027 HGAB Overview (HB 10858 vs. NEP)",
        url: BETTERGOV_HGAB_2027_URL,
        verifiedOn: PUBLIC_INFO_REVIEWED_ON,
      },
      {
        label: "DPWH Transparency Portal — Malaybalay City Contracts",
        url: "https://transparency.dpwh.gov.ph/",
        verifiedOn: PUBLIC_INFO_REVIEWED_ON,
      },
    ],
  },
  {
    id: "discussion-sp-legislative-hearings-modernization",
    title: "10th Sangguniang Panlungsod Public Hearings, Fare Matrix Rules, and Barangay Audits",
    category: "Legislative Hearings & Council Discussion",
    publishedDate: "Reviewed November 18, 2026",
    verificationBadge: "Confirmed Official Record",
    background:
      "Presided over by City Vice Mayor Estelito 'Litoy' R. Marabe with SP Secretary Atty. Phoebe Corazon C. Hidalgo, the 10th Sangguniang Panlungsod conducts regular sessions, committee hearings, and mandatory public consultations on regulatory codes, revenue measures, and annual budgets.",
    keyPoints: [
      "Public Transport & Commuter Impact: Ordinance No. 1095, s. 2026 revises the automatic and pakyaw fare matrix rules for motorelas following committee review.",
      "Youth & Barangay Governance: Ordinance No. 1118, s. 2026 institutionalizes an annual SK Functionality Audit across all 46 barangays.",
      "Public Health & Environment: Ordinance No. 1050 (authored by Melchor Maramara and sponsored by Councilor Kathleen Cecille C. Pagaling per PNA) regulates bamboo fencing and structures to eliminate dengue mosquito breeding habitats.",
    ],
    implications:
      "Tracking committee chairmanships and hearing stages allows residents to participate before ordinances reach third and final reading, while preserving strict distinction between collective council acts and individually attributed sponsorship.",
    verificationNote:
      "Confirmed: Published 2026 ordinances in the City archive and PNA/GMA reports on Ordinance No. 1050. Requires verification: Complete session-by-session roll-call votes and signed committee hearing transcripts.",
    internalRoute: "/hearings",
    primarySource: {
      label: "City Government of Malaybalay — Legislative & Public Announcement Archive",
      url: "https://sakata.malaybalaycity.gov.ph/category/public-annoucement/",
      verifiedOn: PUBLIC_INFO_REVIEWED_ON,
    },
    supportingSources: [
      {
        label: "BetterGov.PH — Legislative & Budget Hearings Reference",
        url: BETTERGOV_HEARINGS_URL,
        verifiedOn: PUBLIC_INFO_REVIEWED_ON,
      },
      {
        label: "Official City Government of Malaybalay Facebook Page",
        url: OFFICIAL_CITY_FB_URL,
        verifiedOn: PUBLIC_INFO_REVIEWED_ON,
      },
    ],
  },
];

export type LegislativeHearingRecord = {
  id: string;
  sessionDate: string;
  title: string;
  sessionType:
    | "SP Committee Hearing"
    | "SP Regular Session / Enactment"
    | "Public Consultation & Mandatory Hearing"
    | "BetterGov.PH National Budget Briefing (Bukidnon Context)";
  committeeOrBody: string;
  presidingOrChair: string;
  verificationStatus: VerificationTier;
  agendaItems: string[];
   ordinancesAndResolutions: string[];
  statementsAndDecisions: string;
  verificationNotes: string;
  sourceUrl: string;
  sourceLabel: string;
  recordingOrReferenceUrl?: string;
  recordingOrReferenceLabel?: string;
};

export const legislativeHearingRecords: LegislativeHearingRecord[] = [
  {
    id: "sp-hearing-2027-annual-budget",
    sessionDate: "2026 Q4 (Committee Budget Deliberations)",
    title: "Committee Hearing on the Proposed FY 2027 City Annual Budget",
    sessionType: "SP Committee Hearing",
    committeeOrBody:
      "SP Committee on Finance, Bank Accounts and Appropriations (10th Sangguniang Panlungsod)",
    presidingOrChair:
      "Councilor Brian Nelson T. Flores (Chair, Committee on Finance, Bank Accounts and Appropriations)",
    verificationStatus: "Reported / Pending Official Copy",
    agendaItems: [
      "Department-by-department presentation of proposed FY 2027 operating and capital outlays",
      "Review of local revenue targets, National Tax Allotment (NTA) projections, and statutory reserves (20% Development Fund, 5% LDRRMF, 5% GAD)",
      "Alignment of proposed departmental programs with the approved Annual Investment Program (AIP)",
    ],
    ordinancesAndResolutions: [
      "Proposed FY 2027 General Appropriation Ordinance (Pending plenary enactment and official publication)",
    ],
    statementsAndDecisions:
      "Publicly announced committee hearing held at the SP Session Hall with council members, department heads, and secretariat staff. Serves as the legislative scrutiny stage prior to second and third reading.",
    verificationNotes:
      "Reported via public announcement; exact proposed total appropriation figure and signed Appropriation Ordinance are awaiting official release on the City Full Disclosure portal.",
    sourceUrl: OFFICIAL_CITY_FB_URL,
    sourceLabel: "Official City Government of Malaybalay Facebook Page",
    recordingOrReferenceUrl: "https://sakata.malaybalaycity.gov.ph/full-disclosure/",
    recordingOrReferenceLabel: "City Full Disclosure Portal (Budget Archive)",
  },
  {
    id: "sp-session-ord-1118-sk-audit-2026",
    sessionDate: "August 18, 2026 (Published)",
    title: "10th Sangguniang Panlungsod Enactment of the Annual SK Functionality Audit Ordinance",
    sessionType: "SP Regular Session / Enactment",
    committeeOrBody:
      "10th Sangguniang Panlungsod · Youth and Sports Development / Barangay Affairs",
    presidingOrChair: "City Vice Mayor Estelito “Litoy” R. Marabe (Presiding Officer)",
    verificationStatus: "Confirmed Official Record",
    agendaItems: [
      "Institutionalization of the Annual Sangguniang Kabataan Functionality Audit (SKFA)",
      "Establishment of audit criteria, inter-agency assessment team, and performance incentives",
      "Appropriation of annual operational funding for SK governance evaluation across 46 barangays",
    ],
    ordinancesAndResolutions: ["Ordinance No. 1118, Series of 2026"],
    statementsAndDecisions:
      "Approved and published in the official City Government announcement archive as a collective legislative measure of the 10th Sangguniang Panlungsod.",
    verificationNotes:
      "Confirmed in the official city archive. Individual sponsor/author names are not listed in the public summary page and are therefore not inferred.",
    sourceUrl: "https://sakata.malaybalaycity.gov.ph/ordinance-no-1118-series-of-2026/",
    sourceLabel: "City Government of Malaybalay — Ordinance No. 1118, s. 2026",
  },
  {
    id: "sp-session-ord-1092-rpt-month-2026",
    sessionDate: "May 19, 2026 (Published)",
    title: "Adoption of Provincial Ordinance No. 2025-013R Declaring March as Real Property Tax Month",
    sessionType: "SP Regular Session / Enactment",
    committeeOrBody:
      "10th Sangguniang Panlungsod · Committee on Ways and Means and Economic Enterprise",
    presidingOrChair:
      "City Vice Mayor Estelito “Litoy” R. Marabe · Ways & Means Chair: Councilor Alan Ryann O. Legaspi",
    verificationStatus: "Confirmed Official Record",
    agendaItems: [
      "Local adoption of Provincial Ordinance No. 2025-013R in Malaybalay City",
      "Public information campaign for timely real property tax assessment and payment every March",
      "Funding provisions for tax-awareness initiatives with the City Assessor's and City Treasurer's Offices",
    ],
    ordinancesAndResolutions: ["Ordinance No. 1092, Series of 2026"],
    statementsAndDecisions:
      "Enacted by the 10th Sangguniang Panlungsod to harmonize city real-property tax outreach with provincial guidelines.",
    verificationNotes:
      "Confirmed via the City Government public announcement archive.",
    sourceUrl: "https://sakata.malaybalaycity.gov.ph/ordinance-no-1092-series-of-2026/",
    sourceLabel: "City Government of Malaybalay — Ordinance No. 1092, s. 2026",
  },
  {
    id: "sp-hearing-ord-1095-motorela-fare-2026",
    sessionDate: "March 25, 2026 (Published)",
    title: "Public Hearing & Enactment Amending the Automatic and 'Pakyaw' Motorela Fare Matrix",
    sessionType: "Public Consultation & Mandatory Hearing",
    committeeOrBody:
      "10th Sangguniang Panlungsod · Committee on Transportation, Communications and Traffic",
    presidingOrChair:
      "Transportation Committee Chair: Councilor Rendon P. Sangalang",
    verificationStatus: "Confirmed Official Record",
    agendaItems: [
      "Review of fuel-price triggers under the Automatic Fare Matrix System (Ordinance No. 1023, s. 2023)",
      "Regulation of 'Pakyaw' (contracted ride) rates for motorela operators and commuters",
      "Coordination with the Traffic Management Center (TMC) and local transport associations",
    ],
    ordinancesAndResolutions: [
      "Ordinance No. 1095, Series of 2026 (Amending Section 4 of Ordinance No. 1023, Series of 2023)",
    ],
    statementsAndDecisions:
      "Amended Section 4 of Ordinance No. 1023, s. 2023 to clarify fare matrix adjustments for commuters and motorela drivers across Malaybalay City.",
    verificationNotes:
      "Confirmed in the official City Government announcement archive.",
    sourceUrl: "https://sakata.malaybalaycity.gov.ph/ordinance-no-1095-series-of-2026/",
    sourceLabel: "City Government of Malaybalay — Ordinance No. 1095, s. 2026",
  },
  {
    id: "sp-session-ord-1050-bamboo-dengue-2025",
    sessionDate: "February 2025 (Reported Feb 11 / Feb 14, 2025)",
    title: "Council Deliberation & Enactment Regulating Bamboo Materials to Curb Dengue Cases",
    sessionType: "SP Regular Session / Enactment",
    committeeOrBody:
      "Sangguniang Panlungsod · Committee on Health and Social Welfare Services",
    presidingOrChair:
      "Sponsored by Councilor Kathleen Cecille C. Pagaling (Health Committee Chair); authored by Melchor Maramara (per PNA)",
    verificationStatus: "Verified Public Announcement",
    agendaItems: [
      "Prohibition of uncovered upright bamboo poles in fences, posts, and decorations that collect rainwater",
      "Mandatory boring, splitting, or covering of bamboo segments to eliminate Aedes mosquito breeding sites",
      "Barangay-level inspection and public health information drives with the City Health Office",
    ],
    ordinancesAndResolutions: ["Ordinance No. 1050 (Series of 2025)"],
    statementsAndDecisions:
      "Approved by the City Council as a preventive environmental-health measure against rising dengue cases in Malaybalay City.",
    verificationNotes:
      "PNA reports approval on a Wednesday (published Feb 14, 2025) and names Melchor Maramara as author and Councilor Kathleen Pagaling as sponsor; GMA Regional TV reports Feb 11, 2025. Both dates are preserved pending publication of the signed ordinance PDF.",
    sourceUrl:
      "https://edgedavao.net/latest-news/2025/02/malaybalay-city-regulates-bamboo-use-to-help-curb-dengue-cases/",
    sourceLabel: "Philippine News Agency (via Edge Davao)",
    recordingOrReferenceUrl:
      "https://www.gmanetwork.com/regionaltv/news/106598/malaybalay-to-regulate-use-of-bamboo-to-prevent-dengue/story/",
    recordingOrReferenceLabel: "GMA Regional TV Report",
  },
  {
    id: "bettergov-hearing-da-nia-bukidnon-2027",
    sessionDate: "FY 2027 Budget Briefings (House Committee on Appropriations)",
    title: "BetterGov.PH Budget Hearings: DA, NIA, and DFA Deliberations Referencing Bukidnon",
    sessionType: "BetterGov.PH National Budget Briefing (Bukidnon Context)",
    committeeOrBody:
      "House of Representatives — Committee on Appropriations (Tracked via BetterGov.PH)",
    presidingOrChair: "House Committee on Appropriations Panel & Bukidnon District Representatives",
    verificationStatus: "Confirmed Official Record",
    agendaItems: [
      "Department of Agriculture (DA) & National Irrigation Administration (NIA) FY 2027 budget briefings: scrutiny of irrigation and farm support for Bukidnon given its high per-capita agricultural output",
      "Department of Foreign Affairs (DFA) FY 2027 budget briefing: discussion on requests for consular satellite services in Bukidnon (subject to DBM evaluation)",
      "House Bill Nos. 378 / 9390 (BukSU College of Medicine) & HB 379 / 380 (Bukidnon Regional & Malaybalay Multispecialty Hospitals) legislative tracking",
    ],
    ordinancesAndResolutions: [
      "House Bill No. 10858 (FY 2027 House General Appropriations Bill / HGAB)",
      "House Bill No. 9390 (BukSU College of Medicine — approved on 3rd reading June 2, 2026)",
    ],
    statementsAndDecisions:
      "BetterGov.PH's `/hearings` archive indexes searchable committee transcripts and timestamped video segments from national budget briefings where lawmakers questioned agencies on regional allocations for Bukidnon.",
    verificationNotes:
      "National legislative hearings on BetterGov.PH are distinct from Malaybalay Sangguniang Panlungsod sessions and are presented here as national-level context for Bukidnon and Malaybalay City.",
    sourceUrl: BETTERGOV_HEARINGS_URL,
    sourceLabel: "BetterGov.PH — Budget Briefings & Hearings Archive",
    recordingOrReferenceUrl: "https://www.congress.gov.ph/house-members/view/J033",
    recordingOrReferenceLabel: "House Member Record — Rep. Jonathan Keith T. Flores",
  },
];

export type BacLivestreamDiscussionEntry = {
  id: string;
  referenceCode: string;
  activityType:
    | "Livestreamed Bid Opening & FDP Form 10a Outcome"
    | "Small Value Procurement (SVP) Outcome"
    | "2026 Invitation to Bid (Active Notice)"
    | "Policy & Livestream Archive Record";
  projectName: string;
  participatingAgencyOrBarangay: string;
  identifiedContractorOrBidder: string;
  proposedBudgetAbc: number | null;
  approvedAmountNote: string;
  procurementStatus: string;
  scheduleOrPeriod: string;
  verificationCategory:
    | "Confirmed Official Record"
    | "Video identified / Discussion unreviewed"
    | "Reported Statement / Discussion"
    | "Requires Verification / Platform Restricted";
  sourceUrl: string;
  sourceLabel: string;
  videoUrl?: string;
};

export const bacLivestreamSummary = {
  officialPageUrl: OFFICIAL_BAC_FB_URL,
  referencedCommentUrl: OFFICIAL_BAC_COMMENT_URL,
  verifiedVideoUrl: OFFICIAL_BAC_VIDEO_URL,
  decodedPostId: "1641508124420651",
  decodedCommentId: "979070108175116",
  cityFbLiveHubUrl: OFFICIAL_CITY_FB_URL,
  bacPortalUrl: "https://sites.google.com/site/malaybalay221/awarded-projects?authuser=0",
  docxDownloadPath: "/docs/BAC_LGU_MALAYBALAY_LIVESTREAM_DOCUMENTATION.docx",
  txtDownloadPath: "/docs/BAC_LGU_MALAYBALAY_LIVESTREAM_DOCUMENTATION.txt",
  accessLimitationNotice:
    "The public Facebook post resolves to a BAC meeting video dated 18 November 2026. Playback inside BetterMC depends on Meta's embed availability and the visitor's Facebook access. No reviewed spoken transcript or verified timestamps are available. Confirmed procurement outcomes come from the City's FDP Form 10a tables and BAC ITB index, not from this recording.",
};

export const bacLivestreamEntries: BacLivestreamDiscussionEntry[] = [
  {
    id: "bac-live-1641508124420651",
    referenceCode: "FB-POST-1641508124420651",
    activityType: "Policy & Livestream Archive Record",
    projectName: "Bids and Awards Committee Meeting — 18 November 2026",
    participatingAgencyOrBarangay:
      "Bids and Awards Committee (BAC), BAC Secretariat, Technical Working Group (TWG), and End-User City Departments",
    identifiedContractorOrBidder:
      "Multiple participating bidders across civil works, goods, and services (see confirmed FDP Form 10a rows below)",
    proposedBudgetAbc: null,
    approvedAmountNote:
      "Individual project ABCs and winning bidders are verified via the City's quarterly FDP Form 10a disclosures.",
    procurementStatus:
      "Original public Facebook video located; spoken transcript and meeting outcomes require review",
    scheduleOrPeriod: "18 November 2026 (Facebook video title)",
    verificationCategory: "Video identified / Discussion unreviewed",
    sourceUrl: OFFICIAL_BAC_VIDEO_URL,
    sourceLabel: "City Government of Malaybalay BAC meeting video",
    videoUrl: OFFICIAL_BAC_VIDEO_URL,
  },
  {
    id: "bac-2026-013-apo-macote",
    referenceCode: "FDP-10a-2026-013",
    activityType: "Livestreamed Bid Opening & FDP Form 10a Outcome",
    projectName: "Concreting of Road at Barangay Apo Macote",
    participatingAgencyOrBarangay: "City Engineering Office · Barangay Apo Macote",
    identifiedContractorOrBidder: "RRN Construction & Development Corporation",
    proposedBudgetAbc: 29_999_989.75,
    approvedAmountNote:
      "Winning bidder confirmed in 2026 Q1 FDP Form 10a; exact contract price requires NOA check.",
    procurementStatus: "Winning bidder listed in 2026 Q1 Bid Results (FDP Form 10a)",
    scheduleOrPeriod: "2026 Q1 Reporting Period",
    verificationCategory: "Confirmed Official Record",
    sourceUrl:
      "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/BID-RESULTS-ON-CIVIL-WORKS-GOOD-AND-SERVICES-AND-CONSULTING-SERVICES2026-Q1.pdf",
    sourceLabel: "2026 Q1 FDP Form 10a Bid Results",
  },
  {
    id: "bac-2026-012-bangcud",
    referenceCode: "FDP-10a-2026-012",
    activityType: "Livestreamed Bid Opening & FDP Form 10a Outcome",
    projectName: "Concreting of Road at Barangay Bangcud",
    participatingAgencyOrBarangay: "City Engineering Office · Barangay Bangcud",
    identifiedContractorOrBidder: "Mamawag Construction",
    proposedBudgetAbc: 9_999_566.07,
    approvedAmountNote:
      "Winning bidder confirmed in 2026 Q1 FDP Form 10a; exact contract price requires NOA check.",
    procurementStatus: "Winning bidder listed in 2026 Q1 Bid Results (FDP Form 10a)",
    scheduleOrPeriod: "2026 Q1 Reporting Period",
    verificationCategory: "Confirmed Official Record",
    sourceUrl:
      "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/BID-RESULTS-ON-CIVIL-WORKS-GOOD-AND-SERVICES-AND-CONSULTING-SERVICES2026-Q1.pdf",
    sourceLabel: "2026 Q1 FDP Form 10a Bid Results",
  },
  {
    id: "bac-2026-022-kalasungay",
    referenceCode: "FDP-10a-2026-022",
    activityType: "Livestreamed Bid Opening & FDP Form 10a Outcome",
    projectName: "Construction of Covered Court, Purok 6, Barangay Kalasungay",
    participatingAgencyOrBarangay: "City Engineering Office · Barangay Kalasungay",
    identifiedContractorOrBidder: "Khim Construction",
    proposedBudgetAbc: 6_000_000.0,
    approvedAmountNote:
      "Winning bidder confirmed in 2026 Q1 FDP Form 10a; exact contract price requires NOA check.",
    procurementStatus: "Winning bidder listed in 2026 Q1 Bid Results (FDP Form 10a)",
    scheduleOrPeriod: "2026 Q1 Reporting Period",
    verificationCategory: "Confirmed Official Record",
    sourceUrl:
      "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/BID-RESULTS-ON-CIVIL-WORKS-GOOD-AND-SERVICES-AND-CONSULTING-SERVICES2026-Q1.pdf",
    sourceLabel: "2026 Q1 FDP Form 10a Bid Results",
  },
  {
    id: "bac-2026-026-linabo",
    referenceCode: "FDP-10a-2026-026",
    activityType: "Livestreamed Bid Opening & FDP Form 10a Outcome",
    projectName: "Concreting of Road Section to Flores Village Subdivision, Barangay Linabo",
    participatingAgencyOrBarangay: "City Engineering Office · Barangay Linabo",
    identifiedContractorOrBidder: "Mamawag Construction",
    proposedBudgetAbc: 6_000_000.0,
    approvedAmountNote:
      "Winning bidder confirmed in 2026 Q1 FDP Form 10a; exact contract price requires NOA check.",
    procurementStatus: "Winning bidder listed in 2026 Q1 Bid Results (FDP Form 10a)",
    scheduleOrPeriod: "2026 Q1 Reporting Period",
    verificationCategory: "Confirmed Official Record",
    sourceUrl:
      "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/BID-RESULTS-ON-CIVIL-WORKS-GOOD-AND-SERVICES-AND-CONSULTING-SERVICES2026-Q1.pdf",
    sourceLabel: "2026 Q1 FDP Form 10a Bid Results",
  },
  {
    id: "bac-2026-024-laguitas",
    referenceCode: "FDP-10a-2026-024",
    activityType: "Livestreamed Bid Opening & FDP Form 10a Outcome",
    projectName: "Concreting of Road Section, Purok 1, Barangay Laguitas",
    participatingAgencyOrBarangay: "City Engineering Office · Barangay Laguitas",
    identifiedContractorOrBidder: "Mamawag Construction",
    proposedBudgetAbc: 5_000_000.0,
    approvedAmountNote:
      "Winning bidder confirmed in 2026 Q1 FDP Form 10a; exact contract price requires NOA check.",
    procurementStatus: "Winning bidder listed in 2026 Q1 Bid Results (FDP Form 10a)",
    scheduleOrPeriod: "2026 Q1 Reporting Period",
    verificationCategory: "Confirmed Official Record",
    sourceUrl:
      "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/BID-RESULTS-ON-CIVIL-WORKS-GOOD-AND-SERVICES-AND-CONSULTING-SERVICES2026-Q1.pdf",
    sourceLabel: "2026 Q1 FDP Form 10a Bid Results",
  },
  {
    id: "bac-2026-023-magsaysay",
    referenceCode: "FDP-10a-2026-023",
    activityType: "Livestreamed Bid Opening & FDP Form 10a Outcome",
    projectName:
      "Construction of 1-Storey 2-Classroom Building at Magsaysay Elementary School",
    participatingAgencyOrBarangay:
      "City Engineering Office · DepEd Malaybalay · Barangay Magsaysay",
    identifiedContractorOrBidder: "ARMJVJ Construction Services",
    proposedBudgetAbc: 3_770_000.0,
    approvedAmountNote:
      "Winning bidder confirmed in 2026 Q1 FDP Form 10a; exact contract price requires NOA check.",
    procurementStatus: "Winning bidder listed in 2026 Q1 Bid Results (FDP Form 10a)",
    scheduleOrPeriod: "2026 Q1 Reporting Period",
    verificationCategory: "Confirmed Official Record",
    sourceUrl:
      "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/BID-RESULTS-ON-CIVIL-WORKS-GOOD-AND-SERVICES-AND-CONSULTING-SERVICES2026-Q1.pdf",
    sourceLabel: "2026 Q1 FDP Form 10a Bid Results",
  },
  {
    id: "bac-2026-037-san-jose",
    referenceCode: "FDP-10a-2026-037",
    activityType: "Small Value Procurement (SVP) Outcome",
    projectName: "Construction of Concrete Perimeter Fence at Health Center (SVP)",
    participatingAgencyOrBarangay: "City Health Office · Barangay San Jose",
    identifiedContractorOrBidder: "Ragambo Corporation",
    proposedBudgetAbc: 1_000_000.0,
    approvedAmountNote: "Winning bidder confirmed in 2026 Q1 FDP Form 10a.",
    procurementStatus: "Winning bidder listed in 2026 Q1 Bid Results (FDP Form 10a)",
    scheduleOrPeriod: "2026 Q1 Reporting Period",
    verificationCategory: "Confirmed Official Record",
    sourceUrl:
      "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/BID-RESULTS-ON-CIVIL-WORKS-GOOD-AND-SERVICES-AND-CONSULTING-SERVICES2026-Q1.pdf",
    sourceLabel: "2026 Q1 FDP Form 10a Bid Results",
  },
  {
    id: "bac-itb-2026-206-caburacanan",
    referenceCode: "ITB-2026-206",
    activityType: "2026 Invitation to Bid (Active Notice)",
    projectName:
      "Rehabilitation / Improvement of Water System Level II at Brgy. Caburacanan",
    participatingAgencyOrBarangay: "BAC LGU Malaybalay · Barangay Caburacanan",
    identifiedContractorOrBidder: "Open competitive bidding (ITB stage)",
    proposedBudgetAbc: null,
    approvedAmountNote: "See linked Google Drive ITB packet for ABC and POW schedule.",
    procurementStatus: "Published Invitation to Bid (Bidding opportunity)",
    scheduleOrPeriod: "2026 BAC Bidding Cycle",
    verificationCategory: "Confirmed Official Record",
    sourceUrl:
      "https://drive.google.com/file/d/1_2soiSWKXwMkk9M_-UZmoOYto86Fjzm0/view?usp=drive_link",
    sourceLabel: "BAC 2026 ITB-2026-206 Packet",
  },
  {
    id: "bac-itb-2026-200-excavator",
    referenceCode: "ITB-2026-200",
    activityType: "2026 Invitation to Bid (Active Notice)",
    projectName:
      "Procurement of 1 Unit Brand New Crawler Excavator with Hydraulic Breaker Line",
    participatingAgencyOrBarangay: "CEEDMO-MCGWSS · City Government of Malaybalay",
    identifiedContractorOrBidder: "Open competitive bidding (ITB stage)",
    proposedBudgetAbc: null,
    approvedAmountNote: "See linked Google Drive ITB packet for technical specs and ABC.",
    procurementStatus: "Published Invitation to Bid (Bidding opportunity)",
    scheduleOrPeriod: "2026 BAC Bidding Cycle",
    verificationCategory: "Confirmed Official Record",
    sourceUrl:
      "https://drive.google.com/file/d/1kI5R1D14vPIJC_mn2k5tZXv7ckT6Sf7K/view?usp=drive_link",
    sourceLabel: "BAC 2026 ITB-2026-200 Packet",
  },
];

export type BudgetAllocationItem = {
  id: string;
  fiscalYear: "FY 2025 (Reported Actuals)" | "FY 2026 (Approved / Active)" | "FY 2027 (Proposed / HGAB Reference)";
  scope: "Malaybalay City Government (Local LGU)" | "National Government (BetterGov.PH HGAB / DPWH / SUC)";
  fundingStage:
    | "Reported Actual (2025 Q2 SRE)"
    | "Enacted / Active Disclosure (2026)"
    | "Proposed Local Budget (SP Hearing Stage)"
    | "National HGAB 2027 (HB 10858 vs. NEP)";
  sectorOrDepartment: string;
  programOrProject: string;
  classification:
    | "General Public Services"
    | "Social Services & Health"
    | "Economic & Infrastructure Services"
    | "Education, Culture & Manpower"
    | "20% NTA Development Fund"
    | "Debt Service & Non-Operating";
  amount: number | null;
  amountNote: string;
  sourceLabel: string;
  sourceUrl: string;
};

export const budgetTransparencyAllocations: BudgetAllocationItem[] = [
  {
    id: "budget-2025-gps",
    fiscalYear: "FY 2025 (Reported Actuals)",
    scope: "Malaybalay City Government (Local LGU)",
    fundingStage: "Reported Actual (2025 Q2 SRE)",
    sectorOrDepartment: "General Public Services Sector (Executive, Legislative, Administrative & Public Safety Offices)",
    programOrProject: "Current Operating Expenditures — General Public Services",
    classification: "General Public Services",
    amount: 502_334_483.15,
    amountNote: "67.44% of ₱744.88M total operating expenditures reported in 2025 Q2 SRE.",
    sourceLabel: "2025 Q2 Statement of Receipts and Expenditures",
    sourceUrl:
      "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/STATEMENT-OF-RECEIPTS-AND-EXPENDITURES2025-Q2.pdf",
  },
  {
    id: "budget-2025-social",
    fiscalYear: "FY 2025 (Reported Actuals)",
    scope: "Malaybalay City Government (Local LGU)",
    fundingStage: "Reported Actual (2025 Q2 SRE)",
    sectorOrDepartment: "City Social Welfare and Development Office (CSWDO) & Social Services",
    programOrProject: "Social Services and Social Welfare Operating Programs",
    classification: "Social Services & Health",
    amount: 110_592_955.81,
    amountNote: "14.85% of 2025 Q2 operating expenditures.",
    sourceLabel: "2025 Q2 Statement of Receipts and Expenditures",
    sourceUrl:
      "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/STATEMENT-OF-RECEIPTS-AND-EXPENDITURES2025-Q2.pdf",
  },
  {
    id: "budget-2025-economic",
    fiscalYear: "FY 2025 (Reported Actuals)",
    scope: "Malaybalay City Government (Local LGU)",
    fundingStage: "Reported Actual (2025 Q2 SRE)",
    sectorOrDepartment: "City Engineering, Agriculture, Veterinary, ENRO & Economic Enterprise (CEEDMO)",
    programOrProject: "Economic Services Operating Programs & Local Infrastructure Operations",
    classification: "Economic & Infrastructure Services",
    amount: 87_153_814.08,
    amountNote: "11.70% of 2025 Q2 operating expenditures.",
    sourceLabel: "2025 Q2 Statement of Receipts and Expenditures",
    sourceUrl:
      "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/STATEMENT-OF-RECEIPTS-AND-EXPENDITURES2025-Q2.pdf",
  },
  {
    id: "budget-2025-health",
    fiscalYear: "FY 2025 (Reported Actuals)",
    scope: "Malaybalay City Government (Local LGU)",
    fundingStage: "Reported Actual (2025 Q2 SRE)",
    sectorOrDepartment: "City Health Office (CHO) & City Nutrition Committee",
    programOrProject: "Health, Nutrition, and Population Control Services",
    classification: "Social Services & Health",
    amount: 32_937_811.38,
    amountNote: "4.42% of 2025 Q2 operating expenditures.",
    sourceLabel: "2025 Q2 Statement of Receipts and Expenditures",
    sourceUrl:
      "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/STATEMENT-OF-RECEIPTS-AND-EXPENDITURES2025-Q2.pdf",
  },
  {
    id: "budget-2025-education",
    fiscalYear: "FY 2025 (Reported Actuals)",
    scope: "Malaybalay City Government (Local LGU)",
    fundingStage: "Reported Actual (2025 Q2 SRE)",
    sectorOrDepartment: "Local School Board / Education, Culture, Sports & Manpower Development",
    programOrProject: "Education, Culture, Sports, and Manpower Development Programs",
    classification: "Education, Culture & Manpower",
    amount: 6_871_679.38,
    amountNote: "0.92% of 2025 Q2 operating expenditures (excluding separate SEF utilization reports).",
    sourceLabel: "2025 Q2 Statement of Receipts and Expenditures",
    sourceUrl:
      "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/STATEMENT-OF-RECEIPTS-AND-EXPENDITURES2025-Q2.pdf",
  },
  {
    id: "budget-2025-capital-nonop",
    fiscalYear: "FY 2025 (Reported Actuals)",
    scope: "Malaybalay City Government (Local LGU)",
    fundingStage: "Reported Actual (2025 Q2 SRE)",
    sectorOrDepartment: "City Treasury / Accounting — Non-Operating & Capital Outlays",
    programOrProject: "Capital & Investment Expenditures (₱7.38M), Debt Principal (₱16.02M), and Other Non-Operating (₱57.78M)",
    classification: "Debt Service & Non-Operating",
    amount: 81_170_616.2,
    amountNote: "Combined non-operating expenditures reported in 2025 Q2 SRE.",
    sourceLabel: "2025 Q2 Statement of Receipts and Expenditures",
    sourceUrl:
      "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/STATEMENT-OF-RECEIPTS-AND-EXPENDITURES2025-Q2.pdf",
  },
  {
    id: "budget-2026-nta-barangay-dev",
    fiscalYear: "FY 2026 (Approved / Active)",
    scope: "Malaybalay City Government (Local LGU)",
    fundingStage: "Enacted / Active Disclosure (2026)",
    sectorOrDepartment: "20% National Tax Allotment (NTA) Development Fund — All 46 Barangays",
    programOrProject: "46 Barangay Development Projects (₱1,000,000.00 per barangay for roads, water systems, covered courts, health centers, and resettlement lots)",
    classification: "20% NTA Development Fund",
    amount: 46_000_000.0,
    amountNote: "Directly transcribed from 2026 Q1 FDP Form 7 (46 barangays × ₱1,000,000.00).",
    sourceLabel: "2026 Q1 20% NTA Utilization Report (FDP Form 7)",
    sourceUrl:
      "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/20-OF-THE-NATIONAL-TAX-ALLOTMENT-UTILIZATION2026-Q1.pdf",
  },
  {
    id: "budget-2026-q1-civil-works-bids",
    fiscalYear: "FY 2026 (Approved / Active)",
    scope: "Malaybalay City Government (Local LGU)",
    fundingStage: "Enacted / Active Disclosure (2026)",
    sectorOrDepartment: "City Engineering Office & Bids and Awards Committee",
    programOrProject: "12 Barangay Civil Works & School Building Projects in 2026 Q1 FDP Form 10a (Apo Macote, Bangcud, Kalasungay, Linabo, Laguitas, Magsaysay ES, etc.)",
    classification: "Economic & Infrastructure Services",
    amount: 64_619_020.14,
    amountNote: "Sum of published Approved Budgets for the Contract (ABCs) across the 12 transcribed 2026 Q1 FDP Form 10a rows.",
    sourceLabel: "2026 Q1 Bid Results — Civil Works (FDP Form 10a)",
    sourceUrl:
      "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/BID-RESULTS-ON-CIVIL-WORKS-GOOD-AND-SERVICES-AND-CONSULTING-SERVICES2026-Q1.pdf",
  },
  {
    id: "budget-2026-annual-reports",
    fiscalYear: "FY 2026 (Approved / Active)",
    scope: "Malaybalay City Government (Local LGU)",
    fundingStage: "Enacted / Active Disclosure (2026)",
    sectorOrDepartment: "City Budget Office, City Accounting Office & GAD Focal Point System",
    programOrProject: "2026 Annual Budget Report, 2026 Annual Procurement Plan (APP), 2026 GAD Plan & Budget, and Q1/Q2 Cash Flow, SEF, LDRRMF & Trust Fund Reports",
    classification: "General Public Services",
    amount: null,
    amountNote: "Source-listed PDFs available for direct inspection; BetterMC does not invent line-item totals not transcribed from a single audited statement.",
    sourceLabel: "City of Malaybalay Full Disclosure Catalog (2026)",
    sourceUrl: "https://sakata.malaybalaycity.gov.ph/full-disclosure/",
  },
  {
    id: "budget-2027-local-proposed",
    fiscalYear: "FY 2027 (Proposed / HGAB Reference)",
    scope: "Malaybalay City Government (Local LGU)",
    fundingStage: "Proposed Local Budget (SP Hearing Stage)",
    sectorOrDepartment: "City Budget Office & 10th Sangguniang Panlungsod Committee on Finance",
    programOrProject: "Proposed FY 2027 Malaybalay City Annual Budget (Executive Budget Proposal under SP Committee Deliberation)",
    classification: "General Public Services",
    amount: null,
    amountNote: "Proposed local budget under SP Committee on Finance review; official Appropriation Ordinance and line-item schedules are awaiting City publication.",
    sourceLabel: "Sangguniang Panlungsod Budget Hearing Notice",
    sourceUrl: OFFICIAL_CITY_FB_URL,
  },
  {
    id: "budget-2027-hgab-dpwh-brgy6",
    fiscalYear: "FY 2027 (Proposed / HGAB Reference)",
    scope: "National Government (BetterGov.PH HGAB / DPWH / SUC)",
    fundingStage: "National HGAB 2027 (HB 10858 vs. NEP)",
    sectorOrDepartment: "DPWH Region X — Bukidnon 2nd District Engineering Office (National Budget)",
    programOrProject: "Construction of Multi-Purpose Building, Barangay 6, Malaybalay City, Bukidnon (House Bill No. 10858 / HGAB 2027 Line Item)",
    classification: "Economic & Infrastructure Services",
    amount: 35_000_000.0,
    amountNote: "National HGAB 2027 (HB 10858) infrastructure insertion tracked by BetterGov.PH — NOT a City Government local fund allocation.",
    sourceLabel: "BetterGov.PH — FY 2027 HGAB Overview (HB 10858 vs. NEP)",
    sourceUrl: BETTERGOV_HGAB_2027_URL,
  },
  {
    id: "budget-2027-hgab-buksu-da-nia",
    fiscalYear: "FY 2027 (Proposed / HGAB Reference)",
    scope: "National Government (BetterGov.PH HGAB / DPWH / SUC)",
    fundingStage: "National HGAB 2027 (HB 10858 vs. NEP)",
    sectorOrDepartment: "State Universities and Colleges (Bukidnon State University) & DA / NIA Region X",
    programOrProject: "FY 2027 National Expenditure Program (NEP) vs. House Bill 10858 (HGAB) Allocations for Bukidnon State University & Regional Irrigation/Agriculture",
    classification: "Education, Culture & Manpower",
    amount: null,
    amountNote: "Tracked line-by-line on BetterGov.PH (budget.bettergov.ph/hgab/2027/overview); kept distinct from local Malaybalay City Hall appropriations.",
    sourceLabel: "BetterGov.PH — FY 2027 HGAB Overview",
    sourceUrl: BETTERGOV_HGAB_2027_URL,
  },
];
