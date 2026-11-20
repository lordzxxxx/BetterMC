import { z } from "zod";

export const PESO_FACEBOOK_PAGE_URL =
  "https://www.facebook.com/profile.php?id=61589180493733";
export const CITIZENS_CHARTER_2026_URL =
  "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/08/CITIZENS-CHARTER-2026.pdf";
export const CSC_FORM_9_2024_URL =
  "https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2025/04/CS-Form-No-9-Publication-2024-4th-Tranche-1-1.pdf";

export type PesoCharterService = {
  id: string;
  number: number;
  title: string;
  description: string;
  classification: "Simple" | "Complex" | "Highly Technical";
  transactionType: string;
  processingTime: string;
  fee: string;
  whoMayAvail: string;
  requirements: string[];
  steps: string[];
  charterPageRef: string;
};

export const PESO_CHARTER_SERVICES_2026: PesoCharterService[] = [
  {
    id: "employment-facilitation",
    number: 1,
    title: "Employment Facilitation (Job Matching & Referral)",
    description:
      "Connects Malaybalay City jobseekers with verified local and domestic employment vacancies through NSRP registration, skills matching, and formal employer referrals.",
    classification: "Simple",
    transactionType: "Government to Citizen (G2C)",
    processingTime: "15 Minutes",
    fee: "None",
    whoMayAvail: "Malaybalay City residents and non-Malaybalay City jobseekers",
    requirements: [
      "NSRP Jobseekers Profile Form (available at PESO Desk)",
      "Resume / application documents (for email or referral matching)",
    ],
    steps: [
      "Send application via pesomalaybalaycity@gmail.com OR visit the PESO Desk at New City Hall and fill out the NSRP Jobseekers Profile Form.",
      "PESO staff encode and process applicant profile (5 minutes).",
      "Conduct job matching against active employer vacancies (5 minutes).",
      "Issue referral to matched employer / company (5 minutes).",
    ],
    charterPageRef: "2026 Citizen's Charter, p. 531 (PDF p. 550)",
  },
  {
    id: "lra-sra",
    number: 2,
    title: "Local Recruitment Activity (LRA) & Special Recruitment Activity (SRA)",
    description:
      "Single-employer in-person hiring activity facilitated by PESO for licensed local businesses or overseas recruitment agencies with approved Job Orders.",
    classification: "Simple",
    transactionType: "Government to Business (G2B)",
    processingTime: "2 Days & 20 Minutes",
    fee: "None",
    whoMayAvail: "Licensed Business Establishments and Accredited Recruitment Agencies",
    requirements: [
      "Letter of Intent addressed to PESO Manager",
      "Updated Business Permit (BPLD), BIR Certificate, and SEC/DTI Registration",
      "Company Profile & NSRP Form 2 (Establishment Profile)",
      "Job Vacancies with Qualifications (local) or POEA/DMW Job Order & License (overseas)",
      "DOLE License (for local manpower agencies) & No Objection Certificate",
    ],
    steps: [
      "Employer sends complete documentary requirements to pesomalaybalaycity@gmail.com or PESO Desk.",
      "Assessment of requirements, approval, and issuance of No Objection Certificate (1 day & 10 minutes).",
      "Booking of City Hall / People's Hall venue, schedule, tables, and chairs (1 day & 15 minutes).",
      "Conduct LRA/SRA and submit Terminal Report for PESO Manager approval (5 minutes).",
    ],
    charterPageRef: "2026 Citizen's Charter, pp. 532–533 (PDF pp. 551–552)",
  },
  {
    id: "job-posting",
    number: 3,
    title: "Verified Job Vacancy Posting",
    description:
      "Verifies employer legitimacy and publishes vetted job openings on City Hall bulletin boards and the official PESO Malaybalay Facebook Page so jobseekers access accurate labor market information.",
    classification: "Simple",
    transactionType: "Government to Citizens (G2C) / Employers",
    processingTime: "1 Day & 7 Minutes",
    fee: "None",
    whoMayAvail: "Employers and Malaybalay City jobseekers",
    requirements: [
      "Letter of Intent",
      "DTI / SEC Registration Certificate",
      "Updated Business Permit",
      "Company Profile & Detailed Job Vacancy List",
    ],
    steps: [
      "Employer submits requirements to PESO Malaybalay City.",
      "PESO verifies employer credentials, checks vacancy legitimacy, and prepares posting materials (1 day & 2 minutes).",
      "PESO Manager approves and staff publish vacancy on bulletin boards and official social media (5 minutes).",
      "Optional applicant referral monitoring upon employer request.",
    ],
    charterPageRef: "2026 Citizen's Charter, pp. 534–535 (PDF pp. 553–554)",
  },
  {
    id: "spes-wap",
    number: 4,
    title: "Special Program for the Employment of Students (SPES) & Work Appreciation Program (WAP)",
    description:
      "DOLE-initiated youth employment program providing temporary paid work during summer or Christmas breaks to help poor but deserving students and Out-of-School Youth stay in school.",
    classification: "Simple",
    transactionType: "Government to Citizens (G2C)",
    processingTime: "1 Day, 7 Hours & 35 Minutes",
    fee: "None",
    whoMayAvail: "Qualified Malaybalay City student and out-of-school youth residents",
    requirements: [
      "Email registration / SPES Form 2A application",
      "School enrollment / academic credentials and household income proof per DOLE-10 SPES cycle guidelines",
    ],
    steps: [
      "Submit online job registration via pesomalaybalaycity@gmail.com for validation and assessment (1 day).",
      "Join official raffle draw (if oversubscribed) and check posted list of beneficiaries (3 hours 10 minutes).",
      "Complete SPES Form 2A, undergo interview, and sign Employment Contract (4 hours).",
      "Attend pre-deployment orientation, complete DOLE Field Office validation, and report for work (25 minutes).",
    ],
    charterPageRef: "2026 Citizen's Charter, pp. 536–537 (PDF pp. 555–556)",
  },
  {
    id: "peso-certification",
    number: 5,
    title: "Issuance of PESO Employment Certification",
    description:
      "Issues official PESO Certification in the PESO Employment Information System (PEIS) required by Malaybalay employers for newly hired and local workers.",
    classification: "Simple",
    transactionType: "Government to Citizens (G2C)",
    processingTime: "8 Minutes",
    fee: "None",
    whoMayAvail: "Malaybalay City residents and newly hired workers",
    requirements: ["Valid Government-Issued ID", "Accomplished NSRP Form 1 (Jobseekers Form)"],
    steps: [
      "Approach the PESO Desk Officer for NSRP Form 1 (1 minute).",
      "Fill out NSRP Form 1; staff encode registration in PEIS (5 minutes).",
      "Print and approve PESO Certification (2 minutes).",
      "Claim certification and sign the PESO record book.",
    ],
    charterPageRef: "2026 Citizen's Charter, pp. 537–538 (PDF pp. 556–557)",
  },
  {
    id: "livelihood-endorsement",
    number: 6,
    title: "PESO Endorsement & Certification for Low-Income Earners (Livelihood)",
    description:
      "Assesses, certifies, and endorses qualified individuals, groups, or community associations seeking livelihood startup or enhancement support from DOLE and partner institutions.",
    classification: "Simple",
    transactionType: "Government to Citizens (G2C)",
    processingTime: "1 Day & 4 Minutes",
    fee: "None",
    whoMayAvail: "Qualified low-income Malaybalay City individuals, groups, or associations",
    requirements: [
      "PESO Registration Form & 1x1 ID Picture",
      "Photocopy of Valid ID",
      "Barangay Certification of Residency",
      "Simple Business Plan / Project Proposal & Picture of Project Location",
      "Certificate of Registration (for associations/organizations)",
    ],
    steps: [
      "Submit complete documentary checklist to the PESO Desk Officer (2 minutes).",
      "Interview and livelihood eligibility validation (1 day).",
      "Prepare and approve Livelihood Endorsement Letter / Certification (2 minutes).",
      "Claim endorsement letter and sign record book.",
    ],
    charterPageRef: "2026 Citizen's Charter, pp. 538–540 (PDF pp. 557–559)",
  },
  {
    id: "ojt-facilitation",
    number: 7,
    title: "On-the-Job Training (OJT) Student Internship Facilitation",
    description:
      "Places 4th-year college student interns in City Government of Malaybalay departments under active school Memoranda of Agreement (MOA) for hands-on public sector practicum.",
    classification: "Simple",
    transactionType: "Government to Citizens (G2C)",
    processingTime: "20 Minutes",
    fee: "None",
    whoMayAvail: "4th-year student interns residing or studying in Malaybalay City",
    requirements: ["Active School Memorandum of Agreement (MOA)", "Student Letter of Intent"],
    steps: [
      "Inquire at PESO Desk to verify updated university/school MOA (2 minutes).",
      "Submit Letter of Intent and receive office assignment endorsement (5 minutes).",
      "Attend pre-deployment orientation on workplace rules before reporting to assigned office (13 minutes).",
    ],
    charterPageRef: "2026 Citizen's Charter, pp. 540–541 (PDF pp. 559–560)",
  },
  {
    id: "career-guidance",
    number: 8,
    title: "Career Guidance Advocacy Program (CGAP)",
    description:
      "DOLE-partnered school advocacy program helping Grade 10 learners align senior high tracks, college courses, and technical-vocational pathways with real regional labor market demand.",
    classification: "Simple",
    transactionType: "Government to Citizens (G2C)",
    processingTime: "2 Minutes (scheduling) + School Session",
    fee: "None",
    whoMayAvail: "Grade 10 students & schools in Malaybalay City",
    requirements: ["School / DepEd Request Letter of Intent"],
    steps: [
      "Coordinate Letter of Intent through DepEd Malaybalay City Division and PESO.",
      "PESO provides scheduled Career Guidance Advocacy Program session date for the school (2 minutes).",
    ],
    charterPageRef: "2026 Citizen's Charter, pp. 541–542 (PDF pp. 560–561)",
  },
  {
    id: "ofw-support",
    number: 9,
    title: "Support Services & Referral Desk for Overseas Filipino Workers (OFWs)",
    description:
      "Provides welfare guidance, documentation help, and formal referrals to the Department of Migrant Workers (DMW) and Overseas Workers Welfare Administration (OWWA) for OFWs and direct family.",
    classification: "Simple",
    transactionType: "Government to Citizens (G2C)",
    processingTime: "1 Day & 8 Minutes",
    fee: "None",
    whoMayAvail: "OFWs and direct family members residing in Malaybalay City",
    requirements: [
      "PESO OFW Request Form",
      "Birth Certificate (OFW & requesting party)",
      "Photocopy of Valid ID & OFW Passport",
      "Written Authorization from Direct Family (if representative)",
    ],
    steps: [
      "Submit requirements to PESO Desk Officer and complete initial profiling interview (7 minutes).",
      "Coordinate referral / endorsement directly with DMW or OWWA (1 day).",
      "Receive status updates and sign record book (1 minute).",
    ],
    charterPageRef: "2026 Citizen's Charter, pp. 542–544 (PDF pp. 561–563)",
  },
  {
    id: "job-fair",
    number: 10,
    title: "Malaybalay City Job Fair Facilitation",
    description:
      "Multi-employer hiring event coordinated with DOLE Region 10 and City offices—typically hosted at the People's Hall, New City Hall—bringing screened local and overseas employers directly to Malaybalay jobseekers.",
    classification: "Simple",
    transactionType: "Government to Citizens (G2C)",
    processingTime: "2 Days & 20 Minutes (coordination cycle)",
    fee: "None",
    whoMayAvail: "Malaybalay City jobseekers and DOLE-cleared participating employers",
    requirements: [
      "For Jobseekers: Updated resume, valid IDs, transcripts/certificates, and registration at venue/PESO desk",
      "For Employers: Letter of Intent, DOLE Job Fair Clearance Application Form, and approved vacancies",
    ],
    steps: [
      "PESO coordinates with DOLE Region 10 on Job Fair Clearance and publishes employer list on bulletin boards & PESO Facebook (1 day).",
      "Set up booths, register jobseekers on-site, and match applicants with participating employers (1 day & 10 minutes).",
      "Consolidate placement results and submit Terminal Report (10 minutes).",
    ],
    charterPageRef: "2026 Citizen's Charter, pp. 544–546 (PDF pp. 563–565)",
  },
];

