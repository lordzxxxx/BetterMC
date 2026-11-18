import type { Source } from "./data";

export type EducationLevel = "Preschool" | "Kindergarten" | "Elementary" | "Junior high" | "Senior high" | "Integrated school" | "Technical-vocational" | "College / university";
export type InstitutionType = "Public" | "Private" | "State university" | "Technical-vocational";
export type VerificationStatus = "Verified" | "Partially Verified" | "Awaiting Verification" | "Community Reported" | "Inactive or Closed";
export type SourceType = "Government directory" | "Institutional website" | "Official school channel" | "Research inventory";

export type RecordSource = Source & { type: SourceType };
export type SchoolAnnouncementConfig = {
  mode: "External official channel" | "Manual verified entries" | "Not configured";
  externalUrl?: string;
  lastSuccessfulSync?: string;
};
export type TransportAccess = {
  status: "Verified" | "Unavailable";
  note: string;
  mapQuery: string;
};

export type EducationInstitution = {
  slug: string;
  name: string;
  schoolId?: string;
  barangay?: string;
  address: string;
  type: InstitutionType;
  classification?: string;
  levels: EducationLevel[];
  description?: string;
  leadership?: string;
  contacts?: string[];
  programmes?: string[];
  officialLinks?: Array<{ label: string; url: string }>;
  logoUrl?: string;
  logoSource?: RecordSource;
  logoStatus?: "Verified" | "Unavailable" | "Pending verification";
  subdomainHost?: string;
  announcements: SchoolAnnouncementConfig;
  transport: TransportAccess;
  source: RecordSource;
  status: VerificationStatus;
};

const reviewedOn = "2026-11-17";
export const depedSchoolSource: RecordSource = {
  label: "Department of Education — Malaybalay City school listings",
  url: "https://www.deped.gov.ph/wp-content/uploads/Annex-B_2024-CB-011a-Allocation-List.pdf",
  verifiedOn: reviewedOn,
  type: "Government directory",
};
export const depedMasterlistSource: RecordSource = {
  label: "Department of Education — 2020–2021 masterlist of schools",
  url: "https://www.deped.gov.ph/wp-content/uploads/2021/06/SY-2020-2021-Masterlist-of-Schools-Address-only-1-1.pdf",
  verifiedOn: reviewedOn,
  type: "Government directory",
};
export const depedInventorySource: RecordSource = {
  label: "Department of Education — National Inventory Dashboard, Malaybalay City",
  url: "https://nid.deped.gov.ph/public-dashboard/region/Region%20X/division/Malaybalay%20City",
  verifiedOn: reviewedOn,
  type: "Government directory",
};
const researchInventorySource: RecordSource = {
  label: "BetterMC research inventory — individual DepEd confirmation pending",
  url: depedInventorySource.url,
  verifiedOn: reviewedOn,
  type: "Research inventory",
};
export const chedSource: RecordSource = {
  label: "CHED HEIDA — Higher Education Institution Directory",
  url: "https://heida.ched.gov.ph/hei-directory/10?page=1",
  verifiedOn: reviewedOn,
  type: "Government directory",
};
export const tesdaSource: RecordSource = {
  label: "TESDA — Registered Technical-Vocational Institutions",
  url: "https://tesda.gov.ph/Tvi/sch?sch=3525",
  verifiedOn: reviewedOn,
  type: "Government directory",
};

export const depedRecognizedPrivateSource: RecordSource = {
  label: "DepEd Region X — List of Recognized Private Schools",
  url: "https://deped10.com/?page_id=883",
  verifiedOn: reviewedOn,
  type: "Government directory",
};

const defaultAnnouncement: SchoolAnnouncementConfig = { mode: "Not configured" };
const schoolTransport = (address: string): TransportAccess => ({
  status: "Unavailable",
  note: "No official route, fare, terminal, or regular transport-service information was located for this destination. Open the map search and confirm local transport options before travel.",
  mapQuery: address,
});
const BUKSU_CAMPUS_ADDRESS = "Casisang, 44J8+JCW, University Road, Malaybalay City, 8700 Bukidnon";

