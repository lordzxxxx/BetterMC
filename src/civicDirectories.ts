import type { Source } from "./data";

export type EducationLevel = "Preschool" | "Kindergarten" | "Elementary" | "Junior high" | "Senior high" | "Integrated school" | "Technical-vocational" | "College / university";
export type InstitutionType = "Public" | "Private" | "State university" | "Technical-vocational";
export type VerificationStatus = "Verified" | "Partially Verified" | "Awaiting Verification" | "Community Reported" | "Inactive or Closed";
export type SourceType = "Government directory" | "Institutional website" | "Official school channel";

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
  levels: EducationLevel[];
  description?: string;
  leadership?: string;
  contacts?: string[];
  programmes?: string[];
  officialLinks?: Array<{ label: string; url: string }>;
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

const publicBasicSchools: Array<[string, string, string, string, string | undefined, EducationLevel[]]> = [
  ["aglayan-central-school", "Aglayan Central School", "126577", "Purok 3, Aglayan, Malaybalay City", "Aglayan", ["Elementary"]],
  ["baganao-elementary-school", "Baganao Elementary School", "126575", "Sitio Bagnao, Kibalabag, Malaybalay City", "Kibalabag", ["Elementary"]],
  ["bagong-silang-elementary-school", "Bagong Silang Elementary School", "126543", "Purok 6, Bagong Silang, Malaybalay City", "Maligaya", ["Elementary"]],
  ["babahag-elementary-school", "Babahag Elementary School", "501585", "Purok 7, Laguitas, Malaybalay City", "Laguitas", ["Elementary"]],
  ["bendolan-elementary-school", "Bendolan Elementary School", "126559", "Purok 3, Bendolan, Malaybalay City", "Magsaysay", ["Elementary"]],
  ["bulonay-elementary-school", "Bulonay Elementary School", "501190", "Fortich Street, Malaybalay City", "Barangay 3", ["Elementary"]],
  ["cabagahan-elementary-school", "Cabagahan Elementary School", "126561", "Purok 1, Cabangahan, Malaybalay City", "Cabangahan", ["Elementary"]],
  ["capitan-angel-integrated-school", "Capitan Angel Integrated School", "501189", "Purok 1, Capitan Angel, Malaybalay City", "Capitan Angel", ["Kindergarten", "Elementary", "Junior high", "Integrated school"]],
  ["candisaan-integrated-school", "Candisaan Integrated School", "501195", "Candisaan, Can-ayan, Malaybalay City", "Can-ayan", ["Kindergarten", "Elementary", "Junior high", "Integrated school"]],
  ["kibalabag-integrated-school", "Kibalabag Integrated School", "501188", "Purok 3, Kibalabag, Malaybalay City", "Kibalabag", ["Kindergarten", "Elementary", "Junior high", "Integrated school"]],
  ["maligaya-integrated-school", "Maligaya Integrated School", "501583", "Malubog, San Jose, Malaybalay City", "San Jose", ["Kindergarten", "Elementary", "Junior high", "Integrated school"]],
  ["mapulo-elementary-school", "Mapulo Elementary School", "126548", "Mapulo, Malaybalay City", "Mapulo", ["Elementary"]],
  ["silae-elementary-school", "Silae Elementary School", "126553", "Purok 2, Silae, Malaybalay City", "Silae", ["Elementary"]],
  ["st-peter-elementary-school", "St. Peter Elementary School", "126554", "Valsons, St. Peter, Malaybalay City", "St. Peter", ["Elementary"]],
  ["sumpong-central-school", "Sumpong Central School", "126593", "Sumpong, Malaybalay City", "Sumpong", ["Elementary"]],
  ["zamboanguita-elementary-school", "Zamboanguita Elementary School", "126556", "Purok 1, Zamboanguita, Malaybalay City", "Zamboanguita", ["Elementary"]],
  ["apo-macote-national-high-school", "Apo Macote National High School", "325505", "Purok 2, Apo Macote, Malaybalay City", "Apo Macote", ["Junior high", "Senior high"]],
];

