import type { DocumentGuide } from "./civicDirectories";

export type ChecklistRequirementItem = {
  id: string;
  english: string;
  bisaya: string;
};

export type ChecklistSection = {
  title: string;
  titleBisaya?: string;
  items: ChecklistRequirementItem[];
};

type SectionCategory =
  | "Identity & Authorization"
  | "Application Forms & Letters"
  | "Clearances & Certificates"
  | "Property, Tax & Technical Records"
  | "Supporting & Financial Records";

const SECTION_BISAYA_MAP: Record<SectionCategory, string> = {
  "Identity & Authorization": "Ilhanan ug Pagtugot",
  "Application Forms & Letters": "Mga Porma ug Sulat-Hangyo",
  "Clearances & Certificates": "Mga Clearance ug Sertipiko",
  "Property, Tax & Technical Records": "Mga Rekord sa Kabtangan, Buhis ug Teknikal",
  "Supporting & Financial Records": "Ubang Gikinahanglan ug Pinansyal nga Dokumento",
};

/**
 * Curated English-to-Cebuano/Bisaya translations for all public-service, office,
 * PESO, barangay, and school documentary checklist items across BetterMC.
 */
export const REQUIREMENT_BISAYA_MAP: Record<string, string> = {
  // Business & Trade
  "DTI Business Name Certificate (Sole Proprietorship) or SEC/CDA Registration":
    "DTI Business Name Certificate (kon sole proprietorship) o rehistro sa SEC/CDA.",
  "Barangay Business Clearance from the barangay where the business is located":
    "Barangay Business Clearance gikan sa barangay diin nahimutang ang negosyo.",
  "Contract of Lease (if rented) or Tax Declaration / Land Title (if owned)":
    "Kontrata sa abang (kon giabangan) o Tax Declaration / Titulo sa yuta (kon imoha).",
  "Occupancy Permit (OBO) & Fire Safety Inspection Certificate (BFP Malaybalay)":
    "Occupancy Permit gikan sa OBO ug Fire Safety Inspection Certificate gikan sa BFP Malaybalay.",
  "Sanitary Permit / Health Certificate from Malaybalay City Health Office":
    "Sanitary Permit o Health Certificate gikan sa Malaybalay City Health Office.",
  "Sworn declaration of prior-year gross sales/receipts or BIR Audited Financial Statements / ITR":
    "Pinanumpaang deklarasyon sa halin sa miaging tuig o BIR Audited Financial Statements / ITR.",
  "Previous year’s Mayor’s Permit and Official Receipt":
    "Mayor's Permit ug Official Receipt sa miaging tuig.",
  "Updated Barangay Business Clearance":
    "Bag-o ug updated nga Barangay Business Clearance.",
  "BFP Fire Safety Inspection Certificate (FSIC) & CHO Sanitary Permit renewal":
    "Pagbag-o sa BFP Fire Safety Inspection Certificate (FSIC) ug CHO Sanitary Permit.",
  "Valid government-issued ID of the Filipino business owner (18+ years old)":
    "Balido nga ID gikan sa gobyerno sa Pilipinong tag-iya sa negosyo (18 anyos pataas).",
  "3 proposed Business Name options and territorial scope selection":
    "3 ka gisugyot nga ngalan sa negosyo ug gipiling sakop sa lugar (territorial scope).",
  "Philippine Standard Industrial Classification (PSIC) dominant business activity":
    "Panguna nga kalihokan sa negosyo ubos sa Philippine Standard Industrial Classification (PSIC).",
  "Active email address and mobile number for OTP and digital certificate delivery":
    "Aktibo nga email address ug numero sa selpon alang sa OTP ug digital nga sertipiko.",
  "Official Receipt, sales invoice, warranty card, or transaction screenshot":
    "Official Receipt, resibo sa palit, warranty card, o screenshot sa transaksyon.",
  "Written summary of consumer complaint or defective product/service issue":
    "Sinulat nga saysay sa reklamo sa konsumidor o daot nga produkto/serbisyo.",
  "Name and address of the respondent establishment":
    "Ngalan ug adres sa tindahan o establisamento nga gireklamo.",
  "Proposed corporate/association name verified via SEC eSPARC":
    "Gisugyot nga ngalan sa korporasyon o asosasyon nga nasusi na sa SEC eSPARC.",
  "Articles of Incorporation, By-Laws, and Treasurer-in-Trust details":
    "Articles of Incorporation, By-Laws, ug detalye sa Treasurer-in-Trust.",
  "TIN of incorporators, directors, trustees, and officers":
    "Tax Identification Number (TIN) sa tanang incorporator, direktor, trustee, ug opisyal.",
  "JPEG representation of the brand logo or word mark":
    "JPEG nga hulagway sa logo o ngalan sa tatak (word mark).",
  "List of goods/services under the Nice Classification":
    "Listahan sa mga produkto o serbisyo sumala sa Nice Classification.",
  "Applicant identity and MSME/Youth/Inventor fee-reduction declaration":
    "Ilhanan sa aplikante ug deklarasyon kon kwalipikado sa diskwento alang sa MSME/Batan-on/Imbentor.",

  // Civil Registry, IDs & Clearances
  "Valid government ID of the document owner or authorized immediate family member":
    "Balido nga ID gikan sa gobyerno sa tag-iya sa dokumento o suod nga membro sa pamilya.",
  "Signed Authorization Letter + valid ID if requested by a representative":
    "Gipirmahan nga Authorization Letter ug balido nga ID kon representante ang mokuha.",
  "For Late Birth Registration: PSA Negative Result, Baptismal/School/Voter record, and 2 disinterested witnesses’ affidavit":
    "Kon ulahi nga rehistro sa pagkatawo: PSA Negative Result, rekord sa bunyag/eskwelahan/botante, ug affidavit sa 2 ka saksi.",
  "PSA Birth Certificates and CENOMAR (Certificate of No Marriage) of both applicants":
    "PSA Birth Certificate ug CENOMAR (Certificate of No Marriage) sa duha ka aplikante.",
  "Parental Consent (ages 18–20) or Parental Advice (ages 21–24)":
    "Pagtugot sa ginikanan (edad 18–20) o tambag sa ginikanan (edad 21–24).",
  "Certificate of Attendance in Pre-Marriage Counseling (CSWDO / CHO / PopCom Malaybalay)":
    "Sertipiko sa pagtambong sa Pre-Marriage Counseling (CSWDO / CHO / PopCom Malaybalay).",
  "Community Tax Certificate (Cedula) and 1x1 / 2x2 ID photos":
    "Community Tax Certificate (Cedula) ug 1x1 / 2x2 nga litrato.",
  "PSA CRS Online Appointment Slip (for walk-in) or PSAHelpline reference number":
    "PSA CRS Online Appointment Slip (kon walk-in) o reference number sa PSAHelpline.",
  "At least 1 valid government-issued ID matching the document owner or immediate relative":
    "Labing menos 1 ka balido nga ID gikan sa gobyerno sa tag-iya sa dokumento o suod nga paryente.",
  "Barangay First-Time Jobseeker Certification (if availing RA 11261 free issuance)":
    "Sertipiko gikan sa Barangay alang sa First-Time Jobseeker (kon mogamit sa libreng serbisyo ubos sa RA 11261).",
  "Full Name, Date of Birth, or 29-digit PhilSys Transaction Reference Number (TRN)":
    "Kompleto nga ngalan, petsa sa pagkatawo, o 29-ka-numero nga PhilSys Transaction Reference Number (TRN).",
  "Smartphone or webcam for live facial authentication":
    "Smartphone o webcam alang sa live nga pagkumpirma sa nawong.",
  "Online NBI Clearance Reference Number and paid appointment confirmation":
    "Online NBI Clearance Reference Number ug kumpirmasyon sa nabayran nga appointment.",
  "2 original valid government-issued IDs (National ID, Passport, Driver’s License, Voter’s ID/Cert, UMID, or PSA Birth Certificate)":
    "2 ka orihinal nga balido nga ID gikan sa gobyerno (National ID, Passport, Driver's License, Voter's ID/Cert, UMID, o PSA Birth Certificate).",
  "Original Barangay Certification & Oath of Undertaking (if claiming RA 11261 First-Time Jobseeker free clearance)":
    "Orihinal nga Barangay Certification ug Oath of Undertaking (kon mokuha sa libreng clearance ubos sa RA 11261).",
  "NPCS Online Appointment Reference Number":
    "NPCS Online Appointment Reference Number.",
  "2 valid government-issued IDs (or 1 primary ID + Barangay Clearance & Birth Certificate)":
    "2 ka balido nga ID gikan sa gobyerno (o 1 ka primary ID + Barangay Clearance ug Birth Certificate).",

  // Contributions & Insurance (SSS, Pag-IBIG, PhilHealth, GSIS)
  "PSA Birth Certificate or Philippine Passport / National ID":
    "PSA Birth Certificate o Philippine Passport / National ID.",
  "Active email address and mobile number for My.SSS portal activation":
    "Aktibo nga email address ug numero sa selpon alang sa pag-activate sa My.SSS portal.",
  "At least 36 posted monthly contributions (6 within the last 12 months for 1-month salary loan)":
    "Labing menos 36 ka binulan nga kontribusyon (6 sulod sa miaging 12 ka bulan alang sa 1-month salary loan).",
  "Enrolled and approved bank account or e-wallet in SSS Disbursement Account Enrollment Module (DAEM)":
    "Naka-enrol ug naaprobahan nga bank account o e-wallet sa SSS DAEM.",
  "1 valid government-issued ID":
    "1 ka balido nga ID gikan sa gobyerno.",
  "Pag-IBIG MID Number (can be generated online in 5 minutes)":
    "Pag-IBIG MID Number (mahimong makuha online sulod sa 5 ka minuto).",
  "At least 24 monthly membership savings (1 contribution within the last 6 months)":
    "Labing menos 24 ka binulan nga kontribusyon (1 ka kontribusyon sulod sa miaging 6 ka bulan).",
  "Pag-IBIG Loyalty Card Plus or active LandBank/DBP/UCPB disbursement card":
    "Pag-IBIG Loyalty Card Plus o aktibo nga LandBank/DBP/UCPB disbursement card.",
  "Selfie photo holding valid ID and loan application form":
    "Selfie nga litrato nga nagkupot og balido nga ID ug porma sa loan.",
  "Accomplished PhilHealth Member Registration Form (PMRF)":
    "Nakompleto nga PhilHealth Member Registration Form (PMRF).",
  "PSA Birth Certificate / Marriage Certificate for adding legal dependents":
    "PSA Birth Certificate o Marriage Certificate alang sa pagdugang og mga legal nga dependent.",
  "Active GSIS Touch account and UMID / eCard":
    "Aktibo nga GSIS Touch account ug UMID / eCard.",
  "Agency Authorized Officer (AAO) online certification":
    "Online nga sertipikasyon gikan sa Agency Authorized Officer (AAO).",

  // Disaster, Weather & Fire Safety
  "Exact barangay, purok/sitio, nearest landmark, and active callback mobile number":
    "Eksakto nga barangay, purok/sitio, duol nga timaan, ug aktibo nga numero sa selpon.",
  "Nature of incident (medical trauma, vehicular accident, Sawaga/Pulangi river flooding, or rain-induced landslide)":
    "Klase sa insidente (medikal nga emerhensya, disgrasya sa sakyanan, pagbaha, o pagdahili sa yuta).",
  "Exact coordinates or barangay location in Malaybalay City":
    "Eksakto nga lokasyon o barangay sa Dakbayan sa Malaybalay.",
  "Date range of weather event (for construction delay or crop insurance claims)":
    "Sakop sa petsa sa panghitabo sa panahon (alang sa konstruksyon o crop insurance).",
  "Signed architectural/engineering plans (for FSEC Building Permit)":
    "Gipirmahan nga architectural/engineering plans (alang sa FSEC Building Permit).",
  "Occupancy Permit assessment or Business Permit application form (for FSIC)":
    "Occupancy Permit assessment o Business Permit application form (alang sa FSIC).",
  "Proof of functional fire extinguishers and emergency exit signage":
    "Pamatuod sa nagtrabaho nga fire extinguisher ug mga karatula sa emergency exit.",

  // Education & PRC
  "Certified True Copy of Form 137 / SF10 (Permanent Learner Record) and Diploma from the originating Malaybalay school":
    "Certified True Copy sa Form 137 / SF10 (Permanent Learner Record) ug Diploma gikan sa kanhi eskwelahan sa Malaybalay.",
  "School Principal endorsement letter":
    "Sulat-endorso gikan sa Principal sa eskwelahan.",
  "Valid ID of learner or parent/guardian":
    "Balido nga ID sa estudyante o sa ginikanan/tigbantay.",
  "Senior High School Report Card (SF9) / TOR for transferees":
    "Senior High School Report Card (SF9) o Transcript of Records (TOR) alang sa mobalhin.",
  "PSA Birth Certificate and Certificate of Good Moral Character":
    "PSA Birth Certificate ug Certificate of Good Moral Character.",
  "BukSU Student Portal / Registrar request form (for alumni credentials)":
    "BukSU Student Portal o Registrar request form (alang sa mga alumni).",
  "TESDA Learner’s Profile / Unique Learner Identifier (ULI)":
    "TESDA Learner's Profile o Unique Learner Identifier (ULI).",
  "PSA Birth Certificate, High School/College credentials, and passport-size photos with white background and collar":
    "PSA Birth Certificate, rekord sa High School/College, ug passport-size nga litrato nga puti ang luyo ug may kwelyo.",
  "Certificate of Residency in Malaybalay City (for City Medical Education Subsidy under EO No. 17 s. 2026)":
    "Certificate of Residency sa Dakbayan sa Malaybalay (alang sa City Medical Education Subsidy ubos sa EO No. 17 s. 2026).",
  "PRC LERIS account with passport-size photo in white background":
    "PRC LERIS account nga adunay passport-size nga litrato sa puti nga background.",
  "CPD compliance or undertaking (for PRC PIC renewal)":
    "Pamatuod sa CPD units o undertaking (alang sa pagbag-o sa PRC ID).",
  "TOR, PSA Birth Certificate, and NBI Clearance (for first-time board exam applicants)":
    "Transcript of Records (TOR), PSA Birth Certificate, ug NBI Clearance (alang sa unang mokuha sa board exam).",

  // Employment, DOLE & PESO
  "Updated Resume / Curriculum Vitae and valid ID":
    "Bag-o nga Resume / Curriculum Vitae ug balido nga ID.",
  "Barangay Clearance or First-Time Jobseeker Certification (RA 11261)":
    "Barangay Clearance o First-Time Jobseeker Certification (RA 11261).",
  "For SPES: School enrollment/grades and Certificate of Indigency":
    "Alang sa SPES: Pamatuod sa enrollment/grado sa eskwelahan ug Certificate of Indigency.",
  "Employment details, payslips, or company ID (for SEnA wage/benefit claims)":
    "Mga detalye sa trabaho, payslip, o company ID (alang sa reklamo sa sweldo/benepisyo).",
  "Business Permit, DTI/SEC registration, and OSH layout (for Rule 1020 Employer Registration)":
    "Business Permit, DTI/SEC registration, ug OSH layout (alang sa Rule 1020 Employer Registration).",
  "Constitution, By-Laws, and member list (for Rural Workers Association registration)":
    "Constitution, By-Laws, ug listahan sa mga membro (alang sa rehistro sa asosasyon).",

  // Health & Social Welfare
  "Barangay Health Station referral slip or valid ID / PhilHealth MDR":
    "Referral slip gikan sa Barangay Health Station o balido nga ID / PhilHealth MDR.",
  "Barangay Health Station or Brgy. Aglayan Super Health Center referral slip (per EO No. 93, Nov. 2026) or valid ID / PhilHealth MDR":
    "Referral slip gikan sa Barangay Health Station o sa Malaybalay City Super Health Center sa Brgy. Aglayan (subay sa EO No. 93, Nob. 2026), o balido nga ID / PhilHealth MDR.",
  "Laboratory results (urinalysis, fecalysis, chest X-ray for food/non-food handler Health Card)":
    "Resulta sa laboratoryo (urinalysis, fecalysis, chest X-ray alang sa Health Card).",
  "Updated Hospital Statement of Account (SOA) or Doctor’s Prescription / Laboratory Request with price quotation":
    "Bag-o nga Statement of Account (SOA) sa ospital o resita/laboratory request sa doktor nga adunay presyo.",
  "Clinical Abstract or Medical Certificate signed by the attending physician":
    "Clinical Abstract o Medical Certificate nga gipirmahan sa doktor.",
  "Valid ID of patient and representative + Barangay Certificate of Indigency":
    "Balido nga ID sa pasyente ug representante ug Barangay Certificate of Indigency.",
  "Barangay Certificate of Indigency and Residency in Malaybalay City":
    "Barangay Certificate of Indigency ug Residency sa Dakbayan sa Malaybalay.",
  "Valid ID / PSA Birth Certificate (for Senior Citizen OSCA ID), Medical Certificate confirming disability (for PWD ID), or Solo Parent affidavit/birth certificates of children":
    "Balido nga ID / PSA Birth Certificate (OSCA ID), Medical Certificate sa kakulangan (PWD ID), o Solo Parent affidavit ug birth certificate sa mga anak.",
  "Medical prescription/hospital bill or registered Death Certificate/funeral contract (for AICS Medical/Burial aid)":
    "Resita sa doktor/bayrunon sa ospital o Death Certificate/kontrata sa punerarya (alang sa tabang sa AICS).",
  "Barangay Certificate of Indigency, Valid ID, and Medical/Hospital/Funeral billing statement (for DSWD AICS)":
    "Barangay Certificate of Indigency, balido nga ID, ug bayrunon sa ospital o punerarya (alang sa DSWD AICS).",
  "Genealogy form endorsed by recognized IP Mandatory Representative / Bae / Datu (for NCIP Certificate of Confirmation)":
    "Genealogy form nga giendoso sa iladong IP Mandatory Representative / Bae / Datu (alang sa NCIP Certificate).",

  // Housing, Building, Land & Planning
  "5 sets of signed and sealed Architectural, Structural, Electrical, and Sanitary/Plumbing plans":
    "5 ka set sa gipirmahan ug selyadong plano sa Architectural, Structural, Electrical, ug Sanitary/Plumbing.",
  "4–5 sets of signed and sealed Architectural, Structural, Electrical, and Sanitary/Plumbing plans":
    "4–5 ka set sa gipirmahan ug selyadong plano sa Architectural, Structural, Electrical, ug Sanitary/Plumbing.",
  "Certified True Copy of OCT/TCT Land Title, Tax Declaration, and current Real Property Tax Receipt":
    "Certified True Copy sa OCT/TCT Titulo sa yuta, Tax Declaration, ug bag-ong resibo sa Real Property Tax.",
  "Barangay Construction Clearance and CPDO Locational/Zoning Clearance":
    "Barangay Construction Clearance ug CPDO Locational/Zoning Clearance.",
  "BFP Fire Safety Evaluation Clearance (FSEC)":
    "BFP Fire Safety Evaluation Clearance (FSEC).",
  "Barangay Certificate of Residency and Indigency":
    "Barangay Certificate of Residency ug Indigency.",
  "Certificate of No Landholding from the City Assessor’s Office":
    "Certificate of No Landholding gikan sa City Assessor's Office.",
  "Marriage Certificate / Birth Certificates of household members and valid IDs":
    "Marriage Certificate / Birth Certificate sa mga membro sa pamilya ug balido nga mga ID.",
  "Title Number (OCT or TCT), registered owner’s name, and lot location in Malaybalay/Bukidnon":
    "Numero sa Titulo (OCT o TCT), ngalan sa nakarehistrong tag-iya, ug lokasyon sa lote sa Malaybalay/Bukidnon.",
  "For Title Transfer: Notarized Deed of Absolute Sale, BIR eCAR (from RDO 99), Transfer Tax Receipt (City Treasurer), and Tax Clearance (City Assessor)":
    "Kon magbalhin sa titulo: Notaryadong Deed of Absolute Sale, BIR eCAR (RDO 99), Transfer Tax Receipt, ug Tax Clearance.",

  // Passports, OFW, Taxes & Vehicles
  "Confirmed DFA Online Appointment Packet & e-Payment Receipt":
    "Kumpirmadong DFA Online Appointment Packet ug resibo sa e-Payment.",
  "Original PSA Birth Certificate on Security Paper (for New Applicants)":
    "Orihinal nga PSA Birth Certificate sa Security Paper (alang sa bag-ong aplikante).",
  "1 valid government-issued photo ID (National ID, ePhilID, Driver’s License, UMID, Voter’s ID/Certification from COMELEC Intramuros/local)":
    "1 ka balido nga photo ID gikan sa gobyerno (National ID, ePhilID, Driver's License, UMID, Voter's ID/Cert).",
  "Current ePassport (for Renewal)":
    "Kasalukuyang ePassport (alang sa pagbag-o / renewal).",
  "PSA-issued civil registry document, NBI Clearance, or DepEd/CHED/PRC CAV-endorsed credentials (for Apostille)":
    "Dokumentong sibil gikan sa PSA, NBI Clearance, o dokumento nga may DepEd/CHED/PRC CAV (alang sa Apostille).",
  "Passport details and flight itinerary within 72 hours of departure/arrival (for eTravel)":
    "Detalye sa passport ug iskedyul sa biyahe sulod sa 72 ka oras sa pagbiya o pag-abot (alang sa eTravel).",
  "Active DMW e-Registration account (onlineservices.dmw.gov.ph)":
    "Aktibo nga DMW e-Registration account (onlineservices.dmw.gov.ph).",
  "Valid Philippine Passport (at least 6 months validity) and valid Work Visa / Employment Contract":
    "Balido nga Philippine Passport (labing menos 6 ka bulan nga balido) ug Work Visa / Kontrata sa Trabaho.",
  "Previous Real Property Tax Official Receipt or Tax Declaration Number (ARP/TD No.)":
    "Miaging Official Receipt sa Real Property Tax o numero sa Tax Declaration (ARP/TD No.).",
  "Valid ID and gross income/receipts declaration (for Community Tax Certificate / Cedula)":
    "Balido nga ID ug deklarasyon sa kinatibuk-ang kita (alang sa Community Tax Certificate / Cedula).",
  "Tax Declaration Number or OCT/TCT Title Number":
    "Numero sa Tax Declaration o numero sa Titulo sa yuta (OCT/TCT).",
  "Current Real Property Tax Official Receipt from the City Treasurer’s Office":
    "Bag-o nga Official Receipt sa Real Property Tax gikan sa City Treasurer's Office.",
  "Valid ID or Special Power of Attorney / Authorization Letter":
    "Balido nga ID o Special Power of Attorney / Authorization Letter.",
  "1 valid government-issued ID showing full name, birth date, and signature, plus selfie holding the ID":
    "1 ka balido nga ID gikan sa gobyerno nga naay kompletong ngalan, petsa sa pagkatawo, ug pirma, uban ang selfie nga nagkupot niini.",
  "DTI Certificate or SEC Articles of Incorporation (for Form 1901/1903 Business Certificate of Registration)":
    "DTI Certificate o SEC Articles of Incorporation (alang sa Form 1901/1903 Business Certificate of Registration).",
  "Sample Principal Invoice layout for Authority to Print (ATP)":
    "Sampol sa porma sa Principal Invoice alang sa Authority to Print (ATP).",
  "12-digit Taxpayer Identification Number (TIN) and Branch Code (00000)":
    "12-ka-numero nga Taxpayer Identification Number (TIN) ug Branch Code (00000).",
  "Return Period, Form Type (e.g., 1701Q, 1701A, 2551Q, 0619E), and Tax Amount":
    "Panahon sa bayranan, klase sa BIR form (pananglitan 1701Q, 1701A, 2551Q, 0619E), ug kantidad sa buhis.",
  "Active LTO LTMS Portal Account (portal.lto.gov.ph)":
    "Aktibo nga LTO LTMS Portal Account (portal.lto.gov.ph).",
  "LTO-Accredited Medical Certificate (electronically transmitted)":
    "Medical Certificate gikan sa doktor o klinika nga akreditado sa LTO.",
  "Theoretical Driving Course (TDC) 15-hour Certificate (for Student Permit) or Practical Driving Course (PDC) Certificate (for New Driver’s License)":
    "Sertipiko sa 15-ka-oras nga TDC (Student Permit) o Practical Driving Course / PDC Certificate (Bag-ong Lisensya).",
  "CDE Comprehensive Driver’s Education Online Validation Exam Certificate (free on LTMS for License Renewal)":
    "Sertipiko sa CDE Online Validation Exam (libre sa LTMS alang sa pagbag-o sa lisensya).",
  "Photocopy of Certificate of Registration (CR) and latest Official Receipt (OR)":
    "Photocopy sa Certificate of Registration (CR) ug pinakabag-ong Official Receipt (OR).",
  "Compulsory Third-Party Liability (CTPL) Certificate of Cover":
    "Compulsory Third-Party Liability (CTPL) Insurance Certificate of Cover.",
  "Motor Vehicle Inspection Report (PMVIC / Emission Test & MVIS stencil)":
    "Motor Vehicle Inspection Report (PMVIC / Emission Test ug MVIS stencil).",
  "LTO Official Receipt (OR) and Certificate of Registration (CR) of the motorela unit":
    "LTO Official Receipt (OR) ug Certificate of Registration (CR) sa motorela.",
  "TMC Roadworthiness / Stencil Inspection Report and TODA/Association endorsement":
    "TMC Roadworthiness / Stencil Inspection Report ug endorso gikan sa TODA o asosasyon.",
  "Traffic Citation Ticket (TOP/TCT) for traffic violation settlement":
    "Traffic Citation Ticket (TOP/TCT) alang sa pagbayad sa multa sa trapiko.",
  "Current Community Tax Certificate (Cedula)":
    "Bag-o nga Community Tax Certificate (Cedula).",
  "Signed Oath of Undertaking (if claiming RA 11261 First-Time Jobseeker fee exemption)":
    "Gipirmahan nga Oath of Undertaking (kon mokuha sa libreng bayranan ubos sa RA 11261).",
  "Written or verbal complaint statement with names and addresses of parties within Malaybalay City":
    "Sinulat o binaba nga saysay sa reklamo uban ang mga ngalan ug adres sa mga hingtungdan sulod sa Malaybalay City.",

  // PESO Charter & Job Details (pesoData.ts)
  "NSRP Jobseekers Profile Form (available at PESO Desk)":
    "NSRP Jobseekers Profile Form (makuha sa PESO Desk).",
  "Resume / application documents (for email or referral matching)":
    "Resume ug mga dokumento sa aplikasyon (alang sa email o pag-endorso sa trabaho).",
  "Letter of Intent addressed to PESO Manager":
    "Letter of Intent nga naka-adres sa PESO Manager.",
  "Updated Business Permit (BPLD), BIR Certificate, and SEC/DTI Registration":
    "Updated nga Business Permit (BPLD), BIR Certificate, ug rehistro sa SEC/DTI.",
  "Company Profile & NSRP Form 2 (Establishment Profile)":
    "Company Profile ug NSRP Form 2 (Establishment Profile).",
  "Job Vacancies with Qualifications (local) or POEA/DMW Job Order & License (overseas)":
    "Listahan sa mga bakanteng trabaho ug kwalipikasyon (lokal) o POEA/DMW Job Order ug Lisensya (abroad).",
  "DOLE License (for local manpower agencies) & No Objection Certificate":
    "DOLE License (alang sa lokal nga manpower agency) ug No Objection Certificate.",
  "Letter of Intent":
    "Letter of Intent (Sulat-hangyo).",
  "DTI / SEC Registration Certificate":
    "Sertipiko sa rehistro gikan sa DTI o SEC.",
  "Updated Business Permit":
    "Updated nga Business Permit.",
  "Company Profile & Detailed Job Vacancy List":
    "Company Profile ug detalyadong listahan sa mga bakanteng trabaho.",
  "Email registration / SPES Form 2A application":
    "Pagparehistro sa email o aplikasyon gamit ang SPES Form 2A.",
  "School enrollment / academic credentials and household income proof per DOLE-10 SPES cycle guidelines":
    "Pamatuod sa pag-eskwela/grado ug kita sa panimalay sumala sa giya sa DOLE-10 SPES.",
  "Valid Government-Issued ID":
    "Balido nga ID gikan sa gobyerno.",
  "Accomplished NSRP Form 1 (Jobseekers Form)":
    "Nakompleto nga NSRP Form 1 (Jobseekers Form).",
  "PESO Registration Form & 1x1 ID Picture":
    "PESO Registration Form ug 1x1 nga litrato.",
  "Photocopy of Valid ID":
    "Photocopy sa balido nga ID.",
  "Barangay Certification of Residency":
    "Sertipiko gikan sa Barangay nga nagpamatuod sa pinuy-anan.",
  "Simple Business Plan / Project Proposal & Picture of Project Location":
    "Simple nga Business Plan / Project Proposal ug litrato sa lugar sa proyekto.",
  "Certificate of Registration (for associations/organizations)":
    "Certificate of Registration (alang sa mga asosasyon o organisasyon).",
  "Active School Memorandum of Agreement (MOA)":
    "Aktibo nga Memorandum of Agreement (MOA) sa eskwelahan.",
  "Student Letter of Intent":
    "Letter of Intent gikan sa estudyante.",
  "School / DepEd Request Letter of Intent":
    "Sulat-hangyo gikan sa Eskwelahan o DepEd.",
  "PESO OFW Request Form":
    "PESO OFW Request Form.",
  "Birth Certificate (OFW & requesting party)":
    "Birth Certificate (sa OFW ug sa naghangyo nga membro sa pamilya).",
  "Photocopy of Valid ID & OFW Passport":
    "Photocopy sa balido nga ID ug Passport sa OFW.",
  "Written Authorization from Direct Family (if representative)":
    "Sinulat nga pagtugot gikan sa suod nga pamilya (kon representante ang nag-atiman).",
  "For Jobseekers: Updated resume, valid IDs, transcripts/certificates, and registration at venue/PESO desk":
    "Alang sa mga nangita og trabaho: Bag-o nga resume, balido nga ID, TOR/sertipiko, ug pagparehistro sa venue/PESO desk.",
  "For Employers: Letter of Intent, DOLE Job Fair Clearance Application Form, and approved vacancies":
    "Alang sa mga employer: Letter of Intent, DOLE Job Fair Clearance Application Form, ug listahan sa bakanteng trabaho.",
  "Application Letter addressed to the City Mayor through the City HRMO (Magnolia O. Improgo)":
    "Application Letter nga naka-adres sa City Mayor pinaagi sa City HRMO (Magnolia O. Improgo).",
  "Fully accomplished Personal Data Sheet (CS Form No. 212, Revised 2017) with Work Experience Sheet":
    "Kompleto ug gipirmahan nga Personal Data Sheet (CS Form No. 212, Revised 2017) uban ang Work Experience Sheet.",
  "Performance rating in the last rating period (if applicable)":
    "Performance rating sa miaging panahon sa pagtimbang (kon naa).",
  "Photocopy of Certificate of Eligibility / PRC Rating / License":
    "Photocopy sa Certificate of Eligibility / PRC Rating / Lisensya.",
  "Photocopy of Transcript of Records":
    "Photocopy sa Transcript of Records (TOR).",
  "NSRP Jobseekers Profile Form (provided free at PESO Desk)":
    "NSRP Jobseekers Profile Form (libre nga makuha sa PESO Desk).",
  "Updated resume / bio-data and valid government-issued ID":
    "Bag-o nga resume / bio-data ug balido nga ID gikan sa gobyerno.",
  "Multiple sets of updated Resume / CV & application letters":
    "Daghang kopya sa bag-o nga Resume / CV ug application letter.",
  "Government-issued ID, Diploma / Transcript of Records, and Certificate of Employment (if experienced)":
    "ID gikan sa gobyerno, Diploma / Transcript of Records, ug Certificate of Employment (kon may kasinatian na sa trabaho).",
  "For overseas applicants: Valid Passport (if available)":
    "Alang sa aplikante pa-abroad: Balido nga Passport (kon naa na).",
  "Accomplished SPES Form 2A & online pre-registration":
    "Nakompleto nga SPES Form 2A ug online pre-registration.",
  "Latest grades/report card and School Registration Certificate":
    "Pinakabag-ong grado/report card ug School Registration Certificate.",
  "PSA Birth Certificate & Barangay Indigency / Parents' Tax Exemption proof":
    "PSA Birth Certificate ug Barangay Indigency / pamatuod sa Tax Exemption sa mga ginikanan.",
  "Valid Government-Issued ID & Barangay Certificate of Residency / Indigency":
    "Balido nga ID gikan sa gobyerno ug Barangay Certificate of Residency / Indigency.",
  "Accomplished DOLE TUPAD Beneficiary Profile Form during barangay profiling":
    "Nakompleto nga DOLE TUPAD Beneficiary Profile Form atol sa paglista sa barangay.",
  "Valid ID (photocopy) & Barangay Certification of Residency":
    "Photocopy sa balido nga ID ug Sertipiko sa pinuy-anan gikan sa Barangay.",
  "Simple Business Plan / Project Proposal & Photo of Project Location":
    "Simple nga Business Plan / Project Proposal ug litrato sa lugar sa proyekto.",
  "Certificate of Registration (if applying as an association)":
    "Certificate of Registration (kon nag-aplay isip asosasyon).",
  "School-LGU Memorandum of Agreement (MOA) verification":
    "Kumpirmasyon sa School-LGU Memorandum of Agreement (MOA).",
  "Student Letter of Intent / School Endorsement":
    "Letter of Intent sa estudyante ug endorso gikan sa eskwelahan.",
  "PESO Request Form & Photocopy of Valid ID":
    "PESO Request Form ug photocopy sa balido nga ID.",
  "OFW Passport & Birth Certificate (OFW and requesting family member)":
    "Passport sa OFW ug Birth Certificate (sa OFW ug naghangyo nga membro sa pamilya).",
  "Authorization from direct family (if filed by representative)":
    "Pagtugot gikan sa suod nga pamilya (kon representante ang nagduso).",
  "School / DepEd Division Request Letter coordinated with PESO":
    "Sulat-hangyo sa Eskwelahan o DepEd Division nga nakig-alayon sa PESO.",

  // City Offices & Document Guide Additions
  "Valid government ID of the document owner or authorized family member":
    "Balido nga ID sa tag-iya sa dokumento o suod nga membro sa pamilya.",
  "Confirm the exact record type and any additional supporting forms with the City Civil Registrar’s Office":
    "Ikumpirma ang eksaktong klase sa rekord ug dugang mga porma sa City Civil Registrar's Office.",
  "1 valid government-issued ID showing full name and current Malaybalay address":
    "1 ka balido nga ID gikan sa gobyerno nga nagpakita sa kompletong ngalan ug adres sa Malaybalay.",
  "Current Community Tax Certificate (Cedula) or prepare to secure one at Barangay Hall / City Treasurer":
    "Bag-o nga Cedula o pag-andam sa pagkuha niini sa Barangay Hall / City Treasurer's Office.",
  "Purok or Sitio clearance / endorsement if required by your Barangay Hall":
    "Clearance o endorso gikan sa Purok o Sitio kon gipangayo sa inyong Barangay Hall.",
  "Confirm exact barangay-specific forms, fees, and release schedules before visiting":
    "Ikumpirma daan sa Barangay Hall ang eksaktong porma, bayranan, ug oras sa pagkuha sa dokumento.",
  "Select the applicable official OBO form template before preparing a submission":
    "Pilia daan ang hustong opisyal nga porma gikan sa OBO sa dili pa mag-andam sa pagduso.",
  "Barangay Construction Clearance, CPDO Locational/Zoning Clearance, and BFP Fire Safety Evaluation Clearance (FSEC)":
    "Barangay Construction Clearance, CPDO Locational/Zoning Clearance, ug BFP Fire Safety Evaluation Clearance (FSEC).",
  "Barangay Clearance from your barangay in Malaybalay City":
    "Barangay Clearance gikan sa inyong barangay sa Dakbayan sa Malaybalay.",
  "Police Clearance (PNP) or Court / Fiscal Clearance (for employment or legal use)":
    "Police Clearance (PNP) o Court / Fiscal Clearance (kon alang sa trabaho o legal nga transaksyon).",
  "Official Receipt from the City Treasurer’s Office (₱130.00)":
    "Official Receipt gikan sa City Treasurer's Office (₱130.00).",
  "Written request letter specifying the session date, topic, or agenda item":
    "Sinulat nga hangyo nga nagtumbok sa petsa sa sesyon, hilisgutan, o agenda.",
  "Valid government-issued ID of the requesting party or authorized representative":
    "Balido nga ID gikan sa gobyerno sa naghangyo o awtorisadong representante.",
  "Ordinance or Resolution number, title, or year requested":
    "Numero, titulo, o tuig sa Ordinansa o Resolusyon nga gipangayo.",
  "1 valid government-issued ID for request logging":
    "1 ka balido nga ID gikan sa gobyerno alang sa paglista sa hangyo.",
  "Accomplished Malaybalay City Scholarship Application Form":
    "Nakompleto nga Malaybalay City Scholarship Application Form.",
  "Grade 12 Report Card / latest academic grades (average 83% or higher, no grade below 80)":
    "Grade 12 Report Card o pinakabag-ong grado (average nga 83% pataas, walay grado ubos sa 80).",
  "Parents' Income Tax Return (ITR) or Certificate of Tax Exemption (annual net income not exceeding ₱250,000)":
    "Income Tax Return (ITR) sa ginikanan o Certificate of Tax Exemption (tuigang kita dili molapas sa ₱250,000).",
  "Barangay Certificate of Residency in Malaybalay City":
    "Barangay Certificate of Residency sa Dakbayan sa Malaybalay.",
  "PSA Birth Certificate (or official proof of age 60+)":
    "PSA Birth Certificate o opisyal nga pamatuod sa edad nga 60 pataas.",
  "Accomplished OSCA Senior Citizen ID Application Form":
    "Nakompleto nga porma sa aplikasyon alang sa OSCA Senior Citizen ID.",
  "2 pcs 1x1 ID photo":
    "2 ka buok nga 1x1 ID nga litrato.",
  "Senior Citizen OSCA ID Card":
    "Senior Citizen OSCA ID Card.",
  "Vicinity Map / Lot Plan signed by a Geodetic Engineer showing exact lot location":
    "Vicinity Map / Lot Plan nga gipirmahan sa Geodetic Engineer nga nagpakita sa eksaktong lokasyon sa yuta.",
  "1 valid government-issued ID or Authorization Letter (if representative)":
    "1 ka balido nga ID gikan sa gobyerno o Authorization Letter (kon representante).",
  "Accomplished CPDO Locational Clearance Application Form":
    "Nakompleto nga CPDO Locational Clearance Application Form.",
  "Barangay Construction Clearance":
    "Barangay Construction Clearance gikan sa barangay.",
  "Site Development Plan and Architectural Floor Plans":
    "Site Development Plan ug Architectural Floor Plans.",
  "Hospital/Attending Physician Certificate of Live Birth / Marriage / Death":
    "Sertipiko sa Pagkatawo / Kaminyoon / Kamatayon gikan sa ospital o doktor.",
  "Barangay Incident Report or Blotter Certification confirming disaster damage":
    "Barangay Incident Report o Blotter Certification nga nagpamatuod sa kadaot gikan sa kalamidad.",
  "Approved Building Permit and As-Built Plans signed and sealed by supervising engineers/architects":
    "Naaprobahang Building Permit ug As-Built Plans nga gipirmahan ug selyado sa mga engineer/arkitekto.",
  "BFP Fire Safety Inspection Certificate (FSIC)":
    "BFP Fire Safety Inspection Certificate (FSIC).",
  "Construction Logbook and Certificate of Completion":
    "Construction Logbook ug Certificate of Completion.",
  "Written request / project location details in Malaybalay City":
    "Sinulat nga hangyo ug detalye sa lokasyon sa proyekto sa Dakbayan sa Malaybalay.",
  "Official Receipt of Environmental Certification Fee (₱80.00)":
    "Official Receipt sa bayad alang sa Environmental Certification Fee (₱80.00).",
  "Official Receipt of Fiscal Clearance Fee (₱100.00 from City Treasurer’s Office)":
    "Official Receipt sa Fiscal Clearance Fee (₱100.00 gikan sa City Treasurer's Office).",
  "Proof of immediate relationship or IBP ID / Legal Counsel Authorization":
    "Pamatuod sa suod nga relasyon sa PDL o IBP ID / Legal Counsel Authorization.",
  "Court Referral Order (RTC / MTCC Malaybalay) for Post-Sentence Investigation":
    "Court Referral Order (RTC / MTCC Malaybalay) alang sa Post-Sentence Investigation.",
};