const publicHighSchools: Array<[string, string, string, string, string, EducationLevel[]]> = [
  ["bangcud-national-high-school", "Bangcud National High School", "303946", "Purok 2, Sayre Highway, Bangcud, Malaybalay City, 8700 Bukidnon", "Bangcud", ["Junior high", "Senior high"]],
  ["bukidnon-national-high-school", "Bukidnon National High School", "303950", "Fortich Street (Sayre Highway), Barangay 3 (Pob.), Malaybalay City, 8700 Bukidnon", "Barangay 3", ["Junior high", "Senior high"]],
  ["casisang-national-high-school", "Casisang National High School", "314914", "Purok 6, Casisang, Malaybalay City, 8700 Bukidnon", "Casisang", ["Junior high", "Senior high"]],
  ["dalwangan-national-high-school", "Dalwangan National High School", "325504", "Purok 3, Sayre Highway, Dalwangan, Malaybalay City, 8700 Bukidnon", "Dalwangan", ["Junior high", "Senior high"]],
  ["kalasungay-national-high-school", "Kalasungay National High School", "314915", "Purok 2, Kalasungay, Malaybalay City, 8700 Bukidnon", "Kalasungay", ["Junior high", "Senior high"]],
  ["malaybalay-city-national-high-school", "Malaybalay City National High School", "314916", "Purok 4, San Jose, Malaybalay City, 8700 Bukidnon", "San Jose", ["Junior high", "Senior high"]],
  ["malaybalay-city-national-science-high-school", "Malaybalay City National Science High School", "314904", "Purok 5, Aglayan, Malaybalay City, 8700 Bukidnon", "Aglayan", ["Junior high", "Senior high"]],
  ["managok-national-high-school", "Managok National High School", "303973", "Purok 2, Managok, Malaybalay City, 8700 Bukidnon", "Managok", ["Junior high", "Senior high"]],
  ["miglamin-national-high-school", "Miglamin National High School", "314920", "Purok 2, Miglamin, Malaybalay City, 8700 Bukidnon", "Miglamin", ["Junior high", "Senior high"]],
  ["san-martin-agro-industrial-national-high-school", "San Martin Agro-Industrial National High School", "303982", "Purok 2, San Martin, Malaybalay City, 8700 Bukidnon", "San Martin", ["Junior high", "Senior high"]],
  ["silae-national-high-school", "Silae National High School", "303984", "Purok 2, Silae, Malaybalay City, 8700 Bukidnon", "Silae", ["Junior high"]],
  ["st-peter-national-high-school", "St. Peter National High School", "314905", "Purok 1, St. Peter, Malaybalay City, 8700 Bukidnon", "St. Peter", ["Junior high", "Senior high"]],
];

const publicBasicSchools: Array<[string, string, string, string, string | undefined, EducationLevel[]]> = [
  ["aglayan-central-school", "Aglayan Central School", "126577", "Purok 3, Aglayan, Malaybalay City, 8700 Bukidnon", "Aglayan", ["Elementary"]],
  ["baganao-elementary-school", "Baganao Elementary School", "126575", "Sitio Bagnao, Kibalabag, Malaybalay City, 8700 Bukidnon", "Kibalabag", ["Elementary"]],
  ["bagong-silang-elementary-school", "Bagong Silang Elementary School", "126543", "Purok 6, Bagong Silang, Maligaya, Malaybalay City, 8700 Bukidnon", "Maligaya", ["Elementary"]],
  ["bendolan-elementary-school", "Bendolan Elementary School", "126559", "Purok 3, Sitio Bendolan, Magsaysay, Malaybalay City, 8700 Bukidnon", "Magsaysay", ["Elementary"]],
  ["cabagahan-elementary-school", "Cabagahan Elementary School", "126561", "Purok 1, Cabangahan, Malaybalay City, 8700 Bukidnon", "Cabangahan", ["Elementary"]],
  ["capitan-angel-integrated-school", "Capitan Angel Integrated School", "501189", "Purok 1, Capitan Angel, Malaybalay City, 8700 Bukidnon", "Capitan Angel", ["Kindergarten", "Elementary", "Junior high", "Integrated school"]],
  ["candiisan-integrated-school", "Candiisan Integrated School", "501195", "Sitio Candiisan, Can-ayan, Malaybalay City, 8700 Bukidnon", "Can-ayan", ["Kindergarten", "Elementary", "Junior high", "Integrated school"]],
  ["kibalabag-integrated-school", "Kibalabag Integrated School", "501188", "Purok 3, Kibalabag, Malaybalay City, 8700 Bukidnon", "Kibalabag", ["Kindergarten", "Elementary", "Junior high", "Integrated school"]],
  ["maligaya-integrated-school", "Maligaya Integrated School", "501583", "Sitio Malubog, San Jose, Malaybalay City, 8700 Bukidnon", "San Jose", ["Kindergarten", "Elementary", "Junior high", "Integrated school"]],
  ["mapulo-elementary-school", "Mapulo Elementary School", "126548", "Purok 1, Mapulo, Malaybalay City, 8700 Bukidnon", "Mapulo", ["Elementary"]],
  ["silae-elementary-school", "Silae Elementary School", "126553", "Purok 2, Silae, Malaybalay City, 8700 Bukidnon", "Silae", ["Elementary"]],
  ["st-peter-elementary-school", "St. Peter Elementary School", "126554", "Valsons, St. Peter, Malaybalay City, 8700 Bukidnon", "St. Peter", ["Elementary"]],
  ["sumpong-central-school", "Sumpong Central School", "126593", "Fortich Street, Sumpong, Malaybalay City, 8700 Bukidnon", "Sumpong", ["Elementary"]],
  ["zamboanguita-elementary-school", "Zamboanguita Elementary School", "126556", "Purok 1, Zamboanguita, Malaybalay City, 8700 Bukidnon", "Zamboanguita", ["Elementary"]],
  ["apo-macote-national-high-school", "Apo Macote National High School", "325505", "Purok 2, Apo Macote, Malaybalay City, 8700 Bukidnon", "Apo Macote", ["Junior high", "Senior high"]],
];

