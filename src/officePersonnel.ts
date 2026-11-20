import { officials } from "./data";

export type OfficePersonnelMember = {
  name: string;
  position: string;
};

export type OfficePersonnelGroup = {
  unitName: string;
  members: OfficePersonnelMember[];
};

export type OfficePersonnelDirectoryEntry = {
  sourceLabel: string;
  sourceUrl: string;
  unitNotes?: string;
  additionalSources?: Array<{ label: string; url: string }>;
  groups: OfficePersonnelGroup[];
};

const SAKATA_SP_URL = "https://sakata.malaybalaycity.gov.ph/spoffice/";
const SAKATA_ADMIN_URL = "https://sakata.malaybalaycity.gov.ph/city-administrators-office/";
const SAKATA_BPLD_URL = "https://sakata.malaybalaycity.gov.ph/business-permit-and-licensing-division/";
const SAKATA_ACCOUNTING_URL = "https://sakata.malaybalaycity.gov.ph/city-accounting-office/";
const SAKATA_CPDO_URL = "https://sakata.malaybalaycity.gov.ph/city-planning-and-development-office/";
const SAKATA_LEGAL_URL = "https://sakata.malaybalaycity.gov.ph/citylegaloffice/";
const SAKATA_CSWDO_URL = "https://sakata.malaybalaycity.gov.ph/citysocialwelfareanddevelopmentoffice/";
const SAKATA_AGRI_URL = "https://sakata.malaybalaycity.gov.ph/city-agriculture-office/";
const SAKATA_CEEDMO_URL = "https://sakata.malaybalaycity.gov.ph/city-economic-enterprise-and-management-office/";
const SAKATA_ASSESSOR_URL = "https://sakata.malaybalaycity.gov.ph/city-assessorss-office/";
const SAKATA_BUDGET_URL = "https://sakata.malaybalaycity.gov.ph/city-budget-office/";
const SAKATA_GSO_URL = "https://sakata.malaybalaycity.gov.ph/city-general-services-office/";
const SAKATA_ENG_URL = "https://sakata.malaybalaycity.gov.ph/city-engineers-office/";
const SAKATA_BAC_URL = "https://sakata.malaybalaycity.gov.ph/bids-and-awards-committee-structure/";
const SAKATA_GAD_URL = "https://sakata.malaybalaycity.gov.ph/gad-corner/";
const APP_2026_URL =
  "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/ANNUAL-PROCUREMENT-PLAN-2026.pdf";
const CHARTER_2026_URL =
  "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/10/CITIZENS_CHARTER_2026.pdf";
const FULL_DISC_RECEIPTS_2026_URL =
  "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/STATEMENT-OF-RECEIPTS-AND-EXPENDITURES2026-Q2.pdf";
const DEPED_MEMO_2026_URL = "https://malaybalay.deped.gov.ph/division-memorandum-2026/";

const councilMembers: OfficePersonnelMember[] = officials
  .filter((item) => item.group === "Legislative" || item.group === "Sectoral")
  .map((item) => ({ name: item.name, position: item.role }));