export const opportunityTypeSchema = z.enum([
  "job-vacancy",
  "livelihood-program",
  "job-fair",
  "skills-training",
  "recruitment-event",
]);
export type OpportunityType = z.infer<typeof opportunityTypeSchema>;

export const publicationStatusSchema = z.enum(["published", "draft", "archived"]);
export type PublicationStatus = z.infer<typeof publicationStatusSchema>;

export const employmentTypeSchema = z.enum([
  "Permanent (Plantilla)",
  "Contractual / JO",
  "Full-Time",
  "Part-Time / Seasonal",
  "Internship / OJT",
  "Program Benefit",
  "Not specified",
]);
export type EmploymentType = z.infer<typeof employmentTypeSchema>;

const safeUrlSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (!val) return false;
      if (val.startsWith("/")) return !val.startsWith("//");
      try {
        const parsed = new URL(val);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
      } catch {
        return false;
      }
    },
    { message: "Must be a valid http(s) URL or local relative path." },
  );

const optionalSafeUrlSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine(
    (val) => {
      if (!val) return true;
      if (val.startsWith("/")) return !val.startsWith("//");
      try {
        const parsed = new URL(val);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
      } catch {
        return false;
      }
    },
    { message: "Optional URL must be empty or use http(s)/local path." },
  );

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const pesoOpportunityInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters.")
    .max(96, "Slug must be 96 characters or fewer.")
    .regex(/^[a-z0-9-]+$/, "Slug must use lowercase letters, numbers, and hyphens only."),
  title: z.string().trim().min(4, "Title is required.").max(160),
  opportunityType: opportunityTypeSchema,
  employer: z.string().trim().min(2, "Employer or organizing agency is required.").max(160),
  location: z.string().trim().min(2, "Location or venue is required.").max(180),
  vacanciesCount: z.coerce.number().int().min(1).max(5000).optional(),
  employmentType: employmentTypeSchema.default("Not specified"),
  salaryGradeOrCompensation: z.string().trim().max(140).optional(),
  cardSummary: z.string().trim().max(180).optional(),
  description: z.string().trim().min(16, "Provide an accurate summary description.").max(2500),
  qualifications: z.array(z.string().trim().min(1).max(300)).min(1, "Add at least one qualification or eligibility item.").max(20),
  requirements: z.array(z.string().trim().min(1).max(300)).min(1, "Add at least one documentary requirement.").max(20),
  applicationProcess: z.array(z.string().trim().min(1).max(400)).min(1, "Add at least one application step.").max(15),
  contactDetails: z.array(z.string().trim().min(1).max(160)).min(1, "Add at least one official contact detail.").max(10),
  publishedDate: z.string().trim().regex(isoDateRegex, "Use YYYY-MM-DD date format."),
  deadlineDate: z
    .string()
    .trim()
    .regex(isoDateRegex, "Deadline must use YYYY-MM-DD format.")
    .optional()
    .or(z.literal("")),
  isRecurringProgram: z.boolean().default(false),
  publicationStatus: publicationStatusSchema.default("published"),
  sourceLabel: z.string().trim().min(3, "Source label is required.").max(160),
  sourceUrl: safeUrlSchema,
  applicationUrl: optionalSafeUrlSchema,
  posterUrl: optionalSafeUrlSchema,
  notes: z.string().trim().max(500).optional(),
});