const recognizedPrivateBasicSchools: Array<[string, string, string, string, EducationLevel[]]> = [
  ["apc", "Apu Palamguwan Cultural Education Center", "Busdi", "Sitio Bendum, Barangay Busdi, Malaybalay City, Bukidnon 8700", ["Kindergarten", "Elementary", "Junior high", "Senior high"]],
  ["bethel-baptist-christian-academy", "Bethel Baptist Christian Academy", "Sumpong", "Fortich Street (Sayre Highway), Barangay Sumpong, Malaybalay City, 8700 Bukidnon", ["Preschool", "Elementary", "Junior high"]],
  ["brightspark-christian-academy", "Brightspark Christian Academy", "Aglayan", "Sayre Highway, Barangay Aglayan, Malaybalay City, 8700 Bukidnon", ["Preschool", "Elementary", "Junior high"]],
  ["bugemco-learning-center", "BUGEMCO Learning Center", "Barangay 9", "San Victores Street, Barangay 9, Capitol Compound, Malaybalay City", ["Preschool"]],
  ["casisang-international-christian-school", "Casisang International Christian School", "Casisang", "Purok 6, Barangay Casisang, Malaybalay City, 8700 Bukidnon", ["Preschool", "Elementary", "Junior high"]],
  ["el-gibbor-faithhouse-academy", "El Gibbor Faithhouse Academy Incorporated", "Sinanglanan", "Purok 2, Barangay Sinanglanan, Malaybalay City, 8700 Bukidnon", ["Preschool"]],
  ["heights-kinderland", "Heights Kinderland Inc.", "Barangay 1", "01-38 Alberto Street, Barangay 1 (Poblacion), Malaybalay City, 8700 Bukidnon", ["Preschool"]],
  ["kitanglad-view-adventist-elementary-school", "Kitanglad View Adventist Elementary School", "Casisang", "Purok 6, Barangay Casisang, Malaybalay City, 8700 Bukidnon", ["Elementary"]],
  ["little-gems-learning-center", "Little Gems Learning Center, Inc.", "Barangay 2", "52 Guingona Street, Barangay 2 (Poblacion), Malaybalay City, 8700 Bukidnon", ["Preschool"]],
  ["malaybalay-city-adventist-elementary-school", "Malaybalay City Adventist Elementary School, Inc.", "Barangay 11", "Impalambong, Barangay 11 (Poblacion), Malaybalay City, 8700 Bukidnon", ["Preschool", "Elementary"]],
  ["marywoods-academy", "Marywoods Academy Inc.", "Sumpong", "Marywoods Access Road, New Diversion Road, Barangay Sumpong, Malaybalay City, 8700 Bukidnon", ["Elementary", "Junior high"]],
  ["mindanao-arts-technological-institute", "Mindanao Arts & Technological Institute, Inc.", "Barangay 3", "Fortich Street, Barangay 3 (Poblacion), Malaybalay City, 8700 Bukidnon", ["Preschool", "Elementary", "Junior high"]],
  ["saint-isidore-high-school", "Saint Isidore High School", "Zamboanguita", "Purok 3, Barangay Zamboanguita, Malaybalay City, 8700 Bukidnon", ["Elementary", "Junior high", "Senior high"]],
  ["san-isidro-college", "San Isidro College", "Barangay 10", "Impalambong, Barangay 10 (Poblacion), Malaybalay City, 8700 Bukidnon", ["Preschool", "Elementary", "Junior high"]],
  ["st-isidore-academy-sinanglanan", "St. Isidore Academy of Bukidnon, Inc.", "Sinanglanan", "Purok 2, Barangay Sinanglanan, Malaybalay City, 8700 Bukidnon", ["Elementary", "Junior high"]],
  ["st-johns-school-malaybalay", "St. John’s School of Malaybalay City, Inc.", "Barangay 1", "Bonifacio Drive, Barangay 1 (Poblacion), Malaybalay City, 8700 Bukidnon", ["Preschool", "Elementary"]],
  ["st-michael-high-school", "St. Michael High School Inc.", "Linabo", "Purok 1, Sayre Highway, Barangay Linabo, Malaybalay City, 8700 Bukidnon", ["Junior high"]],
  ["sunbeam-christian-academy", "Sunbeam Christian Academy of Bangcud Inc.", "Bangcud", "Sayre Highway, Barangay Bangcud, Malaybalay City, 8700 Bukidnon", ["Preschool", "Elementary"]],
];

