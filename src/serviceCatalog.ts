import { VERIFIED_ON, type Source } from "./data";
import { barangayMicrositeBySlug, barangayMicrosites } from "./barangayProfiles";
import { MALAYBALAY_CENTROIDS } from "./malaybalayGisData";

export type ServiceSubcategory = {
  title: string;
  slug: string;
};

export type ServiceTransactionOption = {
  id: string;
  title: string;
  processingTime: string;
  feeSchedule: string;
  requirements: string[];
  steps: string[];
  actionUrl: string;
  actionLabel: string;
};

export type ServiceProviderJurisdiction =
  | "City Government"
  | "Barangay Hall"
  | "National Agency (Malaybalay Branch)"
  | "Regional / Provincial Office";

export type ServiceProvider = {
  id: string;
  categorySlug: string;
  name: string;
  shortName: string;
  jurisdiction: ServiceProviderJurisdiction;
  address: string;
  barangay: string;
  coordinates: [number, number]; // [lat, lng]
  hours: string;
  phone?: string;
  email?: string;
  onlinePortalUrl: string;
  onlinePortalLabel: string;
  epaymentChannel: string;
  transactions: ServiceTransactionOption[];
  source: Source;
};

export type RankedServiceProvider = ServiceProvider & {
  distanceKm: number;
  estimatedDriveMinutes: number;
  googleMapsUrl: string;
  isNearest: boolean;
};

export type ServiceCategory = {
  slug: string;
  title: string;
  summary: string;
  localContext: string;
  primaryProvidersSummary: string;
  subcategories: ServiceSubcategory[];
};

const betterGovUrl = (category: string, subcategory?: string) =>
  `https://bettergov.ph/services?category=${encodeURIComponent(category)}${
    subcategory ? `&subcategory=${encodeURIComponent(subcategory)}` : ""
  }`;

export const betterGovServiceUrl = betterGovUrl;

/**
 * Default Malaybalay City Center coordinates (Rizal Plaza / Fortich St., Brgy. 4).
 */
export const MALAYBALAY_CITY_CENTER_COORDS: [number, number] = [8.1565, 125.1302];

/**
 * Strict URL sanitizer for external service portals to prevent untrusted protocols.
 */
export function sanitizeExternalServiceUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
  } catch {
    // Fall through to safe default
  }
  return "https://sakata.malaybalaycity.gov.ph/citizens-charter/";
}

/**
 * Computes road-adjusted distance in km between two WGS84 [lat, lng] points.
 */
