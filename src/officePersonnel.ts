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

const councilMembers: OfficePersonnelMember[] = officials
  .filter((item) => item.group === "Legislative" || item.group === "Sectoral")
  .map((item) => ({ name: item.name, position: item.role }));

export const officePersonnelBySlug: Record<string, OfficePersonnelDirectoryEntry> = {
  mayor: {
    sourceLabel: "City Government of Malaybalay — Mayor's Corner & Official Directory",
    sourceUrl: "https://sakata.malaybalaycity.gov.ph/mayors-corner/",
    groups: [
      {
        unitName: "Local Chief Executive",
        members: [{ name: "Hon. Jay Warren R. Pabillaran", position: "City Mayor" }],
      },
    ],
  },
  "vice-mayor": {
    sourceLabel: "City Government of Malaybalay — Legislative & SP Office Directory",
    sourceUrl: "https://sakata.malaybalaycity.gov.ph/legislative/",
    groups: [
      {
        unitName: "Presiding Officer",
        members: [{ name: "Hon. Estelito \"Litoy\" R. Marabe", position: "City Vice Mayor" }],
      },
    ],
  },
  peso: {
    sourceLabel: "DOLE Region 10 Dispatches & City Administrator's Office Directory",
    sourceUrl: "https://sakata.malaybalaycity.gov.ph/city-administrators-office/",
    groups: [
      {
        unitName: "PESO Management",
        members: [
          { name: "Atty. Anna Marie R. Bergado", position: "PESO Manager / City Administrator" },
        ],
      },
    ],
  },
  chrmo: {
    sourceLabel: "LGU Malaybalay CS Form No. 9 Publication (4th Tranche)",
    sourceUrl: "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2025/04/CS-Form-No-9-Publication-2024-4th-Tranche-1-1.pdf",
    groups: [
      {
        unitName: "Department Head",
        members: [
          { name: "Magnolia O. Improgo", position: "City Government Department Head I (City HRMO)" },
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
        unitName: "Information Campaign, Facility Care & Administrative Support",
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
          { name: "Arnel S. Alagenio", position: "Executive Assistant V - Designate" },
          { name: "Salvador U. Yacapin", position: "OIC / Licensing Officer IV" },
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
          { name: "Virgo B. Jenisan", position: "Engineer IV" },
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
};
