import { barangayMicrosites } from "./barangayProfiles";
import { bidRecords2026 } from "./bidRecords";
import {
  civicRecords,
  departments,
  disclosures,
  gadResources,
  governanceHighlights,
  officials,
  officialRecords,
  procurementSources,
  publicProjects,
  services,
  specialBodyOrders,
} from "./data";
import {
  goodsServicesAwardRecords,
  infrastructureAwardRecords,
} from "./procurementRecords";
import { dpwhMalaybalayProjects2026 } from "./dpwhProjects";
import {
  localServicePathways,
  serviceCategories,
  VERIFIED_SERVICE_PROVIDERS,
} from "./serviceCatalog";
import { documentGuides, educationInstitutions, educationOffices } from "./civicDirectories";
import {
  bacLivestreamEntries,
  budgetTransparencyAllocations,
  civicDiscussionCards,
  legislativeHearingRecords,
  newsletterUpdates,
} from "./publicInformation";
import { governmentOffices, localSpecialBodies } from "./governmentOffices";
import { officePersonnelBySlug } from "./officePersonnel";
import { INITIAL_PESO_OPPORTUNITIES, resolveOpportunityLifecycle } from "./pesoData";

export type PortalSearchRecord = {
  type: string;
  title: string;
  detail: string;
  href: string;
  keywords?: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const staticPages: PortalSearchRecord[] = [
  {
    type: "Page",
    title: "BetterMC home",
    detail: "Malaybalay public information, weather, services, and city overview",
    href: "/",
  },
  {
    type: "Page",
    title: "Transparency center",
    detail: "Full Disclosure records, finances, procurement, staffing, and utilization",
    href: "/transparency",
  },
  {
    type: "Page",
    title: "Legislation and executive issuances",
    detail: "Ordinances, executive orders, and memorandum circulars",
    href: "/legislation",
  },
  {
    type: "Directory",
    title: "Government officials",
    detail: "Mayor, vice mayor, councilors, and sectoral representatives",
    href: "/government?tab=officials",
  },
  {
    type: "Directory",
    title: "City offices & PESO directory",
    detail: `${governmentOffices.length} city offices, personnel, Citizen's Charter services, and PESO Malaybalay`,
    href: "/offices",
  },
  {
    type: "Emergency",
    title: "Emergency contacts",
    detail: "Malaybalay response, health, police, fire, and social-welfare hotlines",
    href: "/offices?sector=Public%20Safety%20%26%20Emergency",
  },
  {
    type: "Directory",
    title: "All 46 barangays",
    detail: "Barangay profiles, officials, population, services, projects, and maps",
    href: "/barangays",
  },
  {
    type: "Page",
    title: "Public services",
    detail: "City service standards, forms, office routes, and national service guides",
    href: "/services",
  },
  {
    type: "Page",
    title: "Correction desk",
    detail: "Suggest a correction, report a broken link, or submit a public document",
    href: "/participate",
  },
  {
    type: "Page",
    title: "About BetterMC",
    detail: "Editorial policy, sources, independence, and verification methodology",
    href: "/about",
  },
];

export const portalSearchIndex: PortalSearchRecord[] = [
  ...staticPages,
  {
    type: "Directory",
    title: "Education directory",
    detail: "Source-listed schools, higher education institutions, and technical-vocational providers",
    href: "/education",
    keywords: "school DepEd school ID college university TESDA preschool elementary junior senior high",
  },
  {
    type: "Guide",
    title: "One-stop document guide",
    detail: "Combine source-linked document-service starting checklists",
    href: "/documents",
    keywords: "barangay clearance certificate civil registry requirements forms fees processing time",
  },
  ...educationInstitutions.map((school) => ({
    type: "Education institution",
    title: school.name,
    detail: `${school.type} · ${school.address}`,
    href: `/education/${school.slug}`,
    keywords: `${school.schoolId ?? ""} ${school.barangay ?? ""} ${school.levels.join(" ")}`,
  })),
  ...educationOffices.map((office) => ({
    type: "Education office",
    title: office.name,
    detail: office.jurisdiction,
    href: "/education/offices",
    keywords: `${office.address} ${office.contacts.join(" ")} ${office.officials.map((official) => official.name).join(" ")}`,
  })),
  ...documentGuides.map((guide) => ({
    type: "Document guide",
    title: guide.title,
    detail: `${guide.office} · ${guide.status}`,
    href: "/documents",
    keywords: `${guide.scope} ${guide.requirements.join(" ")} ${guide.steps.join(" ")}`,
  })),
  ...officials.map((official) => ({
    type: "Official",
    title: official.name,
    detail: `${official.role} · ${official.office.name}`,
    href: `/government?tab=officials&official=${slugify(official.name)}`,
    keywords: [
      official.group,
      ...(official.chairmanships ?? []),
      ...(official.committeeMemberships ?? []),
    ].join(" "),
  })),
  ...governmentOffices.map((office) => {
    const roster = officePersonnelBySlug[office.slug];
    const staffNames = roster
      ? roster.groups.flatMap((g) => g.members.map((m) => m.name))
      : [];
    return {
      type: `City office · ${office.acronym}`,
      title: office.name,
      detail: [office.classification, office.phoneNumbers[0], office.emails[0]].filter(Boolean).join(" · "),
      href: office.slug === "peso" ? "/peso" : `/offices/${office.slug}`,
      keywords: [
        office.shortName,
        office.acronym,
        office.parentOffice ?? "",
        office.subdomainHost,
        office.mandate,
        ...(office.divisions ?? []),
        ...staffNames,
        ...office.services.map((s) => s.title),
      ].join(" "),
    };
  }),
  ...localSpecialBodies.map((body) => ({
    type: `Special body · ${body.executiveOrder}`,
    title: body.name,
    detail: `${body.leadOfficeName} · ${body.mandateSummary}`,
    href: `/offices/${body.leadOfficeSlug}`,
    keywords: `${body.executiveOrder} ${body.year} committee board special body`,
  })),
  ...INITIAL_PESO_OPPORTUNITIES.map((job) => {
    const lifecycle = resolveOpportunityLifecycle(job);
    return {
      type: `PESO · ${lifecycle.label}`,
      title: job.title,
      detail: [job.employer, job.salaryGradeOrCompensation, job.location].filter(Boolean).join(" · "),
      href: `/jobs/${job.slug}`,
      keywords: [
        job.opportunityType,
        job.employmentType,
        ...job.qualifications,
        job.sourceLabel,
      ].join(" "),
    };
  }),
  ...departments
    .filter((department) => department.emergency)
    .map((department) => ({
      type: "Emergency hotline",
      title: department.name,
      detail: [department.phone, department.email].filter(Boolean).join(" · "),
      href: "/offices?sector=Public%20Safety%20%26%20Emergency",
    })),
  ...barangayMicrosites.map((barangay) => ({
    type: "Barangay",
    title: barangay.name,
    detail: `${barangay.classification} barangay · Punong Barangay ${barangay.punongBarangay} · ${barangay.population.toLocaleString("en-PH")} residents`,
    href: `/barangays/${barangay.slug}`,
    keywords: `${barangay.code} barangay hall captain kagawad sk secretary ${barangay.officialRoster.officials.map((o) => o.name).join(" ")} population projects services map`,
  })),
  ...barangayMicrosites.flatMap((barangay) =>
    barangay.officialRoster.officials.map((official) => ({
      type: `Barangay ${official.position}`,
      title: official.name,
      detail: `${official.position} · Barangay ${barangay.name}`,
      href: `/barangays/${barangay.slug}#leadership`,
      keywords: `barangay official kagawad sk chairperson secretary ${barangay.name} DILG`,
    })),
  ),
  ...civicRecords.map((record) => ({
    type: record.kind,
    title: record.number,
    detail: record.title,
    href: `/legislation/${slugify(record.number)}`,
    keywords: `${record.body} ${record.attribution} ${record.published}`,
  })),
  ...officialRecords.map((record) => ({
    type: `${record.kind} · attributed record`,
    title: record.number,
    detail: `${record.officialName} · ${record.title}${record.partner ? ` (${record.partner})` : ""}`,
    href: `/government?tab=officials&official=${slugify(record.officialName)}`,
    keywords: `${record.category ?? ""} ${record.summary ?? ""} ${record.partner ?? ""} ${record.status} ${record.attribution} ${record.date}`,
  })),
  ...disclosures.map((record) => ({
    type: `${record.category} record`,
    title: `${record.title} · ${record.year} ${record.quarter}`,
    detail: record.status,
    href: `/transparency/${record.year}/${record.quarter.toLowerCase()}/${slugify(record.title)}`,
    keywords: `full disclosure document download ${record.category}`,
  })),
  ...procurementSources.map((source) => ({
    type: source.kind,
    title: source.title,
    detail: `${source.description} · ${source.coverage}`,
    href: source.path,
    keywords: "BAC procurement bid award notice project PhilGEPS",
  })),
  ...bidRecords2026.map((record) => ({
    type: record.stage,
    title: record.number,
    detail: record.title.replace(/^ITB-\d{4}-\d+\.?\s*/i, ""),
    href:
      record.stage === "Small value procurement"
        ? "/procurement/small-value-procurement"
        : "/procurement/bidding-opportunities",
    keywords: `${record.barangays.join(" ")} BAC ITB 2026 procurement project`,
  })),
  ...dpwhMalaybalayProjects2026.map((project) => ({
    type:
      project.stage === "active-contract"
        ? "DPWH infrastructure contract"
        : "DPWH project for procurement",
    title: `${project.contractId} · ${project.title}`,
    detail: `${project.barangayName} · ${project.status}${project.contractor ? ` · ${project.contractor}` : ""}`,
    href: `/barangays/${project.barangaySlug}#full-disclosure`,
    keywords: `${project.officialDescription} ${project.sourceOfFunds ?? ""} DPWH contract cost accomplishment contractor infrastructure taxes`,
  })),
  ...infrastructureAwardRecords.map((record) => ({
    type: "Infrastructure award",
    title: record.number,
    detail: record.title,
    href: "/procurement/infrastructure-awards",
    keywords: `${record.year} BAC PhilGEPS award notice project`,
  })),
  ...goodsServicesAwardRecords.map((record) => ({
    type: "Goods and services award",
    title: record.number,
    detail: record.title,
    href: "/procurement/goods-services-awards",
    keywords: `${record.year} BAC PhilGEPS award notice purchase`,
  })),
  ...serviceCategories.map((category) => ({
    type: "Service guide",
    title: category.title,
    detail: category.summary,
    href: `/services/${category.slug}`,
    keywords: `${category.localContext} ${category.subcategories
      .map((subcategory) => subcategory.title)
      .join(" ")}`,
  })),
  ...VERIFIED_SERVICE_PROVIDERS.flatMap((provider) => [
    {
      type: "Service provider",
      title: provider.name,
      detail: `${provider.jurisdiction} · ${provider.address}`,
      href: `/services/${provider.categorySlug}`,
      keywords: `${provider.barangay} ${provider.shortName} ${provider.phone ?? ""} ${provider.hours} ${provider.onlinePortalLabel}`,
    },
    ...provider.transactions.map((tx) => ({
      type: "Public transaction",
      title: tx.title,
      detail: `${provider.shortName} · ${tx.processingTime}`,
      href: `/services/${provider.categorySlug}?provider=${provider.id}&tx=${tx.id}`,
      keywords: `${tx.requirements.join(" ")} ${tx.feeSchedule} ${provider.name} transaction requirements fees`,
    })),
  ]),
  ...services.map((service) => ({
    type: "City service",
    title: service.title,
    detail: `${service.office} · ${service.description}`,
    href: "/services",
  })),
  ...localServicePathways.map((service) => ({
    type: "Service pathway",
    title: service.title,
    detail: `${service.office} · ${service.description}`,
    href: service.external ? "/services" : service.href,
  })),
  ...gadResources.map((resource) => ({
    type: "GAD resource",
    title: resource.title,
    detail: resource.kind,
    href: "/services",
    keywords: "gender and development plan budget report ordinance download",
  })),
  ...specialBodyOrders.map((record) => ({
    type: "Special body",
    title: `${record.number} · ${record.title}`,
    detail: "Local special body or committee order",
    href: "/services",
    keywords: "executive order committee council board",
  })),
  ...publicProjects.map((project) => ({
    type: "Project",
    title: project.title,
    detail: `${project.location} · ${project.reportedProgress} reported progress`,
    href: "/government?tab=records",
    keywords: `${project.status} ${project.period}`,
  })),
  ...governanceHighlights.map((highlight) => ({
    type: highlight.category,
    title: highlight.title,
    detail: highlight.description,
    href: "/government?tab=records",
    keywords: `${highlight.year} award recognition initiative`,
  })),
  {
    type: "Page",
    title: "Legislative hearings and sessions",
    detail: "Malaybalay City Council sessions, committee hearings, agendas, and BetterGov.PH hearing references",
    href: "/hearings",
    keywords: "Sangguniang Panlungsod session public hearing agenda committee BetterGov",
  },
  {
    type: "Page",
    title: "Government budget transparency",
    detail: "Malaybalay City budget allocations, sectors, programs, and BetterGov.PH FY 2027 HGAB comparison",
    href: "/budget",
    keywords: "budget transparency HGAB 2027 NEP allocation sector expenditure BetterGov",
  },
  {
    type: "Page",
    title: "BAC LGU Malaybalay livestream monitoring",
    detail: "Procurement livestreams, bidding discussions, FDP Form 10a outcomes, and .docx/.txt documentation",
    href: "/procurement/livestreams",
    keywords: "BAC LGU Malaybalay Facebook livestream bidding procurement documentation docx txt",
  },
  ...newsletterUpdates
    .filter((item) => !item.internalRoute.startsWith("/legislation/"))
    .map((item) => ({
      type: item.category,
      title: item.title,
      detail: `${item.publishedDate} · ${item.sourceAttribution}`,
      href: item.internalRoute,
      keywords: `${item.description} ${item.verificationStatus}`,
    })),
  ...civicDiscussionCards.map((card) => ({
    type: "Public discussion",
    title: card.title,
    detail: `${card.category} · ${card.publishedDate}`,
    href: card.internalRoute,
    keywords: `${card.background} ${card.implications}`,
  })),
  ...legislativeHearingRecords.map((hearing) => ({
    type: hearing.sessionType,
    title: hearing.title,
    detail: `${hearing.sessionDate} · ${hearing.committeeOrBody}`,
    href: "/hearings",
    keywords: `${hearing.presidingOrChair} ${hearing.agendaItems.join(" ")} ${hearing.ordinancesAndResolutions.join(" ")}`,
  })),
  ...bacLivestreamEntries
    .filter((entry) => !entry.referenceCode.startsWith("ITB-"))
    .map((entry) => ({
      type: "BAC procurement & livestream",
      title: `${entry.referenceCode} · ${entry.projectName}`,
      detail: `${entry.participatingAgencyOrBarangay} · ${entry.identifiedContractorOrBidder}`,
      href: "/procurement/livestreams",
      keywords: `${entry.procurementStatus} ${entry.scheduleOrPeriod} BAC livestream`,
    })),
  ...budgetTransparencyAllocations.map((item) => ({
    type: "Budget allocation",
    title: item.programOrProject,
    detail: `${item.fiscalYear} · ${item.sectorOrDepartment}`,
    href: "/budget",
    keywords: `${item.classification} ${item.fundingStage} ${item.scope}`,
  })),
];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export function searchPortal(query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];
  const tokens = normalizedQuery.split(/\s+/);

  return portalSearchIndex
    .map((record) => {
      const title = normalize(record.title);
      const haystack = normalize(
        `${record.title} ${record.detail} ${record.type} ${record.keywords ?? ""}`,
      );
      if (!tokens.every((token) => haystack.includes(token))) return null;
      const score =
        (title === normalizedQuery ? 100 : 0) +
        (title.startsWith(normalizedQuery) ? 40 : 0) +
        (title.includes(normalizedQuery) ? 20 : 0) +
        (normalize(record.type).includes(normalizedQuery) ? 5 : 0);
      return { record, score };
    })
    .filter((match): match is { record: PortalSearchRecord; score: number } =>
      Boolean(match),
    )
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.record.title.localeCompare(right.record.title),
    )
    .map((match) => match.record);
}
