import type { Source } from "./data";

export type EducationLevel = "Preschool" | "Elementary" | "Junior high" | "Senior high" | "Technical-vocational" | "College / university";
export type InstitutionType = "Public" | "Private" | "State university" | "Technical-vocational";
export type VerificationStatus = "Verified listing" | "Needs record verification";

export type EducationInstitution = {
  slug: string;
  name: string;
  schoolId?: string;
  barangay?: string;
  address: string;
  type: InstitutionType;
  levels: EducationLevel[];
  leadership?: string;
  contacts?: string[];
  programmes?: string[];
  source: Source;
  status: VerificationStatus;
};

const reviewedOn = "2026-11-17";
export const depedSchoolSource: Source = {
  label: "Department of Education — Malaybalay City school listings",
  url: "https://www.deped.gov.ph/wp-content/uploads/Annex-B_2024-CB-011a-Allocation-List.pdf",
  verifiedOn: reviewedOn,
};
export const depedMasterlistSource: Source = {
  label: "Department of Education — 2020–2021 masterlist of schools",
  url: "https://www.deped.gov.ph/wp-content/uploads/2021/06/SY-2020-2021-Masterlist-of-Schools-Address-only-1-1.pdf",
  verifiedOn: reviewedOn,
};
export const chedSource: Source = {
  label: "CHED HEIDA — Higher Education Institution Directory",
  url: "https://heida.ched.gov.ph/hei-directory/10?page=1",
  verifiedOn: reviewedOn,
};
export const tesdaSource: Source = {
  label: "TESDA — Registered Technical-Vocational Institutions",
  url: "https://tesda.gov.ph/Tvi/sch?sch=3525",
  verifiedOn: reviewedOn,
};

const publicHighSchools: Array<[string, string, string, string, EducationLevel[]]> = [
  ["bangcud-national-high-school", "Bangcud National High School", "303946", "Bangcud, Malaybalay City", ["Junior high", "Senior high"]],
  ["bukidnon-national-high-school", "Bukidnon National High School", "303950", "Barangay 3 (Pob.), Malaybalay City", ["Junior high", "Senior high"]],
  ["casisang-national-high-school", "Casisang National High School", "314914", "Casisang, Malaybalay City", ["Junior high", "Senior high"]],
  ["casisang-senior-high-school", "Casisang Senior High School", "341061", "Purok 6, Casisang, Malaybalay City", ["Senior high"]],
  ["dalwangan-national-high-school", "Dalwangan National High School", "325504", "Dalwangan, Malaybalay City", ["Junior high", "Senior high"]],
  ["kalasungay-national-high-school", "Kalasungay National High School", "314915", "Kalasungay, Malaybalay City", ["Junior high", "Senior high"]],
  ["malaybalay-city-national-high-school", "Malaybalay City National High School", "314916", "San Jose, Malaybalay City", ["Junior high", "Senior high"]],
  ["malaybalay-city-national-science-high-school", "Malaybalay City National Science High School", "314904", "Aglayan, Malaybalay City", ["Junior high", "Senior high"]],
  ["managok-national-high-school", "Managok National High School", "303973", "Managok, Malaybalay City", ["Junior high", "Senior high"]],
  ["miglamin-national-high-school", "Miglamin National High School", "314920", "Miglamin, Malaybalay City", ["Junior high", "Senior high"]],
  ["san-martin-agro-industrial-national-high-school", "San Martin Agro-Industrial National High School", "303982", "San Martin, Malaybalay City", ["Junior high", "Senior high"]],
  ["silae-national-high-school", "Silae National High School", "303984", "Fortich Street, Malaybalay City", ["Junior high"]],
  ["st-peter-national-high-school", "St. Peter National High School", "314905", "St. Peter, Malaybalay City", ["Junior high", "Senior high"]],
];