function classifySection(requirement: string): SectionCategory {
  const text = requirement.toLowerCase();
  if (
    /\b(valid id|government-issued id|government id|photo id|national id|authorization|power of attorney|selfie|umid|philhealth mdr|immediate relationship|birth certificate|cenomar|marriage certificate|parental|oath of undertaking)\b/.test(
      text,
    )
  ) {
    return "Identity & Authorization";
  }
  if (
    /\b(clearance|cedula|community tax|certificate|indigency|residency|good moral|endorsement|blotter|incident report|nbi|police|fsic|fsec|sanitary)\b/.test(
      text,
    )
  ) {
    return "Clearances & Certificates";
  }
  if (
    /\b(form|letter|application|resume|curriculum vitae|bio-data|pds|cs form|nsrp|spes|pmrf|profile|proposal|business plan|itinerary)\b/.test(
      text,
    )
  ) {
    return "Application Forms & Letters";
  }
  if (
    /\b(title|oct|tct|tax declaration|plans|as-built|logbook|lot plan|vicinity map|lease|invoice|receipt|itr|financial statements|tin|psic|branch code|cr|or|ctpl|pmvic|emission|stencil|work visa|employment contract|moa|dti|sec|cda)\b/.test(
      text,
    )
  ) {
    return "Property, Tax & Technical Records";
  }
  return "Supporting & Financial Records";
}