export type PesoOpportunityInput = z.infer<typeof pesoOpportunityInputSchema>;

export const pesoOpportunitySchema = pesoOpportunityInputSchema.extend({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  createdBy: z.enum(["verified-seed", "peso-admin"]),
  seedLocked: z.boolean().optional(),
});

export type PesoOpportunity = z.infer<typeof pesoOpportunitySchema>;

export type OpportunityDisplayStatus =
  | "active"
  | "closing-soon"
  | "expired"
  | "archived"
  | "recurring-program"
  | "draft";

export type OpportunityLifecycleResult = {
  displayStatus: OpportunityDisplayStatus;
  label: string;
  isExpired: boolean;
  isVisibleToPublic: boolean;
  daysRemaining: number | null;
};

/** Returns calendar date YYYY-MM-DD in Asia/Manila (UTC+8). */
export function getManilaDateIso(date = new Date()): string {
  const manilaMs = date.getTime() + 8 * 60 * 60 * 1000;
  return new Date(manilaMs).toISOString().slice(0, 10);
}

/**
 * Automatically derives expiration / closing-soon / active / recurring / archived
 * status from an opportunity's deadlineDate and publicationStatus without manual overrides.
 */
export function resolveOpportunityLifecycle(
  opportunity: Pick<PesoOpportunity, "publicationStatus" | "deadlineDate" | "isRecurringProgram">,
  referenceDate = new Date(),
): OpportunityLifecycleResult {
  if (opportunity.publicationStatus === "draft") {
    return {
      displayStatus: "draft",
      label: "Draft (Admin only)",
      isExpired: false,
      isVisibleToPublic: false,
      daysRemaining: null,
    };
  }
  if (opportunity.publicationStatus === "archived") {
    return {
      displayStatus: "archived",
      label: "Archived",
      isExpired: true,
      isVisibleToPublic: true,
      daysRemaining: null,
    };
  }

  const deadline = opportunity.deadlineDate?.trim();
  if (deadline && isoDateRegex.test(deadline)) {
    const todayIso = getManilaDateIso(referenceDate);
    const todayUtc = Date.parse(`${todayIso}T00:00:00Z`);
    const deadlineUtc = Date.parse(`${deadline}T00:00:00Z`);
    const diffDays = Math.round((deadlineUtc - todayUtc) / 86_400_000);

    if (diffDays < 0) {
      return {
        displayStatus: "expired",
        label: `Expired (${deadline})`,
        isExpired: true,
        isVisibleToPublic: true,
        daysRemaining: diffDays,
      };
    }
    if (diffDays <= 7) {
      return {
        displayStatus: "closing-soon",
        label: diffDays === 0 ? "Closes today" : `Closing soon (${diffDays}d left)`,
        isExpired: false,
        isVisibleToPublic: true,
        daysRemaining: diffDays,
      };
    }
    return {
      displayStatus: "active",
      label: `Open until ${deadline}`,
      isExpired: false,
      isVisibleToPublic: true,
      daysRemaining: diffDays,
    };
  }

  if (opportunity.isRecurringProgram) {
    return {
      displayStatus: "recurring-program",
      label: "Ongoing PESO Program",
      isExpired: false,
      isVisibleToPublic: true,
      daysRemaining: null,
    };
  }

  return {
    displayStatus: "active",
    label: "Active Posting",
    isExpired: false,
    isVisibleToPublic: true,
    daysRemaining: null,
  };
}