export const educationInstitutions: EducationInstitution[] = [
  ...publicHighSchools.map(([slug, name, schoolId, address, levels]) => ({
    slug, name, schoolId, address, type: "Public" as const, levels, source: depedSchoolSource, status: "Verified listing" as const,
  })),
  { slug: "malaybalay-central-school", name: "Malaybalay Central School", schoolId: "126582", barangay: "Kalasungay", address: "Purok 2, Kalasungay, Malaybalay City", type: "Public", levels: ["Elementary"], source: depedMasterlistSource, status: "Needs record verification" },
  { slug: "new-look-elementary-school", name: "New Look Elementary School", schoolId: "126588", barangay: "Dalwangan", address: "New Look, Dalwangan, Malaybalay City", type: "Public", levels: ["Elementary"], source: depedMasterlistSource, status: "Needs record verification" },
  { slug: "patpat-elementary-school", name: "Patpat Elementary School", schoolId: "126590", barangay: "Patpat", address: "Purok 3, Patpat, Malaybalay City", type: "Public", levels: ["Elementary"], source: depedMasterlistSource, status: "Needs record verification" },
  { slug: "bila-baptist-malaybalay-christian-academy", name: "Bila Baptist Malaybalay Christian Academy, Inc.", schoolId: "409078", barangay: "Kalasungay", address: "Zone 6, Sun Flower Village, Malaybalay City", type: "Private", levels: ["Elementary", "Junior high"], source: depedMasterlistSource, status: "Needs record verification" },
  { slug: "bukidnon-state-university", name: "Bukidnon State University", address: "Malaybalay City, Bukidnon", type: "State university", levels: ["College / university"], contacts: ["(088) 813-2717", "(088) 221-2196", "presoffice@bsc.edu.ph"], source: chedSource, status: "Verified listing" },
  { slug: "camilo-adrales-technical-school", name: "Camilo Adrales Technical School Training and Assessment Center, Inc.", barangay: "San Jose", address: "Purok 5, Barangay San Jose, Malaybalay City, Bukidnon", type: "Technical-vocational", levels: ["Technical-vocational"], source: tesdaSource, status: "Verified listing" },
];

export type DocumentGuide = {
  slug: string;
  title: string;
  scope: "City" | "National" | "Barangay";
  office: string;
  requirements: string[];
  steps: string[];
  fees: string;
  processingTime: string;
  source: Source;
  status: "Published standard" | "Confirm with issuing office";
};

const cityCharter: Source = {
  label: "City Government of Malaybalay — Citizen’s Charter",
  url: "https://sakata.malaybalaycity.gov.ph/citizens-charter/",
  verifiedOn: reviewedOn,
};

export const documentGuides: DocumentGuide[] = [
  {
    slug: "city-civil-registry-services", title: "City civil registry services", scope: "City", office: "City Civil Registrar’s Office", requirements: ["Confirm the record type and current documentary requirements with the City Civil Registrar’s Office."], steps: ["Open the official Citizen’s Charter.", "Confirm the correct record and requirements with the issuing office before travelling.", "Submit only through the official office or its published channel."], fees: "Not transcribed here; consult the current Charter or issuing office.", processingTime: "Confirm with issuing office.", source: cityCharter, status: "Confirm with issuing office",
  },
  {
    slug: "barangay-certificates-and-clearances", title: "Barangay certificates and clearances", scope: "Barangay", office: "Relevant Barangay Hall", requirements: ["Requirements, fee schedules, and forms are barangay-specific and were not published consistently in a source suitable for transcription."], steps: ["Choose your barangay page.", "Use the official barangay contact or visit the hall to confirm the document, form, fee, and release time.", "Bring only the requirements confirmed by that issuing office."], fees: "Not published as a citywide standard.", processingTime: "Confirm with the selected Barangay Hall.", source: { label: "City Government of Malaybalay — List of Barangays", url: "https://sakata.malaybalaycity.gov.ph/list-of-barangay/", verifiedOn: reviewedOn }, status: "Confirm with issuing office",
  },
  {
    slug: "building-office-printables", title: "Building office printable forms", scope: "City", office: "Office of the Building Official", requirements: ["Select the applicable official form before preparing a submission."], steps: ["Open the City’s OBO form templates.", "Select the matching form.", "Confirm current requirements, fees, and processing time with the Office of the Building Official."], fees: "Confirm with issuing office.", processingTime: "Confirm with issuing office.", source: { label: "City Government of Malaybalay — OBO Form Templates", url: "https://sakata.malaybalaycity.gov.ph/obo-forms/", verifiedOn: reviewedOn }, status: "Published standard",
  },
];

export const ordinanceResearchNotice = {
  source: { label: "City Government of Malaybalay — public announcement archive", url: "https://sakata.malaybalaycity.gov.ph/category/public-annoucement/", verifiedOn: reviewedOn },
  note: "The official archive is the record source. Public Facebook posts, including those of Councilor Estelito L. Marabe, may help locate a measure but do not establish authorship, sponsorship, or final legislative status without an official record.",
};
