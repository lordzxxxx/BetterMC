import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Calendar,
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  FileCheck,
  Filter,
  Globe,
  Info,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldAlert,
  Users,
} from "lucide-react";
import {
  governmentOfficeBySlug,
  governmentOffices,
  localSpecialBodies,
  MAIN_BETTERMC_URL,
  OFFICE_CATEGORIES,
  officeDirectoryPath,
  officeSlugFromHostname,
  resolveOfficeSlug,
  type GovernmentOffice,
  type OfficeCategory,
} from "../governmentOffices";
import { officePersonnelBySlug } from "../officePersonnel";
import {
  CSC_FORM_9_2024_URL,
  INITIAL_PESO_OPPORTUNITIES,
  PESO_FACEBOOK_PAGE_URL,
  PESO_VACANCIES_SUMMARY,
  resolveOpportunityLifecycle,
  type OpportunityDisplayStatus,
  type OpportunityType,
} from "../pesoData";
import { VERIFIED_ON } from "../data";

function safeHref(raw?: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function mapsSearchHref(query: string, coords?: [number, number]): string {
  if (coords) {
    return `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** High-contrast circular Facebook mark legible on both light and dark buttons. */
function FbGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11.5" fill="#1877F2" stroke="#ffffff" strokeOpacity="0.45" />
      <path
        fill="#ffffff"
        d="M13.861 23.4v-8.05h2.68l.4-3.12h-3.08V10.24c0-.9.25-1.52 1.55-1.52h1.65V5.93c-.29-.04-1.27-.12-2.41-.12-2.38 0-4.01 1.45-4.01 4.12v2.3H7.97v3.12h2.67v8.05a11.5 11.5 0 0 0 3.22 0z"
      />
    </svg>
  );
}

function OfficeLogoBadge({
  office,
  size = "md",
}: {
  office: GovernmentOffice;
  size?: "sm" | "md" | "lg";
}) {
  const hasLogo = office.logoStatus === "Verified Local Asset" && Boolean(office.logoPath);
  return (
    <div className={`office-logo-frame is-${size}${hasLogo ? " has-logo" : ""}`}>
      {hasLogo ? (
        <img
          src={office.logoPath}
          alt={`${office.shortName} official emblem`}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <Building2 aria-hidden="true" />
      )}
    </div>
  );
}

function usePublicPesoOpportunities() {
  return useMemo(
    () =>
      INITIAL_PESO_OPPORTUNITIES.filter(
        (item) => resolveOpportunityLifecycle(item).isVisibleToPublic,
      ).sort((a, b) => b.publishedDate.localeCompare(a.publishedDate)),
    [],
  );
}

const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  "job-vacancy": "Job Vacancy",
  "livelihood-program": "Livelihood Program",
  "job-fair": "Job Fair",
  "skills-training": "Skills Training / OJT",
  "recruitment-event": "Recruitment Activity",
};

function StatusLabel({ status, label }: { status: OpportunityDisplayStatus; label: string }) {
  return <span className={`peso-status-text is-${status}`}>{label}</span>;
}

function opportunityCompensationDisplay(item: {
  opportunityType: OpportunityType;
  salaryGradeOrCompensation?: string;
}): { label: string; value: string } {
  if (item.salaryGradeOrCompensation) {
    return {
      label: item.opportunityType === "job-vacancy" ? "Salary / Grade" : "Program Benefit",
      value: item.salaryGradeOrCompensation,
    };
  }
  if (item.opportunityType === "job-vacancy") {
    return {
      label: "Compensation",
      value: "Refer to official employer notice",
    };
  }
  return {
    label: "Service Fee",
    value: "Free (RA 8759)",
  };
}

function MicrositeUrlAnchor({
  url,
  host,
  className,
  showIcons = false,
}: {
  url: string;
  host: string;
  className?: string;
  showIcons?: boolean;
}) {
  return (
    <a className={className} href={url} target="_blank" rel="noopener noreferrer">
      {showIcons ? <Globe aria-hidden="true" /> : null}
      <span className="office-url-text">
        <span>https://</span>
        <span>{host}</span>
      </span>
    </a>
  );
}

/**
 * Searchable & filterable City Offices Directory (/offices).
 * Consolidates all 35 City Offices, Mayor's divisions, PESO hub access,
 * and 18 Local Special Bodies into one clean directory.
 */
export function OfficeDirectoryBrowser({ compactHeader = false }: { compactHeader?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const sectorParam = searchParams.get("sector");
  const selectedCategory: "All" | OfficeCategory = useMemo(() => {
    if (sectorParam && (OFFICE_CATEGORIES as readonly string[]).includes(sectorParam)) {
      return sectorParam as OfficeCategory;
    }
    return "All";
  }, [sectorParam]);

  const setSectorCategory = (category: "All" | OfficeCategory) => {
    const next = new URLSearchParams(searchParams);
    if (category === "All") {
      next.delete("sector");
    } else {
      next.set("sector", category);
    }
    setSearchParams(next, { replace: true });
  };

  const filteredOffices = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return governmentOffices.filter((office) => {
      if (selectedCategory !== "All" && office.category !== selectedCategory) return false;
      if (!needle) return true;
      const roster = officePersonnelBySlug[office.slug];
      const staffHay = roster
        ? roster.groups.flatMap((g) => g.members.map((m) => `${m.name} ${m.position}`))
        : [];
      const hay = [
        office.name,
        office.shortName,
        office.acronym,
        office.category,
        office.parentOffice ?? "",
        office.overview,
        office.mandate,
        ...office.emails,
        ...office.phoneNumbers,
        ...(office.divisions ?? []),
        ...staffHay,
        ...office.services.map((s) => s.title),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [query, selectedCategory]);

  return (
    <div className="offices-browser">
      {!compactHeader ? (
        <div className="offices-peso-spotlight bettermc-surface-card">
          <div className="offices-peso-spotlight-main">
            <img src="/images/offices/peso.png" alt="PESO Malaybalay official emblem" />
            <div>
              <h2>Public Employment Service Office (PESO Malaybalay)</h2>
              <p>
                NSRP job matching, DOLE SPES &amp; TUPAD programs, OFW referral desks, and job
                opportunities at{" "}
                <MicrositeUrlAnchor
                  className="office-inline-url"
                  url="https://peso.bettermalaybalay.cloud"
                  host="peso.bettermalaybalay.cloud"
                />
                .
              </p>
            </div>
          </div>
          <div className="offices-peso-spotlight-actions">
            <Link className="button primary" to="/peso">
              Open PESO Hub &amp; Jobs <ArrowRight aria-hidden="true" />
            </Link>
            <a
              className="button secondary"
              href={PESO_FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FbGlyph size={15} /> Official PESO Facebook
            </a>
          </div>
        </div>
      ) : null}

      <div className="offices-filter-bar bettermc-surface-card">
        <div className="offices-toolbar">
          <label className="offices-search-field">
            <span className="sr-only">Search Malaybalay City offices, personnel, and services</span>
            <Search aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search office, acronym, personnel, service, division, or contact..."
            />
          </label>
          <div className="offices-filter-meta">
            <span>
              Showing {filteredOffices.length} of {governmentOffices.length} offices
            </span>
            {(query || selectedCategory !== "All") && (
              <button
                type="button"
                className="link-reset-btn"
                onClick={() => {
                  setQuery("");
                  setSectorCategory("All");
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="offices-category-pills" role="tablist" aria-label="Filter offices by sector">
          <button
            type="button"
            className={selectedCategory === "All" ? "is-active" : ""}
            onClick={() => setSectorCategory("All")}
          >
            All ({governmentOffices.length})
          </button>
          {OFFICE_CATEGORIES.map((category) => {
            const count = governmentOffices.filter((o) => o.category === category).length;
            if (!count) return null;
            return (
              <button
                key={category}
                type="button"
                className={selectedCategory === category ? "is-active" : ""}
                onClick={() => setSectorCategory(category)}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filteredOffices.length === 0 ? (
        <div className="bettermc-surface-card offices-empty-state">
          <Info aria-hidden="true" />
          <p>No Malaybalay offices matched "{query}".</p>
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              setQuery("");
              setSectorCategory("All");
            }}
          >
            Show all {governmentOffices.length} offices
          </button>
        </div>
      ) : (
        <div className="offices-grid">
          {filteredOffices.map((office) => {
            const profilePath = officeDirectoryPath(office);
            return (
              <article key={office.slug} className="office-dir-card bettermc-surface-card">
                <div className="office-dir-top">
                  <header className="office-dir-card-head">
                    <OfficeLogoBadge office={office} size="sm" />
                    <div className="office-dir-card-context">
                      <strong className="office-dir-kicker">
                        {office.parentOffice
                          ? `Under ${office.parentOffice}`
                          : office.classification.split("—")[0].trim()}
                      </strong>
                      <span className="office-dir-submeta">
                        {office.acronym} · Malaybalay City
                      </span>
                    </div>
                  </header>
                  <h3 className="office-dir-title">
                    <Link to={profilePath}>{office.name}</Link>
                  </h3>
                </div>

                <p className="office-dir-summary">{office.cardSummary ?? office.overview}</p>

                <dl className="office-dir-facts">
                  <div className="office-dir-fact-row">
                    <dt>
                      <Users aria-hidden="true" />
                      <span>Office Head</span>
                    </dt>
                    <dd>
                      {office.headOfOffice
                        ? office.headOfOffice.split("•")[0].trim()
                        : office.headNote || "See assigned personnel"}
                    </dd>
                  </div>
                  <div className="office-dir-fact-row">
                    <dt>
                      <MapPin aria-hidden="true" />
                      <span>Location</span>
                    </dt>
                    <dd>{office.cardLocation ?? office.address}</dd>
                  </div>
                  <div className="office-dir-fact-row">
                    <dt>
                      <Phone aria-hidden="true" />
                      <span>Contact</span>
                    </dt>
                    <dd className="office-dir-tel-list">
                      {office.phoneNumbers.length > 0 ? (
                        office.phoneNumbers.slice(0, 2).map((phone) => (
                          <a key={phone} className="office-dir-tel" href={telHref(phone)}>
                            {phone}
                          </a>
                        ))
                      ) : (
                        <span className="office-dir-muted">Not published</span>
                      )}
                    </dd>
                  </div>
                  <div className="office-dir-fact-row">
                    <dt>
                      <Mail aria-hidden="true" />
                      <span>Email</span>
                    </dt>
                    <dd>
                      {office.emails[0] ? (
                        <a className="office-dir-email" href={`mailto:${office.emails[0]}`}>
                          {office.emails[0]}
                        </a>
                      ) : (
                        <span className="office-dir-muted">Not published</span>
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="office-dir-actions">
                  <Link className="office-profile-link" to={profilePath}>
                    <span>Open profile</span>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                  <MicrositeUrlAnchor
                    className="office-microsite-link"
                    url={office.subdomainUrl}
                    host={office.subdomainHost}
                    showIcons
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}

      <section className="special-bodies-section" aria-labelledby="local-special-bodies-heading">
        <div className="special-bodies-header">
          <div>
            <h2 id="local-special-bodies-heading">
              Local Special Bodies &amp; Special Committees ({localSpecialBodies.length})
            </h2>
            <p>
              City committees formed under Executive Orders that bring together City Hall offices,
              national agencies, barangays, and community organizations.
            </p>
          </div>
          <a
            className="office-inline-url"
            href="https://sakata.malaybalaycity.gov.ph/local-special-bodies-and-special-committees/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Official EO Archive <ExternalLink aria-hidden="true" />
          </a>
        </div>

        <div className="special-bodies-grid">
          {localSpecialBodies.map((body) => (
            <article key={body.id} className="special-body-card bettermc-surface-card">
              <p className="special-body-meta">
                {body.executiveOrder} · {body.year}
              </p>
              <h3>{body.name}</h3>
              <p>{body.mandateSummary}</p>
              <div className="special-body-footer">
                <Link className="office-profile-link" to={`/offices/${body.leadOfficeSlug}`}>
                  <span>Lead office: {body.leadOfficeName}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Full page route: /offices
 */
export function GovernmentOfficesDirectoryPage() {
  return (
    <>
      <section className="page-hero page-hero-compact">
        <div className="container">
          <h1>City Offices, Divisions &amp; Partner Institutions</h1>
          <p>
            Find any Malaybalay City Hall department, service division (PESO, Scholarships, OSCA,
            BPLD, Tourism, and TMC), legislative office, or national partner desk. See who leads
            each office, who to reach out to, where to go, and how to contact them.
          </p>
          <div className="hero-actions" style={{ marginTop: 18 }}>
            <Link className="button primary" to="/peso">
              Open PESO &amp; Job Opportunities <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="button secondary" to="/government">
              City Officials &amp; Measures
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        <OfficeDirectoryBrowser />
      </section>
    </>
  );
}

function PesoEmploymentBoard({ embeddedInPesoPage = false }: { embeddedInPesoPage?: boolean }) {
  const opportunities = usePublicPesoOpportunities();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | OpportunityType>("all");
  const [statusFilter, setStatusFilter] = useState<
    "active-open" | "all" | "expired" | "recurring-program"
  >("active-open");

  const enriched = useMemo(() => {
    const now = new Date();
    return opportunities.map((item) => ({
      item,
      lifecycle: resolveOpportunityLifecycle(item, now),
    }));
  }, [opportunities]);

  const counts = useMemo(() => {
    let activeOpen = 0;
    let expiredOrArchived = 0;
    let recurring = 0;
    for (const { lifecycle } of enriched) {
      if (lifecycle.displayStatus === "expired" || lifecycle.displayStatus === "archived") {
        expiredOrArchived += 1;
      } else if (lifecycle.displayStatus === "recurring-program") {
        recurring += 1;
        activeOpen += 1;
      } else if (lifecycle.isVisibleToPublic) {
        activeOpen += 1;
      }
    }
    return { activeOpen, expiredOrArchived, recurring, total: enriched.length };
  }, [enriched]);

  const visibleItems = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return enriched.filter(({ item, lifecycle }) => {
      if (typeFilter !== "all" && item.opportunityType !== typeFilter) return false;
      if (statusFilter === "active-open") {
        if (lifecycle.isExpired) return false;
      } else if (statusFilter === "expired") {
        if (!lifecycle.isExpired) return false;
      } else if (statusFilter === "recurring-program") {
        if (lifecycle.displayStatus !== "recurring-program") return false;
      }
      if (!needle) return true;
      const hay = [
        item.title,
        item.employer,
        item.location,
        item.description,
        item.salaryGradeOrCompensation ?? "",
        ...item.qualifications,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [enriched, searchQuery, typeFilter, statusFilter]);

  return (
    <div className="peso-jobs-board" id="job-opportunities">
      <div className="peso-board-header">
        <div>
          <h2>
            {embeddedInPesoPage
              ? "Employment Opportunities, Programs & Hiring Records"
              : "Malaybalay City Job & Livelihood Opportunities"}
          </h2>
          <p>
            Active PESO–DOLE employment facilitation, job fair programs, and archived Civil Service
            plantilla records. Deadlines automatically transition postings to Expired after closing.
          </p>
        </div>
        <Link className="office-inline-url" to="/participate">
          Submit vacancy correction <ArrowRight aria-hidden="true" />
        </Link>
      </div>

      <div className="peso-fb-source-notice bettermc-surface-card">
        <FbGlyph size={20} />
        <div>
          Same-day private-company hiring posters screened by PESO Malaybalay are published on the{" "}
          <a href={PESO_FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer">
            Official PESO Malaybalay Facebook Page
          </a>
          . Verified recurring PESO programs and Civil Service plantilla publications are indexed
          below for search.
        </div>
      </div>

      <div className="peso-filters-panel bettermc-surface-card">
        <div className="peso-search-row">
          <label className="offices-search-field">
            <span className="sr-only">Search job title, employer, salary grade, or qualification</span>
            <Search aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search position, employer, DOLE program, salary grade, or eligibility..."
            />
          </label>

          <label className="peso-select-field">
            <span>
              <Filter aria-hidden="true" /> Category
            </span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | OpportunityType)}
            >
              <option value="all">All Categories</option>
              <option value="job-vacancy">Job Vacancies</option>
              <option value="livelihood-program">Livelihood &amp; SPES Programs</option>
              <option value="job-fair">Job Fairs</option>
              <option value="skills-training">Skills Training &amp; OJT</option>
              <option value="recruitment-event">Recruitment Activities</option>
            </select>
          </label>
        </div>

        <div className="peso-status-tabs" role="tablist" aria-label="Filter opportunities by status">
          <button
            type="button"
            className={statusFilter === "active-open" ? "is-active" : ""}
            onClick={() => setStatusFilter("active-open")}
          >
            Active &amp; Ongoing ({counts.activeOpen})
          </button>
          <button
            type="button"
            className={statusFilter === "expired" ? "is-active" : ""}
            onClick={() => setStatusFilter("expired")}
          >
            Expired / CS Form No. 9 Archive ({counts.expiredOrArchived})
          </button>
          <button
            type="button"
            className={statusFilter === "all" ? "is-active" : ""}
            onClick={() => setStatusFilter("all")}
          >
            Show All ({counts.total})
          </button>
        </div>
      </div>

      {visibleItems.length === 0 ? (
        <div className="bettermc-surface-card offices-empty-state">
          <Info aria-hidden="true" />
          <p>No job or program listings match the current filters.</p>
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              setSearchQuery("");
              setTypeFilter("all");
              setStatusFilter("all");
            }}
          >
            Show all listings ({counts.total})
          </button>
        </div>
      ) : (
        <div className="peso-jobs-grid">
          {visibleItems.map(({ item, lifecycle }) => {
            const comp = opportunityCompensationDisplay(item);
            return (
              <article
                key={item.slug}
                className={`peso-job-card bettermc-surface-card${lifecycle.isExpired ? " is-expired" : ""}`}
              >
                <header className="peso-job-head">
                  <p className="peso-job-meta-line">
                    <span>{OPPORTUNITY_TYPE_LABELS[item.opportunityType]}</span>
                    <span aria-hidden="true">·</span>
                    <StatusLabel status={lifecycle.displayStatus} label={lifecycle.label} />
                  </p>

                  <h3>
                    <Link to={`/jobs/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="peso-job-employer">
                    <Building2 aria-hidden="true" /> <span>{item.employer}</span>
                  </p>
                </header>
                <p className="peso-job-summary">{item.cardSummary ?? item.description}</p>

                <dl className="peso-job-meta">
                  <div>
                    <dt>Location / Venue</dt>
                    <dd>{item.location}</dd>
                  </div>
                  <div>
                    <dt>{comp.label}</dt>
                    <dd>{comp.value}</dd>
                  </div>
                  <div>
                    <dt>Published</dt>
                    <dd>{item.publishedDate}</dd>
                  </div>
                  {item.deadlineDate ? (
                    <div>
                      <dt>Deadline</dt>
                      <dd>{item.deadlineDate}</dd>
                    </div>
                  ) : null}
                  {typeof item.vacanciesCount === "number" ? (
                    <div>
                      <dt>Vacancies</dt>
                      <dd>{item.vacanciesCount}</dd>
                    </div>
                  ) : null}
                </dl>

                <div className="peso-job-card-footer">
                  <Link className="button primary small" to={`/jobs/${item.slug}`}>
                    View details <ArrowRight aria-hidden="true" />
                  </Link>
                  {safeHref(item.sourceUrl) ? (
                    <a
                      className="peso-source-text-link"
                      href={safeHref(item.sourceUrl) ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source <ExternalLink aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="peso-csc-summary-card bettermc-surface-card">
        <div>
          <h3>{PESO_VACANCIES_SUMMARY.publicationTitle}</h3>
          <p>
            Official City Hall publication dated {PESO_VACANCIES_SUMMARY.publishedDate} (closed{" "}
            {PESO_VACANCIES_SUMMARY.closingDate}) covered{" "}
            {PESO_VACANCIES_SUMMARY.totalPublishedItems} plantilla items across City Engineering
            (19), Agriculture (11), Mayor&apos;s Office (9), Accounting (9), Health (8), Assessor
            (5), Veterinary (5), CEEDMO (5), CSWDO (4), and 17 items across other offices.
          </p>
        </div>
        <a
          className="button secondary small"
          href={CSC_FORM_9_2024_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download aria-hidden="true" /> Official CS Form No. 9 PDF
        </a>
      </div>
    </div>
  );
}

/**
 * Standardized Office Microsite Page used across /offices/:slug, /peso,
 * and *.bettermalaybalay.cloud subdomains.
 */
export function OfficeLandingPage({ slugOverride }: { slugOverride?: string } = {}) {
  const { slug: routeSlug } = useParams();
  const canonicalSlug = resolveOfficeSlug(slugOverride ?? routeSlug ?? "");
  const office = canonicalSlug ? governmentOfficeBySlug.get(canonicalSlug) : undefined;
  const [serviceSearch, setServiceSearch] = useState("");
  const [openServiceIndex, setOpenServiceIndex] = useState<number | null>(0);

  if (!office) {
    return (
      <section className="section container bettermc-surface-card" style={{ marginTop: 32, marginBottom: 48, padding: 28 }}>
        <h1>Office profile not found</h1>
        <p>The requested Malaybalay City office profile does not exist in our verified directory.</p>
        <div className="hero-actions" style={{ marginTop: 16 }}>
          <Link className="button primary" to="/offices">
            Browse All Offices
          </Link>
          <Link className="button secondary" to="/">
            Return Home
          </Link>
        </div>
      </section>
    );
  }

  const relatedSpecialBodies = localSpecialBodies.filter(
    (b) => b.leadOfficeSlug === office.slug,
  );
  const personnelEntry = officePersonnelBySlug[office.slug];
  const filteredServices = office.services.filter((service) => {
    if (!serviceSearch.trim()) return true;
    return [service.title, service.whoMayAvail ?? "", ...(service.requirements ?? [])]
      .join(" ")
      .toLowerCase()
      .includes(serviceSearch.trim().toLowerCase());
  });

  const fbSafe = safeHref(office.facebookUrl);
  const webSafe = safeHref(office.officialWebUrl);
  const mapUrl = mapsSearchHref(office.mapQuery, office.coordinates);
  const isHostSubdomain =
    typeof window !== "undefined" && Boolean(officeSlugFromHostname(window.location.hostname, ""));

  return (
    <div className="office-landing-page">
      <section className="office-hero">
        <div className="office-hero-backdrop" aria-hidden="true" />
        <div className="container office-hero-content">
          <div className="office-brand-lockup">
            <div
              className={`office-logo-frame is-hero${
                office.logoStatus === "Verified Local Asset" && office.logoPath ? " has-logo" : ""
              }`}
            >
              {office.logoStatus === "Verified Local Asset" && office.logoPath ? (
                <img
                  src={office.logoPath}
                  alt={`${office.shortName} official emblem`}
                  decoding="async"
                />
              ) : (
                <Building2 aria-hidden="true" />
              )}
            </div>
            <div className="office-bettermc-mark">
              <img src="/bettermc1.png" alt="" aria-hidden="true" decoding="async" />
              <span>Powered by BetterMC</span>
            </div>
          </div>

          <div className="office-hero-copy">
            <nav
              className="office-hero-breadcrumb"
              aria-label={`${office.shortName} microsite location`}
            >
              {isHostSubdomain ? (
                <a href={MAIN_BETTERMC_URL}>BetterMC Home</a>
              ) : (
                <Link to="/">BetterMC Home</Link>
              )}
              <span aria-hidden="true">/</span>
              {isHostSubdomain ? (
                <a href={`${MAIN_BETTERMC_URL}/offices`}>
                  City Offices ({governmentOffices.length})
                </a>
              ) : (
                <Link to="/offices">City Offices ({governmentOffices.length})</Link>
              )}
              <span aria-hidden="true">/</span>
              <MicrositeUrlAnchor url={office.subdomainUrl} host={office.subdomainHost} />
            </nav>

            <p className="office-hero-classification">{office.classification}</p>
            <h1>{office.name}</h1>
            {office.parentOffice ? (
              <p className="office-hero-parent">Under {office.parentOffice}</p>
            ) : null}
            <p className="office-hero-lead">{office.overview}</p>

            <div className="office-hero-actions">
              {office.slug === "peso" ? (
                <a className="button hero-contrast-primary" href="#job-opportunities">
                  <Briefcase aria-hidden="true" /> Browse Job Opportunities
                </a>
              ) : null}
              {fbSafe ? (
                <a
                  className={office.slug === "peso" ? "button secondary" : "button hero-contrast-primary"}
                  href={fbSafe}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FbGlyph size={16} /> Official Facebook Page
                </a>
              ) : null}
              {office.phoneNumbers[0] ? (
                <a className="button secondary" href={telHref(office.phoneNumbers[0])}>
                  <Phone aria-hidden="true" /> Call {office.phoneNumbers[0]}
                </a>
              ) : null}
              <a className="button secondary" href={mapUrl} target="_blank" rel="noopener noreferrer">
                <MapPin aria-hidden="true" /> Directions / Map
              </a>
            </div>
          </div>

          <dl className="office-hero-facts" aria-label="Verified office snapshot">
            <div>
              <dt>Location</dt>
              <dd>{office.address}</dd>
            </div>
            <div>
              <dt>Operating Hours</dt>
              <dd>{office.operatingHours}</dd>
            </div>
            <div>
              <dt>{office.headOfOffice ? "Head of Office" : "Supervision"}</dt>
              <dd>{office.headOfOffice || office.headNote || office.classification}</dd>
            </div>
            <div>
              <dt>Direct Contact</dt>
              <dd>
                {office.phoneNumbers[0] ? (
                  <a href={telHref(office.phoneNumbers[0])}>{office.phoneNumbers[0]}</a>
                ) : (
                  "See directory"
                )}
                {office.emails[0] ? <small>{office.emails[0]}</small> : null}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <nav className="office-local-nav" aria-label={`${office.shortName} page sections`}>
        <div className="container">
          <a href="#about">About</a>
          <a href="#personnel">Officials &amp; Personnel</a>
          <a href="#mandate">Mandate &amp; Divisions</a>
          <a href="#services">Public Services ({office.services.length})</a>
          {office.slug === "peso" ? <a href="#job-opportunities">Job Opportunities</a> : null}
          <a href="#programs">Programs &amp; Bodies</a>
          <a href="#sources">Contacts &amp; Sources</a>
        </div>
      </nav>

      <section className="section container office-content-sections">
        <section id="about" className="office-about-section" aria-labelledby="office-about-heading">
          {(() => {
            const personnelTotal =
              personnelEntry?.groups.reduce((sum, group) => sum + group.members.length, 0) ?? 0;
            const keyDivisionNames = (office.divisions ?? []).slice(0, 3);
            const primaryDesk = keyDivisionNames.length
              ? `Ask for: ${keyDivisionNames.join(" · ")}`
              : `Ask for the ${office.shortName} Frontline Assistance Desk`;
            return (
              <div className="office-about-copy bettermc-surface-card">
                <div className="office-about-main">
                  <h2 id="office-about-heading">About This Office</h2>
                  <p>{office.aboutDetails ?? office.overview}</p>
                  {office.whoServes ? (
                    <p className="office-about-serves">
                      <strong>Who this office serves:</strong> {office.whoServes}
                    </p>
                  ) : null}
                  <div className="office-contact-guide" role="region" aria-label="Who to reach out to">
                    <span className="office-contact-guide-eyebrow">Who to reach out to</span>
                    <p>
                      <strong>Office Lead:</strong>{" "}
                      {office.headOfOffice || office.headNote || office.classification}
                    </p>
                    <p>
                      <strong>Where to inquire:</strong> {primaryDesk}.{" "}
                      {personnelTotal > 0
                        ? `${personnelTotal} documented personnel are listed below.`
                        : "Visit the frontline counter during office hours or call the contact numbers above."}
                    </p>
                    <p>
                      <strong>Walk-in location &amp; hours:</strong> {office.address} ·{" "}
                      {office.operatingHours}
                    </p>
                  </div>
                </div>
                <div className="office-about-metrics" aria-label="Verified office summary">
                  <div>
                    <span>Documented Services</span>
                    <strong>
                      {office.services.length} public {office.services.length === 1 ? "service" : "services"}
                    </strong>
                  </div>
                  <div>
                    <span>Assigned Team</span>
                    <strong>
                      {personnelTotal > 0
                        ? `${personnelTotal} documented personnel`
                        : `${office.divisions?.length ?? 1} functional ${(office.divisions?.length ?? 1) === 1 ? "unit" : "units"}`}
                    </strong>
                  </div>
                  <div>
                    <span>Charter Reference</span>
                    <strong>{office.charterChapterRef || "City Directory 2026"}</strong>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>

        <section
          id="personnel"
          className="office-personnel-section bettermc-surface-card"
          aria-labelledby="office-personnel-heading"
        >
          <div className="office-section-head">
            <div>
              <h2 id="office-personnel-heading">Officials &amp; Assigned Personnel</h2>
              <p className="office-section-subtitle">
                Officials and staff assigned to {office.shortName} so you know who to find and where
                to direct your inquiry.{" "}
                {office.classification.includes("National") ||
                office.classification.includes("Judiciary")
                  ? ""
                  : "Across all City Hall offices, the Q1 2026 FDP manpower report records 3,593 total personnel (630 permanent, 279 casual, 96 contractual, and 2,588 job-order staff)."}
              </p>
            </div>
          </div>

          {personnelEntry ? (
            <>
              <div className="office-personnel-groups">
                {personnelEntry.groups.map((group) => {
                  const compactThreshold = 8;
                  const primaryMembers = group.members.slice(0, compactThreshold);
                  const remainingMembers = group.members.slice(compactThreshold);
                  return (
                    <div key={group.unitName} className="office-personnel-unit">
                      <h3>
                        <Users aria-hidden="true" />
                        <span>{group.unitName}</span>
                        <span className="office-unit-count">({group.members.length})</span>
                      </h3>
                      <div className="office-personnel-list">
                        {primaryMembers.map((member) => (
                          <div key={`${group.unitName}-${member.name}`} className="office-personnel-row">
                            <span className="office-person-role">{member.position}</span>
                            <span className="office-person-name">{member.name}</span>
                          </div>
                        ))}
                      </div>
                      {remainingMembers.length > 0 ? (
                        <details className="office-personnel-more">
                          <summary>
                            Show {remainingMembers.length} more assigned personnel in {group.unitName}
                          </summary>
                          <div className="office-personnel-list">
                            {remainingMembers.map((member) => (
                              <div key={`${group.unitName}-${member.name}`} className="office-personnel-row">
                                <span className="office-person-role">{member.position}</span>
                                <span className="office-person-name">{member.name}</span>
                              </div>
                            ))}
                          </div>
                        </details>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              {personnelEntry.unitNotes ? (
                <p className="office-personnel-unit-notes">{personnelEntry.unitNotes}</p>
              ) : null}
              <p className="office-personnel-source">
                <span>Source:</span>{" "}
                <a href={personnelEntry.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {personnelEntry.sourceLabel} <ExternalLink aria-hidden="true" />
                </a>
                {personnelEntry.additionalSources?.map((extra) => (
                  <span key={extra.url}>
                    •{" "}
                    <a href={extra.url} target="_blank" rel="noopener noreferrer">
                      {extra.label} <ExternalLink aria-hidden="true" />
                    </a>
                  </span>
                ))}
              </p>
            </>
          ) : (
            <div className="office-personnel-fallback">
              {office.headOfOffice ? (
                <div className="office-personnel-row is-single">
                  <span className="office-person-role">{office.headNote ?? office.classification}</span>
                  <span className="office-person-name">{office.headOfOffice}</span>
                </div>
              ) : (
                <p className="office-personnel-note">
                  {office.headNote || office.classification}. An individual staff directory has not
                  yet been published by this office on sakata.malaybalaycity.gov.ph; functional units
                  and frontline transactions below are documented in the 2026 Citizen&apos;s Charter.
                </p>
              )}
            </div>
          )}
        </section>

        <div id="mandate" className="office-mandate-grid">
          <article className="bettermc-surface-card office-mandate-card">
            <h2>Official Mandate &amp; Responsibility</h2>
            <p>{office.mandate}</p>
            {office.charterChapterRef ? (
              <p className="office-charter-ref">
                <FileCheck aria-hidden="true" /> Reference: {office.charterChapterRef}
              </p>
            ) : null}
          </article>

          <article className="bettermc-surface-card office-divisions-card">
            <h2>Divisions &amp; Functional Desks</h2>
            <ul className="office-bullet-list">
              {(office.divisions && office.divisions.length > 0
                ? office.divisions
                : [`${office.shortName} Frontline Assistance & Records Desk`]
              ).map((division) => (
                <li key={division}>{division}</li>
              ))}
            </ul>
          </article>
        </div>

        <section id="services" className="office-services-section" aria-labelledby="office-services-heading">
          <div className="office-section-head">
            <div>
              <h2 id="office-services-heading">
                Public Services Offered ({office.services.length})
              </h2>
              <p className="office-section-subtitle">
                Documented transactions, fees, processing times, and documentary checklists.
              </p>
            </div>
            {office.services.length > 4 ? (
              <label className="offices-search-field is-compact">
                <Search aria-hidden="true" />
                <input
                  type="search"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Filter services..."
                />
              </label>
            ) : null}
          </div>

          <div className="office-services-accordion">
            {filteredServices.map((service, idx) => {
              const isOpen = openServiceIndex === idx || (service.requirements?.length ?? 0) === 0;
              return (
                <article key={service.title} className="office-service-card bettermc-surface-card">
                  <div className="office-service-head">
                    <div>
                      <h3>{service.title}</h3>
                      <p className="office-service-meta-line">
                        <span>Processing time: {service.processingTime}</span>
                        <span aria-hidden="true">·</span>
                        <span>Fee: {service.fee}</span>
                        {service.classification ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{service.classification}</span>
                          </>
                        ) : null}
                      </p>
                    </div>
                    {(service.requirements?.length || service.steps?.length) ? (
                      <button
                        type="button"
                        className="office-expand-btn"
                        aria-expanded={isOpen}
                        onClick={() => setOpenServiceIndex(openServiceIndex === idx ? null : idx)}
                      >
                        {isOpen ? "Hide checklist" : "Requirements & steps"}
                        <ChevronDown aria-hidden="true" />
                      </button>
                    ) : null}
                  </div>

                  {service.whoMayAvail ? (
                    <p className="office-service-elig">Who may avail: {service.whoMayAvail}</p>
                  ) : null}

                  {isOpen && (service.requirements?.length || service.steps?.length) ? (
                    <div className="office-service-details">
                      {service.requirements && service.requirements.length > 0 ? (
                        <div>
                          <h4>Documentary Requirements</h4>
                          <ul>
                            {service.requirements.map((req) => (
                              <li key={req}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {service.steps && service.steps.length > 0 ? (
                        <div>
                          <h4>Step-by-Step Procedure</h4>
                          <ol>
                            {service.steps.map((step) => (
                              <li key={step}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        {office.slug === "peso" ? <PesoEmploymentBoard embeddedInPesoPage /> : null}

        <section id="programs" className="office-programs-section" aria-labelledby="office-programs-heading">
          <h2 id="office-programs-heading">Programs, Initiatives &amp; Special Bodies</h2>
          <div className="office-programs-grid">
            {office.programs.map((program) => (
              <article key={program.title} className="bettermc-surface-card office-program-card">
                <h3>{program.title}</h3>
                <p>{program.summary}</p>
                {program.eligibility ? (
                  <small>Eligibility: {program.eligibility}</small>
                ) : null}
              </article>
            ))}
            {relatedSpecialBodies.map((lsb) => (
              <article key={lsb.id} className="bettermc-surface-card office-program-card is-lsb">
                <p className="special-body-meta">
                  {lsb.executiveOrder} · Local Special Body
                </p>
                <h3>{lsb.name}</h3>
                <p>{lsb.mandateSummary}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="sources" className="office-bottom-grid" aria-labelledby="office-sources-heading">
          <article className="office-sources-card bettermc-surface-card">
            <h2>All Verified Contacts &amp; Platforms</h2>
            <dl className="office-contacts-dl">
              <div>
                <dt>Office Counter</dt>
                <dd>{office.address}</dd>
              </div>
              <div>
                <dt>Operating Hours</dt>
                <dd>{office.operatingHours}</dd>
              </div>
              <div>
                <dt>Phone Numbers</dt>
                <dd>
                  {office.phoneNumbers.map((phone) => (
                    <a key={phone} className="office-fact-link" href={telHref(phone)}>
                      {phone}
                    </a>
                  ))}
                </dd>
              </div>
              {office.emails.length > 0 ? (
                <div>
                  <dt>Email Addresses</dt>
                  <dd>
                    {office.emails.map((email) => (
                      <a key={email} className="office-fact-link" href={`mailto:${email}`}>
                        {email}
                      </a>
                    ))}
                  </dd>
                </div>
              ) : null}
              <div>
                <dt>Microsite URL</dt>
                <dd>
                  <MicrositeUrlAnchor
                    className="office-fact-link"
                    url={office.subdomainUrl}
                    host={office.subdomainHost}
                  />
                </dd>
              </div>
              {webSafe ? (
                <div>
                  <dt>City Government Portal</dt>
                  <dd>
                    <a className="office-fact-link" href={webSafe} target="_blank" rel="noopener noreferrer">
                      Official LGU Malaybalay Page <ExternalLink aria-hidden="true" />
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </article>

          <article className="office-sources-card bettermc-surface-card">
            <h2 id="office-sources-heading">Official Primary Sources · Reviewed {VERIFIED_ON}</h2>
            <ul className="office-source-list">
              {office.sources.map((src) => (
                <li key={`${src.label}-${src.url}`}>
                  <a href={safeHref(src.url) ?? "#"} target="_blank" rel="noopener noreferrer">
                    <span>{src.label}</span>
                    <ExternalLink aria-hidden="true" />
                  </a>
                  <small>Verified {src.verifiedOn}</small>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </section>
    </div>
  );
}

/**
 * Dedicated PESO Malaybalay Hub Page (/peso, /offices/peso, AND peso.bettermalaybalay.cloud)
 * Unified without duplicate program showcases.
 */
export function PesoPortalPage() {
  return <OfficeLandingPage slugOverride="peso" />;
}

/**
 * Standalone Job Opportunities Board Page (/jobs and /peso/jobs)
 */
export function JobsDirectoryPage() {
  return (
    <>
      <section className="page-hero page-hero-compact">
        <div className="container">
          <h1>Job Vacancies, Job Fairs &amp; Livelihood Programs</h1>
          <p>
            Search active PESO Malaybalay programs, DOLE student/emergency employment pathways,
            and Civil Service Commission Form No. 9 government vacancy records.
          </p>
          <div className="hero-actions" style={{ marginTop: 18 }}>
            <Link className="button primary" to="/peso">
              PESO Office Profile &amp; Services
            </Link>
            <a
              className="button secondary"
              href={PESO_FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FbGlyph size={15} /> PESO Official Facebook
            </a>
          </div>
        </div>
      </section>

      <section className="section container">
        <PesoEmploymentBoard />
      </section>
    </>
  );
}

/**
 * Dedicated Opportunity Detail View (/jobs/:slug and /peso/jobs/:slug)
 */
export function JobDetailPage() {
  const { slug } = useParams();
  const opportunities = usePublicPesoOpportunities();

  const item = useMemo(
    () => opportunities.find((candidate) => candidate.slug === slug),
    [opportunities, slug],
  );

  if (!item) {
    return (
      <section className="section container bettermc-surface-card" style={{ marginTop: 32, marginBottom: 48, padding: 28 }}>
        <h1>Opportunity record unavailable</h1>
        <p>This listing may have been removed, archived, or relocated.</p>
        <div className="hero-actions" style={{ marginTop: 16 }}>
          <Link className="button primary" to="/jobs">
            Back to Job Opportunities
          </Link>
          <Link className="button secondary" to="/peso">
            Open PESO Malaybalay Hub
          </Link>
        </div>
      </section>
    );
  }

  const lifecycle = resolveOpportunityLifecycle(item);
  const safeApply = safeHref(item.applicationUrl);
  const safeSrc = safeHref(item.sourceUrl);
  const safePoster = safeHref(item.posterUrl);
  const comp = opportunityCompensationDisplay(item);

  return (
    <>
      <section className="page-hero page-hero-compact">
        <div className="container">
          <Link className="page-hero-backlink" to="/jobs">
            <ArrowLeft aria-hidden="true" /> All PESO &amp; City Opportunities
          </Link>
          <p className="job-detail-kicker">
            <span>{OPPORTUNITY_TYPE_LABELS[item.opportunityType]}</span>
            <span aria-hidden="true">·</span>
            <StatusLabel status={lifecycle.displayStatus} label={lifecycle.label} />
          </p>
          <h1>{item.title}</h1>
          <p>{item.employer}</p>
        </div>
      </section>

      <section className="section container job-detail-section">
        {lifecycle.isExpired ? (
          <div className="job-expired-alert bettermc-surface-card" role="alert">
            <ShieldAlert aria-hidden="true" />
            <div>
              <strong>Notice: This posting is {lifecycle.displayStatus === "archived" ? "archived" : "expired"}</strong>
              <p>
                {item.deadlineDate
                  ? `The application deadline (${item.deadlineDate}) has passed.`
                  : "This posting is no longer accepting active submissions."}{" "}
                Preserved for Civil Service qualification and salary-grade benchmarking.
              </p>
            </div>
          </div>
        ) : null}

        <div className="job-detail-layout">
          <article className="bettermc-surface-card job-detail-main">
            <h2>Overview &amp; Role Description</h2>
            <p>{item.description}</p>

            {safePoster ? (
              <div className="job-poster-wrap">
                <img src={safePoster} alt={`${item.title} official announcement poster`} />
              </div>
            ) : null}

            <h3>Qualifications &amp; Eligibility</h3>
            <ul className="office-bullet-list">
              {item.qualifications.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>

            <h3>Documentary Requirements</h3>
            <ul className="office-bullet-list">
              {item.requirements.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>

            <h3>How to Apply / Procedure</h3>
            <ol className="job-steps-list">
              {item.applicationProcess.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            {item.notes ? (
              <p className="job-detail-note">
                <Info aria-hidden="true" /> {item.notes}
              </p>
            ) : null}

            <div className="job-detail-contacts-block">
              <h3>Official Contact Details</h3>
              <ul className="office-bullet-list">
                {item.contactDetails.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <Link className="office-fact-link" to="/peso">
                <ArrowLeft aria-hidden="true" /> Return to PESO Malaybalay Profile
              </Link>
            </div>
          </article>

          <aside className="job-detail-sidebar">
            <div className="bettermc-surface-card office-quick-facts">
              <h2>Opportunity Facts</h2>
              <dl>
                <div>
                  <dt><Building2 aria-hidden="true" /> Employer / Agency</dt>
                  <dd>{item.employer}</dd>
                </div>
                <div>
                  <dt><MapPin aria-hidden="true" /> Location / Venue</dt>
                  <dd>{item.location}</dd>
                </div>
                <div>
                  <dt><Briefcase aria-hidden="true" /> Employment Type</dt>
                  <dd>{item.employmentType}</dd>
                </div>
                {typeof item.vacanciesCount === "number" ? (
                  <div>
                    <dt><Users aria-hidden="true" /> Vacancies</dt>
                    <dd>{item.vacanciesCount}</dd>
                  </div>
                ) : null}
                <div>
                  <dt><Award aria-hidden="true" /> {comp.label}</dt>
                  <dd>{comp.value}</dd>
                </div>
                <div>
                  <dt><Calendar aria-hidden="true" /> Published Date</dt>
                  <dd>{item.publishedDate}</dd>
                </div>
                <div>
                  <dt><Clock aria-hidden="true" /> Deadline / Status</dt>
                  <dd>
                    {item.deadlineDate ||
                      (item.isRecurringProgram ? "Ongoing recurring program" : "Until filled / per PESO notice")}
                  </dd>
                </div>
              </dl>

              {safeApply && !lifecycle.isExpired ? (
                <div className="job-detail-cta-stack">
                  <a
                    className="button primary"
                    href={safeApply}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Official Post / Apply <ExternalLink aria-hidden="true" />
                  </a>
                </div>
              ) : null}

              {safeSrc ? (
                <div className="detail-source-row">
                  <span className="detail-source-kicker">Source</span>
                  <a
                    className="detail-source-link"
                    href={safeSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{item.sourceLabel}</span>
                    <ExternalLink aria-hidden="true" />
                  </a>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