const educationInstitutionSeed: EducationInstitution[] = [
  ...publicHighSchools.map(([slug, name, schoolId, address, barangay, levels]) => ({
    slug, name, schoolId, address, barangay, type: "Public" as const, levels, source: depedSchoolSource, status: "Verified" as const, announcements: defaultAnnouncement, transport: schoolTransport(address),
  })),
  ...publicBasicSchools.map(([slug, name, schoolId, address, barangay, levels]) => ({ slug, name, schoolId, address, barangay, type: "Public" as const, levels, source: depedMasterlistSource, status: "Partially Verified" as const, announcements: defaultAnnouncement, transport: schoolTransport(address) })),
  {
    slug: "bangcud-central-school",
    name: "Bangcud Central School",
    schoolId: "126558",
    barangay: "Bangcud",
    address: "Purok 2, Sayre Highway, Bangcud, Malaybalay City",
    type: "Public",
    levels: ["Elementary"],
    description:
      "DepEd lists Bangcud Central School as a public elementary school in Malaybalay City. Its older address listing uses the name Bangcud CES and places it along Sayre Highway in Purok 2, Bangcud.",
    officialLinks: [
      { label: "DepEd school address masterlist", url: depedMasterlistSource.url },
    ],
    announcements: defaultAnnouncement,
    transport: schoolTransport("Bangcud Central School, Purok 2, Sayre Highway, Bangcud, Malaybalay City"),
    source: depedInventorySource,
    status: "Partially Verified",
  },
  { slug: "kalasungay-central-school", name: "Kalasungay Central School", schoolId: "126582", barangay: "Kalasungay", address: "Purok 2, Kalasungay, Malaybalay City, 8700 Bukidnon", type: "Public", levels: ["Elementary"], source: depedMasterlistSource, status: "Partially Verified", announcements: defaultAnnouncement, transport: schoolTransport("Purok 2, Kalasungay, Malaybalay City") },
  { slug: "natid-asan-elementary-school", name: "Natid-asan Elementary School", schoolId: "126588", barangay: "Dalwangan", address: "New Look, Dalwangan, Malaybalay City, 8700 Bukidnon", type: "Public", levels: ["Elementary"], source: depedMasterlistSource, status: "Partially Verified", announcements: defaultAnnouncement, transport: schoolTransport("Natid-asan Elementary School, Dalwangan, Malaybalay City") },
  ...([
    ["new-ilocos-elementary-school", "New Ilocos Elementary School", "126589", "Dalwangan", "Sitio New Ilocos, Barangay Dalwangan, Malaybalay City, 8700 Bukidnon"],
    ["dalwangan-elementary-school", "Dalwangan Elementary School", "126580", "Dalwangan", "Purok 1, Dalwangan, Malaybalay City, 8700 Bukidnon"],
    ["damitan-elementary-school", "Damitan Elementary School", "103610", "Dalwangan", "Sitio Damitan, Dalwangan, Malaybalay City, 8700 Bukidnon"],
  ] as const).map(([slug, name, schoolId, barangay, address]) => ({ slug, name, schoolId, barangay, address, type: "Public" as const, levels: ["Elementary" as const], source: depedMasterlistSource, status: "Partially Verified" as const, announcements: defaultAnnouncement, transport: schoolTransport(address) })),
  { slug: "patpat-elementary-school", name: "Patpat Elementary School", schoolId: "126590", barangay: "Patpat", address: "Purok 3, Patpat, Malaybalay City, 8700 Bukidnon", type: "Public", levels: ["Elementary"], source: depedMasterlistSource, status: "Partially Verified", announcements: defaultAnnouncement, transport: schoolTransport("Purok 3, Patpat, Malaybalay City") },
  ...recognizedPrivateBasicSchools.map(([slug, name, barangay, address, levels]) => ({ slug, name, barangay, address, type: "Private" as const, levels, source: depedRecognizedPrivateSource, status: "Partially Verified" as const, announcements: defaultAnnouncement, transport: schoolTransport(`${name}, ${address}`) })),
  { slug: "bukidnon-state-university", name: "Bukidnon State University", barangay: "Casisang", address: BUKSU_CAMPUS_ADDRESS, type: "State university", levels: ["College / university"], contacts: ["(088) 813-2717", "(088) 221-2196", "presoffice@bsc.edu.ph"], source: chedSource, status: "Verified", announcements: { mode: "External official channel", externalUrl: "https://buksu.edu.ph/" }, transport: schoolTransport(`Bukidnon State University, ${BUKSU_CAMPUS_ADDRESS}`) },
  { slug: "camilo-adrales-technical-school", name: "Camilo Adrales Technical School Training and Assessment Center, Inc.", barangay: "San Jose", address: "Purok 5, Barangay San Jose, Malaybalay City, Bukidnon", type: "Technical-vocational", levels: ["Technical-vocational"], source: tesdaSource, status: "Verified", announcements: defaultAnnouncement, transport: schoolTransport("Purok 5, Barangay San Jose, Malaybalay City, Bukidnon") },
].map((institution) => {
  if (institution.slug === "apc") {
    return {
      ...institution,
      barangay: "Busdi",
      address: "Sitio Bendum, Barangay Busdi, Malaybalay City, Bukidnon 8700",
      description: "A Jesuit-run cultural and ecological school in partnership with the Pulangiyen of Bukidnon. Its published curriculum connects learning with ancestral domain, culture, and upland livelihoods.",
      leadership: "School Manager: Jenny Lynn Lee · Principal: Datu Nestor Menaling · Director: Fr. Pedro Walpole, SJ",
      programmes: ["K–12 cultural and ecological education", "Binukid, Filipino, and English communication", "Culture and livelihood learning"],
      officialLinks: [{ label: "APEC official website", url: "https://apupalamguwancenter.essc.org.ph/about/" }],
      announcements: { mode: "External official channel", externalUrl: "https://apupalamguwancenter.essc.org.ph/" as string },
      transport: schoolTransport("Sitio Bendum, Barangay Busdi, Malaybalay City, Bukidnon 8700"),
      source: { label: "Jesuit Bukidnon Ministries — APEC profile", url: "https://jesuitbukidnonmission.org/ministries", verifiedOn: reviewedOn, type: "Institutional website" as const },
      status: "Verified" as const,
    };
  }
  if (institution.slug === "bugemco-learning-center") {
    return {
      ...institution,
      barangay: "Barangay 9",
      address: "San Victores Street, Barangay 9, Capitol Compound, Malaybalay City",
      contacts: ["0926-539-3591"],
      programmes: ["Nursery", "Junior Kinder (K1)", "Senior Kinder (K2)"],
      officialLinks: [{ label: "BUGEMCO Learning Center", url: "https://sites.google.com/view/bugemco-learning-center/home" }],
      announcements: { mode: "External official channel", externalUrl: "https://sites.google.com/view/bugemco-learning-center/home" },
      transport: schoolTransport("San Victores Street, Barangay 9, Capitol Compound, Malaybalay City"),
      source: { label: "BUGEMCO Learning Center — official site", url: "https://sites.google.com/view/bugemco-learning-center/home", verifiedOn: reviewedOn, type: "Institutional website" as const },
      status: "Partially Verified" as const,
    };
  }
  return institution;
}) as EducationInstitution[];