export const officePersonnelBySlug: Record<string, OfficePersonnelDirectoryEntry> = {
  mayor: {
    sourceLabel: "City Government of Malaybalay — CY 2026 Annual Procurement Plan Summary & BAC Structure",
    sourceUrl: APP_2026_URL,
    unitNotes:
      "Functional executive units documented across CS Form No. 9 and the 2026 Citizen's Charter include the Procurement Support Section, Special Support Services Division (City Band), Agricultural and Biosystems Engineering Division, and specialized CMO service wings (PESO, BPLD, Community Affairs, OSCA, Tourism, CUDHO, and TMC).",
    additionalSources: [
      { label: "Mayor's Corner — sakata.malaybalaycity.gov.ph", url: "https://sakata.malaybalaycity.gov.ph/mayors-corner/" },
      { label: "Bids and Awards Committee Structure", url: SAKATA_BAC_URL },
    ],
    groups: [
      {
        unitName: "Local Chief Executive & Executive Wing Leadership",
        members: [
          { name: "Hon. Jay Warren R. Pabillaran", position: "City Mayor / Local Chief Executive" },
          { name: "Atty. Anna Marie R. Bergado", position: "City Administrator & PESO Manager" },
          { name: "Atty. Mitchell D. Talatala", position: "Executive Assistant IV / BAC Chairperson (Concurrent City Assessor)" },
        ],
      },
      {
        unitName: "Attached CMO Service Division Heads",
        members: [
          { name: "Arnel S. Alagenio", position: "Executive Assistant V - Designate (BPLD / CMO Supervision)" },
          { name: "Venus G. Palalay", position: "Community Affairs Officer IV (CMO — Community Affairs Division)" },
          { name: "Marven Jan Nadela", position: "City Tourism Officer (CMO — City Tourism Division)" },
          { name: "EnP. Perfecto Ray D. Bayo, Jr.", position: "Division Head (CMO — City Urban Development & Housing)" },
          { name: "Joseph G. Jabla", position: "Traffic Operations Officer / Head (CMO — Traffic Management Center)" },
          { name: "Rene Cipriano", position: "Head / Coordinator (CMO — Office of the Senior Citizens Affairs)" },
        ],
      },
    ],
  },
  "vice-mayor": {
    sourceLabel: "City Government of Malaybalay — CY 2026 Annual Procurement Plan & Legislative Directory",
    sourceUrl: APP_2026_URL,
    additionalSources: [
      { label: "Sangguniang Panlungsod Office Directory", url: SAKATA_SP_URL },
    ],
    groups: [
      {
        unitName: "Presiding Officer & Legislative Secretariat Coordination",
        members: [
          { name: "Hon. Estelito \"Litoy\" R. Marabe", position: "City Vice Mayor / Presiding Officer, Sangguniang Panlungsod" },
          { name: "Atty. Phoebe Corazon C. Hidalgo", position: "Secretary to the Sangguniang Panlungsod (Legislative Support)" },
        ],
      },
    ],
  },
  peso: {
    sourceLabel: "2026 Citizen's Charter (CMO — PESO, pp. 530–546) & DOLE Region 10 Dispatches",
    sourceUrl: CHARTER_2026_URL,
    unitNotes:
      "Operates under the Office of the City Mayor (City Administrator's Office Wing) across four frontline desks: Jobseeker Registration & PEIS Matching Desk, Employer Accreditation (LRA/SRA) & Job Fair Unit, SPES/WAP & Career Guidance Advocacy Desk, and Livelihood & OFW Support Referral Desk.",
    additionalSources: [
      { label: "City Administrator's Office Directory", url: SAKATA_ADMIN_URL },
    ],
    groups: [
      {
        unitName: "Office Leadership & DOLE Counterpart",
        members: [
          { name: "Atty. Anna Marie R. Bergado", position: "PESO Manager / City Administrator" },
          { name: "Hon. Jay Warren R. Pabillaran", position: "City Mayor (General Executive Supervision)" },
          { name: "Raul L. Valmores", position: "Provincial Head, DOLE Bukidnon Field Office (Regional Counterpart)" },
        ],
      },
    ],
  },
  chrmo: {
    sourceLabel: "CY 2026 Annual Procurement Plan Summary & 2026 Citizen's Charter (CHRMO, pp. 388–422)",
    sourceUrl: APP_2026_URL,
    unitNotes:
      "Organized into the Personnel Administration Division (Payroll, Benefits, Leave, Recruitment & Selection / Records Management Sections) and the Career and Performance Management Division (Training & Development and Performance Management Sections).",
    additionalSources: [
      { label: "GAD Focal Point System (EO No. 12) — sakata.malaybalaycity.gov.ph", url: SAKATA_GAD_URL },
      { label: "LGU Malaybalay CS Form No. 9 Publication (4th Tranche)", url: "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2025/04/CS-Form-No-9-Publication-2024-4th-Tranche-1-1.pdf" },
    ],
    groups: [
      {
        unitName: "Office Leadership & Key Officers",
        members: [
          { name: "Magnolia O. Improgo, DPA", position: "City Government Department Head I (City HRMO)" },
          { name: "Cherish B. Tulang", position: "Human Resource Management Officer III (GFPS TWG Representative)" },
        ],
      },
    ],
  },
  sp: {
    sourceLabel: "City Government of Malaybalay — Sangguniang Panlungsod Office",
    sourceUrl: SAKATA_SP_URL,
    groups: [
      {
        unitName: "Presiding Officer & 10th Sangguniang Panlungsod",
        members: [
          { name: "Hon. Estelito \"Litoy\" R. Marabe", position: "City Vice Mayor / Presiding Officer" },
          ...councilMembers,
        ],
      },
      {
        unitName: "Office of the Secretariat & Executive Unit",
        members: [
          { name: "Atty. Phoebe Corazon C. Hidalgo", position: "Sangguniang Panlungsod Secretary" },
          { name: "Marilou T. Sinues", position: "City Government Assistant Department Head (Assistant SP Secretary)" },
          { name: "Jane M. Solito", position: "Private Secretary I" },
          { name: "Mark Loyd Pailagao", position: "Administrative Aide IV (Driver II)" },
        ],
      },
      {
        unitName: "City Library",
        members: [
          { name: "Jennifer T. Sombilon", position: "Librarian II" },
          { name: "Jerry F. Cabigon", position: "Administrative Officer I (Records Officer I)" },
          { name: "Hazel T. Ybañez", position: "Administrative Aide IV (Clerk III)" },
          { name: "Ma. Clara Alma V. Itchon", position: "Administrative Aide IV (Bookbinder II)" },
          { name: "Maria Kristina S. Manuel", position: "Administrative Assistant I (Computer Operator I)" },
          { name: "Lenie M. Litanon", position: "Administrative Aide III (Utility Worker II)" },
          { name: "Rowena D. Deocampo", position: "Administrative Aide III (Utility Worker II)" },
          { name: "Joan V. Namocot", position: "Administrative Aide I (Utility Worker I)" },
        ],
      },
      {
        unitName: "Administrative Support Unit",
        members: [
          { name: "Marylou B. Gaid", position: "Information Officer II" },
          { name: "Louela C. Serrano", position: "Administrative Aide VI (Clerk II)" },
          { name: "Grace R. Elaba", position: "Administrative Aide IV (Clerk II)" },
          { name: "Rosheene Jay H. Vista", position: "Administrative Aide IV (Clerk II)" },
          { name: "Ronald V. Barranco", position: "Administrative Aide III (Audio-Visual Equipment Operator I)" },
          { name: "Leonides C. Buquiran", position: "Administrative Aide II (Driver I)" },
          { name: "Eduardo M. Madronero", position: "Administrative Aide II (Messenger)" },
          { name: "Jessie A. Aclub", position: "Administrative Aide I (Utility Worker I)" },
          { name: "Menchu R. Tiamson", position: "Administrative Aide I (Utility Worker I)" },
        ],
      },
      {
        unitName: "Research Division — Bill Review & Monitoring Section",
        members: [
          { name: "Dienne Mae C. Espartero", position: "Local Legislative Staff Officer V" },
          { name: "Alfe Joy C. Secretaria", position: "Local Legislative Staff Officer III" },
          { name: "Raymond John R. Amba", position: "Administrative Aide IV (Clerk II)" },
        ],
      },
      {
        unitName: "Records & Legislative Service Division",
        members: [
          { name: "Eliza Joy S. Paredes", position: "Administrative Officer V (Records Officer III)" },
          { name: "Zeny T. Somoso", position: "Administrative Officer III (Records Officer II)" },
          { name: "Winchie B. Paredes", position: "Records / Archives Section Staff" },
          { name: "Rosevilla D. Tadlas", position: "Administrative Aide IV (Clerk II)" },
          { name: "Vilma A. Sulinay", position: "Administrative Assistant III (Computer Assistant II — Journal/Minutes)" },
          { name: "Marieta C. Taglinao", position: "Administrative Assistant III (Stenographic Reporter II — Journal/Minutes)" },
        ],
      },
    ],
  },
  admin: {
    sourceLabel: "City Government of Malaybalay — City Administrator's Office",
    sourceUrl: SAKATA_ADMIN_URL,
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          { name: "Atty. Anna Marie R. Bergado", position: "City Administrator" },
          { name: "Jeanyben M. Dacalanio", position: "Assistant City Administrator" },
        ],
      },
      {
        unitName: "Administrative Support Division",
        members: [
          { name: "Zennia A. Macapelit", position: "Administrative Officer III / Records Officer II" },
          { name: "Jay Ford V. Audiencia", position: "Electronics and Communications Technician II" },
          { name: "Rosalie E. Lim", position: "Administrative Aide IV (Clerk II)" },
          { name: "Reynaldo C. Robosa", position: "Administrative Aide IV (Driver I)" },
          { name: "Edgar Paluga", position: "Administrative Aide IV (Production Machine Operator II)" },
          { name: "Flordeliz T. Enoc", position: "Administrative Aide" },
          { name: "Nelgelette M. Dalinanto", position: "Administrative Aide" },
        ],
      },
      {
        unitName: "Organization Development Division",
        members: [
          { name: "Leopoldo M. Liwanag, Jr.", position: "Administrative Assistant II" },
          { name: "Shiella Mae T. Anguay", position: "Administrative Aide" },
          { name: "Marivic R. Sarmiento", position: "Administrative Aide" },
          { name: "Jogie Mae P. Cork", position: "Administrative Aide" },
        ],
      },
      {
        unitName: "Public Information Division",
        members: [
          { name: "Rio Adam T. Opiala", position: "Information Officer III (Information Campaign & Documentation Section)" },
          { name: "Joni Ester P. Parado", position: "Information Officer III (Public Relations Section)" },
          { name: "Sheila S. Evacuado", position: "Information Officer I" },
          { name: "Benedict Boni S. Aserios", position: "Administrative Aide" },
          { name: "Ezekhel M. Arcayena", position: "Administrative Aide" },
          { name: "Swennee Cate T. Celestial", position: "Administrative Aide" },
        ],
      },
      {
        unitName: "Management Information Systems (MIS) Division",
        members: [
          { name: "Salick O. Darangina", position: "Information Technology Officer II" },
          { name: "Marc Dennis B. Daniot", position: "Information System Analyst II (Program Development)" },
          { name: "Sherilyn Kaye Rain D. Dimaculangan", position: "Information System Analyst I (Program Development)" },
          { name: "Teofilo A. Piodos, Jr.", position: "Information System Analyst I (Program Development)" },
          { name: "Jason D. Manghano", position: "Electronics and Communications Technician II" },
          { name: "John Julian Dominic I. Gallardo", position: "Electronics and Communications Technician II" },
          { name: "Geraldine R. Nemenso", position: "Electronics and Communications Technician II" },
          { name: "Migue C. Gonzaga", position: "Electronics and Communications Technician II" },
          { name: "Aidan Ace R. Jumawid", position: "Electronics and Communications Technician II" },
          { name: "Jhon Villiam C. Ortillo", position: "Administrative Officer I (Computer Operator I — Hardware Maintenance)" },
          { name: "Jolly C. Chavez, Jr.", position: "Administrative Aide III (Hardware Maintenance)" },
        ],
      },
    ],
  },
  legal: {
    sourceLabel: "City Government of Malaybalay — City Legal Office",
    sourceUrl: SAKATA_LEGAL_URL,
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          { name: "Atty. Julius Michael G. Barroso", position: "City Legal Officer" },
        ],
      },
      {
        unitName: "Administrative Support Division",
        members: [
          { name: "Maisarah P. Emam", position: "Administrative Officer V (Records Officer III)" },
          { name: "Ivy Casey M. Macalam", position: "Community Affairs Assistant II" },
          { name: "Dino L. Egbalic", position: "Driver II" },
          { name: "Rudy P. Florita", position: "Administrative Aide I" },
          { name: "Ruthessa B. Leyros", position: "Legal Aide I" },
        ],
      },
      {
        unitName: "Research, Investigation & Legal Assistance Division",
        members: [
          { name: "Atty. Alfredo G. Cape, Jr.", position: "City Legal Officer IV" },
          { name: "Meigen R. Saway", position: "Legal Assistant II" },
          { name: "Maria Sharron M. Ladera", position: "Administrative Aide I" },
        ],
      },
    ],
  },
  cpdo: {
    sourceLabel: "City Government of Malaybalay — CPDO Organizational Chart",
    sourceUrl: SAKATA_CPDO_URL,
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          { name: "Engr. Adrian R. Gamboa", position: "City Planning and Development Coordinator" },
          { name: "Maria Rosario G. Saldua", position: "Assistant City Planning and Development Coordinator" },
        ],
      },
      {
        unitName: "Administrative Unit",
        members: [
          { name: "Consolacion P. Rivera", position: "Administrative Officer I / Records Officer I" },
          { name: "Roshelle T. Panang", position: "Administrative Aide IV (Clerk II)" },
          { name: "Joelito M. Flores", position: "Administrative Aide IV (Driver II)" },
        ],
      },
      {
        unitName: "Planning, Information Management, Monitoring & Evaluation Division",
        members: [
          { name: "Ma. Renie V. Bingat", position: "Statistician IV (Division Head)" },
          { name: "Dianne R. Estrada", position: "Statistician III (Data Management Section)" },
          { name: "Kristina E. Blaza", position: "Statistician I (Data Management Section)" },
          { name: "Gina U. Cielo", position: "Computer Programmer I (Data Management Section)" },
          { name: "Aia Jessamine D. Arresgado", position: "Information Systems Analyst III (GIS Section)" },
          { name: "Ginno Florencio C. Balba", position: "Information Systems Analyst I (GIS Section)" },
          { name: "Esmeraldo H. Herbieto", position: "Project Evaluation Officer III (Monitoring & Evaluation)" },
          { name: "Regine O. Tolibao", position: "Project Evaluation Officer I (Monitoring & Evaluation)" },
        ],
      },
      {
        unitName: "Planning, Programming & Zoning Administration Division",
        members: [
          { name: "Angelie Joy G. Darangina", position: "Planning Officer IV (Division Head)" },
          { name: "Marjorie Z. Toyhorada", position: "Planning Officer II (Planning Section)" },
          { name: "Maricel L. Tagayuna", position: "Economic Researcher (Planning Section)" },
          { name: "Phoebe Jane E. Leono", position: "Project Development Officer II (Investment & Programming)" },
          { name: "Achille M. Cabañelez", position: "Project Development Officer I (Investment & Programming)" },
          { name: "Darius Z. Muñez", position: "Zoning Officer III (Zoning Administration Section)" },
        ],
      },
    ],
  },
  budget: {
    sourceLabel: "City Government of Malaybalay — City Budget Office",
    sourceUrl: SAKATA_BUDGET_URL,
    groups: [
      {
        unitName: "Office Leadership",
        members: [{ name: "Ronny B. Gamao", position: "City Budget Officer" }],
      },
      {
        unitName: "City Budget Operations Division",
        members: [
          { name: "Mary Grace R. Alenton", position: "Budget Officer IV (Division Head)" },
          { name: "Renie Blanche M. Estrada", position: "Budget Officer III (City Budget Preparation Section)" },
          { name: "Analiza F. Cahucom", position: "Budget Officer II (City Budget Preparation Section)" },
          { name: "Lou Francis C. Alesna", position: "Budget Officer I (City Budget Preparation Section)" },
          { name: "Eddie E. Ocier, Jr.", position: "Budget Officer III (Review & Execution Section)" },
          { name: "Giancarlo S. Neri", position: "Budget Officer II (Review & Execution Section)" },
          { name: "Jan Alvin M. Fe", position: "Budget Officer I (Review & Execution Section)" },
          { name: "Loryvin T. Salomon", position: "Budgeting Assistant (Review & Execution Section)" },
          { name: "Sibyl L. Maputi", position: "Budget Officer IV (Field Operations Section)" },
        ],
      },
      {
        unitName: "Barangay Budget Operations Division",
        members: [
          { name: "Ethyl T. Quipet", position: "Budget Officer III (Barangay Budget Review Section)" },
          { name: "Queen Melanie J. Zaragoza", position: "Budget Officer I (Barangay Budget Review Section)" },
        ],
      },
      {
        unitName: "Administrative Unit",
        members: [
          { name: "Moreno Son B. Bamba", position: "Administrative Assistant VI / Computer Operator III" },
          { name: "Victhor Jade G. Racanday", position: "Administrative Assistant III / Storekeeper III" },
          { name: "Franco A. Dogomeo", position: "Administrative Assistant I / Rep. Machine Operator III" },
          { name: "Jodelito B. Ares", position: "Administrative Aide IV / Driver II" },
          { name: "Flordelyn L. Flores", position: "Administrative Aide III / Utility Worker II" },
        ],
      },
    ],
  },
  accounting: {
    sourceLabel: "City Government of Malaybalay — City Accounting Office",
    sourceUrl: SAKATA_ACCOUNTING_URL,
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          { name: "Carlito R. Juarez, CPA", position: "City Accountant" },
          { name: "Ramiel B. Coscos, CPA", position: "Assistant City Accountant" },
        ],
      },
      {
        unitName: "Administrative Support Division",
        members: [
          { name: "Liezl O. Casinabe", position: "Administrative Officer IV / Records Officer II" },
          { name: "Laarni Jane B. Estrada", position: "Clerk II" },
          { name: "Ike P. Aldeguer", position: "Driver II" },
          { name: "Ken Archimedes S. Olano", position: "Utility Worker II" },
          { name: "Sergio O. Tura, Jr.", position: "Machine Operator II (Casual)" },
        ],
      },
      {
        unitName: "City Financial Accounting Services Division",
        members: [
          { name: "Leann Trisha Alison T. Cajegas, CPA", position: "Accountant IV" },
          { name: "Van Lewraine A. Caballero, CPA", position: "Accountant II (City Financial Accounts)" },
          { name: "Rafael D. Vidal III", position: "Senior Bookkeeper" },
          { name: "Vernaliza Vidal", position: "Bookkeeper I" },
          { name: "Joseph B. Genabe", position: "Machine Operator II (Casual)" },
          { name: "Jocelyn D. Indapan", position: "Clerk II (Casual — City Subsidiary / Recap)" },
        ],
      },
      {
        unitName: "City Financial Auditing Services Division",
        members: [
          { name: "John Benedict E. Rodriguez, CPA", position: "Management and Audit Analyst IV" },
          { name: "Rey A. Carias", position: "Management and Audit Assistant (City Financial Accounts)" },
          { name: "Engr. Casenio A. Alombro", position: "Engineer II (Investigation & Inspection Section)" },
          { name: "Teresa J. Quinto", position: "Clerk II (Casual — Investigation & Inspection)" },
        ],
      },
      {
        unitName: "Barangay Financial Accounting Services Division",
        members: [
          { name: "Atty. Katherine R. Niere, CPA", position: "Accountant IV" },
          { name: "Gina A. Bionson", position: "Senior Bookkeeper (Barangay Financial Accounts)" },
          { name: "Dionesio Q. Alesna", position: "Senior Bookkeeper (Barangay Financial Accounts)" },
          { name: "Eduard Clam O. Madronero", position: "Administrative Aide IV / Clerk II" },
          { name: "Eunice Alegarbes", position: "Administrative Aide III (Casual)" },
          { name: "Nelda E. Achacoso", position: "Fiscal Examiner III (Barangay Subsidiary / Recap)" },
          { name: "Teresita T. Flores", position: "Fiscal Examiner III (Barangay Subsidiary / Recap)" },
          { name: "Roselle C. Alcontin", position: "Administrative Officer IV / Fiscal Examiner II" },
          { name: "Abul Hassan A. Paporo", position: "Bookkeeper I (Barangay Subsidiary / Recap)" },
        ],
      },
    ],
  },
  assessor: {
    sourceLabel: "City Government of Malaybalay — City Assessor's Office",
    sourceUrl: SAKATA_ASSESSOR_URL,
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          { name: "Atty. Mitchell D. Talatala", position: "City Assessor" },
          { name: "Maylyn T. Gantalao", position: "Assistant City Assessor" },
        ],
      },
      {
        unitName: "Appraisal & Assessment Services Division",
        members: [
          { name: "Cheryl R. Sabana", position: "Local Assessment Operations Officer III (Appraisal Section)" },
          { name: "Karl Mark P. Madrio", position: "Local Assessment Operations Officer I (Appraisal Section)" },
          { name: "Jeremy G. Garcia", position: "Assessment Clerk III (Appraisal Section)" },
          { name: "Mariechou B. Lino-ay", position: "Local Assessment Operations Officer III (Assessment Section)" },
          { name: "Mark Donnel V. Uayan", position: "Local Assessment Operations Officer I (Assessment Section)" },
          { name: "Almaco C. Carbajal", position: "Assessment Clerk III (Assessment Section)" },
          { name: "Fernandez G. Gantalao", position: "Administrative Assistant II (Assessment Section)" },
          { name: "Rodevie H. Valdez", position: "Records Officer III (Records Management Section)" },
          { name: "Annie L. Eltanal", position: "Records Officer I (Records Management Section)" },
          { name: "Carlita R. Libao", position: "Assessment Clerk III (Records Management Section)" },
        ],
      },
      {
        unitName: "Tax Mapping Operation Division",
        members: [
          { name: "Lynde C. Mercado", position: "Tax Mapper IV" },
          { name: "Amihan A. Castillo", position: "Draftsman III (Maintenance Section)" },
          { name: "Charie Mae Cabanelez", position: "Tax Mapping Aide (Maintenance Section)" },
          { name: "Alejandro L. Dinlayan", position: "Draftsman III (Field Operations Section)" },
        ],
      },
      {
        unitName: "Administrative Unit",
        members: [{ name: "Ray B. Gamao", position: "Machine Operator" }],
      },
    ],
  },
  gso: {
    sourceLabel: "City Government of Malaybalay — City General Services Office",
    sourceUrl: SAKATA_GSO_URL,
    groups: [
      {
        unitName: "Office Leadership",
        members: [{ name: "Dioscora R. Niere, CPA", position: "CGSO-Designate" }],
      },
      {
        unitName: "Records, Property and Inventory Division",
        members: [
          { name: "Sarah C. Cuaresma", position: "Records Officer IV" },
          { name: "Emmylou T. Zagado", position: "Records Officer III" },
          { name: "Rhivah R. See", position: "Records Officer II" },
        ],
      },
      {
        unitName: "Warehouse and Inspection Division",
        members: [
          { name: "Joel T. Opiala", position: "Supply Officer IV" },
          { name: "Giovanni M. Tulang", position: "Supply Officer III" },
          { name: "Axel S. Abejo", position: "Storekeeper III" },
          { name: "Genevieve B. Estrada", position: "Storekeeper I" },
        ],
      },
      {
        unitName: "Public Services, Custodial & Facility Care",
        members: [
          { name: "Margie S. Tabios", position: "Public Services Officer III" },
          { name: "Everlita S. Rubillos", position: "Computer Operator II (Administrative Support)" },
          { name: "Sunny A. Casinabe", position: "Driver II (Administrative Support)" },
          { name: "Anthony R. Ocaya", position: "Driver I (Administrative Support)" },
          { name: "Alex E. Tabuco", position: "Utility Foreman" },
          { name: "Ley Odysseus L. Palo", position: "Watchman" },
          { name: "Babyruth G. Reunido", position: "Utility Worker II" },
          { name: "Santiago L. Laping", position: "Utility Worker II" },
          { name: "Ken Irick M. Ambrad", position: "Utility Worker II" },
          { name: "Jonnalou T. Wong", position: "Utility Worker II" },
          { name: "Glady N. Gutierrez", position: "Utility Worker II" },
          { name: "Alejanro J. Dongel, Sr.", position: "Utility Worker I" },
          { name: "Jennifer S. Sanchez", position: "Utility Worker I" },
          { name: "Erlinda A. Gerado", position: "Utility Worker I" },
        ],
      },
    ],
  },
  cswdo: {
    sourceLabel: "City Government of Malaybalay — CSWDO Organizational Chart",
    sourceUrl: SAKATA_CSWDO_URL,
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          { name: "Ivy Amor C. Urbina", position: "City Social Welfare and Development Officer" },
        ],
      },
      {
        unitName: "Administrative Unit",
        members: [
          { name: "Estrella L. Sareno", position: "Administrative Officer III (Records Officer II)" },
          { name: "Jenelyn C. Genaro", position: "Administrative Assistant I (Computer Operator I)" },
          { name: "Claire Myra L. Costonera", position: "Administrative Aide III (Clerk I)" },
          { name: "Cesar I. Alsong", position: "Administrative Aide IV (Driver II)" },
          { name: "Gloria C. Agora", position: "Administrative Aide I (Utility Worker I)" },
        ],
      },
      {
        unitName: "Protective Services Division & Crisis Intervention",
        members: [
          { name: "Hilsam N. Quemada", position: "Social Welfare Officer IV (Division Head)" },
          { name: "Milfe R. Pandan", position: "Social Welfare Officer III (Crisis Intervention Section)" },
          { name: "Edeliza L. Almonia", position: "Social Welfare Officer II (Crisis Intervention Section)" },
          { name: "Kevin A. Taghoy", position: "Social Welfare Officer I (Crisis Intervention Section)" },
          { name: "Nympha Jane B. Ayco", position: "Social Welfare Aide (Crisis Intervention Section)" },
          { name: "Hazel Jane R. Ferrolino", position: "Social Welfare Aide (Crisis Intervention Section)" },
          { name: "Marose F. Bordaje", position: "Social Welfare Officer III (Women & Children Crisis Center)" },
        ],
      },
      {
        unitName: "Basic Social Services Division",
        members: [
          { name: "Lea B. Tado", position: "Social Welfare Officer IV (Division Head)" },
          { name: "Darling F. Saratorio", position: "Social Welfare Officer III (Women Welfare & Early Childhood)" },
          { name: "Aileen N. Capinpin", position: "Social Welfare Officer I (Women Welfare & Early Childhood)" },
          { name: "Jaysalyn B. Pumbo", position: "Day Care Worker II" },
          { name: "Nora Z. Dogomeo", position: "Day Care Worker I" },
          { name: "Elca P. Formoso", position: "Day Care Worker I" },
          { name: "Genia C. Francisco", position: "Youth Development Officer III (Child & Youth Welfare)" },
          { name: "Rodolfo G. Estaniel, Jr.", position: "Youth Development Officer II (Child & Youth Welfare)" },
        ],
      },
      {
        unitName: "Socio-Economic Services Division",
        members: [
          { name: "Arlene G. Sanchez", position: "Social Welfare Officer IV (Division Head)" },
          { name: "Reynaldo P. Valdez", position: "Project Development Officer III (Community Welfare & Livelihood)" },
          { name: "Bernard A. Francisco", position: "Project Development Officer II (Community Welfare & Livelihood)" },
          { name: "Joel N. Sinues", position: "Project Development Officer I (Community Welfare & Livelihood)" },
          { name: "Jan Zea T. Callao", position: "Community Development Assistant" },
          { name: "Emmanuel R. Tomada", position: "Social Welfare Officer III (Family Welfare & Special Groups)" },
          { name: "Kharen Lynn O. Pacturan", position: "Social Welfare Officer II (Family Welfare & Special Groups)" },
          { name: "Divina Rizza S. Pacudan", position: "Social Welfare Assistant" },
        ],
      },
    ],
  },
  bpld: {
    sourceLabel: "City Government of Malaybalay — Business Permit & Licensing Division",
    sourceUrl: SAKATA_BPLD_URL,
    groups: [
      {
        unitName: "Division Leadership",
        members: [
          { name: "Arnel S. Alagenio", position: "Executive Assistant V - Designate (Also OIC City Civil Registrar)" },
          { name: "Salvador U. Yacapin", position: "OIC / Licensing Officer IV (Also OIC City ENRO)" },
          { name: "Aimee Joy B. Binayao", position: "Administrative Aide IV (Clerk II)" },
        ],
      },
      {
        unitName: "Permits & Licensing Examiner & Assessment Section",
        members: [
          { name: "Merry Jean H. Marabe", position: "Licensing Officer III" },
          { name: "Laurence Duane R. Cudal", position: "Licensing Officer II" },
          { name: "Nova Sarah H. Serafin", position: "Licensing Officer I" },
        ],
      },
      {
        unitName: "Permits / Motorela Processing, Records & Communication Section",
        members: [{ name: "Marchette Shien E. Marabe", position: "Licensing Officer I" }],
      },
      {
        unitName: "Permits, Consumer Welfare & Inspection Section",
        members: [
          { name: "Karem Ann R. Cudal", position: "Licensing Officer II" },
          { name: "Al Y. Estrada", position: "Licensing Inspector II" },
        ],
      },
    ],
  },
  engineering: {
    sourceLabel: "City Government of Malaybalay — City Engineer's Office",
    sourceUrl: SAKATA_ENG_URL,
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          { name: "Leo Rustan L. Dela Cerna", position: "City Engineer" },
          { name: "Elpidio C. Sumanduran, Jr.", position: "Assistant City Engineer" },
        ],
      },
      {
        unitName: "Materials Quality Control and Monitoring Unit",
        members: [
          { name: "Engr. Virgo B. Jenisan", position: "Engineer IV" },
          { name: "Wilfredo G. Valdez", position: "Laboratory Technician I" },
        ],
      },
      {
        unitName: "Administrative Support Division",
        members: [
          { name: "Maricar M. Calunsag", position: "Administrative Officer III / Records Officer II" },
          { name: "Kevin O. Feliano", position: "Supply Officer I / Administrative Officer I" },
          { name: "Jennifer A. Pabutoy", position: "Administrative Assistant III (Storekeeper III)" },
          { name: "Ermelito G. Muzones", position: "Administrative Aide II / Messenger I" },
          { name: "Alex G. Pabillaran", position: "Administrative Aide III / Laborer II" },
          { name: "Darlito M. Yanguring", position: "Administrative Aide I / Laborer I" },
          { name: "Michael H. Calsis", position: "Administrative Aide I / Laborer I" },
        ],
      },
      {
        unitName: "Planning, Programming and Design Division",
        members: [
          { name: "Artemio C. Molina, Jr.", position: "Engineer IV (Division Head)" },
          { name: "Pearl Liezl C. Laurio", position: "Engineer III (Programming Section)" },
          { name: "Cherry Anne O. Eguaras", position: "Engineer II (Programming Section)" },
          { name: "Donah Lou V. Madrona", position: "Engineer II (Programming Section)" },
          { name: "Emelito R. Delos Reyes", position: "Engineer I (Programming Section)" },
          { name: "Marc Alaindee V. Ando", position: "Clerk IV / Administrative Assistant II" },
          { name: "Arlene B. Egama", position: "Architect II (Design & Architectural Section)" },
          { name: "Jedemie G. Aclo", position: "Draftsman III (Design & Architectural Section)" },
          { name: "Richard C. Bongocan", position: "Engineer III — Geodetic (RROW & Survey Section)" },
          { name: "Arnel B. Tilanduca", position: "Instrument Man (RROW & Survey Section)" },
          { name: "Marvin B. Timbal", position: "Engineering Aide (RROW & Survey Section)" },
        ],
      },
      {
        unitName: "Construction Division",
        members: [
          { name: "Larry H. Leono", position: "Engineer IV (Division Head)" },
          { name: "Virjhon C. Namoc", position: "Clerk III / Administrative Aide IV" },
          { name: "Jeonard C. Gamus", position: "Engineer III (Building Section)" },
          { name: "Philip Raymund A. Quijote", position: "Engineer II (Building Section)" },
          { name: "Kim Ian Michael M. Loyola", position: "Engineering Assistant (Building Section)" },
          { name: "Eduard A. Arellano", position: "Engineer III (Roads & Bridges Section)" },
          { name: "Edgardo P. Vargas", position: "Building Inspector (Roads & Bridges Section)" },
        ],
      },
      {
        unitName: "Maintenance Division",
        members: [
          { name: "Oliver P. Cahayag", position: "Engineer IV (Division Head)" },
          { name: "Carlitos F. Alesna", position: "Engineer III (Building Section)" },
          { name: "Kim Harvey R. Pabillaran", position: "Engineer II — Electrical (Electrical Section)" },
          { name: "Ruel S. Rebucas", position: "Construction & Maintenance General Foreman (Roads & Bridges)" },
          { name: "Alecita B. Olarte", position: "Draftsman II" },
          { name: "Reynante J. Calano", position: "Heavy Equipment Operator II" },
          { name: "Federico V. Duran", position: "Heavy Equipment Operator II" },
          { name: "Leo A. Gonzales", position: "Heavy Equipment Operator I" },
          { name: "Ken M. Bolotaolo", position: "Heavy Equipment Operator I" },
          { name: "Jerry T. Pesidas", position: "Heavy Equipment Operator I" },
          { name: "Paulino G. Caintoy", position: "Heavy Equipment Operator I" },
          { name: "Charles B. Alenton", position: "Heavy Equipment Operator I" },
          { name: "Hernando V. Zaportiza", position: "Heavy Equipment Operator I" },
          { name: "Gervacio A. Dayot", position: "Heavy Equipment Operator I" },
          { name: "Vivin B. Halasan", position: "Mechanic I" },
          { name: "Jesus M. Villegas", position: "Driver II / Administrative Aide IV" },
          { name: "Alejandro K. Naive", position: "Driver II / Administrative Aide IV" },
          { name: "Randy D. Manuel", position: "Carpenter II" },
          { name: "Gerry B. Inicial", position: "Carpenter II" },
          { name: "Cesar T. Prudente", position: "Electrician II" },
          { name: "Donald E. Ladera", position: "Electrician II" },
          { name: "Rolly T. Pulido", position: "Electrician I" },
          { name: "Rolando K. Lugao", position: "Administrative Aide III / Laborer II" },
          { name: "Ranilo D. Milosatos", position: "Administrative Aide III / Laborer II" },
          { name: "Rothald L. Ferras", position: "Laborer I" },
        ],
      },
      {
        unitName: "Motor Pool Division",
        members: [
          { name: "Roy A. Lapuz", position: "Engineer IV (Division Head)" },
          { name: "John Romil C. Jabonero", position: "Engineer III — Mechanical" },
          { name: "Eric G. Borreta", position: "Mechanic Shop Foreman" },
          { name: "Longino B. Perez", position: "Mechanic II" },
          { name: "Jerry V. Tan", position: "Mechanic II" },
          { name: "Armand A. Kiamco", position: "Assistant Equipment Inspector I" },
          { name: "Rogelio P. Salinay, Jr.", position: "Laborer I" },
          { name: "Fernando C. Taglinao, Jr.", position: "Administrative Aide / Laborer I" },
        ],
      },
      {
        unitName: "Motor Pool Division — Painting, Fabrication & Maintenance Section",
        members: [
          { name: "Norben C. Sarento", position: "Welder II" },
          { name: "Ernesto M. Borja, Jr.", position: "Electrician II (Automotive)" },
          { name: "Romeo R. Arengo", position: "Welder I" },
        ],
      },
    ],
  },
  agriculture: {
    sourceLabel: "City Government of Malaybalay — City Agriculture Office",
    sourceUrl: SAKATA_AGRI_URL,
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          { name: "Engr. Richard B. Leono", position: "City Agriculturist" },
          { name: "Engr. Lilianne A. Obre", position: "Assistant City Agriculturist" },
        ],
      },
      {
        unitName: "Planning, Monitoring and Evaluation Division",
        members: [
          { name: "Floredel F. Tinoy", position: "Project Development Section OIC / Agriculturist II" },
          { name: "Raiza Rose Michaela B. Enguio", position: "Aquaculturist II (Project Development)" },
          { name: "Phoebe Jane E. Leono", position: "Agricultural Technologist / GIS Mapper (Project Development, Charter 2026)" },
          { name: "Rajane R. Paurom", position: "Senior Agriculturist (Monitoring & Evaluation)" },
          { name: "Gecel Q. Ocon", position: "Agriculturist II (Monitoring & Evaluation)" },
          { name: "Trisha Margaret T. Bustos", position: "Agriculturist I (Monitoring & Evaluation)" },
          { name: "Melody E. Rodemio", position: "Administrative Aide IV" },
          { name: "Lovejoy B. Dacion", position: "Administrative Aide" },
          { name: "Chloe Jean B. Beronilla", position: "Administrative Aide" },
          { name: "Precella Mae A. Angking", position: "Administrative Aide" },
        ],
      },
      {
        unitName: "Field Operations, Institutional Development & Inland Fisheries",
        members: [
          { name: "Vic Ian T. Alcontin", position: "Supervising Agriculturist (Field Operations Division)" },
          { name: "Owen Hazel Q. Lagria", position: "Senior Agriculturist (Institutional Development)" },
          { name: "Chesa C. Bautista", position: "Agriculturist II (Institutional Development)" },
          { name: "Maridol F. Guinita", position: "Information System Analyst I" },
          { name: "Trilby G. Padura", position: "Administrative Assistant II / Clerk IV" },
          { name: "Venus G. Melendez", position: "Administrative Officer II" },
          { name: "Rhea Jean O. Rabago", position: "Administrative Officer" },
          { name: "Ellen Cecilia T. Mamawag", position: "Administrative Aide" },
          { name: "Maribeth Z. Orleans", position: "Administrative Aide" },
          { name: "Florencio P. Macabugto", position: "Senior Aquaculturist (Inland Fisheries)" },
          { name: "Ma. Jorgen P. Soriano", position: "Aquaculturist II (Inland Fisheries)" },
          { name: "Rachelle O. Quidlat", position: "Aquaculturist II (Inland Fisheries)" },
          { name: "Marvin L. Zamora", position: "Administrative Aide IV (Inland Fisheries)" },
          { name: "Jenelyn O. Sayson", position: "Administrative Aide (Inland Fisheries)" },
        ],
      },
      {
        unitName: "Integrated Agricultural Laboratories & Production Facilities",
        members: [
          { name: "Jennifer C. Atay", position: "Senior Agriculturist (Integrated Agricultural Laboratories)" },
          { name: "Aileen T. Espartero", position: "Agriculturist II (City Soil Testing Laboratory)" },
          { name: "Joralyn C. Martir", position: "Administrative Aide (Soil Testing Lab)" },
          { name: "Sarah F. Tinaja", position: "Plant Tissue Culture Lab In-Charge / Admin Assistant II" },
          { name: "Evelyn B. Del Rosario", position: "Administrative Aide IV (PTCL)" },
          { name: "Jessica Conie M. Gabut", position: "Administrative Aide (PTCL)" },
          { name: "May Ann Joy D. Yecyec", position: "Administrative Aide (PTCL)" },
          { name: "John Michael S. Binayao", position: "Administrative Aide (PTCL)" },
          { name: "Jhun Ryan V. Patoc", position: "Administrative Aide (PTCL)" },
          { name: "Isadora O. Estrosos", position: "Bio-N In-Charge / Admin Aide IV (Bio-Mixing Plant)" },
          { name: "Miralyn Batico", position: "Administrative Aide (Bio-Mixing Plant)" },
          { name: "Florame H. Amto", position: "Administrative Aide (Bio-Mixing Plant)" },
          { name: "Tisha L. Saldua", position: "Administrative Aide (Concoction Production Facility)" },
          { name: "Ma. Alita D. Dag-um", position: "Administrative Aide (Concoction Production Facility)" },
        ],
      },
      {
        unitName: "Crops Section & Rice Team",
        members: [
          { name: "Elizabeth J. Jurolan", position: "Senior Agriculturist (Crops Section)" },
          { name: "Emegen L. Disalan", position: "Crops OIC / Agriculturist II" },
          { name: "Ma. Christie P. Ronquillo", position: "Agriculturist II (Rice Team)" },
          { name: "Sherwin E. Blanco", position: "Agriculturist II (Rice Team)" },
          { name: "Cresencia A. Taguic", position: "Agriculturist II (Rice Team)" },
          { name: "Ronilo C. Inocencio", position: "Agriculturist II (Rice Team)" },
          { name: "Orlando John M. Paulican", position: "Agriculturist II (Rice Team)" },
          { name: "Roiland J. Leono", position: "Agriculturist II (Rice Team)" },
          { name: "Henry D. Alimpipinig", position: "Administrative Assistant II (Rice Team)" },
          { name: "Donna Mae P. Casaclang", position: "Agriculturist I (Rice Team)" },
        ],
      },
      {
        unitName: "HVCDP Team (High-Value Crops Development Program)",
        members: [
          { name: "Joan Marie A. Diola", position: "Agriculturist II" },
          { name: "Jeramil M. Simborio", position: "Agriculturist II" },
          { name: "Ivy M. Suclatan", position: "Agriculturist II" },
          { name: "Marianne Y. Melendez", position: "Administrative Assistant II" },
          { name: "Merian G. Ybañez", position: "Agriculturist I" },
          { name: "Rechie J. Ellevera", position: "Agriculturist I" },
          { name: "Jenalyn C. Avergozado", position: "Administrative Aide" },
          { name: "Vilma L. Guyo", position: "Administrative Aide" },
          { name: "Maria Christy Joy D. Sumbongan", position: "Administrative Aide" },
        ],
      },
      {
        unitName: "Organic Agriculture Team",
        members: [
          { name: "France Guiller R. Buquiran", position: "Agriculturist I" },
          { name: "Niño Jan M. Pabillaran", position: "Administrative Assistant II" },
          { name: "Jerry O. Deligero", position: "Administrative Aide" },
          { name: "Darylene R. Tuala", position: "Administrative Aide" },
        ],
      },
      {
        unitName: "Corn Team",
        members: [
          { name: "Myra S. Abejuela", position: "Agriculturist II" },
          { name: "Lucell P. Carpentero", position: "Agriculturist II" },
          { name: "Regiema A. Manaay", position: "Agriculturist II" },
          { name: "Lord C'zar E. Emata", position: "Administrative Aide I / Utility Worker I" },
          { name: "Sushmita L. Panangin", position: "Agriculturist I" },
          { name: "Florante M. Tangara", position: "Agriculturist I" },
          { name: "Mark John T. Pocong", position: "Agriculturist I" },
        ],
      },
      {
        unitName: "City Nursery & Warehouse Unit",
        members: [
          { name: "Erwin T. Cacay", position: "Farm Worker II (City Nursery)" },
          { name: "Denacio M. Yatab", position: "Administrative Aide IV (City Nursery)" },
          { name: "Frank Juris P. Rara", position: "Administrative Aide IV (City Nursery)" },
          { name: "Bryan G. Dihayco", position: "Administrative Aide (City Nursery)" },
          { name: "Elizabeth G. Bacus", position: "Administrative Aide (City Nursery)" },
          { name: "Manuel C. Gilot", position: "Administrative Aide (City Nursery)" },
          { name: "Giovannie S. Rojo", position: "Administrative Aide (City Nursery)" },
          { name: "Romeo T. Beltran, Jr.", position: "Administrative Aide (City Nursery)" },
          { name: "Elma D. Abutanmo", position: "Administrative Aide (City Nursery)" },
          { name: "Leonidas S. Ginoo", position: "Administrative Aide (City Nursery)" },
          { name: "John Lloyd L. Cuerquiz", position: "Administrative Aide (City Nursery)" },
          { name: "Elona Jane L. Odino", position: "Administrative Aide (City Nursery)" },
          { name: "Cherry Q. Sison", position: "Administrative Aide (City Nursery)" },
          { name: "Helen C. Catalla", position: "Administrative Aide (City Nursery)" },
          { name: "Jujit Q. Tagailo", position: "Farm Worker II (Warehouse In-Charge)" },
        ],
      },
      {
        unitName: "Administrative Support Services Section",
        members: [
          { name: "Jean L. Llesis", position: "Administrative Officer I" },
          { name: "Velyn O. Tanzo", position: "Farm Worker II" },
          { name: "Ulyses D. Pagaduan", position: "Administrative Aide IV / Driver II" },
          { name: "Danilo C. Lerado", position: "Administrative Aide IV / Driver II" },
          { name: "John T. David", position: "Administrative Aide" },
          { name: "Thomas Sheene E. Cejas", position: "Administrative Aide" },
          { name: "Aiza Sumaria", position: "Administrative Aide" },
          { name: "Kristine Grace Lantaca", position: "Administrative Aide" },
          { name: "Marivic S. Dio", position: "Administrative Aide" },
          { name: "Dennis R. Nocum", position: "Administrative Aide" },
          { name: "Loel P. Lagrada", position: "Administrative Aide" },
          { name: "Roy R. Balangayao", position: "Administrative Aide" },
        ],
      },
    ],
  },
  ceedmo: {
    sourceLabel: "City Government of Malaybalay — CEEDMO Organizational Chart",
    sourceUrl: SAKATA_CEEDMO_URL,
    groups: [
      {
        unitName: "Office Leadership & MCGWSS Waterworks",
        members: [
          { name: "Romeo R. Lapeciros, Jr.", position: "CEEDMO-Designate" },
          { name: "Engr. Stephen D. Caroro", position: "Waterworks Superintendent I (MCGWSS)" },
          { name: "Florante L. Bergado", position: "Waterworks Supervisor (MCGWSS)" },
          { name: "Engr. Julius C. Nuñez", position: "Engineer I (MCGWSS)" },
        ],
      },
      {
        unitName: "Revenue Collection & Billing Division",
        members: [
          { name: "Magnolia P. Callao", position: "Local Revenue Collection Officer IV" },
          { name: "Maylyn Z. Armecin", position: "Administrative Officer III (Program & Project Devt)" },
          { name: "Judith C. Aguilar", position: "Administrative Officer III (Records & Billing)" },
          { name: "Cristal B. Callanta", position: "Administrative Assistant II (Records & Billing)" },
          { name: "Mary Eve B. Asares", position: "Local Revenue Collection Officer III" },
          { name: "Ma. Dolor Liza G. Estillore", position: "Local Revenue Collection Officer II" },
          { name: "Perlito T. Caterial", position: "Revenue Collection Clerk III" },
          { name: "Sally C. Caterial", position: "Revenue Collection Clerk III" },
          { name: "Aslema P. Ebra", position: "Revenue Collection Clerk I" },
          { name: "Haydee S. Daguplo", position: "Revenue Collection Clerk I" },
        ],
      },
      {
        unitName: "Enterprise Management — Public Market, Terminal & Memorial Park",
        members: [
          { name: "Lennith E. Remo", position: "Market Supervisor IV (Enterprise Management Division)" },
          { name: "Christopher L. Timones", position: "Market Supervisor III (Public Market)" },
          { name: "Michael H. Sumaylo", position: "Market Supervisor II (Public Market)" },
          { name: "Darius L. Mondia", position: "Market Supervisor I (Public Market)" },
          { name: "Jessie D. Reciña", position: "Senior Transportation Regulation Officer (Terminal)" },
          { name: "Christopher B. Agot", position: "Transportation Regulation Officer I (Terminal)" },
          { name: "Mary Jane L. Ranque", position: "Cemetery Caretaker (City Memorial Park)" },
          { name: "Roel T. Bautista", position: "Administrative Aide III (City Memorial Park)" },
          { name: "Rufino A. Cuizon", position: "Administrative Aide I (Market)" },
          { name: "Robert L. Suson", position: "Administrative Aide I (Market)" },
          { name: "Macacuna P. Naga", position: "Administrative Aide I (Market)" },
          { name: "Romeo L. Yecyec", position: "Administrative Aide I (Market)" },
          { name: "Estrella P. Paje", position: "Administrative Aide I (Market)" },
          { name: "Junever Godinez", position: "Administrative Aide I (Market)" },
          { name: "Denny R. Encabo", position: "Administrative Aide III (Terminal)" },
          { name: "Vergilinda L. Melendez", position: "Administrative Aide III (Terminal)" },
          { name: "Ansan Rey P. Diamla", position: "Administrative Aide III (Terminal)" },
          { name: "Rebecca V. Belderol", position: "Administrative Aide III (Terminal)" },
        ],
      },
      {
        unitName: "Slaughterhouse & Administrative Support Section",
        members: [
          { name: "Meshelle A. Catabas", position: "Slaughterhouse Master II" },
          { name: "Rosalie R. Lapeciros", position: "Administrative Aide III (Utility Worker II)" },
          { name: "Benedicto T. Malinao, Jr.", position: "Administrative Aide III (Driver II)" },
          { name: "Randy P. Jamago", position: "Administrative Officer IV (Records Officer II — Admin Support)" },
        ],
      },
    ],
  },
  "community-affairs": {
    sourceLabel: "2026 Citizen's Charter (CMO — Community Affairs Division, pp. 512–529) & GAD Corner",
    sourceUrl: CHARTER_2026_URL,
    unitNotes:
      "Operates under the Office of the City Mayor across the Administrative Support Unit, Community Relations & Barangay Affairs Section, City Scholarship Section, and Civil Society Organization (CSO) Accreditation Desk.",
    additionalSources: [
      { label: "GAD Focal Point System (EO No. 12) — sakata.malaybalaycity.gov.ph", url: SAKATA_GAD_URL },
    ],
    groups: [
      {
        unitName: "Division Leadership & Supervision",
        members: [
          { name: "Venus G. Palalay", position: "Community Affairs Officer IV (Division Head / GFPS TWG)" },
          { name: "Hon. Jay Warren R. Pabillaran", position: "City Mayor (Executive Approval Authority)" },
        ],
      },
    ],
  },
  osca: {
    sourceLabel: "2026 Citizen's Charter (CMO — OSCA, pp. 547–552) & PIA Region 10 Dispatch",
    sourceUrl: CHARTER_2026_URL,
    unitNotes:
      "Attached to the Office of the City Mayor under RA 9994 (Expanded Senior Citizens Act), coordinating ID issuance, purchase booklets, transfers, and the National Commission of Senior Citizens Community Care Center.",
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          { name: "Rene Cipriano", position: "Head / Coordinator, Office of the Senior Citizens Affairs" },
          { name: "Hon. Jay Warren R. Pabillaran", position: "City Mayor (Supervising Authority)" },
        ],
      },
    ],
  },
  treasurer: {
    sourceLabel: "CY 2026 Q2 Statement of Receipts & Expenditures and CY 2026 APP Summary",
    sourceUrl: FULL_DISC_RECEIPTS_2026_URL,
    unitNotes:
      "Structured under the 2026 Citizen's Charter (pp. 636–655) into the Revenue Generation Division (Collection Windows 1–12), Cash Division (Accountable Forms & Disbursement Sections), and Administrative Division (Records Section).",
    additionalSources: [
      { label: "CY 2026 Annual Procurement Plan Summary", url: APP_2026_URL },
      { label: "2026 Citizen's Charter (City Treasurer's Office, pp. 636–655)", url: CHARTER_2026_URL },
    ],
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          { name: "Bella Stephanie B. Saavedra, CPA", position: "City Treasurer (Department Head)" },
        ],
      },
    ],
  },
  ccro: {
    sourceLabel: "CY 2026 Annual Procurement Plan Summary & 2026 Citizen's Charter (pp. 169–231)",
    sourceUrl: APP_2026_URL,
    unitNotes:
      "Divisions verified in the 2026 Citizen's Charter and CS Form No. 9 include the Registration Division (Birth, Marriage & Death Registration Sections) and the Records Division (Research Section and RA 9048 / RA 10172 Petition Clerks), staffed by Registration Officers III/IV and Records Officers III/IV.",
    additionalSources: [
      { label: "2026 Citizen's Charter (CCRO Chapter, pp. 169–231)", url: CHARTER_2026_URL },
    ],
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          {
            name: "Arnel S. Alagenio",
            position: "Department Head / OIC City Civil Registrar (Concurrent Executive Assistant V-Designate at BPLD)",
          },
        ],
      },
    ],
  },
  cho: {
    sourceLabel: "2026 Citizen's Charter (CHO, pp. 335–387), CY 2026 APP Summary & BAC Structure",
    sourceUrl: CHARTER_2026_URL,
    unitNotes:
      "Includes Main City Health Office clinics (Communicable & Non-Communicable Disease Divisions, Animal Bite Treatment Center, NTP, Pharmacy, Laboratory, Radiology, Dental, and Family Health Cluster) alongside CHO-Nutrition, Upper Pulangui Lying-In Clinic (Mapulo), and the POPDEV Section under City Health Officer supervision.",
    additionalSources: [
      { label: "CY 2026 Annual Procurement Plan Summary", url: APP_2026_URL },
      { label: "Bids and Awards Committee Structure", url: SAKATA_BAC_URL },
    ],
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          { name: "Dr. Dennis P. Sangalang, MD", position: "City Health Officer II (CHO Main, CHO-Nutrition, CHO-Mapulo & CHO-POPDEV)" },
        ],
      },
      {
        unitName: "Verified Clinical, Mental Health & Pharmacy Personnel (2026 Charter)",
        members: [
          { name: "Dr. Ann Michelle Go", position: "City Health Pharmacist (Pharmacy & Mental Health Medication Dispensing)" },
          { name: "Frances Charmaine A. Lazalita, RN", position: "Nurse, Non-Communicable Disease Division" },
          { name: "Kesie Joy S. Inatalio, RN", position: "Nurse, Non-Communicable Disease Division" },
          { name: "Shelleme O. Macatol", position: "Mental Health GAP Assessment & Intervention Staff" },
          { name: "Gazel A. Dela Cruz", position: "Mental Health GAP Assessment & Intervention Staff" },
        ],
      },
    ],
  },
  drrmo: {
    sourceLabel: "2026 Citizen's Charter (CDRRMO, pp. 232–243) & CY 2026 APP Summary",
    sourceUrl: CHARTER_2026_URL,
    unitNotes:
      "Operates across the Administrative Support Section, Research & Planning Division, Training & Logistics Division, and the 24/7 Operations & Warnings Division (EMS & SAR, 911 Emergency Call Center, and CCTV Command Center).",
    additionalSources: [
      { label: "CY 2026 Annual Procurement Plan Summary", url: APP_2026_URL },
    ],
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          { name: "Alan J. Comiso", position: "City Government Department Head I (CDRRMO Head)" },
        ],
      },
      {
        unitName: "Administrative & Logistics Support",
        members: [
          { name: "Ana Andrea A. Ho", position: "Administrative Officer IV (Administrative Support Section)" },
          { name: "Nida V. Quitor", position: "Administrative Officer I (Logistics Division)" },
          { name: "Florence D. De Asis", position: "Administrative Aide (Administrative & Logistics Desk)" },
        ],
      },
      {
        unitName: "Research, Planning, Training & Operations Sections",
        members: [
          { name: "Sony Dabe R. Belderol", position: "LDRRM Officer IV (Research & Planning Division)" },
          { name: "Kenneth Amiel M. Taylor", position: "Section Head, Training & Logistics Division" },
          { name: "Michele Sales", position: "Section Head, CCTV Command Center (CCC / Operations & Warnings)" },
        ],
      },
    ],
  },
  obo: {
    sourceLabel: "2026 Citizen's Charter (Office of the Building Official, pp. 656–691) & CY 2026 APP Summary",
    sourceUrl: CHARTER_2026_URL,
    additionalSources: [
      { label: "CY 2026 Annual Procurement Plan Summary", url: APP_2026_URL },
    ],
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          { name: "Engr. Runstadt P. Peria", position: "City Engineer IV / Acting Building Official" },
          { name: "Juliet D. Doroja", position: "Officer-in-Charge / Processing, Line & Grade & Receiving Unit" },
        ],
      },
      {
        unitName: "Technical Plan Evaluators & Inspectors",
        members: [
          { name: "Anita O. Tagaan", position: "Architectural Plan Evaluator & Assessment Processing Officer" },
          { name: "Ed Glenn R. Okit", position: "Civil/Structural, Electronics, Sanitary/Plumbing & Mechanical Evaluator" },
          { name: "Bobby M. Lopez", position: "Electrical Plan Evaluator & Site Inspector" },
          { name: "Bengie M. Wahing", position: "Receiving Staff & Technical Site Verifier" },
          { name: "Raul A. Edquilang", position: "Field Inspector / Technical Evaluation Officer" },
        ],
      },
    ],
  },
  cenro: {
    sourceLabel: "CY 2026 Annual Procurement Plan Summary & 2026 Citizen's Charter (pp. 263–273)",
    sourceUrl: APP_2026_URL,
    unitNotes:
      "Implements Solid Waste Management, Environmental Certification, Urban Forestry, Seedling Production, and Forest Product Transport inspection under the City Environment and Natural Resources Office.",
    additionalSources: [
      { label: "2026 Citizen's Charter (CENRO Chapter, pp. 263–273)", url: CHARTER_2026_URL },
    ],
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          {
            name: "Salvador U. Yacapin",
            position: "Department Head / OIC City ENRO (Concurrent Licensing Officer IV at BPLD)",
          },
        ],
      },
    ],
  },
  veterinary: {
    sourceLabel: "CY 2026 Annual Procurement Plan Summary & Sakata BAC Structure",
    sourceUrl: APP_2026_URL,
    unitNotes:
      "Divisions documented in the 2026 Citizen's Charter (pp. 439–462) and CS Form No. 9 include Animal Health and Production Division, Livestock Animal Production Division, and Meat Inspection Service Division (Ante-Mortem & Post-Mortem Sections).",
    additionalSources: [
      { label: "Bids and Awards Committee Structure — sakata.malaybalaycity.gov.ph", url: SAKATA_BAC_URL },
      { label: "2026 Citizen's Charter (City Veterinary Office, pp. 439–462)", url: CHARTER_2026_URL },
    ],
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          { name: "Dr. Michele C. Miquiabas, DVM", position: "City Veterinarian (Department Head / BAC Alternate Member)" },
        ],
      },
      {
        unitName: "Verified Livestock & Technical Personnel (2026 Charter)",
        members: [
          { name: "Alexis I. Flores II", position: "Livestock Technician / Swine Artificial Insemination (0927-703-8993)" },
        ],
      },
    ],
  },
  tourism: {
    sourceLabel: "2026 Citizen's Charter (City Tourism Division, pp. 569–578) & Official City Dispatches",
    sourceUrl: CHARTER_2026_URL,
    unitNotes:
      "Organized under the City Mayor's Office into the Tourism Planning Section (Accreditation & DOT Certification Desk) and the Tourism Promotions Section (Visitor Assistance & Kaamulan Cultural Promotions).",
    groups: [
      {
        unitName: "Division Leadership & Key Officers",
        members: [
          { name: "Marven Jan Nadela", position: "City Tourism Officer (Division Head)" },
          { name: "Honolu Marie C. Cruzin", position: "Supervising Tourism Operations Officer" },
        ],
      },
    ],
  },
  cudho: {
    sourceLabel: "2026 Citizen's Charter (CUDHO / CUDHD, pp. 579–583) & NHA–LGU IP Housing Dispatches",
    sourceUrl: CHARTER_2026_URL,
    unitNotes:
      "Administers socialized housing estates, resettlement of hazard-vulnerable and calamity-displaced households, and community beneficiary screening under the Office of the City Mayor.",
    groups: [
      {
        unitName: "Division Leadership",
        members: [
          { name: "EnP. Perfecto Ray D. Bayo, Jr.", position: "Division Head, City Urban Development & Housing" },
          { name: "Hon. Jay Warren R. Pabillaran", position: "City Mayor / Chairperson, City Housing & Resettlement Committee" },
        ],
      },
    ],
  },
  tmc: {
    sourceLabel: "2026 Citizen's Charter (CMO — Traffic Management Center, pp. 553–568)",
    sourceUrl: CHARTER_2026_URL,
    unitNotes:
      "Enforces City Ordinance No. 900 s. 2019 across field traffic enforcers, motorela inspection/clearance units, towing & road-crash response teams, and administrative citation processing desks.",
    groups: [
      {
        unitName: "Center Leadership",
        members: [
          { name: "Joseph G. Jabla", position: "Traffic Operations Officer / Head, Traffic Management Center" },
          { name: "Hon. Jay Warren R. Pabillaran", position: "City Mayor (Supervising Authority)" },
        ],
      },
    ],
  },
  bac: {
    sourceLabel: "City Government of Malaybalay — Bids and Awards Committee Structure",
    sourceUrl: SAKATA_BAC_URL,
    additionalSources: [
      { label: "CY 2026 Annual Procurement Plan & FDP 10 Bid Results", url: APP_2026_URL },
    ],
    groups: [
      {
        unitName: "Head of the Procuring Entity & BAC Chairpersons",
        members: [
          { name: "Hon. Jay Warren R. Pabillaran", position: "Head of the Procuring Entity (HoPE)" },
          { name: "Dr. Dennis P. Sangalang, MD", position: "City Health Officer II / BAC Chairperson" },
          { name: "Atty. Mitchell D. Talatala", position: "Executive Assistant IV / BAC Chairperson" },
          { name: "Atty. Anna Marie R. Bergado", position: "City Administrator / BAC Vice-Chairperson" },
        ],
      },
      {
        unitName: "BAC Regular Members",
        members: [
          { name: "Ronny B. Gamao", position: "City Budget Officer / Regular Member" },
          { name: "Engr. Leo Rustan L. Dela Cerna", position: "City Engineer / Regular Member" },
        ],
      },
      {
        unitName: "BAC Alternate Members",
        members: [
          { name: "Engr. Runstadt P. Peria", position: "City Engineer IV / Alternate Member" },
          { name: "Dr. Michele C. Miquiabas, DVM", position: "City Veterinarian / Alternate Member" },
        ],
      },
      {
        unitName: "BAC Technical Working Group (TWG)",
        members: [
          { name: "Engr. Adrian R. Gamboa", position: "City Planning & Development Coordinator / TWG Head" },
          { name: "Atty. Alfredo G. Cape Jr.", position: "Assistant City Legal Officer / TWG Member" },
          { name: "Engr. Larry H. Leono", position: "City Engineer IV / TWG Member" },
        ],
      },
      {
        unitName: "BAC Secretariat",
        members: [
          { name: "Atty. Julius Michael G. Barroso", position: "City Legal Officer / BAC Secretariat Head" },
        ],
      },
    ],
  },
  dilg: {
    sourceLabel: "CY 2026 Annual Procurement Plan Summary & GAD Corner EO No. 12",
    sourceUrl: APP_2026_URL,
    additionalSources: [
      { label: "GAD Focal Point System (EO No. 12) — sakata.malaybalaycity.gov.ph", url: SAKATA_GAD_URL },
    ],
    groups: [
      {
        unitName: "Field Operations Leadership",
        members: [
          { name: "Amalia A. Propia", position: "City Local Government Operations Officer (CLGOO — DILG Malaybalay)" },
        ],
      },
    ],
  },
  bfp: {
    sourceLabel: "CY 2026 Annual Procurement Plan Summary & 2026 Citizen's Charter (p. 678)",
    sourceUrl: APP_2026_URL,
    additionalSources: [
      { label: "2026 Citizen's Charter — BFP Fire Safety Evaluation Liaison (p. 678)", url: CHARTER_2026_URL },
    ],
    groups: [
      {
        unitName: "Station Leadership & Fire Safety Enforcement",
        members: [
          { name: "Ma. Anjelyn P. Pornia", position: "Station Head / Fire Marshal, BFP Malaybalay (CY 2026 APP)" },
          { name: "FO1 Kareen Lou T. Aranas", position: "Fire Safety Evaluator / OBO Clearance Liaison" },
        ],
      },
    ],
  },
  police: {
    sourceLabel: "CY 2026 Annual Procurement Plan Summary & Late-2026 Command Dispatches",
    sourceUrl: APP_2026_URL,
    groups: [
      {
        unitName: "Station Command",
        members: [
          { name: "PLtCol. Ariel Philip I. Pontillas", position: "Officer-in-Charge, Malaybalay City Police Station (Command Dispatch)" },
          { name: "PLtCol. Joepet Baldonado Paglinawan", position: "Chief of Police, Malaybalay City Police Station (CY 2026 APP)" },
        ],
      },
    ],
  },
  "mtcc-branch-2": {
    sourceLabel: "Supreme Court Judiciary Directory & CY 2026 Annual Procurement Plan Summary",
    sourceUrl: APP_2026_URL,
    groups: [
      {
        unitName: "Judicial Leadership",
        members: [
          { name: "Hon. Edmundo V. Raagas", position: "Presiding Judge, Municipal Trial Court in Cities (MTCC) — Malaybalay" },
        ],
      },
    ],
  },
  "deped-division": {
    sourceLabel: "DepEd Schools Division of Malaybalay City — Division Memoranda Nos. 488, 495 & 496 (Nov 2026)",
    sourceUrl: DEPED_MEMO_2026_URL,
    groups: [
      {
        unitName: "Division Leadership",
        members: [
          { name: "Dr. Cherry Mae L. Limbaco-Reyes, CESO V", position: "Schools Division Superintendent" },
        ],
      },
      {
        unitName: "Verified Division Units & Key Program Personnel (Nov 2026 Memoranda)",
        members: [
          { name: "Marsfifth M. Mamawag", position: "Senior Education Program Specialist (SocMob) / Secretariat Chair" },
          { name: "Woodrow Wilson B. Merida", position: "Senior Education Program Specialist (HRD) / MANCOM Chair" },
          { name: "Janryl Louis L. Okit", position: "Education Program Supervisor (IPEd — CID)" },
          { name: "Engr. Leslie T. Fontanilla", position: "Division Engineer (SGOD)" },
          { name: "Dr. Sarline O. Flores", position: "Medical Officer / School Health Responder Lead" },
          { name: "Paul John Arias", position: "Division Technical / ICT Lead (MANCOM)" },
        ],
      },
    ],
  },
  prosecutor: {
    sourceLabel: "DOJ National Prosecution Service Directory & CY 2026 Annual Procurement Plan Summary",
    sourceUrl: APP_2026_URL,
    unitNotes:
      "National prosecution office serving Malaybalay City from the Hall of Justice, Capitol Compound, supported by the City Government under the CY 2026 Annual Procurement Plan (₱385,000 local support allocation).",
    groups: [
      {
        unitName: "Office Leadership",
        members: [
          {
            name: "Pros. Claver C. Ariño",
            position: "City Prosecutor, DOJ National Prosecution Service (listed as Claver C. Aniño in CY 2026 APP Summary)",
          },
        ],
      },
    ],
  },
  coa: {
    sourceLabel: "CY 2026 Annual Procurement Plan Summary & COA Region X Directory",
    sourceUrl: APP_2026_URL,
    unitNotes:
      "Resident audit team assigned under the Commission on Audit (COA) Regional Office No. X Local Government Audit Sector (LGAS — Bukidnon), receiving LGU logistical support under the CY 2026 APP (₱1,338,624 allocation).",
    groups: [
      {
        unitName: "Audit Team Leadership",
        members: [
          { name: "Ricster P. Jabien", position: "Audit Team Leader, COA Malaybalay City (CY 2026 APP)" },
        ],
      },
    ],
  },
  bjmp: {
    sourceLabel: "CY 2026 Annual Procurement Plan Summary & BJMP Regional Records",
    sourceUrl: APP_2026_URL,
    unitNotes:
      "Administers custodial management and PDL welfare/reformation programs at Malaybalay City District Jail (Brgy. Patpat), receiving local LGU support across BJMP-Main (₱1,233,000) and BJMP-Reformatory Center (₱800,944) in the CY 2026 APP.",
    groups: [
      {
        unitName: "Facility Command & Reformatory Center",
        members: [
          { name: "JInsp. Murphy B. Todyog", position: "Jail Officer / Unit Head — BJMP-Main (CY 2026 APP)" },
          { name: "JCInsp. Haidee G. Macandili", position: "Jail Warden / Head — BJMP-Reformatory Center (CY 2026 APP)" },
        ],
      },
    ],
  },
  "parole-probation": {
    sourceLabel: "DOJ Parole and Probation Administration Directory & CY 2026 Annual Procurement Plan Summary",
    sourceUrl: APP_2026_URL,
    unitNotes:
      "Field office under the DOJ Parole and Probation Administration operating from the Hall of Justice, Capitol Compound (covering Malaybalay City, Lantapan, Impasug-ong, Sumilao, and Cabanglasan), receiving ₱571,230 local support in the CY 2026 APP.",
    groups: [
      {
        unitName: "Field Office Leadership",
        members: [
          { name: "Dennah E. Vivares", position: "Chief Probation and Parole Officer (CY 2026 APP Summary)" },
        ],
      },
    ],
  },
};
