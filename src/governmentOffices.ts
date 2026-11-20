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

export type OfficeDiscrepancyNote = {
  field: string;
  detail: string;
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
  discrepancies?: OfficeDiscrepancyNote[];
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

const VERIFIED_DATE = "2026-11-20";
const SAKATA_DEPARTMENTS_URL = "https://sakata.malaybalaycity.gov.ph/departments-offices/";
const SAKATA_CONTACT_URL = "https://sakata.malaybalaycity.gov.ph/contact-us/";
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
    discrepancies: [
      {
        field: "Mobile Contact Numbers",
        detail: "2026 Citizen's Charter (p. 550+) prints 0907-688-5735 while sakata.malaybalaycity.gov.ph/contact-us/ prints 0915-542-3434 and 0912-163-5505. All three are listed here.",
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
      "Community Affairs Division (Scholarships, Purok Devt, CSO Desk)",
      "Office of the Senior Citizens Affairs (OSCA)",
      "City Tourism Division & Traffic Management Center (TMC)",
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
        classification: "Simple",
        processingTime: "24 Minutes",
        fee: "₱130.00",
        whoMayAvail: "Malaybalay City residents requiring local executive clearance",
        reference: "2026 Citizen's Charter (Community Affairs)",
      },
      {
        title: "Official Appointments, Executive Endorsements & Barangay Assistance",
        classification: "Simple",
        processingTime: "Subject to Mayor's schedule & completeness",
        fee: "None",
        whoMayAvail: "Barangay officials, national agencies, CSOs, and citizens",
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
    aboutDetails:
      "Serving both internal City Hall operations and public feedback channels under RA 11032, the City Administrator's Office oversees City Hall digital networks, IEC publications, official ID printing, Committee on Anti-Red Tape (CART) compliance, and Citizen's Charter monitoring across 24 documented transactions.",
    whoServes:
      "City Hall departments, citizens filing 8888 / CART service feedback, Senior Citizen pocket ID applicants, and media partners.",
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
    emails: ["imalaybalay.8700@gmail.com", "cadodmo.malaybalay@gmail.com"],
    facebookUrl: "https://www.facebook.com/lgumalaybalay.adminfo/",
    officialWebUrl: SAKATA_ADMIN_URL,
    services: [
      { title: "1. Publication of City News & Announcements (PID)", processingTime: "5 Hours", fee: "None", reference: "Charter pp. 37–82" },
      { title: "2. 8888 Citizens' Complaint Hotline Handling", processingTime: "56 Hours & 25 Minutes", fee: "None", reference: "Charter pp. 37–82" },
      { title: "3. Approval of Official City Documents", processingTime: "1 Hour & 50 Minutes", fee: "None" },
      { title: "4. Senior Citizens Pocket ID & CGM Official ID Printing", processingTime: "20 Minutes", fee: "None" },
      { title: "5. MIS Computer, Network, Biometric & Software Support (Internal)", processingTime: "4 Minutes – 7 Hours 45 Mins", fee: "None" },
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
    phoneNumbers: ["(088) 813-4350", "0917-479-6861", "0917-497-6861", "(088) 813-3205"],
    emails: ["spmalaybalaycity@gmail.com"],
    facebookUrl: "https://www.facebook.com/CityofMalaybalaySP/",
    officialWebUrl: SAKATA_SP_URL,
    services: [
      { title: "1. Issuance of Certificate of Appearance", processingTime: "4 Minutes", fee: "None", reference: "Charter pp. 711–727" },
      { title: "2. Certified Copies of SP Minutes / Journal of Proceedings", processingTime: "46 Minutes", fee: "None" },
      { title: "3. Certified Copies of Approved Ordinances & Resolutions", processingTime: "Same day (upon approval)", fee: "None / Copy fee per ordinance" },
      { title: "4. Legislative Review of Barangay Ordinances & Resolutions", processingTime: "31 Days & 15 Minutes", fee: "None" },
      { title: "5. PLEB Clearance & Administrative Case Stenographic Notes", processingTime: "Same day – Hearing cycle", fee: "None" },
    ],
    programs: [
      { title: "Regular Council Sessions & Public Committee Hearings", summary: "Open legislative deliberations on city tax measures, land-use zoning, appropriations, and local welfare ordinances." },
      { title: "PLEB Administrative Oversight (EO 9)", summary: "Secretariat supporting civilian complaints and clearances involving PNP personnel." },
    ],
    discrepancies: [
      { field: "Telephone & Mobile Formatting", detail: "Charter Appendix (p. 728) lists 088-813-4350 / 0917-479-6861 while sakata/contact-us prints 0917-497-6861 / (088) 813-3205." },
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
    phoneNumbers: ["0917-128-8087", "(088) 813-5940"],
    emails: ["spmarabe@gmail.com"],
    facebookUrl: "https://www.facebook.com/CityofMalaybalaySP/",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/legislative/",
    services: [
      { title: "Constituent Legislative Proposals & Assistance Endorsements", processingTime: "During office hours", fee: "None" },
      { title: "Committee Referral & Presiding Officer Certification", processingTime: "Session cycle", fee: "None" },
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
    headNote: "Division under the Office of the City Mayor (supervised by CMO – Community Affairs Officer).",
    overview:
      "Directly serves puroks, barangays, civil society organizations (CSOs), NGOs, and college students under the City Mayor's Office—administering the Malaybalay City Scholarship Program, Mayor's Clearance issuance, Sports Assistance, and CSO Accreditation.",
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
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/malaybalay-city-scholarship-2/",
    services: [
      { title: "1. City Scholarship Program — New Scholar Application", classification: "Simple", processingTime: "32 Minutes", fee: "None", reference: "Charter pp. 536–540" },
      { title: "2. City Scholarship Program — Existing Scholar Renewal & Incentive Allowance", classification: "Simple", processingTime: "14 – 21 Minutes", fee: "None" },
      { title: "3. Issuance of Mayor's Clearance", classification: "Simple", processingTime: "24 Minutes", fee: "₱130.00" },
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
    ],
    charterChapterRef: "CMO - COMMUNITY AFFAIRS 2026 (pp. 531–548)",
    sources: [
      ccSource("CMO — Community Affairs Division (pp. 531–548)"),
      sakataSource("Malaybalay City Scholarship Page", "https://sakata.malaybalaycity.gov.ph/malaybalay-city-scholarship-2/"),
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
    headNote: "OSCA Head appointed by the City Mayor pursuant to Republic Act No. 9994.",
    overview:
      "Dedicated division under the City Mayor's Office implementing the Expanded Senior Citizens Act (RA 9994) through rapid Senior Citizen ID issuance, medicine/grocery discount booklets, and elderly welfare referrals.",
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
        requirements: ["Valid ID, Barangay Certification, Recent Cedula, PSA Birth Certificate, Application Form, 2 pcs 1x1 picture"],
        reference: "Charter pp. 566–568",
      },
      {
        title: "2. Issuance of Senior Citizens Medicine & Grocery Purchase Booklet",
        classification: "Simple",
        processingTime: "15 – 30 Minutes",
        fee: "None",
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
      { title: "City Government Plantilla Job Application Intake (CSC Form No. 9)", processingTime: "Published CSC 15-day window", fee: "None" },
      { title: "Request for Service Record, COE & Official Employee ID", processingTime: "15 Minutes – 1 Day", fee: "None", reference: "Charter p. 409+" },
      { title: "Request for Conduct of Orientation / Training", processingTime: "45 Minutes", fee: "None" },
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
    phoneNumbers: ["0916-414-7427", "(088) 813-4726 Local 101"],
    emails: ["clo8134706@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/citylegaloffice/",
    services: [
      { title: "Review of LGU / Barangay Contracts & Memoranda of Agreement", processingTime: "Charter cycle (pp. 442–457)", fee: "None" },
      { title: "Legal Opinion & Public Document Consultation", processingTime: "Varies by complexity", fee: "None" },
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
    phoneNumbers: ["0917-110-7717", "0997-491-8757", "0926-842-6446", "(088) 813-3772", "(088) 813-4726 Local 102"],
    emails: ["cpdomalaybalay@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/city-planning-and-development-office/",
    services: [
      { title: "1. Locational Clearance (Simple)", classification: "Simple", processingTime: "55 Minutes", fee: "₱920.00", reference: "Charter pp. 603–619" },
      { title: "2. Locational Clearance (Complex)", classification: "Complex", processingTime: "2 Days, 3 Hours & 16 Minutes", fee: "Per Zoning Fee Schedule" },
      { title: "3. Zoning Certification (CLUP / Land Use Classification)", classification: "Simple", processingTime: "Charter standard", fee: "Per Schedule" },
      { title: "4. Preliminary / Final Subdivision Development Plan Permits (PSDP / SDP / Alteration)", classification: "Highly Technical", processingTime: "12 – 38 Days", fee: "Per Schedule" },
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
    phoneNumbers: ["(088) 813-4726 / 813-4761 Local 110"],
    emails: ["cacco.malaybalay@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/city-accounting-office/",
    services: [
      { title: "1. Pre-Audit for Disbursement Voucher", processingTime: "4 Hours", fee: "None", reference: "Charter pp. 20–36" },
      { title: "2. Issuance of Accountant's Advice", processingTime: "3 Hours", fee: "None" },
      { title: "3. Certificate of Net Take-Home Pay & Tax Certificates (VAT / Income)", processingTime: "1.5 – 2 Hours", fee: "None" },
      { title: "4. Barangay Financial Transactions Processing & Statements", processingTime: "2 Hours (txn) / 30 Days (FS)", fee: "None" },
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
    headNote: "Supervised by the City Treasurer across 1st Floor Cashier Windows & BOSS One-Stop Counter.",
    overview:
      "Collects Real Property Tax, Business Taxes, Transfer Tax, Professional Tax, Community Tax Certificates (Cedula), and regulatory fees—and disburses supplier checks, financial assistance, and payroll.",
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
      { title: "1. Issuance of Community Tax Certificate (Cedula)", processingTime: "8 Minutes", fee: "₱5.00 basic + assessment", reference: "Charter pp. 655–674" },
      { title: "2. Payment of Real Property Tax & Tax Clearance", processingTime: "Under CTO window standard", fee: "Per Revenue Code" },
      { title: "3. Payment of Transfer Tax & Professional Tax (PTR)", processingTime: "5 Minutes", fee: "75% of 1% (Transfer) / ₱300 (PTR)" },
      { title: "4. Payment of Traffic Violation Citations & Regulatory Fees", processingTime: "5 Minutes", fee: "Per City Ordinance" },
      { title: "5. Releasing of Financial Assistance & Supplier/Contractor Checks", processingTime: "6 – 10 Minutes", fee: "None" },
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
    logoPath: "/images/offices/city-mayor.png",
    logoStatus: "Verified Local Asset",
    logoSourceUrl: SAKATA_DEPARTMENTS_URL,
    headOfOffice: "Atty. Mitchell D. Talatala (City Assessor)",
    headNote: "Assisted by Maylyn T. Gantalao (Assistant City Assessor).",
    overview:
      "Maintains Malaybalay City's master real property assessment rolls, tax maps, and property records across all 46 barangays—issuing Tax Declarations, ownership transfers, subdivisions, and Certified True Copies.",
    aboutDetails:
      "Situated on the 1st Floor of New City Hall near CTO tax windows, the City Assessor's Office maintains parcel tax mapping, evaluates new buildings and machinery for fair market valuation, and verifies Tax Declaration histories before real property sales or transfers.",
    whoServes:
      "Landowners, homeowners, surveyors, real estate buyers, banks requiring property certifications, and heirs processing estate transfers.",
    mandate:
      "Ensure laws and policies governing real property appraisal and assessment for taxation are fairly, uniformly, and accurately executed across agricultural, residential, commercial, and industrial parcels.",
    divisions: [
      "Administrative Unit",
      "Appraisal & Assessment Services Division (Appraisal & Assessment Sections)",
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
      { title: "Transfer, Subdivision & Consolidation of Tax Declarations", processingTime: "Charter pp. 132–176", fee: "Per CTO fee schedule" },
      { title: "Issuance of Certified True Copy of Tax Declaration & Vicinity Map", processingTime: "Same day", fee: "CTO Documentary Stamp / Certification Fee" },
      { title: "New Building / Machinery Appraisal & Reclassification Inspection", processingTime: "Field inspection schedule", fee: "None" },
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
    aboutDetails:
      "Operating from the 2nd Floor of New City Hall, CGSO verifies supplier deliveries through Inspection and Acceptance Reports alongside BAC, tracks property custodian acknowledgments across City departments, and releases Inventory Transfer Reports (ITR) to barangays.",
    whoServes:
      "City Hall employees requesting property clearances, accredited LGU suppliers delivering equipment, and all 46 barangay supply custodians.",
    mandate:
      "Take custody of and be accountable for all city properties, collate supply requisitions, perform physical inventory with the Inventory Committee, and maintain government buildings and facilities.",
    divisions: [
      "Records, Property & Inventory Division",
      "Warehouse & Inspection Division",
      "Information Campaign & Documentation Section",
    ],
    address: "2nd Floor, New City Hall, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0935-750-5371", "(088) 813-4726 / 813-4761 Local 104"],
    emails: ["malaybalaycgso@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/city-general-services-office/",
    services: [
      { title: "Release of Barangay Purok / City Supplies & Inventory Transfer Reports (ITR)", processingTime: "Charter pp. 345–353", fee: "None" },
      { title: "Property Accountability Clearances & Facility Maintenance Requests", processingTime: "Internal LGU turnaround", fee: "None" },
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
    headNote: "Led by the City Civil Registrar at 1st Floor, New City Hall (Charter pp. 188–250).",
    overview:
      "Records all births, marriages, and deaths occurring in Malaybalay City; processes Marriage Licenses, Delayed Registrations, Legitimation, and RA 9048 / RA 10172 petitions for clerical error correction.",
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
    phoneNumbers: ["0906-616-4009", "(088) 813-4726 / 813-4761 Local 122"],
    emails: ["malaybalayccro@gmail.com"],
    facebookUrl: "https://www.facebook.com/p/CCRO-Malaybalay-City-100085126836875/",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/civil-registry-2/",
    services: [
      { title: "Timely & Delayed Registration of Birth, Marriage & Death Certificates", processingTime: "Charter pp. 188–250", fee: "Timely Birth: None; Delayed / Cert: CTO tariff" },
      { title: "Application & Issuance of Marriage License", processingTime: "10-Day Mandatory Posting + Issuance", fee: "Per CTO Revenue Code" },
      { title: "RA 9048 / RA 10172 Petition (Correction of Clerical Error / Change of First Name)", processingTime: "Posting & PSA Affirmation Cycle", fee: "RA 9048 / 10172 statutory fee" },
      { title: "Issuance of Certified True Copy / Civil Registry Transcriptions", processingTime: "Same day", fee: "Per City Ordinance" },
    ],
    programs: [
      { title: "Mobile Civil Registration & Free Kasalan / Legitimation Outreach", summary: "Conducts barangay outreach civil registration for indigent and Indigenous Peoples communities." },
    ],
    charterChapterRef: "CCRO 2026 (pp. 188–250 & p. 728)",
    sources: [
      ccSource("City Civil Registry Office (pp. 188–250 & p. 728)"),
      sakataSource("Civil Registry Service Page", "https://sakata.malaybalaycity.gov.ph/civil-registry-2/"),
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
      { title: "1. Assistance to Individuals & Families in Crisis Situation (AICS)", classification: "Complex", processingTime: "1 Week & 45 Minutes", fee: "None", reference: "Charter pp. 620–654" },
      { title: "2. Certificate of Indigency & Social Case Study Report", classification: "Simple", processingTime: "20 – 53 Minutes", fee: "None" },
      { title: "3. Issuance of Solo Parent Identification Card", classification: "Complex", processingTime: "5 Days & 36 Minutes", fee: "None" },
      { title: "4. Assistive Device Request for Persons with Disability (PWD)", classification: "Complex", processingTime: "9 Days & 1 Hour", fee: "None" },
      { title: "5. VAWC / WEDC Crisis Center & Bahay Pag-asa Case Management", classification: "Emergency / Ongoing", processingTime: "1 Hour 30 Mins – 2 Hours 5 Mins intake", fee: "None" },
      { title: "6. Self-Employment Assistance to Groups (SEA-K)", classification: "Complex", processingTime: "11 Days, 4 Hours & 1 Minute", fee: "None" },
    ],
    programs: [
      { title: "24/7 Women & Children Crisis Center & Bahay Pag-asa", summary: "Provides shelter, trauma-informed social work, and RA 9344 diversion support." },
      { title: "Disaster Camp Management Team (EO 36 s.2023)", summary: "Manages evacuation camp welfare and relief distribution alongside CDRRMO." },
    ],
    charterChapterRef: "CSWDO 2026 (pp. 620–654)",
    sources: [
      ccSource("CSWDO 2026 (pp. 620–654 & p. 729)"),
      sakataSource("CSWDO Page", "https://sakata.malaybalaycity.gov.ph/citysocialwelfareanddevelopmentoffice/"),
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
    headNote: "Led by the City Health Officer with public health physicians, dentists, sanitary inspectors, and Upper Pulangui Lying-In clinical staff.",
    overview:
      "Delivers free primary medical consultations, maternal/child immunization, dental care, TB-DOTS, schistosomiasis treatment, sanitation permits, mental health support, newborn screening, and Upper Pulangui Lying-In maternity services.",
    aboutDetails:
      "Headquartered at Freedom Park, Barangay 4 (Poblacion) with 46 Barangay Health Stations and the 24/7 Upper Pulangui Lying-In Clinic, CHO issues pre-employment and food-handler Health Certificates, sanitary establishment clearances for BPLD permits, and outpatient disease treatment.",
    whoServes:
      "Families seeking primary care/immunization, food handlers & business owners needing Sanitary Permits, pregnant mothers, and TB/mental health patients.",
    mandate:
      "Formulate and implement public health programs, manage Barangay Health Stations across 46 barangays, prevent communicable/non-communicable disease outbreaks, and enforce Sanitary Code inspections.",
    divisions: [
      "Medical, Dental & Maternal/Child Health Division",
      "Non-Communicable & Communicable Disease / Schistosomiasis / TB-DOTS Units",
      "Environmental Sanitation & Health Certification Unit",
      "Upper Pulangui Lying-In Clinic & Barangay Health Stations Network",
    ],
    address: "Freedom Park, Barangay 4 (Poblacion), Malaybalay City, 8700 Bukidnon (with Upper Pulangui Lying-In Clinic)",
    barangay: "Barangay 4",
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM (Lying-In Clinic 24/7)",
    phoneNumbers: ["0965-094-9150", "0917-719-4588", "0965-094-9105", "0966-475-6979", "(088) 813-2877"],
    emails: ["cho.malaybly@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/health-and-dental/",
    services: [
      { title: "Medical Consultation, Child Immunization & Dental Care", processingTime: "Under CHO clinic queue (Charter pp. 354–408)", fee: "None (Primary Consult)" },
      { title: "Sanitary Permit, Health Certificate & Medico-Legal Health Certificate", processingTime: "Charter standard", fee: "Per City Revenue Code" },
      { title: "Newborn Screening Test (partnered with SPMC Davao)", processingTime: "4+ Hours extraction + 7-day result", fee: "₱1,750.00" },
      { title: "Mental Health Consultation & Schistosomiasis / TB-DOTS Treatment", processingTime: "Same day intake", fee: "None" },
      { title: "Upper Pulangui Lying-In Clinic Consultation & Delivery", processingTime: "24/7 Clinical Care", fee: "PhilHealth / Clinic Schedule" },
    ],
    programs: [
      { title: "City Health Board (EO 5 & EO 26) & Nutrition Committee (EO 59)", summary: "Coordinates barangay health stations, Maternal Care Packages, and vaccination drives." },
      { title: "National Voluntary Blood Services Program", summary: "Regular citywide blood donation drives safeguarding emergency supply." },
    ],
    discrepancies: [
      { field: "CHO Mobile Digits", detail: "2026 Charter Appendix (p. 729) prints 0965-094-9150 / 0917-719-4588 whereas sakata/contact-us prints 0965-094-9105 / 0966-475-6979 / (088) 813-2877. Both sets are shown." },
    ],
    charterChapterRef: "CHO 2026 (pp. 354–408 & p. 729)",
    sources: [
      ccSource("City Health Office (pp. 354–408 & p. 729)"),
      sakataSource("Health & Dental Services Page", "https://sakata.malaybalaycity.gov.ph/health-and-dental/"),
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
    headNote: "Led by the LDRRMO Head operating the 24/7 City Emergency Operations Center (EOC).",
    overview:
      "24/7 emergency response, flood/landslide monitoring across Sawaga and Upper Pulangui watersheds, rescue ambulance dispatch, Barangay DRRM capacity building, and Disaster Certification issuance.",
    aboutDetails:
      "Stationed at Market Side, Barangay 9 (Poblacion), CDRRMO dispatches round-the-clock rescue and Emergency Medical Services (EMS), coordinates early flood advisories with PAGASA and UP Project NOAH gauges, trains all 46 BDRRMCs, and issues rapid 15-minute Calamity Certifications.",
    whoServes:
      "Emergency callers, flood/calamity-affected households needing certifications, barangay rescue volunteers, and schools scheduling DRRM drills.",
    mandate:
      "Design, program, and coordinate disaster risk reduction, prevention, preparedness, response, and rehabilitation across all 46 barangays under RA 10121.",
    divisions: [
      "Emergency Operations Center (24/7 Rescue & EMS)",
      "Research & Planning Division",
      "Training, Advocacy & Barangay DRRM Coordination",
      "Administrative Support Section",
    ],
    address: "Market Side, Barangay 9 (Poblacion), Malaybalay City, 8700 Bukidnon",
    barangay: "Barangay 9",
    operatingHours: "24/7 Emergency Operations Center • Mon–Fri 8:00 AM – 5:00 PM Admin",
    phoneNumbers: ["(088) 813-3611", "0917-827-6117"],
    emails: ["malaybalaycitydrrmo@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/departments-offices/",
    services: [
      { title: "1. Issuance of Disaster / Calamity Certification", processingTime: "15 Minutes", fee: "None", reference: "Charter pp. 251–262" },
      { title: "2. Request for DRRM Training, Simulation & Equipment Assistance", processingTime: "4 Minutes (intake)", fee: "None" },
      { title: "3. 24/7 Emergency Medical, Flood, Vehicular & Search-and-Rescue Dispatch", processingTime: "Immediate Dispatch", fee: "None" },
    ],
    programs: [
      { title: "City Emergency Operations Center (EO 37 s.2023)", summary: "Maintains continuous weather, river-level, and hazard advisory coordination with PAGASA and 46 BDRRMCs." },
    ],
    discrepancies: [
      { field: "Station Address Note", detail: "2026 Citizen's Charter Appendix (p. 728) lists 'Market Side, Barangay 9', while legacy directory records referenced Barangay 1." },
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
    headOfOffice: "Arnel S. Alagenio (Executive Assistant V - Designate) • Salvador U. Yacapin (OIC, Licensing Officer IV)",
    overview:
      "Operates Malaybalay City's Business One-Stop Shop (BOSS), issuing new Mayor's Business Permits, annual renewals, business retirements, working/occupational permits, and tricycle regulatory coordination.",
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
    phoneNumbers: ["0926-833-0696", "(088) 813-4725 / 813-4761 Local 120"],
    emails: ["malaybalaycitylicensing@gmail.com"],
    facebookUrl: "https://www.facebook.com/bpld.malaybalaycity",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/business-permit-and-licensing-division/",
    services: [
      { title: "New Mayor's Business Permit Issuance (BOSS)", processingTime: "Charter pp. 507–530 (EODB compliant)", fee: "Per Tax Ordinance & Line of Business" },
      { title: "Annual Business Permit Renewal", processingTime: "Same-day / BOSS stream", fee: "Per Tax Assessment (CTO)" },
      { title: "Business Closure / Retirement & Mayor's Working Permit", processingTime: "Charter standard", fee: "Per Revenue Code" },
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
      { title: "1. Preparation of Infrastructure Plans & Program of Works (POW)", processingTime: "Charter pp. 293–344", fee: "None" },
      { title: "2. Road Right-of-Way Certification", processingTime: "Charter standard", fee: "None / Standard fee" },
      { title: "3. Materials Testing, Field Density Test & Concrete Pouring Inspection", processingTime: "Testing schedule", fee: "Per Testing Tariff" },
      { title: "4. Infrastructure Progress Billing, Time Extension & 10% Retention Inspection", processingTime: "Inspection cycle", fee: "None" },
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
    headNote: "Led by the City Building Official under PD 1096 in coordination with CPDO Zoning & BFP.",
    overview:
      "Enforces the National Building Code of the Philippines (PD 1096) across Malaybalay City—issuing Building Permits, Certificates of Occupancy, Temporary Electrical Connection Permits, and annual structural/mechanical inspections.",
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
    phoneNumbers: ["0917-152-6618"],
    emails: ["obo.malaybalay@gmail.com"],
    facebookUrl: "https://www.facebook.com/profile.php?id=100089883944248",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/obo-forms/",
    services: [
      { title: "1. Issuance of Building / Structure Permits", classification: "Complex", processingTime: "3 Working Days (complete docs)", fee: "Per PD 1096 Fee Schedule", reference: "Charter pp. 675–710" },
      { title: "2. Issuance of Certificate of Occupancy", classification: "Complex", processingTime: "3 Working Days", fee: "Per PD 1096 Schedule" },
      { title: "3. Temporary Electrical Connection Permit", classification: "Simple", processingTime: "3 Working Days", fee: "Per PD 1096 Schedule" },
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
    headNote: "Led by the City Environment & Natural Resources Officer on 1st Floor, New City Hall.",
    overview:
      "Leads ecological solid waste management (RA 9003), urban greening, forest nursery & seedling distribution, watershed protection (Upper Pulangui / Sawaga), and City Environmental Clearance enforcement.",
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
    phoneNumbers: ["0997-790-0290", "0969-208-8277", "(088) 813-4726 / 813-4761 Local 116"],
    emails: ["infoserve.cityenroffice19@gmail.com"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/departments-offices/",
    services: [
      { title: "Request for Forest / Fruit-Bearing Tree Seedlings", processingTime: "Charter pp. 282–292", fee: "None" },
      { title: "City Environmental Inspection & Solid Waste Management Coordination", processingTime: "Charter schedule", fee: "Per Local Code" },
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
    aboutDetails:
      "Situated at the City Agriculture Compound in Barangay Casisang, the department assists smallholders with RSBSA enrollment needed for national fuel/fertilizer subsidies, certified rice/corn seed releases, tilapia fingerling dispersal, and post-harvest backhoe/tractor engineering support.",
    whoServes:
      "Registered RSBSA farmers, irrigators' associations, Indigenous Peoples agricultural cooperatives, fishpond operators, and agrarian reform beneficiaries.",
    mandate:
      "Formulate agricultural productivity measures, provide extension services to farmers' associations and agrarian reform beneficiaries, administer farm demonstration stations, and coordinate DA-10 interventions.",
    divisions: [
      "Administrative Support Services Section",
      "Crop Production & Extension Division (Rice, Corn & High-Value Crops)",
      "Agricultural & Biosystems Engineering Division",
    ],
    address: "Barangay Casisang (City Agriculture Compound), Malaybalay City, 8700 Bukidnon",
    barangay: "Casisang",
    coordinates: NEW_CITY_HALL_COORDS,
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM",
    phoneNumbers: ["0994-957-6384", "(088) 813-1254"],
    emails: ["mlyblyagri2023@gmail.com", "mlyblyagri@yahoo.com"],
    facebookUrl: "https://www.facebook.com/mlyblyAgriNews/",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/city-agriculture-office/",
    services: [
      { title: "RSBSA Farmer Registry Enrollment & Certification", processingTime: "Charter pp. 83–131", fee: "None" },
      { title: "Certified Seeds, Fingerlings & Agri-Input Dispersal Requests", processingTime: "Verification & distribution cycle", fee: "None / Cost-share" },
      { title: "Pest & Plant Disease Field Advisory & Farm Mechanization Scheduling", processingTime: "Field dispatch schedule", fee: "None" },
    ],
    programs: [
      { title: "Agri-Ecotourism & High-Value Crops Development", summary: "Backs coffee, adlai, rice, corn, and organic highland vegetable clusters across rural barangays." },
    ],
    discrepancies: [
      { field: "Email Variants", detail: "/contact-us/ lists mlyblyagri2023@gmail.com while /departments-offices/ lists mlyblyagri@yahoo.com." },
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
    headNote: "Led by the City Veterinarian overseeing animal clinics, mass vaccination, and meat inspection.",
    overview:
      "Safeguards animal health and food safety through anti-rabies vaccination, pet registration, veterinary consultations, swine/livestock dispersal, dog pound management, and veterinary health certification.",
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
    phoneNumbers: ["(088) 813-3205", "0926-198-6992"],
    emails: ["cityvetmalaybalay@gmail.com", "citymalaybalay@gmail.com"],
    facebookUrl: "https://www.facebook.com/p/City-Veterinary-Office-City-of-Malaybalay-100064138659249/",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/departments-offices/",
    services: [
      { title: "1. Free Anti-Rabies Vaccination", processingTime: "40 Minutes", fee: "None", reference: "Charter pp. 458–481" },
      { title: "2. Pet Registration", processingTime: "50 Minutes", fee: "₱100.00 (Intact)" },
      { title: "3. Small & Large Animal Consultation & Treatment", processingTime: "40 – 130 Minutes", fee: "None" },
      { title: "4. Issuance of Veterinary Health Certificate", processingTime: "45 Minutes", fee: "₱100.00" },
      { title: "5. Swine Dispersal Application & Impounded Dog Claim", processingTime: "30 Days (Swine) / 50–165 Mins (Reclaim)", fee: "None / ₱50.00 reclaim" },
    ],
    programs: [
      { title: "Barangay Mass Anti-Rabies & ASF Surveillance", summary: "Deploys veterinary vaccination teams across all 46 barangays to prevent zoonotic outbreaks." },
    ],
    discrepancies: [
      { field: "Email Variants", detail: "/departments-offices/ shows cityvetmalaybalay@gmail.com while /contact-us/ shows citymalaybalay@gmail.com." },
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
    headNote: "Tourism Division under the Office of the City Mayor (Murillo Street, Barangay 8).",
    overview:
      "Promotes Malaybalay's highland agri-ecotourism, heritage trails, and Kaamulan cultural identity while certifying tourism-related establishments (including Ancestral Domain businesses) and coordinating DOT trainings.",
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
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/departments-offices/",
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
      { title: "Public Market Stall Leasing & Revenue Collection", processingTime: "Charter pp. 263–281", fee: "Per Market Code" },
      { title: "Slaughterhouse Fees, Terminal Dispatch & City Memorial Park Burial Permits", processingTime: "Operational hours", fee: "Per Enterprise Ordinance" },
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
    headNote: "CMO — City Urban Development & Housing Division coordinating the City Housing & Resettlement Committee.",
    overview:
      "Implements urban housing and resettlement programs under the Urban Development and Housing Act (RA 7279 / UDHA) and City Ordinance No. 565 s.2005 for hazard-vulnerable and landless households.",
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
    discrepancies: [
      { field: "Last 4 Phone Digits", detail: "Charter p. 598/602 prints 0953-459-7882 while /contact-us/ prints 0953-459-7782." },
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
    headNote: "CMO — Traffic Management Center Division overseeing road safety and motorela clearances.",
    overview:
      "Manages city road traffic flow, deploys traffic enforcers across school zones and Sayre Highway junctions, issues traffic citation clearances, and coordinates road closures and public utility routing.",
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
    address: "Traffic Management Center, Malaybalay City, 8700 Bukidnon (Check Charter pp. 572–587 / CTO citation counter at City Hall)",
    barangay: "Barangay 9",
    operatingHours: "Monday to Friday, 8:00 AM – 5:00 PM Admin (Field Traffic Posts active daily)",
    phoneNumbers: ["0936-829-4691"],
    emails: ["tmcmalaybalay2014@gmail.com"],
    facebookUrl: "https://www.facebook.com/tmc.malaybalay/",
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/departments-offices/",
    services: [
      { title: "Traffic Citation Validation & CTO Penalty Payment Release", processingTime: "Charter pp. 572–587 & CTO p. 655+", fee: "Per Traffic Ordinance" },
      { title: "Road Closure / Rerouting Permit & Impounded Vehicle Release", processingTime: "Charter cycle", fee: "Per City Traffic Code" },
    ],
    programs: [
      { title: "School Zone Safety & Kaamulan Traffic Rerouting", summary: "Real-time traffic advisories published directly through TMC's official Facebook page." },
    ],
    charterChapterRef: "CMO - TMC 2026 (pp. 572–587)",
    sources: [
      ccSource("CMO — Traffic Management Center (pp. 572–587)"),
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
    headNote: "Inter-departmental Bids & Awards Committee constituted under RA 9184 (Procurement Reform Act).",
    overview:
      "Administers competitive procurement of goods, civil works, and consulting services for the City Government under RA 9184, PhilGEPS posting, livestreamed bid openings, and Notice of Award disclosures.",
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
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/bids-and-awards-committee-2/",
    services: [
      { title: "Issuance of Philippine Bidding Documents & Bidder Registration", processingTime: "Charter pp. 482–506", fee: "GPPB Standard Bidding Document Fee" },
      { title: "Public Bid Opening & Notice of Award / NTP Disclosures", processingTime: "RA 9184 statutory timeline", fee: "None for public observers" },
    ],
    programs: [
      { title: "Livestreamed Public Bid Openings (Cross-linked to BetterMC /procurement/livestreams)", summary: "Maintains open-government procurement broadcasts on the official BAC Facebook page." },
    ],
    charterChapterRef: "CMO - BAC 2026 (pp. 482–506)",
    sources: [
      ccSource("CMO — BAC 2026 (pp. 482–506)"),
      sakataSource("Bids & Awards Committee Page", "https://sakata.malaybalaycity.gov.ph/bids-and-awards-committee-2/"),
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
    headNote: "Field operations desk of the Department of the Interior and Local Government — Region 10.",
    overview:
      "City field office of the Department of the Interior and Local Government supervising SGLG/SGLGB governance assessments, Full Disclosure compliance, and technical mentoring for Malaybalay's 46 barangays.",
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
    officialWebUrl: SAKATA_CONTACT_URL,
    services: [
      { title: "Seal of Good Local Governance (SGLG / SGLGB) & Barangay Assessment", processingTime: "Annual DILG cycle", fee: "None" },
      { title: "Barangay Official Succession, Katarungang Pambarangay & DILG Endorsements", processingTime: "Field office review", fee: "None" },
    ],
    programs: [
      { title: "SGLG & SGLGB Assessment Teams (EO 15 & EO 35 s.2023)", summary: "Evaluates transparency, disaster preparedness, financial administration, and social protection." },
    ],
    discrepancies: [
      {
        field: "Email Address Typo & Copy-Paste Conflict",
        detail: "sakata/contact-us prints 'dilg.buk.malaybalay@gmail.cm' (likely typo for .com), while sakata/departments-offices erroneously repeats 'malaybalayccro@gmail.com'. Confirm via phone (0926-880-6529) before emailing.",
      },
    ],
    sources: [sakataSource("sakata.malaybalaycity.gov.ph — Contact Us", SAKATA_CONTACT_URL)],
  }),

  // 32. BFP MALAYBALAY CITY FIRE STATION
  officeBase("bfp", {
    aliases: ["fire-station"],
    name: "Bureau of Fire Protection — Malaybalay City Fire Station",
    shortName: "Fire Protection (BFP)",
    acronym: "BFP-CFS",
    classification: "National Uniformed Fire & Rescue Service (Partner City Regulatory Station)",
    category: "Public Safety & Emergency",
    logoStatus: "Unavailable",
    headNote: "Commanded by the Malaybalay City Fire Marshal under BFP Region 10 (RA 9514).",
    overview:
      "Provides 24/7 fire suppression and emergency rescue while conducting mandatory Fire Safety Inspections for Building Permits (OBO) and Business Permits (BPLD).",
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
    address: "Malaybalay City Central Fire Station (City Contact Directory — Poblacion, Malaybalay City)",
    barangay: "Barangay 4",
    operatingHours: "24/7 Fire & Rescue Operations • Mon–Fri 8:00 AM – 5:00 PM FSIC Assessment",
    phoneNumbers: ["0917-677-7700", "(088) 813-5449"],
    emails: ["malaybalaycfs@gmail.com"],
    officialWebUrl: SAKATA_CONTACT_URL,
    services: [
      { title: "Fire Safety Inspection Certificate (FSIC) for Business / Occupancy Permits", processingTime: "Aligned with BPLD/OBO BOSS", fee: "RA 9514 Fire Code fee (15% of local fee min ₱500)" },
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
    logoStatus: "Unavailable",
    headNote: "Commanded by the City Chief of Police under Bukidnon Police Provincial Office (PRO-10).",
    overview:
      "Maintains round-the-clock law enforcement, traffic accident investigation, women and children's protection desk (WCPD), blotter verification, and National Police Clearance issuance across Malaybalay City.",
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
      { title: "National Police Clearance System (NPCS) Biometrics & Release", processingTime: "Scheduled NPCS appointment", fee: "₱150.00 + payment fee (pnpclearance.ph)" },
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
    logoStatus: "Unavailable",
    headNote: "First-level Judiciary trial court operating under the Supreme Court of the Philippines.",
    overview:
      "Listed directly in the City Government's official Contact Directory as City Court Office handling civil/criminal first-level court cases, small claims, and local court clearances.",
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
    headNote: "Led by the Schools Division Superintendent under DepEd Region X.",
    overview:
      "Administers public elementary, integrated, and high schools across Malaybalay City, partnering with PESO on the Grade 10 Career Guidance Advocacy Program (CGAP) and City School Board planning.",
    aboutDetails:
      "Located along Sayre Highway in Barangay Casisang, the DepEd Malaybalay City Division oversees 122 educational institutions profiled across BetterMC's Education Directory, manages the Public Assistance Counter for learner credentials, and schedules career orientation drives alongside PESO.",
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
    emails: ["pac.malaybalaycity@deped.gov.ph"],
    officialWebUrl: "https://sakata.malaybalaycity.gov.ph/contact-us/",
    services: [
      { title: "Public Assistance Counter (PAC) — Learner Records & Division Inquiries", processingTime: "Office hours", fee: "None" },
      { title: "PESO Career Guidance Advocacy (CGAP) School Scheduling", processingTime: "2 Minutes (with PESO)", fee: "None" },
    ],
    programs: [
      { title: "Cross-linked to BetterMC /education (122 School Profiles)", summary: "Coordinates elementary, integrated, junior high, and senior high school initiatives across 46 barangays." },
    ],
    sources: [sakataSource("sakata.malaybalaycity.gov.ph — Contact Us", SAKATA_CONTACT_URL)],
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
