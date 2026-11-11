# BetterMC research inventory

Research review date: **2026-11-11 (Asia/Manila)**

## Primary official sources reviewed

| Area | Official source | What was verified | Current implementation boundary |
| --- | --- | --- | --- |
| Full Disclosure | [Malaybalay Full Disclosure](https://sakata.malaybalaycity.gov.ph/full-disclosure/) | Catalog availability for 2022–2026; annual budget and procurement; quarterly financial, utilization, bid-result, and staffing categories | Catalog implemented. The 2025 Q2 Statement of Receipts and Expenditures is transcribed separately with accounting labels preserved. A listed title is not a verification of every value inside its linked file. |
| Legislative leadership | [Legislative](https://sakata.malaybalaycity.gov.ph/legislative/) and the 14 linked individual profile pages | Vice mayor, ten councilors, ABC president, IPMR, and SK federation president | Searchable, expandable directory implemented. The individual pages establish identity but publish neither unique councilor contacts nor a sponsor-authored measure ledger. The shared legislative contact is labeled as office routing, not personal contact. |
| Executive | [Executive](https://sakata.malaybalaycity.gov.ph/executive/) | City mayor identity in the official city-government section | Profile listing implemented without an unverified term date. |
| Offices | [Departments / Offices](https://sakata.malaybalaycity.gov.ph/departments-offices/) and [Contact Us](https://sakata.malaybalaycity.gov.ph/contact-us/) | Office names, published telephone/mobile numbers, and emails | Searchable office and hotline directory implemented. Contact details should be rechecked quarterly. |
| Barangays | [City barangay list](https://sakata.malaybalaycity.gov.ph/list-of-barangay/) and [DILG Barangay Officials Directory](https://www.dilg.gov.ph/barangay-officials-directory/index) | 46 barangay names, DILG-listed Punong Barangay names, and available public contact fields | Valid published contacts are shown. Incomplete or malformed contact values are withheld and labeled unavailable. |
| Services | [2024 Citizen's Charter](https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2025/03/CITIZENS-CHARTER-2024-1.pdf) | Official service-standard PDF and city service entry points | Direct official entry points implemented. Service-by-service transcription remains a later verified-data task. |
| Finances | [2025 Q2 Statement of Receipts and Expenditures](https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/01/Q2_Statement_of_Receipts_and_Expenditures_compressed.pdf) | Operating income, sector spending, non-operating spending, fund movement, and cash balances | Detailed landing-page breakdown implemented. Arithmetic for the transcribed operating-income and operating-spending subtotals was rechecked on 2026-11-09. The reported net operating balance is not relabeled as savings. |
| Measures | [Public Announcements](https://sakata.malaybalaycity.gov.ph/category/public-annoucement/) pages 1–2 | Six 2026 executive orders, five 2026 ordinances, and Memorandum Circular No. 38 | Executive orders are attributed to the Mayor's Office, ordinances to the council, and the memorandum remains unattributed because its page does not identify the issuing authority in accessible text. |
| Projects | [Full Disclosure](https://sakata.malaybalaycity.gov.ph/full-disclosure/) — 2025 Trust Fund Utilization Q1 | Reported costs, cost incurred, progress, and remarks for selected projects | Values are presented as 2025 Q1 reported status, not current completion or personal achievements. The former direct PDF target returned 404 on 2026-11-05, so the live official catalog is used. |
| Recognition | [National Nutrition Council](https://nnc.gov.ph/mindanao-region/2022-rnac-awardees-41-lgus-bag-circle-of-excellence-award/) and [Philippine News Agency](https://www.pna.gov.ph/articles/1232936) | City-level nutrition recognition and adoption of PRIME-HRM | Recipient scope is explicit; institutional records are not converted into personal awards. |
| Individual legislative records | [Malaybalay legislative directory](https://sakata.malaybalaycity.gov.ph/legislative/), [PNA report republished by Edge Davao](https://edgedavao.net/latest-news/2025/02/malaybalay-city-regulates-bamboo-use-to-help-curb-dengue-cases/), [GMA Regional TV](https://www.gmanetwork.com/regionaltv/news/106598/malaybalay-to-regulate-use-of-bamboo-to-prevent-dengue/story/), and [House member record for Jonathan Keith T. Flores](https://www.congress.gov.ph/house-members/view/J033) | PNA identifies Melchor Maramara as author and Kathleen Pagaling as sponsor of Ordinance 1050; the House record lists Flores’s bills and statuses | Individually attributed records are attached only where a source names the person. PNA’s relative approval date (“Wednesday”) and GMA’s February 11, 2025 date are preserved as a source discrepancy pending a signed ordinance. City council listings do not identify individual authors/sponsors, and public MOA references reviewed are institutional rather than named-signatory records. House bills are kept under the district representative, not city officials. |
| Imagery | User-supplied aerial Malaybalay City Hall photograph | Recognizable aerial City Hall view supplied for the project | A softened, lightened, optimized WebP derivative is used beneath layered hero treatments; the former tourism carousel remains removed. |

## Technical references

- [BetterLosBaños repository](https://github.com/BetterLosBanos/betterlb): React/Vite/TypeScript, Cloudflare Pages Functions, modular structured data, D1 migrations, search, maps, and testing patterns.
- [BetterGov LGU directory](https://lgu.bettergov.ph/): Better LGU independence, contribution, attribution, and maintenance conventions.

## Data integrity decisions

- A document title visible on Full Disclosure is recorded as **Source listed**, not “verified complete.”
- Financial visualizations use figures extracted from one named reporting document and retain the reporting period.
- No project, supplier, contractor, expenditure, attendance, voting record, or performance score is inferred.
- Contact details preserve the official source and review date because they can change.
- Mayor and vice mayor entries use their separately published office contacts. Councilors and other sectoral legislative profiles use explicitly labeled shared Sangguniang Panlungsod routing because their official profiles do not publish individual contacts. Julius N. Manghano uses the separate Barangay 8 constituency contact published by the DILG directory.
- Invalid DILG contact strings such as incomplete mobile numbers are treated as unavailable rather than repaired by assumption.

## 2026-11-09 verification update

- The official Full Disclosure catalog was rechecked for its 2022–2026 index coverage. The reviewed 2022 index exposes annual records, but does not establish quarterly coverage; BetterMC therefore preserves the annual entries as **Source listed** and the 2022 quarterly rows as unavailable. The 2026 index currently supports Q1 and Q2, not Q3 and Q4.
- The financial landing-page figures remain constrained to the named 2025 Q2 Statement of Receipts and Expenditures. BetterMC recomputed the displayed operating-income total (PHP 1,379,878,253.26), operating-spending total (PHP 744,884,067.15), and their difference (PHP 634,994,186.11). These are calculations from reported figures, not a cash, savings, or project-completion certification.
- The [GAD Corner](https://sakata.malaybalaycity.gov.ph/gad-corner/) was checked for its published 2026 GAD Plan and Budget and prior accomplishment-report downloads. BetterMC links to source material and does not infer program outcomes from a plan or report title.
- The [City contact directory](https://sakata.malaybalaycity.gov.ph/contact-us/) was rechecked for the City DRRMO, BFP, and police hotlines used in the public emergency-access panel.

## Source conflicts and quality notes

- Some official pages show repeated or inconsistent contact values. The contact page was preferred because it is the dedicated directory, while every displayed value retains that page as its source.
- The user-provided `0917 188 4225` is published by the official directory for the City Administrator's Office. The footer preserves that office scope rather than presenting it as the mayor's personal number or a general emergency hotline.
- The source uses both “Sangguniang Panglungsod” and “Sangguniang Panlungsod.” BetterMC uses the standard “Panlungsod” in interface copy without changing source titles.
- Full Disclosure controls sometimes reuse the same link target or depend on page scripting. BetterMC currently links to the official catalog rather than claiming a direct PDF URL that could not be independently resolved.
- On 2026-11-05, the official `sakata.malaybalaycity.gov.ph` host responded with an expired TLS certificate in command-line verification. The pages were content-checked, but certificate renewal is controlled by the City Government host, not BetterMC.