export function slugifyOpportunityTitle(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

const SEED_TIMESTAMP = "2026-11-20T00:00:00Z";

function seedProgram(
  data: Omit<PesoOpportunity, "createdAt" | "updatedAt" | "createdBy" | "seedLocked">,
): PesoOpportunity {
  return {
    ...data,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    createdBy: "verified-seed",
    seedLocked: true,
  };
}

function csc2024Vacancy(params: {
  slug: string;
  itemNo: string;
  plantillaItem: string;
  title: string;
  sg: string;
  salary: string;
  office: string;
  education: string;
  training: string;
  experience: string;
  eligibility: string;
}): PesoOpportunity {
  return {
    id: `seed-${params.slug}`,
    slug: params.slug,
    title: params.title,
    opportunityType: "job-vacancy",
    employer: `City Government of Malaybalay — ${params.office}`,
    location: "New City Hall / Concerned Department, Brgy. Casisang, Malaybalay City",
    vacanciesCount: 1,
    employmentType: "Permanent (Plantilla)",
    salaryGradeOrCompensation: `Salary Grade ${params.sg} — ₱${params.salary} / month`,
    cardSummary: `CSC Form No. 9 Item ${params.itemNo} (SG-${params.sg}) closed August 31, 2024; kept for qualification and salary benchmarking.`,
    description: `Civil Service Commission (CS Form No. 9, Revised 2017) Publication 2024 (4th Tranche) Item No. ${params.itemNo} (Plantilla Item ${params.plantillaItem}) assigned to ${params.office}. Applications closed on August 31, 2024.`,
    qualifications: [
      `Education: ${params.education}`,
      `Training: ${params.training}`,
      `Experience: ${params.experience}`,
      `Eligibility: ${params.eligibility}`,
    ],
    requirements: [
      "Application Letter addressed to the City Mayor through the City HRMO (Magnolia O. Improgo)",
      "Fully accomplished Personal Data Sheet (CS Form No. 212, Revised 2017) with Work Experience Sheet",
      "Performance rating in the last rating period (if applicable)",
      "Photocopy of Certificate of Eligibility / PRC Rating / License",
      "Photocopy of Transcript of Records",
    ],
    applicationProcess: [
      "This CS Form No. 9 (4th Tranche) batch closed on August 31, 2024. Do not submit applications for expired plantilla items unless republished by CHRMO.",
      "For active LGU Malaybalay openings, check sakata.malaybalaycity.gov.ph/job-opportunities-2/ or inquire at CHRMO (2nd Floor, New City Hall).",
    ],
    contactDetails: [
      "City HRMO (Magnolia O. Improgo): 0975-601-2867",
      "Email: malaybalaychrmo@gmail.com",
      "2nd Floor, New City Hall, Brgy. Casisang, Malaybalay City",
    ],
    publishedDate: "2024-08-16",
    deadlineDate: "2024-08-31",
    isRecurringProgram: false,
    publicationStatus: "published",
    sourceLabel: "LGU Malaybalay CS Form No. 9 Publication (4th Tranche, Aug 16, 2024)",
    sourceUrl: CSC_FORM_9_2024_URL,
    notes:
      "Indexed from the verified August 16–31, 2024 CS Form No. 9 batch (92 plantilla items) so Malaybalay jobseekers can benchmark required CSC eligibility and salary grades.",
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    createdBy: "verified-seed",
    seedLocked: true,
  };
}

/**
 * Initial verified PESO opportunities and CS Form No. 9 reference postings.
 * Never invent unverified employers, salaries, deadlines, or application links.
 */
export const INITIAL_PESO_OPPORTUNITIES: PesoOpportunity[] = [
  seedProgram({
    id: "seed-peso-nsrp-job-matching",
    slug: "peso-nsrp-jobseeker-registration-matching",
    title: "NSRP Jobseeker Registration & Employer Job Matching (Ongoing)",
    opportunityType: "recruitment-event",
    employer: "PESO Malaybalay City & Accredited Local Employers",
    location: "PESO Desk, 2nd Floor, New City Hall, Brgy. Casisang, Malaybalay City",
    employmentType: "Not specified",
    cardSummary: "Walk-in and email NSRP profiling that matches jobseekers with accredited Malaybalay and regional employers.",
    description:
      "Walk-in and email-based jobseeker profiling via the National Skills Registration Program (NSRP). Once enrolled, PESO matches applicants with accredited local establishments, retail/service firms, agribusinesses, and regional openings.",
    qualifications: [
      "Malaybalay City residents and Bukidnon jobseekers actively looking for work",
      "Open across skill levels (entry-level, skilled trades, office, professional)",
    ],
    requirements: [
      "NSRP Jobseekers Profile Form (provided free at PESO Desk)",
      "Updated resume / bio-data and valid government-issued ID",
    ],
    applicationProcess: [
      "Email your resume/application to pesomalaybalaycity@gmail.com OR drop by PESO (Mon–Fri, 8:00 AM–5:00 PM) to fill out the NSRP Form.",
      "PESO staff process your profile (5 min), perform job matching (5 min), and issue referrals to matching employers (5 min).",
      "Total Citizen's Charter processing time: 15 minutes; Zero fees.",
    ],
    contactDetails: [
      "Mobile (Charter 2026): 0907-688-5735",
      "Mobile (LGU Directory): 0915-542-3434 / 0912-163-5505",
      "Email: pesomalaybalaycity@gmail.com",
    ],
    publishedDate: "2026-01-05",
    isRecurringProgram: true,
    publicationStatus: "published",
    sourceLabel: "2026 Citizen's Charter — PESO Service #1 (Employment Facilitation)",
    sourceUrl: CITIZENS_CHARTER_2026_URL,
    applicationUrl: PESO_FACEBOOK_PAGE_URL,
  }),
  seedProgram({
    id: "seed-peso-job-fair-peoples-hall",
    slug: "peso-malaybalay-job-fair-facilitation",
    title: "Malaybalay City PESO Job Fair (Local & Overseas Recruitment)",
    opportunityType: "job-fair",
    employer: "PESO Malaybalay City & DOLE Region 10 — Participating Employers",
    location: "People's Hall, New City Hall, Barangay Casisang, Malaybalay City (Standard Venue)",
    employmentType: "Full-Time",
    cardSummary: "Multi-employer hiring events with DOLE Region 10 and DMW agencies for on-the-spot screening and interviews.",
    description:
      "Periodic multi-employer hiring events organized by PESO Malaybalay with DOLE Region 10 and DMW/OWWA-cleared agencies, bringing dozens of local and overseas employers together for on-the-spot screening and interviews.",
    qualifications: [
      "Malaybalay City jobseekers of legal working age",
      "Bring multiple copies of credentials for multi-booth screening",
    ],
    requirements: [
      "Multiple sets of updated Resume / CV & application letters",
      "Government-issued ID, Diploma / Transcript of Records, and Certificate of Employment (if experienced)",
      "For overseas applicants: Valid Passport (if available)",
    ],
    applicationProcess: [
      "Confirm the next announced Job Fair date on the official PESO Facebook Page or at City Hall.",
      "Register at the PESO registration desk on-site and browse the DOLE-cleared employer directory.",
      "Proceed directly to employer booths for screening and interviews.",
    ],
    contactDetails: [
      "PESO Malaybalay Desk: 0907-688-5735 / 0915-542-3434",
      "Email: pesomalaybalaycity@gmail.com",
    ],
    publishedDate: "2026-01-05",
    isRecurringProgram: true,
    publicationStatus: "published",
    sourceLabel: "2026 Citizen's Charter — PESO Service #10 (Job Fair)",
    sourceUrl: PESO_FACEBOOK_PAGE_URL,
    applicationUrl: PESO_FACEBOOK_PAGE_URL,
  }),
  seedProgram({
    id: "seed-peso-spes-wap",
    slug: "dole-lgu-spes-work-appreciation-program",
    title: "SPES & Work Appreciation Program (DOLE–LGU Student Employment)",
    opportunityType: "livelihood-program",
    employer: "DOLE Region 10 & City Government of Malaybalay (PESO)",
    location: "City Government Offices & Partner Establishments, Malaybalay City",
    employmentType: "Part-Time / Seasonal",
    salaryGradeOrCompensation: "DOLE 40% + LGU 60% wage share (cycle rate per DOLE-10)",
    cardSummary: "DOLE–LGU seasonal paid employment program under RA 10917 for college, SHS, and Out-of-School Youth students.",
    description:
      "Flagship student employment initiative giving poor but deserving college/SHS students and Out-of-School Youth short-term paid work during summer or Christmas breaks under RA 10917.",
    qualifications: [
      "Poor but deserving student or Out-of-School Youth residing in Malaybalay City",
      "Meets DOLE-10 SPES age, academic passing grade, and household income threshold",
    ],
    requirements: [
      "Accomplished SPES Form 2A & online pre-registration",
      "Latest grades/report card and School Registration Certificate",
      "PSA Birth Certificate & Barangay Indigency / Parents' Tax Exemption proof",
    ],
    applicationProcess: [
      "Wait for PESO Malaybalay seasonal cycle opening notice.",
      "Email application requirements to pesomalaybalaycity@gmail.com for screening and validation (1 day).",
      "Participate in official raffle/shortlisting, contract signing, DOLE FO validation, and orientation prior to deployment.",
    ],
    contactDetails: [
      "PESO Malaybalay City: 0907-688-5735",
      "Email: pesomalaybalaycity@gmail.com",
    ],
    publishedDate: "2026-01-05",
    isRecurringProgram: true,
    publicationStatus: "published",
    sourceLabel: "2026 Citizen's Charter — PESO Service #4 (SPES & WAP)",
    sourceUrl: CITIZENS_CHARTER_2026_URL,
  }),
  seedProgram({
    id: "seed-peso-tupad-livelihood",
    slug: "dole-lgu-tupad-emergency-employment",
    title: "TUPAD Community Emergency Employment (DOLE–LGU Coordination)",
    opportunityType: "livelihood-program",
    employer: "DOLE Region 10, Barangay Councils & PESO Malaybalay",
    location: "Participating Barangay Sites & New City Hall Orientation Desk, Malaybalay City",
    employmentType: "Part-Time / Seasonal",
    salaryGradeOrCompensation: "DOLE-10 emergency work stipend (regional minimum wage basis)",
    cardSummary: "DOLE emergency community work orientations, barangay beneficiary endorsement, and payout coordination.",
    description:
      "Tulong Panghanapbuhay sa Ating Disadvantaged/Displaced Workers (TUPAD) community work orientations, barangay beneficiary endorsement, and payout coordination conducted with DOLE Bukidnon Provincial Field Office.",
    qualifications: [
      "Underemployed, seasonal, informal-sector, or displaced worker residing in Malaybalay City",
      "Indigent household beneficiary endorsed through the Barangay Council and validated by DOLE Region 10",
    ],
    requirements: [
      "Valid Government-Issued ID & Barangay Certificate of Residency / Indigency",
      "Accomplished DOLE TUPAD Beneficiary Profile Form during barangay profiling",
    ],
    applicationProcess: [
      "Inquire at your Barangay Hall for active TUPAD beneficiary profiling slots or watch PESO announcements.",
      "Attend mandatory DOLE–PESO safety and work-scope orientation prior to community deployment.",
      "Complete the assigned community work days and claim payout per DOLE Bukidnon disbursement schedule.",
    ],
    contactDetails: [
      "PESO Malaybalay Desk: 0907-688-5735 / 0915-542-3434",
      "Email: pesomalaybalaycity@gmail.com",
    ],
    publishedDate: "2026-01-05",
    isRecurringProgram: true,
    publicationStatus: "published",
    sourceLabel: "DOLE-10 Bukidnon Reports & PESO Official Facebook Page",
    sourceUrl: PESO_FACEBOOK_PAGE_URL,
  }),
  seedProgram({
    id: "seed-peso-livelihood-endorsement",
    slug: "peso-livelihood-endorsement-low-income",
    title: "PESO Livelihood Endorsement & Certification for Low-Income Earners",
    opportunityType: "livelihood-program",
    employer: "PESO Malaybalay City / DOLE DILEEP & Partner Institutions",
    location: "PESO Office, 2nd Floor, New City Hall, Casisang, Malaybalay City",
    employmentType: "Program Benefit",
    cardSummary: "Assesses and issues PESO endorsements for low-income workers and groups applying for DOLE Kabuhayan kits.",
    description:
      "Assesses and issues formal PESO livelihood endorsements to qualified individuals, workers' groups, and associations applying for DOLE Kabuhayan or partner livelihood starter kits and grants.",
    qualifications: [
      "Qualified low-income Malaybalay City individual, informal worker, or registered community association",
    ],
    requirements: [
      "PESO Registration Form & 1x1 ID Picture",
      "Valid ID (photocopy) & Barangay Certification of Residency",
      "Simple Business Plan / Project Proposal & Photo of Project Location",
      "Certificate of Registration (if applying as an association)",
    ],
    applicationProcess: [
      "Submit complete requirements to PESO Desk Officer (2 minutes).",
      "Complete validation interview (1 day).",
      "Receive Livelihood Endorsement Letter and Certification (2 minutes).",
    ],
    contactDetails: [
      "PESO Desk: 0907-688-5735",
      "Email: pesomalaybalaycity@gmail.com",
    ],
    publishedDate: "2026-01-05",
    isRecurringProgram: true,
    publicationStatus: "published",
    sourceLabel: "2026 Citizen's Charter — PESO Service #6",
    sourceUrl: CITIZENS_CHARTER_2026_URL,
  }),
  seedProgram({
    id: "seed-peso-ojt-internship",
    slug: "peso-lgu-ojt-student-internship",
    title: "LGU Malaybalay Student On-the-Job Training (OJT) Placement",
    opportunityType: "skills-training",
    employer: "City Government of Malaybalay (Hosted via PESO)",
    location: "Assigned City Hall Departments & Field Offices, Malaybalay City",
    employmentType: "Internship / OJT",
    cardSummary: "Places 4th-year college students with active school MOAs into LGU Malaybalay offices for practicum hours.",
    description:
      "Places 4th-year college students in City Government offices for required academic practicum hours, guided by school Memoranda of Agreement and workplace orientations.",
    qualifications: [
      "Enrolled 4th-year / graduating college student with active school MOA with LGU Malaybalay",
    ],
    requirements: [
      "School-LGU Memorandum of Agreement (MOA) verification",
      "Student Letter of Intent / School Endorsement",
    ],
    applicationProcess: [
      "Verify active school MOA at PESO Desk (2 minutes).",
      "Submit Letter of Intent to receive department assignment endorsement (5 minutes).",
      "Attend PESO pre-deployment orientation (13 minutes) before starting practicum.",
    ],
    contactDetails: [
      "PESO Desk: 0907-688-5735 / 0915-542-3434",
      "Email: pesomalaybalaycity@gmail.com",
    ],
    publishedDate: "2026-01-05",
    isRecurringProgram: true,
    publicationStatus: "published",
    sourceLabel: "2026 Citizen's Charter — PESO Service #7 (OJT Facilitation)",
    sourceUrl: CITIZENS_CHARTER_2026_URL,
  }),
  seedProgram({
    id: "seed-peso-ofw-desk",
    slug: "peso-ofw-dmw-owwa-referral-desk",
    title: "OFW Protection, Reintegration & DMW / OWWA Support Desk",
    opportunityType: "livelihood-program",
    employer: "PESO Malaybalay City in coordination with DMW & OWWA",
    location: "PESO Office, 2nd Floor, New City Hall, Casisang, Malaybalay City",
    employmentType: "Program Benefit",
    cardSummary: "Assists active, returning, or distressed OFWs and families with DMW and OWWA welfare and reintegration referrals.",
    description:
      "Dedicated help desk assisting active, returning, or distressed Overseas Filipino Workers and their families with profiling, welfare referrals, reintegration advice, and coordination with DMW and OWWA.",
    qualifications: [
      "OFWs or direct family members residing in Malaybalay City",
    ],
    requirements: [
      "PESO Request Form & Photocopy of Valid ID",
      "OFW Passport & Birth Certificate (OFW and requesting family member)",
      "Authorization from direct family (if filed by representative)",
    ],
    applicationProcess: [
      "Submit documents at PESO Desk for initial interview and profiling (7 minutes).",
      "PESO coordinates directly with DMW or OWWA Region 10 (1 day).",
      "Receive feedback and ongoing case follow-up.",
    ],
    contactDetails: [
      "PESO Desk: 0907-688-5735",
      "Email: pesomalaybalaycity@gmail.com",
    ],
    publishedDate: "2026-01-05",
    isRecurringProgram: true,
    publicationStatus: "published",
    sourceLabel: "2026 Citizen's Charter — PESO Service #9 (OFW Support)",
    sourceUrl: CITIZENS_CHARTER_2026_URL,
  }),
  seedProgram({
    id: "seed-peso-cgap-schools",
    slug: "peso-dole-career-guidance-advocacy-schools",
    title: "DOLE–DepEd–PESO Career Guidance Advocacy Program (Grade 10 & Youth)",
    opportunityType: "skills-training",
    employer: "PESO Malaybalay City, DOLE-10 & DepEd Schools Division",
    location: "Participating Public & Partner High Schools, Malaybalay City",
    employmentType: "Program Benefit",
    cardSummary: "Grade 10 career guidance orientations aligning senior high tracks, scholarships, and TESDA trades with local jobs.",
    description:
      "School-based labor market orientation helping Grade 10 learners align senior high tracks, college scholarships, and TESDA trades with Bukidnon and Northern Mindanao employment trends.",
    qualifications: ["Grade 10 learners & participating Malaybalay high schools"],
    requirements: ["School / DepEd Division Request Letter coordinated with PESO"],
    applicationProcess: [
      "School submits Letter of Intent through DepEd Malaybalay Division.",
      "PESO schedules and delivers Career Guidance session at the school.",
    ],
    contactDetails: [
      "PESO: 0907-688-5735 • pesomalaybalaycity@gmail.com",
      "DepEd Malaybalay: 0907-688-9009 / 0991-331-7778",
    ],
    publishedDate: "2026-01-05",
    isRecurringProgram: true,
    publicationStatus: "published",
    sourceLabel: "2026 Citizen's Charter — PESO Service #8 (Career Guidance)",
    sourceUrl: CITIZENS_CHARTER_2026_URL,
  }),

  // --- Verified Historical City Hall Plantilla Vacancies (CSC Form No. 9, 2024 4th Tranche) ---
  // Automatically flagged EXPIRED (Deadline: 2024-08-31)
  csc2024Vacancy({
    slug: "csc-2024-planning-officer-iv-cpdo",
    itemNo: "11",
    plantillaItem: "15",
    title: "Planning Officer IV",
    sg: "22",
    salary: "74,836.00",
    office: "City Planning & Development Office (Planning, Programming & Zoning Administration Division)",
    education: "Bachelor's degree relevant to the job",
    training: "16 hours of relevant training",
    experience: "3 years of relevant experience",
    eligibility: "Career Service (Professional) Second Level Eligibility",
  }),
  csc2024Vacancy({
    slug: "csc-2024-accountant-iii-accounting",
    itemNo: "19",
    plantillaItem: "8",
    title: "Accountant III",
    sg: "19",
    salary: "53,873.00",
    office: "City Accountant's Office (City Financial Accounting Services Division)",
    education: "Bachelor's degree in Commerce/Business Administration major in Accounting",
    training: "8 hours of relevant training",
    experience: "2 years of relevant experience",
    eligibility: "RA 1080 (Certified Public Accountant)",
  }),
  csc2024Vacancy({
    slug: "csc-2024-engineer-iii-agri-biosystems",
    itemNo: "9",
    plantillaItem: "59",
    title: "Engineer III",
    sg: "19",
    salary: "53,873.00",
    office: "City Mayor's Office / Agricultural & Biosystems Engineering Division",
    education: "Bachelor's degree in Agricultural / Civil Engineering relevant to the job",
    training: "8 hours of relevant training",
    experience: "2 years of relevant experience",
    eligibility: "RA 1080 (Licensed Engineer)",
  }),
  csc2024Vacancy({
    slug: "csc-2024-senior-tourism-operations-officer",
    itemNo: "6",
    plantillaItem: "48",
    title: "Senior Tourism Operations Officer",
    sg: "18",
    salary: "49,015.00",
    office: "City Mayor's Office — Tourism Promotion Section",
    education: "Bachelor's degree in tourism, business, law, economics, marketing, or public administration",
    training: "8 hours of relevant training on tourism / DOT mandatory trainings",
    experience: "2 years of relevant experience",
    eligibility: "Career Service (Professional) Second Level Eligibility",
  }),
  csc2024Vacancy({
    slug: "csc-2024-senior-environmental-management-specialist",
    itemNo: "53",
    plantillaItem: "7",
    title: "Senior Environmental Management Specialist",
    sg: "18",
    salary: "49,015.00",
    office: "City Environment & Natural Resources Office (Solid Waste Management Section)",
    education: "Bachelor's degree relevant to the job",
    training: "8 hours of relevant training",
    experience: "2 years of relevant experience",
    eligibility: "Career Service (Professional) Second Level Eligibility",
  }),
  csc2024Vacancy({
    slug: "csc-2024-admin-officer-v-procurement",
    itemNo: "2",
    plantillaItem: "12",
    title: "Administrative Officer V (Administrative Officer III)",
    sg: "18",
    salary: "49,015.00",
    office: "City Mayor's Office — Procurement Support Section (BAC Unit)",
    education: "Bachelor's degree relevant to the job",
    training: "8 hours of relevant training",
    experience: "2 years of relevant experience",
    eligibility: "Career Service (Professional) Second Level Eligibility",
  }),
  csc2024Vacancy({
    slug: "csc-2024-admin-officer-v-cswdo-supply",
    itemNo: "82",
    plantillaItem: "2",
    title: "Administrative Officer V (Supply Officer III)",
    sg: "18",
    salary: "49,015.00",
    office: "City Social Welfare & Development Office (Administrative Support Section)",
    education: "Bachelor's degree",
    training: "8 hours of relevant training",
    experience: "2 years of relevant experience",
    eligibility: "Career Service (Professional) Second Level Eligibility",
  }),
  csc2024Vacancy({
    slug: "csc-2024-admin-officer-v-ceedmo-records",
    itemNo: "88",
    plantillaItem: "2",
    title: "Administrative Officer V (Records Officer III)",
    sg: "18",
    salary: "49,015.00",
    office: "City Economic Enterprise Development & Management Office (CEEDMO)",
    education: "Bachelor's degree",
    training: "8 hours of relevant training",
    experience: "2 years of relevant experience",
    eligibility: "Career Service (Professional) Second Level Eligibility",
  }),
  csc2024Vacancy({
    slug: "csc-2024-pharmacist-i-cho",
    itemNo: "74",
    plantillaItem: "9",
    title: "Pharmacist I",
    sg: "11",
    salary: "28,512.00",
    office: "City Health Office (Health Education & Promotion Division — Pharmacy Unit)",
    education: "Bachelor's degree in Pharmacy",
    training: "None required",
    experience: "None required",
    eligibility: "RA 1080 (Licensed Pharmacist)",
  }),
  csc2024Vacancy({
    slug: "csc-2024-computer-operator-ii-cmo",
    itemNo: "1",
    plantillaItem: "5",
    title: "Administrative Assistant III (Computer Operator II)",
    sg: "9",
    salary: "22,219.00",
    office: "City Mayor's Office (Procurement Support Section)",
    education: "Completion of two years studies in college or High School Graduate with relevant vocational/trade course",
    training: "4 hours of relevant training",
    experience: "1 year of relevant experience",
    eligibility: "Career Service (Subprofessional) / Data Encoder (MC 6, s. 2010) First Level Eligibility",
  }),
  csc2024Vacancy({
    slug: "csc-2024-ldrrm-assistant-cdrrmo",
    itemNo: "86",
    plantillaItem: "4",
    title: "Local Disaster Risk Reduction & Management Assistant",
    sg: "8",
    salary: "20,534.00",
    office: "City Disaster Risk Reduction & Management Office (Research & Planning Division)",
    education: "Completion of 2 years in college",
    training: "4 hours of relevant training",
    experience: "1 year of relevant experience on DRRM",
    eligibility: "Career Service (Subprofessional) First Level Eligibility",
  }),
  csc2024Vacancy({
    slug: "csc-2024-revenue-collection-clerk-i-cto",
    itemNo: "28",
    plantillaItem: "15",
    title: "Revenue Collection Clerk I",
    sg: "5",
    salary: "17,205.00",
    office: "City Treasurer's Office (Revenue Generation Division — Business Unit)",
    education: "Completion of two years studies in college",
    training: "None required",
    experience: "None required",
    eligibility: "Career Service (Subprofessional) First Level Eligibility",
  }),
];

export const PESO_VACANCIES_SUMMARY = {
  publicationTitle: "CSC Form No. 9 Publication 2024 (4th Tranche)",
  publishedDate: "2024-08-16",
  closingDate: "2024-08-31",
  totalPublishedItems: 92,
  departmentBreakdown: [
    { office: "City Engineering Office", items: 19 },
    { office: "City Agriculture Office", items: 11 },
    { office: "City Mayor's Office", items: 9 },
    { office: "City Accountant's Office", items: 9 },
    { office: "City Health Office", items: 8 },
    { office: "City Assessor's Office", items: 5 },
    { office: "City Veterinary Office", items: 5 },
    { office: "CEEDMO", items: 5 },
    { office: "CSWDO", items: 4 },
    { office: "Other Offices (CPDO, CCRO, CGSO, CBO, CTO, Legal, CENRO, CDRRMO, CHRMO)", items: 17 },
  ],
  pdfUrl: CSC_FORM_9_2024_URL,
} as const;
