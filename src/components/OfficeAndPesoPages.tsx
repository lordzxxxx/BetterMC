import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle,
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
  OFFICE_CATEGORIES,
  resolveOfficeSlug,
  type GovernmentOffice,
  type OfficeCategory,
} from "../governmentOffices";
import {
  CSC_FORM_9_2024_URL,
  INITIAL_PESO_OPPORTUNITIES,
  PESO_FACEBOOK_PAGE_URL,
  PESO_PROGRAMS_HIGHLIGHTS,
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

function FbGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
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

function LifecycleBadge({ status, label }: { status: OpportunityDisplayStatus; label: string }) {
  return <span className={`peso-status-badge is-${status}`}>{label}</span>;
}

/**
 * Shared filterable & searchable grid of all Malaybalay City offices, CMO divisions,
 * legislative units, and partner institutions.
 */
export function OfficeDirectoryBrowser({ compactHeader = false }: { compactHeader?: boolean }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | OfficeCategory>("All");

  const filteredOffices = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return governmentOffices.filter((office) => {
      if (selectedCategory !== "All" && office.category !== selectedCategory) return false;
      if (!needle) return true;
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
        <div className="offices-peso-spotlight card">
          <div className="offices-peso-spotlight-main">
            <img src="/images/offices/peso.png" alt="PESO Malaybalay official emblem" />
            <div>
              <span className="eyebrow">Featured Employment & Livelihood Subdomain</span>
              <h2>Public Employment Service Office (PESO Malaybalay)</h2>
              <p>
                Access NSRP job matching, DOLE–LGU SPES &amp; TUPAD programs, OFW referral desks,
                and verified Malaybalay employment opportunities at{" "}
                <code>peso.bettermalaybalay.cloud</code>.
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

      <div className="offices-toolbar">
        <label className="offices-search-field">
          <span className="sr-only">Search Malaybalay City offices and services</span>
          <Search aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search office, acronym, service, division, email, or phone..."
          />
        </label>
        <div className="offices-filter-meta">
          <span>
            Showing <strong>{filteredOffices.length}</strong> of {governmentOffices.length} verified offices &amp; sectors
          </span>
          {(query || selectedCategory !== "All") && (
            <button
              type="button"
              className="link-reset-btn"
              onClick={() => {
                setQuery("");
                setSelectedCategory("All");
              }}
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      <div className="offices-category-pills" role="tablist" aria-label="Filter offices by sector">
        <button
          type="button"
          className={selectedCategory === "All" ? "is-active" : ""}
          onClick={() => setSelectedCategory("All")}
        >
          All Sectors ({governmentOffices.length})
        </button>
        {OFFICE_CATEGORIES.map((category) => {
          const count = governmentOffices.filter((o) => o.category === category).length;
          if (!count) return null;
          return (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? "is-active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>

      {filteredOffices.length === 0 ? (
        <div className="card offices-empty-state">
          <Info aria-hidden="true" />
          <p>No Malaybalay offices matched "{query}".</p>
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              setQuery("");
              setSelectedCategory("All");
            }}
          >
            Show all {governmentOffices.length} offices
          </button>
        </div>
      ) : (
        <div className="offices-grid">
          {filteredOffices.map((office) => (
            <article key={office.slug} className="office-dir-card card">
              <header className="office-dir-card-head">
                <OfficeLogoBadge office={office} size="sm" />
                <div className="office-dir-card-title-group">
                  <div className="office-dir-badges">
                    <span className="office-acronym-pill">{office.acronym}</span>
                    <span className="office-category-pill">{office.category}</span>
                  </div>
                  <h3>
                    <Link to={office.slug === "peso" ? "/peso" : `/offices/${office.slug}`}>
                      {office.name}
                    </Link>
                  </h3>
                  {office.parentOffice ? (
                    <p className="office-parent-note">Under: {office.parentOffice}</p>
                  ) : null}
                </div>
              </header>

              <p className="office-dir-summary">{office.overview}</p>

              <dl className="office-dir-facts">
                <div>
                  <dt>Location</dt>
                  <dd>{office.address}</dd>
                </div>
                {office.phoneNumbers[0] ? (
                  <div>
                    <dt>Contact</dt>
                    <dd>{office.phoneNumbers[0]}</dd>
                  </div>
                ) : null}
                {office.emails[0] ? (
                  <div>
                    <dt>Email</dt>
                    <dd>{office.emails[0]}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="office-dir-actions">
                <Link
                  className="button primary small"
                  to={office.slug === "peso" ? "/peso" : `/offices/${office.slug}`}
                >
                  Open Profile <ArrowRight aria-hidden="true" />
                </Link>
                <Link className="office-subdomain-preview-link" to={`/?office=${office.slug}`}>
                  <Globe aria-hidden="true" />
                  <span>{office.subdomainHost}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <section className="special-bodies-section" aria-labelledby="local-special-bodies-heading">
        <div className="special-bodies-header">
          <div>
            <span className="eyebrow">Inter-Agency &amp; Multisectoral Governance</span>
            <h2 id="local-special-bodies-heading">
              Local Special Bodies &amp; Special Committees ({localSpecialBodies.length} Verified EOs)
            </h2>
            <p>
              Reconstituted via City Executive Orders uniting City Hall offices, national agencies,
              barangays, and accredited CSOs across key public mandates.
            </p>
          </div>
          <a
            className="button secondary small"
            href="https://sakata.malaybalaycity.gov.ph/local-special-bodies-and-special-committees/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Official EO Archive <ExternalLink aria-hidden="true" />
          </a>
        </div>

        <div className="special-bodies-grid">
          {localSpecialBodies.map((body) => (
            <article key={body.id} className="special-body-card card">
              <div className="special-body-top">
                <span className="office-acronym-pill">{body.executiveOrder}</span>
                <span className="special-body-year">{body.year}</span>
              </div>
              <h3>{body.name}</h3>
              <p>{body.mandateSummary}</p>
              <div className="special-body-footer">
                <Link to={`/offices/${body.leadOfficeSlug}`}>
                  Lead office: {body.leadOfficeName} <ArrowRight aria-hidden="true" />
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
          <span className="eyebrow">Malaybalay City Government &amp; Sector Directory</span>
          <h1>City Offices, Divisions &amp; Partner Institutions</h1>
          <p>
            Verified directory of executive departments, City Mayor&apos;s Office service divisions
            (including PESO, Community Affairs Scholarships, OSCA, BPLD, Tourism, and TMC),
            legislative offices, local special bodies, and national partner desks — backed by the
            2026 Citizen&apos;s Charter and official City Government portals.
          </p>
          <div className="hero-actions" style={{ marginTop: 18 }}>
            <Link className="button primary" to="/peso">
              Explore PESO &amp; Job Opportunities <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="button secondary" to="/government">
              City Officials &amp; Hotlines
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
  const [statusFilter, setStatusFilter] = useState<"active-open" | "all" | "expired" | "recurring-program">("active-open");

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
          <span className="eyebrow">PESO Employment &amp; Recruitment Board</span>
          <h2>{embeddedInPesoPage ? "Employment Opportunities, Programs & Hiring Records" : "Malaybalay City Job & Livelihood Opportunities"}</h2>
          <p>
            Active PESO–DOLE employment facilitation, job fair programs, and archived Civil Service
            plantilla records. Deadlines automatically transition postings to <strong>Expired</strong>{" "}
            after their closing date.
          </p>
        </div>
        <div className="peso-board-cta-group">
          <Link className="button secondary small" to="/participate">
            Submit Vacancy Update
          </Link>
        </div>
      </div>

      <div className="peso-fb-source-notice card">
        <FbGlyph size={20} />
        <div>
          <strong>Same-Day Employer Hiring Posters:</strong> Daily private-company job posters
          screened by PESO Malaybalay are posted directly on the{" "}
          <a href={PESO_FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer">
            Official PESO Malaybalay Facebook Page
          </a>
          . Verified public notices and batch publications are added directly to BetterMC&apos;s
          curated registry in code.
        </div>
      </div>

      <div className="peso-filters-panel card">
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
            <span><Filter aria-hidden="true" /> Category</span>
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
        <div className="card offices-empty-state">
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
          {visibleItems.map(({ item, lifecycle }) => (
            <article
              key={item.slug}
              className={`peso-job-card card${lifecycle.isExpired ? " is-expired" : ""}`}
            >
              <div className="peso-job-card-top">
                <span className="office-category-pill">
                  {OPPORTUNITY_TYPE_LABELS[item.opportunityType]}
                </span>
                <LifecycleBadge status={lifecycle.displayStatus} label={lifecycle.label} />
              </div>

              <h3>
                <Link to={`/jobs/${item.slug}`}>{item.title}</Link>
              </h3>
              <p className="peso-job-employer">
                <Building2 aria-hidden="true" /> {item.employer}
              </p>
              <p className="peso-job-summary">{item.description}</p>

              <dl className="peso-job-meta">
                <div>
                  <dt>Location / Venue</dt>
                  <dd>{item.location}</dd>
                </div>
                <div>
                  <dt>Compensation</dt>
                  <dd>{item.salaryGradeOrCompensation || "Not disclosed in official notice"}</dd>
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
                  View Details &amp; Requirements <ArrowRight aria-hidden="true" />
                </Link>
                {safeHref(item.sourceUrl) ? (
                  <a
                    className="peso-source-inline-link"
                    href={safeHref(item.sourceUrl) ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source <ExternalLink aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="peso-csc-summary-card card">
        <div>
          <span className="eyebrow">Civil Service Commission Verification Note</span>
          <h3>{PESO_VACANCIES_SUMMARY.publicationTitle}</h3>
          <p>
            Official City Hall publication dated {PESO_VACANCIES_SUMMARY.publishedDate} (closed{" "}
            {PESO_VACANCIES_SUMMARY.closingDate}) covered{" "}
            <strong>{PESO_VACANCIES_SUMMARY.totalPublishedItems} plantilla items</strong> across City
            Engineering (19), Agriculture (11), Mayor&apos;s Office (9), Accounting (9), Health (8),
            Assessor (5), Veterinary (5), CEEDMO (5), CSWDO (4), and 17 items across other offices.
          </p>
        </div>
        <a
          className="button secondary small"
          href={CSC_FORM_9_2024_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download aria-hidden="true" /> Download Official CS Form No. 9 PDF
        </a>
      </div>
    </div>
  );
}

/**
 * Standardized Office Landing Page used by ALL /offices/:slug routes AND dedicated
 * *.bettermalaybalay.cloud office subdomains.
 */
export function OfficeLandingPage({ slugOverride }: { slugOverride?: string } = {}) {
  const { slug: routeSlug } = useParams();
  const canonicalSlug = resolveOfficeSlug(slugOverride ?? routeSlug ?? "");
  const office = canonicalSlug ? governmentOfficeBySlug.get(canonicalSlug) : undefined;
  const [serviceSearch, setServiceSearch] = useState("");
  const [openServiceIndex, setOpenServiceIndex] = useState<number | null>(0);

  if (!office) {
    return (
      <section className="section container card" style={{ marginTop: 32, marginBottom: 48 }}>
        <span className="eyebrow">Government Office Not Found</span>
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

  return (
    <div className="office-landing-page">
      <div className="subdomain-context-bar">
        <div className="container subdomain-context-inner">
          <span className="subdomain-pill">
            <Globe aria-hidden="true" />
            <strong>{office.subdomainHost}</strong>
            <span>Dedicated Office Microsite</span>
          </span>
          <div className="subdomain-context-links">
            <Link to="/offices">
              <ArrowLeft aria-hidden="true" /> All City Offices ({governmentOffices.length})
            </Link>
            <a href="https://www.bettermalaybalay.cloud">Main BetterMC Portal</a>
          </div>
        </div>
      </div>

      <section className="office-hero">
        <div className="container office-hero-grid">
          <div className="office-hero-main">
            <div className="office-hero-identity">
              <OfficeLogoBadge office={office} size="lg" />
              <div>
                <div className="office-dir-badges">
                  <span className="office-acronym-pill">{office.acronym}</span>
                  <span className="office-category-pill">{office.category}</span>
                </div>
                <span className="office-classification-line">{office.classification}</span>
                <h1>{office.name}</h1>
                {office.parentOffice ? (
                  <p className="office-parent-line">Parent Office: {office.parentOffice}</p>
                ) : null}
              </div>
            </div>

            <p className="office-hero-overview">{office.overview}</p>

            <div className="office-hero-cta-row">
              {office.slug === "peso" ? (
                <a className="button primary" href="#job-opportunities">
                  <Briefcase aria-hidden="true" /> Browse Job Opportunities
                </a>
              ) : null}
              {fbSafe ? (
                <a
                  className={office.slug === "peso" ? "button secondary" : "button primary"}
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

          <aside className="office-quick-facts card" aria-label="Verified office snapshot">
            <h2>Verified Quick Facts</h2>
            <dl>
              <div>
                <dt><MapPin aria-hidden="true" /> Location</dt>
                <dd>{office.address}</dd>
              </div>
              <div>
                <dt><Clock aria-hidden="true" /> Operating Hours</dt>
                <dd>{office.operatingHours}</dd>
              </div>
              <div>
                <dt><Users aria-hidden="true" /> Head of Office / Lead</dt>
                <dd>
                  {office.headOfOffice || "Not specifically named in reviewed official pages"}
                  {office.headNote ? <small className="office-fact-note">{office.headNote}</small> : null}
                </dd>
              </div>
              <div>
                <dt><Phone aria-hidden="true" /> Official Numbers</dt>
                <dd>
                  {office.phoneNumbers.map((phone) => (
                    <a key={phone} className="office-fact-link" href={telHref(phone)}>
                      {phone}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt><Mail aria-hidden="true" /> Email</dt>
                <dd>
                  {office.emails.length > 0 ? (
                    office.emails.map((email) => (
                      <a key={email} className="office-fact-link" href={`mailto:${email}`}>
                        {email}
                      </a>
                    ))
                  ) : (
                    <span>Not published in reviewed records</span>
                  )}
                </dd>
              </div>
              {webSafe ? (
                <div>
                  <dt><ExternalLink aria-hidden="true" /> City Website</dt>
                  <dd>
                    <a href={webSafe} target="_blank" rel="noopener noreferrer">
                      Official LGU Malaybalay Page
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </aside>
        </div>
      </section>

      <section className="section container office-content-sections">
        {office.discrepancies && office.discrepancies.length > 0 ? (
          <div className="office-discrepancy-banner card" role="note">
            <AlertTriangle aria-hidden="true" />
            <div>
              <strong>Source Cross-Reference Note:</strong>
              {office.discrepancies.map((item) => (
                <p key={item.field}>
                  <strong>{item.field}:</strong> {item.detail}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        <div className="office-mandate-grid">
          <article className="card office-mandate-card">
            <span className="eyebrow">Mandate &amp; Role</span>
            <h2>Official Responsibility in Malaybalay City</h2>
            <p>{office.mandate}</p>
            {office.charterChapterRef ? (
              <p className="office-charter-ref">
                <FileCheck aria-hidden="true" /> Reference: {office.charterChapterRef}
              </p>
            ) : null}
          </article>

          <article className="card office-divisions-card">
            <span className="eyebrow">Structure &amp; Units</span>
            <h2>Divisions &amp; Functional Desks</h2>
            {office.divisions && office.divisions.length > 0 ? (
              <ul className="office-bullet-list">
                {office.divisions.map((division) => (
                  <li key={division}>{division}</li>
                ))}
              </ul>
            ) : (
              <p>
                Core office transactions operate under the supervision of the {office.shortName}{" "}
                department desk at {office.address}.
              </p>
            )}
          </article>
        </div>

        <section className="office-services-section" aria-labelledby="office-services-heading">
          <div className="office-section-head">
            <div>
              <span className="eyebrow">Citizen&apos;s Charter &amp; Public Transactions</span>
              <h2 id="office-services-heading">
                Public Services Offered ({office.services.length})
              </h2>
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
                <article key={service.title} className="office-service-card card">
                  <div className="office-service-head">
                    <div>
                      <h3>{service.title}</h3>
                      <div className="office-service-pills">
                        <span className="office-meta-chip">
                          <Clock aria-hidden="true" /> {service.processingTime}
                        </span>
                        <span className="office-meta-chip">
                          Fee: {service.fee}
                        </span>
                        {service.classification ? (
                          <span className="office-meta-chip">{service.classification}</span>
                        ) : null}
                      </div>
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
                    <p className="office-service-elig">
                      <strong>Who may avail:</strong> {service.whoMayAvail}
                    </p>
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

        <section className="office-programs-section" aria-labelledby="office-programs-heading">
          <span className="eyebrow">Initiatives &amp; Sector Coordination</span>
          <h2 id="office-programs-heading">Programs, Initiatives &amp; Special Bodies</h2>
          <div className="office-programs-grid">
            {office.programs.map((program) => (
              <article key={program.title} className="card office-program-card">
                <h3>{program.title}</h3>
                <p>{program.summary}</p>
                {program.eligibility ? (
                  <small>
                    <strong>Eligibility:</strong> {program.eligibility}
                  </small>
                ) : null}
              </article>
            ))}
            {relatedSpecialBodies.map((lsb) => (
              <article key={lsb.id} className="card office-program-card is-lsb">
                <div className="special-body-top">
                  <span className="office-acronym-pill">{lsb.executiveOrder}</span>
                  <span>Local Special Body</span>
                </div>
                <h3>{lsb.name}</h3>
                <p>{lsb.mandateSummary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="office-sources-card card" aria-labelledby="office-sources-heading">
          <span className="eyebrow">Verification &amp; Source Ledger · Reviewed {VERIFIED_ON}</span>
          <h2 id="office-sources-heading">Official Primary Sources</h2>
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
        </section>
      </section>
    </div>
  );
}

/**
 * Dedicated PESO Malaybalay Hub Page (/peso AND peso.bettermalaybalay.cloud)
 * Combines full standardized PESO Office Profile + prominent Job Opportunities Board
 * + Flagship DOLE/City Programs.
 */
export function PesoPortalPage() {
  return (
    <div className="peso-hub-wrapper">
      <OfficeLandingPage slugOverride="peso" />
      <section className="section container peso-dole-programs-section" aria-labelledby="peso-programs-showcase">
        <span className="eyebrow">DOLE Region 10 &amp; LGU Malaybalay Collaboration</span>
        <h2 id="peso-programs-showcase">Key Employment, Livelihood &amp; Youth Programs</h2>
        <div className="peso-programs-showcase-grid">
          {PESO_PROGRAMS_HIGHLIGHTS.map((prog) => (
            <article key={prog.id} className="card peso-program-showcase-card">
              <div className="special-body-top">
                <span className="office-acronym-pill">{prog.shortTag}</span>
                <span>{prog.partnerAgency}</span>
              </div>
              <h3>{prog.title}</h3>
              <p>{prog.summary}</p>
              <dl>
                <div>
                  <dt>Eligibility</dt>
                  <dd>{prog.eligibility}</dd>
                </div>
                <div>
                  <dt>How to Avail</dt>
                  <dd>{prog.howToAvail}</dd>
                </div>
              </dl>
              <a href={safeHref(prog.sourceUrl) ?? "#"} target="_blank" rel="noopener noreferrer">
                {prog.sourceLabel} <ExternalLink aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Standalone Job Opportunities Board Page (/jobs and /peso/jobs)
 */
export function JobsDirectoryPage() {
  return (
    <>
      <section className="page-hero page-hero-compact">
        <div className="container">
          <span className="eyebrow">PESO Malaybalay City — Employment Facilitation</span>
          <h1>Job Vacancies, Job Fairs &amp; Livelihood Programs</h1>
          <p>
            Search verified PESO Malaybalay programs, DOLE student/emergency employment pathways,
            and Civil Service Commission Form No. 9 government vacancy records without sifting
            through scattered social feeds.
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
      <section className="section container card" style={{ marginTop: 32, marginBottom: 48 }}>
        <span className="eyebrow">Job Opportunity Not Found</span>
        <h1>Opportunity record unavailable</h1>
        <p>
          This listing may have been removed, archived, or relocated.
        </p>
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

  return (
    <>
      <section className="page-hero page-hero-compact">
        <div className="container">
          <Link className="page-hero-backlink" to="/jobs">
            <ArrowLeft aria-hidden="true" /> All PESO &amp; City Opportunities
          </Link>
          <div className="office-dir-badges" style={{ marginTop: 12 }}>
            <span className="office-category-pill">
              {OPPORTUNITY_TYPE_LABELS[item.opportunityType]}
            </span>
            <LifecycleBadge status={lifecycle.displayStatus} label={lifecycle.label} />
          </div>
          <h1>{item.title}</h1>
          <p>{item.employer}</p>
        </div>
      </section>

      <section className="section container job-detail-section">
        {lifecycle.isExpired ? (
          <div className="job-expired-alert card" role="alert">
            <ShieldAlert aria-hidden="true" />
            <div>
              <strong>Notice: This posting is {lifecycle.displayStatus === "archived" ? "archived" : "expired"}</strong>
              <p>
                {item.deadlineDate
                  ? `The application deadline (${item.deadlineDate}) has passed.`
                  : "This posting is no longer accepting active submissions."}{" "}
                Retained in BetterMC for historical salary-grade reference and transparency.
              </p>
            </div>
          </div>
        ) : null}

        <div className="job-detail-layout">
          <article className="card job-detail-main">
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
          </article>

          <aside className="job-detail-sidebar">
            <div className="card office-quick-facts">
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
                  <dt><Award aria-hidden="true" /> Compensation / Salary</dt>
                  <dd>{item.salaryGradeOrCompensation || "Not disclosed in official notice"}</dd>
                </div>
                <div>
                  <dt><Calendar aria-hidden="true" /> Published Date</dt>
                  <dd>{item.publishedDate}</dd>
                </div>
                <div>
                  <dt><Clock aria-hidden="true" /> Deadline / Status</dt>
                  <dd>{item.deadlineDate || (item.isRecurringProgram ? "Ongoing recurring program" : "Until filled / per PESO notice")}</dd>
                </div>
              </dl>

              <div className="job-detail-cta-stack">
                {safeApply && !lifecycle.isExpired ? (
                  <a
                    className="button primary"
                    href={safeApply}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Official Post / Apply <ExternalLink aria-hidden="true" />
                  </a>
                ) : null}
                {safeSrc ? (
                  <a
                    className="button secondary"
                    href={safeSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Original Source ({item.sourceLabel}) <ExternalLink aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>

            <div className="card office-quick-facts">
              <h2>Official Contact Details</h2>
              <ul className="office-bullet-list">
                {item.contactDetails.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <Link className="office-fact-link" to="/peso">
                <ArrowLeft aria-hidden="true" /> Return to PESO Malaybalay Profile
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