export function translateRequirement(english: string): string {
  return REQUIREMENT_BISAYA_MAP[english] ?? english;
}

export function slugifyFilename(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "bettermc-checklist"
  );
}

export function groupRequirementsIntoSections(
  requirements: string[],
  scopePrefix = "req",
): ChecklistSection[] {
  const uniqueReqs = Array.from(new Set(requirements.map((item) => item.trim()).filter(Boolean)));
  if (uniqueReqs.length === 0) return [];

  const sectionOrder: SectionCategory[] = [
    "Identity & Authorization",
    "Application Forms & Letters",
    "Clearances & Certificates",
    "Property, Tax & Technical Records",
    "Supporting & Financial Records",
  ];

  const buckets = new Map<SectionCategory, ChecklistRequirementItem[]>();
  uniqueReqs.forEach((english, index) => {
    const category = classifySection(english);
    const bucket = buckets.get(category) ?? [];
    bucket.push({
      id: `${scopePrefix}::${index}::${english}`,
      english,
      bisaya: translateRequirement(english),
    });
    buckets.set(category, bucket);
  });

  // Keep short homogeneous lists cleanly grouped under one heading, while organizing multi-part
  // requirements into clear, scannable thematic sections.
  if (buckets.size === 1 || uniqueReqs.length <= 2) {
    return [
      {
        title: "Documentary Requirements",
        titleBisaya: "Gikinahanglan nga mga Dokumento",
        items: uniqueReqs.map((english, index) => ({
          id: `${scopePrefix}::${index}::${english}`,
          english,
          bisaya: translateRequirement(english),
        })),
      },
    ];
  }

  return sectionOrder
    .filter((cat) => (buckets.get(cat)?.length ?? 0) > 0)
    .map((cat) => ({
      title: cat,
      titleBisaya: SECTION_BISAYA_MAP[cat],
      items: buckets.get(cat)!,
    }));
}

