// Verified school enrollment, staffing, DepEd districts, logos, and contacts (SY 2024-25 DepEd / BukSU / SIC / TESDA).
export type SchoolEnrichment = {
  schoolId?: string;
  barangay?: string;
  address?: string;
  studentPopulation?: string;
  teacherCount?: number;
  classroomCount?: number;
  district?: string;
  description?: string;
  leadership?: string;
  contactPerson?: string;
  contacts?: string[];
  programmes?: string[];
  officialLinks?: Array<{ label: string; url: string }>;
  logoUrl?: string;
  logoNote?: string;
};

export const schoolEnrichmentBySlug: Record<string, SchoolEnrichment> = {
  "aglayan-central-school": {
    "schoolId": "126557",
    "district": "Malaybalay City District VI",
    "studentPopulation": "1,279 learners in SY 2024–25",
    "teacherCount": 39,
    "classroomCount": 26,
    "description": "Public central elementary school in Barangay Aglayan serving southern barangay learners under DepEd District VI. In SY 2024–25, it had 1,279 learners with 39 teachers and 26 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "airport-village-elementary-school": {
    "schoolId": "126574",
    "district": "Malaybalay City District V",
    "studentPopulation": "1,237 learners (DepEd SY 2024–25)",
    "teacherCount": 34,
    "classroomCount": 34,
    "description": "Public school offering elementary in Barangay Casisang under Malaybalay City District V. In SY 2024–25, it served 1,237 enrolled learners with 34 teachers and 34 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "apc": {
    "schoolId": "408493",
    "district": "Malaybalay City District X",
    "studentPopulation": "325 learners in SY 2024–25",
    "description": "Apu Palamguwan Cultural Education Center (APC) is a Jesuit-supported Indigenous cultural and ecological school in Sitio Bendum, Barangay Busdi under Malaybalay City District X. In SY 2024–25, DepEd recorded 325 K–12 learners studying Binukid, Filipino, English, and sustainable upland stewardship.",
    "contactPerson": "School Manager Jenny Lynn Lee, Principal Datu Nestor Menaling, and Director Fr. Pedro Walpole, SJ",
    "logoUrl": "/images/schools/apc.jpg",
    "logoNote": "Apu Palamguwan Cultural Education Center official emblem"
  },
  "apo-macote-national-high-school": {
    "schoolId": "325505",
    "district": "Malaybalay City District VII",
    "studentPopulation": "440 learners (DepEd SY 2024–25)",
    "teacherCount": 24,
    "classroomCount": 14,
    "description": "Public school offering junior high and senior high in Barangay Apo Macote under Malaybalay City District VII. In SY 2024–25, it served 440 enrolled learners with 24 teachers and 14 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "baganao-elementary-school": {
    "schoolId": "126575",
    "district": "Malaybalay City District II",
    "studentPopulation": "130 learners (DepEd SY 2024–25)",
    "teacherCount": 7,
    "classroomCount": 5,
    "description": "Public school offering elementary in Barangay Kibalabag under Malaybalay City District II. In SY 2024–25, it served 130 enrolled learners with 7 teachers and 5 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "bagong-silang-elementary-school": {
    "schoolId": "126534",
    "district": "Malaybalay City District IX",
    "description": "Public elementary school (DepEd School ID 126534) located at Purok 6, Bagong Silang, Barangay Maligaya under Malaybalay City District IX. Confirm current school-year enrollment, teacher count, and section availability directly with the campus or DepEd Malaybalay City Division.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "balangbang-elementary-school": {
    "schoolId": "126535",
    "district": "Malaybalay City District VI",
    "studentPopulation": "60 learners (DepEd SY 2024–25)",
    "teacherCount": 4,
    "classroomCount": 2,
    "description": "Public school offering elementary in Barangay Laguitas under Malaybalay City District VI. In SY 2024–25, it served 60 enrolled learners with 4 teachers and 2 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "bangcud-central-school": {
    "schoolId": "126558",
    "district": "Malaybalay City District VII",
    "studentPopulation": "1,557 learners in SY 2024–25",
    "teacherCount": 46,
    "classroomCount": 33,
    "description": "Bangcud Central School is a major public elementary school along Sayre Highway in Purok 2, Barangay Bangcud (District VII). In SY 2024–25, it served 1,557 enrolled learners with 46 teachers and 33 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "bangcud-national-high-school": {
    "schoolId": "303946",
    "district": "Malaybalay City District VII",
    "studentPopulation": "2,888 learners in SY 2024–25",
    "teacherCount": 112,
    "classroomCount": 55,
    "description": "Large public secondary school along Sayre Highway in Barangay Bangcud serving southern Malaybalay City (District VII). In SY 2024–25, DepEd recorded 2,888 learners, 112 teachers, and 55 classrooms across Junior and Senior High grades.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "barangay-9-elementary-school": {
    "schoolId": "199510",
    "district": "Malaybalay City District IV",
    "studentPopulation": "564 learners (DepEd SY 2024–25)",
    "teacherCount": 19,
    "classroomCount": 7,
    "description": "Public school offering elementary in Barangay 9 under Malaybalay City District IV. In SY 2024–25, it served 564 enrolled learners with 19 teachers and 7 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "bct-elementary-school": {
    "schoolId": "126576",
    "district": "Malaybalay City District IV",
    "studentPopulation": "437 learners (DepEd SY 2024–25)",
    "teacherCount": 15,
    "classroomCount": 4,
    "description": "Public school offering elementary in Barangay 10 under Malaybalay City District IV. In SY 2024–25, it served 437 enrolled learners with 15 teachers and 4 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "bendolan-elementary-school": {
    "schoolId": "126559",
    "district": "Malaybalay City District VI",
    "studentPopulation": "131 learners (DepEd SY 2024–25)",
    "teacherCount": 7,
    "classroomCount": 7,
    "description": "Public school offering elementary in Barangay Magsaysay under Malaybalay City District VI. In SY 2024–25, it served 131 enrolled learners with 7 teachers and 7 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "bethel-baptist-christian-academy": {
    "schoolId": "404995",
    "district": "Malaybalay City District II",
    "studentPopulation": "284 learners (DepEd SY 2024–25)",
    "description": "Private school offering preschool, elementary, junior high, and senior high (K–12) in Barangay Sumpong under Malaybalay City District II. In SY 2024–25, it served 284 enrolled learners.",
    "contactPerson": "School Principal or Registrar at the campus · For basic-education inquiries: DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "brightspark-christian-academy": {
    "schoolId": "400609",
    "district": "Malaybalay City District VI",
    "studentPopulation": "199 learners (DepEd SY 2024–25)",
    "description": "Private school offering preschool, elementary, junior high, and senior high (K–12) at Purok 6-B, Barangay Aglayan under Malaybalay City District VI. In SY 2024–25, it served 199 enrolled learners.",
    "contactPerson": "School Principal or Registrar at the campus · For basic-education inquiries: DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "bugemco-learning-center": {
    "schoolId": "400625",
    "district": "Malaybalay City District IV",
    "studentPopulation": "71 learners in SY 2024–25",
    "description": "Private preschool center at the Capitol Compound on San Victores Street, Barangay 9. In SY 2024–25, DepEd recorded 71 Nursery and Kindergarten learners under District IV.",
    "contactPerson": "BUGEMCO Learning Center Office (0926-539-3591)"
  },
  "bukidnon-national-high-school": {
    "schoolId": "303950",
    "district": "Malaybalay City District III",
    "studentPopulation": "8,840 learners in SY 2024–25 (largest public school in Malaybalay City)",
    "teacherCount": 442,
    "classroomCount": 113,
    "description": "Bukidnon National High School (BNHS) is the largest public secondary school in Malaybalay City and Bukidnon, located along Fortich Street in Barangay 3 (Poblacion). In SY 2024–25, it served 8,840 learners with 442 teachers and 113 classrooms under DepEd District III.",
    "leadership": "Principal IV: Dr. Paul O. Orong",
    "contactPerson": "Principal IV Dr. Paul O. Orong (Fortich St. Campus) · DepEd Malaybalay Division (0907-688-9009)",
    "contacts": [
      "0907-688-9009 (DepEd Division)",
      "malaybalay.city@deped.gov.ph"
    ],
    "programmes": [
      "Junior High School (Grades 7–10)",
      "Senior High School Academic, TVL & Special Curricular Tracks",
      "Science, Arts & Sports Tracks"
    ]
  },
  "bukidnon-national-high-school-senior-high-school-campus": {
    "schoolId": "341061",
    "barangay": "Casisang",
    "address": "Purok 6, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    "district": "Malaybalay City District V",
    "studentPopulation": "590 Senior High learners in SY 2024–25 (separate campus ID 341061)",
    "teacherCount": 21,
    "classroomCount": 41,
    "description": "Dedicated public Senior High School campus (DepEd School ID 341061) in Purok 6, Barangay Casisang under Malaybalay City District V (formerly listed as Casisang Senior High School in earlier DepEd address masterlists). In SY 2024–25, it served 590 Grade 11 and Grade 12 learners with 21 teachers and 41 classrooms.",
    "leadership": "Principal IV: Dr. Paul O. Orong · Senior High School Department",
    "contactPerson": "BNHS Senior High School Campus (Purok 6, Casisang) / DepEd Malaybalay Division (0907-688-9009)",
    "programmes": [
      "Senior High School Academic Strands (STEM, ABM, HUMSS, GAS)",
      "Technical-Vocational-Livelihood (TVL) Track"
    ]
  },
  "bukidnon-state-university": {
    "schoolId": "600130",
    "district": "Main Campus (Poblacion, Brgy. 3) · Lab Schools under Malaybalay City District I",
    "studentPopulation": "9,300+ Main Campus college students (AY 2026–27) · 725 Lab School learners (SY 2024–25)",
    "description": "Bukidnon State University (BukSU, CHED Inst. Code 10014) is Malaybalay City's flagship chartered public state university. Founded in 1924 as Bukidnon Normal School along Fortich Street in Barangay 3 (Poblacion), with an academic annex on University Road in Casisang, it operates seven colleges offering undergraduate, Juris Doctor, master's, and doctoral degree programs plus Elementary and Secondary Laboratory Schools.",
    "barangay": "Barangay 3",
    "address": "Fortich Street, Barangay 3 (Poblacion) & Casisang University Road, Malaybalay City, 8700 Bukidnon",
    "leadership": "University President: Dr. Joy M. Mirasol · VPAA: Dr. Hazel Jean M. Abejuela · VPREI: Dr. Carina Joane V. Barroso · VPCASS: Dr. Lincoln V. Tan · VPAF: Mr. Dante S. Victoria, Jr.",
    "contactPerson": "Office of the President (Dr. Joy M. Mirasol) · Admissions (Local 113) or University Registrar (+63 975 758 3157 / +63 965 806 1044)",
    "contacts": [
      "(088) 813-5661 to 5663",
      "(088) 813-2717",
      "+63 975 758 3157 (Registrar)",
      "https://admissions.buksu.edu.ph/"
    ],
    "programmes": [
      "CAS: AB Economics, AB English Language, AB Philosophy (Pre-Law / Teaching), AB Sociology, BS Biology (Biotechnology), BS Community Development, BS Development Communication, BS Environmental Science, BS Mathematics; PhD English Language, MA English Language, MA Guidance & Counseling, MA Sociology",
      "COB: BS Accountancy, BSBA Financial Management, BS Hospitality Management; Master of Business Administration (MBA)",
      "COE: BECEd, BEEd, BPEd, BSEd (English, Filipino, Mathematics, Science, Social Studies); PhD Education / Science Education, MAEd (Educational Admin, ELT, General Science, Math Education)",
      "CON & COL: BS Nursing (BSN) · Juris Doctor (JD)",
      "COT: BS Automotive Technology, BS Electronics Technology, BSEMC Digital Animation Technology, BS Food Technology, BS Information Technology (BSIT)",
      "CPAG: Bachelor of Public Administration (BPA), Master of Public Administration (MPA), Doctor of Public Administration (DPA)"
    ],
    "officialLinks": [
      {
        "label": "BukSU Official Website",
        "url": "https://buksu.edu.ph/"
      },
      {
        "label": "Official Academic Programs (AY 2025–2026)",
        "url": "https://buksu.edu.ph/academic-programs-2025_26/"
      },
      {
        "label": "BukSU Admissions Portal",
        "url": "https://admissions.buksu.edu.ph/"
      },
      {
        "label": "Designated University Officials",
        "url": "https://buksu.edu.ph/designated-officials/"
      },
      {
        "label": "Contact Directory & Trunkline",
        "url": "https://buksu.edu.ph/contact-us/"
      },
      {
        "label": "BukSU Official Facebook Page",
        "url": "https://www.facebook.com/BukidnonStateUniversityOfficialPage"
      }
    ],
    "logoUrl": "/images/schools/buksu.png",
    "logoNote": "Bukidnon State University official seal"
  },
  "bukidnon-state-university-elementary-laboratory": {
    "schoolId": "600130",
    "district": "Malaybalay City District I",
    "studentPopulation": "Part of BukSU's 725 Laboratory School learners (SY 2024–25, K–12 Lab School System)",
    "description": "Public laboratory elementary school operated by Bukidnon State University under its College of Education, serving elementary learners and teacher-training practicums.",
    "leadership": "BukSU College of Education & Laboratory School Administration (University President: Dr. Joy M. Mirasol)",
    "contactPerson": "BukSU Elementary Laboratory School / University Registrar ((088) 813-5661 to 5663)",
    "contacts": [
      "(088) 813-5661 to 5663",
      "(088) 813-2717"
    ],
    "officialLinks": [
      {
        "label": "Bukidnon State University",
        "url": "https://buksu.edu.ph/"
      }
    ],
    "logoUrl": "/images/schools/buksu.png",
    "logoNote": "Bukidnon State University official seal"
  },
  "bukidnon-state-university-secondary-laboratory": {
    "schoolId": "600130",
    "district": "Malaybalay City District I",
    "studentPopulation": "Part of BukSU's 725 Laboratory School learners (SY 2024–25, K–12 Lab School System)",
    "description": "Public secondary laboratory school operated by Bukidnon State University, offering Junior High and Senior High programs connected with the College of Education.",
    "leadership": "BukSU College of Education & Secondary Laboratory School (University President: Dr. Joy M. Mirasol)",
    "contactPerson": "BukSU Secondary Laboratory School / University Registrar ((088) 813-5661 to 5663)",
    "contacts": [
      "(088) 813-5661 to 5663",
      "(088) 813-2717"
    ],
    "officialLinks": [
      {
        "label": "Bukidnon State University",
        "url": "https://buksu.edu.ph/"
      }
    ],
    "logoUrl": "/images/schools/buksu.png",
    "logoNote": "Bukidnon State University official seal"
  },
  "busdi-integrated-school": {
    "schoolId": "500409",
    "district": "Malaybalay City District X",
    "studentPopulation": "562 learners (DepEd SY 2024–25)",
    "teacherCount": 29,
    "classroomCount": 12,
    "description": "Public K–12 integrated school (Kindergarten through Senior High School) in Barangay Busdi under Malaybalay City District X. In SY 2024–25, it served 562 enrolled learners with 29 teachers and 12 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "cabagahan-elementary-school": {
    "schoolId": "126561",
    "district": "Malaybalay City District VI",
    "studentPopulation": "379 learners (DepEd SY 2024–25)",
    "teacherCount": 16,
    "classroomCount": 6,
    "description": "Public school offering elementary in Barangay Cabangahan under Malaybalay City District VI. In SY 2024–25, it served 379 enrolled learners with 16 teachers and 6 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "caburacanan-elementary-school": {
    "schoolId": "126537",
    "district": "Malaybalay City District X",
    "studentPopulation": "203 learners (DepEd SY 2024–25)",
    "teacherCount": 8,
    "classroomCount": 3,
    "description": "Public school offering elementary in Barangay Caburacanan under Malaybalay City District X. In SY 2024–25, it served 203 enrolled learners with 8 teachers and 3 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "camilo-adrales-technical-school": {
    "studentPopulation": "TESDA-accredited technical-vocational training and assessment center",
    "district": "TESDA Bukidnon Provincial Office",
    "description": "TESDA-accredited technical-vocational school and assessment center in Purok 5, Barangay San Jose, offering competency training and certification in Shielded Metal Arc Welding (SMAW NC I and NC II).",
    "leadership": "Trainer / Institutional Contact: Cristito A. Adrales",
    "contactPerson": "Cristito A. Adrales (Trainer & Center Contact) · 0953-245-6287",
    "contacts": [
      "0953-245-6287"
    ],
    "programmes": [
      "Shielded Metal Arc Welding (SMAW) NC I",
      "Shielded Metal Arc Welding (SMAW) NC II"
    ]
  },
  "can-ayan-integrated-school": {
    "schoolId": "500245",
    "district": "Malaybalay City District II",
    "studentPopulation": "1,059 learners (DepEd SY 2024–25)",
    "teacherCount": 44,
    "classroomCount": 32,
    "description": "Public K–12 integrated school (Kindergarten through Senior High School) in Barangay Can-ayan under Malaybalay City District II. In SY 2024–25, it served 1,059 enrolled learners with 44 teachers and 32 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "candiisan-integrated-school": {
    "schoolId": "501195",
    "district": "Malaybalay City District II",
    "studentPopulation": "272 learners (DepEd SY 2024–25)",
    "teacherCount": 14,
    "classroomCount": 12,
    "description": "Public school offering kindergarten, elementary, junior high, and integrated school in Barangay Can-ayan under Malaybalay City District II. In SY 2024–25, it served 272 enrolled learners with 14 teachers and 12 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "capitan-angel-integrated-school": {
    "schoolId": "501189",
    "district": "Malaybalay City District I",
    "studentPopulation": "436 learners (DepEd SY 2024–25)",
    "teacherCount": 17,
    "classroomCount": 10,
    "description": "Public K–12 integrated school (Kindergarten through Senior High School) in Barangay Capitan Angel under Malaybalay City District I. In SY 2024–25, it served 436 enrolled learners with 17 teachers and 10 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "casisang-central-integrated-school": {
    "schoolId": "501580",
    "district": "Malaybalay City District V",
    "studentPopulation": "1,640 learners (DepEd SY 2024–25)",
    "teacherCount": 38,
    "classroomCount": 24,
    "description": "Public school offering kindergarten, elementary, junior high, and integrated school in Barangay Casisang under Malaybalay City District V. In SY 2024–25, it served 1,640 enrolled learners with 38 teachers and 24 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "casisang-international-christian-school": {
    "schoolId": "404997",
    "district": "Malaybalay City District V",
    "studentPopulation": "170 learners (DepEd SY 2024–25)",
    "description": "Private school offering preschool, elementary, junior high, and senior high (K–12) in Barangay Casisang under Malaybalay City District V. In SY 2024–25, it served 170 enrolled learners.",
    "contactPerson": "School Principal or Registrar at the campus · For basic-education inquiries: DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "casisang-national-high-school": {
    "schoolId": "314914",
    "district": "Malaybalay City District IV",
    "studentPopulation": "630 learners (DepEd SY 2024–25)",
    "teacherCount": 29,
    "classroomCount": 18,
    "description": "Public school offering junior high and senior high in Barangay Casisang under Malaybalay City District IV. In SY 2024–25, it served 630 enrolled learners with 29 teachers and 18 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "dalwangan-elementary-school": {
    "schoolId": "126580",
    "district": "Malaybalay City District I",
    "studentPopulation": "906 learners (DepEd SY 2024–25)",
    "teacherCount": 27,
    "classroomCount": 24,
    "description": "Public school offering elementary in Barangay Dalwangan under Malaybalay City District I. In SY 2024–25, it served 906 enrolled learners with 27 teachers and 24 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "dalwangan-national-high-school": {
    "schoolId": "325504",
    "district": "Malaybalay City District I",
    "studentPopulation": "863 learners (DepEd SY 2024–25)",
    "teacherCount": 19,
    "classroomCount": 23,
    "description": "Public school offering junior high and senior high in Barangay Dalwangan under Malaybalay City District I. In SY 2024–25, it served 863 enrolled learners with 19 teachers and 23 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "damitan-elementary-school": {
    "schoolId": "103610",
    "district": "Malaybalay City District I",
    "studentPopulation": "206 learners (DepEd SY 2024–25)",
    "teacherCount": 7,
    "classroomCount": 4,
    "description": "Public school offering elementary in Barangay Dalwangan under Malaybalay City District I. In SY 2024–25, it served 206 enrolled learners with 7 teachers and 4 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "dapulan-elementary-school": {
    "schoolId": "126563",
    "district": "Malaybalay City District VII",
    "studentPopulation": "284 learners (DepEd SY 2024–25)",
    "teacherCount": 12,
    "classroomCount": 5,
    "description": "Public school offering elementary in Barangay Apo Macote under Malaybalay City District VII. In SY 2024–25, it served 284 enrolled learners with 12 teachers and 5 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "dumayas-elementary-school": {
    "schoolId": "126539",
    "district": "Malaybalay City District IX",
    "studentPopulation": "126 learners (DepEd SY 2024–25)",
    "teacherCount": 7,
    "classroomCount": 5,
    "description": "Public school offering elementary in Barangay Maligaya under Malaybalay City District IX. In SY 2024–25, it served 126 enrolled learners with 7 teachers and 5 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "el-gibbor-faithhouse-academy": {
    "schoolId": "407945",
    "district": "Malaybalay City District IX",
    "studentPopulation": "17 learners (DepEd SY 2024–25)",
    "description": "Private school offering preschool in Barangay Sinanglanan under Malaybalay City District IX. In SY 2024–25, it served 17 enrolled learners.",
    "contactPerson": "School Principal or Registrar at the campus · For basic-education inquiries: DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "heights-kinderland": {
    "schoolId": "404998",
    "district": "Malaybalay City District III",
    "studentPopulation": "21 learners (DepEd SY 2024–25)",
    "description": "Private school offering preschool in Barangay 1 under Malaybalay City District III. In SY 2024–25, it served 21 enrolled learners.",
    "contactPerson": "School Principal or Registrar at the campus · For basic-education inquiries: DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "imbayao-elementary-school": {
    "schoolId": "126581",
    "district": "Malaybalay City District III",
    "studentPopulation": "336 learners (DepEd SY 2024–25)",
    "teacherCount": 12,
    "classroomCount": 7,
    "description": "Public school offering elementary in Barangay Imbayao under Malaybalay City District III. In SY 2024–25, it served 336 enrolled learners with 12 teachers and 7 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "imbayao-national-high-school": {
    "schoolId": "325503",
    "district": "Malaybalay City District III",
    "studentPopulation": "170 learners (DepEd SY 2024–25)",
    "teacherCount": 9,
    "classroomCount": 13,
    "description": "Public school offering junior high and senior high in Barangay Imbayao under Malaybalay City District III. In SY 2024–25, it served 170 enrolled learners with 9 teachers and 13 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "incalbog-elementary-school": {
    "schoolId": "103677",
    "district": "Malaybalay City District II",
    "studentPopulation": "92 learners (DepEd SY 2024–25)",
    "teacherCount": 6,
    "classroomCount": 5,
    "description": "Public school offering elementary in Barangay Can-ayan under Malaybalay City District II. In SY 2024–25, it served 92 enrolled learners with 6 teachers and 5 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "indalasa-elementary-school": {
    "schoolId": "126540",
    "district": "Malaybalay City District X",
    "studentPopulation": "342 learners (DepEd SY 2024–25)",
    "teacherCount": 11,
    "classroomCount": 7,
    "description": "Public school offering elementary in Barangay Indalasa under Malaybalay City District X. In SY 2024–25, it served 342 enrolled learners with 11 teachers and 7 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "isabela-ayala-gonzales-elementary-school": {
    "schoolId": "126568",
    "district": "Malaybalay City District VIII",
    "studentPopulation": "293 learners (DepEd SY 2024–25)",
    "teacherCount": 10,
    "classroomCount": 7,
    "description": "Public school offering elementary in Barangay Sinanglanan under Malaybalay City District VIII. In SY 2024–25, it served 293 enrolled learners with 10 teachers and 7 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "kalasungay-central-school": {
    "schoolId": "126582",
    "district": "Malaybalay City District I",
    "studentPopulation": "1,147 learners (DepEd SY 2024–25)",
    "teacherCount": 36,
    "classroomCount": 26,
    "description": "Public school offering elementary in Barangay Kalasungay under Malaybalay City District I. In SY 2024–25, it served 1,147 enrolled learners with 36 teachers and 26 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "kalasungay-national-high-school": {
    "schoolId": "314915",
    "district": "Malaybalay City District I",
    "studentPopulation": "190 learners (DepEd SY 2024–25)",
    "teacherCount": 7,
    "classroomCount": 6,
    "description": "Public school offering junior high and senior high in Barangay Kalasungay under Malaybalay City District I. In SY 2024–25, it served 190 enrolled learners with 7 teachers and 6 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "kibalabag-integrated-school": {
    "schoolId": "501188",
    "district": "Malaybalay City District II",
    "studentPopulation": "301 learners (DepEd SY 2024–25)",
    "teacherCount": 14,
    "classroomCount": 9,
    "description": "Public K–12 integrated school (Kindergarten through Senior High School) in Barangay Kibalabag under Malaybalay City District II. In SY 2024–25, it served 301 enrolled learners with 14 teachers and 9 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "kilap-agan-integrated-school": {
    "schoolId": "501579",
    "district": "Malaybalay City District II",
    "studentPopulation": "371 learners (DepEd SY 2024–25)",
    "teacherCount": 14,
    "classroomCount": 9,
    "description": "Public school offering kindergarten, elementary, junior high, and integrated school in Barangay Can-ayan under Malaybalay City District II. In SY 2024–25, it served 371 enrolled learners with 14 teachers and 9 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "kitanglad-view-adventist-elementary-school": {
    "schoolId": "483543",
    "barangay": "Kalasungay",
    "address": "Purok 5, Barangay Kalasungay, Malaybalay City, 8700 Bukidnon",
    "district": "Malaybalay City District I",
    "studentPopulation": "57 learners (DepEd SY 2024–25)",
    "description": "Private Adventist elementary school at Purok 5, Barangay Kalasungay under Malaybalay City District I. In SY 2024–25, it served 57 enrolled learners.",
    "contactPerson": "School Principal or Registrar at the campus · For basic-education inquiries: DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "kulaman-elementary-school": {
    "schoolId": "126541",
    "district": "Malaybalay City District X",
    "studentPopulation": "248 learners (DepEd SY 2024–25)",
    "teacherCount": 8,
    "classroomCount": 5,
    "description": "Public school offering elementary in Barangay Kulaman under Malaybalay City District X. In SY 2024–25, it served 248 enrolled learners with 8 teachers and 5 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "lalawan-elementary-school": {
    "schoolId": "126542",
    "district": "Malaybalay City District VIII",
    "studentPopulation": "246 learners (DepEd SY 2024–25)",
    "teacherCount": 9,
    "classroomCount": 8,
    "description": "Public school offering elementary in Barangay Linabo under Malaybalay City District VIII. In SY 2024–25, it served 246 enrolled learners with 9 teachers and 8 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "lalawan-national-high-school": {
    "schoolId": "325501",
    "district": "Malaybalay City District VIII",
    "studentPopulation": "262 learners (DepEd SY 2024–25)",
    "teacherCount": 10,
    "classroomCount": 13,
    "description": "Public school offering junior high and senior high in Barangay Linabo under Malaybalay City District VIII. In SY 2024–25, it served 262 enrolled learners with 10 teachers and 13 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "lalawan-sda-elementary-school": {
    "schoolId": "405000",
    "district": "Malaybalay City District VIII",
    "studentPopulation": "99 learners (DepEd SY 2024–25)",
    "description": "Private school offering elementary in Barangay Linabo under Malaybalay City District VIII. In SY 2024–25, it served 99 enrolled learners.",
    "contactPerson": "School Principal or Registrar at the campus · For basic-education inquiries: DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "langasihan-elementary-school": {
    "schoolId": "126543",
    "district": "Malaybalay City District IX",
    "studentPopulation": "200 learners (DepEd SY 2024–25)",
    "teacherCount": 7,
    "classroomCount": 6,
    "description": "Public school offering elementary in Barangay Managok under Malaybalay City District IX. In SY 2024–25, it served 200 enrolled learners with 7 teachers and 6 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "linabo-central-school": {
    "schoolId": "126544",
    "district": "Malaybalay City District VIII",
    "studentPopulation": "914 learners (DepEd SY 2024–25)",
    "teacherCount": 30,
    "classroomCount": 18,
    "description": "Public school offering elementary in Barangay Linabo under Malaybalay City District VIII. In SY 2024–25, it served 914 enrolled learners with 30 teachers and 18 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "little-gems-learning-center": {
    "schoolId": "459520",
    "district": "Malaybalay City District III",
    "studentPopulation": "26 learners (DepEd SY 2024–25)",
    "description": "Private school offering preschool in Barangay 2 under Malaybalay City District III. In SY 2024–25, it served 26 enrolled learners.",
    "contactPerson": "School Principal or Registrar at the campus · For basic-education inquiries: DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "lunokan-integrated-school": {
    "schoolId": "502744",
    "district": "Malaybalay City District IX",
    "studentPopulation": "171 learners (DepEd SY 2024–25)",
    "teacherCount": 7,
    "classroomCount": 4,
    "description": "Public school offering kindergarten, elementary, junior high, and integrated school in Barangay Miglamin under Malaybalay City District IX. In SY 2024–25, it served 171 enrolled learners with 7 teachers and 4 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "luyungan-high-school": {
    "schoolId": "300507",
    "district": "Malaybalay City District VII",
    "studentPopulation": "135 learners (DepEd SY 2024–25)",
    "teacherCount": 13,
    "classroomCount": 9,
    "description": "Public school offering junior high and senior high in Barangay Bangcud under Malaybalay City District VII. In SY 2024–25, it served 135 enrolled learners with 13 teachers and 9 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "mabuhay-integrated-school": {
    "schoolId": "501852",
    "district": "Malaybalay City District V",
    "studentPopulation": "429 learners (DepEd SY 2024–25)",
    "teacherCount": 17,
    "classroomCount": 8,
    "description": "Public school offering kindergarten, elementary, junior high, and integrated school in Barangay San Jose under Malaybalay City District V. In SY 2024–25, it served 429 enrolled learners with 17 teachers and 8 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "macote-elementary-school": {
    "schoolId": "126566",
    "district": "Malaybalay City District VII",
    "studentPopulation": "476 learners (DepEd SY 2024–25)",
    "teacherCount": 16,
    "classroomCount": 11,
    "description": "Public school offering elementary in Barangay Apo Macote under Malaybalay City District VII. In SY 2024–25, it served 476 enrolled learners with 16 teachers and 11 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "magsaysay-integrated-school": {
    "schoolId": "501190",
    "district": "Malaybalay City District VI",
    "studentPopulation": "762 learners (DepEd SY 2024–25)",
    "teacherCount": 24,
    "classroomCount": 13,
    "description": "Public school offering kindergarten, elementary, junior high, and integrated school in Barangay Magsaysay under Malaybalay City District VI. In SY 2024–25, it served 762 enrolled learners with 24 teachers and 13 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "malaybalay-city-adventist-elementary-school": {
    "schoolId": "405001",
    "district": "Malaybalay City District IV",
    "studentPopulation": "176 learners (DepEd SY 2024–25)",
    "description": "Private school offering preschool and elementary in Barangay 11 under Malaybalay City District IV. In SY 2024–25, it served 176 enrolled learners.",
    "contactPerson": "School Principal or Registrar at the campus · For basic-education inquiries: DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "malaybalay-city-central-school": {
    "schoolId": "126586",
    "district": "Malaybalay City District IV",
    "studentPopulation": "3,583 learners in SY 2024–25 (largest public elementary school in the city)",
    "teacherCount": 111,
    "classroomCount": 87,
    "description": "Malaybalay City Central School (MCCS) is the largest public elementary school in Malaybalay City, located along Corner Guingona and Don Carlos Streets in Barangay 4 (Poblacion). In SY 2024–25, DepEd recorded 3,583 learners, 111 teachers, and 87 classrooms under District IV.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "malaybalay-city-national-high-school": {
    "schoolId": "314916",
    "district": "Malaybalay City District V",
    "studentPopulation": "541 learners (DepEd SY 2024–25)",
    "teacherCount": 23,
    "classroomCount": 23,
    "description": "Public school offering junior high and senior high in Barangay San Jose under Malaybalay City District V. In SY 2024–25, it served 541 enrolled learners with 23 teachers and 23 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "malaybalay-city-national-science-high-school": {
    "schoolId": "314904",
    "district": "Malaybalay City District VI",
    "studentPopulation": "2,245 learners in SY 2024–25",
    "teacherCount": 66,
    "classroomCount": 37,
    "description": "Public science-oriented Junior and Senior High School in Barangay Aglayan under DepEd District VI. In SY 2024–25, it served 2,245 students with 66 teachers and 37 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "maligaya-integrated-school": {
    "schoolId": "502800",
    "barangay": "Maligaya",
    "address": "Purok 3, Barangay Maligaya, Malaybalay City, 8700 Bukidnon",
    "district": "Malaybalay City District IX",
    "studentPopulation": "281 learners (DepEd SY 2024–25)",
    "teacherCount": 8,
    "classroomCount": 9,
    "description": "Public school offering kindergarten, elementary, and junior high as an integrated school in Barangay Maligaya under Malaybalay City District IX. In SY 2024–25, it served 281 enrolled learners with 8 teachers and 9 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "managok-central-school": {
    "schoolId": "126547",
    "district": "Malaybalay City District IX",
    "studentPopulation": "1,031 learners (DepEd SY 2024–25)",
    "teacherCount": 31,
    "classroomCount": 31,
    "description": "Public school offering elementary in Barangay Managok under Malaybalay City District IX. In SY 2024–25, it served 1,031 enrolled learners with 31 teachers and 31 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "managok-national-high-school": {
    "schoolId": "303973",
    "district": "Malaybalay City District IX",
    "studentPopulation": "1,036 learners (DepEd SY 2024–25)",
    "teacherCount": 64,
    "classroomCount": 36,
    "description": "Public school offering junior high and senior high in Barangay Managok under Malaybalay City District IX. In SY 2024–25, it served 1,036 enrolled learners with 64 teachers and 36 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "manalog-integrated-school": {
    "schoolId": "501854",
    "district": "Malaybalay City District II",
    "studentPopulation": "317 learners (DepEd SY 2024–25)",
    "teacherCount": 15,
    "classroomCount": 10,
    "description": "Public school offering kindergarten, elementary, junior high, and integrated school in Barangay Manalog under Malaybalay City District II. In SY 2024–25, it served 317 enrolled learners with 15 teachers and 10 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "mapayag-integrated-school": {
    "schoolId": "501853",
    "district": "Malaybalay City District VI",
    "studentPopulation": "274 learners (DepEd SY 2024–25)",
    "teacherCount": 13,
    "classroomCount": 2,
    "description": "Public school offering kindergarten, elementary, junior high, and integrated school in Barangay Mapayag under Malaybalay City District VI. In SY 2024–25, it served 274 enrolled learners with 13 teachers and 2 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "mapulo-elementary-school": {
    "schoolId": "126548",
    "district": "Malaybalay City District X",
    "studentPopulation": "119 learners (DepEd SY 2024–25)",
    "teacherCount": 7,
    "classroomCount": 5,
    "description": "Public school offering elementary in Barangay Mapulo under Malaybalay City District X. In SY 2024–25, it served 119 enrolled learners with 7 teachers and 5 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "marywoods-academy": {
    "schoolId": "459522",
    "district": "Malaybalay City District II",
    "studentPopulation": "61 learners (DepEd SY 2024–25)",
    "description": "Private school offering elementary, junior high, and senior high (K–12) in Barangay Sumpong under Malaybalay City District II. In SY 2024–25, it served 61 enrolled learners.",
    "contactPerson": "School Principal or Registrar at the campus · For basic-education inquiries: DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "miglamin-national-high-school": {
    "schoolId": "314920",
    "district": "Malaybalay City District IX",
    "studentPopulation": "299 learners (DepEd SY 2024–25)",
    "teacherCount": 8,
    "classroomCount": 12,
    "description": "Public school offering junior high and senior high in Barangay Miglamin under Malaybalay City District IX. In SY 2024–25, it served 299 enrolled learners with 8 teachers and 12 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "mindanao-arts-technological-institute": {
    "schoolId": "405003",
    "barangay": "Barangay 9",
    "address": "Sawmill Site, Barangay 9 (Poblacion), Malaybalay City, 8700 Bukidnon",
    "district": "Malaybalay City District V · CHED Code 10041",
    "studentPopulation": "38 Basic Education learners (DepEd SY 2024–25; plus CHED college & TESDA tech-voc enrollees)",
    "description": "Mindanao Arts & Technological Institute, Inc. (MATI, DepEd ID 405003 / CHED Inst. Code 10041) is a private non-sectarian institution at Sawmill Site, Barangay 9 (Poblacion) offering K–12 basic education alongside CHED-monitored higher education and TESDA-registered technical-vocational courses.",
    "contactPerson": "MATI Registrar ((088) 813-3039 / (088) 813-2748 / matiregistrar19@gmail.com)",
    "contacts": [
      "(088) 813-3039",
      "(088) 813-2748",
      "matiregistrar19@gmail.com"
    ],
    "programmes": [
      "Basic Education (K–12: Preschool, Elementary, Junior High & Senior High)",
      "CHED Higher Education (confirm current COPC offerings with MATI Registrar / CHED Region X)",
      "TESDA Technical-Vocational Programs (Automotive Servicing, Food & Beverage Services, Housekeeping, Bartending, Commercial Cooking, Programming)"
    ],
    "officialLinks": [
      {
        "label": "CHED HEIDA Region X Directory (Code 10041)",
        "url": "https://heida.ched.gov.ph/hei-directory/10?page=6"
      }
    ]
  },
  "natid-asan-elementary-school": {
    "schoolId": "126588",
    "barangay": "Casisang",
    "address": "Natid-asan, Barangay Casisang, Malaybalay City, 8700 Bukidnon",
    "district": "Malaybalay City District V",
    "studentPopulation": "477 learners (DepEd SY 2024–25)",
    "teacherCount": 14,
    "classroomCount": 12,
    "description": "Public elementary school in Natid-asan, Barangay Casisang under Malaybalay City District V. In SY 2024–25, it served 477 enrolled learners with 14 teachers and 12 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "new-ilocos-elementary-school": {
    "schoolId": "126589",
    "district": "Malaybalay City District I",
    "studentPopulation": "309 learners (DepEd SY 2024–25)",
    "teacherCount": 10,
    "classroomCount": 9,
    "description": "Public school offering elementary in Barangay Dalwangan under Malaybalay City District I. In SY 2024–25, it served 309 enrolled learners with 10 teachers and 9 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "patpat-elementary-school": {
    "schoolId": "126590",
    "district": "Malaybalay City District I",
    "studentPopulation": "781 learners (DepEd SY 2024–25)",
    "teacherCount": 22,
    "classroomCount": 25,
    "description": "Public school offering elementary in Barangay Patpat under Malaybalay City District I. In SY 2024–25, it served 781 enrolled learners with 22 teachers and 25 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "patpat-national-high-school": {
    "schoolId": "306338",
    "district": "Malaybalay City District I",
    "studentPopulation": "80 learners (DepEd SY 2024–25)",
    "description": "Public secondary school offering junior high and senior high in Barangay Patpat under Malaybalay City District I. In SY 2024–25, it served 80 enrolled learners (teacher and classroom counts were not separately reported in the DepEd SY 2024–25 summary).",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "pighalugan-elementary-school": {
    "schoolId": "103629",
    "district": "Malaybalay City District X",
    "studentPopulation": "81 learners (DepEd SY 2024–25)",
    "teacherCount": 5,
    "classroomCount": 6,
    "description": "Public school offering elementary in Barangay Silae under Malaybalay City District X. In SY 2024–25, it served 81 enrolled learners with 5 teachers and 6 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "pigpamulahan-integrated-school": {
    "schoolId": "502740",
    "district": "Malaybalay City District X",
    "studentPopulation": "340 learners (DepEd SY 2024–25)",
    "teacherCount": 9,
    "classroomCount": 4,
    "description": "Public school offering kindergarten, elementary, junior high, and integrated school in Barangay St. Peter under Malaybalay City District X. In SY 2024–25, it served 340 enrolled learners with 9 teachers and 4 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "saint-isidore-high-school": {
    "schoolId": "405004",
    "district": "Malaybalay City District X",
    "studentPopulation": "361 learners (DepEd SY 2024–25)",
    "description": "Private school offering elementary, junior high, and senior high in Barangay Zamboanguita under Malaybalay City District X. In SY 2024–25, it served 361 enrolled learners.",
    "contactPerson": "School Principal or Registrar at the campus · For basic-education inquiries: DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "san-isidro-college": {
    "schoolId": "405006",
    "district": "Malaybalay City District IV · CHED Code 10079",
    "studentPopulation": "1,259 Basic Education learners in SY 2024–25 (plus college departments)",
    "description": "Founded in 1949, San Isidro College (SIC, DepEd ID 405006 / CHED Inst. Code 10079) is the oldest private Catholic educational institution in Malaybalay City, located in Impalambong, Barangay 10. It offers K–12 Basic Education (Preschool through Senior High School), CHED-recognized college degrees, and TESDA-aligned technical courses.",
    "leadership": "College President: Rev. Fr. Virgilio H. Delfin, CPA, DBM",
    "contactPerson": "President Rev. Fr. Virgilio H. Delfin, CPA, DBM · Admissions & Registrar ((088) 813-5541 / info@sic.edu.ph)",
    "contacts": [
      "(088) 813-5541",
      "(088) 221-2368",
      "info@sic.edu.ph"
    ],
    "programmes": [
      "Basic Education (Preschool, Elementary & Junior High School)",
      "Senior High School Tracks (ABM, STEM, HUMSS, GAS & TVL)",
      "School of Information Technology (BS Information Technology)",
      "College Departments: Business Administration & Accountancy, Teacher Education, and Arts & Sciences"
    ],
    "officialLinks": [
      {
        "label": "San Isidro College Official Website",
        "url": "https://sic.edu.ph/"
      },
      {
        "label": "SIC Admissions & Contact Page",
        "url": "https://sic.edu.ph/contact"
      },
      {
        "label": "School of Information Technology",
        "url": "https://sic.edu.ph/departments/school-of-information-technology"
      },
      {
        "label": "CHED HEIDA Region X Directory (Code 10079)",
        "url": "https://heida.ched.gov.ph/hei-directory/10?page=9"
      }
    ],
    "logoUrl": "/images/schools/sic.webp",
    "logoNote": "San Isidro College official seal"
  },
  "san-isidro-college-grade-school": {
    "schoolId": "405006",
    "district": "Malaybalay City District IV",
    "studentPopulation": "Part of San Isidro College's 1,259 Basic Education learners (SY 2024–25)",
    "description": "Elementary unit of San Isidro College in Impalambong, Barangay 10, providing Catholic grade school education within the SIC Basic Education Department.",
    "leadership": "College President: Rev. Fr. Virgilio H. Delfin, CPA, DBM · Grade School Department",
    "contactPerson": "SIC Basic Education / Grade School Office ((088) 813-5541 / info@sic.edu.ph)",
    "contacts": [
      "(088) 813-5541",
      "info@sic.edu.ph"
    ],
    "officialLinks": [
      {
        "label": "San Isidro College Official Website",
        "url": "https://sic.edu.ph/"
      }
    ],
    "logoUrl": "/images/schools/sic.webp",
    "logoNote": "San Isidro College official seal"
  },
  "san-jose-elementary-school": {
    "schoolId": "126591",
    "district": "Malaybalay City District V",
    "studentPopulation": "979 learners (DepEd SY 2024–25)",
    "teacherCount": 28,
    "classroomCount": 17,
    "description": "Public school offering elementary in Barangay San Jose under Malaybalay City District V. In SY 2024–25, it served 979 enrolled learners with 28 teachers and 17 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "san-martin-agro-industrial-national-high-school": {
    "schoolId": "303982",
    "district": "Malaybalay City District VIII",
    "studentPopulation": "620 learners (DepEd SY 2024–25)",
    "teacherCount": 37,
    "classroomCount": 25,
    "description": "Public school offering junior high and senior high in Barangay San Martin under Malaybalay City District VIII. In SY 2024–25, it served 620 enrolled learners with 37 teachers and 25 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "san-martin-elementary-school": {
    "schoolId": "126571",
    "district": "Malaybalay City District VIII",
    "studentPopulation": "697 learners (DepEd SY 2024–25)",
    "teacherCount": 21,
    "classroomCount": 4,
    "description": "Public elementary school (DepEd School ID 126571) serving Barangay San Martin and the adjacent San Martin–Sinanglanan corridor under Malaybalay City District VIII. In SY 2024–25, it served 697 enrolled learners with 21 teachers and 4 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "san-roque-elementary-school": {
    "schoolId": "126572",
    "district": "Malaybalay City District VIII",
    "studentPopulation": "112 learners (DepEd SY 2024–25)",
    "teacherCount": 7,
    "classroomCount": 6,
    "description": "Public elementary school (DepEd School ID 126572) in Sitio San Roque, Barangay Sinanglanan under Malaybalay City District VIII (also paired with San Roque Integrated School ID 502738 in DepEd listings). In SY 2024–25, it recorded 112 enrolled learners with 7 teachers and 6 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "san-roque-integrated-school": {
    "schoolId": "502738",
    "district": "Malaybalay City District VIII",
    "studentPopulation": "120 learners (DepEd SY 2024–25)",
    "teacherCount": 7,
    "classroomCount": 6,
    "description": "Public school offering kindergarten, elementary, junior high, and integrated school in Barangay Sinanglanan under Malaybalay City District VIII. In SY 2024–25, it served 120 enrolled learners with 7 teachers and 6 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "sawaga-elementary-school": {
    "schoolId": "126552",
    "district": "Malaybalay City District VIII",
    "studentPopulation": "397 learners (DepEd SY 2024–25)",
    "teacherCount": 14,
    "classroomCount": 9,
    "description": "Public school offering elementary in Barangay Violeta under Malaybalay City District VIII. In SY 2024–25, it served 397 enrolled learners with 14 teachers and 9 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "silae-elementary-school": {
    "schoolId": "126553",
    "district": "Malaybalay City District X",
    "studentPopulation": "184 learners (DepEd SY 2024–25)",
    "teacherCount": 8,
    "classroomCount": 6,
    "description": "Public school offering elementary in Barangay Silae under Malaybalay City District X. In SY 2024–25, it served 184 enrolled learners with 8 teachers and 6 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "silae-national-high-school": {
    "schoolId": "303984",
    "district": "Malaybalay City District X",
    "studentPopulation": "234 learners (DepEd SY 2024–25)",
    "teacherCount": 27,
    "classroomCount": 17,
    "description": "Public secondary school offering junior high and senior high in Barangay Silae under Malaybalay City District X. In SY 2024–25, it served 234 enrolled learners with 27 teachers and 17 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "simaya-integrated-school": {
    "schoolId": "501582",
    "district": "Malaybalay City District VII",
    "studentPopulation": "415 learners (DepEd SY 2024–25)",
    "teacherCount": 12,
    "classroomCount": 8,
    "description": "Public school offering kindergarten, elementary, junior high, and integrated school in Barangay Simaya under Malaybalay City District VII. In SY 2024–25, it served 415 enrolled learners with 12 teachers and 8 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "st-isidore-academy-sinanglanan": {
    "schoolId": "405008",
    "district": "Malaybalay City District VIII",
    "studentPopulation": "154 learners (DepEd SY 2024–25)",
    "description": "Private Catholic academy offering elementary, junior high, and senior high in Purok 1, Barangay Sinanglanan under Malaybalay City District VIII. In SY 2024–25, it served 154 enrolled learners.",
    "contactPerson": "School Principal or Registrar at the campus · For basic-education inquiries: DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "st-johns-school-malaybalay": {
    "schoolId": "459521",
    "district": "Malaybalay City District IV",
    "studentPopulation": "180 learners (DepEd SY 2024–25)",
    "description": "Private school offering preschool and elementary in Barangay 1 under Malaybalay City District IV. In SY 2024–25, it served 180 enrolled learners.",
    "contactPerson": "School Principal or Registrar at the campus · For basic-education inquiries: DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "st-michael-high-school": {
    "schoolId": "405009",
    "district": "Malaybalay City District VIII",
    "studentPopulation": "312 learners (DepEd SY 2024–25)",
    "description": "Private Catholic secondary school offering junior high and senior high in Purok 1, Barangay Linabo under Malaybalay City District VIII. In SY 2024–25, it served 312 enrolled learners.",
    "contactPerson": "School Principal or Registrar at the campus · For basic-education inquiries: DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "st-peter-elementary-school": {
    "schoolId": "126554",
    "district": "Malaybalay City District X",
    "studentPopulation": "239 learners (DepEd SY 2024–25)",
    "teacherCount": 11,
    "classroomCount": 10,
    "description": "Public school offering elementary in Barangay St. Peter under Malaybalay City District X. In SY 2024–25, it served 239 enrolled learners with 11 teachers and 10 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "st-peter-national-high-school": {
    "schoolId": "314905",
    "district": "Malaybalay City District X",
    "studentPopulation": "299 learners (DepEd SY 2024–25)",
    "teacherCount": 17,
    "classroomCount": 12,
    "description": "Public school offering junior high and senior high in Barangay St. Peter under Malaybalay City District X. In SY 2024–25, it served 299 enrolled learners with 17 teachers and 12 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "sta-ana-elementary-school": {
    "schoolId": "126592",
    "district": "Malaybalay City District III",
    "studentPopulation": "90 learners (DepEd SY 2024–25)",
    "teacherCount": 6,
    "classroomCount": 6,
    "description": "Public school offering elementary in Barangay Casisang under Malaybalay City District III. In SY 2024–25, it served 90 enrolled learners with 6 teachers and 6 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "sumpong-central-school": {
    "schoolId": "126593",
    "district": "Malaybalay City District II",
    "studentPopulation": "1,335 learners (DepEd SY 2024–25)",
    "teacherCount": 38,
    "classroomCount": 37,
    "description": "Public school offering elementary in Barangay Sumpong under Malaybalay City District II. In SY 2024–25, it served 1,335 enrolled learners with 38 teachers and 37 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "sunbeam-christian-academy": {
    "schoolId": "405010",
    "district": "Malaybalay City District VII",
    "studentPopulation": "150 learners (DepEd SY 2024–25)",
    "description": "Private school offering preschool and elementary in Barangay Bangcud under Malaybalay City District VII. In SY 2024–25, it served 150 enrolled learners.",
    "contactPerson": "School Principal or Registrar at the campus · For basic-education inquiries: DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "tag-ilanao-elementary-school": {
    "schoolId": "126594",
    "district": "Malaybalay City District II",
    "studentPopulation": "75 learners (DepEd SY 2024–25)",
    "teacherCount": 4,
    "classroomCount": 3,
    "description": "Public school offering elementary in Barangay Can-ayan under Malaybalay City District II. In SY 2024–25, it served 75 enrolled learners with 4 teachers and 3 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "tamogawe-elementary-school": {
    "schoolId": "137297",
    "district": "Malaybalay City District VI",
    "studentPopulation": "36 learners (DepEd SY 2024–25)",
    "teacherCount": 3,
    "description": "Public elementary school in Sitio Tamogawe, Barangay Mapayag under Malaybalay City District VI. In SY 2024–25, it served 36 enrolled learners with 3 teachers (classroom count not reported in the DepEd SY 2024–25 summary).",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "tintinaan-elementary-school": {
    "schoolId": "126595",
    "district": "Malaybalay City District II",
    "studentPopulation": "149 learners (DepEd SY 2024–25)",
    "teacherCount": 7,
    "classroomCount": 6,
    "description": "Public school offering elementary in Barangay Can-ayan under Malaybalay City District II. In SY 2024–25, it served 149 enrolled learners with 7 teachers and 6 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "tuburan-integrated-school": {
    "schoolId": "501581",
    "district": "Malaybalay City District X",
    "studentPopulation": "453 learners (DepEd SY 2024–25)",
    "teacherCount": 16,
    "classroomCount": 14,
    "description": "Public school offering kindergarten, elementary, junior high, and integrated school in Barangay Mapulo under Malaybalay City District X. In SY 2024–25, it served 453 enrolled learners with 16 teachers and 14 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "zamboanguita-elementary-school": {
    "schoolId": "126556",
    "district": "Malaybalay City District X",
    "studentPopulation": "297 learners (DepEd SY 2024–25)",
    "teacherCount": 12,
    "classroomCount": 8,
    "description": "Public school offering elementary in Barangay Zamboanguita under Malaybalay City District X. In SY 2024–25, it served 297 enrolled learners with 12 teachers and 8 classrooms.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "sti-college-malaybalay": {
    "schoolId": "403708",
    "barangay": "Barangay 7",
    "address": "Fortich Street, Barangay 7 (Poblacion), Malaybalay City, 8700 Bukidnon",
    "district": "Malaybalay City District I · CHED Code 10131",
    "description": "STI College Malaybalay (CHED Inst. Code 10131 · DepEd SHS ID 403708) is a private higher education, Senior High School, and TESDA-registered training campus along Fortich Street in Barangay 7 (Poblacion). It offers tertiary degrees in Information Systems and Tourism Management, four Senior High tracks, and AI/Data Science TESDA qualifications.",
    "contactPerson": "STI College Malaybalay Admissions & Registrar ((088) 813-3877)",
    "contacts": [
      "(088) 813-3877",
      "https://www.sti.edu/campuses/malaybalay"
    ],
    "programmes": [
      "BS in Information Systems (BSIS)",
      "BS in Tourism Management (BSTM)",
      "SHS: Business & Entrepreneurship (B&E) and Arts, Social Sciences & Humanities (ASSH)",
      "SHS: ICT Support & Computer Programming Technologies (ICT-SCPT) and Culinary Arts (HTCUA)",
      "TESDA: Data Collection & Annotation (Data Science–AI Level II) and AI Prompting & Automation (Level III)"
    ],
    "officialLinks": [
      {
        "label": "STI College Malaybalay Official Campus Page",
        "url": "https://www.sti.edu/campuses/malaybalay"
      },
      {
        "label": "STI College Malaybalay Facebook Page",
        "url": "https://www.facebook.com/malaybalay.sti.edu"
      },
      {
        "label": "CHED HEIDA Region X Directory (Code 10131)",
        "url": "https://heida.ched.gov.ph/hei-directory/10?page=10"
      }
    ]
  },
  "bible-baptist-malaybalay-christian-academy": {
    "schoolId": "409078",
    "district": "Malaybalay City District I",
    "description": "Private sectarian basic education school (DepEd School ID 409078) at Zone 6, Sun Flower Village, Barangay Kalasungay offering Kindergarten, Elementary, and Junior High School (K–10) under Malaybalay City District I.",
    "contactPerson": "School Principal or Registrar at the campus · DepEd Malaybalay City Division (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "panamucan-elementary-school": {
    "schoolId": "126551",
    "district": "Malaybalay City District V",
    "description": "Public elementary school (DepEd School ID 126551) in Sitio Panamucan, Barangay San Jose under Malaybalay City District V. Confirm current school-year enrollment and section schedules directly with the campus or DepEd Malaybalay City Division.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "laguitas-elementary-school": {
    "schoolId": "126564",
    "district": "Malaybalay City District VI",
    "description": "Public elementary school (DepEd School ID 126564) in Purok 2, Barangay Laguitas under Malaybalay City District VI. Confirm current school-year enrollment and section schedules directly with the campus or DepEd Malaybalay City Division.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "paiwaig-elementary-school": {
    "schoolId": "199511",
    "district": "Malaybalay City District VIII",
    "description": "Public elementary school (DepEd School ID 199511) in Purok 7, Paiwaig, Barangay Linabo under Malaybalay City District VIII. Confirm current school-year enrollment and section schedules directly with the campus or DepEd Malaybalay City Division.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "matangpatang-elementary-school": {
    "schoolId": "126549",
    "district": "Malaybalay City District IX",
    "description": "Public elementary school (DepEd School ID 126549) in Purok 3, Barangay Miglamin under Malaybalay City District IX. Confirm current school-year enrollment and section schedules directly with the campus or DepEd Malaybalay City Division.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "miglamin-elementary-school": {
    "schoolId": "126550",
    "district": "Malaybalay City District IX",
    "description": "Public elementary school (DepEd School ID 126550) in Barangay Miglamin under Malaybalay City District IX. Confirm current school-year enrollment and section schedules directly with the campus or DepEd Malaybalay City Division.",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  },
  "kibalabag-elementary-school-silae": {
    "schoolId": "199518",
    "district": "Malaybalay City District X",
    "description": "Public elementary school (DepEd School ID 199518) located at Purok 5, Sitio Kibalabag, Barangay Silae under Malaybalay City District X (distinct from Kibalabag Integrated School, ID 501188, in Barangay Kibalabag).",
    "contactPerson": "Campus School Head (campus walk-in) · DepEd Malaybalay City Division — Dr. Cherry Mae L. Limbaco-Reyes, CESO V (0907-688-9009 / malaybalay.city@deped.gov.ph)"
  }
};