type InventorySchool = {
  slug: string;
  name: string;
  schoolId?: string;
  barangay: string;
  address: string;
  type: InstitutionType;
  levels: EducationLevel[];
  classification?: string;
};

const inventorySchool = (
  slug: string,
  name: string,
  type: InstitutionType,
  levels: EducationLevel[],
  barangay: string,
  address: string,
  schoolId?: string,
  classification?: string,
): InventorySchool => ({ slug, name, type, levels, barangay, address, schoolId, classification });

/**
 * Malaybalay school directory entries enriched with verified DepEd school IDs,
 * barangay assignments, and localized addresses across Malaybalay City.
 */
const pendingSchoolInventory: InventorySchool[] = [
  inventorySchool("linabo-central-school", "Linabo Central School", "Public", ["Elementary"], "Linabo", "Purok 1, Sayre Highway, Barangay Linabo, Malaybalay City, 8700 Bukidnon", "126544", "Central school"),
  inventorySchool("malaybalay-city-central-school", "Malaybalay City Central School", "Public", ["Elementary"], "Barangay 4", "Corner Guingona & Don Carlos Streets, Barangay 4 (Poblacion), Malaybalay City, 8700 Bukidnon", "126586", "Central school"),
  inventorySchool("managok-central-school", "Managok Central School", "Public", ["Elementary"], "Managok", "Purok 2, Barangay Managok, Malaybalay City, 8700 Bukidnon", "126547", "Central school"),
  inventorySchool("airport-village-elementary-school", "Airport Village Elementary School", "Public", ["Elementary"], "Casisang", "Purok 7, Airport Village, Barangay Casisang, Malaybalay City, 8700 Bukidnon", "126574"),
  inventorySchool("balangbang-elementary-school", "Balangbang Elementary School", "Public", ["Elementary"], "Laguitas", "Sitio Balangbang, Barangay Laguitas, Malaybalay City, 8700 Bukidnon", "126535"),
  inventorySchool("barangay-9-elementary-school", "Barangay 9 Elementary School", "Public", ["Elementary"], "Barangay 9", "Capitol Drive, Barangay 9 (Poblacion), Malaybalay City, 8700 Bukidnon", "199510"),
  inventorySchool("bct-elementary-school", "BCT Elementary School", "Public", ["Elementary"], "Barangay 10", "Impalambong, Barangay 10 (Poblacion), Malaybalay City, 8700 Bukidnon", "126576"),
  inventorySchool("caburacanan-elementary-school", "Caburacanan Integrated School", "Public", ["Elementary"], "Caburacanan", "Purok 1, Barangay Caburacanan, Malaybalay City, 8700 Bukidnon", "126537"),
  inventorySchool("dapulan-elementary-school", "Dapulan Elementary School", "Public", ["Elementary"], "Apo Macote", "Sitio Dapulan, Barangay Apo Macote, Malaybalay City, 8700 Bukidnon", "126563"),
  inventorySchool("dumayas-elementary-school", "Dumayas Elementary School", "Public", ["Elementary"], "Maligaya", "Sitio Dumayas, Barangay Maligaya, Malaybalay City, 8700 Bukidnon", "126539"),
  inventorySchool("imbayao-elementary-school", "Imbayao Elementary School", "Public", ["Elementary"], "Imbayao", "Purok 1, Barangay Imbayao, Malaybalay City, 8700 Bukidnon", "126581"),
  inventorySchool("incalbog-elementary-school", "Incalbog Elementary School", "Public", ["Elementary"], "Can-ayan", "Sitio Incalbog, Barangay Can-ayan, Malaybalay City, 8700 Bukidnon", "103677"),
  inventorySchool("indalasa-elementary-school", "Indalasa Elementary School", "Public", ["Elementary"], "Indalasa", "Purok 2, Barangay Indalasa, Malaybalay City, 8700 Bukidnon", "126540"),
  inventorySchool("isabela-ayala-gonzales-elementary-school", "Isabela Ayala Gonzales Elementary School", "Public", ["Elementary"], "Sinanglanan", "Sitio Malapgap, Barangay Sinanglanan, Malaybalay City, 8700 Bukidnon", "126568"),
  inventorySchool("kulaman-elementary-school", "Kulaman Elementary School", "Public", ["Elementary"], "Kulaman", "Purok 1, Barangay Kulaman, Malaybalay City, 8700 Bukidnon", "126541"),
  inventorySchool("lalawan-elementary-school", "Lalawan Elementary School", "Public", ["Elementary"], "Linabo", "Sitio Lalawan, Barangay Linabo, Malaybalay City, 8700 Bukidnon", "126542"),
  inventorySchool("langasihan-elementary-school", "Langasihan Elementary School", "Public", ["Elementary"], "Managok", "Sitio Langasihan, Barangay Managok, Malaybalay City, 8700 Bukidnon", "126543"),
  inventorySchool("macote-elementary-school", "Macote Elementary School", "Public", ["Elementary"], "Apo Macote", "Purok 1, Barangay Apo Macote, Malaybalay City, 8700 Bukidnon", "126566"),
  inventorySchool("pighalugan-elementary-school", "Pighalugan Elementary School", "Public", ["Elementary"], "Silae", "Sitio Pighalugan, Barangay Silae, Malaybalay City, 8700 Bukidnon", "103629"),
  inventorySchool("san-jose-elementary-school", "San Jose Elementary School", "Public", ["Elementary"], "San Jose", "Purok 2, Barangay San Jose, Malaybalay City, 8700 Bukidnon", "126591"),
  inventorySchool("bukidnon-national-high-school-senior-high-school-campus", "Bukidnon National High School Senior High School Campus", "Public", ["Senior high"], "Barangay 3", "Fortich Street (Sayre Highway), Barangay 3 (Poblacion), Malaybalay City, 8700 Bukidnon", undefined, "Senior high school campus"),
  inventorySchool("san-martin-elementary-school", "San Martin Elementary School", "Public", ["Elementary"], "San Martin", "Purok 1, Barangay San Martin, Malaybalay City, 8700 Bukidnon"),
  inventorySchool("san-martin-sinanglanan-elementary-school", "San Martin-Sinanglanan Elementary School", "Public", ["Elementary"], "Sinanglanan", "Boundary Road, Barangay Sinanglanan / San Martin, Malaybalay City, 8700 Bukidnon", "126571"),
  inventorySchool("san-roque-elementary-school", "San Roque Elementary School", "Public", ["Elementary"], "Sinanglanan", "Purok 7, Sitio San Roque, Barangay Sinanglanan, Malaybalay City, 8700 Bukidnon", "126572"),
  inventorySchool("sawaga-elementary-school", "Sawaga Elementary School", "Public", ["Elementary"], "Violeta", "Purok 3, Barangay Violeta, Malaybalay City, 8700 Bukidnon", "126552"),
  inventorySchool("sta-ana-elementary-school", "Sta. Ana Elementary School", "Public", ["Elementary"], "Casisang", "Purok 6, Sta. Ana Area, Barangay Casisang, Malaybalay City, 8700 Bukidnon", "126592"),
  inventorySchool("tag-ilanao-elementary-school", "Tag-ilanao Elementary School", "Public", ["Elementary"], "Can-ayan", "Sitio Tag-ilanao, Barangay Can-ayan, Malaybalay City, 8700 Bukidnon", "126594"),
  inventorySchool("tamogawe-elementary-school", "Tamogawe Elementary School", "Public", ["Elementary"], "Mapayag", "Sitio Tamogawe, Barangay Mapayag, Malaybalay City, 8700 Bukidnon", "137297"),
  inventorySchool("tintinaan-elementary-school", "Tintinaan Elementary School", "Public", ["Elementary"], "Can-ayan", "Sitio Tintinaan, Barangay Can-ayan, Malaybalay City, 8700 Bukidnon", "126595"),
  inventorySchool("can-ayan-integrated-school", "Can-ayan Integrated School", "Public", ["Kindergarten", "Elementary", "Junior high", "Integrated school"], "Can-ayan", "Purok 2, Barangay Can-ayan, Malaybalay City, 8700 Bukidnon", "500245", "Integrated school"),
  inventorySchool("candiisan-integrated-school", "Candiisan Integrated School", "Public", ["Kindergarten", "Elementary", "Junior high", "Integrated school"], "Can-ayan", "Sitio Candiisan, Barangay Can-ayan, Malaybalay City, 8700 Bukidnon", "501195", "Integrated school"),
  inventorySchool("casisang-central-integrated-school", "Casisang Central Integrated School", "Public", ["Kindergarten", "Elementary", "Junior high", "Integrated school"], "Casisang", "Purok 6, Sayre Highway, Barangay Casisang, Malaybalay City, 8700 Bukidnon", "501580", "Integrated school"),
  inventorySchool("kilap-agan-integrated-school", "Kilap-agan Integrated School", "Public", ["Kindergarten", "Elementary", "Junior high", "Integrated school"], "Can-ayan", "Sitio Kilap-agan, Barangay Can-ayan, Malaybalay City, 8700 Bukidnon", "501579", "Integrated school"),
  inventorySchool("mabuhay-integrated-school", "Mabuhay Integrated School", "Public", ["Kindergarten", "Elementary", "Junior high", "Integrated school"], "San Jose", "Sitio Mabuhay, Barangay San Jose, Malaybalay City, 8700 Bukidnon", "501852", "Integrated school"),
  inventorySchool("magsaysay-integrated-school", "Magsaysay Integrated School", "Public", ["Kindergarten", "Elementary", "Junior high", "Integrated school"], "Magsaysay", "Purok 2, Barangay Magsaysay, Malaybalay City, 8700 Bukidnon", "501190", "Integrated school"),
  inventorySchool("manalog-integrated-school", "Manalog Integrated School", "Public", ["Kindergarten", "Elementary", "Junior high", "Integrated school"], "Manalog", "Purok 1, Barangay Manalog, Malaybalay City, 8700 Bukidnon", "501854", "Integrated school"),
  inventorySchool("mapayag-integrated-school", "Mapayag Integrated School", "Public", ["Kindergarten", "Elementary", "Junior high", "Integrated school"], "Mapayag", "Purok 1, Barangay Mapayag, Malaybalay City, 8700 Bukidnon", "501853", "Integrated school"),
  inventorySchool("pigpamulahan-integrated-school", "Pigpamulahan Integrated School", "Public", ["Kindergarten", "Elementary", "Junior high", "Integrated school"], "St. Peter", "Sitio Pigpamulahan, Barangay St. Peter, Malaybalay City, 8700 Bukidnon", "502740", "Integrated school"),
  inventorySchool("san-roque-integrated-school", "San Roque Integrated School", "Public", ["Kindergarten", "Elementary", "Junior high", "Integrated school"], "Sinanglanan", "Purok 7, Sitio San Roque, Barangay Sinanglanan, Malaybalay City, 8700 Bukidnon", "502738", "Integrated school"),
  inventorySchool("simaya-integrated-school", "Simaya Integrated School", "Public", ["Kindergarten", "Elementary", "Junior high", "Integrated school"], "Simaya", "Purok 2, Barangay Simaya, Malaybalay City, 8700 Bukidnon", "501582", "Integrated school"),
  inventorySchool("tuburan-integrated-school", "Tuburan Integrated School", "Public", ["Kindergarten", "Elementary", "Junior high", "Integrated school"], "Mapulo", "Sitio Tuburan, Barangay Mapulo, Malaybalay City, 8700 Bukidnon", "501581", "Integrated school"),
  inventorySchool("busdi-integrated-school", "Busdi Integrated School", "Public", ["Kindergarten", "Elementary", "Junior high", "Integrated school"], "Busdi", "Purok 1-A, Barangay Busdi, Malaybalay City, 8700 Bukidnon", "500409", "Integrated school"),
  inventorySchool("lunokan-integrated-school", "Lunokan Integrated School", "Public", ["Kindergarten", "Elementary", "Junior high", "Integrated school"], "Miglamin", "Sitio Lunokan, Barangay Miglamin, Malaybalay City, 8700 Bukidnon", "502744", "Integrated school"),
  inventorySchool("bukidnon-state-university-elementary-laboratory", "Bukidnon State University Elementary School Laboratory", "State university", ["Elementary"], "Casisang", BUKSU_CAMPUS_ADDRESS, undefined, "University laboratory school"),
  inventorySchool("lalawan-sda-elementary-school", "Lalawan SDA Elementary School", "Private", ["Elementary"], "Linabo", "Sitio Lalawan, Barangay Linabo, Malaybalay City, 8700 Bukidnon", undefined),
  inventorySchool("san-isidro-college-grade-school", "San Isidro College Grade School Department", "Private", ["Elementary"], "Barangay 10", "Impalambong, Barangay 10 (Poblacion), Malaybalay City, 8700 Bukidnon", undefined, "College grade school department"),
  inventorySchool("bukidnon-state-university-secondary-laboratory", "Bukidnon State University Secondary School Laboratory", "State university", ["Junior high", "Senior high"], "Casisang", BUKSU_CAMPUS_ADDRESS, undefined, "University laboratory school"),
  inventorySchool("imbayao-national-high-school", "Imbayao National High School", "Public", ["Junior high", "Senior high"], "Imbayao", "Purok 2, Barangay Imbayao, Malaybalay City, 8700 Bukidnon", "325503"),
  inventorySchool("lalawan-national-high-school", "Lalawan National High School", "Public", ["Junior high", "Senior high"], "Linabo", "Sitio Lalawan, Barangay Linabo, Malaybalay City, 8700 Bukidnon", "325501"),
  inventorySchool("luyungan-high-school", "Luyungan High School", "Public", ["Junior high", "Senior high"], "Bangcud", "Sitio Nasuli, Barangay Bangcud, Malaybalay City, 8700 Bukidnon", "300507"),
  inventorySchool("patpat-national-high-school", "Patpat National High School", "Public", ["Junior high", "Senior high"], "Patpat", "Purok 2, Barangay Patpat, Malaybalay City, 8700 Bukidnon", "306338"),
].filter((item, index, items) => items.findIndex((candidate) => candidate.slug === item.slug) === index);