export function buildDocumentGuideSections(guides: DocumentGuide[]): ChecklistSection[] {
  return guides.map((guide) => ({
    title: `${guide.title} (${guide.office})`,
    titleBisaya:
      guide.scope === "Barangay"
        ? "Mga dokumento alang sa serbisyo sa barangay"
        : "Mga giya nga dokumento sa dakbayan",
    items: guide.requirements.map((req, idx) => ({
      id: `docguide::${guide.slug}::${idx}::${req}`,
      english: req,
      bisaya: translateRequirement(req),
    })),
  }));
}

export function buildBarangayChecklistSections(barangayName: string): ChecklistSection[] {
  return [
    {
      title: `1. What to Bring to Barangay ${barangayName} Hall`,
      titleBisaya: `Mga dad-on sa pag-adto sa Barangay ${barangayName} Hall`,
      items: [
        {
          id: `brgy::${barangayName}::id`,
          english: "1 valid government-issued ID showing full name and current address",
          bisaya: "1 ka balido nga ID gikan sa gobyerno nga nagpakita sa kompletong ngalan ug pinuy-anan.",
        },
        {
          id: `brgy::${barangayName}::cedula`,
          english: "Current Community Tax Certificate (Cedula), or confirm if issued at Barangay Hall",
          bisaya: "Bag-o nga Cedula, o ipangutana kon mahimo bang mokuha niini sa Barangay Hall.",
        },
        {
          id: `brgy::${barangayName}::purok`,
          english: "Purok or Sitio endorsement / residency confirmation if required locally",
          bisaya: "Endorso gikan sa Purok o Sitio lider kon gipangayo sa inyong Barangay Hall.",
        },
        {
          id: `brgy::${barangayName}::purpose`,
          english: "Clear purpose and exact recipient office for your Clearance, Residency, or Indigency request",
          bisaya: "Tin-aw nga katuyoan ug eksaktong opisina nga padulngan sa gipangayong clearance o sertipiko.",
        },
      ],
    },
    {
      title: `2. What to Confirm Directly with Barangay ${barangayName}`,
      titleBisaya: `Mga ikumpirma mismo sa Barangay ${barangayName}`,
      items: [
        {
          id: `brgy::${barangayName}::form`,
          english: "Request the barangay's exact application slip or official clearance form",
          bisaya: "Pangayoa ang eksaktong porma o application slip nga gigamit sa maong barangay.",
        },
        {
          id: `brgy::${barangayName}::fee`,
          english: "Confirm applicable barangay ordinance fee and ask for an Official Receipt (or RA 11261 exemption for First-Time Jobseekers)",
          bisaya: "Ikumpirma ang bayranan sumala sa ordinansa ug pangayo og Official Receipt (o libreng serbisyo ubos sa RA 11261 kon First-Time Jobseeker).",
        },
        {
          id: `brgy::${barangayName}::schedule`,
          english: "Verify Punong Barangay / Barangay Secretary signing schedule and release time",
          bisaya: "Susiha ang oras sa pagpirma sa Punong Barangay o Barangay Secretary ug kanus-a makuha ang dokumento.",
        },
      ],
    },
  ];
}

