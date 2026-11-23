export type CivicRecordContext = {
  summary: string;
  publicRelevance: string;
  limits: string;
  provisions?: Array<{ heading: string; text: string; section: string }>;
};

export const civicRecordContext: Record<string, CivicRecordContext> = {
  "Ordinance No. 1132, Series of 2026": {
    summary:
      "Prohibits nailing, wiring, tying, or installing election campaign paraphernalia and commercial advertisement materials on trees located in public places within Malaybalay City.",
    publicRelevance:
      "Enacted by the 10th Sangguniang Panlungsod during its 69th Regular Session on November 10, 2026 and signed by City Mayor Jay Warren R. Pabillaran on November 16, 2026, the measure protects urban and roadside trees from structural damage and designates CENRO as the lead implementing office alongside the Liga ng mga Barangay, City Engineering Office, and Philippine National Police (PNP).",
    limits:
      "Summarized from the official legislative enactment report; consult the signed ordinance text at the Sangguniang Panlungsod Secretariat or CENRO for exact penalty schedules and removal procedures.",
  },
  "Executive Order No. 93, Series of 2026": {
    summary:
      "Establishes an internal patient referral and medical coordination system for residents seeking care at the Malaybalay City Super Health Center in Barangay Aglayan to the Malaybalay City Health Office.",
    publicRelevance:
      "Clarifies the formal referral pathway connecting the Barangay Aglayan Super Health Center and the City Health Office in Freedom Park, Barangay 4 so patients requiring follow-up or specialized primary care receive coordinated handoffs.",
    limits:
      "The order establishes the referral and coordination framework; it does not publish live clinic schedules, patient volumes, or emergency dispatch times. Confirm clinical hours directly with CHO or the Super Health Center.",
  },
  "Executive Order No. 23, Series of 2026": {
    summary:
      "The published title establishes energy-saving procedures and fuel-reduction measures for City Government operations.",
    publicRelevance:
      "The measure concerns how the City Government manages energy and fuel use. Residents can use the official order to review the specific offices, duties, and operating rules covered.",
    limits:
      "The public listing does not by itself report actual fuel savings, energy consumption, or compliance results.",
  },
  "Executive Order No. 19, Series of 2026": {
    summary:
      "The order establishes the Project Monitoring and Evaluation Information System, commonly identified as PMEIS, for city projects.",
    publicRelevance:
      "A monitoring system can support clearer project tracking and more consistent reporting. The order should be read together with published project, procurement, and financial records.",
    limits:
      "The issuance establishes the system; it is not evidence that a particular project was completed, delayed, or evaluated successfully.",
  },
  "Executive Order No. 18, Series of 2026": {
    summary:
      "The order adopts a city manual for epidemiology and public-health surveillance operations.",
    publicRelevance:
      "The measure provides an institutional framework for detecting, reporting, and responding to public-health events within Malaybalay City.",
    limits:
      "This summary does not reproduce clinical procedures or reporting rules. Health workers and offices should consult the complete official manual.",
  },
  "Executive Order No. 17, Series of 2026": {
    summary:
      "The order organizes the Medical Education Subsidy Committee and identifies its functions.",
    publicRelevance:
      "The committee provides an administrative structure for reviewing and managing the city’s medical-education subsidy responsibilities.",
    limits:
      "The listing does not establish individual eligibility, application requirements, benefit amounts, or approval of any applicant.",
  },
  "Executive Order No. 15, Series of 2026": {
    summary:
      "The order establishes an anti-sexual-harassment referral network under the Safe Spaces Act.",
    publicRelevance:
      "The network is intended to clarify institutional referral and coordination responsibilities for complaints and support services.",
    limits:
      "This record is not an emergency-reporting channel. People needing immediate assistance should contact the responsible emergency or law-enforcement office.",
  },
  "Executive Order No. 08, Series of 2026": {
    summary:
      "The order creates the Malaybalay City Task Force identified in the official title as the Task Force Anti-Bora-Bora.",
    publicRelevance:
      "The issuance documents the creation of a city task force and provides the official record needed to review its membership and responsibilities.",
    limits:
      "The published title alone does not adequately define the term “Bora-Bora” or the task force’s complete operating scope. Consult the original order for those details.",
  },
  "Ordinance No. 1118, Series of 2026": {
    summary:
      "The ordinance institutionalizes an annual Sangguniang Kabataan Functionality Audit, including assessment mechanisms, criteria, incentives, and funding.",
    publicRelevance:
      "All 46 barangay SK councils are covered. The audit reviews documentation, plans, projects, finances, leadership, and youth programmes, and provides coaching and recognition based on results.",
    limits:
      "The ordinance establishes an audit process; it does not publish any barangay's audit results. The linked scan is the controlling text. BetterMC's explanation is a reading aid, not a legal interpretation.",
    provisions: [
      { heading: "Who is assessed", text: "The audit covers the SK council of each of Malaybalay City's 46 barangays. A city audit team chaired by the mayor develops the tool, conducts assessment, and recommends support for councils that need it.", section: "Sections 5–6" },
      { heading: "What is reviewed", text: "The six main areas are organizational effectiveness, development planning, project implementation, financial administration, leadership, and the youth development agenda. Documented innovation is a bonus area.", section: "Section 7" },
      { heading: "When it happens", text: "The annual cycle provides coaching from January to March, self-assessment in April and May, field verification in June, and final rating consolidation in July.", section: "Section 9" },
      { heading: "Support and funding", text: "The ordinance provides annual recognition in August, capacity development for councils rated Progressing or Basic, and an initial annual appropriation of ₱1,000,000 from the LGU General Fund for audit operations and incentives.", section: "Sections 10–11 and 14" },
      { heading: "Named author", text: "The signed document identifies Hon. Cristopher Lambert N. Tortola as the author. The measure was enacted by the Sangguniang Panlungsod and approved by the city mayor.", section: "Page 1 and signature page" },
    ],
  },
  "Ordinance No. 1092, Series of 2026": {
    summary:
      "The ordinance adopts the provincial declaration of March as Real Property Tax Month to encourage public awareness, assessment, and timely payment.",
    publicRelevance:
      "Residents and property owners can use the measure as a guide to the city’s annual information and payment-awareness period.",
    limits:
      "The title does not change an individual taxpayer’s assessed liability or replace the City Treasurer’s official assessment and payment instructions.",
  },
  "Ordinance No. 1095, Series of 2026": {
    summary:
      "The ordinance amends Section 4 of the earlier measure covering the automatic fare matrix and pakyaw fare matrix for motorela operations.",
    publicRelevance:
      "The measure affects the local rules used to determine or display motorela fares in Malaybalay City.",
    limits:
      "This summary does not state fare amounts. Operators and passengers should consult the complete ordinance and the currently posted official fare matrix.",
  },
  "Ordinance No. 1083, Series of 2026": {
    summary:
      "The ordinance institutionalizes Ms. Malaybalay and provides guidelines, terms, and conditions for the city activity.",
    publicRelevance:
      "Institutionalization places the activity within a continuing city policy framework rather than treating it only as a one-time event.",
    limits:
      "The public title does not contain the complete eligibility, selection, funding, or implementation rules.",
  },
  "Ordinance No. 1077, Series of 2026": {
    summary:
      "The ordinance establishes the Search for Model Family Awards in Malaybalay City.",
    publicRelevance:
      "The measure creates a formal city recognition program focused on families and provides the legal basis for its implementation.",
    limits:
      "The listing does not provide the complete nomination process, judging criteria, award schedule, or list of recipients.",
  },
  "Memorandum Circular No. 38": {
    summary:
      "The official announcement identifies Memorandum Circular No. 38, but the reviewed page does not expose enough searchable text to summarize its directive responsibly.",
    publicRelevance:
      "BetterMC keeps the record visible so residents know that a circular was published and can request a clearer accessible copy from the responsible office.",
    limits:
      "The issuing authority, full subject, operative instructions, and named recipients remain unverified from the available page text.",
  },
};
