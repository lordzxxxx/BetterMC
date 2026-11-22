import type { Source } from "./data";
import { CITIZENS_CHARTER_2026_URL, PESO_CHARTER_SERVICES_2026, PESO_FACEBOOK_PAGE_URL } from "./pesoData";

export type OfficeCategory =
  | "Executive & Legislative"
  | "Employment & Livelihood"
  | "Finance & Administration"
  | "Health & Social Welfare"
  | "Public Safety & Emergency"
  | "Infrastructure, Housing & Planning"
  | "Agriculture, Environment & Tourism"
  | "Civil Registry, Permits & Community"
  | "National & Partner Agencies";

export type OfficeServiceGuide = {
  title: string;
  description?: string;
  classification?: string;
  processingTime: string;
  fee: string;
  whoMayAvail?: string;
  requirements?: string[];
  steps?: string[];
  reference?: string;
};

export type OfficeProgramItem = {
  title: string;
  summary: string;
  eligibility?: string;
};

export type GovernmentOffice = {
  slug: string;
  aliases?: string[];
  name: string;
  shortName: string;
  acronym: string;
  classification: string;
  parentOffice?: string;
  category: OfficeCategory;
  subdomainHost: string;
  subdomainUrl: string;
  logoPath?: string;
  logoStatus: "Verified Local Asset" | "Pending Verification" | "Unavailable";
  logoSourceUrl?: string;
  headOfOffice?: string;
  headNote?: string;
  overview: string;
  cardSummary?: string;
  cardLocation?: string;
  aboutDetails?: string;
  whoServes?: string;
  mandate: string;
  divisions?: string[];
  address: string;
  barangay: string;
  coordinates?: [number, number];
  mapQuery: string;
  operatingHours: string;
  phoneNumbers: string[];
  emails: string[];
  facebookUrl?: string;
  officialWebUrl: string;
  services: OfficeServiceGuide[];
  programs: OfficeProgramItem[];
  verificationNote?: string;
  charterChapterRef?: string;
  sources: Source[];
};

export type LocalSpecialBody = {
  id: string;
  name: string;
  executiveOrder: string;
  year: string;
  leadOfficeSlug: string;
  leadOfficeName: string;
  mandateSummary: string;
  sourceUrl: string;
};

const VERIFIED_DATE = "2026-11-22";
const SAKATA_DEPARTMENTS_URL = "https://sakata.malaybalaycity.gov.ph/departments-offices/";
const SAKATA_CONTACT_URL = "https://sakata.malaybalaycity.gov.ph/contact-us/";
const SAKATA_CHARTER_URL = "https://sakata.malaybalaycity.gov.ph/citizens-charter/";
const SAKATA_SPECIAL_BODIES_URL = "https://sakata.malaybalaycity.gov.ph/local-special-bodies-and-special-committees/";
const SAKATA_SP_URL = "https://sakata.malaybalaycity.gov.ph/spoffice/";
const SAKATA_ADMIN_URL = "https://sakata.malaybalaycity.gov.ph/city-administrators-office/";
const CITY_MAIN_FB_URL = "https://www.facebook.com/profile.php?id=100063747444247";
const NEW_CITY_HALL_COORDS: [number, number] = [8.1282, 125.1342];

export const MAIN_BETTERMC_URL = "https://www.bettermalaybalay.cloud";

export function formatOfficeMicrositeUrl(slug: string): string {
  return `https://${slug}.bettermalaybalay.cloud`;
}

export function officeDirectoryPath(office: Pick<GovernmentOffice, "slug">): string {
  return office.slug === "peso" ? "/peso" : `/offices/${office.slug}`;
}

const ccSource = (chapter: string): Source => ({
  label: `City Government of Malaybalay — Citizen's Charter 2026 (1st Ed.), ${chapter}`,
  url: CITIZENS_CHARTER_2026_URL,
  verifiedOn: VERIFIED_DATE,
});

const sakataSource = (label: string, url = SAKATA_DEPARTMENTS_URL): Source => ({
  label,
  url,
  verifiedOn: VERIFIED_DATE,
});

const officeBase = (
  slug: string,
  rest: Omit<GovernmentOffice, "slug" | "subdomainHost" | "subdomainUrl" | "mapQuery">,
): GovernmentOffice => ({
  slug,
  subdomainHost: `${slug}.bettermalaybalay.cloud`,
  subdomainUrl: `https://${slug}.bettermalaybalay.cloud`,
  mapQuery: `${rest.address}, Malaybalay City, Bukidnon`,
  ...rest,
});

export const OFFICE_CATEGORIES: OfficeCategory[] = [
  "Executive & Legislative",
  "Employment & Livelihood",
  "Finance & Administration",
  "Health & Social Welfare",
  "Public Safety & Emergency",
  "Infrastructure, Housing & Planning",
  "Agriculture, Environment & Tourism",
  "Civil Registry, Permits & Community",
  "National & Partner Agencies",
];