const existingSchoolBySlug = new Map(educationInstitutionSeed.map((school) => [school.slug, school]));
for (const candidate of pendingSchoolInventory) {
  const existing = existingSchoolBySlug.get(candidate.slug);
  if (existing) {
    existing.levels = [...new Set([...existing.levels, ...candidate.levels])];
    existing.classification ??= candidate.classification;
    existing.schoolId ??= candidate.schoolId;
    existing.barangay ??= candidate.barangay;
    continue;
  }
  existingSchoolBySlug.set(candidate.slug, {
    ...candidate,
    source: candidate.schoolId ? depedInventorySource : researchInventorySource,
    status: candidate.schoolId ? "Partially Verified" : "Awaiting Verification",
    announcements: defaultAnnouncement,
    transport: schoolTransport(`${candidate.name}, ${candidate.address}`),
    description: `Listed in the Malaybalay City school directory at ${candidate.address} (${candidate.barangay}).`,
    logoStatus: "Pending verification",
  });
}

const schoolSubdomainHost = (slug: string) => `${slug}.bettermalaybalay.cloud`;
export const educationInstitutions: EducationInstitution[] = [...existingSchoolBySlug.values()].map((school) => ({
  ...school,
  logoStatus: school.logoStatus ?? (school.logoUrl ? "Verified" : "Unavailable"),
  subdomainHost: schoolSubdomainHost(school.slug),
}));
export const educationInstitutionBySlug = new Map(educationInstitutions.map((school) => [school.slug, school]));