const recognizedPrivateBasicSchools: Array<[string, string, EducationLevel[]]> = [
  ["apc", "Apu Palamguwan Cultural Education Center", ["Kindergarten", "Elementary", "Junior high", "Senior high"]],
  ["bethel-baptist-christian-academy", "Bethel Baptist Christian Academy", ["Preschool", "Elementary", "Junior high"]],
  ["brightspark-christian-academy", "Brightspark Christian Academy", ["Preschool", "Elementary", "Junior high"]],
  ["bugemco-learning-center", "BUGEMCO Learning Center", ["Preschool"]],
  ["casisang-international-christian-school", "Casisang International Christian School", ["Preschool", "Elementary", "Junior high"]],
  ["el-gibbor-faithhouse-academy", "El Gibbor Faithhouse Academy Incorporated", ["Preschool"]],
  ["heights-kinderland", "Heights Kinderland Inc.", ["Preschool"]],
  ["kitanglad-view-adventist-elementary-school", "Kitanglad View Adventist Elementary School", ["Elementary"]],
  ["little-gems-learning-center", "Little Gems Learning Center, Inc.", ["Preschool"]],
  ["malaybalay-city-adventist-elementary-school", "Malaybalay City Adventist Elementary School, Inc.", ["Preschool", "Elementary"]],
  ["marywoods-academy", "Marywoods Academy Inc.", ["Elementary", "Junior high"]],
  ["mindanao-arts-technological-institute", "Mindanao Arts & Technological Institute, Inc.", ["Preschool", "Elementary", "Junior high"]],
  ["saint-isidore-high-school", "Saint Isidore High School", ["Elementary", "Junior high", "Senior high"]],
  ["san-isidro-college", "San Isidro College", ["Preschool", "Elementary", "Junior high"]],
  ["st-isidore-academy-sinanglanan", "St. Isidore Academy of Bukidnon, Inc. Sinanglanan", ["Elementary", "Junior high"]],
  ["st-johns-school-malaybalay", "St. John’s School of Malaybalay City, Inc.", ["Preschool", "Elementary"]],
  ["st-michael-high-school", "St. Michael High School Inc.", ["Junior high"]],
  ["sunbeam-christian-academy", "Sunbeam Christian Academy of Bangcud Inc.", ["Preschool", "Elementary"]],
];

export const educationInstitutions: EducationInstitution[] = [
  ...publicHighSchools.map(([slug, name, schoolId, address, levels]) => ({
    slug, name, schoolId, address, type: "Public" as const, levels, source: depedSchoolSource, status: "Verified" as const, announcements: defaultAnnouncement, transport: schoolTransport(address),
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
  { slug: "kalasungay-central-school", name: "Kalasungay Central School", schoolId: "126582", barangay: "Kalasungay", address: "Purok 2, Kalasungay, Malaybalay City", type: "Public", levels: ["Elementary"], source: depedMasterlistSource, status: "Partially Verified", announcements: defaultAnnouncement, transport: schoolTransport("Purok 2, Kalasungay, Malaybalay City") },
  { slug: "natid-asan-elementary-school", name: "Natid-asan Elementary School", schoolId: "126588", barangay: "Dalwangan", address: "New Look, Dalwangan, Malaybalay City", type: "Public", levels: ["Elementary"], source: depedMasterlistSource, status: "Partially Verified", announcements: defaultAnnouncement, transport: schoolTransport("Natid-asan Elementary School, Dalwangan, Malaybalay City") },
  ...([
    ["new-ilocos-elementary-school", "New Ilocos Elementary School", "126589", "", "Exact address and barangay not confirmed in the reviewed DepEd inventory"],
    ["dalwangan-elementary-school", "Dalwangan Elementary School", "126580", "Dalwangan", "Purok 1, Dalwangan, Malaybalay City"],
    ["damitan-elementary-school", "Damitan Elementary School", "103610", "Dalwangan", "Damitan, Dalwangan, Malaybalay City"],
  ] as const).map(([slug, name, schoolId, barangay, address]) => ({ slug, name, schoolId, barangay, address, type: "Public" as const, levels: ["Elementary" as const], source: depedMasterlistSource, status: "Partially Verified" as const, announcements: defaultAnnouncement, transport: schoolTransport(address) })),
  { slug: "patpat-elementary-school", name: "Patpat Elementary School", schoolId: "126590", barangay: "Patpat", address: "Purok 3, Patpat, Malaybalay City", type: "Public", levels: ["Elementary"], source: depedMasterlistSource, status: "Partially Verified", announcements: defaultAnnouncement, transport: schoolTransport("Purok 3, Patpat, Malaybalay City") },
  ...recognizedPrivateBasicSchools.map(([slug, name, levels]) => ({ slug, name, address: "Address not published in the reviewed government recognition list", type: "Private" as const, levels, source: depedRecognizedPrivateSource, status: "Partially Verified" as const, announcements: defaultAnnouncement, transport: schoolTransport(`${name}, Malaybalay City`) })),
  { slug: "bukidnon-state-university", name: "Bukidnon State University", address: "Malaybalay City, Bukidnon", type: "State university", levels: ["College / university"], contacts: ["(088) 813-2717", "(088) 221-2196", "presoffice@bsc.edu.ph"], source: chedSource, status: "Verified", announcements: { mode: "External official channel", externalUrl: "https://buksu.edu.ph/" }, transport: schoolTransport("Bukidnon State University, Malaybalay City") },
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
    address: "Address not published on the reviewed division home page.",
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