export const governmentOffices: GovernmentOffice[] = [
  // 1. PESO MALAYBALAY (Featured Employment Hub)
  officeBase("peso", {
    aliases: ["peso-malaybalay", "employment"],
    name: "Public Employment Service Office — Malaybalay City",
    shortName: "PESO Malaybalay",
    acronym: "PESO",
    classification: "City Mayor's Office — Division / Non-Fee-Charging Multi-Employment Service Facility",
    parentOffice: "Office of the City Mayor (City Administrator's Office Wing)",
    category: "Employment & Livelihood",
    logoPath: "/images/offices/peso.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: CITIZENS_CHARTER_2026_URL,
    headOfOffice: "Atty. Anna Marie R. Bergado (PESO Manager / City Administrator)",
    headNote: "Cited as PESO Manager in DOLE-10 2024–2025 regional dispatches and City Administrator in sakata.malaybalaycity.gov.ph.",
    overview:
      "Created under the Public Employment Service Office Act (RA 8759, as amended by RA 10691), PESO Malaybalay serves as the City Government's primary non-fee-charging employment facilitation hub linking local jobseekers, students, displaced workers, OFWs, and employers.",
    cardSummary:
      "Links Malaybalay jobseekers, students, displaced workers, and OFWs to verified jobs and DOLE livelihood programs.",
    cardLocation: "2nd Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "Operating from the 2nd Floor of New City Hall under No Noon Break Citizen's Charter standards, PESO Malaybalay administers National Skills Registration Program (NSRP) profiling, Employer LRA/SRA accreditation, SPES summer work stipends with DOLE Region 10, livelihood endorsement certifications, 4th-year OJT placement, and direct referral assistance for OFWs and their families.",
    whoServes:
      "Malaybalay City jobseekers, senior high/college students, Out-of-School Youth, OFW families, barangay livelihood groups, and DOLE-cleared employers.",
    mandate:
      "Provide prompt, timely, and efficient employment information, job matching and referral, Local/Special Recruitment Activity coordination, SPES & Work Appreciation Program implementation, livelihood endorsement, student OJT placement, Career Guidance Advocacy, Job Fair management, and OFW welfare referral to DMW and OWWA.",
    divisions: [
      "Jobseeker Registration & PEIS Matching Desk",
      "Employer Accreditation, LRA/SRA & Job Fair Unit",
      "SPES / WAP & Career Guidance Advocacy Desk",
      "Livelihood & OFW Support Referral Desk (DMW / OWWA)",
    ],
    address: "2nd Floor, New City Hall, National Highway, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM (No Noon Break per RA 11032; except holidays)",
    phoneNumbers: ["0907-688-5735", "0915-542-3434", "0912-163-5505"],
    emails: ["pesomalaybalaycity@gmail.com"],
    facebookUrl: PESO_FACEBOOK_PAGE_URL,
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/contact-us/",
    services: PESO_CHARTER_SERVICES_2026.map((s) => ({
      title: `${s.number}. ${s.title}`,
      classification: s.classification,
      processingTime: s.processingTime,
      fee: s.fee,
      whoMayAvail: s.whoMayAvail,
      requirements: s.requirements,
      steps: s.steps,
      reference: s.charterPageRef,
    })),
    programs: [
      {
        title: "NSRP Jobseeker Registration & Job Matching",
        summary: "Free registration in DOLE's PESO Employment Information System (PEIS) and referral to vetted employers within 15 minutes.",
        eligibility: "Malaybalay City residents and Bukidnon jobseekers.",
      },
      {
        title: "DOLE–LGU SPES & Work Appreciation Program",
        summary: "Paid summer/break employment for deserving poor students and Out-of-School Youth.",
        eligibility: "Malaybalay students / OSY meeting DOLE income and grade standards.",
      },
      {
        title: "Livelihood Endorsement for Low-Income Earners",
        summary: "Assesses and endorses individuals and associations for DOLE DILEEP/Kabuhayan and partner livelihood grants.",
        eligibility: "Qualified low-income residents or registered community associations.",
      },
      {
        title: "Overseas Filipino Workers (DMW / OWWA) Support Desk",
        summary: "Walk-in counseling, documentation profiling, and agency endorsement for OFWs and families.",
        eligibility: "OFWs and direct family members in Malaybalay City.",
      },
      {
        title: "DOLE–LGU TUPAD Community Emergency Employment Coordination",
        summary: "Coordinates emergency community work orientations and beneficiary endorsements with DOLE Bukidnon and barangays.",
        eligibility: "Displaced, underemployed, or seasonal workers endorsed via partner barangays.",
      },
      {
        title: "Bukidnon PESO Managers' Council (BPMC) & Regional Job Matching",
        summary: "Connects Malaybalay jobseekers with provincial Bukidnon job fair sourcing and DOLE Region 10 labor advisories.",
        eligibility: "NSRP-registered jobseekers and accredited local employers.",
      },
      {
        title: "Malaybalay City College Scholarship Cross-Referral (Community Affairs)",
        summary: "Links incoming college scholars (parents' net income ≤ ₱250,000) with PESO Career Guidance and OJT placements.",
        eligibility: "Bonafide Malaybalay City students coordinated via CMO – Community Affairs Division.",
      },
    ],
    charterChapterRef: "CMO - PESO 2026 (pp. 530–546 / PDF pp. 549–565)",
    sources: [
      ccSource("CMO — Public Employment Service Office (pp. 549–565)"),
      sakataSource("City Government of Malaybalay — Contact Directory", SAKATA_CONTACT_URL),
      { label: "PESO Malaybalay Official Facebook Page", url: PESO_FACEBOOK_PAGE_URL, verifiedOn: VERIFIED_DATE },
    ],
  }),

  // 2. OFFICE OF THE CITY MAYOR
  officeBase("mayor", {
    aliases: ["city-mayor", "cmo"],
    name: "Office of the City Mayor",
    shortName: "City Mayor's Office",
    acronym: "CMO",
    classification: "Executive Department — Office of the Local Chief Executive",
    category: "Executive & Legislative",
    logoPath: "/images/offices/city-mayor.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Hon. Jay Warren R. Pabillaran (City Mayor)",
    overview:
      "Central executive nerve center of the City Government of Malaybalay overseeing general supervision of city departments, barangay coordination, executive orders, local special bodies, and attached mayor's divisions (BPLD, PESO, Tourism, CUDHO, OSCA, TMC, BAC, Community Affairs).",
    cardSummary:
      "Directs City Government executive operations, barangay coordination, executive orders, and attached service divisions.",
    cardLocation: "2nd Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "Under the Local Government Code (RA 7160), the Office of the City Mayor directs citywide executive policy across Security and Safety (S), Health and Sanitation (H), Integrity (I), Environment & Culture Protection (E), Eco-Agri Tourism (L), and Infrastructure Development (D), while housing citizen-facing service units on both floors of New City Hall.",
    whoServes:
      "All 46 barangays, executive department heads, civil society partners, residents requesting executive clearances, and local special bodies.",
    mandate:
      "Exercise general supervision and control over all programs, projects, services, and activities of the city government pursuant to the Local Government Code (RA 7160).",
    divisions: [
      "Executive Support & Correspondence Unit",
      "Procurement Support Section (Bids & Awards Committee)",
      "Business Permits & Licensing Division (BPLD)",
      "Public Employment Service Office (PESO)",
      "Community Affairs Division (Scholarships, Purok Dev't & CSO Desk)",
      "Office of the Senior Citizens Affairs (OSCA)",
      "City Tourism Division & Traffic Management Center (TMC)",
      "City Urban Development & Housing Division (CUDHO)",
      "Agricultural & Biosystems Engineering Division (CMO-ABED) & LEDIPO",
      "Special Support Services Division (Malaybalay City Band)",
    ],
    address: "2nd Floor, New City Hall, National Highway, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM (except holidays)",
    phoneNumbers: ["(088) 813-4726 Local 107–109", "(088) 813-4725 / 813-4761 Local 107", "0953-459-1777"],
    emails: ["malaybalaycitylgu@gmail.com"],
    facebookUrl: CITY_MAIN_FB_URL,
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/mayors-corner/",
    services: [
      {
        title: "Mayor's Clearance Issuance (via CMO Community Affairs)",
        description: "Official municipal clearance certifying good local standing for employment, business, or legal requirements.",
        classification: "Simple",
        processingTime: "24 Minutes",
        fee: "₱130.00",
        whoMayAvail: "Malaybalay City residents requiring local executive clearance",
        requirements: [
          "Barangay Clearance from your barangay in Malaybalay City",
          "Police Clearance (PNP) or Court / Fiscal Clearance (for employment or legal use)",
          "Current Community Tax Certificate (Cedula)",
          "Official Receipt from the City Treasurer’s Office (₱130.00)",
        ],
      },
      {
        title: "Official Appointments, Executive Endorsements & Barangay Assistance",
        description: "Handles requests for audiences with the City Mayor, project endorsements, and inter-agency coordination across all 46 barangays.",
        classification: "Simple",
        processingTime: "Subject to Mayor's schedule & completeness",
        fee: "None",
        whoMayAvail: "Barangay officials, national agencies, CSOs, and citizens",
      },
      {
        title: "Attached CMO Citizen Desks (BPLD, PESO, Community Affairs, OSCA, CUDHO, TMC & Tourism)",
        description: "Routes business permits, job matching, scholarships, Senior Citizen IDs, housing relocation, and traffic clearances to dedicated ground- and second-floor counters.",
        classification: "Frontline Referral",
        processingTime: "Per attached division charter standard",
        fee: "Per division schedule",
        whoMayAvail: "Residents, students, businesses, and community groups",
      },
    ],
    programs: [
      { title: "Executive Orders & Local Special Bodies Stewardship", summary: "Issues and reconstitutes local special bodies covering peace and order, health, housing, tourism, investments, and anti-red tape (CART)." },
      { title: "Attached Citizen Service Divisions", summary: "Directly houses Community Affairs (Scholarships & CSOs), PESO, BPLD, Tourism, TMC, and OSCA." },
    ],
    sources: [
      sakataSource("sakata.malaybalaycity.gov.ph — Departments & Offices"),
      sakataSource("sakata.malaybalaycity.gov.ph — Contact Us", SAKATA_CONTACT_URL),
      ccSource("List of Offices Appendix (p. 728)"),
    ],
  }),

  // 3. CITY ADMINISTRATOR'S OFFICE
  officeBase("admin", {
    aliases: ["city-administrator", "cado"],
    name: "City Administrator's Office",
    shortName: "City Administrator",
    acronym: "CAdO",
    classification: "Executive Department — Management, Public Information & MIS Supervision",
    parentOffice: "Office of the City Mayor",
    category: "Executive & Legislative",
    logoPath: "/images/offices/city-administrator.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Atty. Anna Marie R. Bergado (City Administrator)",
    headNote: "Assisted by Jeanyben M. Dacalanio (Assistant City Administrator).",
    overview:
      "Manages day-to-day administrative coordination across all City Government offices and directly houses the Public Information Division (Banwag Newsletter / Banwag sa Dakbayan / 8888 Citizen Complaint Hotline) and Management Information Systems (MIS) Division.",
    cardSummary:
      "Coordinates day-to-day City Hall administration and houses the Public Information (Banwag) and MIS divisions.",
    cardLocation: "2nd Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "Serving both internal City Hall operations and public feedback channels under RA 11032, the City Administrator's Office oversees City Hall digital networks, IEC publications, official ID printing, Committee on Anti-Red Tape (CART) compliance, and Citizen's Charter monitoring across 26 documented transactions.",
    whoServes:
      "City Hall departments, citizens filing 8888 or CART service feedback, Senior Citizens needing pocket IDs, academic researchers, and media partners.",
    mandate:
      "Develop plans and strategies on management and administrative programs, assist in coordinating all city departments, enforce anti-red tape compliance, operate public information channels, and maintain City Government IT/MIS infrastructure.",
    divisions: [
      "Administrative Support Division",
      "Organization Development Division",
      "Public Information Division (Banwag Quarterly Newsletter, Banwag sa Dakbayan, 8888 Citizen Hotline)",
      "Management Information Systems (MIS) Division (Software Dev, Network, Hardware, Biometrics)",
    ],
    address: "2nd Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0917-188-4225", "(088) 813-4726 / 813-4761 Local 105", "(088) 813-4706 / 813-4707"],
    emails: ["imalaybalay.8700@gmail.com", "cadodmo.malaybalaycity@gmail.com", "cadodmo.malaybalay@gmail.com"],
    facebookUrl: "https://www.facebook.com/lgumalaybalay.adminfo/",
    officialWebUrl: SAKATA_ADMIN_URL,
    services: [
      {
        title: "Publication of City News & Announcements (PID)",
        description: "Reviews and publishes official advisories, announcements, and public notices on official City Government channels.",
        classification: "Simple",
        processingTime: "5 Hours",
        fee: "None",
      },
      {
        title: "8888 Citizens' Complaint Hotline Facilitation",
        description: "Logs, endorses to the concerned city department, and tracks resolution of public complaints from the national 8888 portal.",
        classification: "Complex",
        processingTime: "56 Hours & 25 Minutes",
        fee: "None",
        whoMayAvail: "Citizens and national/local government agencies",
      },
      {
        title: "Senior Citizens Pocket ID & CGM Employee ID Issuance",
        description: "Prints pocket identification cards for Malaybalay Senior Citizens and ARTA-compliant employee IDs.",
        classification: "Simple",
        processingTime: "20 Minutes",
        fee: "None",
      },
      {
        title: "Research Activity Clearance & Data Request Endorsement",
        description: "Evaluates academic and external research proposals involving City Government offices or local data.",
        classification: "Simple",
        processingTime: "24 Minutes",
        fee: "None",
        whoMayAvail: "Students, researchers, and general public",
      },
      {
        title: "Approval of Official City Documents & Policy Coordination",
        description: "Reviews vouchers, leave applications, activity designs, purchase requests, and administrative reforms across City Hall.",
        classification: "Simple / Complex",
        processingTime: "1 Hour & 50 Minutes",
        fee: "None",
      },
      {
        title: "Banwag Newsletter, IEC Materials & Tarpaulin Printing (Internal / Inter-Agency)",
        description: "Produces public information campaigns, photo/video documentation, and event tarpaulins for city offices.",
        classification: "Complex",
        processingTime: "3 – 85 Days",
        fee: "None",
      },
      {
        title: "MIS Technical Support (Software, Hardware, Network, Server & Biometrics)",
        description: "Maintains City Hall servers, office networks, IPABX phone lines, biometric enrollment, and in-house software systems.",
        classification: "Simple / Technical",
        processingTime: "4 Minutes – 7 Hours & 45 Minutes",
        fee: "None",
      },
    ],
    programs: [
      { title: "Banwag Quarterly Newsletter & Banwag sa Dakbayan", summary: "Official municipal print and broadcast public information updates produced by the Public Information Division." },
      { title: "8888 Citizens' Complaint Desk & CART Compliance", summary: "Receives, routes, and tracks citizen complaints and ARTA Citizen's Charter updates across city offices." },
    ],
    charterChapterRef: "ADMIN 2026 (pp. 37–82 — 24 Citizen's Charter services)",
    sources: [
      ccSource("ADMIN 2026 (pp. 37–82 & p. 728)"),
      sakataSource("City Administrator's Office Profile", SAKATA_ADMIN_URL),
    ],
  }),

  // 4. SANGGUNIANG PANLUNGSOD OFFICE & SECRETARIAT
  officeBase("sp", {
    aliases: ["sangguniang-panlungsod", "council"],
    name: "Office of the Sangguniang Panlungsod & SP Secretariat",
    shortName: "Sangguniang Panlungsod",
    acronym: "SP",
    classification: "Legislative Branch — City Council & Legislative Secretariat",
    category: "Executive & Legislative",
    logoPath: "/images/offices/sangguniang-panlungsod.jpg",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Atty. Phoebe Corazon C. Hidalgo (SP Secretary) • Hon. Estelito \"Litoy\" R. Marabe (Presiding Officer)",
    headNote: "Assisted by Marilou T. Sinues (Assistant SP Secretary) and Jennifer T. Sombilon (City Library, Librarian II).",
    overview:
      "The legislative lawmaking body of the City of Malaybalay (11 Councilors + ABC & SK Federation Presidents + IP Representative) supported by the SP Secretariat, Research Division, Records/Legislative Service Division, City Library, and People's Law Enforcement Board (PLEB) Secretariat.",
    cardSummary:
      "Enacts city ordinances and resolutions through the 14-member council, SP Secretariat, City Library, and PLEB.",
    cardLocation: "SP Building, City Hall Compound, Casisang",
    aboutDetails:
      "Located in the Sangguniang Panlungsod Building inside the City Hall Compound, the SP Secretariat records session journals, releases certified copies of enacted City Ordinances and Resolutions, tracks barangay legislative reviews, operates the Malaybalay City Public Library, and administers civilian PLEB clearances.",
    whoServes:
      "Citizens requesting ordinances or PLEB clearances, researchers & students using the City Library, CSOs seeking legislative accreditation, and all 46 Barangay Councils.",
    mandate:
      "Enact ordinances, approve resolutions, appropriate city funds, review barangay ordinances/resolutions, conduct quasi-judicial PLEB hearings, and safeguard official legislative journals and ordinances for public inspection.",
    divisions: [
      "Office of the Secretary to the Sanggunian & Executive Unit",
      "Malaybalay City Public Library (Records & Reading Room)",
      "Legislative Research Division",
      "Records & Legislative Service Division",
      "People's Law Enforcement Board (PLEB) Secretariat",
    ],
    address: "Sangguniang Panlungsod Building, City Hall Compound, Barangay Casisang, Malaybalay City",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: [
      "(088) 813-4350",
      "0917-479-6861",
      "0917-497-6861",
      "(088) 813-3205",
      "0916-510-4673",
      "0917-821-1954",
      "0967-608-8932",
      "0991-846-1148",
      "0906-919-6042",
      "0926-428-8698",
    ],
    emails: ["spmalaybalaycity@gmail.com"],
    facebookUrl: "https://www.facebook.com/CityofMalaybalaySP/",
    officialWebUrl: SAKATA_SP_URL,
    services: [
      {
        title: "Issuance of Certificate of Appearance",
        description: "Certifies attendance during Sangguniang Panlungsod sessions or official office transactions.",
        classification: "Simple",
        processingTime: "4 Minutes",
        fee: "None",
      },
      {
        title: "Certified Copies of SP Minutes or Journal of Proceedings",
        description: "Releases certified excerpts of Sangguniang Panlungsod session minutes and journals upon approval.",
        classification: "Simple",
        processingTime: "46 Minutes",
        fee: "None",
        requirements: [
          "Written request letter specifying the session date, topic, or agenda item",
          "Valid government-issued ID of the requesting party or authorized representative",
        ],
      },
      {
        title: "Certified Copies of Approved Ordinances & Resolutions",
        description: "Provides official copies of enacted City Ordinances and Council Resolutions to citizens and offices.",
        classification: "Simple",
        processingTime: "16 Minutes",
        fee: "None",
        requirements: [
          "Ordinance or Resolution number, title, or year requested",
          "1 valid government-issued ID for request logging",
        ],
      },
      {
        title: "Status Updates on Referrals & Legislative Communications",
        description: "Provides tracking updates on petitions, referrals, and committee actions filed with the City Council.",
        classification: "Simple",
        processingTime: "22 Minutes",
        fee: "None",
      },
      {
        title: "Issuance of PLEB Clearance (PNP Personnel)",
        description: "Certifies whether a PNP member has any pending or resolved administrative case before the People's Law Enforcement Board.",
        classification: "Simple",
        processingTime: "33 Minutes",
        fee: "None",
      },
      {
        title: "PLEB Administrative Hearings & Stenographic Notes",
        description: "Receives civilian complaints against PNP officers, conducts PLEB hearings, and issues case stenographic notes.",
        classification: "Complex",
        processingTime: "6 Minutes – 5 Days (notes)",
        fee: "None",
      },
      {
        title: "Certification of Accreditation (CSOs & NGOs)",
        description: "Issues official accreditation certificates to City Council-recognized NGOs and Civil Society Organizations.",
        classification: "Simple",
        processingTime: "33 Minutes",
        fee: "None",
      },
      {
        title: "City Public Library Research & Reading Services",
        description: "Offers free access to reference books, research materials, and reading room support for students and residents.",
        classification: "Simple",
        processingTime: "5 Minutes (check-in / loan)",
        fee: "None",
      },
      {
        title: "Legislative Review of Barangay Ordinances & Resolutions",
        description: "Reviews measures submitted by Malaybalay's 46 barangays for compliance with the Local Government Code (RA 7160).",
        classification: "Complex",
        processingTime: "31 Days & 15 Minutes",
        fee: "None",
      },
    ],
    programs: [
      { title: "Regular Council Sessions & Public Committee Hearings", summary: "Open legislative deliberations on city tax measures, land-use zoning, appropriations, and local welfare ordinances." },
      { title: "PLEB Administrative Oversight (EO 9)", summary: "Secretariat supporting civilian complaints and clearances involving PNP personnel." },
    ],
    charterChapterRef: "SP 2026 (pp. 711–727)",
    sources: [
      ccSource("Sangguniang Panlungsod (pp. 711–728)"),
      sakataSource("Sangguniang Panlungsod Office Page", SAKATA_SP_URL),
    ],
  }),

  // 5. OFFICE OF THE CITY VICE MAYOR
  officeBase("vice-mayor", {
    aliases: ["cvm", "cvm-office"],
    name: "Office of the City Vice Mayor",
    shortName: "Vice Mayor's Office",
    acronym: "CVMO",
    classification: "Legislative Executive — Presiding Officer of the Sangguniang Panlungsod",
    category: "Executive & Legislative",
    logoPath: "/images/offices/sangguniang-panlungsod.jpg",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Hon. Estelito \"Litoy\" R. Marabe (City Vice Mayor)",
    overview:
      "Serves as Presiding Officer of the Sangguniang Panlungsod, leads the legislative branch secretariat, coordinates committee referrals, and facilitates constituent legislative consultations and requests.",
    cardSummary:
      "Presides over the Sangguniang Panlungsod, oversees legislative secretariat staff, and manages committee referrals.",
    cardLocation: "SP Building, City Hall Compound, Casisang",
    aboutDetails:
      "Working directly alongside regular Council sessions and standing committees in the Sangguniang Panlungsod Building, the Office of the City Vice Mayor routes proposed ordinances, monitors committee hearings, and assists Malaybalay residents seeking legislative endorsement or consultation.",
    whoServes:
      "Constituents requesting legislative consultation, barangay officials coordinating ordinance reviews, and standing Sanggunian committees.",
    mandate:
      "Preside over Sangguniang Panlungsod sessions, sign warrants for legislative expenditures, appoint legislative staff subject to civil service rules, and assume executive duties when mandated by law.",
    divisions: [
      "Office of the City Vice Mayor",
      "Presiding Officer's Legislative Support Desk",
      "Constituent Consultation & Committee Referral Unit",
    ],
    address: "Sangguniang Panlungsod Building, City Hall Compound, Barangay Casisang, Malaybalay City",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0917-128-8087", "(088) 813-5940", "0917-142-4773"],
    emails: ["spmarabe@gmail.com"],
    facebookUrl: "https://www.facebook.com/CityofMalaybalaySP/",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/legislative/",
    services: [
      {
        title: "Constituent Legislative Proposals & Assistance Endorsements",
        description: "Receives citizen proposals, petitions, and requests for endorsement or legislative coordination.",
        classification: "Simple",
        processingTime: "During office hours",
        fee: "None",
      },
      {
        title: "Committee Referral & Presiding Officer Sign-Off",
        description: "Tracks referral of proposed measures to SP committees and routes approved minutes, ordinances, and resolutions.",
        classification: "Legislative",
        processingTime: "Session cycle (16–22 mins for certified copy release)",
        fee: "None",
      },
    ],
    programs: [
      { title: "10th Sangguniang Panlungsod Legislative Agenda", summary: "Steers public consultations, ordinance drafting, and legislative transparency alongside 13 council members." },
    ],
    sources: [
      sakataSource("sakata.malaybalaycity.gov.ph — Legislative Page", "https://sakata.malaybalaycity.gov.ph/legislative/"),
      sakataSource("sakata.malaybalaycity.gov.ph — Contact Us", SAKATA_CONTACT_URL),
    ],
  }),

  // 6. CMO - COMMUNITY AFFAIRS DIVISION (Scholarships & CSOs)
  officeBase("community-affairs", {
    aliases: ["scholarships", "cmo-community-affairs"],
    name: "CMO — Community Affairs Division (Scholarships & CSO Desk)",
    shortName: "Community Affairs",
    acronym: "CMO-CAD",
    classification: "City Mayor's Office — Division (Scholarships, Purok Devt & CSO Accreditation)",
    parentOffice: "Office of the City Mayor",
    category: "Civil Registry, Permits & Community",
    logoPath: "/images/offices/malaybalay-city-seal.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: CITIZENS_CHARTER_2026_URL,
    headOfOffice: "Venus G. Palalay (Community Affairs Officer IV)",
    headNote: "Division under the Office of the City Mayor (supervised by CMO – Community Affairs Officer).",
    overview:
      "Directly serves puroks, barangays, civil society organizations (CSOs), NGOs, and college students under the City Mayor's Office—administering the Malaybalay City Scholarship Program, Mayor's Clearance issuance, Sports Assistance, and CSO Accreditation.",
    cardSummary:
      "Administers the Malaybalay City Scholarship Program, Mayor's Clearances, sports aid, and CSO accreditation.",
    cardLocation: "2nd Floor, New City Hall (Mayor's Wing)",
    aboutDetails:
      "Stationed at the City Mayor's Office Wing inside New City Hall, the Community Affairs Division bridges neighborhood development projects across Malaybalay's 46 barangays with youth educational grants (requiring parent annual net income ≤ ₱250,000), Mayor's Clearances for employment/compliance, and formal CSO accreditation.",
    whoServes:
      "Malaybalay City college scholars, barangay & purok leaders, local sports groups, job applicants needing Mayor's Clearance, and NGOs/CSOs.",
    mandate:
      "Process Barangay Purok Development projects, evaluate new and continuing City Scholars, accredit NGOs/CSOs for Local Special Body participation, and issue Mayor's Clearances.",
    divisions: [
      "Administrative Support & Clearance Unit",
      "Community Relations & Barangay / Purok Development Section",
      "Special Barangay Development & City Scholarship Section",
      "Civil Society Organization (CSO) Accreditation Desk",
    ],
    address: "2nd Floor, New City Hall (City Mayor's Wing), Barangay Casisang, Malaybalay City",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0910-156-6938"],
    emails: ["malaybalaycitylgu@gmail.com"],
    facebookUrl: CITY_MAIN_FB_URL,
    officialWebUrl: SAKATA_CHARTER_URL,
    services: [
      {
        title: "1. City Scholarship Program — New Scholar Application",
        classification: "Simple",
        processingTime: "32 Minutes",
        fee: "None",
        reference: "Charter pp. 536–540",
        requirements: [
          "Accomplished Malaybalay City Scholarship Application Form",
          "Grade 12 Report Card / latest academic grades (average 83% or higher, no grade below 80)",
          "Barangay Certificate of Residency and Indigency",
          "Parents' Income Tax Return (ITR) or Certificate of Tax Exemption (annual net income not exceeding ₱250,000)",
        ],
      },
      { title: "2. City Scholarship Program — Existing Scholar Renewal & Incentive Allowance", classification: "Simple", processingTime: "14 – 21 Minutes", fee: "None" },
      {
        title: "3. Issuance of Mayor's Clearance",
        classification: "Simple",
        processingTime: "24 Minutes",
        fee: "₱130.00",
        requirements: [
          "Barangay Clearance from your barangay in Malaybalay City",
          "Police Clearance (PNP) or Court / Fiscal Clearance (for employment or legal use)",
          "Current Community Tax Certificate (Cedula)",
          "Official Receipt from the City Treasurer’s Office (₱130.00)",
        ],
      },
      { title: "4. Civil Society Organization (CSO) Accreditation", classification: "Simple", processingTime: "5 Days & 20 Minutes", fee: "None" },
      { title: "5. Barangay Purok Development Project & Sports Assistance", classification: "Simple / Gov", processingTime: "32 Minutes – 22 Working Days", fee: "None" },
    ],
    programs: [
      {
        title: "Malaybalay City College Scholarship Program",
        summary: "Educational grant for qualifying exam passers with Grade 12 average ≥83% (no grade <80) whose parents' annual net income does not exceed ₱250,000 (with I.P. tribal certification support).",
        eligibility: "Qualified bonafide Malaybalay City students.",
      },
      { title: "CSO / NGO Accreditation", summary: "Qualifies civil society groups to sit on Local Special Bodies (CDC, Health Board, Peace & Order, etc.)." },
      { title: "Medical Education Subsidy Committee (EO No. 17, s. 2026)", summary: "Coordinates city medical education subsidy screening and guidelines alongside CMO and partner institutions." },
    ],
    charterChapterRef: "CMO - COMMUNITY AFFAIRS 2026 (pp. 531–548)",
    sources: [
      ccSource("CMO — Community Affairs Division (pp. 531–548)"),
      sakataSource("Citizen's Charter 2026 Portal", SAKATA_CHARTER_URL),
      sakataSource("Executive Order No. 17, s. 2026 (Medical Education Subsidy Committee)", "https://sakata.malaybalaycity.gov.ph/executive-order-no-17/"),
    ],
  }),

  // 7. CMO - OFFICE OF THE SENIOR CITIZENS AFFAIRS (OSCA)
  officeBase("osca", {
    aliases: ["senior-citizens", "cmo-senior"],
    name: "Office of the Senior Citizens Affairs (OSCA)",
    shortName: "OSCA Senior Affairs",
    acronym: "OSCA",
    classification: "City Mayor's Office — Special Affairs Division (RA 9994)",
    parentOffice: "Office of the City Mayor",
    category: "Health & Social Welfare",
    logoPath: "/images/offices/malaybalay-city-seal.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: CITIZENS_CHARTER_2026_URL,
    headOfOffice: "Rene Cipriano (OSCA Head / Coordinator)",
    headNote: "OSCA Head appointed by the City Mayor pursuant to Republic Act No. 9994.",
    overview:
      "Dedicated division under the City Mayor's Office implementing the Expanded Senior Citizens Act (RA 9994) through rapid Senior Citizen ID issuance, medicine/grocery discount booklets, and elderly welfare referrals.",
    cardSummary:
      "Issues Senior Citizen IDs, medicine and grocery discount booklets, and RA 9994 elderly welfare referrals.",
    cardLocation: "City Hall Compound, Brgy. Casisang",
    aboutDetails:
      "Residents aged 60 years and older—or authorized representatives carrying a valid ID and authorization—transact directly at the OSCA desk inside New City Hall Compound to obtain nationwide 20% discount IDs and purchase slip booklets within 15–30 minutes at zero cost.",
    whoServes:
      "Senior citizens aged 60+ residing in Malaybalay City, authorized family representatives, and barangay senior citizen associations.",
    mandate:
      "Protect the rights and privileges of elderly Malaybalay residents aged 60+ by maintaining the senior citizens registry, issuing IDs and purchase slip booklets, and coordinating social pension and centenarian benefits.",
    divisions: [
      "Senior Citizens ID Issuance & Registry Unit",
      "Medicine & Grocery Purchase Booklet Counter",
      "Elderly Welfare & Social Pension Coordination Desk",
    ],
    address: "New City Hall Compound, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0955-194-5584", "0935-568-4362"],
    emails: ["imalaybalay.8700@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/citizens-charter/",
    services: [
      {
        title: "1. Issuance of Senior Citizens Identification Card (ID)",
        classification: "Simple",
        processingTime: "30 Minutes",
        fee: "None",
        whoMayAvail: "All senior citizens (60 years & above) residing in Malaybalay City",
        requirements: [
          "1 valid government-issued ID",
          "Barangay Certificate of Residency in Malaybalay City",
          "Current Community Tax Certificate (Cedula)",
          "PSA Birth Certificate (or official proof of age 60+)",
          "Accomplished OSCA Senior Citizen ID Application Form",
          "2 pcs 1x1 ID photo",
        ],
        reference: "Charter pp. 566–568",
      },
      {
        title: "2. Issuance of Senior Citizens Medicine & Grocery Purchase Booklet",
        classification: "Simple",
        processingTime: "15 – 30 Minutes",
        fee: "None",
        requirements: [
          "Senior Citizen OSCA ID Card",
          "Signed Authorization Letter + valid ID if requested by a representative",
        ],
        reference: "Charter pp. 569–571",
      },
    ],
    programs: [
      { title: "RA 9994 20% Senior Discount & VAT-Exemption Documentation", summary: "Equips elderly residents with recognized Senior Citizen IDs and purchase slip booklets nationwide." },
    ],
    charterChapterRef: "CMO - SENIOR 2026 (pp. 566–571)",
    sources: [ccSource("CMO — Office of the Senior Citizens Affairs (pp. 566–571)")],
  }),

  // 8. CITY HUMAN RESOURCE MANAGEMENT OFFICE (CHRMO)
  officeBase("chrmo", {
    aliases: ["hrmo"],
    name: "City Human Resource Management Office",
    shortName: "CHRMO (HR Office)",
    acronym: "CHRMO",
    classification: "Executive Department — Civil Service & City Personnel Administration",
    category: "Finance & Administration",
    logoPath: "/images/offices/chrmo.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Magnolia O. Improgo (City Government Department Head I — CHRMO)",
    overview:
      "Manages City Government workforce recruitment (CSC Form No. 9 publications), plantilla administration, PRIME-HRM compliance, training and development, service records, and employee benefits.",
    cardSummary:
      "Manages City Hall workforce recruitment (CSC Form No. 9), plantilla records, PRIME-HRM, and employee benefits.",
    cardLocation: "2nd Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "Based on the 2nd Floor of New City Hall, CHRMO receives Personal Data Sheet (CS Form No. 212) submissions during open CSC plantilla publication windows, maintains employee service histories, issues certificates of employment, and oversees merit-based promotion boards.",
    whoServes:
      "City Hall job applicants (CSC Form No. 9), active and retired LGU employees, department heads, and university internship coordinators.",
    mandate:
      "Formulate and administer personnel programs, merit selection and placement under Civil Service Commission rules, employee welfare, leave and retirement processing, and HR recordkeeping.",
    divisions: [
      "Personnel Administration Division (Recruitment & Selection / Records Management Section)",
      "Career & Performance Management Division (Personnel Transactions / Training & Development)",
    ],
    address: "2nd Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0975-601-2867", "(088) 813-4726 / 813-4761 Local 113"],
    emails: ["malaybalaychrmo@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/job-opportunities-2/",
    services: [
      {
        title: "City Government Plantilla Job Application Intake (CSC Form No. 9)",
        description: "Evaluates job applications and Personal Data Sheets for vacant plantilla positions at City Hall.",
        classification: "Simple / CSC",
        processingTime: "25 Minutes intake (15-day CSC publication window)",
        fee: "None",
        requirements: [
          "Application Letter addressed to the City Mayor through the City HRMO (Magnolia O. Improgo)",
          "Fully accomplished Personal Data Sheet (CS Form No. 212, Revised 2017) with Work Experience Sheet",
          "Performance rating in the last rating period (if applicable)",
          "Photocopy of Certificate of Eligibility / PRC Rating / License",
          "Photocopy of Transcript of Records",
        ],
      },
      {
        title: "Issuance of Service Record, Certificate of Employment (COE) & Employee ID",
        description: "Issues certified employment records for active and separated City Hall employees.",
        classification: "Simple",
        processingTime: "15 Minutes (ID) – 1 Hour (COE / Service Record)",
        fee: "None",
      },
      {
        title: "Leave Application Processing (Vacation / Sick / Special / Terminal / Monetization)",
        description: "Evaluates leave credits, travel-abroad authority, RA 9710 Magna Carta leave, and 50% or terminal leave monetization.",
        classification: "Simple / Complex",
        processingTime: "30 Minutes – 2 Days, 1 Hour & 20 Minutes",
        fee: "None",
      },
      {
        title: "Payroll, RATA, Bonuses, NOSA/NOSI & GSIS Online Loan Confirmation",
        description: "Prepares employee payrolls, salary adjustments (NOSA/NOSI), loan deductions, and e-GSIS loan endorsements.",
        classification: "Simple / Complex",
        processingTime: "20 Minutes (GSIS) – 3 Days (NOSA/NOSI)",
        fee: "None",
      },
      {
        title: "Employee Feedback / Complaints & Orientation / Training Requests",
        description: "Receives personnel grievances (20 mins) and coordinates office skills-development orientations (45 mins).",
        classification: "Simple",
        processingTime: "20 – 45 Minutes",
        fee: "None",
      },
    ],
    programs: [
      { title: "Civil Service Merit & Plantilla Recruitment (CS Form No. 9)", summary: "Publishes authorized vacant permanent City Hall plantilla positions with transparent qualification standards and salary grades." },
    ],
    sources: [
      sakataSource("CHRMO Contact & Departments Directory", SAKATA_CONTACT_URL),
      { label: "LGU Malaybalay CS Form No. 9 Publication (4th Tranche)", url: "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2025/04/CS-Form-No-9-Publication-2024-4th-Tranche-1-1.pdf", verifiedOn: VERIFIED_DATE },
    ],
  }),

  // 9. CITY LEGAL OFFICE
  officeBase("legal", {
    aliases: ["city-legal"],
    name: "City Legal Office",
    shortName: "City Legal Office",
    acronym: "CLO",
    classification: "Executive Department — Municipal Legal Counsel & Litigation",
    category: "Executive & Legislative",
    logoPath: "/images/offices/city-legal.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Atty. Julius Michael G. Barroso (City Legal Officer)",
    headNote: "Research, Investigation & Legal Assistance Division led by Atty. Alfredo G. Cape, Jr. (City Legal Officer IV).",
    overview:
      "Chief legal counsel of the City Government of Malaybalay drafting contracts, reviewing ordinances and barangay legal queries, representing the city in court/administrative cases, and rendering legal opinions.",
    cardSummary:
      "Serves as City Government legal counsel reviewing contracts, ordinances, barangay legal queries, and court cases.",
    cardLocation: "2nd Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "Supporting both City Hall departments and barangay councils from the 2nd Floor of New City Hall, the City Legal Office examines municipal contracts, Memoranda of Agreement, administrative complaints, and statutory compliance matters prior to executive action.",
    whoServes:
      "City departments, barangay captains and secretaries seeking contract/MOA review, and residents with official administrative legal queries.",
    mandate:
      "Represent the City in all civil actions and special proceedings, formulate measures to advance human rights and public accountability, inspect contracts, and investigate official administrative complaints.",
    divisions: [
      "Administrative Support Division",
      "Research, Investigation & Legal Assistance Division",
    ],
    address: "2nd Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0916-414-7427", "(088) 813-4726 Local 101", "0954-301-0253"],
    emails: ["clo8134706@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/citylegaloffice/",
    services: [
      {
        title: "Legal Consultancy & Walk-In Assistance",
        description: "Provides legal advice on City Government operations and guides walk-in residents on available legal remedies.",
        classification: "Simple",
        processingTime: "25 Minutes",
        fee: "None",
      },
      {
        title: "Preparation & Review of Deeds, Contracts and MOAs",
        description: "Drafts and reviews contracts, Deeds, and Memoranda of Agreement involving the City Government and barangays.",
        classification: "Complex",
        processingTime: "3 Days, 4 Hours & 32 Minutes",
        fee: "None",
      },
      {
        title: "Written Legal Opinions (Simple & Complex)",
        description: "Issues formal written legal opinions on statutory queries from City Hall departments and barangay councils.",
        classification: "Complex / Technical",
        processingTime: "3 – 7 Days, 1 Hour & 40 Minutes",
        fee: "None",
      },
      {
        title: "Notarial Services & Sworn Statements / Affidavits",
        description: "Notarizes City Government MOAs, contracts, and deeds (20 mins) and prepares official LGU affidavits (1 hour).",
        classification: "Simple",
        processingTime: "20 Minutes – 1 Hour",
        fee: "None",
      },
      {
        title: "Executive Issuances, Office Orders & Official Legal Communications",
        description: "Drafts and vets executive orders and administrative issuances for the Office of the City Mayor.",
        classification: "Simple",
        processingTime: "1 Day & 58 Minutes",
        fee: "None",
      },
    ],
    programs: [
      { title: "Barangay Legal & Ordinance Review Support", summary: "Advises barangay councils and city departments on statutory compliance under RA 7160." },
    ],
    charterChapterRef: "CITY LEGAL 2026 (pp. 442–457)",
    sources: [
      sakataSource("City Legal Office Page", "https://sakata.malaybalaycity.gov.ph/citylegaloffice/"),
      ccSource("City Legal Office (pp. 442–457 & p. 729)"),
    ],
  }),

  // 10. CITY PLANNING AND DEVELOPMENT OFFICE
  officeBase("cpdo", {
    aliases: ["planning"],
    name: "City Planning and Development Office",
    shortName: "Planning & Dev't (CPDO)",
    acronym: "CPDO",
    classification: "Executive Department — Comprehensive Land Use, Zoning & Development Planning",
    category: "Infrastructure, Housing & Planning",
    logoPath: "/images/offices/cpdo.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Engr. Adrian R. Gamboa (City Planning & Development Coordinator)",
    headNote: "Assisted by Maria Rosario G. Saldua (Assistant City Planning & Development Coordinator).",
    overview:
      "Coordinates citywide socio-economic planning, Comprehensive Land Use Plan (CLUP) enforcement, locational clearances, zoning certifications, and residential subdivision permit evaluations.",
    cardSummary:
      "Leads city socio-economic planning, Comprehensive Land Use Plan (CLUP) enforcement, and zoning clearances.",
    cardLocation: "2nd Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "Applicants constructing commercial structures, residences, or subdivision projects secure CPDO Locational Clearances and Zoning Certifications on the 2nd Floor of New City Hall prior to OBO Building Permit or BPLD Business Permit approval. CPDO also houses the city's GIS and Data Management sections.",
    whoServes:
      "Property owners, architects/engineers applying for building/locational clearances, real estate developers, and all 46 barangay investment planners.",
    mandate:
      "Formulate integrated economic, social, physical, and fiscal development plans; act as Secretariat to the City Development Council; and enforce the City Zoning Ordinance.",
    divisions: [
      "Administrative Unit",
      "Planning, Information Management, Monitoring & Evaluation Division (Data Management & GIS Sections)",
      "Zoning Administration & Enforcement Division",
    ],
    address: "2nd Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: [
      "0917-110-7717",
      "0997-491-8757",
      "0926-842-6446",
      "(088) 813-3772",
      "(088) 813-4726 Local 102",
      "0917-834-5539",
      "0917-885-6997",
      "0955-811-2419",
      "0997-142-0315",
    ],
    emails: ["cpdomalaybalay@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/city-planning-and-development-office/",
    services: [
      {
        title: "Zoning Certification (CLUP Land Use Classification)",
        description: "Certifies the zoning classification of a lot based on the approved Comprehensive Land Use Plan and Zoning Ordinance.",
        classification: "Simple",
        processingTime: "55 Minutes",
        fee: "₱920.00",
        requirements: [
          "Certified True Copy of OCT/TCT Land Title, Tax Declaration, and current Real Property Tax Receipt",
          "Vicinity Map / Lot Plan signed by a Geodetic Engineer showing exact lot location",
          "1 valid government-issued ID or Authorization Letter (if representative)",
        ],
      },
      {
        title: "Locational Clearance (Simple Projects — 1–3 Storeys up to 1,500 sq.m.)",
        description: "Clears residential, commercial, and institutional construction routed from OBO for zoning compliance.",
        classification: "Simple",
        processingTime: "Per Building Permit queue",
        fee: "Per Zoning Fee Schedule",
        requirements: [
          "Accomplished CPDO Locational Clearance Application Form",
          "Certified True Copy of OCT/TCT Land Title, Tax Declaration, and current Real Property Tax Receipt",
          "Barangay Construction Clearance",
          "Site Development Plan and Architectural Floor Plans",
        ],
      },
      {
        title: "Locational Clearance (Complex Projects)",
        description: "Evaluates large commercial, industrial, or institutional development proposals against city zoning rules.",
        classification: "Complex",
        processingTime: "2 Days, 3 Hours & 16 Minutes",
        fee: "Per Zoning Fee Schedule",
      },
      {
        title: "Preliminary, Final & Alteration Subdivision Development Plan Permits (PSDP / SDP)",
        description: "Reviews housing subdivision and memorial park plans with the Technical Working Group before construction.",
        classification: "Highly Technical",
        processingTime: "12 Days – 38 Days",
        fee: "Per Schedule",
      },
    ],
    programs: [
      { title: "City Development Council (EO 229) & CLUP Governance", summary: "Secretariat coordinating barangay and sectoral Annual Investment Programs (AIP)." },
    ],
    charterChapterRef: "CPDO 2026 (pp. 603–619)",
    sources: [
      ccSource("CPDO 2026 (pp. 603–619 & p. 728)"),
      sakataSource("CPDO Page", "https://sakata.malaybalaycity.gov.ph/city-planning-and-development-office/"),
    ],
  }),

  // 11. CITY BUDGET OFFICE
  officeBase("budget", {
    aliases: ["cbo", "city-budget"],
    name: "City Budget Office",
    shortName: "City Budget Office",
    acronym: "CBO",
    classification: "Executive Department — Municipal Appropriations & Barangay Budget Review",
    category: "Finance & Administration",
    logoPath: "/images/offices/city-budget.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Ronny B. Gamao (City Budget Officer)",
    headNote: "City Budget Operations Division headed by Mary Grace R. Alenton (Budget Officer IV).",
    overview:
      "Oversees preparation and execution of Malaybalay City's Annual & Supplemental Budgets, certifies fund obligations (OBR/POs), and reviews the annual budgets of all 46 barangays.",
    cardSummary:
      "Prepares annual executive budgets, certifies fund obligations (OBR/POs), and reviews 46 barangay budgets.",
    cardLocation: "2nd Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "Stationed on the 2nd Floor of New City Hall, the City Budget Office validates eBudget Obligation Requests for payrolls, utilities, financial assistance, and supplier claims while performing preliminary technical reviews of annual and supplemental budgets submitted by Malaybalay's 46 barangays.",
    whoServes:
      "All 46 barangay treasurers/councils, City Hall departments, suppliers awaiting OBR certification, and transparency researchers.",
    mandate:
      "Prepare forms, orders, and circulars for annual executive budget preparation, certify appropriation availability prior to disbursements, and assist the Sangguniang Panlungsod in reviewing barangay budgets.",
    divisions: [
      "Administrative Unit",
      "City Budget Operations Division",
      "City Budget Preparation Section",
      "Review and Execution Section (City & 46 Barangays)",
    ],
    address: "2nd Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["(088) 813-4726 / 813-4716 Local 112"],
    emails: ["cbomlybly@gmail.com"],
    facebookUrl: "https://www.facebook.com/cbomalaybalaypage/",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/city-budget-office/",
    services: [
      { title: "Obligation Request (OBR) for Purchase Orders & Claims", processingTime: "2 Hours & 5 Minutes", fee: "None", reference: "Charter pp. 177–187" },
      { title: "Preliminary Review of Barangay Annual & Supplemental Budgets (46 Barangays)", processingTime: "8 Days & 3 Hours", fee: "None" },
      { title: "Preparation of the City Annual Executive Budget", processingTime: "114 Calendar Days", fee: "None" },
    ],
    programs: [
      { title: "Local Budget Execution & Full Disclosure Tracking", summary: "Monitors sectoral appropriations across General Public Services, Social Services, Economic Services, and 20% Development Fund." },
    ],
    charterChapterRef: "CBO 2026 (pp. 177–187)",
    sources: [
      ccSource("City Budget Office (pp. 177–187 & p. 728)"),
      sakataSource("City Budget Office Page", "https://sakata.malaybalaycity.gov.ph/city-budget-office/"),
    ],
  }),

  // 12. CITY ACCOUNTING OFFICE
  officeBase("accounting", {
    aliases: ["city-accounting", "cacco"],
    name: "City Accounting Office",
    shortName: "City Accounting",
    acronym: "CAccO",
    classification: "Executive Department — Pre-Audit, Internal Control & Financial Reporting",
    category: "Finance & Administration",
    logoPath: "/images/offices/city-accounting.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Carlito R. Juarez, CPA (City Accountant)",
    headNote: "Assisted by Ramiel B. Coscos, CPA (Assistant City Accountant).",
    overview:
      "Maintains City and Barangay books of accounts under COA New Government Accounting System rules, pre-audits disbursement vouchers, reconciles bank accounts, and issues BIR tax certificates and financial statements.",
    cardSummary:
      "Maintains City and barangay accounts under COA rules, pre-audits vouchers, and issues BIR tax certificates.",
    cardLocation: "2nd Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "On the 2nd Floor of New City Hall, City Accounting teams examine disbursement vouchers prior to City Treasurer check release, issue Accountant's Advices for barangay transactions, compile monthly bank reconciliations, and release BIR withholding tax certificates and employee net take-home pay certifications.",
    whoServes:
      "Barangay treasurers/captains, City Hall suppliers & contractors, employees needing pay/tax certificates, and Commission on Audit (COA) reviewers.",
    mandate:
      "Install and maintain internal audit systems, prepare and submit city and barangay financial statements to COA, issue Accountant's Advices, and certify net take-home pay.",
    divisions: [
      "Administrative Support Division",
      "City Financial Accounting Services Division (Accounts & Subsidiary Recap)",
      "City Financial Auditing Services Division",
      "Barangay Financial Accounting Services Division",
    ],
    address: "2nd Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["(088) 813-4726 / 813-4761 Local 110", "0969-298-8264"],
    emails: ["cacco.malaybalay@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/city-accounting-office/",
    services: [
      {
        title: "Pre-Audit of Disbursement Vouchers & Accountant's Advice",
        description: "Audits vouchers prior to check issuance (4 hrs) and transmits bank advices authorizing city payments (3 hrs).",
        classification: "Simple / Complex",
        processingTime: "3 – 4 Hours",
        fee: "None",
      },
      {
        title: "Certificate of Net Take-Home Pay & BIR Tax Certificates",
        description: "Issues salary deduction certifications (2 hrs) and VAT/income withholding tax certificates for staff and suppliers (1.5 hrs).",
        classification: "Simple",
        processingTime: "1 Hour 30 Mins – 2 Hours",
        fee: "None",
      },
      {
        title: "Travel Cash Advance Computation & Statutory Agency Remittances",
        description: "Computes official travel cash advances (3 hrs) and remits GSIS, BIR, PhilHealth, Pag-IBIG, and SSS deductions.",
        classification: "Simple / Complex",
        processingTime: "3 Hours – 10 Days",
        fee: "None",
      },
      {
        title: "City & 46-Barangay Financial Transactions, Bank Reconciliation & Statements",
        description: "Processes barangay accounting entries (2 hrs), bank reconciliations, and COA financial statements.",
        classification: "Simple / Technical",
        processingTime: "2 Hours (txn) – 30 Days (FS)",
        fee: "None",
      },
    ],
    programs: [
      { title: "COA Full Disclosure Financial Statements", summary: "Compiles quarterly and annual Balance Sheets, Statements of Income & Expenses, and Cash Flows for City and 46 Barangays." },
    ],
    charterChapterRef: "ACCOUNTING 2026 (pp. 20–36)",
    sources: [
      ccSource("City Accounting Office (pp. 20–36 & p. 729)"),
      sakataSource("City Accounting Page", "https://sakata.malaybalaycity.gov.ph/city-accounting-office/"),
    ],
  }),

  // 13. CITY TREASURER'S OFFICE
  officeBase("treasurer", {
    aliases: ["city-treasurer", "cto"],
    name: "City Treasurer's Office",
    shortName: "City Treasurer",
    acronym: "CTO",
    classification: "Executive Department — Local Revenue Collection & Cash Disbursement",
    category: "Finance & Administration",
    logoPath: "/images/offices/city-treasurer.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Bella Stephanie B. Saavedra, CPA (City Treasurer)",
    headNote: "Supervised by the City Treasurer across 1st Floor Cashier Windows & BOSS One-Stop Counter.",
    overview:
      "Collects Real Property Tax, Business Taxes, Transfer Tax, Professional Tax, Community Tax Certificates (Cedula), and regulatory fees—and disburses supplier checks, financial assistance, and payroll.",
    cardSummary:
      "Collects real property tax, business taxes, and Cedulas, and disburses supplier checks and payroll.",
    cardLocation: "1st Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "Located on the Ground (1st) Floor of New City Hall across Windows 1–12, the City Treasurer's Office processes Cedula issuance in 8 minutes, accepts Real Property Tax and quarterly business payments, settles TMC traffic citations, and releases approved financial assistance and supplier checks.",
    whoServes:
      "Taxpayers, business owners, property buyers/sellers, licensed professionals paying PTR, and check payees.",
    mandate:
      "Advise the City Mayor and Sangguniang Panlungsod on local revenue disposition, take custody and exercise proper management of city funds, and issue official tax clearances.",
    divisions: ["Revenue Generation Division", "Cash & Disbursement Division", "Administrative Division"],
    address: "1st Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0997-452-5920", "0956-457-9134", "(088) 813-4726 / 813-4761 Local 119"],
    emails: ["citytreasurermalaybalay@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/departments-offices/",
    services: [
      {
        title: "Issuance of Community Tax Certificate (Cedula)",
        description: "Issues individual or corporate Community Tax Certificates required for employment, clearances, and transactions.",
        classification: "Simple",
        processingTime: "8 Minutes",
        fee: "₱5.00 basic + earnings/property assessment",
        requirements: [
          "Valid ID and gross income/receipts declaration (for Community Tax Certificate / Cedula)",
          "Signed Oath of Undertaking (if claiming RA 11261 First-Time Jobseeker fee exemption)",
        ],
      },
      {
        title: "Real Property Tax Payment & Tax Clearance Certificate",
        description: "Accepts annual or quarterly Real Property Tax (10% prompt / 20% advance discount) and issues Tax Clearances.",
        classification: "Simple",
        processingTime: "15 – 20 Minutes",
        fee: "1% Basic + 1% SEF of Assessed Value; ₱100/page + ₱30 doc stamp clearance",
        requirements: [
          "Previous Real Property Tax Official Receipt or Tax Declaration Number (ARP/TD No.)",
          "1 valid government-issued ID",
        ],
      },
      {
        title: "Quarterly Business Tax, Transfer Tax & Professional Tax (PTR)",
        description: "Collects quarterly business tax renewals (Ord. 880), real property transfer tax, and annual Professional Tax Receipts.",
        classification: "Simple",
        processingTime: "5 – 10 Minutes",
        fee: "75% of 1% (Transfer); ₱300.00 (PTR); Business Tax per worksheet",
      },
      {
        title: "Regulatory Fees & Traffic Violation Settlements",
        description: "Collects civil registry fees, clearances, certification fees, and traffic citation penalties.",
        classification: "Simple",
        processingTime: "5 Minutes",
        fee: "₱100.00 standard certs / Per City Ordinance No. 900",
      },
      {
        title: "Financial Assistance, Payroll & Supplier Check Release",
        description: "Disburses approved indigent aid, employee allowances/payroll, and supplier/contractor checks.",
        classification: "Simple",
        processingTime: "5 – 10 Minutes",
        fee: "None",
      },
    ],
    programs: [
      { title: "Electronic Revenue Collection & BOSS One-Stop Counter", summary: "Operates ground-floor cashier windows during business renewal season alongside BPLD and OBO." },
    ],
    charterChapterRef: "CTO 2026 (pp. 655–674 & p. 729)",
    sources: [
      ccSource("City Treasurer's Office (pp. 655–674 & p. 729)"),
      sakataSource("Departments & Contact Directory", SAKATA_CONTACT_URL),
    ],
  }),

  // 14. CITY ASSESSOR'S OFFICE
  officeBase("assessor", {
    aliases: ["city-assessor", "casso"],
    name: "City Assessor's Office",
    shortName: "City Assessor",
    acronym: "CAssO",
    classification: "Executive Department — Real Property Appraisal, Mapping & Tax Declarations",
    category: "Finance & Administration",
    logoPath: "/images/offices/city-assessor.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: CITIZENS_CHARTER_2026_URL,
    headOfOffice: "Atty. Mitchell D. Talatala (City Assessor)",
    headNote: "Assisted by Maylyn T. Gantalao (Assistant City Assessor).",
    overview:
      "Maintains Malaybalay City's master real property assessment rolls, tax maps, and property records across all 46 barangays—issuing Tax Declarations, ownership transfers, subdivisions, and Certified True Copies.",
    cardSummary:
      "Maintains master real property tax maps and rolls across all 46 barangays and issues Tax Declarations.",
    cardLocation: "1st Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "Situated on the 1st Floor of New City Hall near CTO tax windows, the City Assessor's Office maintains parcel tax mapping, evaluates new buildings and machinery for fair market valuation, and verifies Tax Declaration histories before real property sales or transfers.",
    whoServes:
      "Landowners, homeowners, surveyors, real estate buyers, banks requiring property certifications, and heirs processing estate transfers.",
    mandate:
      "Ensure laws and policies governing real property appraisal and assessment for taxation are fairly, uniformly, and accurately executed across agricultural, residential, commercial, and industrial parcels.",
    divisions: [
      "Administrative Support Unit",
      "Appraisal & Assessment Services Division (Appraisal, Assessment & Transfer Sections)",
      "Tax Mapping Operations Division (Maintenance & Field Operations Sections)",
      "Records Management Section",
    ],
    address: "1st Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0916-335-5178", "0936-148-9604", "(088) 813-4726 Local 121"],
    emails: ["cassomalaybalay@gmail.com"],
    facebookUrl: "https://www.facebook.com/cassomalaybalay2020/",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/city-assessorss-office/",
    services: [
      {
        title: "Certified True Copy of Tax Declaration (With/No Improvement)",
        description: "Issues an official Certified True Copy of Tax Declaration and Field Assessment Appraisal Sheet (FAAS).",
        classification: "Simple",
        processingTime: "1 Hour & 50 Minutes",
        fee: "₱100.00 / parcel",
        requirements: [
          "Tax Declaration Number or OCT/TCT Title Number",
          "Current Real Property Tax Official Receipt from the City Treasurer’s Office",
          "Valid ID or Special Power of Attorney / Authorization Letter",
        ],
      },
      {
        title: "Total Landholding Certificate (Estate Tax / DAR Clearance / Exempt)",
        description: "Certifies aggregate property holdings or no-improvement status for estate settlement or agrarian clearance.",
        classification: "Simple",
        processingTime: "50 Minutes – 2 Hours & 25 Minutes",
        fee: "₱100.00 (Exempt for qualified requests)",
      },
      {
        title: "Tax Declaration History Verification & Tax Map Issuance",
        description: "Verifies ownership/assessment history of a parcel, locates properties on the tax map, or prints Tax Maps.",
        classification: "Simple",
        processingTime: "19 Minutes (location) – 2 Hours & 55 Minutes",
        fee: "₱100.00 (Free for location lookup / Gov't exempt)",
      },
      {
        title: "Mortgage / Loan / Bail Bond Annotation & Cancellation",
        description: "Annotates or cancels real estate mortgages and bail bonds on existing property Tax Declarations.",
        classification: "Simple",
        processingTime: "2 Hours",
        fee: "Annotation by mortgage amount / Cancellation fee",
      },
      {
        title: "Transfer, Segregation, Consolidation & Newly Discovered Property Appraisal",
        description: "Issues updated Tax Declarations after ownership transfer, subdivision, building appraisal, or field reclassification.",
        classification: "Complex",
        processingTime: "1 – 7 Working Days (per inspection)",
        fee: "₱100.00 (transfer/inspection); None for new conform",
      },
    ],
    programs: [
      { title: "Tax Mapping & General Revision Modernization", summary: "GIS parcel alignment across urban Poblacion districts and rural agricultural barangays." },
    ],
    charterChapterRef: "Assessors 2026 (pp. 132–176 & p. 729)",
    sources: [
      ccSource("City Assessor's Office (pp. 132–176 & p. 729)"),
      sakataSource("City Assessor's Office Page", "https://sakata.malaybalaycity.gov.ph/city-assessorss-office/"),
    ],
  }),

  // 15. CITY GENERAL SERVICES OFFICE
  officeBase("gso", {
    aliases: ["cgso"],
    name: "City General Services Office",
    shortName: "General Services (CGSO)",
    acronym: "CGSO",
    classification: "Executive Department — Supply Custody, Property Inventory & Facilities",
    category: "Finance & Administration",
    logoPath: "/images/offices/cgso.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Dioscora R. Niere, CPA (CGSO-Designate)",
    overview:
      "Central custodian of City Government real and personal properties, supplies warehousing, records custody, vehicle fleet dispatch, and municipal building upkeep.",
    cardSummary:
      "Custodian of City Government properties, supplies warehousing, records, vehicle dispatch, and building upkeep.",
    cardLocation: "2nd Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "Operating from the 2nd Floor of New City Hall, CGSO verifies supplier deliveries through Inspection and Acceptance Reports alongside BAC, tracks property custodian acknowledgments across City departments, and releases Inventory Transfer Reports (ITR) to barangays.",
    whoServes:
      "City Hall employees requesting property clearances, accredited LGU suppliers delivering equipment, and all 46 barangay supply custodians.",
    mandate:
      "Take custody of and be accountable for all city properties, collate supply requisitions, perform physical inventory with the Inventory Committee, and maintain government buildings and facilities.",
    divisions: [
      "Records, Property & Inventory Division",
      "Warehouse & Inspection Division",
      "Public Services, Custodial & Facility Care Section",
    ],
    address: "2nd Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: [
      "0935-750-5371",
      "(088) 813-4726 / 813-4761 Local 104",
      "0955-193-8246",
      "0916-360-1138",
      "0917-140-5820",
      "0966-675-2034",
      "0917-777-1134",
    ],
    emails: ["malaybalaycgso@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/city-general-services-office/",
    services: [
      {
        title: "Property Accountability Clearance & Return Slip",
        description: "Clears retiring or transferring City Hall and national employees of property custody or drops unserviceable items.",
        classification: "Simple",
        processingTime: "3 Hours 18 Minutes – 1 Day 7 Hours",
        fee: "None",
      },
      {
        title: "Release of Supplies & Materials (City Warehouse & Supply Depot)",
        description: "Issues requisitioned supplies and equipment to recognized barangay and LGU claimants.",
        classification: "Simple",
        processingTime: "1 Hour & 48 Minutes",
        fee: "None",
      },
      {
        title: "Preparation of Delivery Inspection Report",
        description: "Verifies supplier deliveries against approved Purchase Orders for City Government payments.",
        classification: "Simple",
        processingTime: "20 Minutes",
        fee: "None",
      },
      {
        title: "Plumbing, Airconditioning, Electrical & Janitorial Maintenance",
        description: "Dispatches CGSO maintenance technicians for City Hall offices and government establishments.",
        classification: "Simple",
        processingTime: "8 Hours & 25 Minutes",
        fee: "None",
      },
    ],
    programs: [
      { title: "City Inventory & Records Management Committees (EO 34 / 39 / 58)", summary: "Maintains transparent government asset registries and annual property audits." },
    ],
    charterChapterRef: "CGSO 2026 (pp. 345–353)",
    sources: [
      ccSource("CGSO 2026 (pp. 345–353 & p. 728)"),
      sakataSource("City General Services Office Page", "https://sakata.malaybalaycity.gov.ph/city-general-services-office/"),
    ],
  }),

  // 16. CITY CIVIL REGISTRY OFFICE
  officeBase("ccro", {
    aliases: ["civil-registry"],
    name: "City Civil Registry Office",
    shortName: "Civil Registry (CCRO)",
    acronym: "CCRO",
    classification: "Executive Department — Vital Events Registration & Civil Records",
    category: "Civil Registry, Permits & Community",
    logoPath: "/images/offices/ccro.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Arnel S. Alagenio (OIC City Civil Registrar • Concurrent EA V at BPLD)",
    headNote: "Led by the City Civil Registrar at 1st Floor, New City Hall (Charter pp. 188–250).",
    overview:
      "Records all births, marriages, and deaths occurring in Malaybalay City; processes Marriage Licenses, Delayed Registrations, Legitimation, and RA 9048 / RA 10172 petitions for clerical error correction.",
    cardSummary:
      "Registers births, marriages, and deaths in Malaybalay and processes marriage licenses and RA 9048 corrections.",
    cardLocation: "1st Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "Accessible on the Ground Floor of New City Hall, the City Civil Registry Office handles hospital-borne and home-birth registrations, mandatory 10-day Marriage License postings, administrative name/date-of-birth corrections under RA 9048/10172, and free barangay mobile outreach registrations.",
    whoServes:
      "Parents registering newborns, couples applying for marriage licenses, bereaved families filing death certificates, and residents correcting PSA civil records.",
    mandate:
      "Implement Civil Registry Law (Act 3753), RA 9048, RA 10172, and Family Code mandates to maintain authentic civil status archives and transmit endorsements to the Philippine Statistics Authority (PSA).",
    divisions: [
      "Birth, Marriage & Death Vital Events Registration Division",
      "Delayed Registration, Legitimation & Marriage License Unit",
      "RA 9048 / RA 10172 Administrative Correction & PSA Endorsement Unit",
      "Civil Registry Transcriptions & Certified Copy Archive",
    ],
    address: "1st Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0906-616-4009", "0917-888-1392", "(088) 813-4726 / 813-4761 Local 122"],
    emails: ["malaybalayccro@gmail.com"],
    facebookUrl: "https://www.facebook.com/p/CCRO-Malaybalay-City-100085126836875/",
    officialWebUrl: SAKATA_CHARTER_URL,
    services: [
      {
        title: "Timely Birth, Marriage & Death Registration (Hospital & Home)",
        description: "Registers vital events occurring in Malaybalay City and releases LCR copies within the day.",
        classification: "Simple",
        processingTime: "23 – 35 Minutes",
        fee: "₱100.00 certification fee",
        requirements: [
          "Valid government ID of the document owner or authorized immediate family member",
          "Signed Authorization Letter + valid ID if requested by a representative",
          "Hospital/Attending Physician Certificate of Live Birth / Marriage / Death",
        ],
      },
      {
        title: "Delayed Registration of Birth, Marriage, Death & RA 9255",
        description: "Processes late civil status filings including illegitimate child surname use under RA 9255 and out-of-town COLB endorsements.",
        classification: "Complex",
        processingTime: "30 – 38 Mins + 10-Day Posting (Out-of-town: 35 Mins)",
        fee: "₱200.00 certification fee",
        requirements: [
          "For Late Birth Registration: PSA Negative Result, Baptismal/School/Voter record, and 2 disinterested witnesses’ affidavit",
          "Valid government ID of the document owner or authorized immediate family member",
        ],
      },
      {
        title: "Application for Marriage License (Municipal Form No. 90)",
        description: "Accepts marriage license applications with 10-day mandatory notice posting for engaged couples.",
        classification: "Complex",
        processingTime: "45 Minutes + 10-Day Posting",
        fee: "₱300.00 (Local applicant)",
        requirements: [
          "PSA Birth Certificates and CENOMAR (Certificate of No Marriage) of both applicants",
          "Parental Consent (ages 18–20) or Parental Advice (ages 21–24)",
          "Certificate of Attendance in Pre-Marriage Counseling (CSWDO / CHO / PopCom Malaybalay)",
          "Community Tax Certificate (Cedula) and 1x1 / 2x2 ID photos",
        ],
      },
      {
        title: "RA 9048 / RA 10172 Petitions (Clerical Error, First Name, Birth Day/Month or Sex)",
        description: "Processes administrative corrections and change of first name (local or migrant petitions) without a court order.",
        classification: "Highly Technical",
        processingTime: "10 – 15 Days + 2 Weeks Publication (1.5 hrs intake for Migrant)",
        fee: "₱1,000.00 (CCE) • ₱3,000.00 (CFN / RA 10172) • ₱4,000.00 (Migrant)",
      },
      {
        title: "Certified Extracted Copies (Forms 1A / 2A / 3A), Court Decrees & Divorce (PD 1083)",
        description: "Issues transcribed Birth/Death/Marriage records and registers court annulment decrees and Muslim divorce certificates.",
        classification: "Simple",
        processingTime: "24 Minutes (Forms) – 1 Hour & 30 Minutes (Decrees)",
        fee: "₱100 Local / ₱200 Abroad (Forms) • ₱10/page CTC (Decrees)",
      },
    ],
    programs: [
      { title: "Mobile Civil Registration & Free Kasalan / Legitimation Outreach", summary: "Conducts barangay outreach civil registration for indigent and Indigenous Peoples communities." },
    ],
    charterChapterRef: "CCRO 2026 (pp. 188–250 & p. 728)",
    sources: [
      ccSource("City Civil Registry Office (pp. 188–250 & p. 728)"),
      sakataSource("Citizen's Charter 2026 Portal", SAKATA_CHARTER_URL),
    ],
  }),

  // 17. CITY SOCIAL WELFARE AND DEVELOPMENT OFFICE (CSWDO)
  officeBase("cswdo", {
    aliases: ["social-welfare"],
    name: "City Social Welfare and Development Office",
    shortName: "Social Welfare (CSWDO)",
    acronym: "CSWDO",
    classification: "Executive Department — Social Protection, Crisis Assistance & Vulnerable Sectors",
    category: "Health & Social Welfare",
    logoPath: "/images/offices/cswdo.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Ivy Amor C. Urbina (City Social Welfare and Development Officer)",
    headNote: "Protective Services Division led by Hilsam N. Quemada (Social Welfare Officer IV).",
    overview:
      "Frontline social protection department managing AICS financial/medical/burial aid, Solo Parent & PWD support, Certificates of Indigency, VAWC/WEDC crisis intervention, Bahay Pag-asa CICL rehabilitation, and SEA-K livelihood groups.",
    cardSummary:
      "Delivers AICS medical and burial aid, Solo Parent and PWD support, VAWC crisis care, and Indigency certificates.",
    cardLocation: "1st Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "With Ground Floor intake desks at New City Hall and 24/7 crisis centers for women and children, CSWDO prepares Social Case Study Reports, validates Solo Parent IDs and PWD assistive device requests, manages disaster evacuation camps, and administers SEA-K interest-free group capital assistance.",
    whoServes:
      "Indigent families in medical/burial crisis, solo parents, Persons with Disabilities (PWDs), abused women/children, and community SEA-K groups.",
    mandate:
      "Formulate measures delivering basic social welfare, family and child protection, crisis intervention, disaster camp management, and community-based rehabilitation for vulnerable Malaybalay residents.",
    divisions: [
      "Administrative Unit",
      "Protective Services Division (Crisis Intervention / AICS Section)",
      "Women & Children Crisis Center (VAWC / WEDC / CNSP)",
      "Youth Welfare & Bahay Pag-asa Rehabilitation Center",
      "PWD, Solo Parent & SEA-K Livelihood Desk",
    ],
    address: "1st Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM (Crisis Centers 24/7)",
    phoneNumbers: ["0953-385-2277", "0953-568-7896", "(088) 813-8426 / 813-4761 Local 118"],
    emails: ["swmlycty@yahoo.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/citysocialwelfareanddevelopmentoffice/",
    services: [
      {
        title: "1. Assistance to Individuals & Families in Crisis Situation (AICS)",
        classification: "Complex",
        processingTime: "1 Week & 45 Minutes",
        fee: "None",
        reference: "Charter pp. 620–654",
        requirements: [
          "Barangay Certificate of Indigency and Residency in Malaybalay City",
          "Medical prescription/hospital bill or registered Death Certificate/funeral contract (for AICS Medical/Burial aid)",
          "Valid ID of patient and representative + Barangay Certificate of Indigency",
        ],
      },
      {
        title: "2. Certificate of Indigency & Social Case Study Report",
        classification: "Simple",
        processingTime: "20 – 53 Minutes",
        fee: "None",
        requirements: [
          "Barangay Certificate of Indigency and Residency in Malaybalay City",
          "Updated Hospital Statement of Account (SOA) or Doctor’s Prescription / Laboratory Request with price quotation",
          "1 valid government-issued ID",
        ],
      },
      {
        title: "3. Issuance of Solo Parent Identification Card",
        classification: "Complex",
        processingTime: "5 Days & 36 Minutes",
        fee: "None",
        requirements: [
          "Valid ID / PSA Birth Certificate (for Senior Citizen OSCA ID), Medical Certificate confirming disability (for PWD ID), or Solo Parent affidavit/birth certificates of children",
          "Barangay Certificate of Residency in Malaybalay City",
        ],
      },
      { title: "4. Assistive Device Request for Persons with Disability (PWD)", classification: "Complex", processingTime: "9 Days & 1 Hour", fee: "None" },
      { title: "5. VAWC / WEDC Crisis Center & Bahay Pag-asa Case Management", classification: "Emergency / Ongoing", processingTime: "1 Hour 30 Mins – 2 Hours 5 Mins intake", fee: "None" },
      { title: "6. Self-Employment Assistance to Groups (SEA-K)", classification: "Complex", processingTime: "11 Days, 4 Hours & 1 Minute", fee: "None" },
    ],
    programs: [
      { title: "24/7 Women & Children Crisis Center & Bahay Pag-asa", summary: "Provides shelter, trauma-informed social work, and RA 9344 diversion support." },
      { title: "Anti-Sexual Harassment (ASH) Referral Network (EO No. 15, s. 2026)", summary: "Coordinates victim support and Safe Spaces Act (RA 11313) case referrals across city desks and partner agencies." },
      { title: "Search for Model Family Awards (City Ordinance No. 1077)", summary: "CSWDO serves as lead implementing office for the institutionalized annual Model Family Awards (₱250,000 annual allocation)." },
      { title: "Disaster Camp Management Team (EO 36 s.2023)", summary: "Manages evacuation camp welfare and relief distribution alongside CDRRMO." },
    ],
    charterChapterRef: "CSWDO 2026 (pp. 620–654)",
    sources: [
      ccSource("CSWDO 2026 (pp. 620–654 & p. 729)"),
      sakataSource("CSWDO Page", "https://sakata.malaybalaycity.gov.ph/citysocialwelfareanddevelopmentoffice/"),
      sakataSource("City Ordinance No. 1077 (Model Family Awards)", "https://sakata.malaybalaycity.gov.ph/ordinance-no-1077/"),
      sakataSource("Executive Order No. 15, s. 2026 (ASH Referral Network)", "https://sakata.malaybalaycity.gov.ph/executive-order-no-15/"),
    ],
  }),

  // 18. CITY HEALTH OFFICE (CHO)
  officeBase("cho", {
    aliases: ["city-health", "health"],
    name: "City Health Office",
    shortName: "City Health Office",
    acronym: "CHO",
    classification: "Executive Department — Primary Health Care, Epidemiology, Dental & Lying-In Services",
    category: "Health & Social Welfare",
    logoPath: "/images/offices/city-health.jpg",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Dr. Dennis P. Sangalang, MD (City Health Officer II)",
    headNote: "Led by the City Health Officer with public health physicians, dentists, sanitary inspectors, and Upper Pulangui Lying-In clinical staff.",
    overview:
      "Delivers free primary medical consultations, maternal/child immunization, dental care, TB-DOTS, schistosomiasis treatment, sanitation permits, mental health support, newborn screening, and Upper Pulangui Lying-In maternity services.",
    cardSummary:
      "Provides free primary health consultations, dental care, immunization, TB-DOTS, sanitary permits, and lying-in care.",
    cardLocation: "Freedom Park, Brgy. 4 & Upper Pulangui",
    aboutDetails:
      "Headquartered at Freedom Park, Barangay 4 (Poblacion) with 46 Barangay Health Stations, the 24/7 Upper Pulangui Lying-In Clinic, and an internal patient referral linkage with the Malaybalay City Super Health Center in Barangay Aglayan (EO No. 93, Nov. 9, 2026), CHO issues Health Certificates, Sanitary Permits for BPLD permits, and primary outpatient care.",
    whoServes:
      "Families seeking primary care/immunization, food handlers & business owners needing Sanitary Permits, pregnant mothers, and TB/mental health patients.",
    mandate:
      "Formulate and implement public health programs, manage Barangay Health Stations across 46 barangays, prevent communicable/non-communicable disease outbreaks, and enforce Sanitary Code inspections.",
    divisions: [
      "Medical, Dental, Radiology, Electrocardiogram (ECG) & Laboratory Services",
      "Communicable & Non-Communicable Disease Units (ABTC Rabies PEP, TB-DOTS, Mental Health, PT)",
      "Family Health Cluster (Nutrition, Cervical Screening, Pre-Marriage Counselling, Family Planning)",
      "Forensic & Environmental Sanitation Health Division (Health & Sanitary Permits)",
      "Upper Pulangui Lying-In Clinic (Mapulo), POPDEV Section & 46 Barangay Health Stations",
    ],
    address: "Freedom Park, Barangay 4 (Poblacion), Malaybalay City, 8700 Bukidnon (with Upper Pulangui Lying-In Clinic)",
    barangay: "Barangay 4",
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM (Lying-In Clinic 24/7)",
    phoneNumbers: [
      "0965-094-9150",
      "0917-719-4588",
      "0965-094-9105",
      "0966-475-6979",
      "(088) 813-2877",
      "0964-998-9851",
      "0970-892-1313",
      "0992-385-8353",
    ],
    emails: ["cho.malaybly@gmail.com"],
    officialWebUrl: SAKATA_CHARTER_URL,
    services: [
      {
        title: "Medical Consultation, Child Immunization & Dental Care",
        description: "Provides primary physician checkups, EPI infant vaccinations, oral exams, and tooth extractions.",
        classification: "Simple",
        processingTime: "15 – 37 Minutes",
        fee: "None (Consult / EPI) • ₱100.00 (Dental)",
        requirements: [
          "Barangay Health Station referral slip or valid ID / PhilHealth MDR",
        ],
      },
      {
        title: "Health Certificate, Sanitary Permit & Exhumation / Cadaver Transfer Permit",
        description: "Issues worker/food-handler health cards, establishment sanitary permits, and burial compliance permits under PD 856.",
        classification: "Simple",
        processingTime: "6 – 13 Minutes",
        fee: "₱100.00 (Health Cert / Exhumation) • None (Sanitary Permit)",
        requirements: [
          "Barangay Health Station referral slip or valid ID / PhilHealth MDR",
          "Laboratory results (urinalysis, fecalysis, chest X-ray for food/non-food handler Health Card)",
        ],
      },
      {
        title: "Rabies Post-Exposure Prophylaxis (ABTC), Mental Health GAP, PT & TB-DOTS",
        description: "Delivers free animal-bite vaccine management, mental health gap counseling, free physical therapy, and TB treatment.",
        classification: "Simple",
        processingTime: "15 – 30 Mins (ABTC / Mental Health) • 1 hr 38 mins (PT)",
        fee: "None",
      },
      {
        title: "Newborn Screening Test (CHO Main & Upper Pulangui Lying-In)",
        description: "Early congenital disorder screening for newborn babies 24 hours to 28 days after delivery.",
        classification: "Simple",
        processingTime: "33 Minutes",
        fee: "₱1,750.00",
      },
      {
        title: "Laboratory Tests, Radiology X-Ray, ECG, Diet & Cervical Screening",
        description: "Performs blood chemistry/urinalysis, physician-requested X-rays (10 mins), ECG (17 mins), nutrition counseling (20 mins), and Pap smear/VIA (30 mins).",
        classification: "Simple",
        processingTime: "10 – 30 Minutes",
        fee: "None (X-Ray / Diet) • ₱250.00 Pathologist PF (Pap Smear) • Lab tariff",
      },
      {
        title: "Upper Pulangui Lying-In Clinic Maternity Delivery, Family Planning & Pre-Marriage Counselling",
        description: "24/7 normal spontaneous delivery at Upper Pulangui Lying-In alongside contraceptives counseling and pre-marriage sessions.",
        classification: "Simple / Clinical",
        processingTime: "25 Hours (Delivery) • 4 Hours 36 Mins (Pre-Marriage Counselling)",
        fee: "None",
      },
    ],
    programs: [
      { title: "Super Health Center (Brgy. Aglayan) Referral System (EO No. 93, 2026)", summary: "Formalizes internal patient referral and medical coordination between the Malaybalay City Super Health Center in Brgy. Aglayan and CHO." },
      { title: "Epidemiology & Surveillance Manual of Operations (EO No. 18, s. 2026)", summary: "Adopts standardized citywide disease surveillance and outbreak reporting protocols." },
      { title: "City Health Board (EO 5 & EO 26) & Nutrition Committee (EO 59)", summary: "Coordinates barangay health stations, Maternal Care Packages, and vaccination drives." },
      { title: "National Voluntary Blood Services Program", summary: "Regular citywide blood donation drives safeguarding emergency supply." },
    ],
    charterChapterRef: "CHO 2026 (pp. 354–408 & p. 729)",
    sources: [
      ccSource("City Health Office (pp. 354–408 & p. 729)"),
      sakataSource("Executive Order No. 93 (Super Health Center Referral System)", "https://sakata.malaybalaycity.gov.ph/executive-order-no-93/"),
      sakataSource("Executive Order No. 18, s. 2026 (Epidemiology & Surveillance)", "https://sakata.malaybalaycity.gov.ph/executive-order-no-18/"),
    ],
  }),

  // 19. CITY DISASTER RISK REDUCTION AND MANAGEMENT OFFICE (CDRRMO)
  officeBase("drrmo", {
    aliases: ["cdrrmo"],
    name: "City Disaster Risk Reduction and Management Office",
    shortName: "CDRRMO Rescue",
    acronym: "CDRRMO",
    classification: "Executive Department — Emergency Operations, Rescue & Disaster Preparedness",
    category: "Public Safety & Emergency",
    logoPath: "/images/offices/cdrrmo.jpg",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Alan J. Comiso (CDRRMO Head / CGDH-I)",
    headNote: "Led by the LDRRMO Head operating the 24/7 City Emergency Operations Center (EOC).",
    overview:
      "24/7 emergency response, flood/landslide monitoring across Sawaga and Upper Pulangui watersheds, rescue ambulance dispatch, Barangay DRRM capacity building, and Disaster Certification issuance.",
    cardSummary:
      "Operates 24/7 emergency response, Sawaga and Pulangui flood monitoring, rescue dispatch, and BDRRM training.",
    cardLocation: "Market Side, Barangay 9 (Poblacion)",
    aboutDetails:
      "Stationed at Market Side, Barangay 9 (Poblacion), CDRRMO dispatches round-the-clock rescue and Emergency Medical Services (EMS), coordinates early flood advisories with PAGASA and UP Project NOAH gauges, trains all 46 BDRRMCs, and issues rapid 15-minute Calamity Certifications.",
    whoServes:
      "Emergency callers, flood/calamity-affected households needing certifications, barangay rescue volunteers, and schools scheduling DRRM drills.",
    mandate:
      "Design, program, and coordinate disaster risk reduction, prevention, preparedness, response, and rehabilitation across all 46 barangays under RA 10121.",
    divisions: [
      "Operations & Warnings Division (24/7 EMS/SAR Rescue & 911 Emergency Call Center)",
      "CCTV Command Center (CCC)",
      "Research & Planning Division",
      "Training & Logistics Division",
      "Administrative Support Section",
    ],
    address: "Market Side, Barangay 9 (Poblacion), Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 9",
    operatingHours: "24/7 Emergency Operations Center • Mon–Fri 8:00 AM – 5:00 PM Admin",
    phoneNumbers: [
      "(088) 813-3611",
      "0917-827-6117",
      "0917-845-7668",
      "0917-302-0825",
      "0917-311-1979",
      "0997-904-0140",
      "0965-215-7960",
      "0927-565-5253",
      "0917-884-0076",
    ],
    emails: ["malaybalaycitydrrmo@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/departments-offices/",
    services: [
      {
        title: "24/7 911 Emergency Calls, Trauma/Medical Response & Ambulance Dispatch",
        description: "Receives emergency calls and deploys EMTs, search-and-rescue teams, and patient transport ambulances.",
        classification: "Emergency",
        processingTime: "7 – 8 Minutes response intake",
        fee: "None",
      },
      {
        title: "Request to Review Public CCTV Footage",
        description: "Coordinates formal requests to review public thoroughfare CCTV footage with the CCTV Command Center.",
        classification: "Simple",
        processingTime: "6 Minutes",
        fee: "None",
      },
      {
        title: "Issuance of Disaster / Calamity Certification",
        description: "Issues RA 10121 calamity certifications to affected households for emergency financial assistance.",
        classification: "Simple",
        processingTime: "15 Minutes",
        fee: "None",
        requirements: [
          "Exact barangay, purok/sitio, nearest landmark, and active callback mobile number",
          "Barangay Incident Report or Blotter Certification confirming disaster damage",
          "1 valid government-issued ID",
        ],
      },
      {
        title: "Review & Certification of Barangay DRRM Plans (BDRRMP)",
        description: "Evaluates and certifies barangay disaster plans for compliant BDRRM fund utilization.",
        classification: "Complex",
        processingTime: "1 Hour & 7 Minutes",
        fee: "None",
      },
      {
        title: "DRRM Trainings, Simulation Drills, Standby First-Aid & Logistical Support",
        description: "Schedules barangay/school drills, rescue trainings, event ambulance standbys, and emergency logistics.",
        classification: "Simple",
        processingTime: "4 – 11 Minutes intake (2 Days for full training)",
        fee: "None",
      },
    ],
    programs: [
      { title: "City Emergency Operations Center (EO 37 s.2023)", summary: "Maintains continuous weather, river-level, and hazard advisory coordination with PAGASA and 46 BDRRMCs." },
    ],
    charterChapterRef: "CDRRMO 2026 (pp. 251–262 & p. 728)",
    sources: [
      ccSource("CDRRMO 2026 (pp. 251–262 & p. 728)"),
      sakataSource("Departments & Contact Directory", SAKATA_CONTACT_URL),
    ],
  }),

  // 20. BUSINESS PERMITS AND LICENSING DIVISION (BPLD)
  officeBase("bpld", {
    aliases: ["business-permits", "bplo"],
    name: "Business Permits and Licensing Division",
    shortName: "Business Permits (BPLD)",
    acronym: "BPLD",
    classification: "City Mayor's Office — Regulatory & Enterprise Licensing Division",
    parentOffice: "Office of the City Mayor",
    category: "Civil Registry, Permits & Community",
    logoPath: "/images/offices/bpld.jpg",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Arnel S. Alagenio (EA V-Designate • Concurrent OIC CCRO) • Salvador U. Yacapin (OIC / Licensing Officer IV • Concurrent OIC CENRO)",
    overview:
      "Operates Malaybalay City's Business One-Stop Shop (BOSS), issuing new Mayor's Business Permits (walk-in and online), annual renewals, business retirements, motorela permits/franchises, and special activity permits.",
    cardSummary:
      "Operates the Business One-Stop Shop (BOSS) for Mayor's Business Permits, renewals, and occupational clearances.",
    cardLocation: "1st Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "Located on the Ground (1st) Floor of New City Hall alongside CTO, CHO Sanitary, CPDO Zoning, OBO, and BFP counters, BPLD validates business registrations, motorela permits, and consumer welfare compliance—with extended BOSS schedules every January renewal cycle.",
    whoServes:
      "Micro, small, medium, and large business owners, stallholders, motorela operators, and workers securing occupational permits.",
    mandate:
      "Streamline business registration under RA 11032 (Ease of Doing Business), verify regulatory clearances (Barangay, BFP FSIC, Sanitary, Zoning, OBO), and maintain Malaybalay's active business registry.",
    divisions: [
      "Permits & Licensing Examiner and Assessment Section",
      "Permits / Motorela Processing, Records & Communication Section",
      "Permits, Consumer Welfare & Inspection Section",
    ],
    address: "1st Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM (Extended BOSS hours every January)",
    phoneNumbers: ["0926-833-0696", "0952-531-6844", "(088) 813-4725 / 813-4761 Local 120"],
    emails: ["malaybalaycitylicensing@gmail.com"],
    facebookUrl: "https://www.facebook.com/bpld.malaybalaycity",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/business-permit-and-licensing-division/",
    services: [
      {
        title: "Issuance of Business Permit (Walk-In BOSS & Online Application)",
        description: "Processes new and renewed Mayor's Business Permits through the all-year Business One-Stop Shop.",
        classification: "Simple",
        processingTime: "1 Day",
        fee: "Per City Tax Ordinance & Line of Business",
        requirements: [
          "DTI Business Name Certificate (Sole Proprietorship) or SEC/CDA Registration",
          "Barangay Business Clearance from the barangay where the business is located",
          "Contract of Lease (if rented) or Tax Declaration / Land Title (if owned)",
          "Occupancy Permit (OBO) & Fire Safety Inspection Certificate (BFP Malaybalay)",
          "Sanitary Permit / Health Certificate from Malaybalay City Health Office",
        ],
      },
      {
        title: "Business Permit Retirement / Closure & Business Certificates",
        description: "Officially cancels closed business permits (1 day) and issues Certificates of No Business or Cessation (20 mins max).",
        classification: "Simple",
        processingTime: "20 Minutes (Certs) – 1 Day (Retirement)",
        fee: "Certification Fee + verified tax due",
        requirements: [
          "Previous year’s Mayor’s Permit and Official Receipt",
          "Sworn declaration of prior-year gross sales/receipts or BIR Audited Financial Statements / ITR",
          "Updated Barangay Business Clearance",
        ],
      },
      {
        title: "Motorela Permit, 3-Year Franchise, Confirmation & Franchise Dropping",
        description: "Issues annual Motorela Permits (Jan 2–31 renewal window), new/extended 3-year franchises, confirmations, and dropping approvals.",
        classification: "Simple",
        processingTime: "20 – 30 Minutes (maximum)",
        fee: "₱500.00 (Permit/Sticker) • ₱1,500.00 (Franchise) • ₱100.00 (Confirm) • ₱150.00 (Dropping)",
      },
      {
        title: "Special Mayor's Permits for Advertisements & Public Activities",
        description: "Grants special permits for signage/advertisements and commercial or group events in public spaces.",
        classification: "Simple",
        processingTime: "1 Day",
        fee: "₱500.00 / day (Special Activity Permit) / Ordinance tariff",
      },
    ],
    programs: [
      { title: "Electronic Business One-Stop Shop (eBOSS) & CART Integration", summary: "Colocates BPLD, CTO, BFP, CHO Sanitation, CPDO Zoning, and OBO steps for faster permit release." },
    ],
    charterChapterRef: "CMO - BPLD 2026 (pp. 507–530 & p. 728)",
    sources: [
      ccSource("CMO — BPLD 2026 (pp. 507–530 & p. 728)"),
      sakataSource("BPLD Office Page", "https://sakata.malaybalaycity.gov.ph/business-permit-and-licensing-division/"),
    ],
  }),

  // 21. CITY ENGINEERING OFFICE (CEO)
  officeBase("engineering", {
    aliases: ["ceo", "city-engineering"],
    name: "City Engineering Office",
    shortName: "City Engineering (CEO)",
    acronym: "CEO",
    classification: "Executive Department — Public Works, Infrastructure Design & Maintenance",
    category: "Infrastructure, Housing & Planning",
    logoPath: "/images/offices/city-engineering.jpg",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Leo Rustan L. Dela Cerna (City Engineer)",
    headNote: "Assisted by Elpidio C. Sumanduran, Jr. (Assistant City Engineer).",
    overview:
      "Designs, plans, inspects, and maintains city roads, bridges, drainage systems, public buildings, street lighting, and heavy equipment—with 25 documented Citizen's Charter engineering and quality-control services.",
    cardSummary:
      "Designs, builds, and maintains city roads, bridges, drainage systems, public buildings, and street lighting.",
    cardLocation: "Engineering Compound, Brgy. Casisang",
    aboutDetails:
      "Operating from the City Engineering Compound in Barangay Casisang, CEO engineers prepare Programs of Works (POW), run Materials Testing Laboratory and Field Density Tests, inspect civil works prior to contractor progress billings, and maintain barangay farm-to-market roads and streetlights.",
    whoServes:
      "Barangay councils requesting infrastructure designs, civil works contractors undergoing FDT/billing inspection, and motorists reporting road/streetlight repairs.",
    mandate:
      "Initiate, review, and recommend changes in public works policies, prepare Programs of Works and detailed plans, supervise city infrastructure construction, certify contractor billings, and maintain public facilities.",
    divisions: [
      "Administrative Support Division",
      "Planning, Design & Programming Division",
      "Construction, Inspection & Quality Control Division (Materials Testing / FDT)",
      "Maintenance & Heavy Equipment / Motorpool Division",
    ],
    address: "Barangay Casisang (City Engineering Compound), Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["(088) 813-1695", "0907-306-8839", "0935-981-5390", "0909-110-0961", "0977-024-5096"],
    emails: ["cgm.ceo.nada@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/city-engineers-office/",
    services: [
      {
        title: "Preparation of Infrastructure Plans & Program of Works (POW)",
        description: "Prepares engineering plans, straight-line diagrams, and cost estimates for requesting barangays, public schools, and city offices.",
        classification: "Highly Technical",
        processingTime: "10 Days (Repair/Maint) – 20 Days, 10 Hours & 39 Mins (Small-scale new works)",
        fee: "None",
      },
      {
        title: "Road Right-of-Way (RROW) Certification",
        description: "Verifies road right-of-way alignment and issues official RROW certifications for public and private entities.",
        classification: "Simple",
        processingTime: "3 Days, 14 Hours & 15 Minutes",
        fee: "₱100.00",
      },
      {
        title: "Materials Quality Control, Sample Card, Field Density Test & Concrete Pouring",
        description: "Performs laboratory materials inspections and on-site Field Density / concrete pouring tests for government works.",
        classification: "Simple",
        processingTime: "1 Hour & 5 Minutes (CEO Compound)",
        fee: "None",
      },
      {
        title: "Project Implementation Processing (Progress Billing, Variation Order, Extension, 10% Retention)",
        description: "Validates contractor billings, variation orders, time extensions, and 10% retention releases for city infrastructure and maintenance projects.",
        classification: "Complex / Technical",
        processingTime: "2 – 12 Days",
        fee: "None",
      },
      {
        title: "Barangay / School Maintenance Personnel & Heavy Equipment Dispatch",
        description: "Dispatches CEO heavy equipment, repair crews, and LGU fleet/motorpool mechanical & welding teams.",
        classification: "Simple / Technical",
        processingTime: "2 Days, 7 Hours & 5 Mins (Maint/Equipment) • 5 hrs–30 days (Motor Pool)",
        fee: "None",
      },
    ],
    programs: [
      { title: "Barangay Infrastructure Support & Streetlighting Maintenance", summary: "Provides technical designs and inspection monitoring for 20% Development Fund projects across 46 barangays." },
    ],
    charterChapterRef: "CEO 2026 (pp. 293–344 — 25 services & p. 729)",
    sources: [
      ccSource("City Engineering Office (pp. 293–344 & p. 729)"),
      sakataSource("City Engineer's Office Page", "https://sakata.malaybalaycity.gov.ph/city-engineers-office/"),
    ],
  }),

  // 22. OFFICE OF THE BUILDING OFFICIAL (OBO)
  officeBase("obo", {
    aliases: ["building-official"],
    name: "Office of the Building Official",
    shortName: "Building Official (OBO)",
    acronym: "OBO",
    classification: "Executive Regulatory Office — National Building Code (PD 1096) Enforcement",
    category: "Infrastructure, Housing & Planning",
    logoPath: "/images/offices/obo.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Engr. Runstadt P. Peria (Acting Building Official / Engineer IV)",
    headNote: "Led by the City Building Official under PD 1096 in coordination with CPDO Zoning & BFP.",
    overview:
      "Enforces the National Building Code of the Philippines (PD 1096) across Malaybalay City—issuing Building Permits, Certificates of Occupancy, Temporary Electrical Connection Permits, and annual structural/mechanical inspections.",
    cardSummary:
      "Enforces the National Building Code (PD 1096) via Building Permits, Occupancy Certificates, and safety checks.",
    cardLocation: "New City Hall (Engineering Wing), Casisang",
    aboutDetails:
      "Applicants first secure CPDO Locational Clearance and BFP Fire Safety Evaluation Clearance (FSEC) before submitting signed/sealed architectural, structural, sanitary, and electrical plans to OBO at New City Hall—releasing approved permits within 3 working days once documents are complete.",
    whoServes:
      "Homebuilders, commercial developers, licensed civil/electrical engineers & architects, and FUSEL/Bukidnon Second Electric Cooperative (BUSECO) applicants.",
    mandate:
      "Ensure safe, structurally sound, accessible, and code-compliant residential, commercial, and institutional construction in coordination with CPDO Zoning and BFP Fire Safety.",
    divisions: [
      "Architectural, Structural & Civil Plan Evaluation Unit",
      "Electrical, Mechanical, Sanitary & Plumbing Inspection Unit",
      "Building Permit, Occupancy & Temporary Electrical Permit Desk",
    ],
    address: "New City Hall (Building Official / Engineering Wing), Barangay Casisang, Malaybalay City",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: [
      "0917-152-6618",
      "0917-129-9629",
      "0926-834-7053",
      "0956-309-0035",
      "0991-577-7785",
      "0993-522-0275",
    ],
    emails: ["obo.malaybalay@gmail.com"],
    facebookUrl: "https://www.facebook.com/profile.php?id=100089883944248",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/obo-forms/",
    services: [
      {
        title: "Issuance of Building & Ancillary Structure Permits",
        description: "Evaluates signed and sealed architectural, structural, sanitary, and electrical plans under PD 1096 before construction.",
        classification: "Simple / Complex / Highly Technical",
        processingTime: "3 Days (Simple) • 7 Days (Complex) • 20 Days (Highly Technical)",
        fee: "Per National Building Code (PD 1096) Fee Schedule",
        requirements: [
          "5 sets of signed and sealed Architectural, Structural, Electrical, and Sanitary/Plumbing plans",
          "Certified True Copy of OCT/TCT Land Title, Tax Declaration, and current Real Property Tax Receipt",
          "Barangay Construction Clearance and CPDO Locational/Zoning Clearance",
          "BFP Fire Safety Evaluation Clearance (FSEC)",
        ],
      },
      {
        title: "Certificate of Occupancy Application",
        description: "Inspects completed buildings and issues Certificates of Occupancy before commercial or residential occupancy.",
        classification: "Simple / Complex / Highly Technical",
        processingTime: "3 Days (Simple) • 7 Days (Complex) • 20 Days (Highly Technical)",
        fee: "Per National Building Code (PD 1096) Schedule",
        requirements: [
          "Approved Building Permit and As-Built Plans signed and sealed by supervising engineers/architects",
          "BFP Fire Safety Inspection Certificate (FSIC)",
          "Construction Logbook and Certificate of Completion",
        ],
      },
      {
        title: "Temporary Electrical Connection Permit",
        description: "Issues temporary electrical connection permits for dwellings/structures made of indigenous materials up to ₱15,000 cost.",
        classification: "Simple",
        processingTime: "3 Days",
        fee: "Per PD 1096 Schedule",
      },
    ],
    programs: [
      { title: "Downloadable Standardized Building Forms (sakata/obo-forms)", summary: "Provides unified application checklists for architectural, structural, sanitary, and electrical plans." },
    ],
    charterChapterRef: "OBO 2026 (pp. 675–710)",
    sources: [
      ccSource("Office of the Building Official (pp. 675–710)"),
      sakataSource("OBO Forms & Departments Page", "https://sakata.malaybalaycity.gov.ph/obo-forms/"),
    ],
  }),

  // 23. CITY ENVIRONMENT AND NATURAL RESOURCES OFFICE (CENRO)
  officeBase("cenro", {
    aliases: ["environment"],
    name: "City Environment and Natural Resources Office",
    shortName: "Environment (CENRO)",
    acronym: "CENRO",
    classification: "Executive Department — Watersheds, Solid Waste Management & Forestry",
    category: "Agriculture, Environment & Tourism",
    logoPath: "/images/offices/cenro.jpg",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Salvador U. Yacapin (OIC City ENRO • Concurrent Licensing Officer IV at BPLD)",
    headNote: "Led by the City Environment & Natural Resources Officer on 1st Floor, New City Hall.",
    overview:
      "Leads ecological solid waste management (RA 9003), urban greening, forest nursery & seedling distribution, watershed protection (Upper Pulangui / Sawaga), and City Environmental Clearance enforcement.",
    cardSummary:
      "Leads solid waste management (RA 9003), urban greening, nursery seedlings, and Pulangui-Sawaga watershed care.",
    cardLocation: "1st Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "Located on the Ground Floor of New City Hall, CENRO processes barangay and school seedling requests, conducts commercial environmental inspections prior to permitting, and operates Malaybalay's Ecological Solid Waste Management and Sanitary Landfill programs.",
    whoServes:
      "Schools & community tree-planting groups, barangay MRF coordinators, businesses securing environmental clearances, and watershed stewards.",
    mandate:
      "Formulate measures implementing environmental laws, administer city nurseries and reforestation drives, coordinate Sanitary Landfill / ESWM operations, and curb illegal quarrying or timber transport.",
    divisions: ["Environmental Management Division (Solid Waste Section)", "Forest & Watershed Resources Division"],
    address: "1st Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: [
      "0997-790-0290",
      "0969-208-8277",
      "(088) 813-4726 / 813-4761 Local 116",
      "0917-858-8890",
      "0917-315-0070",
    ],
    emails: ["infoserve.cityenroffice19@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/departments-offices/",
    services: [
      {
        title: "Environmental Certification Issuance (CAMP Services)",
        description: "Evaluates projects in environmentally critical areas and issues City Environmental Certifications.",
        classification: "Simple",
        processingTime: "33 Minutes",
        fee: "₱130.00",
        requirements: [
          "Written request / project location details in Malaybalay City",
          "1 valid government-issued ID",
        ],
      },
      {
        title: "Ecological Solid Waste Management Certification",
        description: "Inspects business solid-waste compliance under RA 9003 for new and renewal business permits.",
        classification: "Simple",
        processingTime: "40 Minutes",
        fee: "₱80.00",
        requirements: [
          "DTI / SEC Registration Certificate",
          "Updated Business Permit",
          "Official Receipt of Environmental Certification Fee (₱80.00)",
        ],
      },
      {
        title: "Request for Indigenous Forest Tree Seedlings",
        description: "Distributes watershed and urban-greening seedlings from the City Plant Nursery to qualified requestors.",
        classification: "Complex",
        processingTime: "3 Days, 3 Hours & 39 Minutes",
        fee: "None",
      },
      {
        title: "Issuance of Certificate to Transport Forest Products",
        description: "Regulates authorized movement of timber and forest products within Malaybalay City under EO No. 21.",
        classification: "Complex",
        processingTime: "2 Days, 1 Hour & 17 Minutes",
        fee: "₱230.00",
      },
    ],
    programs: [
      { title: "City Solid Waste Management Board (EO 24 s.2023)", summary: "Coordinates segregated collection, Materials Recovery Facilities, and sanitary landfill compliance across 46 barangays." },
    ],
    charterChapterRef: "CENRO 2026 (pp. 282–292 & p. 729)",
    sources: [
      ccSource("CENRO 2026 (pp. 282–292 & p. 729)"),
      sakataSource("Departments & Contact Directory", SAKATA_CONTACT_URL),
    ],
  }),

  // 24. CITY AGRICULTURE OFFICE (CAO)
  officeBase("agriculture", {
    aliases: ["agri", "city-agriculture"],
    name: "City Agriculture Office",
    shortName: "City Agriculture",
    acronym: "CAO",
    classification: "Executive Department — Crop Production, Fisheries & Agribusiness Support",
    category: "Agriculture, Environment & Tourism",
    logoPath: "/images/offices/city-agriculture.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Engr. Richard B. Leono (City Agriculturist)",
    headNote: "Assisted by Engr. Lilianne A. Obre (Assistant City Agriculturist).",
    overview:
      "Supports Malaybalay City's agricultural backbone (rice, corn, highland vegetables, coffee, cacao, rubber, and inland fisheries) through seed/fertilizer dispersal, RSBSA farmer registration, pest diagnostics, and post-harvest equipment aid.",
    cardSummary:
      "Supports rice, corn, vegetable, coffee, and cacao growers via seed dispersal, RSBSA enrollment, and farm aid.",
    cardLocation: "Agriculture Compound, Brgy. Casisang",
    aboutDetails:
      "Situated at the City Agriculture Compound in Barangay Casisang, the department assists smallholders with RSBSA enrollment needed for national fuel/fertilizer subsidies, certified rice/corn seed releases, tilapia fingerling dispersal, and post-harvest backhoe/tractor engineering support.",
    whoServes:
      "Registered RSBSA farmers, irrigators' associations, Indigenous Peoples agricultural cooperatives, fishpond operators, and agrarian reform beneficiaries.",
    mandate:
      "Formulate agricultural productivity measures, provide extension services to farmers' associations and agrarian reform beneficiaries, administer farm demonstration stations, and coordinate DA-10 interventions.",
    divisions: [
      "Administrative Support Services Section",
      "Planning, Monitoring & Evaluation Division (Project Dev't & GIS Mapping)",
      "Field Operations Division (Rice, Corn, HVCDP, Organic Agriculture & Inland Fisheries)",
      "Integrated Agricultural Laboratories (Soil Lab, Plant Tissue Culture, Bio-Mixing, Concoctions)",
      "City Plant Nursery & Agricultural Warehouse Unit",
    ],
    address: "Barangay Casisang (City Agriculture Compound), Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0994-957-6384", "(088) 813-1254", "0991-430-9892"],
    emails: ["mlyblyagri2023@gmail.com", "mlyblyagri@yahoo.com"],
    facebookUrl: "https://www.facebook.com/mlyblyAgriNews/",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/city-agriculture-office/",
    services: [
      {
        title: "RSBSA Certification & Loan Endorsements (SIKAT-SAKA / ACEF / RCEF)",
        description: "Issues and updates RSBSA farmer registry certifications and loan endorsements for qualified rice and corn farmers.",
        classification: "Simple",
        processingTime: "21 Minutes (3–5 days if new to masterlist)",
        fee: "₱80.00",
      },
      {
        title: "Hybrid Corn, Inbred/Hybrid Rice Seeds & Vegetable / Fruit Seedlings",
        description: "Distributes free corn/rice seeds with Fertilizer Discount Vouchers, pesticide assistance, and assorted fruit seedlings.",
        classification: "Simple",
        processingTime: "14 – 20 Minutes (1.5 Days fruit seedlings)",
        fee: "None",
      },
      {
        title: "City Soil Testing Laboratory & Plant Tissue Culture (Banana / Abaca)",
        description: "Analyzes soil samples with fertilizer recommendations and supplies disease-free tissue-cultured plantlets and tilapia fingerlings.",
        classification: "Simple / Complex",
        processingTime: "9 Days & 7 Mins (Soil) • 12 Days (Tilapia)",
        fee: "₱250.00 / ₱150 student outside city (Soil) • ₱15 banana / ₱10 abaca • ₱45/pack tilapia",
      },
      {
        title: "Organic Vermi Worms, Molasses, NFTS Concoctions & Bio-Control Agents",
        description: "Provides Metarhizium/earwig bio-control agents, NFTS organic concoctions, and vermicomposting starters to local growers.",
        classification: "Simple",
        processingTime: "5 – 33 Minutes (1 Day vermi/molasses)",
        fee: "None",
      },
      {
        title: "GIS-Based Farm Parcel Mapping, Crop Insurance & Crop Damage Reporting",
        description: "Geotags farm parcels, assists insured farmers with PCIC damage reports, and documents pest or typhoon crop losses.",
        classification: "Simple",
        processingTime: "25 Minutes (GIS) • 1 Day 45 Mins (Damage report)",
        fee: "None",
      },
      {
        title: "Farmers Training Center, FITS E-Learning, Field Schools & Fishpond Backhoe",
        description: "Schedules Farmers Field Schools, training hall reservations, agricultural research data, and fishpond backhoe excavation.",
        classification: "Simple / Complex",
        processingTime: "17 – 30 Minutes (Hall/FITS) • 10 Days (Backhoe)",
        fee: "None (Training) • ₱1,000 / 100 sq.m. (Backhoe)",
      },
    ],
    programs: [
      { title: "Agri-Ecotourism & High-Value Crops Development", summary: "Backs coffee, adlai, rice, corn, and organic highland vegetable clusters across rural barangays." },
    ],
    charterChapterRef: "AGRI 2026 (pp. 83–131 & p. 729)",
    sources: [
      ccSource("City Agriculture Office (pp. 83–131 & p. 729)"),
      sakataSource("City Agriculture Office Page", "https://sakata.malaybalaycity.gov.ph/city-agriculture-office/"),
    ],
  }),

  // 25. CITY VETERINARY OFFICE (CVO)
  officeBase("veterinary", {
    aliases: ["city-vet", "cvo"],
    name: "City Veterinary Office",
    shortName: "City Veterinary",
    acronym: "CVO",
    classification: "Executive Department — Livestock Health, Rabies Control & Meat Inspection",
    category: "Agriculture, Environment & Tourism",
    logoPath: "/images/offices/city-veterinary.jpg",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Dr. Michele C. Miquiabas, DVM (City Veterinarian)",
    headNote: "Led by the City Veterinarian overseeing animal clinics, mass vaccination, and meat inspection.",
    overview:
      "Safeguards animal health and food safety through anti-rabies vaccination, pet registration, veterinary consultations, swine/livestock dispersal, dog pound management, and veterinary health certification.",
    cardSummary:
      "Safeguards animal health and meat safety via mass anti-rabies vaccination, livestock dispersal, and pet care.",
    cardLocation: "Barangay Casisang, Malaybalay City",
    aboutDetails:
      "Operating in Barangay Casisang alongside citywide barangay vaccination caravans, the City Veterinary Office provides free anti-rabies shots, fast 45-minute Veterinary Health Certificates for livestock transport, and daily ante/post-mortem meat inspection with NMIS standards.",
    whoServes:
      "Pet owners, backyard swine/cattle raisers, livestock shippers requiring transport health certificates, and public market meat vendors.",
    mandate:
      "Enforce animal disease prevention (rabies, ASF, avian flu), oversee meat and slaughterhouse ante/post-mortem inspection, promote humane animal welfare, and assist livestock raisers.",
    divisions: ["Animal Health & Production Division", "Meat Inspection & Regulatory Section", "Administrative Support Unit"],
    address: "Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: [
      "(088) 813-3205",
      "0926-198-6992",
      "0927-703-8993",
      "0915-233-3363",
      "0916-114-1934",
      "0905-725-9062",
    ],
    emails: ["cityvetmalaybalay@gmail.com"],
    verificationNote:
      "Official email confirmed as cityvetmalaybalay@gmail.com on the City Departments directory (the LGU Contact Us page contains an incomplete 'citymalaybalay@gmail.com' typo).",
    facebookUrl: "https://www.facebook.com/p/City-Veterinary-Office-City-of-Malaybalay-100064138659249/",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/departments-offices/",
    services: [
      {
        title: "Free Anti-Rabies Vaccination & Pet Registration",
        description: "Vaccinates dogs, cats, and monkeys against rabies and registers pets with vaccination cards under City Ord. No. 668.",
        classification: "Simple",
        processingTime: "40 – 50 Minutes",
        fee: "None (Vaccine) • ₱100 Intact / ₱50 Neutered (Registration)",
      },
      {
        title: "Animal Consultation, Treatment, Spay & Castration",
        description: "Provides walk-in and house-call deworming/supplements and surgical spay/castration for dogs and cats.",
        classification: "Simple",
        processingTime: "40 – 130 Mins (Consult) • 50 – 165 Mins (Surgery)",
        fee: "None (Consult) • ₱50.00 (Spay / Castration)",
      },
      {
        title: "Veterinary Health Certificate & Large Animal Ownership Certificate",
        description: "Issues shipping/slaughter health certificates and ownership proofs for cattle, carabaos, and horses.",
        classification: "Simple",
        processingTime: "25 – 45 Minutes",
        fee: "₱100.00 (Health Cert) • ₱200.00 (Large Animal Ownership)",
      },
      {
        title: "Artificial Insemination (Swine, Small & Large Ruminants) & Swine Dispersal",
        description: "Performs livestock Artificial Insemination at owners' farms and manages backyard swine dispersal.",
        classification: "Simple / Complex",
        processingTime: "35 – 40 Mins (Swine/Small AI) • 30 Days (Swine Dispersal)",
        fee: "None (Ruminants / Dispersal) • ₱500.00 (Swine AI, Ord. 1030)",
      },
      {
        title: "Dog Impoundment Reclaim, Meat Inspection & Establishment Accreditation",
        description: "Processes impounded dog claims, daily NMIS slaughterhouse inspections, and meat establishment permits.",
        classification: "Simple",
        processingTime: "10 – 50 Minutes",
        fee: "₱300 Registered / ₱500 Unregistered (Dog Pound) • None (Meat Inspection)",
      },
    ],
    programs: [
      { title: "Barangay Mass Anti-Rabies & ASF Surveillance", summary: "Deploys veterinary vaccination teams across all 46 barangays to prevent zoonotic outbreaks." },
    ],
    charterChapterRef: "CITY VET 2026 (pp. 458–481 & p. 729)",
    sources: [
      ccSource("City Veterinary Office (pp. 458–481 & p. 729)"),
      sakataSource("Departments & Contact Directory", SAKATA_CONTACT_URL),
    ],
  }),

  // 26. CITY TOURISM DIVISION (CMO)
  officeBase("tourism", {
    aliases: ["city-tourism"],
    name: "City Tourism Office (CMO — Tourism Division)",
    shortName: "City Tourism",
    acronym: "CTO-T",
    classification: "City Mayor's Office — Cultural Heritage, Destination & Business Accreditation Division",
    parentOffice: "Office of the City Mayor",
    category: "Agriculture, Environment & Tourism",
    logoPath: "/images/offices/city-tourism.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Marven Jan Nadela (City Tourism Officer) • Honolu Marie C. Cruzin (Supervising Tourism Operations Officer)",
    headNote: "Tourism Division under the Office of the City Mayor (Murillo Street, Barangay 8).",
    overview:
      "Promotes Malaybalay's highland agri-ecotourism, heritage trails, and Kaamulan cultural identity while certifying tourism-related establishments (including Ancestral Domain businesses) and coordinating DOT trainings.",
    cardSummary:
      "Promotes highland ecotourism, Kaamulan heritage, tourism-enterprise certification, and hospitality trainings.",
    cardLocation: "Murillo Street, Brgy. 8 (Poblacion)",
    aboutDetails:
      "Based at Murillo Street in Poblacion Barangay 8, the City Tourism Office issues 1-hour Tourism-Related Business Certifications required for hotels, resorts, cafés, and ancestral-domain eco-sites, compiles tourism visitor data, and schedules DOT hospitality trainings.",
    whoServes:
      "Accommodations, eco-resorts, cafes, tour guides, ancestral-domain tourism operators, and cultural heritage researchers.",
    mandate:
      "Implement local tourism standards, maintain visitor arrival and accommodation statistics, endorse establishments for Department of Tourism accreditation, and facilitate visitor hospitality.",
    divisions: ["Planning & Accreditation Section", "Promotions & Cultural Heritage Section"],
    address: "Murillo Street, Barangay 8 (Poblacion), Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 8",
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["(088) 813-3404", "0997-850-4913", "0917-432-9900", "0926-732-8544"],
    emails: ["malaybalaycity_tourism@gmail.com", "cgmtourism.nada@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/tourism/",
    services: [
      { title: "1. Tourism-Related Businesses Certification (Standard & Ancestral Domain)", processingTime: "1 Hour", fee: "None", reference: "Charter pp. 588–597" },
      { title: "2. Release of Tourism Statistical Data & Visitor Assistance", processingTime: "1 Hour", fee: "None" },
      { title: "3. Request for DOT Seminar, Training & Workshop", processingTime: "8 – 15 Days", fee: "None" },
    ],
    programs: [
      { title: "Malaybalay City Tourism Council (EO 230)", summary: "Aligns highland eco-resorts, IP cultural stewards, and hospitality operators." },
    ],
    charterChapterRef: "CMO - TOURISM 2026 (pp. 588–597 & p. 728)",
    sources: [
      ccSource("City Tourism Office (pp. 588–597 & p. 728)"),
      sakataSource("City Tourism Division Page", "https://sakata.malaybalaycity.gov.ph/tourism/"),
      sakataSource("Departments & Contact Directory", SAKATA_CONTACT_URL),
    ],
  }),

  // 27. CITY ECONOMIC ENTERPRISE DEVELOPMENT AND MANAGEMENT OFFICE (CEEDMO)
  officeBase("ceedmo", {
    aliases: ["economic-enterprise", "market"],
    name: "City Economic Enterprise Development and Management Office",
    shortName: "Economic Enterprise (CEEDMO)",
    acronym: "CEEDMO",
    classification: "Executive Department — Public Market, Terminal, Slaughterhouse & Waterworks",
    category: "Agriculture, Environment & Tourism",
    logoPath: "/images/offices/ceedmo.jpg",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Romeo R. Lapeciros, Jr. (CEEDMO-Designate)",
    headNote: "MCGWSS Waterworks supervised by Engr. Stephen D. Caroro (Waterworks Superintendent I).",
    overview:
      "Operates revenue-generating municipal public utilities and enterprises including the Malaybalay Public Market, Integrated Overland Transport Terminal, City Slaughterhouse, City Memorial Park, and MCGWSS Waterworks.",
    cardSummary:
      "Operates City Public Market, Overland Terminal, Slaughterhouse, Memorial Park, and MCGWSS waterworks.",
    cardLocation: "Market Site, Barangay 9 (Poblacion)",
    aboutDetails:
      "Managed from Market Site in Barangay 9, CEEDMO handles stall lease renewals and revenue collection at the Public Market, dispatch fees at the Overland Bus/Van Terminal, City Memorial Park burial services, Slaughterhouse meat handling, and local waterworks customer billing.",
    whoServes:
      "Public Market vendors and stallholders, commuter transport operators, livestock traders, Memorial Park clients, and waterworks subscribers.",
    mandate:
      "Manage city economic enterprises sustainably, enforce stall leases, terminal dispatch regulations, hygienic slaughtering standards, cemetery services, and local waterworks billing.",
    divisions: [
      "Revenue Collection Division (Billing & Collection Sections)",
      "Enterprise Management Division (Market, Overland Terminal, City Memorial Park)",
      "City Slaughterhouse Section & MCGWSS Waterworks",
      "Administrative Support Section",
    ],
    address: "Market Site, Barangay 9 (Poblacion), Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 9",
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM (Market/Terminal daily operations)",
    phoneNumbers: ["0935-740-5424", "0953-560-5583", "(088) 813-4759"],
    emails: ["ceedmomalaybalaycity@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/city-economic-enterprise-and-management-office/",
    services: [
      {
        title: "Renewal & Lease of Public Market Stalls and Tabo Areas",
        description: "Processes annual market stall lease renewals, awards vacant stalls via the Market Committee, and allocates local farmers' tabo display spaces.",
        classification: "Simple / Complex",
        processingTime: "22 Minutes (Tabo) • 1 Hour 20 Mins (Renewal) • 10 Days (Vacant Stall)",
        fee: "₱130.00 (Renewal) • ₱20,100.00 (New Stall) • ₱130+ (Tabo)",
      },
      {
        title: "Market Vendor Tax Clearance, Account Balance Inquiry & Ad Space",
        description: "Issues vendor clearances, verifies stallholder ledger balances, and approves commercial ad placements inside the market.",
        classification: "Simple",
        processingTime: "15 – 20 Mins (Clearance / Balance) • 1 Hour 22 Mins (Ad Space)",
        fee: "₱130.00 (Tax Clearance) • None (Inquiry)",
      },
      {
        title: "Provision of Low-Cost Burial Service (City Memorial Park)",
        description: "Facilitates affordable public cemetery plots and burial permits for Malaybalay families.",
        classification: "Simple",
        processingTime: "35 Minutes",
        fee: "₱5,100.00 standard burial tariff",
      },
      {
        title: "Slaughterhouse Animal Slaughtering, PUV Terminal Entry & Bulk Water Supply",
        description: "Operates NMIS-compliant meat slaughtering, Integrated Terminal PUV compliance, and Kibalabag bulk water supply to MCWD.",
        classification: "Simple / G2G",
        processingTime: "1 Hour 27 Mins (PUV) • 4 Hours (Small animals) • 3 Hours 50 Mins (Bulk Water)",
        fee: "₱100.00 (PUV) • Per head (Slaughter) • ₱2.60/cu.m. (MCWD Bulk Water)",
      },
    ],
    programs: [
      { title: "Public Market & Overland Terminal Operations", summary: "Central trading and regional passenger hub serving Malaybalay and Bukidnon commuters." },
    ],
    charterChapterRef: "CEEDMO 2026 (pp. 263–281 & p. 729)",
    sources: [
      ccSource("CEEDMO 2026 (pp. 263–281 & p. 729)"),
      sakataSource("CEEDMO Org Chart Page", "https://sakata.malaybalaycity.gov.ph/city-economic-enterprise-and-management-office/"),
    ],
  }),

  // 28. CITY URBAN DEVELOPMENT AND HOUSING OFFICE (CUDHO)
  officeBase("cudho", {
    aliases: ["housing"],
    name: "City Urban Development and Housing Office",
    shortName: "Housing (CUDHO)",
    acronym: "CUDHO",
    classification: "City Mayor's Office — Socialized Housing & Resettlement Division",
    parentOffice: "Office of the City Mayor",
    category: "Infrastructure, Housing & Planning",
    logoPath: "/images/offices/cudho.jpg",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "EnP. Perfecto Ray D. Bayo, Jr. (Division Head, CUDHO)",
    headNote: "CMO — City Urban Development & Housing Division coordinating the City Housing & Resettlement Committee.",
    overview:
      "Implements urban housing and resettlement programs under the Urban Development and Housing Act (RA 7279 / UDHA) and City Ordinance No. 565 s.2005 for hazard-vulnerable and landless households.",
    cardSummary:
      "Implements UDHA (RA 7279) socialized housing and resettlement programs for hazard-exposed households.",
    cardLocation: "1st Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "Operating from the Ground Floor of New City Hall, CUDHO evaluates beneficiary qualification under UDHA rules, tracks monthly lot amortizations with CTO, and coordinates site relocation and Deeds of Sale once full lot payments are completed.",
    whoServes:
      "Informal settler families in danger zones, landless households applying for city resettlement, and existing housing beneficiaries.",
    mandate:
      "Upgrade blighted settlements, qualify socialized housing beneficiaries, develop relocation sites and services, and serve the City Housing Resettlement Committee (EO 60 / EO 247) and Anti-Squatting Syndicate Committee.",
    divisions: [
      "Socialized Housing Beneficiary Screening & Validation Unit",
      "Estate Management & Lot Amortization Posting Section",
      "Resettlement Site Development & Relocation Unit",
    ],
    address: "1st Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0953-459-7882", "0953-459-7782", "(088) 813-4725 / 813-4761 Local 114"],
    emails: ["city8700housing@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/departments-offices/",
    services: [
      {
        title: "Relocation & Resettlement Qualification for Hazard-Vulnerable / Landless Families",
        classification: "Simple / Beneficiary Validation",
        processingTime: "7 Hours & 20 Minutes",
        fee: "None",
        reference: "Charter pp. 598–602",
      },
    ],
    programs: [
      { title: "City Housing Resettlement Committee (EO 60 s.2023)", summary: "Matches informal settlers in flood-prone zones with safe resettlement lots." },
    ],
    charterChapterRef: "CMO - HOUSING 2026 (pp. 598–602 & p. 728)",
    sources: [
      ccSource("CMO — CUDHO (pp. 598–602 & p. 728)"),
      sakataSource("Departments & Contact Directory", SAKATA_CONTACT_URL),
    ],
  }),

  // 29. TRAFFIC MANAGEMENT CENTER (TMC)
  officeBase("tmc", {
    aliases: ["traffic"],
    name: "Traffic Management Center",
    shortName: "Traffic Management (TMC)",
    acronym: "TMC",
    classification: "City Mayor's Office — Urban Traffic Operations & Enforcement Division",
    parentOffice: "Office of the City Mayor",
    category: "Public Safety & Emergency",
    logoPath: "/images/offices/tmc.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Joseph G. Jabla (Traffic Operations Officer / Head, TMC)",
    headNote: "CMO — Traffic Management Center Division overseeing road safety and motorela clearances.",
    overview:
      "Manages city road traffic flow, deploys traffic enforcers across school zones and Sayre Highway junctions, issues traffic citation clearances, and coordinates road closures and public utility routing.",
    cardSummary:
      "Manages city traffic flow, deploys road enforcers, issues citation clearances, and coordinates public routing.",
    cardLocation: "New City Hall Compound, Casisang",
    aboutDetails:
      "Working across Poblacion junctions and Sayre Highway corridors while coordinating citation settlements with City Treasurer Windows at City Hall, TMC conducts mandatory safety seminars for motorela drivers/operators, issues TMC IDs and clearances, and manages temporary road closures for civic events.",
    whoServes:
      "Motorela drivers & operators, motorists settling traffic citations, delivery fleet operators, and event organizers requesting road permits.",
    mandate:
      "Enforce the City Traffic Code, coordinate motorized tricycle and PUJ route compliance, process citation settlements with CTO, and safeguard pedestrian crossings.",
    divisions: [
      "Field Traffic Enforcement & School Zone Safety Unit",
      "Motorela & Public Utility Routing Compliance Unit",
      "TMC Clearances, Citations & Road Closure Permit Desk",
    ],
    address: "Traffic Management Center, New City Hall Compound, Barangay Casisang, Malaybalay City, 8700 Bukidnon (with CTO citation settlement counter at 1st Floor, New City Hall)",
    barangay: "Casisang",
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM Admin (Field Traffic Posts active daily)",
    phoneNumbers: ["0936-829-4691", "0935-568-4362"],
    emails: ["tmcmalaybalay2014@gmail.com"],
    facebookUrl: "https://www.facebook.com/tmc.malaybalay/",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/departments-offices/",
    services: [
      {
        title: "Motorela Safety Seminar, Inspection, ID & TMC Clearance",
        description: "Conducts safety driving seminars (4.5 hrs), annual motorela inspections, and issues TMC Clearances & driver/operator IDs.",
        classification: "Simple",
        processingTime: "3 – 15 Minutes (ID/Clearance/Inspection) • 4 Hours 30 Mins (Seminar)",
        fee: "₱130.00 (Seminar) • ₱100.00 (Clearance / Inspection) • ₱50.00 (ID)",
        requirements: [
          "LTO Official Receipt (OR) and Certificate of Registration (CR) of the motorela unit",
          "TMC Roadworthiness / Stencil Inspection Report and TODA/Association endorsement",
          "Current Community Tax Certificate (Cedula)",
        ],
      },
      {
        title: "Traffic Citation Settlement, Community Service Cert & Vehicle Release",
        description: "Accepts traffic penalty settlements (Ord. 900 s.2019), issues community-service certifications (Sec. 86), and releases impounded vehicles.",
        classification: "Simple / Technical",
        processingTime: "20 – 50 Minutes (Settlement / Release) • 1 Hour 15 Mins (Community Service Cert)",
        fee: "Per City Ordinance No. 900 s.2019 / ₱350+ towing/impounding fees",
        requirements: [
          "Traffic Citation Ticket (TOP/TCT) for traffic violation settlement",
          "1 valid government-issued ID",
        ],
      },
      {
        title: "Road Crash Response, Towing, Parade Escort & Fortich Truck Ban Exemption",
        description: "Responds to vehicular crashes, provides defective-vehicle towing, escorts approved motorcades (5 mins), and processes Fortich St. truck exemptions.",
        classification: "Emergency / Technical",
        processingTime: "5 – 20 Minutes (Escort / Tow / Exemption) • 2 Hours 30 Mins (Road crash)",
        fee: "None (Response / Escort / Exemption) • Towing tariff",
      },
    ],
    programs: [
      { title: "School Zone Safety & Kaamulan Traffic Rerouting", summary: "Real-time traffic advisories published directly through TMC's official Facebook page." },
      { title: "Motorela Fare Matrix Enforcement (City Ordinance No. 1095, s. 2026)", summary: "Enforces amended Automatic and Pakyaw Motorela Fare Matrix rules across city routes." },
    ],
    charterChapterRef: "CMO - TMC 2026 (pp. 572–587)",
    sources: [
      ccSource("CMO — Traffic Management Center (pp. 572–587)"),
      sakataSource("City Ordinance No. 1095, s. 2026 (Motorela Fare Matrix)", "https://sakata.malaybalaycity.gov.ph/ordinance-no-1095-series-of-2026/"),
      sakataSource("Departments & Contact Directory", SAKATA_DEPARTMENTS_URL),
    ],
  }),

  // 30. BIDS AND AWARDS COMMITTEE (BAC)
  officeBase("bac", {
    aliases: ["procurement"],
    name: "Bids and Awards Committee & BAC Secretariat",
    shortName: "Bids & Awards (BAC)",
    acronym: "BAC",
    classification: "Procurement Governance Committee — RA 9184 Competitive Public Bidding",
    parentOffice: "City Mayor's Office (Procurement Support Section)",
    category: "Finance & Administration",
    logoPath: "/images/offices/bac.jpg",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Dr. Dennis P. Sangalang, MD & Atty. Mitchell D. Talatala (BAC Chairpersons)",
    headNote: "Inter-departmental Bids & Awards Committee constituted under RA 9184 (Procurement Reform Act).",
    overview:
      "Administers competitive procurement of goods, civil works, and consulting services for the City Government under RA 9184, PhilGEPS posting, livestreamed bid openings, and Notice of Award disclosures.",
    cardSummary:
      "Conducts RA 9184 competitive bidding for goods, civil works, and consulting with livestreamed bid openings.",
    cardLocation: "2nd Floor, New City Hall, Brgy. Casisang",
    aboutDetails:
      "Anchored on the 2nd Floor of New City Hall alongside Procurement Support staff, BAC conducts public pre-bid conferences, livestreamed bid openings, eligibility checks, and Notice of Award/NTP releases—all indexed directly on BetterMC's Procurement Portal.",
    whoServes:
      "PhilGEPS-registered contractors and suppliers, civil society procurement observers, implementing City Hall offices, and audit monitors.",
    mandate:
      "Advertise invitations to bid, conduct pre-bid conferences and transparent public bid openings, determine bidder eligibility, and recommend contract awards to the Head of Procuring Entity.",
    divisions: [
      "BAC Secretariat & Bidding Documents Desk",
      "Technical Working Group (TWG) Bid Evaluation Support",
      "Procurement Support Section (CMO)",
    ],
    address: "2nd Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0967-016-9677", "(088) 813-4726 Local 115"],
    emails: ["bacmalaybalay@gmail.com"],
    facebookUrl: "https://www.facebook.com/bacmalaybalay",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/bids-and-awards-committee-structure/",
    services: [
      {
        title: "Alternative Mode Procurement (Shopping, Small Value Procurement, Direct / Emergency)",
        description: "Processes goods and services procurement below competitive-bidding thresholds via SVP, shopping, and agency-to-agency modes.",
        classification: "Highly Technical",
        processingTime: "18.5 Working Days (<₱50,000) • 25.5 Working Days (>₱50,000)",
        fee: "None",
      },
      {
        title: "Competitive Public Bidding — Goods and Services",
        description: "Administers invitation to bid, pre-bid conferences, public bid openings, post-qualification, and contract awards under RA 9184.",
        classification: "Highly Technical",
        processingTime: "26 – 136 Calendar Days",
        fee: "GPPB Standard Bidding Document Fee",
      },
      {
        title: "Competitive Public Bidding — Infrastructure Projects",
        description: "Conducts competitive bidding and award recommendations for City Government civil works and infrastructure contracts.",
        classification: "Highly Technical",
        processingTime: "36 – 156 Calendar Days",
        fee: "GPPB Standard Bidding Document Fee",
      },
    ],
    programs: [
      { title: "Livestreamed Public Bid Openings (Cross-linked to BetterMC /procurement/livestreams)", summary: "Maintains open-government procurement broadcasts on the official BAC Facebook page." },
    ],
    charterChapterRef: "CMO - BAC 2026 (pp. 482–506)",
    sources: [
      ccSource("CMO — BAC 2026 (pp. 482–506)"),
      sakataSource("Bids & Awards Committee Structure", "https://sakata.malaybalaycity.gov.ph/bids-and-awards-committee-structure/"),
    ],
  }),

  // 31. DILG - CLGOO MALAYBALAY
  officeBase("dilg", {
    aliases: ["clgoo"],
    name: "DILG — City Local Government Operations Office (CLGOO)",
    shortName: "DILG Malaybalay",
    acronym: "DILG-CLGOO",
    classification: "National Interior & Local Government Field Office",
    category: "National & Partner Agencies",
    logoPath: "/images/offices/dilg.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Amalia A. Propia (City Local Government Operations Officer)",
    headNote: "Field operations desk of the Department of the Interior and Local Government — Region 10.",
    overview:
      "City field office of the Department of the Interior and Local Government supervising SGLG/SGLGB governance assessments, Full Disclosure compliance, and technical mentoring for Malaybalay's 46 barangays.",
    cardSummary:
      "Supervises SGLG/SGLGB governance assessments, Full Disclosure compliance, and technical mentoring across 46 barangays.",
    cardLocation: "City Hall Compound, Brgy. Casisang",
    aboutDetails:
      "Holding office inside the New City Hall Compound in Casisang, DILG Malaybalay guides barangay councils on Katarungang Pambarangay, Peace & Order audits, Anti-Red Tape compliance, and Seal of Good Local Governance validation.",
    whoServes:
      "City and Barangay officials, Sangguniang Kabataan councils, Lupon members, and civic governance partners.",
    mandate:
      "Strengthen local autonomy, monitor Barangay Good Governance & Lupong Tagapamayapa Incentives Awards (LTIA), and promote peace, order, and anti-drug council (CADAC / CPOC) performance.",
    divisions: [
      "City Local Government Operations Officer (CLGOO) Desk",
      "SGLG / SGLGB & Full Disclosure Monitoring Unit",
      "Barangay Governance & Katarungang Pambarangay Support Desk",
    ],
    address: "New City Hall Compound, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0926-880-6529", "(088) 813-2562", "(088) 813-4726 Local 103"],
    emails: ["dilg.buk.malaybalay@gmail.cm"],
    officialWebUrl: "https://region10.dilg.gov.ph/",
    verificationNote:
      "Note: The LGU contact directory publishes 'dilg.buk.malaybalay@gmail.cm' (typo on .cm domain). Confirm active CLGOO email routing by calling 0926-880-6529 or (088) 813-2562, or coordinate with DILG Bukidnon Provincial Office at Capitol Grounds ((088) 813-5085 / dilg.kaamulan@gmail.com).",
    services: [
      { title: "Seal of Good Local Governance (SGLG / SGLGB) & Barangay Assessment", processingTime: "Annual DILG cycle", fee: "None" },
      { title: "Barangay Official Succession, Katarungang Pambarangay & DILG Endorsements", processingTime: "Field office review", fee: "None" },
    ],
    programs: [
      { title: "SGLG & SGLGB Assessment Teams (EO 15 & EO 35 s.2023)", summary: "Evaluates transparency, disaster preparedness, financial administration, and social protection." },
    ],
    sources: [
      sakataSource("DILG Region X Official Portal", "https://region10.dilg.gov.ph/"),
      sakataSource("sakata.malaybalaycity.gov.ph — Contact Us", SAKATA_CONTACT_URL),
    ],
  }),

  // 32. BFP MALAYBALAY CITY FIRE STATION
  officeBase("bfp", {
    aliases: ["fire-station"],
    name: "Bureau of Fire Protection — Malaybalay City Fire Station",
    shortName: "Fire Protection (BFP)",
    acronym: "BFP-CFS",
    classification: "National Uniformed Fire & Rescue Service (Partner City Regulatory Station)",
    category: "Public Safety & Emergency",
    logoPath: "/images/agencies/bfp.jpg",
    logoStatus: "Verified Local Asset",
    headOfOffice: "Ma. Anjelyn P. Pornia (City Fire Marshal / Station Head, CY 2026 APP)",
    headNote: "Commanded by the Malaybalay City Fire Marshal under BFP Region 10 (RA 9514).",
    overview:
      "Provides 24/7 fire suppression and emergency rescue while conducting mandatory Fire Safety Inspections for Building Permits (OBO) and Business Permits (BPLD).",
    cardSummary:
      "Provides 24/7 firefighting and rescue while issuing Fire Safety Clearances for building and business permits.",
    cardLocation: "Capt. Juan Melendez St., Brgy. 4",
    aboutDetails:
      "Alongside 24/7 emergency response across Poblacion and rural barangays, Malaybalay City Fire Station evaluates building plans for Fire Safety Evaluation Clearance (FSEC) and inspects commercial establishments for mandatory annual Fire Safety Inspection Certificates (FSIC).",
    whoServes:
      "Emergency callers, business owners securing BPLD Fire Safety Certificates, builders seeking FSEC, and barangay fire volunteers.",
    mandate:
      "Enforce the Revised Fire Code of the Philippines (RA 9514), issue Fire Safety Evaluation Clearances (FSEC) and Fire Safety Inspection Certificates (FSIC), and respond to structural/wildland fire emergencies.",
    divisions: [
      "24/7 Fire Suppression & Rescue Operations Unit",
      "Fire Safety Enforcement Division (FSEC & FSIC Inspection)",
      "Fire Prevention & Community Fire Brigade Unit",
    ],
    address: "Malaybalay City Central Fire Station, Capt. Juan Melendez Street, Barangay 4 (Poblacion), Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 4",
    operatingHours: "24/7 Fire & Rescue Operations • Mon–Fri 8:00 AM – 5:00 PM FSIC Assessment",
    phoneNumbers: ["0917-677-7700", "(088) 813-5449"],
    emails: ["malaybalaycfs@gmail.com"],
    officialWebUrl: SAKATA_CONTACT_URL,
    services: [
      {
        title: "Fire Safety Inspection Certificate (FSIC) for Business / Occupancy Permits",
        processingTime: "Aligned with BPLD/OBO BOSS",
        fee: "RA 9514 Fire Code fee (15% of local fee min ₱500)",
        requirements: [
          "Signed architectural/engineering plans (for FSEC Building Permit)",
          "Occupancy Permit assessment or Business Permit application form (for FSIC)",
          "Proof of functional fire extinguishers and emergency exit signage",
        ],
      },
      { title: "24/7 Emergency Fire Suppression & Rescue Response", processingTime: "Immediate Dispatch", fee: "None" },
    ],
    programs: [
      { title: "Oplan Ligtas na Pamayanan & Fire Brigade Drills", summary: "Barangay fire safety education and Fire Prevention Month inspections." },
    ],
    sources: [sakataSource("sakata.malaybalaycity.gov.ph — Contact Us", SAKATA_CONTACT_URL)],
  }),

  // 33. PNP MALAYBALAY CITY POLICE STATION
  officeBase("police", {
    aliases: ["pnp"],
    name: "Philippine National Police — Malaybalay City Police Station",
    shortName: "Malaybalay Police (PNP)",
    acronym: "MCPS-PNP",
    classification: "National Police Law Enforcement Station (Partner Peace & Order Unit)",
    category: "Public Safety & Emergency",
    logoPath: "/images/agencies/pnp.png",
    logoStatus: "Verified Local Asset",
    headOfOffice: "PLtCol. Ariel Philip I. Pontillas (Officer-in-Charge) • PLtCol. Joepet Baldonado Paglinawan (Chief of Police, CY 2026 APP)",
    headNote: "Commanded by the City Chief of Police under Bukidnon Police Provincial Office (PRO-10).",
    overview:
      "Maintains round-the-clock law enforcement, traffic accident investigation, women and children's protection desk (WCPD), blotter verification, and National Police Clearance issuance across Malaybalay City.",
    cardSummary:
      "Delivers 24/7 law enforcement, WCPD crisis support, blotter verification, and National Police Clearances.",
    cardLocation: "Fortich Street, Poblacion, Malaybalay",
    aboutDetails:
      "Headquartered in Poblacion Barangay 2, Malaybalay City Police Station operates a 24/7 public assistance & blotter desk, dedicated Women and Children's Protection officers, and the National Police Clearance System (NPCS) biometrics counter for employment and licensing applicants.",
    whoServes:
      "Jobseekers securing National Police Clearances, crime/accident complainants, barangay tanod partners, and emergency callers.",
    mandate:
      "Preserve peace and order, prevent and investigate crimes, serve the City Peace & Order Council (CPOC / EO 7) and CADAC (EO 227-A), and safeguard community security.",
    divisions: [
      "24/7 Police Desk, Patrol & Quick Response Unit",
      "Investigation, Blotter & Women and Children Protection Desk (WCPD)",
      "National Police Clearance System (NPCS) Processing Counter",
    ],
    address: "Fortich Street / City Police Headquarters, Poblacion, Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 2",
    operatingHours: "24/7 Police Desk & Blotter • Mon–Fri 8:00 AM – 5:00 PM Clearance Center",
    phoneNumbers: ["0926-821-8803", "(088) 813-0760"],
    emails: ["malaybalay.cps.pnp@gmail.com"],
    officialWebUrl: SAKATA_CONTACT_URL,
    services: [
      {
        title: "National Police Clearance System (NPCS) Biometrics & Release",
        processingTime: "Scheduled NPCS appointment",
        fee: "₱150.00 + payment fee (pnpclearance.ph)",
        requirements: [
          "NPCS Online Appointment Reference Number",
          "2 valid government-issued IDs (or 1 primary ID + Barangay Clearance & Birth Certificate)",
          "Original Barangay Certification & Oath of Undertaking (if claiming RA 11261 First-Time Jobseeker free clearance)",
        ],
      },
      { title: "24/7 Crime Reporting, Women & Children Protection Desk & Blotter Certification", processingTime: "Immediate / Same day", fee: "None / Standard Cert" },
    ],
    programs: [
      { title: "CPOC (EO 7) & CADAC (EO 227-A) Community Policing", summary: "Barangay peacekeeping coordination and drug-cleared barangay monitoring." },
    ],
    sources: [sakataSource("sakata.malaybalaycity.gov.ph — Contact Us", SAKATA_CONTACT_URL)],
  }),

  // 34. MUNICIPAL TRIAL COURT IN CITIES (MTCC) BRANCH 2
  officeBase("mtcc-branch-2", {
    aliases: ["city-court"],
    name: "Municipal Trial Court in Cities (MTCC) — Branch 2, Malaybalay",
    shortName: "City Court (MTCC Br. 2)",
    acronym: "MTCC-2",
    classification: "Judiciary Partner Court — Trial Court & Court Clearances",
    category: "National & Partner Agencies",
    logoPath: "/images/agencies/judiciary.png",
    logoStatus: "Verified Local Asset",
    headOfOffice: "Hon. Edmundo V. Raagas (Presiding Judge, MTCC Malaybalay)",
    headNote: "First-level Judiciary trial court operating under the Supreme Court of the Philippines.",
    overview:
      "Listed directly in the City Government's official Contact Directory as City Court Office handling civil/criminal first-level court cases, small claims, and local court clearances.",
    cardSummary:
      "First-level trial court handling civil and criminal cases, small claims, and local court clearances.",
    cardLocation: "Hall of Justice, Malaybalay City",
    aboutDetails:
      "Serving litigants and employment applicants requiring judiciary clearances within Malaybalay City's Hall of Justice, MTCC Branch 2 processes small claims actions, first-level criminal/civil dockets, and certified copies of court orders under Supreme Court administrative schedules.",
    whoServes:
      "Public employment/firearm applicants seeking MTCC Clearances, small claims filers, and legal counsels.",
    mandate:
      "Adjudicate first-level civil and criminal cases within Malaybalay City jurisdiction under Supreme Court rules and issue court clearances required for public employment or firearm/travel compliance.",
    divisions: [
      "Office of the Clerk of Court & Docket Archive",
      "Small Claims & Trial Intake Counter",
      "Court Clearance Verification Desk",
    ],
    address: "Hall of Justice / Court Complex, Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 9",
    operatingHours: "Monday to Friday, 8:00 AM – 4:30 PM / 5:00 PM (Judiciary schedule)",
    phoneNumbers: ["(088) 813-1664", "0956-123-4281"],
    emails: ["mtcc2mbyooo@judiciary.gov.ph"],
    officialWebUrl: SAKATA_CONTACT_URL,
    services: [
      { title: "Court Clearance Verification & Docket Inquiries", processingTime: "Judiciary clerk hours", fee: "Supreme Court JDF Schedule" },
      { title: "Small Claims Filing & Certified Copies of Court Orders", processingTime: "Court schedule", fee: "SC Rules of Court" },
    ],
    programs: [
      { title: "Accessible Local Justice & Small Claims Desk", summary: "Direct first-level trial court services listed in Malaybalay's civic contact directory." },
    ],
    sources: [sakataSource("sakata.malaybalaycity.gov.ph — Contact Us", SAKATA_CONTACT_URL)],
  }),

  // 35. DEPED SCHOOLS DIVISION OF MALAYBALAY CITY
  officeBase("deped-division", {
    aliases: ["deped-city"],
    name: "Department of Education — Schools Division of Malaybalay City",
    shortName: "DepEd Malaybalay",
    acronym: "DepEd-MC",
    classification: "National Education Division Office (Malaybalay City Territory)",
    category: "National & Partner Agencies",
    logoPath: "/images/agencies/deped.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: "https://www.deped.gov.ph/wp-content/uploads/2018/07/DepEd-Website-header-110px_1.png",
    headOfOffice: "Dr. Cherry Mae L. Limbaco-Reyes, CESO V (Schools Division Superintendent)",
    headNote: "Led by the Schools Division Superintendent under DepEd Region X.",
    overview:
      "Administers public elementary, integrated, and high schools across Malaybalay City, partnering with PESO on the Grade 10 Career Guidance Advocacy Program (CGAP) and City School Board planning.",
    cardSummary:
      "Administers public elementary and secondary schools in Malaybalay and co-leads Grade 10 Career Guidance (CGAP).",
    cardLocation: "Sayre Highway, Brgy. Casisang",
    aboutDetails:
      "Located along Sayre Highway in Barangay Casisang, the DepEd Malaybalay City Division oversees 104 educational institutions profiled across BetterMC's Education Directory, manages the Public Assistance Counter for learner credentials, and schedules career orientation drives alongside PESO.",
    whoServes:
      "Students, parents, public school teachers, school heads across all 46 barangays, and Grade 10 Career Guidance participants.",
    mandate:
      "Deliver quality K–12 basic education, supervise public and private school operations within the Schools Division of Malaybalay City, and process school records/Public Assistance inquiries.",
    divisions: [
      "Curriculum Implementation Division (CID)",
      "School Governance and Operations Division (SGOD)",
      "Public Assistance Counter (PAC) & Learner Records Desk",
    ],
    address: "Sayre Highway, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0907-688-9009", "0991-331-7778"],
    emails: ["pac.malaybalaycity@deped.gov.ph", "malaybalay.city@deped.gov.ph"],
    officialWebUrl: "https://malaybalay.deped.gov.ph/",
    services: [
      {
        title: "Public Assistance Counter (PAC) — Learner Records & Division Inquiries",
        processingTime: "Office hours",
        fee: "None",
        requirements: [
          "Certified True Copy of Form 137 / SF10 (Permanent Learner Record) and Diploma from the originating Malaybalay school",
          "School Principal endorsement letter",
          "Valid ID of learner or parent/guardian",
        ],
      },
      { title: "PESO Career Guidance Advocacy (CGAP) School Scheduling", processingTime: "2 Minutes (with PESO)", fee: "None" },
    ],
    programs: [
      { title: "Cross-linked to BetterMC /education (104 School Profiles)", summary: "Coordinates elementary, integrated, junior high, and senior high school initiatives across 46 barangays." },
    ],
    sources: [
      sakataSource("DepEd — Schools Division of Malaybalay City Portal", "https://malaybalay.deped.gov.ph/"),
      sakataSource("sakata.malaybalaycity.gov.ph — Contact Us", SAKATA_CONTACT_URL),
    ],
  }),

  // 36. OFFICE OF THE CITY PROSECUTOR (DOJ NATIONAL PROSECUTION SERVICE)
  officeBase("prosecutor", {
    aliases: ["city-prosecutor", "ocp"],
    name: "Office of the City Prosecutor — Malaybalay City",
    shortName: "City Prosecutor (DOJ)",
    acronym: "OCP-DOJ",
    classification: "National Prosecution Service Field Office (Department of Justice)",
    category: "National & Partner Agencies",
    logoPath: "/images/agencies/doj.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: "https://commons.wikimedia.org/wiki/File:Department_of_Justice_(DOJ).svg",
    headOfOffice: "Pros. Claver C. Ariño (City Prosecutor, DOJ National Prosecution Service)",
    headNote: "Heads the Malaybalay City Prosecution Office (recorded as Claver C. Aniño in CY 2026 LGU APP Summary).",
    overview:
      "Conducts preliminary investigations, inquest proceedings, criminal information filings, and prosecutor clearance certifications for Malaybalay City under the Department of Justice, supported locally under the CY 2026 Annual Procurement Plan.",
    cardSummary:
      "Conducts preliminary investigations, inquest proceedings, and prosecutor clearances at the Hall of Justice.",
    cardLocation: "Hall of Justice, Capitol Compound, Brgy. 9",
    aboutDetails:
      "Operating from the Hall of Justice in Capitol Compound alongside first- and second-level trial courts, the Office of the City Prosecutor receives criminal complaints, resolves inquest and preliminary investigation dockets, and issues Prosecutor Clearances required for employment and firearms licensing.",
    whoServes:
      "Law enforcement investigators filing complaints, complainants and respondents, legal counsels, and residents requesting Prosecutor Clearances.",
    mandate:
      "Assist the Secretary of Justice in investigating and prosecuting criminal offenses within Malaybalay City under Presidential Decree No. 1275 and Republic Act No. 10071 (Prosecution Service Act).",
    divisions: [
      "City Prosecutor's Office & Panel of Prosecutors",
      "Inquest & Preliminary Investigation Docket Desk",
      "Administrative Support & Prosecutor Clearance Unit",
    ],
    address: "Hall of Justice, Capitol Compound, San Victores St., Barangay 9 (Poblacion), Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 9",
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM (Duty Inquest Schedule)",
    phoneNumbers: ["(088) 813-7491", "(088) 221-4525"],
    emails: ["ocpmalaybalay@doj.gov.ph"],
    officialWebUrl: "https://www.doj.gov.ph/",
    services: [
      {
        title: "Issuance of Prosecutor's Clearance Certificate",
        description: "Verifies docket records and issues clearances certifying no pending criminal information in Malaybalay City.",
        classification: "Simple",
        processingTime: "Office hours (upon CTO receipt & record check)",
        fee: "₱100.00 Fiscal Clearance (CTO Regulatory Fee Schedule)",
        requirements: [
          "1 valid government-issued ID",
          "Current Community Tax Certificate (Cedula)",
          "Official Receipt of Fiscal Clearance Fee (₱100.00 from City Treasurer’s Office)",
        ],
      },
      {
        title: "Filing of Criminal Complaints, Inquest & Preliminary Investigation",
        description: "Receives PNP/NBI or private criminal complaints, conducts inquest evaluations, and resolves subpoenas and counter-affidavits.",
        classification: "Quasi-Judicial",
        processingTime: "DOJ Rules on Preliminary Investigation",
        fee: "None",
      },
    ],
    programs: [
      { title: "Local Justice & Legal Support Coordination", summary: "Receives ₱385,000 in instructional/reference materials & local LGU operational support under the CY 2026 APP." },
    ],
    sources: [
      sakataSource("CY 2026 Annual Procurement Plan Summary (p. 47)", "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/ANNUAL-PROCUREMENT-PLAN-2026.pdf"),
      sakataSource("Department of Justice — National Prosecution Service Portal", "https://www.doj.gov.ph/"),
    ],
  }),

  // 37. COMMISSION ON AUDIT (COA) — MALAYBALAY CITY AUDIT TEAM
  officeBase("coa", {
    aliases: ["commission-on-audit"],
    name: "Commission on Audit (COA) — Malaybalay City Audit Team",
    shortName: "Commission on Audit (COA)",
    acronym: "COA",
    classification: "Constitutional Audit Commission — Resident LGU Audit Team (LGAS-Bukidnon)",
    category: "National & Partner Agencies",
    logoPath: "/images/agencies/coa.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: "https://commons.wikimedia.org/wiki/File:Commission_on_Audit_(Philippines).svg",
    headOfOffice: "Ricster P. Jabien (Audit Team Leader, CY 2026 APP Summary)",
    headNote: "Resident Audit Team supervised by COA Regional Office No. X Local Government Audit Sector (LGAS).",
    overview:
      "Independent constitutional audit office assigned to examine and post-audit City Government of Malaybalay and 46-barangay accounts, financial statements, infrastructure contracts, and public procurement under COA Region X.",
    cardSummary:
      "Conducts constitutional financial and compliance audits of City Government and barangay accounts.",
    cardLocation: "City Hall Compound, Brgy. Casisang",
    aboutDetails:
      "Holding office inside City Hall Compound under COA Regional Office No. X (Northern Mindanao), the resident audit team verifies City Government and barangay financial transactions, conducts contract post-audits and technical inspections, and publishes Annual Audit Reports (AAR).",
    whoServes:
      "City Hall accountable officers, all 46 barangay treasurers, civic transparency researchers, and government auditors.",
    mandate:
      "Exercise constitutional power under Article IX-D of the 1987 Constitution and PD 1445 to examine, audit, and settle all City Government and barangay accounts, revenues, expenditures, and property holdings.",
    divisions: [
      "Resident Audit Team — City Government of Malaybalay",
      "LGAS-D Bukidnon Provincial Audit Supervision (COA Region X)",
      "Contract Review, Technical Inspection & Citizen Fraud Desk Routing",
    ],
    address: "City Hall Compound, Barangay Casisang, Malaybalay City, 8700 Bukidnon (Regional Hub: COA RO-X, Carmen, CDO)",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["(088) 850-0538", "0998-842-8804", "(088) 813-4726"],
    emails: ["coa10.lgas.d@coa.gov.ph", "coa.reg10@coa.gov.ph"],
    officialWebUrl: "https://region10.coa.gov.ph/",
    services: [
      {
        title: "Post-Audit of City & Barangay Financial Statements and Vouchers",
        description: "Examines monthly trial balances, year-end financial statements, disbursement vouchers, and Annual Audit Reports.",
        classification: "Constitutional Audit",
        processingTime: "COA Annual Audit Cycle",
        fee: "None",
      },
      {
        title: "Notice of Finality, Audit Observation Review & Citizen Fraud Desk Inquiries",
        description: "Routes public audit reports, Citizen Participatory Audit inquiries, and COA Region X legal/records requests.",
        classification: "Public Accountability",
        processingTime: "Per COA Region X Records Schedule",
        fee: "None",
      },
    ],
    programs: [
      { title: "Public Financial Accountability & Full Disclosure Review", summary: "Independently audits LGU finances with ₱1,338,624 resident office operational support in the CY 2026 APP." },
    ],
    sources: [
      sakataSource("CY 2026 Annual Procurement Plan Summary (p. 47)", "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/ANNUAL-PROCUREMENT-PLAN-2026.pdf"),
      sakataSource("Commission on Audit Regional Office No. X", "https://region10.coa.gov.ph/"),
    ],
  }),

  // 38. BUREAU OF JAIL MANAGEMENT AND PENOLOGY (BJMP) — MALAYBALAY CITY JAIL
  officeBase("bjmp", {
    aliases: ["city-jail", "malaybalay-jail"],
    name: "Bureau of Jail Management and Penology — Malaybalay City District Jail",
    shortName: "City Jail (BJMP)",
    acronym: "BJMP-MC",
    classification: "National Penology & Jail Management Agency (DILG Partner Facility)",
    category: "Public Safety & Emergency",
    logoPath: "/images/agencies/bjmp.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: "https://commons.wikimedia.org/wiki/Category:Bureau_of_Jail_Management_and_Penology",
    headOfOffice: "JInsp. Murphy B. Todyog (BJMP-Main) • JCInsp. Haidee G. Macandili (BJMP-Reformatory Center)",
    headNote: "Both BJMP-Main and BJMP-Reformatory Center are listed under Malaybalay's CY 2026 APP Summary (p. 47).",
    overview:
      "Administers humane safekeeping, court appearance escorts, and rehabilitation/reformation programs for Persons Deprived of Liberty (PDLs) at the Malaybalay City District Jail under BJMP Region X.",
    cardSummary:
      "Oversees safekeeping and reformation programs for Persons Deprived of Liberty at Malaybalay City District Jail.",
    cardLocation: "Barangay Patpat, Malaybalay City",
    aboutDetails:
      "Operating in Barangay Patpat with LGU support for both BJMP-Main and the BJMP Reformatory Center, the facility coordinates court commitment orders with Hall of Justice courts, oversees PDL livelihood and skills programs (including TUPAD and ALS education), and manages accredited visitation desks.",
    whoServes:
      "Families scheduling PDL visitations (Dalaw), legal counsels coordinating PDL conferences, and partner social welfare / DOLE livelihood teams.",
    mandate:
      "Ensure the humane safekeeping, security, and developmental welfare and reformation of district and city jail inmates (PDLs) pursuant to Republic Act No. 6975 and RA 9263 under DILG-BJMP Region X.",
    divisions: [
      "Custodial & Security Operations Unit (BJMP-Main)",
      "PDL Welfare, Livelihood & Reformatory Center Division",
      "Visitation (Dalaw) & Legal Counsel Assistance Desk",
    ],
    address: "Malaybalay City District Jail, Barangay Patpat, Malaybalay City, 8700 Bukidnon",
    barangay: "Patpat",
    operatingHours: "24/7 Custodial Operations • Scheduled Dalaw / Visitation Hours",
    phoneNumbers: ["0967-382-2798", "(02) 8926-5129"],
    emails: [],
    officialWebUrl: "https://r10.bjmp.gov.ph/",
    verificationNote:
      "Listed numbers connect to BJMP Regional Office X (0967-382-2798) and the National BJMP Trunkline ((02) 8926-5129) per operational security directory rules; schedule visitation in person at the Barangay Patpat facility Help Desk.",
    services: [
      {
        title: "PDL Visitation (Dalaw) & Legal Counsel Conference Coordination",
        description: "Processes accredited family visitation schedules, food/hygiene parcel screening, and lawyer consultations.",
        classification: "Facility Desk",
        processingTime: "Scheduled visitation window",
        fee: "None",
        requirements: [
          "1 valid government-issued ID",
          "Proof of immediate relationship or IBP ID / Legal Counsel Authorization",
        ],
      },
      {
        title: "PDL Certificate of Detention & Court Commitment Coordination",
        description: "Issues detention certifications and coordinates court hearings with MTCC and RTC branches.",
        classification: "Simple",
        processingTime: "Office hours (with valid ID & authorization)",
        fee: "None",
      },
    ],
    programs: [
      { title: "PDL Livelihood, Alternative Learning (ALS) & Reformation Center", summary: "Receives ₱2,033,944 combined local support across BJMP-Main and Reformatory Center under CY 2026 APP." },
    ],
    sources: [
      sakataSource("CY 2026 Annual Procurement Plan Summary (p. 47)", "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/ANNUAL-PROCUREMENT-PLAN-2026.pdf"),
      sakataSource("BJMP Regional Office No. X Portal", "https://r10.bjmp.gov.ph/"),
    ],
  }),

  // 39. PAROLE AND PROBATION ADMINISTRATION (PPA) — MALAYBALAY CITY
  officeBase("parole-probation", {
    aliases: ["ppa", "probation"],
    name: "Parole and Probation Administration — Malaybalay City Office (DOJ-PPA)",
    shortName: "Parole & Probation (PPA)",
    acronym: "DOJ-PPA",
    classification: "National Community-Based Rehabilitation Agency (Department of Justice)",
    category: "National & Partner Agencies",
    logoPath: "/images/agencies/ppa.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: "https://commons.wikimedia.org/wiki/File:Parole_and_Probation_Administration_(PPA).svg",
    headOfOffice: "Dennah E. Vivares (Chief Probation and Parole Officer, CY 2026 APP)",
    headNote: "Listed as Department/Office Head for Parole & Probation local support in the CY 2026 LGU APP Summary.",
    overview:
      "DOJ field office at the Hall of Justice administering pre-sentence probation investigations, community-based supervision of probationers and parolees, restorative justice counseling, and volunteer probation aide programs across Malaybalay City and nearby towns.",
    cardSummary:
      "Conducts probation investigations and community-based rehabilitation supervision at the Hall of Justice.",
    cardLocation: "Hall of Justice, Capitol Compound, Brgy. 9",
    aboutDetails:
      "Located on the Ground Floor of the Hall of Justice inside Capitol Compound, Malaybalay City Parole and Probation Office serves RTC Branches 8–10, MTCC Malaybalay, and neighboring municipalities (Lantapan, Impasug-ong, Sumilao, and Cabanglasan) with therapeutic community programs and restorative reintegration.",
    whoServes:
      "Court-referred probation applicants, supervised parolees and pardonees, family support networks, and Volunteer Probation Assistants (VPAs).",
    mandate:
      "Conduct Post-Sentence Investigations for trial courts and supervise individualized community-based rehabilitation of probationers, parolees, and pardonees under Presidential Decree No. 968 and Executive Order No. 292.",
    divisions: [
      "Post-Sentence Investigation & Court Liaison Unit",
      "Community Supervision & Therapeutic Community Program",
      "Volunteer Probation Assistant (VPA) & Restorative Justice Desk",
    ],
    address: "Ground Floor, Hall of Justice, Capitol Compound, Barangay 9 (Poblacion), Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 9",
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["(088) 813-3074"],
    emails: ["ppadoj_malayb@yahoo.com"],
    officialWebUrl: "https://probation.gov.ph/",
    services: [
      {
        title: "Post-Sentence Investigation (PSI) & Court Referral Intake",
        description: "Evaluates background and suitability of convicted applicants referred by RTC or MTCC courts for probation.",
        classification: "Court Referral",
        processingTime: "Statutory 60-day court period (PD 968)",
        fee: "None",
        requirements: [
          "Court Referral Order (RTC / MTCC Malaybalay) for Post-Sentence Investigation",
          "1 valid government-issued ID",
          "Barangay Certificate of Residency in Malaybalay City",
        ],
      },
      {
        title: "Probation / Parole Reporting, Clearance & Rehabilitation Compliance",
        description: "Conducts mandatory periodic reporting, therapeutic community sessions, and termination/clearance endorsements.",
        classification: "Supervision",
        processingTime: "Office hours (per court order schedule)",
        fee: "None",
      },
    ],
    programs: [
      { title: "Therapeutic Community & Restorative Justice Reintegration", summary: "Receives ₱571,230 in local City Government operational support under the CY 2026 APP." },
    ],
    sources: [
      sakataSource("CY 2026 Annual Procurement Plan Summary (p. 47)", "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/ANNUAL-PROCUREMENT-PLAN-2026.pdf"),
      sakataSource("DOJ Parole and Probation Administration Official Portal", "https://probation.gov.ph/"),
    ],
  }),
];