export function schoolSlugFromHostname(hostname: string, search = "") {
  if (search) {
    const params = new URLSearchParams(search);
    const requested = (params.get("school") ?? params.get("schoolSubdomain") ?? "")
      .trim()
      .toLowerCase();
    if (requested && educationInstitutionBySlug.has(requested)) return requested;
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
  const slug = normalized.slice(0, -suffix.length);
  return slug && slug !== "www" && educationInstitutionBySlug.has(slug) ? slug : null;
}

export type EducationOffice = {
  slug: string;
  name: string;
  jurisdiction: string;
  address: string;
  contacts: string[];
  officials: Array<{ role: string; name: string; status: VerificationStatus }>;
  services: string[];
  source: RecordSource;
};

export const educationOffices: EducationOffice[] = [
  {
    slug: "deped-malaybalay-city",
    name: "Department of Education — Schools Division of Malaybalay City",
    jurisdiction: "Public elementary and secondary schools within the Schools Division of Malaybalay City.",
    address: "Sayre Highway, Purok 6, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    contacts: ["0907-688-9009", "malaybalay.city@deped.gov.ph"],
    officials: [
      { role: "Schools Division Superintendent", name: "Not published in the reviewed current division source", status: "Awaiting Verification" },
      { role: "Assistant Schools Division Superintendent", name: "Not published in the reviewed current division source", status: "Awaiting Verification" },
    ],
    services: ["Division memoranda, advisories, and orders", "Citizen’s Charter and public records", "Public-school and education-programme inquiries"],
    source: { label: "DepEd — Schools Division of Malaybalay City", url: "https://malaybalay.deped.gov.ph/", verifiedOn: reviewedOn, type: "Government directory" },
  },
  {
    slug: "deped-bukidnon",
    name: "Department of Education — Schools Division of Bukidnon",
    jurisdiction: "Provincial schools division; separate from the Schools Division of Malaybalay City.",
    address: "Fortich Street, Sumpong, Malaybalay City, Bukidnon",
    contacts: ["+63 917 842 3657", "bukidnon@deped.gov.ph"],
    officials: [
      { role: "Schools Division Superintendent", name: "Victoria V. Gazo, PhD, CESO V", status: "Verified" },
      { role: "Assistant Schools Division Superintendent", name: "Rosemarie T. Macesar, PhD", status: "Verified" },
      { role: "Officer-in-Charge, Office of the Assistant Schools Division Superintendent", name: "Esther V. Tabañag, PhD", status: "Verified" },
    ],
    services: ["Division issuances and advisories", "Schools directory and contacts", "Transparency, Citizen’s Charter, and public records"],
    source: { label: "DepEd — Schools Division of Bukidnon, Division Officials", url: "https://bukidnon.deped.gov.ph/about/organizational-structure/division-officials/", verifiedOn: reviewedOn, type: "Government directory" },
  },
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