export function computeDistanceKm(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(fromLat)) *
      Math.cos(toRad(toLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;
  // Apply 1.18 road-routing factor for Malaybalay street & Sayre Highway network
  return Number((straightKm * 1.18).toFixed(2));
}

export function estimateTravelMinutes(distanceKm: number): number {
  if (distanceKm <= 0.3) return 2;
  // Average 32 km/h across urban/highway segments + 2 min base
  return Math.max(3, Math.round((distanceKm / 32) * 60 + 2));
}

/**
 * Google Maps place search for a provider. Searching by establishment name and
 * full street address opens the exact listing (building/office pin, address,
 * photos, hours) rather than a bare coordinate.
 */
export function buildGoogleMapsPlaceUrl(name: string, address: string): string {
  const query = encodeURIComponent(`${name}, ${address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getBarangayOriginCoordinates(barangaySlug?: string): {
  coords: [number, number];
  label: string;
} {
  if (!barangaySlug || barangaySlug === "city-center") {
    return {
      coords: MALAYBALAY_CITY_CENTER_COORDS,
      label: "Malaybalay City Proper (Poblacion Center)",
    };
  }
  const profile =
    barangayMicrositeBySlug.get(barangaySlug) ??
    barangayMicrosites.find((item) => item.slug === barangaySlug);
  if (!profile) {
    return {
      coords: MALAYBALAY_CITY_CENTER_COORDS,
      label: "Malaybalay City Proper (Poblacion Center)",
    };
  }
  const centroidLngLat = MALAYBALAY_CENTROIDS[profile.code];
  if (centroidLngLat) {
    return {
      coords: [centroidLngLat[1], centroidLngLat[0]],
      label: `Barangay ${profile.name} (${profile.classification})`,
    };
  }
  return {
    coords: MALAYBALAY_CITY_CENTER_COORDS,
    label: `Barangay ${profile.name}`,
  };
}

export function generateTransactionReference(
  categorySlug: string,
  providerId: string,
  transactionId: string,
): string {
  const prefix = categorySlug.slice(0, 3).toUpperCase();
  const seed = `${providerId}:${transactionId}:${VERIFIED_ON}`;
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const code = Math.abs(hash).toString(36).toUpperCase().slice(0, 6).padEnd(6, "0");
  return `BMC-TX-2026-${prefix}-${code}`;
}

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "business-trade",
    title: "Business and trade",
    summary: "Registration, intellectual-property guidance, and complaint channels.",
    localContext:
      "For a Malaybalay business permit or local compliance requirement, begin with the City Government Citizen’s Charter and Business Permits and Licensing Division (BPLD) at New City Hall. National business name registration, corporation registration, and IP filings connect directly to DTI Bukidnon, SEC eSPARC, and IPOPHL.",
    primaryProvidersSummary: "BPLD New City Hall · DTI Bukidnon · SEC eSPARC",
    subcategories: [
      { title: "Copyright, trademark and patent", slug: "business-copyright-trademark-patent" },
      { title: "Registration, certificates and compliance", slug: "business-registration" },
      { title: "Complaints", slug: "complaints" },
    ],
  },
  {
    slug: "certificates-ids",
    title: "Certificates and IDs",
    summary: "Civil certificates, clearances, and government identification services.",
    localContext:
      "Barangay clearances start with your Barangay Hall. Birth, marriage, and death records are processed at the Malaybalay City Civil Registry Office (CCRO) and PSA Bukidnon CRS Outlet, while NBI and National Police clearances can be booked and paid online before biometric capture in Malaybalay.",
    primaryProvidersSummary: "Barangay Hall · City Civil Registry · PSA · NBI · PNP",
    subcategories: [
      { title: "Certificates", slug: "certificates" },
      { title: "Clearances", slug: "clearances" },
      { title: "Government IDs", slug: "id" },
    ],
  },
  {
    slug: "contributions",
    title: "Contributions",
    summary: "Benefit registration and salary-loan services from national institutions.",
    localContext:
      "Malaybalay hosts branch offices for SSS, Pag-IBIG Fund (HDMF), PhilHealth LHIO, and GSIS along Fortich Street, Sumpong, and Casisang. Members and employers can generate Payment Reference Numbers (PRNs), file salary or calamity loans, and verify contributions online or at the nearest Malaybalay branch.",
    primaryProvidersSummary: "SSS Malaybalay · Pag-IBIG · PhilHealth LHIO · GSIS",
    subcategories: [
      { title: "Benefits registration", slug: "benefits-registration" },
      { title: "Salary loans", slug: "salary-loans" },
    ],
  },
  {
    slug: "disaster-weather",
    title: "Disaster and weather",
    summary: "Hazard information, weather updates, and emergency preparation.",
    localContext:
      "For active emergencies in Malaybalay, contact the 24/7 CDRRMO Emergency Operations Center, BFP Malaybalay, or PNP. For multi-hazard site assessments, flood inundation checks, and fire safety certificates, use UP Project NOAH, DOST HazardHunterPH, PAGASA Malaybalay Station, and BFP FSIS.",
    primaryProvidersSummary: "CDRRMO 24/7 EOC · PAGASA Malaybalay · BFP · Project NOAH",
    subcategories: [
      { title: "Disaster-prone areas", slug: "disaster-prone-areas" },
      { title: "Weather", slug: "weather" },
    ],
  },
  {
    slug: "education",
    title: "Education",
    summary: "Financial assistance, professional services, and research support.",
    localContext:
      "Public school records, learner transfers, and CAV endorsements are handled by DepEd Schools Division of Malaybalay City in Casisang. Higher education admissions, TESDA scholarships, and medical education subsidies are available through Bukidnon State University (BukSU), TESDA Bukidnon, and the City Mayor’s Medical Education Subsidy Committee (EO 17 s. 2026).",
    primaryProvidersSummary: "DepEd Malaybalay · BukSU · TESDA Bukidnon · CHED-10",
    subcategories: [
      { title: "Financial assistance", slug: "financial-assistance" },
      { title: "Professionals", slug: "professionals" },
      { title: "Research and proposals", slug: "research-proposal" },
    ],
  },
  {
    slug: "employment",
    title: "Employment",
    summary: "Professional, salary-loan, and worker-organization services.",
    localContext:
      "Job seekers and employers in Malaybalay can transact with the Public Employment Service Office (PESO) at New City Hall for local job placement, SPES, and TUPAD, DOLE Bukidnon Provincial Field Office for labor standards and worker association registration, PRC LERIS for professional licenses, and CSC Bukidnon for civil service eligibility.",
    primaryProvidersSummary: "PESO Malaybalay · DOLE Bukidnon · PRC LERIS · CSC",
    subcategories: [
      { title: "Professionals", slug: "professionals" },
      { title: "Salary loans", slug: "salary-loans" },
      { title: "Union and association services", slug: "union-association" },
    ],
  },
  {
    slug: "health",
    title: "Health",
    summary: "Assistance, public-health programs, and health research resources.",
    localContext:
      "Primary consultations, dental care, maternal/child immunization, and sanitary/health certificates are provided at the Malaybalay City Health Office (CHO). Hospitalization and one-stop medical financial assistance (DOH MAIP, DSWD, PCSO, PhilHealth) are available at Bukidnon Provincial Medical Center (BPMC) Malasakit Center.",
    primaryProvidersSummary: "City Health Office · BPMC Malasakit Center · PhilHealth",
    subcategories: [
      { title: "Financial assistance", slug: "financial-assistance" },
      { title: "Health programs", slug: "health-programs" },
      { title: "Health research", slug: "health-research" },
    ],
  },
  {
    slug: "housing",
    title: "Housing",
    summary: "Housing finance and land-title information.",
    localContext:
      "Local housing, resettlement, building permits, and zoning clearances are processed at New City Hall through the City Urban Development and Housing Office (CUDHO), Office of the Building Official (OBO), and CPDO. Land title verification and housing loans connect to Registry of Deeds Bukidnon (LRA) and Pag-IBIG Malaybalay.",
    primaryProvidersSummary: "CUDHO & OBO City Hall · Registry of Deeds · Pag-IBIG",
    subcategories: [
      { title: "Housing loans", slug: "housing-loans" },
      { title: "Land titles", slug: "land-titles" },
    ],
  },
  {
    slug: "passport-travel",
    title: "Passport and travel",
    summary: "Travel, visa, citizenship, and passport-related pathways.",
    localContext:
      "Passport appointments and Apostille authentications are booked online through the Department of Foreign Affairs (DFA) with biometric capture at DFA Consular Office Cagayan de Oro (nearest regional consular office) or scheduled Mobile Passport Services in Malaybalay. OFW OEC clearances and travel declarations use DMW/PESO Desk and eTravel.",
    primaryProvidersSummary: "DFA Online & CO CDO · DMW/OFW Desk PESO · BI eTravel",
    subcategories: [
      { title: "Travel", slug: "travel" },
      { title: "Visa and citizenship", slug: "visa-citizenship" },
    ],
  },
  {
    slug: "social-services",
    title: "Social services",
    summary: "Benefits, complaints, assistance, and social-protection pathways.",
    localContext:
      "Malaybalay residents can apply for AICS crisis assistance (medical, burial, educational), Senior Citizen OSCA IDs, PWD IDs, and Solo Parent IDs at the City Social Welfare and Development Office (CSWDO), DSWD SWAD Bukidnon Satellite Office at Capitol Compound, and NCIP Bukidnon for Indigenous Peoples services.",
    primaryProvidersSummary: "CSWDO Malaybalay · DSWD SWAD Bukidnon · NCIP",
    subcategories: [
      { title: "Benefits registration", slug: "benefits-registration" },
      { title: "File complaints", slug: "file-complaints" },
      { title: "Salary loans", slug: "salary-loans" },
    ],
  },
  {
    slug: "tax",
    title: "Tax",
    summary: "Calculators, certificates, registration, and tax-service gateways.",
    localContext:
      "Real Property Tax (RPT), business tax, Community Tax Certificates (Cedula), and tax declarations are transacted at the City Treasurer’s Office and City Assessor’s Office at New City Hall. National TIN registration, eBIRForms, and tax clearances are handled by BIR Revenue District Office No. 99 (RDO 99 Malaybalay City).",
    primaryProvidersSummary: "City Treasurer & Assessor · BIR RDO 99 Malaybalay",
    subcategories: [
      { title: "Calculators", slug: "calculator" },
      { title: "Certificates", slug: "certificates" },
      { title: "Registration", slug: "register" },
    ],
  },
  {
    slug: "transport-driving",
    title: "Transport and driving",
    summary: "Licensing, assistance, and transport-complaint channels.",
    localContext:
      "Student permits, driver’s license renewals, and motor vehicle registrations are transacted through the LTO LTMS Portal and LTO Malaybalay District Office. Local motorela franchises, fare matrix compliance (Ordinance No. 1095 s. 2026), and traffic clearances are handled by the Malaybalay Traffic Management Center (TMC) and Sangguniang Panlungsod.",
    primaryProvidersSummary: "LTO Malaybalay District Office · TMC Malaybalay · LTFRB-10",
    subcategories: [
      { title: "Financial assistance", slug: "financial-assistance" },
      { title: "Licences", slug: "license" },
      { title: "Transport complaints", slug: "transport-complaints" },
    ],
  },
];

export const VERIFIED_SERVICE_PROVIDERS: ServiceProvider[] = [
  // 1. BUSINESS AND TRADE
  {
    id: "bpld-malaybalay",
    categorySlug: "business-trade",
    name: "Business Permits and Licensing Division (BPLD) — City of Malaybalay",
    shortName: "BPLD Malaybalay",
    jurisdiction: "City Government",
    address: "Ground Floor, New City Hall, Sayre Highway, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: [8.1282, 125.1342],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM (No Noon Break · RA 11032)",
    phone: "0926-833-0696",
    email: "malaybalaycitylicensing@gmail.com",
    onlinePortalUrl: "https://sakata.malaybalaycity.gov.ph/citizens-charter/",
    onlinePortalLabel: "Open Malaybalay Citizen’s Charter & BPLD Guide",
    epaymentChannel: "City Treasurer’s Office Cashier (New City Hall BOS-One-Stop-Shop) / LandBank Official Receipt",
    transactions: [
      {
        id: "new-business-permit",
        title: "New Business Permit & Mayor’s Permit Registration",
        processingTime: "1–2 working days (BOSS One-Stop-Shop · RA 11032)",
        feeSchedule: "Based on declared capital investment + regulatory inspection fees (Malaybalay Revenue Code)",
        requirements: [
          "DTI Business Name Certificate (Sole Proprietorship) or SEC/CDA Registration",
          "Barangay Business Clearance from the barangay where the business is located",
          "Contract of Lease (if rented) or Tax Declaration / Land Title (if owned)",
          "Occupancy Permit (OBO) & Fire Safety Inspection Certificate (BFP Malaybalay)",
          "Sanitary Permit / Health Certificate from Malaybalay City Health Office",
        ],
        steps: [
          "Submit unified application form with DTI/SEC registration and Barangay Business Clearance at the BPLD One-Stop-Shop window.",
          "Receive joint regulatory assessment (Zoning, Sanitary, Building, Fire Safety, and City Treasurer tax order of payment).",
          "Pay assessed fees at the City Treasurer’s Cashier window and claim your Official Receipt, Mayor’s Permit, and Business Plate.",
        ],
        actionUrl: "https://sakata.malaybalaycity.gov.ph/citizens-charter/",
        actionLabel: "Open BPLD Charter & Requirements",
      },
      {
        id: "business-permit-renewal",
        title: "Annual Business Permit Renewal & Retirement of Business",
        processingTime: "Same day (2–4 hours during January BOSS renewal period)",
        feeSchedule: "Graduated business tax based on prior-year gross sales/receipts",
        requirements: [
          "Sworn declaration of prior-year gross sales/receipts or BIR Audited Financial Statements / ITR",
          "Previous year’s Mayor’s Permit and Official Receipt",
          "Updated Barangay Business Clearance",
          "BFP Fire Safety Inspection Certificate (FSIC) & CHO Sanitary Permit renewal",
        ],
        steps: [
          "Present gross receipts declaration for tax assessment at BPLD / City Treasurer’s assessment desk.",
          "Settle local business tax and regulatory fees at the City Treasurer’s Office.",
          "Claim renewed Mayor’s Business Permit and updated validation sticker.",
        ],
        actionUrl: "https://sakata.malaybalaycity.gov.ph/transaction-protocol-manual/",
        actionLabel: "Open Transaction Protocol Manual",
      },
    ],
    source: {
      label: "City Government of Malaybalay — Contact Directory & Citizen’s Charter",
      url: "https://sakata.malaybalaycity.gov.ph/citizens-charter/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "dti-bukidnon",
    categorySlug: "business-trade",
    name: "Department of Trade and Industry (DTI) — Bukidnon Provincial Office & Negosyo Center Malaybalay",
    shortName: "DTI Bukidnon",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "2F Manuel Building, San Isidro Street, Barangay 5 (Poblacion), Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 5",
    coordinates: [8.1568, 125.1282],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "(088) 813-2101",
    email: "r10.bukidnon@dti.gov.ph",
    onlinePortalUrl: "https://bnrs.dti.gov.ph/registration",
    onlinePortalLabel: "Register Business Name on DTI BNRS Portal",
    epaymentChannel: "DTI BNRS Online Payment (GCash / Maya / LandBank Link.BizPortal / Credit-Debit) within 7 calendar days",
    transactions: [
      {
        id: "dti-bnrs",
        title: "Sole Proprietorship Business Name Registration (BNRS)",
        processingTime: "15–30 minutes online (Instant Certificate download after e-payment)",
        feeSchedule: "₱200 (Barangay scope) · ₱500 (City/Municipality) · ₱1,000 (Regional) · ₱2,000 (National) + ₱30 DST",
        requirements: [
          "Valid government-issued ID of the Filipino business owner (18+ years old)",
          "3 proposed Business Name options and territorial scope selection",
          "Philippine Standard Industrial Classification (PSIC) dominant business activity",
          "Active email address and mobile number for OTP and digital certificate delivery",
        ],
        steps: [
          "Check name availability and complete the online registration form on the official DTI BNRS NextGen portal.",
          "Pay the registration fee + ₱30 Documentary Stamp Tax via GCash, Maya, LandBank, or at the DTI Malaybalay Negosyo Center.",
          "Download and print your official Certificate of Business Name Registration with QR verification.",
        ],
        actionUrl: "https://bnrs.dti.gov.ph/registration",
        actionLabel: "Start DTI BNRS Registration",
      },
      {
        id: "dti-consumer-complaint",
        title: "Consumer Protection Complaint & Mediation (DTI PODRS) / BMBE Registration",
        processingTime: "Within 3–7 working days for mediation notice",
        feeSchedule: "₱0.00 (Free Consumer Complaint Filing & BMBE Certificate of Authority)",
        requirements: [
          "Official Receipt, sales invoice, warranty card, or transaction screenshot",
          "Written summary of consumer complaint or defective product/service issue",
          "Name and address of the respondent establishment",
        ],
        steps: [
          "Log in to the DTI Philippine Online Dispute Resolution System (PODRS) or visit DTI Bukidnon Provincial Office.",
          "Upload proof of transaction and select preferred mediation schedule.",
          "Attend online or in-person conciliation conference facilitated by DTI Bukidnon.",
        ],
        actionUrl: "https://podrs.dti.gov.ph/",
        actionLabel: "File Complaint on DTI PODRS",
      },
    ],
    source: {
      label: "DTI Business Name Registration System (BNRS) & Region X Directory",
      url: "https://bnrs.dti.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "sec-ipophl-gateway",
    categorySlug: "business-trade",
    name: "SEC eSPARC (CDO Extension Office) & IPOPHL Intellectual Property e-Filing",
    shortName: "SEC & IPOPHL Online",
    jurisdiction: "Regional / Provincial Office",
    address: "SEC Bldg., 14th & Tomas Saco Sts., Macasandig, Cagayan de Oro City (Serving Bukidnon via eSPARC Online)",
    barangay: "Casisang",
    coordinates: [8.4675, 124.6485],
    hours: "24/7 Online Portal · Mon–Fri 8:00 AM – 5:00 PM Office",
    phone: "(088) 857-4325",
    email: "sec_cdoeo@sec.gov.ph",
    onlinePortalUrl: "https://esparc.sec.gov.ph/",
    onlinePortalLabel: "Open SEC eSPARC Corporation Registration",
    epaymentChannel: "SEC eSPAYSEC Portal (LandBank / Maya / Credit-Debit / Over-the-Counter LandBank Malaybalay)",
    transactions: [
      {
        id: "sec-esparc",
        title: "One Person Corporation (OPC), Stock & Non-Stock Association Registration",
        processingTime: "1–3 working days via SEC eSPARC Regular/OneSEC",
        feeSchedule: "1/5 of 1% of authorized capital stock (minimum ₱2,000) + Legal Research Fee",
        requirements: [
          "Proposed corporate/association name verified via SEC eSPARC",
          "Articles of Incorporation, By-Laws, and Treasurer-in-Trust details",
          "TIN of incorporators, directors, trustees, and officers",
        ],
        steps: [
          "Submit corporate name verification and incorporation details on SEC eSPARC.",
          "Pay assessed registration fees through eSPAYSEC or LandBank Malaybalay branch.",
          "Download the digital Certificate of Incorporation and proceed to BIR RDO 99 & BPLD Malaybalay.",
        ],
        actionUrl: "https://esparc.sec.gov.ph/",
        actionLabel: "Open SEC eSPARC Portal",
      },
      {
        id: "ipophl-tm",
        title: "Trademark, Patent & Copyright Online Application (IPOPHL eTMfile)",
        processingTime: "Same-day filing acknowledgment; substantive examination per IPOPHL schedule",
        feeSchedule: "₱1,200 per class (Small Entity) / ₱2,592 (Big Entity) for Trademark e-Filing",
        requirements: [
          "JPEG representation of the brand logo or word mark",
          "List of goods/services under the Nice Classification",
          "Applicant identity and MSME/Youth/Inventor fee-reduction declaration",
        ],
        steps: [
          "Search the IPOPHL Global Brand Database to confirm mark distinctiveness.",
          "Upload mark details on IPOPHL eTMfile / ePatentfile and pay via Dragonpay/LandBank.",
          "Coordinate with DTI Bukidnon IP Desk in Malaybalay for MSME fee-waiver assistance.",
        ],
        actionUrl: "https://www.ipophil.gov.ph/online-filing/",
        actionLabel: "Open IPOPHL Online Filing",
      },
    ],
    source: {
      label: "Securities and Exchange Commission (eSPARC) & IPOPHL Official Portal",
      url: "https://esparc.sec.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },

  // 2. CERTIFICATES AND IDS
  {
    id: "ccro-malaybalay",
    categorySlug: "certificates-ids",
    name: "City Civil Registry Office (CCRO) — City of Malaybalay",
    shortName: "City Civil Registry",
    jurisdiction: "City Government",
    address: "Ground Floor, New City Hall, Sayre Highway, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: [8.1281, 125.134],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "0906-616-4009",
    email: "malaybalayccro@gmail.com",
    onlinePortalUrl: "https://sakata.malaybalaycity.gov.ph/citizens-charter/",
    onlinePortalLabel: "Open Civil Registry Citizen’s Charter",
    epaymentChannel: "City Treasurer’s Office Cashier (New City Hall)",
    transactions: [
      {
        id: "local-civil-registry-copy",
        title: "Certified True Copy / Timely & Late Registration of Birth, Marriage, or Death",
        processingTime: "15–30 minutes (Certified Copy) · 10-day posting for Late Registration",
        feeSchedule: "₱50.00–₱150.00 local registry fee (₱0.00 for First-Time Jobseekers under RA 11261)",
        requirements: [
          "Valid government ID of the document owner or authorized immediate family member",
          "Signed Authorization Letter + valid ID if requested by a representative",
          "For Late Birth Registration: PSA Negative Result, Baptismal/School/Voter record, and 2 disinterested witnesses’ affidavit",
        ],
        steps: [
          "Present valid ID and fill out the Civil Registry verification slip at CCRO Window 1.",
          "Pay the certification or registration fee at the City Treasurer’s Office cashier.",
          "Present the Official Receipt at the CCRO releasing window to claim the signed Certified True Copy.",
        ],
        actionUrl: "https://sakata.malaybalaycity.gov.ph/citizens-charter/",
        actionLabel: "View CCRO Charter Standards",
      },
      {
        id: "marriage-license",
        title: "Application for Marriage License & RA 9048 / RA 10172 Clerical Error Correction",
        processingTime: "10 consecutive days statutory publication period (Family Code)",
        feeSchedule: "₱250.00–₱350.00 Marriage License & Family Planning Seminar fee",
        requirements: [
          "PSA Birth Certificates and CENOMAR (Certificate of No Marriage) of both applicants",
          "Parental Consent (ages 18–20) or Parental Advice (ages 21–24)",
          "Certificate of Attendance in Pre-Marriage Counseling (CSWDO / CHO / PopCom Malaybalay)",
          "Community Tax Certificate (Cedula) and 1x1 / 2x2 ID photos",
        ],
        steps: [
          "Submit accomplished Marriage License application and CENOMAR at CCRO Malaybalay.",
          "Attend the scheduled Pre-Marriage Orientation and Counseling session.",
          "Claim the Marriage License after the mandatory 10-day posting period.",
        ],
        actionUrl: "https://sakata.malaybalaycity.gov.ph/contact-us/",
        actionLabel: "Contact CCRO Malaybalay",
      },
    ],
    source: {
      label: "City Government of Malaybalay — City Civil Registry Office",
      url: "https://sakata.malaybalaycity.gov.ph/contact-us/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "psa-bukidnon",
    categorySlug: "certificates-ids",
    name: "Philippine Statistics Authority (PSA) — Bukidnon Provincial Statistical Office & PhilSys Registration Center",
    shortName: "PSA Bukidnon & PhilSys",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Fortich Street (near Sumpong / Barangay 7 junction), Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 7",
    coordinates: [8.1605, 125.1255],
    hours: "Mon–Fri · 7:30 AM – 4:30 PM",
    phone: "(088) 813-4484",
    email: "bukidnon@psa.gov.ph",
    onlinePortalUrl: "https://psahelpline.ph/",
    onlinePortalLabel: "Order PSA Certificates Online (PSAHelpline)",
    epaymentChannel: "PSA Outlet Cashier / PSAHelpline Online (GCash, Maya, 7-Eleven, Bayad, Credit/Debit)",
    transactions: [
      {
        id: "psa-birth-marriage-cenomar",
        title: "PSA Birth, Marriage, Death Certificate & CENOMAR (SECPA Copy)",
        processingTime: "Same-day walk-in appointment or 3–5 working days door-to-door delivery",
        feeSchedule: "₱155.00 walk-in CRS outlet / ₱365.00 online delivery (₱0.00 walk-in with RA 11261 Barangay Certification)",
        requirements: [
          "PSA CRS Online Appointment Slip (for walk-in) or PSAHelpline reference number",
          "At least 1 valid government-issued ID matching the document owner or immediate relative",
          "Barangay First-Time Jobseeker Certification (if availing RA 11261 free issuance)",
        ],
        steps: [
          "Book an online delivery order on PSAHelpline.ph or schedule a CRS outlet appointment.",
          "Complete payment online or at the PSA cashier window.",
          "Receive the security-paper (SECPA) certificate with QR verification.",
        ],
        actionUrl: "https://psahelpline.ph/",
        actionLabel: "Transact on PSAHelpline.ph",
      },
      {
        id: "philsys-national-id",
        title: "Digital National ID (ePhilID) Download & PhilSys Verification",
        processingTime: "Instant online download via National ID portal",
        feeSchedule: "₱0.00 (Free by law under Republic Act No. 11055)",
        requirements: [
          "Full Name, Date of Birth, or 29-digit PhilSys Transaction Reference Number (TRN)",
          "Smartphone or webcam for live facial authentication",
        ],
        steps: [
          "Open the official National ID digital portal (national-id.gov.ph).",
          "Enter demographic details and complete live face verification.",
          "Download your official Digital National ID PDF (honored in all government and bank transactions).",
        ],
        actionUrl: "https://national-id.gov.ph/",
        actionLabel: "Download Digital National ID",
      },
    ],
    source: {
      label: "Philippine Statistics Authority (PSA) RSSO X & PhilSys Portal",
      url: "https://rsso10.psa.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "nbi-malaybalay",
    categorySlug: "certificates-ids",
    name: "National Bureau of Investigation (NBI) — Bukidnon District Office (Malaybalay)",
    shortName: "NBI Malaybalay",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Provincial Capitol Compound, Barangay 9, Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 9",
    coordinates: [8.1518, 125.1336],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "(088) 813-3618",
    onlinePortalUrl: "https://clearance.nbi.gov.ph/",
    onlinePortalLabel: "Book NBI Clearance Appointment & e-Pay",
    epaymentChannel: "NBI Online e-Payment (GCash, Maya, Bayad Center, 7-Eleven, LandBank) — No cash accepted at biometric window",
    transactions: [
      {
        id: "nbi-clearance",
        title: "Multi-Purpose NBI Clearance (New Application & Renewal)",
        processingTime: "15–30 minutes biometric capture (Same-day release if no 'Hit'; 5–8 working days if 'With Hit')",
        feeSchedule: "₱130.00 + ₱30.00 e-payment system fee (₱0.00 Free for First-Time Jobseekers under RA 11261)",
        requirements: [
          "Online NBI Clearance Reference Number and paid appointment confirmation",
          "2 original valid government-issued IDs (National ID, Passport, Driver’s License, Voter’s ID/Cert, UMID, or PSA Birth Certificate)",
          "Original Barangay Certification & Oath of Undertaking (if claiming RA 11261 First-Time Jobseeker free clearance)",
        ],
        steps: [
          "Register an account at clearance.nbi.gov.ph, select NBI Bukidnon / Malaybalay branch, and generate a reference number.",
          "Pay the ₱160 total via GCash, Maya, or 7-Eleven (or select First-Time Jobseeker free option).",
          "Proceed to NBI Bukidnon at Capitol Compound on your appointment date for photo, fingerprint biometrics, and printing.",
        ],
        actionUrl: "https://clearance.nbi.gov.ph/",
        actionLabel: "Open NBI Clearance Portal",
      },
    ],
    source: {
      label: "National Bureau of Investigation (NBI) Online Clearance System",
      url: "https://clearance.nbi.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "pnp-malaybalay-clearance",
    categorySlug: "certificates-ids",
    name: "Malaybalay City Police Station — National Police Clearance System (NPCS)",
    shortName: "PNP Malaybalay Clearance",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Fortich Street, Barangay 2 (Poblacion), Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 2",
    coordinates: [8.1558, 125.1303],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM (24/7 Police Desk)",
    phone: "0926-821-8803",
    email: "malaybalay.cps.pnp@gmail.com",
    onlinePortalUrl: "https://pnpclearance.ph/",
    onlinePortalLabel: "Book National Police Clearance Online",
    epaymentChannel: "LandBank Link.BizPortal / GCash / Maya via pnpclearance.ph",
    transactions: [
      {
        id: "national-police-clearance",
        title: "National Police Clearance (NPCS Biometric Issuance)",
        processingTime: "15–20 minutes after online appointment and payment",
        feeSchedule: "₱150.00 + e-payment fee (₱0.00 Free for First-Time Jobseekers under RA 11261)",
        requirements: [
          "NPCS Online Appointment Reference Number",
          "2 valid government-issued IDs (or 1 primary ID + Barangay Clearance & Birth Certificate)",
        ],
        steps: [
          "Register at pnpclearance.ph and book an appointment at Malaybalay City Police Station.",
          "Complete payment via LandBank Link.BizPortal / GCash.",
          "Visit Malaybalay CPS on Fortich Street for photo, signature, fingerprint capture, and immediate clearance release.",
        ],
        actionUrl: "https://pnpclearance.ph/",
        actionLabel: "Open PNP Clearance Portal",
      },
    ],
    source: {
      label: "PNP National Police Clearance System & Malaybalay CPS Directory",
      url: "https://pnpclearance.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },

  // 3. CONTRIBUTIONS
  {
    id: "sss-malaybalay",
    categorySlug: "contributions",
    name: "Social Security System (SSS) — Malaybalay Branch",
    shortName: "SSS Malaybalay",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "2F Tubeo Building, Fortich Street, Barangay 4 (Poblacion), Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 4",
    coordinates: [8.1564, 125.1294],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "(088) 813-2475",
    email: "malaybalay@sss.gov.ph",
    onlinePortalUrl: "https://member.sss.gov.ph/",
    onlinePortalLabel: "Log in to My.SSS Member & Loan Portal",
    epaymentChannel: "My.SSS PRN via GCash, Maya, UnionBank, LandBank, Bayad Center, or Accredited Banks",
    transactions: [
      {
        id: "sss-prn-membership",
        title: "SS Number Issuance, Member Data Change & Contribution PRN Generation",
        processingTime: "Instant online PRN generation · 1–2 working days document verification",
        feeSchedule: "₱0.00 registration fee; monthly contribution per SSS contribution schedule",
        requirements: [
          "PSA Birth Certificate or Philippine Passport / National ID",
          "Active email address and mobile number for My.SSS portal activation",
        ],
        steps: [
          "Apply for an SS Number or log in to My.SSS at member.sss.gov.ph.",
          "Generate a Payment Reference Number (PRN) forEmployed, Self-Employed, Voluntary, or OFW contributions.",
          "Pay using the PRN via GCash, Maya, or accredited payment partners for real-time posting.",
        ],
        actionUrl: "https://member.sss.gov.ph/",
        actionLabel: "Open My.SSS Portal",
      },
      {
        id: "sss-salary-calamity-loan",
        title: "SSS Salary Loan, Calamity Loan & Maternity/Sickness Benefit Claim",
        processingTime: "1–3 working days credit to enrolled Disbursement Account (DAEM)",
        feeSchedule: "No filing fee (10% p.a. diminishing interest on salary loans)",
        requirements: [
          "At least 36 posted monthly contributions (6 within the last 12 months for 1-month salary loan)",
          "Enrolled and approved bank account or e-wallet in SSS Disbursement Account Enrollment Module (DAEM)",
        ],
        steps: [
          "Enroll your bank account or e-wallet under Services > Disbursement Account Enrollment in My.SSS.",
          "Submit the Salary Loan or Benefit claim online under the E-Services tab.",
          "Receive loan proceeds directly in your enrolled account upon employer/SSS certification.",
        ],
        actionUrl: "https://member.sss.gov.ph/",
        actionLabel: "Apply for SSS Loan Online",
      },
    ],
    source: {
      label: "Social Security System (SSS) Official Portal & Branch Directory",
      url: "https://www.sss.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "pagibig-malaybalay",
    categorySlug: "contributions",
    name: "Pag-IBIG Fund (HDMF) — Malaybalay Branch",
    shortName: "Pag-IBIG Malaybalay",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Tubeo Building, Sayre Highway, Barangay Sumpong, Malaybalay City, 8700 Bukidnon",
    barangay: "Sumpong",
    coordinates: [8.1618, 125.1242],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "(088) 813-4821",
    email: "malaybalay@pagibigfund.gov.ph",
    onlinePortalUrl: "https://www.pagibigfundservices.com/virtualpagibig/",
    onlinePortalLabel: "Open Virtual Pag-IBIG Portal",
    epaymentChannel: "Virtual Pag-IBIG Online Payment (GCash, Maya, Credit/Debit, LandBank) or Pag-IBIG Malaybalay Cashier",
    transactions: [
      {
        id: "pagibig-mid-mp2",
        title: "Pag-IBIG MID Registration, Regular Savings & MP2 Modified Pag-IBIG II",
        processingTime: "Instant online MID / MP2 account number issuance",
        feeSchedule: "₱200 minimum monthly Regular Savings · ₱500 minimum per MP2 remittance",
        requirements: [
          "1 valid government-issued ID",
          "Pag-IBIG MID Number (can be generated online in 5 minutes)",
        ],
        steps: [
          "Open Virtual Pag-IBIG and select 'Be a Member' or 'Apply for & Manage MP2 Savings'.",
          "Save your 12-digit MID or MP2 Account Number.",
          "Remit savings online via Virtual Pag-IBIG or over the counter at Pag-IBIG Malaybalay Branch in Sumpong.",
        ],
        actionUrl: "https://www.pagibigfundservices.com/virtualpagibig/",
        actionLabel: "Open Virtual Pag-IBIG",
      },
      {
        id: "pagibig-mpl",
        title: "Pag-IBIG Multi-Purpose Loan (MPL) & Calamity Loan",
        processingTime: "1–3 working days credit to Loyalty Card Plus or accredited bank",
        feeSchedule: "No processing fee; up to 80% of total Pag-IBIG Regular Savings",
        requirements: [
          "At least 24 monthly membership savings (1 contribution within the last 6 months)",
          "Pag-IBIG Loyalty Card Plus or active LandBank/DBP/UCPB disbursement card",
          "Selfie photo holding valid ID and loan application form",
        ],
        steps: [
          "Apply via Virtual Pag-IBIG > Apply for and Manage Loans > Multi-Purpose Loan.",
          "Have your employer certify the application online (or self-certify if individual payor).",
          "Receive loan proceeds on your Loyalty Card Plus.",
        ],
        actionUrl: "https://www.pagibigfundservices.com/virtualpagibig/",
        actionLabel: "Apply for Pag-IBIG Loan",
      },
    ],
    source: {
      label: "Pag-IBIG Fund (HDMF) Virtual Pag-IBIG & Mindanao Branches",
      url: "https://www.pagibigfund.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "philhealth-malaybalay",
    categorySlug: "contributions",
    name: "PhilHealth — Local Health Insurance Office (LHIO) Malaybalay",
    shortName: "PhilHealth LHIO Malaybalay",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "2F Estrada Building, Fortich Street, Barangay 3 (Poblacion), Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 3",
    coordinates: [8.1552, 125.1298],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "(088) 813-3724",
    email: "lhiomalaybalay.pro10@philhealth.gov.ph",
    onlinePortalUrl: "https://memberinquiry.philhealth.gov.ph/member/",
    onlinePortalLabel: "Open PhilHealth Member Portal",
    epaymentChannel: "PhilHealth Member Portal Online Payment (Maya / GCash / LandBank) & LHIO Malaybalay Cashier",
    transactions: [
      {
        id: "philhealth-mdr-id",
        title: "PhilHealth Member Data Record (MDR), Dependent Update & PhilHealth ID",
        processingTime: "10–20 minutes at LHIO Malaybalay · Instant MDR download online",
        feeSchedule: "₱0.00 (Free MDR, PhilHealth ID card, and Konsulta registration)",
        requirements: [
          "Accomplished PhilHealth Member Registration Form (PMRF)",
          "PSA Birth Certificate / Marriage Certificate for adding legal dependents",
          "1 valid government-issued ID",
        ],
        steps: [
          "Log in to the PhilHealth Member Portal to download your MDR and pay contributions online, or visit LHIO Malaybalay on Fortich Street.",
          "Register your preferred PhilHealth Konsulta primary care provider in Malaybalay (e.g., CHO Malaybalay or BPMC).",
        ],
        actionUrl: "https://memberinquiry.philhealth.gov.ph/member/",
        actionLabel: "Open PhilHealth Member Portal",
      },
    ],
    source: {
      label: "PhilHealth PRO X Directory & Member Portal",
      url: "https://www.philhealth.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "gsis-malaybalay",
    categorySlug: "contributions",
    name: "Government Service Insurance System (GSIS) — Malaybalay Branch Office",
    shortName: "GSIS Malaybalay",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Onda Building, Sayre Highway, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: [8.1335, 125.1328],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "(088) 813-4511",
    email: "gsismalaybalay@gsis.gov.ph",
    onlinePortalUrl: "https://egsismo.gsis.gov.ph/",
    onlinePortalLabel: "Open GSIS eGSISMO / GSIS Touch",
    epaymentChannel: "Agency Remittance / LandBank / UnionBank / GSIS Touch App",
    transactions: [
      {
        id: "gsis-mpl-apir",
        title: "GSIS Multi-Purpose Loan (MPL Flex/Lite) & Pensioner APIR Compliance",
        processingTime: "1–2 working days via GSIS Touch mobile app after AAO approval",
        feeSchedule: "No filing fee",
        requirements: [
          "Active GSIS Touch account and UMID / eCard",
          "Agency Authorized Officer (AAO) online certification",
        ],
        steps: [
          "Submit loan application or Annual Pensioners’ Information Revalidation (APIR) facial verification via GSIS Touch or at GSIS Malaybalay in Casisang.",
          "Receive loan proceeds in your GSIS UMID/eCard account.",
        ],
        actionUrl: "https://egsismo.gsis.gov.ph/",
        actionLabel: "Open GSIS eGSISMO Portal",
      },
    ],
    source: {
      label: "Government Service Insurance System (GSIS) Official Portal",
      url: "https://www.gsis.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },

  // 4. DISASTER AND WEATHER
  {
    id: "cdrrmo-malaybalay",
    categorySlug: "disaster-weather",
    name: "City Disaster Risk Reduction and Management Office (CDRRMO) — Emergency Operations Center",
    shortName: "CDRRMO Malaybalay 24/7",
    jurisdiction: "City Government",
    address: "CDRRMO Command Center, Barangay 1 / City Hall Compound, Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 1",
    coordinates: [8.1575, 125.1312],
    hours: "24/7 Emergency Operations · Mon–Fri 8:00 AM – 5:00 PM Admin",
    phone: "0917-827-6117",
    email: "malaybalaycitydrrmo@gmail.com",
    onlinePortalUrl: "https://hazardhunter.georisk.gov.ph/",
    onlinePortalLabel: "Generate GeoRisk / HazardHunter Assessment",
    epaymentChannel: "₱0.00 (Free Emergency Dispatch, Rescue, and Hazard Information)",
    transactions: [
      {
        id: "cdrrmo-emergency-hazard",
        title: "24/7 Emergency Rescue Dispatch, Flood/Landslide Incident Report & DRRM Training Request",
        processingTime: "Immediate 24/7 dispatch for emergencies · 1–3 working days for DRRM certifications",
        feeSchedule: "₱0.00 (Free public safety and emergency response)",
        requirements: [
          "Exact barangay, purok/sitio, nearest landmark, and active callback mobile number",
          "Nature of incident (medical trauma, vehicular accident, Sawaga/Pulangi river flooding, or rain-induced landslide)",
        ],
        steps: [
          "Call 0917-827-6117 immediately for active emergencies in any of Malaybalay’s 46 barangays.",
          "For site hazard certifications or community DRRM training, submit a request letter to CDRRMO Malaybalay or generate a multi-hazard report via DOST HazardHunterPH.",
        ],
        actionUrl: "https://hazardhunter.georisk.gov.ph/",
        actionLabel: "Open DOST HazardHunterPH",
      },
    ],
    source: {
      label: "City Government of Malaybalay — CDRRMO & Emergency Directory",
      url: "https://sakata.malaybalaycity.gov.ph/contact-us/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "pagasa-noah-malaybalay",
    categorySlug: "disaster-weather",
    name: "DOST-PAGASA Malaybalay Synoptic Weather Station & UP Project NOAH Hazard Portal",
    shortName: "PAGASA Malaybalay & NOAH",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Capitol Site, Barangay 9, Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 9",
    coordinates: [8.1514, 125.1339],
    hours: "24/7 Synoptic Weather Monitoring · Mon–Fri 8:00 AM – 5:00 PM",
    phone: "(088) 813-2820",
    onlinePortalUrl: "https://noah.up.edu.ph/",
    onlinePortalLabel: "Open UP Project NOAH Hazard Map",
    epaymentChannel: "₱0.00 for public forecasts and hazard maps",
    transactions: [
      {
        id: "weather-flood-certification",
        title: "Official Rainfall/Weather Certification & 5-Yr / 100-Yr Flood Hazard Verification",
        processingTime: "Instant online map check · 1–3 working days for certified historical weather data",
        feeSchedule: "₱0.00 online hazard check; standard PAGASA data fee for certified legal/engineering weather extracts",
        requirements: [
          "Exact coordinates or barangay location in Malaybalay City",
          "Date range of weather event (for construction delay or crop insurance claims)",
        ],
        steps: [
          "Inspect 5-year and 100-year flood return periods on BetterMC’s interactive GIS map or UP Project NOAH (noah.up.edu.ph).",
          "For official rainfall certifications required by DPWH/COA or PCIC crop insurance, coordinate with PAGASA Malaybalay Station at Capitol Site.",
        ],
        actionUrl: "https://bagong.pagasa.dost.gov.ph/",
        actionLabel: "Open PAGASA Official Portal",
      },
    ],
    source: {
      label: "DOST-PAGASA & UP Resilience Institute Project NOAH",
      url: "https://noah.up.edu.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "bfp-malaybalay",
    categorySlug: "disaster-weather",
    name: "Bureau of Fire Protection (BFP) — Malaybalay City Fire Station",
    shortName: "BFP Malaybalay",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Barangay 1 (Poblacion), Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 1",
    coordinates: [8.1578, 125.1316],
    hours: "24/7 Fire & EMS Response · Mon–Fri 8:00 AM – 5:00 PM FSIC/FSEC Desk",
    phone: "0917-677-7700",
    email: "malaybalaycfs@gmail.com",
    onlinePortalUrl: "https://fsis.e-bfp.com/",
    onlinePortalLabel: "Apply for FSEC / FSIC on BFP e-FSIS",
    epaymentChannel: "BFP Official Collecting Officer / LandBank e-Payment via BFP FSIS",
    transactions: [
      {
        id: "bfp-fsic-fsec",
        title: "Fire Safety Inspection Certificate (FSIC) & Fire Safety Evaluation Clearance (FSEC)",
        processingTime: "1–3 working days including site inspection (RA 11032 / RA 9514 Fire Code)",
        feeSchedule: "statutory Fire Code fee based on building cost or 15% of regulatory fees (RA 9514)",
        requirements: [
          "Signed architectural/engineering plans (for FSEC Building Permit)",
          "Occupancy Permit assessment or Business Permit application form (for FSIC)",
          "Proof of functional fire extinguishers and emergency exit signage",
        ],
        steps: [
          "File application at the BFP Malaybalay desk at New City Hall BOSS or via BFP e-FSIS (fsis.e-bfp.com).",
          "Pay the Fire Code fee and accommodate the scheduled fire safety inspector.",
          "Claim your official FSIC/FSEC certificate.",
        ],
        actionUrl: "https://fsis.e-bfp.com/",
        actionLabel: "Open BFP e-FSIS Portal",
      },
    ],
    source: {
      label: "Bureau of Fire Protection — Malaybalay City Fire Station",
      url: "https://sakata.malaybalaycity.gov.ph/contact-us/",
      verifiedOn: VERIFIED_ON,
    },
  },

  // 5. EDUCATION
  {
    id: "deped-malaybalay",
    categorySlug: "education",
    name: "Department of Education (DepEd) — Schools Division of Malaybalay City",
    shortName: "DepEd Malaybalay Division",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Purok 6, Sayre Highway, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: [8.1312, 125.1332],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "(088) 813-1245",
    email: "malaybalay.city@deped.gov.ph",
    onlinePortalUrl: "https://www.deped.gov.ph/",
    onlinePortalLabel: "Open DepEd Official Portal",
    epaymentChannel: "₱0.00 (No collection policy for public school learner records & CAV endorsements)",
    transactions: [
      {
        id: "deped-cav-sf10",
        title: "Certification, Authentication & Verification (CAV) of School Records, LRN & ALS Enrollment",
        processingTime: "1–3 working days",
        feeSchedule: "₱0.00 at DepEd Division Office",
        requirements: [
          "Certified True Copy of Form 137 / SF10 (Permanent Learner Record) and Diploma from the originating Malaybalay school",
          "School Principal endorsement letter",
          "Valid ID of learner or parent/guardian",
        ],
        steps: [
          "Submit the school-endorsed SF10 and Diploma at the Records Section of DepEd Malaybalay City Division in Casisang.",
          "Receive the Division CAV endorsement for DFA Apostille or overseas employment/study.",
        ],
        actionUrl: "https://www.deped.gov.ph/",
        actionLabel: "Open DepEd Portal",
      },
    ],
    source: {
      label: "Department of Education — Region X & Malaybalay City Division",
      url: "https://www.deped.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "buksu-malaybalay",
    categorySlug: "education",
    name: "Bukidnon State University (BukSU) — Main Campus Admissions, Registrar & Scholarship Office",
    shortName: "BukSU Main Campus",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Fortich Street, Barangay 2, Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 2",
    coordinates: [8.1572, 125.1246],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "(088) 813-5661",
    email: "registrar@buksu.edu.ph",
    onlinePortalUrl: "https://buksu.edu.ph/",
    onlinePortalLabel: "Open BukSU Official Admissions & Registrar Portal",
    epaymentChannel: "Free Higher Education (RA 10931) for Undergraduate Tuition · BukSU Cashier / LandBank for Registrar Credentials",
    transactions: [
      {
        id: "buksu-admissions-tor",
        title: "BukSU College/Law/Graduate Admissions, Free Higher Education (RA 10931) & Transcript of Records (TOR)",
        processingTime: "Online admission booking · 3–5 working days for TOR/Diploma/CAV issuance",
        feeSchedule: "₱0.00 Undergraduate Tuition & Misc Fees (RA 10931 Universal Access to Quality Tertiary Education) · Standard registrar fee for TOR/CAV",
        requirements: [
          "Senior High School Report Card (SF9) / TOR for transferees",
          "PSA Birth Certificate and Certificate of Good Moral Character",
          "BukSU Student Portal / Registrar request form (for alumni credentials)",
        ],
        steps: [
          "Access the BukSU online admission or registrar portal at buksu.edu.ph.",
          "Submit required credentials or request official Transcript of Records / CAV.",
          "Claim documents at the BukSU Main Campus Registrar’s Office on Fortich Street.",
        ],
        actionUrl: "https://buksu.edu.ph/",
        actionLabel: "Open BukSU Portal",
      },
    ],
    source: {
      label: "Bukidnon State University (BukSU) Official Website",
      url: "https://buksu.edu.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "tesda-bukidnon-city-scholarship",
    categorySlug: "education",
    name: "TESDA Bukidnon Provincial Office & Malaybalay City Medical Education Subsidy (EO 17 s. 2026)",
    shortName: "TESDA Bukidnon & City Scholarship",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Provincial Capitol Compound, Barangay 9 (TESDA) / New City Hall, Casisang (City Scholarship Desk), Malaybalay City",
    barangay: "Barangay 9",
    coordinates: [8.152, 125.1342],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "(088) 813-3915",
    email: "region10.bukidnon@tesda.gov.ph",
    onlinePortalUrl: "https://bsrs.tesda.gov.ph/",
    onlinePortalLabel: "Apply for TESDA Scholarship on BSRS",
    epaymentChannel: "₱0.00 (Free TVET Scholarship under TWSP/STEP/Tulong Trabaho & Free City Scholarship)",
    transactions: [
      {
        id: "tesda-nc-scholarship",
        title: "TESDA National Certificate (NC II/III) Assessment, Scholarship (BSRS) & City Medical Education Subsidy",
        processingTime: "1–3 working days for scholarship slot or competency assessment scheduling",
        feeSchedule: "₱0.00 for qualified TWSP/STEP scholars; standard TESDA assessment fee for walk-in NC candidates",
        requirements: [
          "TESDA Learner’s Profile / Unique Learner Identifier (ULI)",
          "PSA Birth Certificate, High School/College credentials, and passport-size photos with white background and collar",
          "Certificate of Residency in Malaybalay City (for City Medical Education Subsidy under EO No. 17 s. 2026)",
        ],
        steps: [
          "Register on the TESDA Biometric-Enabled Scholarship Registration System (bsrs.tesda.gov.ph) or e-TESDA online courses.",
          "For medical students applying under Executive Order No. 17, Series of 2026, submit residency and admission documents to the Office of the City Mayor in Casisang.",
        ],
        actionUrl: "https://bsrs.tesda.gov.ph/",
        actionLabel: "Open TESDA BSRS Portal",
      },
    ],
    source: {
      label: "TESDA Scholarship Registration System & Malaybalay EO No. 17 s. 2026",
      url: "https://bsrs.tesda.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },

  // 6. EMPLOYMENT
  {
    id: "peso-malaybalay",
    categorySlug: "employment",
    name: "Public Employment Service Office (PESO) — City of Malaybalay",
    shortName: "PESO Malaybalay",
    jurisdiction: "City Government",
    address: "New City Hall, Sayre Highway, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: [8.1284, 125.1341],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "0915-542-3434",
    email: "pesomalaybalaycity@gmail.com",
    onlinePortalUrl: "https://philjobnet.gov.ph/",
    onlinePortalLabel: "Search Verified Jobs on PhilJobNet",
    epaymentChannel: "₱0.00 (All PESO job referrals, SPES, and TUPAD services are 100% free)",
    transactions: [
      {
        id: "peso-job-referral-spes",
        title: "Local & Overseas Job Referral, SPES Student Employment & TUPAD Emergency Employment",
        processingTime: "Same-day NSRS registration and job referral issuance",
        feeSchedule: "₱0.00 (Free under Republic Act No. 8759 / RA 10691 PESO Act)",
        requirements: [
          "Updated Resume / Curriculum Vitae and valid ID",
          "Barangay Clearance or First-Time Jobseeker Certification (RA 11261)",
          "For SPES: School enrollment/grades and Certificate of Indigency",
        ],
        steps: [
          "Register in the National Skills Registration Program (NSRP) at PESO Malaybalay (New City Hall) and PhilJobNet.",
          "Receive an official PESO Referral Letter to accredited Malaybalay and Bukidnon employers.",
        ],
        actionUrl: "https://philjobnet.gov.ph/",
        actionLabel: "Open PhilJobNet Portal",
      },
    ],
    source: {
      label: "City Government of Malaybalay — PESO Contact Directory",
      url: "https://sakata.malaybalaycity.gov.ph/contact-us/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "dole-bukidnon",
    categorySlug: "employment",
    name: "Department of Labor and Employment (DOLE) — Bukidnon Provincial Field Office",
    shortName: "DOLE Bukidnon",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Provincial Capitol Compound / Fortich Street, Barangay 9, Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 9",
    coordinates: [8.1525, 125.1335],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "(088) 813-3241",
    email: "ro10_bukidnon@dole.gov.ph",
    onlinePortalUrl: "https://ers.dole.gov.ph/",
    onlinePortalLabel: "Open DOLE Establishment Report System",
    epaymentChannel: "₱0.00 for Rule 1020 Registration & e-SEnA Labor Assistance",
    transactions: [
      {
        id: "dole-sena-1020",
        title: "Single Entry Approach (e-SEnA) Labor Assistance, Rule 1020 Registration & Worker Association Registration",
        processingTime: "Same-day online filing; mandatory 30-day SEnA conciliation-mediation window",
        feeSchedule: "₱0.00 for e-SEnA Request for Assistance and Rule 1020 Establishment Registration",
        requirements: [
          "Employment details, payslips, or company ID (for SEnA wage/benefit claims)",
          "Business Permit, DTI/SEC registration, and OSH layout (for Rule 1020 Employer Registration)",
          "Constitution, By-Laws, and member list (for Rural Workers Association registration)",
        ],
        steps: [
          "Submit an online Request for Assistance at sena.dole.gov.ph or Establishment Report at ers.dole.gov.ph.",
          "Attend the scheduled conference at DOLE Bukidnon Provincial Field Office in Malaybalay City.",
        ],
        actionUrl: "https://sena.dole.gov.ph/",
        actionLabel: "File Request on DOLE e-SEnA",
      },
    ],
    source: {
      label: "Department of Labor and Employment (DOLE) Region X & e-SEnA Portal",
      url: "https://ers.dole.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "prc-csc-malaybalay",
    categorySlug: "employment",
    name: "Civil Service Commission (CSC) Bukidnon Field Office & PRC LERIS Online Licensure System",
    shortName: "CSC Bukidnon & PRC LERIS",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Provincial Capitol Compound, Barangay 9, Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 9",
    coordinates: [8.1516, 125.1345],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "(088) 813-2538",
    email: "ro10.fo_bukidnon@csc.gov.ph",
    onlinePortalUrl: "https://online.prc.gov.ph/",
    onlinePortalLabel: "Open PRC LERIS Licensure Portal",
    epaymentChannel: "LandBank / Maya / GCash / USSC via PRC LERIS · CSC Field Office Cashier",
    transactions: [
      {
        id: "prc-leris-csc",
        title: "PRC Board Exam Application, Professional ID (PIC) Renewal & CSC Career Service Eligibility",
        processingTime: "15–30 minutes online appointment & payment",
        feeSchedule: "₱450.00 PRC PIC 3-year renewal · ₱500.00 CSE-PPT exam fee",
        requirements: [
          "PRC LERIS account with passport-size photo in white background",
          "CPD compliance or undertaking (for PRC PIC renewal)",
          "TOR, PSA Birth Certificate, and NBI Clearance (for first-time board exam applicants)",
        ],
        steps: [
          "Sign in to online.prc.gov.ph to book your exam, initial registration, or PIC renewal (with shipping or nearest Robinsons Valencia/CDO release).",
          "For government job vacancies and Civil Service Eligibility verification, visit csc.gov.ph/career or CSC Bukidnon at Capitol Compound.",
        ],
        actionUrl: "https://online.prc.gov.ph/",
        actionLabel: "Transact on PRC LERIS",
      },
    ],
    source: {
      label: "Professional Regulation Commission (LERIS) & Civil Service Commission",
      url: "https://online.prc.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },

  // 7. HEALTH
  {
    id: "cho-malaybalay",
    categorySlug: "health",
    name: "Malaybalay City Health Office (CHO) — Primary Care, Dental & Sanitary Division",
    shortName: "City Health Office",
    jurisdiction: "City Government",
    address: "Rizal Avenue / Barangay 4 (Poblacion), Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 4",
    coordinates: [8.1566, 125.131],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM (Emergency Referral Active)",
    phone: "0965-094-9105",
    email: "cho.malaybly@gmail.com",
    onlinePortalUrl: "https://sakata.malaybalaycity.gov.ph/citizens-charter/",
    onlinePortalLabel: "Open City Health Citizen’s Charter",
    epaymentChannel: "Free Primary Care & PhilHealth Konsulta · City Treasurer’s Cashier for Sanitary/Medical Certificates",
    transactions: [
      {
        id: "cho-medical-dental-sanitary",
        title: "Outpatient Medical/Dental Consultation, Immunizations, Health Card & Sanitary Permit",
        processingTime: "30–60 minutes for outpatient consultation or Health Certificate issuance",
        feeSchedule: "₱0.00 for primary consultations, TB-DOTS, maternal/child vaccines & PhilHealth Konsulta · Standard fee for employment Medical/Health Certificate",
        requirements: [
          "Barangay Health Station referral slip or valid ID / PhilHealth MDR",
          "Laboratory results (urinalysis, fecalysis, chest X-ray for food/non-food handler Health Card)",
        ],
        steps: [
          "Proceed to the Malaybalay City Health Office triage and registration desk on Rizal Avenue.",
          "Undergo physician/dentist consultation or submit laboratory results for Health Card / Sanitary Permit validation.",
        ],
        actionUrl: "https://sakata.malaybalaycity.gov.ph/citizens-charter/",
        actionLabel: "View CHO Service Standards",
      },
    ],
    source: {
      label: "City Government of Malaybalay — City Health Office",
      url: "https://sakata.malaybalaycity.gov.ph/contact-us/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "bpmc-malasakit-malaybalay",
    categorySlug: "health",
    name: "Bukidnon Provincial Medical Center (BPMC) & Malasakit Center One-Stop Medical Assistance",
    shortName: "BPMC & Malasakit Center",
    jurisdiction: "Regional / Provincial Office",
    address: "Sayre Highway, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: [8.1348, 125.1318],
    hours: "24/7 Emergency & Inpatient · Mon–Sat 8:00 AM – 5:00 PM Malasakit Center & OPD",
    phone: "(088) 813-5396",
    onlinePortalUrl: "https://www.doh.gov.ph/",
    onlinePortalLabel: "Open DOH / Malasakit Program Guide",
    epaymentChannel: "PhilHealth Benefit Deduction + Zero-Balance Billing / Malasakit Center Guarantee Letter (DOH MAIP, DSWD, PCSO)",
    transactions: [
      {
        id: "bpmc-malasakit-assistance",
        title: "Malasakit Center One-Stop Medical & Hospital Bill Financial Assistance (RA 11463)",
        processingTime: "Same-day unified intake assessment at BPMC Malasakit Center",
        feeSchedule: "₱0.00 processing fee (Covers hospital bills, laboratory diagnostics, and medicines for indigent/financially incapacitated patients)",
        requirements: [
          "Updated Hospital Statement of Account (SOA) or Doctor’s Prescription / Laboratory Request with price quotation",
          "Clinical Abstract or Medical Certificate signed by the attending physician",
          "Valid ID of patient and representative + Barangay Certificate of Indigency",
        ],
        steps: [
          "Ensure PhilHealth membership/MDR is applied first at the BPMC PhilHealth Billing Desk.",
          "Present the Statement of Account and Medical Abstract at the BPMC Malasakit Center window in Casisang.",
          "Complete the unified Malasakit intake form to receive combined DOH MAIP, DSWD, and PCSO medical assistance.",
        ],
        actionUrl: "https://www.doh.gov.ph/",
        actionLabel: "View DOH Medical Assistance Guide",
      },
    ],
    source: {
      label: "Republic Act No. 11463 (Malasakit Centers Act) & BPMC Malaybalay",
      url: "https://www.doh.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },

  // 8. HOUSING
  {
    id: "cudho-obo-malaybalay",
    categorySlug: "housing",
    name: "City Urban Development and Housing Office (CUDHO) & Office of the Building Official (OBO)",
    shortName: "CUDHO & OBO Malaybalay",
    jurisdiction: "City Government",
    address: "New City Hall, Sayre Highway, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: [8.1283, 125.1343],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "0953-459-7782 / 0917-152-6618",
    email: "city8700housing@gmail.com",
    onlinePortalUrl: "https://sakata.malaybalaycity.gov.ph/obo-printables/",
    onlinePortalLabel: "Download Official OBO Building Permit Forms",
    epaymentChannel: "City Treasurer’s Office Cashier (New City Hall)",
    transactions: [
      {
        id: "obo-building-occupancy-permit",
        title: "Building Permit, Electrical/Sanitary/Fencing Permit & Certificate of Occupancy",
        processingTime: "3–5 working days for complete residential/commercial plans",
        feeSchedule: "National Building Code (PD 1096) schedule of fees based on floor area and building classification",
        requirements: [
          "5 sets of signed and sealed Architectural, Structural, Electrical, and Sanitary/Plumbing plans",
          "Certified True Copy of OCT/TCT Land Title, Tax Declaration, and current Real Property Tax Receipt",
          "Barangay Construction Clearance and CPDO Locational/Zoning Clearance",
          "BFP Fire Safety Evaluation Clearance (FSEC)",
        ],
        steps: [
          "Download the official printable forms from the Malaybalay OBO Printables portal (sakata.malaybalaycity.gov.ph/obo-printables/).",
          "Submit signed plans and property clearances to the Office of the Building Official (OBO) at New City Hall.",
          "Pay assessed Building Code and Fire Code fees at the City Treasurer’s Office to claim your Building Permit.",
        ],
        actionUrl: "https://sakata.malaybalaycity.gov.ph/obo-printables/",
        actionLabel: "Open Official OBO Printable Forms",
      },
      {
        id: "cudho-socialized-housing",
        title: "Socialized Housing / Resettlement Application & Homeowners Association Assistance",
        processingTime: "1–5 working days for initial socio-economic validation",
        feeSchedule: "₱0.00 application & socio-economic intake fee",
        requirements: [
          "Barangay Certificate of Residency and Indigency",
          "Certificate of No Landholding from the City Assessor’s Office",
          "Marriage Certificate / Birth Certificates of household members and valid IDs",
        ],
        steps: [
          "Visit the City Urban Development and Housing Office (CUDHO) at New City Hall or call 0953-459-7782.",
          "Complete the housing beneficiary socio-economic profiling under the City Housing and Resettlement Committee (EO 60).",
        ],
        actionUrl: "https://sakata.malaybalaycity.gov.ph/citizens-charter/",
        actionLabel: "Open Housing Charter Guide",
      },
    ],
    source: {
      label: "City Government of Malaybalay — OBO Printables & CUDHO Directory",
      url: "https://sakata.malaybalaycity.gov.ph/obo-printables/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "rod-lra-bukidnon",
    categorySlug: "housing",
    name: "Registry of Deeds — Province of Bukidnon (LRA Malaybalay)",
    shortName: "Registry of Deeds Bukidnon",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Provincial Capitol Compound, Barangay 9, Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 9",
    coordinates: [8.1512, 125.1348],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "(088) 813-2263",
    onlinePortalUrl: "https://eserbisyo.lra.gov.ph/",
    onlinePortalLabel: "Request Certified Land Title on LRA eSerbisyo",
    epaymentChannel: "LRA Cashier (Capitol Compound Malaybalay) / LRA eSerbisyo Online Payment",
    transactions: [
      {
        id: "lra-ctc-title-transfer",
        title: "Certified True Copy of Land Title (OCT/TCT) & Registration of Deed of Sale / Mortgage",
        processingTime: "Same-day to 2 working days for Certified True Copy · 5–10 working days for Title Transfer",
        feeSchedule: "LRA statutory registration & IT service fee schedule based on transaction value",
        requirements: [
          "Title Number (OCT or TCT), registered owner’s name, and lot location in Malaybalay/Bukidnon",
          "For Title Transfer: Notarized Deed of Absolute Sale, BIR eCAR (from RDO 99), Transfer Tax Receipt (City Treasurer), and Tax Clearance (City Assessor)",
        ],
        steps: [
          "Request a Certified True Copy online via eserbisyo.lra.gov.ph or at the Registry of Deeds Bukidnon window at Capitol Compound.",
          "For title transfers, submit the BIR eCAR and City Treasurer Transfer Tax receipt for new TCT issuance.",
        ],
        actionUrl: "https://eserbisyo.lra.gov.ph/",
        actionLabel: "Open LRA eSerbisyo Portal",
      },
    ],
    source: {
      label: "Land Registration Authority (LRA) eSerbisyo Portal",
      url: "https://eserbisyo.lra.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },

  // 9. PASSPORT AND TRAVEL
  {
    id: "dfa-passport-cdo-malaybalay",
    categorySlug: "passport-travel",
    name: "Department of Foreign Affairs (DFA) — Online Passport & Apostille Portal (CO Cagayan de Oro / Bukidnon Outreach)",
    shortName: "DFA Passport & Apostille",
    jurisdiction: "Regional / Provincial Office",
    address: "Online Booking Everywhere · Nearest Consular Office: DFA CO Cagayan de Oro (5F SM CDO Downtown Premier, Claro M. Recto Ave., CDO)",
    barangay: "Barangay 4",
    coordinates: [8.4803, 124.6465],
    hours: "24/7 Online Appointment Portal · Mon–Fri 10:00 AM – 5:00 PM Consular Office",
    phone: "(088) 859-0474",
    email: "cagayandeoro.rco@dfa.gov.ph",
    onlinePortalUrl: "https://www.passport.gov.ph/",
    onlinePortalLabel: "Book DFA Passport Appointment Online",
    epaymentChannel: "DFA Authorized e-Payment (7-Eleven, Bayad Center, GCash, Maya, LandBank, Credit/Debit) within 24 hours of booking",
    transactions: [
      {
        id: "dfa-passport-application",
        title: "Philippine ePassport New Application & Renewal (10-Year Validity)",
        processingTime: "10–12 working days (Regular) · 5–7 working days (Expedited)",
        feeSchedule: "₱950.00 (Regular Processing) · ₱1,200.00 (Expedited) + ₱50.00 convenience fee",
        requirements: [
          "Confirmed DFA Online Appointment Packet & e-Payment Receipt",
          "Original PSA Birth Certificate on Security Paper (for New Applicants)",
          "1 valid government-issued photo ID (National ID, ePhilID, Driver’s License, UMID, Voter’s ID/Certification from COMELEC Intramuros/local)",
          "Current ePassport (for Renewal)",
        ],
        steps: [
          "Schedule an individual or group slot at passport.gov.ph and select DFA Cagayan de Oro (nearest regional consular office to Malaybalay).",
          "Pay the processing fee using your Reference Number within 24 hours.",
          "Appear in person on your scheduled date with your printed application form and original documents for biometrics.",
        ],
        actionUrl: "https://www.passport.gov.ph/",
        actionLabel: "Open DFA Passport Portal",
      },
      {
        id: "dfa-apostille-etravel",
        title: "DFA Apostille Document Authentication & Philippine eTravel Declaration",
        processingTime: "Instant for eTravel QR · 3–5 working days for Apostille",
        feeSchedule: "₱0.00 (eTravel is 100% Free) · ₱100.00–₱200.00 per document for DFA Apostille",
        requirements: [
          "PSA-issued civil registry document, NBI Clearance, or DepEd/CHED/PRC CAV-endorsed credentials (for Apostille)",
          "Passport details and flight itinerary within 72 hours of departure/arrival (for eTravel)",
        ],
        steps: [
          "For international arrival/departure, register for free at etravel.gov.ph within 72 hours of your flight.",
          "For document authentication for use abroad, book an Apostille slot at apostille.gov.ph.",
        ],
        actionUrl: "https://etravel.gov.ph/",
        actionLabel: "Open Official eTravel Portal",
      },
    ],
    source: {
      label: "Department of Foreign Affairs (DFA) Official Appointment System",
      url: "https://www.passport.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "dmw-owwa-malaybalay",
    categorySlug: "passport-travel",
    name: "Department of Migrant Workers (DMW) & OWWA — OFW Help Desk (PESO Malaybalay / Region X)",
    shortName: "DMW & OWWA OFW Desk",
    jurisdiction: "City Government",
    address: "PESO OFW Desk, New City Hall, Sayre Highway, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: [8.1284, 125.1341],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "0915-542-3434",
    email: "pesomalaybalaycity@gmail.com",
    onlinePortalUrl: "https://onlineservices.dmw.gov.ph/",
    onlinePortalLabel: "Open DMW e-Registration & OEC Portal",
    epaymentChannel: "₱0.00 for Balik-Manggagawa OEC Exemption · $25.00 PHP equivalent for OWWA Membership renewal",
    transactions: [
      {
        id: "dmw-oec-owwa",
        title: "OFW Overseas Employment Certificate (OEC / Balik-Manggagawa) & OWWA Welfare Assistance",
        processingTime: "Instant online OEC Exemption for returning OFWs (same employer/jobsite)",
        feeSchedule: "₱0.00 for online OEC Exemption; ₱100.00 processing fee for new jobsite appointment",
        requirements: [
          "Active DMW e-Registration account (onlineservices.dmw.gov.ph)",
          "Valid Philippine Passport (at least 6 months validity) and valid Work Visa / Employment Contract",
        ],
        steps: [
          "Log in to onlineservices.dmw.gov.ph (POPS-BaM) to print your OEC Exemption or book a contract verification appointment.",
          "For local OFW reintegration, livelihood, or distress assistance in Malaybalay, coordinate with the PESO OFW Help Desk at New City Hall.",
        ],
        actionUrl: "https://onlineservices.dmw.gov.ph/",
        actionLabel: "Open DMW Online Services",
      },
    ],
    source: {
      label: "Department of Migrant Workers (DMW) Online Services Portal",
      url: "https://onlineservices.dmw.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },

  // 10. SOCIAL SERVICES
  {
    id: "cswdo-malaybalay",
    categorySlug: "social-services",
    name: "City Social Welfare and Development Office (CSWDO) — City of Malaybalay",
    shortName: "CSWDO Malaybalay",
    jurisdiction: "City Government",
    address: "New City Hall Compound, Barangay Casisang / Old City Hall Compound, Barangay 1, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: [8.1286, 125.1338],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM (Crisis Intervention Active)",
    phone: "0953-385-2277",
    email: "swmlycty@yahoo.com",
    onlinePortalUrl: "https://sakata.malaybalaycity.gov.ph/citizens-charter/",
    onlinePortalLabel: "Open CSWDO Citizen’s Charter Guide",
    epaymentChannel: "₱0.00 (All social welfare IDs, AICS assistance, and casework services are 100% free)",
    transactions: [
      {
        id: "cswdo-aics-ids",
        title: "AICS Crisis Assistance (Medical, Burial, Educational) & Senior Citizen / PWD / Solo Parent ID",
        processingTime: "1–3 hours for ID issuance or Social Case Study Report / AICS intake",
        feeSchedule: "₱0.00 (Free under RA 9994, RA 10754, and RA 11861 Expanded Solo Parents Welfare Act)",
        requirements: [
          "Barangay Certificate of Indigency and Residency in Malaybalay City",
          "Valid ID / PSA Birth Certificate (for Senior Citizen OSCA ID), Medical Certificate confirming disability (for PWD ID), or Solo Parent affidavit/birth certificates of children",
          "Medical prescription/hospital bill or registered Death Certificate/funeral contract (for AICS Medical/Burial aid)",
        ],
        steps: [
          "Secure a Barangay Certificate of Residency/Indigency from your Barangay Hall.",
          "Present your requirements to the CSWDO social worker for intake interview and Social Case Study assessment.",
          "Claim your official OSCA/PWD/Solo Parent ID and booklet or AICS financial assistance / guarantee letter.",
        ],
        actionUrl: "https://sakata.malaybalaycity.gov.ph/citizens-charter/",
        actionLabel: "View CSWDO Service Standards",
      },
    ],
    source: {
      label: "City Government of Malaybalay — CSWDO Contact Directory",
      url: "https://sakata.malaybalaycity.gov.ph/contact-us/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "dswd-swad-bukidnon",
    categorySlug: "social-services",
    name: "DSWD Field Office X — SWAD Bukidnon Satellite Office & NCIP Bukidnon Provincial Office",
    shortName: "DSWD SWAD & NCIP Bukidnon",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Provincial Capitol Compound, Barangay 9, Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 9",
    coordinates: [8.1519, 125.1338],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "(088) 813-3482",
    email: "fo10@dswd.gov.ph",
    onlinePortalUrl: "https://www.dswd.gov.ph/",
    onlinePortalLabel: "Open DSWD Official Services Portal",
    epaymentChannel: "₱0.00 for AICS, 4Ps, and NCIP Certificate of Confirmation (₱300 fee only for DSWD Minors Traveling Abroad clearance)",
    transactions: [
      {
        id: "dswd-aics-ncip",
        title: "DSWD AICS Crisis Intervention, Minors Traveling Abroad (MTA) Clearance & NCIP Certificate of Confirmation",
        processingTime: "Same-day intake for AICS · 1–3 working days for MTA / NCIP COC",
        feeSchedule: "₱0.00 for AICS & NCIP COC · ₱300.00 per child for DSWD Travel Clearance",
        requirements: [
          "Barangay Certificate of Indigency, Valid ID, and Medical/Hospital/Funeral billing statement (for DSWD AICS)",
          "Genealogy form endorsed by recognized IP Mandatory Representative / Bae / Datu (for NCIP Certificate of Confirmation)",
        ],
        steps: [
          "Visit the DSWD SWAD Bukidnon office or NCIP Bukidnon Provincial Office at the Capitol Compound in Barangay 9, Malaybalay City.",
          "Complete social worker or tribal genealogy verification to receive your assistance or certification.",
        ],
        actionUrl: "https://www.dswd.gov.ph/",
        actionLabel: "Open DSWD Official Website",
      },
    ],
    source: {
      label: "Department of Social Welfare and Development (DSWD) Field Office X",
      url: "https://fo10.dswd.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },

  // 11. TAX
  {
    id: "cto-casso-malaybalay",
    categorySlug: "tax",
    name: "City Treasurer’s Office (CTO) & City Assessor’s Office (CASSO) — City of Malaybalay",
    shortName: "City Treasurer & Assessor",
    jurisdiction: "City Government",
    address: "Ground Floor, New City Hall, Sayre Highway, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: [8.128, 125.1342],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "0997-452-5920 / 0916-335-5178",
    email: "citytreasurermalaybalay@gmail.com",
    onlinePortalUrl: "https://sakata.malaybalaycity.gov.ph/ordinance-no-1092-series-of-2026/",
    onlinePortalLabel: "View Real Property Tax Ordinance & CTO Guide",
    epaymentChannel: "City Treasurer’s Office Cashier Windows (New City Hall) / LandBank Official Deposit",
    transactions: [
      {
        id: "rpt-cedula-payment",
        title: "Real Property Tax (RPT) Payment, Tax Clearance & Community Tax Certificate (Cedula)",
        processingTime: "15–30 minutes at City Treasurer’s Office windows",
        feeSchedule: "1% Basic RPT + 1% SEF on Assessed Value (20% Prompt Advance Payment Discount / 10% Prompt Payment Discount under Ordinance No. 1092 s. 2026) · ₱5.00 + ₱1 per ₱1,000 income for Cedula",
        requirements: [
          "Previous Real Property Tax Official Receipt or Tax Declaration Number (ARP/TD No.)",
          "Valid ID and gross income/receipts declaration (for Community Tax Certificate / Cedula)",
        ],
        steps: [
          "Request an updated Statement of Account / RPT Billing Computation at the City Treasurer’s Land Tax Division in New City Hall.",
          "Pay at the Revenue Collection Window (avail of prompt payment discounts during Q1 / Real Property Tax Month in March per Ordinance No. 1092 s. 2026).",
          "Claim your Official Receipt and Real Property Tax Clearance.",
        ],
        actionUrl: "https://sakata.malaybalaycity.gov.ph/citizens-charter/",
        actionLabel: "Open CTO & Assessor Charter",
      },
      {
        id: "assessor-tax-declaration",
        title: "Certified True Copy of Tax Declaration, Certificate of Landholdings / No Improvement",
        processingTime: "20–45 minutes for existing indexed property records",
        feeSchedule: "₱50.00–₱100.00 certification fee per parcel",
        requirements: [
          "Tax Declaration Number or OCT/TCT Title Number",
          "Current Real Property Tax Official Receipt from the City Treasurer’s Office",
          "Valid ID or Special Power of Attorney / Authorization Letter",
        ],
        steps: [
          "Present the current RPT receipt and request slip at the City Assessor’s Office (CASSO) window at New City Hall.",
          "Pay the certification fee at the City Treasurer’s Cashier and claim the signed Tax Declaration or Property Certification.",
        ],
        actionUrl: "https://sakata.malaybalaycity.gov.ph/contact-us/",
        actionLabel: "Contact City Assessor’s Office",
      },
    ],
    source: {
      label: "City Government of Malaybalay — CTO, CASSO & Ordinance No. 1092 s. 2026",
      url: "https://sakata.malaybalaycity.gov.ph/ordinance-no-1092-series-of-2026/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "bir-rdo99-malaybalay",
    categorySlug: "tax",
    name: "Bureau of Internal Revenue (BIR) — Revenue District Office No. 99 (RDO 99 Malaybalay City, Bukidnon)",
    shortName: "BIR RDO 99 Malaybalay",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Sayre Highway, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: [8.1362, 125.1312],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM (Single-Window / New Business Desk)",
    phone: "(088) 813-2273",
    email: "rdo_99css@bir.gov.ph",
    onlinePortalUrl: "https://orus.bir.gov.ph/",
    onlinePortalLabel: "Transact on BIR ORUS Online Portal",
    epaymentChannel: "BIR ePay Gateways (LandBank Link.BizPortal, Maya, GCash, MYEG, UnionBank, DBP) — ₱0.00 Annual Registration Fee (Repealed by RA 11976 EOPT Act)",
    transactions: [
      {
        id: "bir-tin-orus-id",
        title: "TIN Application (Form 1901/1902/1904), Digital TIN ID & COR Business Registration (RA 11976 EOPT)",
        processingTime: "Instant Digital TIN ID on BIR ORUS · 1–3 working days for new TIN / COR approval",
        feeSchedule: "₱0.00 (TIN & Digital TIN ID are strictly FREE; ₱500 Annual Registration Fee is permanently abolished under Republic Act No. 11976 Ease of Paying Taxes Act; ₱30 DST on COR)",
        requirements: [
          "1 valid government-issued ID showing full name, birth date, and signature, plus selfie holding the ID",
          "DTI Certificate or SEC Articles of Incorporation (for Form 1901/1903 Business Certificate of Registration)",
          "Sample Principal Invoice layout for Authority to Print (ATP)",
        ],
        steps: [
          "Create an account on the official BIR Online Registration and Update System (orus.bir.gov.ph) selecting RDO No. 99 — Malaybalay City.",
          "Submit Form 1904/1902 (for Individual TIN) or Form 1901 (for Self-Employed/Business) and generate your free Digital TIN ID with verifiable QR code.",
          "For eCAR (Capital Gains/Estate/Donor’s Tax) or walk-in assistance, visit BIR RDO 99 along Sayre Highway in Barangay Casisang.",
        ],
        actionUrl: "https://orus.bir.gov.ph/",
        actionLabel: "Open BIR ORUS Portal",
      },
      {
        id: "bir-epay-return",
        title: "Electronic Tax Return Filing & e-Payment (BIR ePay / eBIRForms)",
        processingTime: "Real-time electronic filing & payment confirmation",
        feeSchedule: "Based on computed Income, Percentage, Withholding, or Value-Added Tax return",
        requirements: [
          "12-digit Taxpayer Identification Number (TIN) and Branch Code (00000)",
          "Return Period, Form Type (e.g., 1701Q, 1701A, 2551Q, 0619E), and Tax Amount",
        ],
        steps: [
          "Prepare and submit your tax return using the latest Offline eBIRForms Package.",
          "Pay any tax due online through BIR ePay (LandBank Link.BizPortal, Maya, GCash, or MYEG) or Authorized Agent Banks in Malaybalay City.",
        ],
        actionUrl: "https://www.bir.gov.ph/ePay",
        actionLabel: "Open BIR ePay Gateways",
      },
    ],
    source: {
      label: "Bureau of Internal Revenue (BIR) ORUS Portal & RDO 99 Malaybalay",
      url: "https://orus.bir.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },

  // 12. TRANSPORT AND DRIVING
  {
    id: "lto-malaybalay",
    categorySlug: "transport-driving",
    name: "Land Transportation Office (LTO) — Malaybalay District Office",
    shortName: "LTO Malaybalay",
    jurisdiction: "National Agency (Malaybalay Branch)",
    address: "Sayre Highway, Barangay Casisang / Laguitas Corridor, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: [8.1185, 125.1368],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM",
    phone: "(088) 813-3519",
    email: "ltomalaybalaydo@gmail.com",
    onlinePortalUrl: "https://portal.lto.gov.ph/",
    onlinePortalLabel: "Log in to LTO LTMS Portal",
    epaymentChannel: "LTO Malaybalay Cashier / LTMS Online Payment (LandBank, GCash, Maya, Paynamics)",
    transactions: [
      {
        id: "lto-student-driver-license",
        title: "Student Permit, Non-Professional / Professional Driver’s License & 10-Year Renewal (LTMS)",
        processingTime: "45–90 minutes after LTMS online exam and medical uploading",
        feeSchedule: "₱250.00 Student Permit · ₱585.00 New/Renewal Driver’s License + ₱100.00 Exam Fee",
        requirements: [
          "Active LTO LTMS Portal Account (portal.lto.gov.ph)",
          "LTO-Accredited Medical Certificate (electronically transmitted)",
          "Theoretical Driving Course (TDC) 15-hour Certificate (for Student Permit) or Practical Driving Course (PDC) Certificate (for New Driver’s License)",
          "CDE Comprehensive Driver’s Education Online Validation Exam Certificate (free on LTMS for License Renewal)",
        ],
        steps: [
          "Register or sign in at portal.lto.gov.ph to take the free CDE renewal exam or book a licensing transaction.",
          "Secure an electronically uploaded Medical Certificate from an LTO-accredited clinic adjacent to LTO Malaybalay.",
          "Proceed to LTO Malaybalay District Office for biometric capture, payment, and license card printing.",
        ],
        actionUrl: "https://portal.lto.gov.ph/",
        actionLabel: "Open LTO LTMS Portal",
      },
      {
        id: "lto-mv-registration",
        title: "Motor Vehicle / Motorcycle Registration Renewal",
        processingTime: "45–60 minutes after emission/PMVIC inspection and CTPL upload",
        feeSchedule: "MVUC rate based on vehicle weight/type + ₱169.00 computer fee",
        requirements: [
          "Photocopy of Certificate of Registration (CR) and latest Official Receipt (OR)",
          "Compulsory Third-Party Liability (CTPL) Certificate of Cover",
          "Motor Vehicle Inspection Report (PMVIC / Emission Test & MVIS stencil)",
        ],
        steps: [
          "Complete vehicle inspection and obtain CTPL insurance.",
          "Submit documents at LTO Malaybalay evaluator window or renew online via LTMS if the vehicle is already linked to your LTMS account.",
        ],
        actionUrl: "https://portal.lto.gov.ph/",
        actionLabel: "Open LTMS Vehicle Services",
      },
    ],
    source: {
      label: "Land Transportation Office (LTO) LTMS Portal & Region X Directory",
      url: "https://portal.lto.gov.ph/",
      verifiedOn: VERIFIED_ON,
    },
  },
  {
    id: "tmc-malaybalay",
    categorySlug: "transport-driving",
    name: "Traffic Management Center (TMC) & Sangguniang Panlungsod Tricycle/Motorela Franchising — Malaybalay City",
    shortName: "TMC Malaybalay",
    jurisdiction: "City Government",
    address: "Fortich Street, Barangay 2 (TMC Operations) / New City Hall, Barangay Casisang (Franchising & BPLD), Malaybalay City",
    barangay: "Barangay 2",
    coordinates: [8.1548, 125.1306],
    hours: "Mon–Fri · 8:00 AM – 5:00 PM (Daily Field Traffic Operations)",
    phone: "0936-829-4691",
    email: "tmcmalaybalay2014@gmail.com",
    onlinePortalUrl: "https://sakata.malaybalaycity.gov.ph/ordinance-no-1095-series-of-2026/",
    onlinePortalLabel: "View Ordinance 1095 s. 2026 Fare Matrix & TMC Guide",
    epaymentChannel: "City Treasurer’s Office Cashier (New City Hall)",
    transactions: [
      {
        id: "tmc-motorela-citation",
        title: "Motorela Franchise / Mayor’s Permit, Fare Matrix Tariff (Ordinance 1095 s. 2026) & Traffic Citation Settlement",
        processingTime: "15–30 minutes for Traffic Clearance / Citation · 1–3 working days for Franchise Renewal",
        feeSchedule: "Per Malaybalay Traffic Code & Ordinance No. 1095, Series of 2026",
        requirements: [
          "LTO Official Receipt (OR) and Certificate of Registration (CR) of the motorela unit",
          "TMC Roadworthiness / Stencil Inspection Report and TODA/Association endorsement",
          "Traffic Citation Ticket (TOP/TCT) for traffic violation settlement",
        ],
        steps: [
          "Present the motorela unit for roadworthiness inspection at the Traffic Management Center (TMC) on Fortich Street.",
          "Pay the assessed franchise, sticker, or citation fee at the City Treasurer’s Office and claim your official Fare Matrix (Ordinance No. 1095 s. 2026).",
        ],
        actionUrl: "https://sakata.malaybalaycity.gov.ph/ordinance-no-1095-series-of-2026/",
        actionLabel: "View Ordinance 1095 s. 2026",
      },
    ],
    source: {
      label: "City Government of Malaybalay — TMC & Ordinance No. 1095 s. 2026",
      url: "https://sakata.malaybalaycity.gov.ph/ordinance-no-1095-series-of-2026/",
      verifiedOn: VERIFIED_ON,
    },
  },
];

const BARANGAY_HALL_SUPPORTED_CATEGORIES = new Set([
  "certificates-ids",
  "business-trade",
  "social-services",
  "disaster-weather",
  "health",
  "housing",
]);

function buildDynamicBarangayProvider(
  categorySlug: string,
  barangaySlug: string,
): ServiceProvider | null {
  if (!BARANGAY_HALL_SUPPORTED_CATEGORIES.has(categorySlug)) return null;
  const profile =
    barangayMicrositeBySlug.get(barangaySlug) ??
    barangayMicrosites.find((item) => item.slug === barangaySlug);
  if (!profile) return null;

  const centroid = MALAYBALAY_CENTROIDS[profile.code];
  const coords: [number, number] = centroid
    ? [centroid[1], centroid[0]]
    : MALAYBALAY_CITY_CENTER_COORDS;

  return {
    id: `brgy-hall-${profile.slug}-${categorySlug}`,
    categorySlug,
    name: `Barangay ${profile.name} Hall — Office of Punong Barangay ${profile.punongBarangay}`,
    shortName: `Brgy. ${profile.name} Hall`,
    jurisdiction: "Barangay Hall",
    address: `Barangay Hall, Barangay ${profile.name} (${profile.classification} · PSGC ${profile.code}), Malaybalay City, 8700 Bukidnon`,
    barangay: profile.name,
    coordinates: coords,
    hours: "Mon–Fri · 8:00 AM – 5:00 PM (BDRRMC & Tanod Desk on Call)",
    phone: profile.phone,
    email: profile.email,
    onlinePortalUrl: `https://bettermc.ph/barangays/${profile.slug}`,
    onlinePortalLabel: `Open Barangay ${profile.name} Official Directory`,
    epaymentChannel: `Barangay Treasurer of Barangay ${profile.name} (₱0.00 Free for RA 11261 First-Time Jobseekers & Indigency Certificates)`,
    transactions: [
      {
        id: `brgy-clearance-${profile.slug}`,
        title: `Barangay ${profile.name} Clearance, Certificate of Residency, Indigency & Business Endorsement`,
        processingTime: "15–30 minutes at the Barangay Secretary & Treasurer desk",
        feeSchedule: "₱0.00 for Certificate of Indigency & First-Time Jobseekers (RA 11261) · ₱50.00–₱150.00 standard barangay clearance fee",
        requirements: [
          `Valid ID or Purok Leader endorsement confirming residence in Barangay ${profile.name}`,
          "Current Community Tax Certificate (Cedula)",
          "Signed Oath of Undertaking (if claiming RA 11261 First-Time Jobseeker fee exemption)",
        ],
        steps: [
          `Proceed to the Barangay ${profile.name} Hall and present your Purok clearance or valid ID to Barangay Secretary ${profile.officialRoster.barangaySecretary.name}.`,
          "Pay the statutory clearance fee to the Barangay Treasurer (or present First-Time Jobseeker / Indigency request for ₱0.00 fee).",
          `Claim your signed certification attested by Punong Barangay ${profile.punongBarangay}.`,
        ],
        actionUrl: `/barangays/${profile.slug}#services`,
        actionLabel: `Open Brgy. ${profile.name} Profile`,
      },
      {
        id: `brgy-mediation-${profile.slug}`,
        title: "Katarungang Pambarangay (Lupong Tagapamayapa) Mediation, VAWC Desk & BDRRMC Referral",
        processingTime: "Same-day blotter/intake and Lupon summons scheduling",
        feeSchedule: "₱0.00 (Free statutory barangay justice and VAWC protection desk)",
        requirements: [
          "Written or verbal complaint statement with names and addresses of parties within Malaybalay City",
        ],
        steps: [
          `File your request at Barangay ${profile.name} Hall with Punong Barangay ${profile.punongBarangay} or the Desk Officer.`,
          "Attend the scheduled mediation/conciliation hearing before filing any court action under RA 7160.",
        ],
        actionUrl: `/barangays/${profile.slug}#leadership`,
        actionLabel: `View Brgy. ${profile.name} Officials`,
      },
    ],
    source: profile.leadershipSource,
  };
}

export function getProvidersForCategory(
  categorySlug: string,
  originCoords: [number, number] = MALAYBALAY_CITY_CENTER_COORDS,
  selectedBarangaySlug?: string,
): RankedServiceProvider[] {
  const baseProviders = VERIFIED_SERVICE_PROVIDERS.filter(
    (provider) => provider.categorySlug === categorySlug,
  );
  const dynamicBrgy =
    selectedBarangaySlug && selectedBarangaySlug !== "city-center"
      ? buildDynamicBarangayProvider(categorySlug, selectedBarangaySlug)
      : null;

  const combined = dynamicBrgy ? [dynamicBrgy, ...baseProviders] : baseProviders;

  const ranked = combined
    .map((provider) => {
      const distanceKm = computeDistanceKm(
        originCoords[0],
        originCoords[1],
        provider.coordinates[0],
        provider.coordinates[1],
      );
      return {
        ...provider,
        distanceKm,
        estimatedDriveMinutes: estimateTravelMinutes(distanceKm),
        googleMapsUrl: buildGoogleMapsPlaceUrl(provider.name, provider.address),
        isNearest: false,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  if (ranked.length > 0) {
    ranked[0].isNearest = true;
  }
  return ranked;
}

export function getAllRankedProviders(
  originCoords: [number, number] = MALAYBALAY_CITY_CENTER_COORDS,
): RankedServiceProvider[] {
  const ranked = VERIFIED_SERVICE_PROVIDERS.map((provider) => {
    const distanceKm = computeDistanceKm(
      originCoords[0],
      originCoords[1],
      provider.coordinates[0],
      provider.coordinates[1],
    );
    return {
      ...provider,
      distanceKm,
      estimatedDriveMinutes: estimateTravelMinutes(distanceKm),
      googleMapsUrl: buildGoogleMapsPlaceUrl(provider.name, provider.address),
      isNearest: false,
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  if (ranked.length > 0) {
    ranked[0].isNearest = true;
  }
  return ranked;
}

export const localServicePathways = [
  {
    title: "Business permits and local compliance",
    office: "Business Permits and Licensing Office",
    description:
      "Check requirements, processing steps, fees, and the responsible office before beginning a local business transaction.",
    href: "/services/business-trade",
    external: false,
  },
  {
    title: "Civil registry and certificates",
    office: "City Civil Registry Office",
    description:
      "Find the published city contact, then confirm the correct record, documentary requirements, and release process.",
    href: "/services/certificates-ids",
    external: false,
  },
  {
    title: "Health and dental assistance",
    office: "City Health Office",
    description:
      "Use the published office and emergency channels for public-health, dental, and referral inquiries.",
    href: "/services/health",
    external: false,
  },
  {
    title: "Social welfare and assistance",
    office: "City Social Welfare and Development Office",
    description:
      "Confirm assistance programs, eligibility, documents, and referral routes with the responsible city office.",
    href: "/services/social-services",
    external: false,
  },
  {
    title: "Building forms and permits",
    office: "Office of the Building Official",
    description:
      "Open the city’s printable forms and verify the current submission process before filing.",
    href: "/services/housing",
    external: false,
  },
  {
    title: "Emergency and incident response",
    office: "Citywide response offices",
    description:
      "Call the appropriate Malaybalay response office and provide your barangay, landmark, and callback number.",
    href: "/services/disaster-weather",
    external: false,
  },
] as const;