export function buildSchoolChecklistSections(school: {
  name: string;
  type: string;
  levels: string[];
}): ChecklistSection[] {
  const isUniversity = school.type === "State university" || school.type === "Institutional website";
  const isTechVoc = school.type === "Technical-vocational";

  if (isUniversity) {
    return [
      {
        title: "1. Identity & Application Credentials",
        titleBisaya: "Ilhanan ug Porma sa Aplikasyon",
        items: [
          {
            id: `school::${school.name}::app`,
            english: `Confirmed ${school.name} Admission Portal application / examination permit`,
            bisaya: `Kumpirmadong aplikasyon gikan sa admission portal o examination permit sa ${school.name}.`,
          },
          {
            id: `school::${school.name}::psa`,
            english: "PSA Birth Certificate (original & photocopy)",
            bisaya: "PSA Birth Certificate (orihinal ug photocopy).",
          },
          {
            id: `school::${school.name}::photo`,
            english: "Recent ID photos (passport size / 2x2 with white background) & valid student ID",
            bisaya: "Bag-ong litrato (passport size / 2x2 nga puti ang luyo) ug balido nga student ID.",
          },
        ],
      },
      {
        title: "2. Academic & Good Moral Records",
        titleBisaya: "Mga Rekord sa Grado ug Pamatasan",
        items: [
          {
            id: `school::${school.name}::sf9`,
            english: "Senior High School Report Card (SF9 / Form 138) or Transcript of Records (for transferees)",
            bisaya: "Senior High School Report Card (SF9 / Form 138) o Transcript of Records (kon transferee).",
          },
          {
            id: `school::${school.name}::goodmoral`,
            english: "Certificate of Good Moral Character from previous school",
            bisaya: "Certificate of Good Moral Character gikan sa kanhi eskwelahan.",
          },
          {
            id: `school::${school.name}::residency`,
            english: "Confirm program slots, Free Higher Education (RA 10931) eligibility, or scholarship requirements with Campus Registrar",
            bisaya: "Ikumpirma sa Campus Registrar ang mga bakanteng kurso, RA 10931 free tuition, o gikinahanglan sa scholarship.",
          },
        ],
      },
    ];
  }

  if (isTechVoc) {
    return [
      {
        title: "1. TESDA Learner Identity & Registration",
        titleBisaya: "Ilhanan ug Pagparehistro sa TESDA",
        items: [
          {
            id: `school::${school.name}::uli`,
            english: "TESDA Learner’s Profile Form / Unique Learner Identifier (ULI)",
            bisaya: "TESDA Learner's Profile Form o Unique Learner Identifier (ULI).",
          },
          {
            id: `school::${school.name}::psa`,
            english: "PSA Birth Certificate & 1 valid government-issued ID",
            bisaya: "PSA Birth Certificate ug 1 ka balido nga ID gikan sa gobyerno.",
          },
          {
            id: `school::${school.name}::photo`,
            english: "Passport-size photos with white background and collar",
            bisaya: "Passport-size nga litrato nga puti ang luyo ug may kwelyo.",
          },
        ],
      },
      {
        title: "2. Academic Background & Scholarship Screening",
        titleBisaya: "Rekord sa Eskwela ug Pagsusi sa Scholarship",
        items: [
          {
            id: `school::${school.name}::cred`,
            english: "High School Card (Form 138) / Diploma or Transcript of Records",
            bisaya: "High School Card (Form 138) / Diploma o Transcript of Records.",
          },
          {
            id: `school::${school.name}::slot`,
            english: "Confirm TWSP / STEP / PESFA training voucher availability directly with the school registrar",
            bisaya: "Ikumpirma sa registrar sa eskwelahan kon naay TWSP / STEP / PESFA scholarship voucher.",
          },
        ],
      },
    ];
  }

  // DepEd / Basic Education (Public & Private Elementary / Integrated / High Schools)
  return [
    {
      title: "1. Basic Education Enrollment & Identity",
      titleBisaya: "Pagpa-enrol sa Eskwelahan ug Ilhanan sa Estudyante",
      items: [
        {
          id: `school::${school.name}::beef`,
          english: "Accomplished DepEd Basic Education Enrollment Form (BEEF / Learner Enrollment Survey)",
          bisaya: "Nakompleto nga DepEd Basic Education Enrollment Form (makuha sa eskwelahan o adviser).",
        },
        {
          id: `school::${school.name}::psa`,
          english: "PSA Birth Certificate (or Local Civil Registrar copy if PSA copy is pending)",
          bisaya: "PSA Birth Certificate (o kopya gikan sa Local Civil Registrar kon wala pa ang PSA).",
        },
        {
          id: `school::${school.name}::id`,
          english: "Valid ID of parent/guardian and Learner Reference Number (LRN) if continuing student",
          bisaya: "Balido nga ID sa ginikanan/tigbantay ug Learner Reference Number (LRN) kon nagpadayon nga estudyante.",
        },
      ],
    },
    {
      title: "2. Academic Transfer & Campus Confirmation",
      titleBisaya: "Rekord sa Grado ug Pagkumpirma sa Eskwelahan",
      items: [
        {
          id: `school::${school.name}::sf9`,
          english: "Latest Report Card (SF9) / Form 138 (and Form 137 / SF10 request for transferees)",
          bisaya: "Pinakabag-ong Report Card (SF9 / Form 138) ug hangyo sa Form 137 / SF10 kon mobalhin og eskwelahan.",
        },
        {
          id: `school::${school.name}::confirm`,
          english: "Confirm enrollment dates, grade sectioning, or SHS track slots directly with the School Head / Registrar",
          bisaya: "Ikumpirma direkta sa School Head o Registrar ang iskedyul sa pagpa-enrol ug seksyon sa estudyante.",
        },
      ],
    },
  ];
}