/**
 * Verified Local Special Bodies & Special Committees from sakata.malaybalaycity.gov.ph/local-special-bodies-and-special-committees/
 */
export const localSpecialBodies: LocalSpecialBody[] = [
  {
    id: "lsb-cdc",
    name: "City Development Council (CDC)",
    executiveOrder: "Executive Order No. 229",
    year: "2022",
    leadOfficeSlug: "cpdo",
    leadOfficeName: "City Planning & Development Office",
    mandateSummary: "Formulates long-term, medium-term, and annual socio-economic development plans and prioritizes barangay & city investment programs.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-health-board",
    name: "City Health Board (Malaybalay)",
    executiveOrder: "Executive Order No. 5 & EO No. 26",
    year: "2023",
    leadOfficeSlug: "cho",
    leadOfficeName: "City Health Office",
    mandateSummary: "Proposes annual health budgetary allocations and advises the Sangguniang Panlungsod on local health policies and clinics.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-cpoc",
    name: "City Peace and Order Council (CPOC)",
    executiveOrder: "Executive Order No. 7 (amending EO 227 s.2022)",
    year: "2023",
    leadOfficeSlug: "mayor",
    leadOfficeName: "Office of the City Mayor / PNP / DILG",
    mandateSummary: "Coordinates anti-criminality, peacekeeping, and multi-agency security plans across Malaybalay's 46 barangays.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-cadac",
    name: "City Anti-Drug Abuse Council (CADAC) & Reformation Committee",
    executiveOrder: "Executive Order No. 227-A",
    year: "2022",
    leadOfficeSlug: "police",
    leadOfficeName: "City Mayor's Office / PNP / DILG",
    mandateSummary: "Leads barangay drug-clearing advocacy, community rehabilitation referrals, and anti-illegal drug coordination.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-chrc",
    name: "City Housing & Resettlement Committee (CHRC)",
    executiveOrder: "Executive Order No. 60 (s.2023) & EO No. 247 (s.2022)",
    year: "2023",
    leadOfficeSlug: "cudho",
    leadOfficeName: "City Urban Development & Housing Office",
    mandateSummary: "Oversees beneficiary selection, relocation site development, and hazard-vulnerable resettlement.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-cswmb",
    name: "City Solid Waste Management Board (CSWMB)",
    executiveOrder: "Executive Order No. 24",
    year: "2023",
    leadOfficeSlug: "cenro",
    leadOfficeName: "City Environment & Natural Resources Office",
    mandateSummary: "Implements Malaybalay's 10-Year Ecological Solid Waste Management Plan under RA 9003.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-eoc",
    name: "Emergency Operations Center (EOC) & Camp Management Team",
    executiveOrder: "Executive Orders No. 36 & 37",
    year: "2023",
    leadOfficeSlug: "drrmo",
    leadOfficeName: "CDRRMO & CSWDO",
    mandateSummary: "Activates unified command, emergency evacuation camp management, and relief coordination during typhoons and floods.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-pleb",
    name: "People's Law Enforcement Board (PLEB) Secretariat",
    executiveOrder: "Executive Order No. 9",
    year: "2023",
    leadOfficeSlug: "sp",
    leadOfficeName: "Sangguniang Panlungsod Office",
    mandateSummary: "Provides secretariat support for citizen complaints, administrative hearings, and PNP PLEB clearances.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-cart",
    name: "Committee on Anti-Red Tape (CART)",
    executiveOrder: "Executive Order No. 14",
    year: "2023",
    leadOfficeSlug: "admin",
    leadOfficeName: "City Administrator's Office",
    mandateSummary: "Oversees RA 11032 Ease of Doing Business compliance and annual updates to Malaybalay's Citizen's Charter.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-liib",
    name: "Local Investment and Incentives Board (LIIB)",
    executiveOrder: "Executive Order No. 18",
    year: "2023",
    leadOfficeSlug: "bpld",
    leadOfficeName: "BPLD / City Mayor's Office",
    mandateSummary: "Promotes priority agro-industrial, ICT, and tourism investments in Malaybalay City.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-ict",
    name: "Malaybalay ICT Innovation Council",
    executiveOrder: "Executive Order No. 29",
    year: "2023",
    leadOfficeSlug: "admin",
    leadOfficeName: "City Administrator's Office (MIS Division)",
    mandateSummary: "Guides digital public service modernization, e-governance workflows, and connectivity initiatives.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-nutrition",
    name: "City Nutrition Committee (CNC)",
    executiveOrder: "Executive Order No. 59",
    year: "2023",
    leadOfficeSlug: "cho",
    leadOfficeName: "City Health Office & CSWDO",
    mandateSummary: "Coordinates barangay child feeding, stunting reduction, and maternal nutrition campaigns.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-tourism-council",
    name: "Malaybalay City Tourism Council",
    executiveOrder: "Executive Order No. 230",
    year: "2022",
    leadOfficeSlug: "tourism",
    leadOfficeName: "City Tourism Division",
    mandateSummary: "Unites local government, indigenous cultural leaders, and tourism operators on sustainable destination development.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-water-safety",
    name: "Water Safety Board & Technical Working Group",
    executiveOrder: "Executive Order No. 16",
    year: "2023",
    leadOfficeSlug: "cho",
    leadOfficeName: "CHO / CENRO / Engineering",
    mandateSummary: "Monitors drinking water potability, watershed safety, and rural barangay water systems.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-price-council",
    name: "Malaybalay City Price Coordinating Council (MCPCC)",
    executiveOrder: "Executive Order No. 236",
    year: "2022",
    leadOfficeSlug: "ceedmo",
    leadOfficeName: "CEEDMO / DTI / CAO",
    mandateSummary: "Monitors basic commodity prices, stabilizes market supplies, and safeguards consumers during calamities.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-pmc",
    name: "City Project Monitoring Committee (PMC) & Inspectorate Team",
    executiveOrder: "Executive Order No. 13",
    year: "2023",
    leadOfficeSlug: "cpdo",
    leadOfficeName: "CPDO & City Engineering Office",
    mandateSummary: "Tracks physical and financial implementation of city-funded infrastructure and development projects.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-sglg",
    name: "SGLG & SGLGB Assessment Teams",
    executiveOrder: "Executive Orders No. 15 & 35",
    year: "2023",
    leadOfficeSlug: "dilg",
    leadOfficeName: "DILG CLGOO & City Administrator",
    mandateSummary: "Evaluates City and Barangay compliance with national Seal of Good Local Governance standards.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
  {
    id: "lsb-gad",
    name: "Gender and Development (GAD) Focal Point System — ExecCom",
    executiveOrder: "Executive Order No. 12",
    year: "2023",
    leadOfficeSlug: "cswdo",
    leadOfficeName: "CSWDO & City Budget / CPDO",
    mandateSummary: "Steers GAD budget planning, VAWC desks, and inclusive programming across city offices.",
    sourceUrl: SAKATA_SPECIAL_BODIES_URL,
  },
];

export const governmentOfficeBySlug = new Map<string, GovernmentOffice>(
  governmentOffices.map((office) => [office.slug, office]),
);

const officeAliasToSlug = new Map<string, string>();
for (const office of governmentOffices) {
  officeAliasToSlug.set(office.slug, office.slug);
  for (const alias of office.aliases ?? []) {
    officeAliasToSlug.set(alias, office.slug);
  }
}

export function resolveOfficeSlug(candidate: string): string | null {
  const clean = candidate.trim().toLowerCase();
  if (!clean) return null;
  return officeAliasToSlug.get(clean) ?? null;
}

/**
 * Resolves a dedicated Government Office subdomain (e.g. peso.bettermalaybalay.cloud,
 * cswdo.bettermalaybalay.cloud) or local preview query (?office=peso, ?subdomain=peso).
 */
export function officeSlugFromHostname(hostname: string, search = ""): string | null {
  if (search) {
    const params = new URLSearchParams(search);
    const explicitOffice = (
      params.get("office") ??
      params.get("officeSubdomain") ??
      params.get("subdomain") ??
      params.get("domain") ??
      ""
    )
      .trim()
      .toLowerCase();
    const resolved = resolveOfficeSlug(explicitOffice);
    if (resolved) return resolved;
  }

  const normalized = hostname.toLowerCase().split(":")[0];
  const suffixes = [
    ".bettermalaybalay.cloud",
    ".bettermc.ph",
    ".bettergov.org",
    ".bettermalaybalay.com",
    ".vercel.app",
    ".localhost",
  ];
  const suffix = suffixes.find((candidate) => normalized.endsWith(candidate));
  if (!suffix) return null;
  const sub = normalized.slice(0, -suffix.length);
  if (!sub || sub === "www") return null;
  return resolveOfficeSlug(sub);
}
