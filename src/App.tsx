import {
  type CSSProperties,
  Fragment,
  FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  ArrowRight,
  Award,
  BadgeDollarSign,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Car,
  Check,
  ChevronDown,
  CircleAlert,
  CloudSun,
  Clock3,
  Compass,
  Copy,
  Database,
  ExternalLink,
  FileCheck2,
  FileText,
  Globe,
  GraduationCap,
  Github,
  HandHeart,
  HeartPulse,
  House,
  IdCard,
  Landmark,
  LayoutGrid,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Navigation,
  Phone,
  Plane,
  Printer,
  ReceiptText,
  Search,
  Scale,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  civicRecords,
  departments,
  disclosures,
  financialSnapshot,
  gadResources,
  governanceHighlights,
  officials,
  officialPortraits,
  officialRecords,
  procurementSources,
  reportedProcurementSavings,
  publicProjects,
  services,
  specialBodyOrders,
  type CivicRecord,
  type Disclosure,
  VERIFIED_ON,
} from "./data";
import {
  barangayMicrositeBySlug,
  barangayMicrosites,
  barangaySlugFromHostname,
  BARANGAY_PROFILE_REVIEWED_ON,
  MAIN_BETTERMC_PORTAL,
  MALAYBALAY_2024_POPULATION,
  POPULATION_REFERENCE_DATE,
  POPULATION_RELEASE_DATE,
  type BarangayMicrositeProfile,
} from "./barangayProfiles";
import {
  BAC_2026_SOURCE,
  BAC_2026_VERIFIED_ON,
  bidRecords2026,
  type BidRecord,
} from "./bidRecords";
import {
  DILG_DIRECTORY_INDEX_SOURCE,
  CITY_BARANGAY_DIRECTORY_SOURCE,
  SK_FUNCTIONALITY_ORDINANCE_SOURCE,
  getOfficialRoleScope,
  type BarangayOfficialRecord,
} from "./barangayOfficials";
import {
  type BarangayDisclosureCategory,
  type BarangayDisclosureItem,
} from "./barangayDisclosures";
import {
  goodsServicesAwardRecords,
  GOODS_SERVICES_AWARDS_SOURCE,
  infrastructureAwardRecords,
  INFRASTRUCTURE_AWARDS_SOURCE,
  SMALL_VALUE_PROCUREMENT_SOURCE,
  type ProcurementAwardRecord,
} from "./procurementRecords";
import {
  betterGovServiceUrl,
  localServicePathways,
  serviceCategories,
  getProvidersForCategory,
  getBarangayOriginCoordinates,
  sanitizeExternalServiceUrl,
  generateTransactionReference,
  type RankedServiceProvider,
  type ServiceTransactionOption,
  type ServiceProvider,
} from "./serviceCatalog";
import { MALAYBALAY_CENTROIDS } from "./malaybalayGisData";
import { civicRecordContext } from "./civicRecordContext";
import { searchPortal } from "./searchIndex";
import { sitePages } from "./sitePages";
import WeatherPanel from "./WeatherPanel";
import MalaybalayGisMap from "./MalaybalayGisMap";
import TurnstileWidget from "./TurnstileWidget";
import {
  feedbackSchema,
  requestTypeOptions,
  type RequestType,
} from "./feedback";

const navItems = [
  { label: "Transparency", to: "/transparency" },
  { label: "Government", to: "/government" },
  { label: "Barangays", to: "/barangays" },
  { label: "Public services", to: "/services" },
  { label: "Participate", to: "/participate" },
];

const telephoneHref = (value?: string) =>
  value?.split(/\s*(?:\/|\|)\s*/)[0].replace(/[^+\d]/g, "") ?? "";

function FacebookIcon({
  size = 16,
  className,
}: {
  size?: number | string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ flexShrink: 0, display: "inline-block", verticalAlign: "middle" }}
    >
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M13.861 23.854v-8.385h2.796l.532-3.47h-3.328V9.749c0-.949.465-1.874 1.956-1.874h1.724V4.922s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.569H7.078v3.47h3.047v8.385a12.09 12.09 0 0 0 3.736.074z"
        fill="#ffffff"
      />
    </svg>
  );
}

function Brand() {
  return (
    <Link className="brand" to="/" aria-label="BetterMC home">
      <span className="brand-assets" aria-hidden="true">
        <span className="brand-main" />
        <span className="brand-wordmark" />
      </span>
      <span className="brand-title">
        <strong>Better Malaybalay City</strong>
        <small>Independent public information</small>
      </span>
    </Link>
  );
}

function MalaybalayClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const date = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(now);
  const time = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);
  return (
    <div
      className="city-clock"
      aria-label={`Malaybalay time: ${date}, ${time}`}
    >
      <Clock3 aria-hidden="true" />
      <span>
        <small>Malaybalay time · Asia/Manila</small>
        <strong>
          <time dateTime={now.toISOString()}>{time}</time>
          <em>{date}</em>
        </strong>
      </span>
    </div>
  );
}

function FinancialBreakdown() {
  const [selectedRow, setSelectedRow] = useState<{
    section: "income" | "spending";
    label: string;
    amount: number;
  } | null>(null);
  const currency = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(value);
  const incomeMax = financialSnapshot.incomeBreakdown[0].amount;
  const spendingMax = financialSnapshot.expenditureBreakdown[0].amount;
  return (
    <div className="financial-detail">
      <div className="breakdown-panel">
        <div className="breakdown-title">
          <h3>Operating income by source</h3>
          <strong>{currency(financialSnapshot.currentOperatingIncome)}</strong>
        </div>
        <div className="money-rows">
          {financialSnapshot.incomeBreakdown.map((row) => (
            <button
              className="money-row"
              type="button"
              key={row.label}
              aria-pressed={
                selectedRow?.section === "income" &&
                selectedRow.label === row.label
              }
              onClick={() => setSelectedRow({ section: "income", ...row })}
            >
              <span>
                <span>{row.label}</span>
                <strong>{currency(row.amount)}</strong>
              </span>
              <span className="amount-track" aria-hidden="true">
                <span
                  style={{
                    width: `${Math.max(1, (row.amount / incomeMax) * 100)}%`,
                  }}
                />
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="breakdown-panel">
        <div className="breakdown-title">
          <h3>Operating spending by service area</h3>
          <strong>
            {currency(financialSnapshot.currentOperatingExpenditures)}
          </strong>
        </div>
        <div className="money-rows">
          {financialSnapshot.expenditureBreakdown.map((row) => (
            <button
              className="money-row"
              type="button"
              key={row.label}
              aria-pressed={
                selectedRow?.section === "spending" &&
                selectedRow.label === row.label
              }
              onClick={() => setSelectedRow({ section: "spending", ...row })}
            >
              <span>
                <span>{row.label}</span>
                <strong>{currency(row.amount)}</strong>
              </span>
              <span className="amount-track" aria-hidden="true">
                <span
                  style={{
                    width: `${Math.max(1, (row.amount / spendingMax) * 100)}%`,
                  }}
                />
              </span>
            </button>
          ))}
        </div>
      </div>
      {selectedRow && (
        <div className="breakdown-insight" role="status">
          <div>
            <span>
              {selectedRow.section === "income"
                ? "Share of reported operating income"
                : "Share of reported operating expenditures"}
            </span>
            <strong>
              {(
                (selectedRow.amount /
                  (selectedRow.section === "income"
                    ? financialSnapshot.currentOperatingIncome
                    : financialSnapshot.currentOperatingExpenditures)) *
                100
              ).toFixed(2)}
              %
            </strong>
          </div>
          <p>
            <b>{selectedRow.label}</b> accounts for{" "}
            {currency(selectedRow.amount)} in the source statement. Select
            another row to compare its reported share.
          </p>
          <a
            href={financialSnapshot.source.url}
            target="_blank"
            rel="noreferrer"
          >
            Check the source PDF <ExternalLink />
          </a>
        </div>
      )}
      <div className="cash-panel">
        <div>
          <span>Beginning cash balance</span>
          <strong>{currency(financialSnapshot.beginningCashBalance)}</strong>
        </div>
        <ArrowRight aria-hidden="true" />
        <div>
          <span>Net increase in funds</span>
          <strong>{currency(financialSnapshot.netIncreaseInFunds)}</strong>
        </div>
        <ArrowRight aria-hidden="true" />
        <div>
          <span>Ending cash balance</span>
          <strong>{currency(financialSnapshot.endingCashBalance)}</strong>
        </div>
      </div>
      <div className="non-operating">
        <h3>Other reported financial movements</h3>
        <div>
          {financialSnapshot.nonOperatingBreakdown.map((row) => (
            <p key={row.label}>
              <span>{row.label}</span>
              <strong>{currency(row.amount)}</strong>
            </p>
          ))}
          <p>
            <span>Prior-year accounts payable paid</span>
            <strong>
              {currency(financialSnapshot.priorYearAccountsPayable)}
            </strong>
          </p>
          <p>
            <span>Continuing appropriation</span>
            <strong>
              {currency(financialSnapshot.continuingAppropriation)}
            </strong>
          </p>
        </div>
      </div>
      <p className="finance-method">
        <CircleAlert />
        Amounts are reported actuals for 2025 Q2. “Net operating balance,” “net
        increase in funds,” and “ending cash balance” are different accounting
        measures and are not interchangeable with savings.
      </p>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const pageAccessRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!open && !pagesOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setPagesOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, pagesOpen]);

  useEffect(() => {
    if (!pagesOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!pageAccessRef.current?.contains(event.target as Node)) {
        setPagesOpen(false);
      }
    };
    window.addEventListener("pointerdown", closeOutside);
    return () => window.removeEventListener("pointerdown", closeOutside);
  }, [pagesOpen]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <div className="independence-bar">
        <div className="container independence-inner">
          <p>
            Independent public information platform{" "}
            <span>Not an official City Government website</span>
          </p>
          <MalaybalayClock />
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
            <div className="page-access-menu" ref={pageAccessRef}>
              <button
                type="button"
                aria-expanded={pagesOpen}
                aria-controls="all-pages-menu"
                aria-label={`${pagesOpen ? "Close" : "Open"} BetterMC site directory`}
                onClick={() => setPagesOpen((value) => !value)}
              >
                <Compass aria-hidden="true" /> Explore <ChevronDown aria-hidden="true" />
              </button>
              <div
                id="all-pages-menu"
                className={`page-access-panel${pagesOpen ? " is-open" : ""}`}
                role="navigation"
                aria-label="BetterMC site directory"
                aria-hidden={!pagesOpen}
              >
                <div className="page-access-heading">
                  <span className="page-access-heading-icon"><LayoutGrid aria-hidden="true" /></span>
                  <span>
                    <strong>Browse BetterMC</strong>
                    <small>Go directly to any section of the public information portal.</small>
                  </span>
                </div>
                {sitePages.map((page) => (
                  <Link
                    key={page.to}
                    className={pathname === page.to ? "is-active" : undefined}
                    aria-current={pathname === page.to ? "page" : undefined}
                    to={page.to}
                    onClick={() => setPagesOpen(false)}
                  >
                    <span><strong>{page.label}</strong><small>{page.description}</small></span>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </nav>
          <button
            className="menu-button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        <div
          id="mobile-navigation"
          className={`mobile-nav-shell ${open ? "is-open" : ""}`}
          aria-hidden={!open}
        >
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {sitePages.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <ArrowRight />
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section className="footer-intro" aria-labelledby="footer-purpose">
          <Brand />
          <div>
            <span id="footer-purpose">Public information, made useful</span>
            <p>
              Understand local government through records that keep their
              source, context, and verification date.
            </p>
          </div>
        </section>
        <nav
          className="footer-column footer-nav"
          aria-label="Footer navigation"
        >
          <h2>Explore BetterMC</h2>
          <Link to="/about">About & methodology</Link>
          <Link to="/transparency">Transparency records</Link>
          <Link to="/participate">Submit a correction</Link>
          <a
            className="footer-icon-link"
            href="https://www.facebook.com/profile.php?id=61596547555480"
            target="_blank"
            rel="noreferrer"
          >
            <FacebookIcon />
            BetterMC on Facebook
          </a>
          <a
            className="footer-icon-link"
            href="mailto:bettermc.org@gmail.com"
          >
            <Mail aria-hidden="true" />
            bettermc.org@gmail.com
          </a>
          <a
            className="footer-icon-link"
            href="https://github.com/lordzxxxx/BetterMC"
            target="_blank"
            rel="noreferrer"
          >
            <Github aria-hidden="true" />
            Contribute on GitHub
          </a>
        </nav>
        <address className="footer-column footer-contact">
          <h2>Official city contact</h2>
          <a
            className="footer-action-card footer-contact-primary"
            href="tel:09171884225"
          >
            <Phone aria-hidden="true" />
            <span>
              <small>City Administrator’s Office</small>
              <strong>0917 188 4225</strong>
            </span>
          </a>
          <small className="footer-source-label">
            Published in the City Government contact directory
          </small>
          <div className="footer-contact-links">
            <a
              href="https://sakata.malaybalaycity.gov.ph/"
              target="_blank"
              rel="noreferrer"
            >
              City Government website <ExternalLink aria-hidden="true" />
            </a>
            <a
              className="footer-icon-link"
              href="https://www.facebook.com/profile.php?id=100063747444247"
              target="_blank"
              rel="noreferrer"
            >
              <FacebookIcon />
              Official Facebook page
            </a>
          </div>
        </address>
        <section
          className="footer-column footer-network"
          aria-labelledby="civic-network"
        >
          <h2 id="civic-network">Civic network</h2>
          <a
            className="footer-action-card bettergov-link"
            href="https://lgu.bettergov.ph/"
            target="_blank"
            rel="noreferrer"
          >
            <span>Powered by</span>
            <strong>BetterGov</strong>
            <ExternalLink aria-hidden="true" />
          </a>
          <p>
            Source-linked local government information built for public
            participation.
          </p>
        </section>
      </div>
      <div className="container footer-bottom">
        <p className="disclaimer">
          <ShieldCheck aria-hidden="true" />
          <span>
            <strong>Independent civic platform.</strong> BetterMC is not
            affiliated with, endorsed by, or operated by the City Government of
            Malaybalay. Use the responsible government office for official
            transactions and certifications.
          </span>
        </p>
        <small>Sources reviewed {VERIFIED_ON}</small>
      </div>
    </footer>
  );
}

function Layout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() =>
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ block: "start" }),
      );
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

function SourceNote({
  url,
  label = "Official source",
  date = VERIFIED_ON,
}: {
  url: string;
  label?: string;
  date?: string;
}) {
  return (
    <div className="source-note">
      <ShieldCheck aria-hidden="true" />
      <span>
        <a href={url} target="_blank" rel="noreferrer">
          {label}
          <ExternalLink aria-hidden="true" />
        </a>
        <small>Last source check {date}</small>
      </span>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsId = useId();
  const results = useMemo(() => {
    return searchPortal(deferredQuery);
  }, [deferredQuery]);

  useEffect(() => {
    const focusSearch = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (event.key === "Escape" && document.activeElement === inputRef.current) {
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const visibleResults = results.slice(0, 10);
  const hasQuery = query.trim().length > 0;
  return (
    <div className="global-search" role="search">
      <span className="global-search-icon" aria-hidden="true">
        <Search />
      </span>
      <label htmlFor="site-search" className="sr-only">
        Search all BetterMC public information
      </label>
      <input
        ref={inputRef}
        id="site-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search records, officials, offices, barangays, services…"
        autoComplete="off"
        aria-controls={hasQuery ? resultsId : undefined}
        aria-expanded={hasQuery}
      />
      {hasQuery && (
        <div
          id={resultsId}
          className="search-results"
          role="region"
          aria-label="Search results"
        >
          {visibleResults.length ? (
            <>
              <p className="search-results-count" role="status">
                {results.length} {results.length === 1 ? "match" : "matches"}
                {results.length > visibleResults.length
                  ? ` · showing first ${visibleResults.length}`
                  : ""}
              </p>
              {visibleResults.map((result) => (
              <Link
                key={`${result.href}-${result.type}-${result.title}`}
                to={result.href}
                onClick={() => setQuery("")}
              >
                <small>{result.type}</small>
                <span>
                  {result.title}
                  <em>{result.detail}</em>
                </span>
                <ArrowRight />
              </Link>
              ))}
            </>
          ) : (
            <p>No matching page or indexed public record was found.</p>
          )}
        </div>
      )}
    </div>
  );
}

function ServiceCategoryIcon({ slug }: { slug: string }) {
  const icons: Record<string, ReactNode> = {
    "business-trade": <BriefcaseBusiness aria-hidden="true" />,
    "certificates-ids": <IdCard aria-hidden="true" />,
    contributions: <WalletCards aria-hidden="true" />,
    "disaster-weather": <CloudSun aria-hidden="true" />,
    education: <GraduationCap aria-hidden="true" />,
    employment: <Users aria-hidden="true" />,
    health: <HeartPulse aria-hidden="true" />,
    housing: <House aria-hidden="true" />,
    "passport-travel": <Plane aria-hidden="true" />,
    "social-services": <HandHeart aria-hidden="true" />,
    tax: <BadgeDollarSign aria-hidden="true" />,
    "transport-driving": <Car aria-hidden="true" />,
  };
  return <>{icons[slug] ?? <BookOpen aria-hidden="true" />}</>;
}

function DisclosureCategoryIcon({ category }: { category: Disclosure["category"] }) {
  const icons: Record<Disclosure["category"], ReactNode> = {
    Budget: <Landmark aria-hidden="true" />,
    Procurement: <BriefcaseBusiness aria-hidden="true" />,
    Financial: <ReceiptText aria-hidden="true" />,
    Utilization: <BarChart3 aria-hidden="true" />,
    Staffing: <Users aria-hidden="true" />,
    GAD: <HandHeart aria-hidden="true" />,
  };
  return <>{icons[category]}</>;
}

function LocalServiceIcon({ title }: { title: string }) {
  const icons: Record<string, ReactNode> = {
    "Business permits and local compliance": <BriefcaseBusiness aria-hidden="true" />,
    "Civil registry and certificates": <IdCard aria-hidden="true" />,
    "Health and dental assistance": <HeartPulse aria-hidden="true" />,
    "Social welfare and assistance": <HandHeart aria-hidden="true" />,
    "Building forms and permits": <Building2 aria-hidden="true" />,
    "Emergency and incident response": <ShieldAlert aria-hidden="true" />,
  };
  return <>{icons[title] ?? <BookOpen aria-hidden="true" />}</>;
}

function ServiceCategoryGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`service-category-grid${compact ? " is-compact" : ""}`}>
      {serviceCategories.map((category) => (
        <article
          key={category.slug}
          className={`service-category-card cat-${category.slug}`}
        >
          <span className={`service-category-icon cat-icon-${category.slug}`}>
            <ServiceCategoryIcon slug={category.slug} />
          </span>
          <div className="category-card-body">
            <h3>
              <Link to={`/services/${category.slug}`}>{category.title}</Link>
            </h3>
            <p>{category.summary}</p>
          </div>
          <Link
            to={`/services/${category.slug}`}
            className="category-card-arrow-link"
            aria-label={`Open guide: ${category.title}`}
            title={`Open guide: ${category.title}`}
          >
            <ArrowRight aria-hidden="true" />
          </Link>
          {!compact && (
            <ul className="category-subcategories-list">
              {category.subcategories.map((subcategory) => (
                <li key={subcategory.slug}>
                  <a
                    href={betterGovServiceUrl(
                      category.slug,
                      subcategory.slug,
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{subcategory.title}</span>
                    <ExternalLink aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  );
}

function HomeEmergencyHotlines() {
  const priorityHotlines = departments.filter((office) =>
    [
      "City Disaster Risk Reduction and Management Office",
      "Bureau of Fire Protection — Malaybalay",
      "Malaybalay City Police Station",
    ].includes(office.name),
  );

  return (
    <aside className="home-emergency" aria-labelledby="home-emergency-title">
      <div className="home-emergency-heading">
        <span className="home-emergency-icon" aria-hidden="true">
          <ShieldAlert />
        </span>
        <div>
          <h2 id="home-emergency-title">Emergency hotlines</h2>
          <p>For urgent help, call the response office that matches the situation.</p>
        </div>
        <Link to="/government?tab=hotlines">
          All city hotlines <ArrowRight aria-hidden="true" />
        </Link>
      </div>
      <div className="home-hotline-list" aria-label="Priority emergency hotlines">
        {priorityHotlines.map((office) => (
          <a key={office.name} href={`tel:${telephoneHref(office.phone)}`}>
            <Phone aria-hidden="true" />
            <span>
              <small>{office.name}</small>
              <strong>{office.phone}</strong>
            </span>
          </a>
        ))}
      </div>
    </aside>
  );
}

function civicRecordId(number: string) {
  return number
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function disclosureSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function HomePage() {
  const [financeFocus, setFinanceFocus] = useState<
    "income" | "spending" | "balance" | "savings" | null
  >(null);
  const [recordsOpen, setRecordsOpen] = useState(false);
  const availableDisclosures = disclosures.filter(
    (item) => item.status === "Source listed",
  ).length;
  const money = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      notation: "compact",
      maximumFractionDigits: 3,
    }).format(value);
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>Welcome to BetterMC.</h1>
            <p className="hero-tagline">
              Your city. Your information. Your right to know.
            </p>
            <p className="hero-description">
              BetterMC is an independent civic technology platform making
              Malaybalay City&apos;s public information more accessible and
              transparent. Explore government projects, track public funds,
              access public services, and discover local records across all 46
              barangays.
            </p>
            <div className="hero-actions">
              <Link className="button primary" to="/transparency">
                Explore transparency <ArrowRight />
              </Link>
              <Link className="button secondary" to="/government">
                Find an office
              </Link>
            </div>
            <div className="hero-verification">
              <ShieldCheck />
              <span>
                Records show their original source and verification date.
                <strong>
                  Portal review: November 6, 2026 · finance and disclosure
                  rechecked November 9
                </strong>
              </span>
            </div>
          </div>
          <div className="hero-panel glass-panel">
            <div className="hero-brand">
              <span className="hero-brand-main" />
              <span className="hero-brand-wordmark" />
              <p>
                Better information. Better accountability. Better Malaybalay.
              </p>
            </div>
            <div className="panel-top">
              <span>Search public information</span>
              <kbd>⌘ K</kbd>
            </div>
            <GlobalSearch />
            <div className="quick-grid">
              <Link to="/transparency">
                <FileText />
                <span>
                  Full disclosure<small>2022–2026 catalog</small>
                </span>
              </Link>
              <Link to="/government">
                <Landmark />
                <span>
                  Government<small>Officials & offices</small>
                </span>
              </Link>
              <Link to="/services">
                <BookOpen />
                <span>
                  Public services<small>Charter & forms</small>
                </span>
              </Link>
              <Link to="/government?tab=hotlines">
                <ShieldAlert />
                <span>
                  Emergency contacts<small>Tap to call</small>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <WeatherPanel />
      <section className="section container city-overview" id="about-malaybalay">
        <div className="city-overview-copy">
          <span className="eyebrow">About Malaybalay City</span>
          <h2>A highland capital understood through public data.</h2>
          <p>
            Malaybalay is the provincial capital of Bukidnon and a first-class
            component city composed of 46 barangays. BetterMC connects its
            population, government, finance, legislative records, and service
            directories without replacing the responsible public offices.
          </p>
          <div className="city-overview-actions">
            <Link to="/government">Explore city government <ArrowRight /></Link>
            <Link to="/barangays">Browse all barangays <ArrowRight /></Link>
          </div>
        </div>
        <dl className="city-overview-facts">
          <div><dt>Population · released 2026</dt><dd>195,046</dd></div>
          <div><dt>Barangays</dt><dd>46</dd></div>
          <div><dt>Urban residents · released 2026</dt><dd>140,782</dd></div>
          <div><dt>2020–2024 annual growth</dt><dd>0.54%</dd></div>
        </dl>
        <a
          className="city-overview-source"
          href="https://rsso10.psa.gov.ph/content/highlights-population-counts-malaybalay-city-bukidnon-based-2024-census-population"
          target="_blank"
          rel="noreferrer"
        >
          PSA 2024 POPCEN · city release dated January 15, 2026
          <ExternalLink />
        </a>
        <a
          className="city-overview-source city-overview-source-secondary"
          href="https://rsso10.psa.gov.ph/special-release/node/1684058515"
          target="_blank"
          rel="noreferrer"
        >
          PSA urban-population release dated November 4, 2026
          <ExternalLink />
        </a>
      </section>
      <section className="metrics-strip">
        <div className="container metrics-grid">
          <div>
            <strong>{availableDisclosures}</strong>
            <span>source-listed disclosure entries</span>
          </div>
          <div>
            <strong>{departments.length}</strong>
            <span>offices and public contacts</span>
          </div>
          <div>
            <strong>{officials.length}</strong>
            <span>elected and sectoral officials</span>
          </div>
          <div>
            <strong>{barangayMicrosites.length}</strong>
            <span>barangays with DILG-listed leaders</span>
          </div>
        </div>
        <p className="metric-caption container">
          Counts reflect records in this portal, not a legal-compliance
          assessment.
        </p>
      </section>
      <section className="section container home-services" id="government-services">
        <div className="home-services-heading">
          <SectionHeading
            eyebrow="Government services"
            title="Find the right public service."
          >
            City transactions stay with the responsible Malaybalay office.
            National services open the corresponding BetterGov directory.
          </SectionHeading>
          <Link className="button secondary" to="/services">
            Open the complete service guide <ArrowRight />
          </Link>
        </div>
        <HomeEmergencyHotlines />
        <ServiceCategoryGrid compact />
      </section>
      <section
        className="section container finance-section"
        id="financial-snapshot"
      >
        <div className="finance-heading">
          <SectionHeading
            eyebrow="City finances · 2025 Q2"
            title="Where the money came from, where it went, and what remained."
          >
            These are reported actual amounts—not forecasts—from Malaybalay
            City’s Statement of Receipts and Expenditures for the quarter ending
            June 2025. Labels below follow the source record.
          </SectionHeading>
          <div className="finance-source">
            <FileCheck2 aria-hidden="true" />
            <div>
              <span>Primary financial record</span>
              <a
                href={financialSnapshot.source.url}
                target="_blank"
                rel="noreferrer"
              >
                2025 Q2 Statement of Receipts and Expenditures <ExternalLink />
              </a>
              <small>
                Reporting period: April–June 2025 · values transcribed from
                the cited statement · arithmetic checked · catalog last
                checked {VERIFIED_ON}
              </small>
              <a
                className="finance-catalog-link"
                href="https://sakata.malaybalaycity.gov.ph/full-disclosure/"
                target="_blank"
                rel="noreferrer"
              >
                Verify the official Full Disclosure catalog <ExternalLink />
              </a>
            </div>
          </div>
        </div>
        <div className="finance-grid">
          <button
            type="button"
            aria-expanded={financeFocus === "income"}
            onClick={() =>
              setFinanceFocus(financeFocus === "income" ? null : "income")
            }
          >
            <TrendingUp />
            <span>Current operating income</span>
            <strong>{money(financialSnapshot.currentOperatingIncome)}</strong>
            <small>{financialSnapshot.period} reported actual · inspect</small>
          </button>
          <button
            type="button"
            aria-expanded={financeFocus === "spending"}
            onClick={() =>
              setFinanceFocus(financeFocus === "spending" ? null : "spending")
            }
          >
            <ReceiptText />
            <span>Current operating expenditures</span>
            <strong>
              {money(financialSnapshot.currentOperatingExpenditures)}
            </strong>
            <small>{financialSnapshot.period} reported actual · inspect</small>
          </button>
          <button
            type="button"
            aria-expanded={financeFocus === "balance"}
            onClick={() =>
              setFinanceFocus(financeFocus === "balance" ? null : "balance")
            }
          >
            <BarChart3 />
            <span>Net operating balance</span>
            <strong>{money(financialSnapshot.netOperatingBalance)}</strong>
            <small>Income less operating expenditures · inspect</small>
          </button>
          <button
            type="button"
            className="savings-card"
            aria-expanded={financeFocus === "savings"}
            onClick={() =>
              setFinanceFocus(financeFocus === "savings" ? null : "savings")
            }
          >
            <ShieldCheck />
            <span>Reported procurement savings</span>
            <strong>₱361.87M</strong>
            <small>Reported for {reportedProcurementSavings.period} · inspect</small>
          </button>
        </div>
        {financeFocus && (
          <div className="finance-insight" role="region" aria-live="polite">
            <div>
              <span>What this figure means</span>
              <h3>
                {financeFocus === "income"
                  ? "Current operating income"
                  : financeFocus === "spending"
                    ? "Current operating expenditures"
                    : financeFocus === "balance"
                      ? "Net operating balance"
                      : "Reported procurement savings, through 2025"}
              </h3>
            </div>
            <p>
              {financeFocus === "income"
                ? "Revenue reported from operating sources during the period. It is not the same as the total cash available to the city."
                : financeFocus === "spending"
                  ? "Current operating costs reported for the period. Capital, debt-principal, and other non-operating movements are shown separately below."
                  : financeFocus === "balance"
                    ? `${money(financialSnapshot.currentOperatingIncome)} income less ${money(financialSnapshot.currentOperatingExpenditures)} operating expenditures equals ${money(financialSnapshot.netOperatingBalance)}. This is not automatically “savings.”`
                    : `The Philippine Daily Inquirer reports Mayor Jay Warren Pabillaran’s statement that procurement activities generated ₱${(reportedProcurementSavings.amount / 1_000_000).toFixed(2)} million in savings since 2022. Its breakdown is ₱${(reportedProcurementSavings.earlierPeriod / 1_000_000).toFixed(2)} million from mid-2022 through 2024 plus ₱${(reportedProcurementSavings.latestYear / 1_000_000).toFixed(2)} million for 2025; the figures add up to the reported total. This is a reported procurement figure, not a line item in the 2025 Q2 financial statement, cash on hand, or an independently audited savings calculation. The supplied first-half 2025 amount is not added separately to the full-year 2025 figure.`}
            </p>
            {financeFocus === "savings" ? (
              <a
                href={reportedProcurementSavings.source.url}
                target="_blank"
                rel="noreferrer"
              >
                Read the report and its breakdown <ExternalLink />
              </a>
            ) : (
              <a
                href={financialSnapshot.source.url}
                target="_blank"
                rel="noreferrer"
              >
                Verify in the official statement <ExternalLink />
              </a>
            )}
          </div>
        )}
        <div
          id="financial-detail"
          className="financial-breakdown-visible"
        >
          <FinancialBreakdown />
        </div>
      </section>
      <section className="section container records-preview-section">
        <SectionHeading
          eyebrow="Legislative record"
          title="Published measures, without invented attribution"
        >
          See ordinances and other measures from verified public listings. When
          an individual author or sponsor is not published, BetterMC says so.
        </SectionHeading>
        <div className={`records-preview ${recordsOpen ? "is-expanded" : ""}`}>
          {civicRecords.slice(0, 3).map((record) => (
            <article key={record.number}>
              <span>
                {record.kind} · {new Date(record.published).getFullYear()}
              </span>
              <h3>{record.number}</h3>
              <p>{record.title}</p>
              <small>{record.body}</small>
              <Link to={`/legislation/${civicRecordId(record.number)}`}>
                Read record context <ArrowRight />
              </Link>
            </article>
          ))}
        </div>
        <div className="home-section-actions">
          <button
            className="mobile-collection-toggle"
            type="button"
            aria-expanded={recordsOpen}
            onClick={() => setRecordsOpen((open) => !open)}
          >
            {recordsOpen ? "Show fewer measures" : "Show 2 more measures"}{" "}
            <ChevronDown aria-hidden="true" />
          </button>
          <Link className="button secondary" to="/legislation">
            View all published measures <ArrowRight />
          </Link>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="Transparency center"
          title="Start with the original record"
        >
          BetterMC organizes official listings without turning allocations into
          claims of spending or missing files into claims of noncompliance.
        </SectionHeading>
        <div className="transparency-actions">
          <Link className="disclosure-row" to="/transparency">
            <span className="disclosure-icon">
              <FileCheck2 />
            </span>
            <span className="disclosure-copy">
              <small>Full disclosure portal</small>
              <strong>Browse public documents</strong>
              <em>
                Filter financial, procurement, utilization, staffing, and GAD
                records by year and quarter.
              </em>
            </span>
            <span className="disclosure-meta">
              <b>{availableDisclosures} entries</b>
              <small>Source-listed in this portal</small>
            </span>
            <ArrowRight aria-hidden="true" />
          </Link>
          <div className="supporting-links">
            <a href="/#financial-snapshot">
              <BarChart3 />
              <span>
                <small>Financial breakdown</small>
                <strong>Read the 2025 Q2 figures with context</strong>
              </span>
              <ArrowRight />
            </a>
            <Link to="/participate">
              <Database />
              <span>
                <small>Correction desk</small>
                <strong>Submit a source-backed correction</strong>
              </span>
              <ArrowRight />
            </Link>
            <Link to="/barangays">
              <Landmark />
              <span>
                <small>{barangayMicrosites.length} barangays</small>
                <strong>
                  Find every barangay and its publicly listed leader
                </strong>
              </span>
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
      <section className="section soft-section">
        <div className="container">
          <SectionHeading
            eyebrow="Public directory"
            title="The right office, without the runaround"
          >
            Direct contact details are reproduced from the City Government’s
            current contact directory and retain the original source.
          </SectionHeading>
          <div className="office-preview">
            {departments.slice(0, 6).map((office) => (
              <article key={office.name}>
                <Building2 />
                <h3>{office.name}</h3>
                <a href={`tel:${telephoneHref(office.phone)}`}>
                  <Phone />
                  {office.phone}
                </a>
                <a href={`mailto:${office.email}`}>
                  <Mail />
                  {office.email}
                </a>
              </article>
            ))}
          </div>
          <div className="home-section-actions office-directory-actions">
            <Link className="button secondary" to="/government?tab=offices">
              View all offices <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PageHero({
  eyebrow,
  title,
  description,
  children,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`page-hero${compact ? " page-hero-compact" : ""}`}>
      <div className="container">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
    </section>
  );
}

type ProcurementDisplayRecord = {
  number: string;
  title: string;
  year: number;
  stage: string;
  url: string;
};

const awardRecordsForDisplay = (
  records: ProcurementAwardRecord[],
): ProcurementDisplayRecord[] =>
  records.map((record) => ({
    number: record.number,
    title: record.title,
    year: record.year,
    stage: "Award notice",
    url: record.sourceUrl,
  }));

const procurementPageContent = {
  "bidding-opportunities": {
    title: "2026 bidding opportunities",
    description:
      "Search the notices indexed from the City BAC page. Each entry opens its published procurement document for requirements, schedules, and approved-budget details.",
    records: bidRecords2026.map((record) => ({
      ...record,
      year: 2026,
    })),
    sourceUrl: BAC_2026_SOURCE,
    sourceLabel: "City BAC opportunity hub",
    scope: "Bidding notices",
    notice:
      "A bidding opportunity is not an award and does not establish payment, delivery, or project completion.",
  },
  "infrastructure-awards": {
    title: "Infrastructure award notices",
    description:
      "Browse a source-linked extract of the 2024 infrastructure entries currently leading the City BAC award page.",
    records: awardRecordsForDisplay(infrastructureAwardRecords),
    sourceUrl: INFRASTRUCTURE_AWARDS_SOURCE,
    sourceLabel: "City BAC infrastructure awards",
    scope: "Award notices",
    notice:
      "An award notice records a procurement-stage result. It does not by itself prove payment, delivery, construction progress, or project completion.",
  },
  "goods-services-awards": {
    title: "Goods and services award notices",
    description:
      "Review the source-linked 2024 entries currently leading the City BAC goods-and-services award page.",
    records: awardRecordsForDisplay(goodsServicesAwardRecords),
    sourceUrl: GOODS_SERVICES_AWARDS_SOURCE,
    sourceLabel: "City BAC goods and services awards",
    scope: "Award notices",
    notice:
      "The listed notice identifies an award-stage publication. Confirm supplier, amount, line item, and notice status in the linked PhilGEPS record.",
  },
  "small-value-procurement": {
    title: "Small-value procurement notices",
    description:
      "Search 2026 BAC entries explicitly labeled as small-value procurement, separated here from the broader mixed source page.",
    records: bidRecords2026
      .filter((record) => record.stage === "Small value procurement")
      .map((record) => ({ ...record, year: 2026 })),
    sourceUrl: SMALL_VALUE_PROCUREMENT_SOURCE,
    sourceLabel: "City BAC small-value procurement page",
    scope: "Method-filtered notices",
    notice:
      "The official source page also displays broader bidding opportunities. BetterMC includes only entries explicitly labeled as small-value procurement in this view.",
  },
} satisfies Record<
  string,
  {
    title: string;
    description: string;
    records: ProcurementDisplayRecord[];
    sourceUrl: string;
    sourceLabel: string;
    scope: string;
    notice: string;
  }
>;

function ProcurementRecordIndex({
  records,
  sourceUrl,
}: {
  records: ProcurementDisplayRecord[];
  sourceUrl: string;
}) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = records.filter((record) =>
    `${record.number} ${record.title} ${record.stage} ${record.year}`
      .toLowerCase()
      .includes(normalizedQuery),
  );
  const visible = expanded || normalizedQuery ? filtered : filtered.slice(0, 16);

  return (
    <div className="procurement-index">
      <div className="procurement-index-head">
        <div>
          <span className="eyebrow">Source-linked records</span>
          <h2>Search this procurement page</h2>
        </div>
        <label className="procurement-search">
          <span className="sr-only">Search procurement records</span>
          <Search aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search project, office, barangay, or ITB number"
          />
        </label>
      </div>
      <div className="procurement-count" role="status">
        <strong>{filtered.length}</strong> matching records · source reviewed {BAC_2026_VERIFIED_ON}
      </div>
      <div className="bid-record-list">
        {visible.map((record, index) => (
          <a
            key={`${record.number}-${record.url}-${index}`}
            href={record.url}
            target="_blank"
            rel="noreferrer"
          >
            <span>{record.stage}</span>
            <strong>{record.number}</strong>
            <p>{record.title.replace(/^ITB-\d{4}-\d+\.?\s*/i, "")}</p>
            <ExternalLink aria-hidden="true" />
          </a>
        ))}
      </div>
      {!normalizedQuery && filtered.length > 16 && (
        <button
          className="bid-record-toggle"
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show fewer records" : `Show all ${filtered.length} records`}
          <ChevronDown aria-hidden="true" />
        </button>
      )}
      <a
        className="procurement-index-source"
        href={sourceUrl}
        target="_blank"
        rel="noreferrer"
      >
        Open the original City BAC page <ExternalLink aria-hidden="true" />
      </a>
    </div>
  );
}

function ProcurementPage() {
  const { category } = useParams<{ category: string }>();
  const page =
    category && category in procurementPageContent
      ? procurementPageContent[
          category as keyof typeof procurementPageContent
        ]
      : undefined;

  if (!page) return <NotFoundPage />;

  return (
    <>
      <PageHero
        eyebrow="Procurement records"
        title={page.title}
        description={page.description}
        compact
      />
      <section className="section container procurement-page">
        <nav className="procurement-page-nav" aria-label="Procurement record types">
          {procurementSources.map((source) => (
            <NavLink key={source.path} to={source.path}>
              {source.title}
            </NavLink>
          ))}
        </nav>

        <div className="procurement-page-summary">
          <div>
            <span>Records in this view</span>
            <strong>{page.records.length}</strong>
          </div>
          <div>
            <span>Record scope</span>
            <strong>{page.scope}</strong>
          </div>
          <div>
            <span>Source reviewed</span>
            <strong>{BAC_2026_VERIFIED_ON}</strong>
          </div>
        </div>

        <div className="data-notice procurement-scope-notice">
          <CircleAlert aria-hidden="true" />
          <div>
            <strong>Read the record at the correct procurement stage</strong>
            <p>{page.notice}</p>
          </div>
        </div>

        <ProcurementRecordIndex
          key={category}
          records={page.records}
          sourceUrl={page.sourceUrl}
        />

        <div className="procurement-source-ledger">
          <ShieldCheck aria-hidden="true" />
          <div>
            <strong>Source and coverage</strong>
            <p>
              Titles are transcribed for readability and retain their source
              notice. This is a navigable public-information index, not a
              substitute for the official procurement record or a claim that
              the source page is a complete archive.
            </p>
          </div>
          <a href={page.sourceUrl} target="_blank" rel="noreferrer">
            {page.sourceLabel} <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}

function TransparencyPage() {
  const [params, setParams] = useSearchParams();
  const year = Number(params.get("year") ?? 2026);
  const quarter = params.get("quarter") ?? "All";
  const category = params.get("category") ?? "All";
  const [query, setQuery] = useState("");
  const [activeRecordPopout, setActiveRecordPopout] =
    useState<Disclosure | null>(null);
  const deferredQuery = useDeferredValue(query);
  const rows = disclosures.filter(
    (item) =>
      item.year === year &&
      (quarter === "All" || item.quarter === quarter) &&
      (category === "All" || item.category === category) &&
      item.title.toLowerCase().includes(deferredQuery.toLowerCase()),
  );
  useEffect(() => {
    if (!activeRecordPopout) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveRecordPopout(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeRecordPopout]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    setParams(next);
  };
  return (
    <>
      <PageHero
        eyebrow="Transparency center"
        title="Public records, with their context intact."
        description="Browse the City Government’s Full Disclosure listings. Availability here means a record was listed by the official source; it is not a legal-compliance rating."
      />
      <section className="section container">
        <div className="data-notice">
          <CircleAlert />
          <div>
            <strong>What this catalog can and cannot tell you</strong>
            <p>
              BetterMC links to the official disclosure source. It does not
              infer that an appropriation was spent, or that an unlisted record
              proves noncompliance.
            </p>
          </div>
        </div>
        <aside
          className="source-review-callout"
          aria-label="Source review and citation"
        >
          <div>
            <ShieldCheck aria-hidden="true" />
            <span>
              <strong>Source review and citation</strong>
              <p>
                The City Government’s Full Disclosure catalog was rechecked on{" "}
                {VERIFIED_ON}. “Source listed” means the title appears in that
                official catalog; it does not certify a payment, delivery,
                completion, or legal-compliance outcome.
              </p>
            </span>
          </div>
          <a
            href="https://sakata.malaybalaycity.gov.ph/full-disclosure/"
            target="_blank"
            rel="noreferrer"
          >
            Open official catalog <ExternalLink aria-hidden="true" />
          </a>
        </aside>
        <div className="procurement-sources">
          <SectionHeading
            eyebrow="Procurement records"
            title="Award notices and bidding opportunities, kept distinct"
          >
            The BAC pages below organize public procurement records by type. An
            invitation to bid is not an award, and an award notice does not by
            itself establish payment, delivery, or project completion.
          </SectionHeading>
          <div className="procurement-grid">
            {procurementSources.map((source) => (
              <Link
                key={source.title}
                to={source.path}
              >
                <span>{source.kind}</span>
                <h2>{source.title}</h2>
                <p>{source.description}</p>
                <small>{source.coverage}</small>
                <strong>
                  Browse BetterMC records <ArrowRight aria-hidden="true" />
                </strong>
              </Link>
            ))}
          </div>
          <p className="procurement-review">
            <ShieldCheck aria-hidden="true" /> Pages reviewed {VERIFIED_ON}. The
            general hub and SVP page currently mix bidding opportunities with
            other records; BetterMC does not relabel them as awarded projects.
          </p>
        </div>
        <div className="toolbar">
          <label>
            <span>Search records</span>
            <div className="input-wrap">
              <Search />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search document titles"
              />
            </div>
          </label>
          <label>
            <span>Fiscal year</span>
            <select
              value={year}
              onChange={(event) => updateParam("year", event.target.value)}
            >
              {[2026, 2025, 2024, 2023, 2022].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Quarter</span>
            <select
              value={quarter}
              onChange={(event) => updateParam("quarter", event.target.value)}
            >
              {["All", "Annual", "Q1", "Q2", "Q3", "Q4"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Category</span>
            <select
              value={category}
              onChange={(event) => updateParam("category", event.target.value)}
            >
              {[
                "All",
                "Budget",
                "Procurement",
                "Financial",
                "Utilization",
                "Staffing",
                "GAD",
              ].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="results-summary">
          <strong>{rows.length} records</strong>
          <span>Source checked {VERIFIED_ON}</span>
        </div>
        <div className="records-list">
          {rows.map((record) => (
            <article
              key={`${record.year}-${record.quarter}-${record.title}`}
              className="is-interactive-card"
              onClick={() => setActiveRecordPopout(record)}
            >
              <div className="record-icon" aria-hidden="true">
                <DisclosureCategoryIcon category={record.category} />
              </div>
              <div className="record-main">
                <div className="record-meta">
                  <span>{record.category}</span>
                  <span>{record.year}</span>
                  <span>{record.quarter}</span>
                </div>
                <h2>{record.title}</h2>
                <p
                  className={
                    record.status.startsWith("Not")
                      ? "unavailable"
                      : "available"
                  }
                >
                  {record.status.startsWith("Not") ? (
                    <CircleAlert />
                  ) : (
                    <Check />
                  )}
                  {record.status}
                </p>
              </div>
              <Link
                className="record-link"
                to={`/transparency/${record.year}/${record.quarter.toLowerCase()}/${disclosureSlug(record.title)}`}
                aria-label={`View context for ${record.title}`}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setActiveRecordPopout(record);
                }}
              >
                View record details <ArrowRight />
              </Link>
            </article>
          ))}
        </div>
        {activeRecordPopout && (
          <div
            className="barangay-popout-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={`${activeRecordPopout.title} disclosure popout`}
            onClick={() => setActiveRecordPopout(null)}
          >
            <div
              className="barangay-popout-modal transparency-popout-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="barangay-popout-header">
                <div className="barangay-popout-brand">
                  <span className="barangay-icon-tile">
                    <DisclosureCategoryIcon
                      category={activeRecordPopout.category}
                    />
                  </span>
                  <div>
                    <span className="eyebrow">
                      {activeRecordPopout.category} Disclosure ·{" "}
                      {activeRecordPopout.year} {activeRecordPopout.quarter}
                    </span>
                    <h3>{activeRecordPopout.title}</h3>
                  </div>
                </div>
                <button
                  type="button"
                  className="barangay-popout-close"
                  aria-label="Close record popout"
                  onClick={() => setActiveRecordPopout(null)}
                >
                  <X aria-hidden="true" />
                </button>
              </div>
              <div className="barangay-popout-body">
                <div className="popout-table-wrap">
                  <table className="popout-structured-table">
                    <tbody>
                      <tr>
                        <th scope="row">Document Title</th>
                        <td>
                          <strong>{activeRecordPopout.title}</strong>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Disclosure Category</th>
                        <td>{activeRecordPopout.category}</td>
                      </tr>
                      <tr>
                        <th scope="row">Fiscal Year & Reporting Period</th>
                        <td>
                          FY {activeRecordPopout.year} ·{" "}
                          {activeRecordPopout.quarter}
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Catalog Availability Status</th>
                        <td>{activeRecordPopout.status}</td>
                      </tr>
                      <tr>
                        <th scope="row">Analytical & Reporting Context</th>
                        <td>
                          {disclosureContext[activeRecordPopout.category]}
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Official Catalog Publisher</th>
                        <td>{activeRecordPopout.source.label}</td>
                      </tr>
                      <tr>
                        <th scope="row">Source Review Date</th>
                        <td>{activeRecordPopout.source.verifiedOn}</td>
                      </tr>
                      <tr>
                        <th scope="row">Primary & Backup Source References</th>
                        <td>
                          <div className="popout-table-links">
                            <a
                              href={
                                activeRecordPopout.downloadUrl ??
                                activeRecordPopout.source.url
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              {activeRecordPopout.downloadUrl
                                ? "Open Official Published PDF"
                                : "Open Official Full Disclosure Catalog"}{" "}
                              <ExternalLink aria-hidden="true" />
                            </a>
                            <a
                              href="https://sakata.malaybalaycity.gov.ph/full-disclosure/"
                              target="_blank"
                              rel="noreferrer"
                            >
                              City Government of Malaybalay Full Disclosure
                              Portal <ExternalLink aria-hidden="true" />
                            </a>
                            <a
                              href="https://fdpp.dilg.gov.ph/"
                              target="_blank"
                              rel="noreferrer"
                            >
                              DILG Full Disclosure Policy Portal (FDPP){" "}
                              <ExternalLink aria-hidden="true" />
                            </a>
                            <a
                              href="https://www.coa.gov.ph/reports/annual-audit-reports/aar-local-government-units/"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Commission on Audit (COA) LGU Audit Archive{" "}
                              <ExternalLink aria-hidden="true" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="noah-popout-actions">
                  <a
                    className="button primary"
                    href={
                      activeRecordPopout.downloadUrl ??
                      activeRecordPopout.source.url
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    {activeRecordPopout.downloadUrl
                      ? "Open official PDF"
                      : "Open official catalog"}{" "}
                    <ExternalLink aria-hidden="true" />
                  </a>
                  <Link
                    className="button secondary"
                    to={`/transparency/${activeRecordPopout.year}/${activeRecordPopout.quarter.toLowerCase()}/${disclosureSlug(activeRecordPopout.title)}`}
                    onClick={() => setActiveRecordPopout(null)}
                  >
                    Open standalone record page{" "}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        <SourceNote
          url="https://sakata.malaybalaycity.gov.ph/full-disclosure/"
          label="Malaybalay City Full Disclosure"
        />
      </section>
    </>
  );
}

const disclosureContext: Record<Disclosure["category"], string> = {
  Budget:
    "Budget records describe authorized financial plans. An appropriation is not, by itself, proof that the full amount was spent.",
  Procurement:
    "Procurement records can represent plans, invitations, bid results, or awards. Each stage has a different meaning and should not be treated as proof of payment or completion.",
  Financial:
    "Financial statements report specific accounting periods and measures. Compare like-for-like periods and use the document’s own definitions.",
  Utilization:
    "Utilization reports describe reported fund use for a stated period. They do not automatically establish physical project completion.",
  Staffing:
    "Staffing records describe the published manpower complement for a reporting period and may not represent real-time personnel status.",
  GAD:
    "Gender and Development records should be read with their stated plan, budget, accomplishment, and reporting period.",
};

function DisclosureDetailPage() {
  const { year: yearParam, quarter: quarterParam, slug } = useParams();
  const record = disclosures.find(
    (item) =>
      item.year === Number(yearParam) &&
      item.quarter.toLowerCase() === quarterParam?.toLowerCase() &&
      disclosureSlug(item.title) === slug,
  );

  if (!record) return <NotFoundPage />;

  return (
    <>
      <PageHero
        eyebrow={`${record.category} disclosure · ${record.year} ${record.quarter}`}
        title={record.title}
        description={disclosureContext[record.category]}
        compact
      />
      <section className="section container disclosure-detail-page">
        <div className="disclosure-detail-layout">
          <article className="disclosure-context-card">
            <span className="service-category-icon">
              <FileText aria-hidden="true" />
            </span>
            <div className="record-meta">
              <span>{record.category}</span>
              <span>{record.year}</span>
              <span>{record.quarter}</span>
            </div>
            <h2>Record availability</h2>
            <p className={record.status.startsWith("Not") ? "unavailable" : "available"}>
              {record.status.startsWith("Not") ? (
                <CircleAlert aria-hidden="true" />
              ) : (
                <Check aria-hidden="true" />
              )}
              {record.status}
            </p>
            <p>{disclosureContext[record.category]}</p>
            <dl>
              <div>
                <dt>Official catalog</dt>
                <dd>{record.source.label}</dd>
              </div>
              <div>
                <dt>Source review date</dt>
                <dd>{record.source.verifiedOn}</dd>
              </div>
            </dl>
          </article>
          <aside className="disclosure-action-card">
            <ShieldCheck aria-hidden="true" />
            <h2>Verify the original record</h2>
            <p>
              BetterMC provides context and a stable local page. The official
              file or catalog remains the authoritative publication.
            </p>
            <a
              className="button primary"
              href={record.downloadUrl ?? record.source.url}
              target="_blank"
              rel="noreferrer"
            >
              {record.downloadUrl ? "Open official PDF" : "Open official catalog"}
              <ExternalLink />
            </a>
            <Link className="button secondary" to={`/transparency?year=${record.year}&quarter=${record.quarter}`}>
              Return to disclosure records
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}

type LegislationFilter = "All" | CivicRecord["kind"];

function LegislationPage() {
  const [params, setParams] = useSearchParams();
  const requestedKind = params.get("kind");
  const kind: LegislationFilter =
    requestedKind === "Ordinance" ||
    requestedKind === "Executive order" ||
    requestedKind === "Memorandum circular"
      ? requestedKind
      : "All";
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.toLowerCase());
  const records = civicRecords.filter(
    (record) =>
      (kind === "All" || record.kind === kind) &&
      `${record.number} ${record.title} ${record.body}`
        .toLowerCase()
        .includes(deferredQuery),
  );

  return (
    <>
      <PageHero
        eyebrow="Legislative and executive records"
        title="Published measures, readable inside BetterMC."
        description="Review ordinances, executive orders, and memorandum circulars with institutional attribution and source context before opening the official listing for verification."
        compact
      />
      <section className="section container legislation-page">
        <div className="legislation-summary" aria-label="Indexed record summary">
          {(["Ordinance", "Executive order", "Memorandum circular"] as const).map(
            (recordKind) => (
              <div key={recordKind}>
                <strong>
                  {civicRecords.filter((record) => record.kind === recordKind).length}
                </strong>
                <span>{recordKind}s indexed</span>
              </div>
            ),
          )}
        </div>
        <div className="data-notice">
          <CircleAlert aria-hidden="true" />
          <div>
            <strong>Published record does not always mean named authorship</strong>
            <p>
              BetterMC attributes a measure to an individual only when the
              reviewed official source names that author or sponsor. Otherwise,
              the responsible office or legislative institution is shown.
            </p>
          </div>
        </div>
        <div className="legislation-toolbar">
          <label className="directory-search">
            <span className="sr-only">Search published measures</span>
            <Search aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search number, subject, or institution"
            />
          </label>
          <div className="legislation-filters" aria-label="Filter record type">
            {(
              [
                "All",
                "Ordinance",
                "Executive order",
                "Memorandum circular",
              ] as const
            ).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={kind === value}
                onClick={() =>
                  setParams(value === "All" ? {} : { kind: value })
                }
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div className="results-summary">
          <strong>{records.length} published records</strong>
          <span>Sources reviewed {VERIFIED_ON}</span>
        </div>
        <div className="legislation-records">
          {records.map((record) => (
            <article id={civicRecordId(record.number)} key={record.number}>
              <div className="record-meta">
                <span>{record.kind}</span>
                <span>{record.published}</span>
                <span>{record.attributionLevel}</span>
              </div>
              <h2>{record.number}</h2>
              <p>{record.title}</p>
              <dl>
                <div>
                  <dt>Responsible institution</dt>
                  <dd>{record.body}</dd>
                </div>
                <div>
                  <dt>Attribution note</dt>
                  <dd>{record.attribution}</dd>
                </div>
              </dl>
              <Link to={`/legislation/${civicRecordId(record.number)}`}>
                Read BetterMC record page <ArrowRight />
              </Link>
            </article>
          ))}
        </div>
        {!records.length && (
          <div className="empty-state" role="status">
            <Search aria-hidden="true" />
            <strong>No matching published measure</strong>
            <p>Try a broader number, title, or institution.</p>
          </div>
        )}
      </section>
    </>
  );
}

function LegislationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const record = civicRecords.find(
    (item) => civicRecordId(item.number) === slug,
  );

  useEffect(() => {
    if (!record) return;
    const previousTitle = document.title;
    document.title = `${record.number} — BetterMC`;
    return () => {
      document.title = previousTitle;
    };
  }, [record]);

  if (!record) return <NotFoundPage />;

  const context = civicRecordContext[record.number];
  const publishedLabel = /^\d{4}-\d{2}-\d{2}$/.test(record.published)
    ? new Intl.DateTimeFormat("en-PH", {
        dateStyle: "long",
        timeZone: "Asia/Manila",
      }).format(new Date(`${record.published}T00:00:00+08:00`))
    : record.published;

  return (
    <>
      <PageHero
        eyebrow={record.kind}
        title={record.number}
        description={record.title}
        compact
      >
        <Link className="page-hero-backlink" to="/legislation">
          Return to all published measures <ArrowRight aria-hidden="true" />
        </Link>
      </PageHero>
      <section className="section container legislation-detail-page">
        <article className="legislation-detail-main">
          <div className="record-meta">
            <span>{record.kind}</span>
            <span>{publishedLabel}</span>
            <span>{record.attributionLevel}</span>
          </div>

          <section>
            <span className="eyebrow">Plain-language summary</span>
            <h2>What this published measure does</h2>
            <p>{context.summary}</p>
          </section>

          <div className="legislation-explanation-grid">
            <section>
              <Landmark aria-hidden="true" />
              <h3>Why it matters to the public</h3>
              <p>{context.publicRelevance}</p>
            </section>
            <section>
              <CircleAlert aria-hidden="true" />
              <h3>What this page does not claim</h3>
              <p>{context.limits}</p>
            </section>
          </div>

          <dl className="legislation-detail-facts">
            <div>
              <dt>Responsible institution</dt>
              <dd>{record.body}</dd>
            </div>
            <div>
              <dt>Publication date shown</dt>
              <dd>{publishedLabel}</dd>
            </div>
            <div>
              <dt>Attribution</dt>
              <dd>{record.attribution}</dd>
            </div>
          </dl>
        </article>

        <aside className="legislation-source-card">
          <ShieldCheck aria-hidden="true" />
          <span className="eyebrow">Source ledger</span>
          <h2>Verify the authoritative publication</h2>
          <p>
            BetterMC keeps the explanation and route available locally. The
            City Government listing remains the authoritative source for the
            complete legal text and attachments.
          </p>
          <dl>
            <div>
              <dt>Publisher</dt>
              <dd>{record.source.label}</dd>
            </div>
            <div>
              <dt>Source reviewed</dt>
              <dd>{record.source.verifiedOn}</dd>
            </div>
          </dl>
          <a
            className="button primary"
            href={record.source.url}
            target="_blank"
            rel="noreferrer"
          >
            Open official source <ExternalLink aria-hidden="true" />
          </a>
          <p className="source-availability-note">
            If the official website is temporarily unavailable, this BetterMC
            summary remains accessible but does not replace the original text.
          </p>
        </aside>
      </section>
    </>
  );
}

type GovernmentTab = "officials" | "records" | "offices" | "hotlines";
function GovernmentPage() {
  const [params, setParams] = useSearchParams();
  const requestedTab = params.get("tab");
  const tab: GovernmentTab =
    requestedTab === "records" ||
    requestedTab === "offices" ||
    requestedTab === "hotlines"
      ? requestedTab
      : "officials";
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.toLowerCase());
  const visibleOfficials = officials.filter((item) =>
    `${item.name} ${item.role}`.toLowerCase().includes(deferredQuery),
  );
  const visibleRecords = civicRecords.filter((record) =>
    `${record.kind} ${record.number} ${record.title} ${record.body}`
      .toLowerCase()
      .includes(deferredQuery),
  );
  const openOfficial = params.get("official");
  const officialId = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  const toggleOfficial = (name: string) => {
    const next = new URLSearchParams(params);
    next.set("tab", "officials");
    if (openOfficial === officialId(name)) next.delete("official");
    else next.set("official", officialId(name));
    setParams(next);
  };
  const visibleOffices = departments.filter(
    (item) =>
      (tab !== "hotlines" || item.emergency) &&
      `${item.name} ${item.email} ${item.phone}`
        .toLowerCase()
        .includes(deferredQuery),
  );
  return (
    <>
      <PageHero
        eyebrow="Government directory"
        title="Know who serves, and where to reach the right office."
        description="Search source-linked leadership profiles, office contacts, and separately identified emergency and assistance numbers."
        compact
      />
      <section className="section container government-directory-section">
        <div className="directory-toolbar">
          <label className="directory-search">
            <span className="sr-only">Search directory</span>
            <Search />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${tab}`}
            />
          </label>
          <div
            className="tabs"
            role="tablist"
            aria-label="Government directory views"
          >
            {(
              [
                ["officials", "Officials"],
                ["records", "Published measures"],
                ["offices", "Offices"],
                ["hotlines", "Hotlines"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                role="tab"
                aria-selected={tab === value}
                onClick={() => setParams({ tab: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {tab === "records" ? (
          <>
            <SectionHeading
              eyebrow="Ordinances, executive orders, and memoranda"
              title="Published measures by the responsible institution"
            >
              Ordinances are legislative acts of the Sangguniang Panlungsod.
              Executive orders are mayoral office issuances. A memorandum is
              assigned only when the source identifies its issuing authority.
            </SectionHeading>
            <div className="civic-records">
              {visibleRecords.map((record) => (
                <article key={record.number}>
                  <div className="record-meta">
                    <span>{record.kind}</span>
                    <span>{record.published}</span>
                    <span>{record.attributionLevel}</span>
                  </div>
                  <h2>{record.number}</h2>
                  <p>{record.title}</p>
                  <strong>{record.body}</strong>
                  <small>{record.attribution}</small>
                  <SourceNote
                    url={record.source.url}
                    date={record.source.verifiedOn}
                  />
                </article>
              ))}
            </div>
            <div className="records-subsection">
              <SectionHeading
                eyebrow="Projects and programs"
                title="Reported implementation status"
              >
                Progress and costs are reproduced from the 2025 Q1 consolidated
                trust-fund report. They are reporting-period values, not live
                completion claims or personal achievements.
              </SectionHeading>
              <div className="project-grid">
                {publicProjects.map((project) => (
                  <article key={project.title}>
                    <div className="project-progress">
                      <strong>{project.reportedProgress}</strong>
                      <span>reported progress</span>
                    </div>
                    <h2>{project.title}</h2>
                    <p>{project.location}</p>
                    <dl>
                      <div>
                        <dt>Total cost</dt>
                        <dd>
                          {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(project.totalCost)}
                        </dd>
                      </div>
                      <div>
                        <dt>Cost incurred</dt>
                        <dd>
                          {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(project.costIncurred)}
                        </dd>
                      </div>
                    </dl>
                    <small>
                      {project.status} · {project.period}
                    </small>
                    <SourceNote
                      url={project.source.url}
                      label="Official project report"
                      date={project.source.verifiedOn}
                    />
                  </article>
                ))}
              </div>
            </div>
            <div className="records-subsection">
              <SectionHeading
                eyebrow="Achievements and awards"
                title="Verified recognition, with the recipient scope preserved"
              >
                City-level recognition and institutional initiatives are not
                presented as personal awards for elected officials.
              </SectionHeading>
              <div className="highlight-grid">
                {governanceHighlights.map((item) => (
                  <article key={item.title}>
                    <Award />
                    <span>
                      {item.category} · {item.year}
                    </span>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    <SourceNote
                      url={item.source.url}
                      label={item.source.label}
                      date={item.source.verifiedOn}
                    />
                  </article>
                ))}
              </div>
            </div>
          </>
        ) : tab === "officials" ? (
          <>
            <div className="people-grid">
              {visibleOfficials.map((official, index) => {
                const id = officialId(official.name);
                const portrait = officialPortraits[official.name];
                const expanded = openOfficial === id;
                const startsGroup =
                  official.group !== visibleOfficials[index - 1]?.group;
                return (
                  <Fragment key={official.name}>
                  {startsGroup && (
                    <h2 className="official-group-heading">{official.group}</h2>
                  )}
                  <article
                    id={`official-${id}`}
                    className="is-interactive-card government-official-card"
                    role="button"
                    tabIndex={0}
                    aria-expanded={expanded}
                    aria-haspopup="dialog"
                    aria-label={`${official.name}, ${official.role} — open verified profile`}
                    onClick={() => toggleOfficial(official.name)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleOfficial(official.name);
                      }
                    }}
                  >
                    <div className="official-summary">
                      <div className="avatar">
                        {portrait ? (
                          <img
                            src={portrait.src}
                            alt={`${official.name}, ${official.role}`}
                            loading="lazy"
                            decoding="async"
                            style={{ objectPosition: portrait.position }}
                          />
                        ) : (
                          <span aria-hidden="true">
                            {official.name
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                        )}
                      </div>
                      <div className="official-card-copy">
                        <h3>{official.name}</h3>
                        <p className="official-role-title">{official.role}</p>
                        <small className="official-office-preview">
                          {official.office.phone}
                        </small>
                      </div>
                    </div>
                  </article>
                  </Fragment>
                );
              })}
            </div>
            {(() => {
              const selectedOfficial = officials.find(
                (item) => officialId(item.name) === openOfficial,
              );
              if (!selectedOfficial) return null;
              const portrait = officialPortraits[selectedOfficial.name];
              const officeRecords =
                selectedOfficial.role === "City Mayor"
                  ? civicRecords.filter(
                      (record) => record.attributionLevel === "office",
                    )
                  : [];
              const individualRecords = officialRecords.filter(
                (record) => record.officialName === selectedOfficial.name,
              );
              const attributionNote =
                selectedOfficial.group === "National legislative"
                  ? "Only bills and MOUs that name this district representative appear here."
                  : selectedOfficial.group === "Executive"
                    ? "Office-issued executive orders are listed separately from personally authored or signed records."
                    : selectedOfficial.group === "Sectoral"
                      ? "Sectoral officials are shown only when a public source names them as an author, sponsor, or signatory."
                      : "City ordinances are enacted by the Sangguniang Panlungsod as a body. This profile lists only measures that name this councilor as an author or sponsor; it does not treat a collective vote as an individual accomplishment.";
              const sharedContact =
                selectedOfficial.office.scope ===
                "Shared legislative-office routing";
              const closeModal = () => {
                const next = new URLSearchParams(params);
                next.delete("official");
                setParams(next);
              };
              return (
                <div
                  className="barangay-popout-backdrop government-popout-backdrop"
                  onClick={closeModal}
                >
                  <article
                    className="expanded barangay-popout-modal government-popout-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${selectedOfficial.name} verified profile details`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="barangay-popout-header">
                      <div className="barangay-popout-brand">
                        <div className="avatar is-modal-avatar">
                          {portrait ? (
                            <img
                              src={portrait.src}
                              alt=""
                              aria-hidden="true"
                              style={{ objectPosition: portrait.position }}
                            />
                          ) : (
                            <span aria-hidden="true">
                              {selectedOfficial.name
                                .split(" ")
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join("")}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="eyebrow">
                            {selectedOfficial.group} · Verified Leadership
                            Profile
                          </span>
                          <h3>
                            {selectedOfficial.name} — {selectedOfficial.role}
                          </h3>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="barangay-popout-close"
                        aria-label="Close official profile popup"
                        onClick={closeModal}
                      >
                        <X aria-hidden="true" />
                      </button>
                    </div>

                    <div className="barangay-popout-body">
                      {sharedContact && (
                        <p className="contact-scope-note">
                          <CircleAlert aria-hidden="true" />
                          Inquiries for this office are routed through the
                          shared Sangguniang Panlungsod legislative office
                          contact listed below.
                        </p>
                      )}

                      <div className="popout-table-wrap">
                        <table className="popout-structured-table">
                          <tbody>
                            <tr>
                              <th scope="row">Official Name & Role</th>
                              <td>
                                <strong>{selectedOfficial.name}</strong> ·{" "}
                                {selectedOfficial.role} (
                                {selectedOfficial.group})
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Assigned Office</th>
                              <td>
                                <strong>{selectedOfficial.office.name}</strong>
                                <span className="popout-scope-badge">
                                  {selectedOfficial.office.scope}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Office Address</th>
                              <td>{selectedOfficial.office.address}</td>
                            </tr>
                            <tr>
                              <th scope="row">Published Telephone</th>
                              <td>
                                <a
                                  className="popout-inline-contact"
                                  href={`tel:${telephoneHref(selectedOfficial.office.phone)}`}
                                >
                                  <Phone aria-hidden="true" />{" "}
                                  <span>{selectedOfficial.office.phone}</span>
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Published Email</th>
                              <td>
                                {selectedOfficial.office.email ? (
                                  <a
                                    className="popout-inline-contact"
                                    href={`mailto:${selectedOfficial.office.email}`}
                                  >
                                    <Mail aria-hidden="true" />{" "}
                                    <span>{selectedOfficial.office.email}</span>
                                  </a>
                                ) : (
                                  <span className="contact-unavailable">
                                    No direct email published
                                  </span>
                                )}
                              </td>
                            </tr>
                            {selectedOfficial.chairmanships?.length ? (
                              <tr>
                                <th scope="row">Committee Chairmanships</th>
                                <td>
                                  <ul className="popout-table-list">
                                    {selectedOfficial.chairmanships.map(
                                      (committee) => (
                                        <li key={committee}>{committee}</li>
                                      ),
                                    )}
                                  </ul>
                                </td>
                              </tr>
                            ) : null}
                            {selectedOfficial.committeeMemberships?.length ? (
                              <tr>
                                <th scope="row">Committee Memberships</th>
                                <td>
                                  <ul className="popout-table-list">
                                    {selectedOfficial.committeeMemberships.map(
                                      (committee) => (
                                        <li key={committee}>{committee}</li>
                                      ),
                                    )}
                                  </ul>
                                </td>
                              </tr>
                            ) : null}
                            <tr>
                              <th scope="row">Public record</th>
                              <td>
                                <div className="official-record-groups">
                                  <p className="official-record-intro">{attributionNote}</p>
                                  {individualRecords.length > 0 && (
                                    <section>
                                      <h4>Records naming this official · {individualRecords.length}</h4>
                                      <ul className="popout-measures-list">
                                        {individualRecords.map((record) => (
                                          <li key={`${record.number}-${record.kind}`}>
                                            <a href={record.source.url} target="_blank" rel="noreferrer">
                                              <span>
                                                <strong><span className="official-record-kind">{record.kind}</span>{record.number}</strong>
                                                <span>{record.title}</span>
                                                <small>{record.attribution} {record.status}</small>
                                                <small>{record.source.label} · Reported {record.date} · Reviewed {record.source.verifiedOn}</small>
                                              </span>
                                              <ExternalLink aria-hidden="true" />
                                            </a>
                                            {record.relatedSources?.length ? (
                                              <div className="official-record-related-sources">
                                                {record.relatedSources.map((source) => (
                                                  <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                                                    Also reported by {source.label} <ExternalLink aria-hidden="true" />
                                                  </a>
                                                ))}
                                              </div>
                                            ) : null}
                                          </li>
                                        ))}
                                      </ul>
                                    </section>
                                  )}
                                  {officeRecords.length > 0 && (
                                    <section>
                                      <h4>City Mayor’s Office issuances · {officeRecords.length}</h4>
                                      <ul className="popout-measures-list">
                                        {officeRecords.map((record) => (
                                          <li key={record.number}>
                                            <a href={record.source.url} target="_blank" rel="noreferrer">
                                              <span><strong><span className="official-record-kind">Executive order</span>{record.number}</strong><span>{record.title}</span><small>Issued by the Office of the City Mayor; shown as an office record.</small></span>
                                              <ExternalLink aria-hidden="true" />
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </section>
                                  )}
                                  {individualRecords.length === 0 && officeRecords.length === 0 && (
                                    <p className="popout-measures-note">No personal ordinance, resolution, bill, or MOA attribution was located for {selectedOfficial.name} in the sources reviewed. City-wide records are kept in the legislative archive instead of being repeated across profiles.</p>
                                  )}
                                  <div className="official-record-caveat">
                                    <strong>Attribution standard</strong>
                                    <p>BetterMC credits a person only when a cited source names them as author, sponsor, bill author, or signatory. An ordinance passing the council is a collective action; a listed MOA process is not proof of an individual’s signature.</p>
                                  </div>
                                  <Link className="popout-measures-more" to="/government?tab=records" onClick={closeModal}>
                                    <span>Browse city-published measures</span><ArrowRight aria-hidden="true" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Official Sources</th>
                              <td>
                                <div className="popout-table-links">
                                  <a
                                    href={selectedOfficial.source.url}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <span>
                                      Official profile (
                                      {selectedOfficial.source.label})
                                    </span>
                                    <ExternalLink aria-hidden="true" />
                                  </a>
                                  <a
                                    href={selectedOfficial.office.source.url}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <span>
                                      Published office contact (
                                      {selectedOfficial.office.source.label})
                                    </span>
                                    <ExternalLink aria-hidden="true" />
                                  </a>
                                </div>
                                <small className="popout-verified-date">
                                  Sources reviewed {VERIFIED_ON}
                                  {portrait ? ` · ${portrait.note}` : ""}
                                </small>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })()}
          </>
        ) : (
          <div className="directory-list">
            {visibleOffices.map((office) => (
              <article key={office.name}>
                <div className="office-symbol">
                  {office.emergency ? <ShieldAlert /> : <Building2 />}
                </div>
                <div>
                  <span>
                    {office.emergency
                      ? "Emergency / assistance contact"
                      : "City office"}
                  </span>
                  <h2>{office.name}</h2>
                </div>
                <div className="contact-actions">
                  <a href={`tel:${telephoneHref(office.phone)}`}>
                    <Phone />
                    {office.phone}
                  </a>
                  <a href={`mailto:${office.email}`}>
                    <Mail />
                    {office.email}
                  </a>
                </div>
                <SourceNote
                  url={office.source.url}
                  date={office.source.verifiedOn}
                />
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function BarangaysPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.toLowerCase());
  const visible = barangayMicrosites.filter((item) =>
    `${item.name} ${item.subdomainHost} ${item.punongBarangay} ${item.classification} ${item.officialRoster.officials.map((o) => o.name).join(" ")}`
      .toLowerCase()
      .includes(deferredQuery),
  );
  return (
    <>
      <PageHero
        eyebrow="Malaybalay barangay directory"
        title="Explore all 46 barangays."
        description="Search official population, DILG-verified barangay officials, public contacts, and full disclosure profiles."
        compact
      />
      <section className="section container government-directory-section">
        <label className="directory-search barangay-directory-search">
          <span className="sr-only">Search barangays</span>
          <Search />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by barangay or official name"
          />
        </label>
        <div className="data-notice barangay-contact-notice">
          <CircleAlert />
          <div>
            <strong>Verified public directory</strong>
            <p>
              Population counts follow the 2024 POPCEN (released 2026) and leadership records follow the DILG Barangay Officials Directory.
            </p>
          </div>
        </div>
        <div className="barangay-grid">
          {visible.map((barangay) => (
            <article key={barangay.name}>
              <div className="barangay-card-heading">
                <img
                  src={barangay.logo}
                  width="52"
                  height="52"
                  loading="lazy"
                  decoding="async"
                  alt={`${barangay.name} mark published by the City Government`}
                />
                <span className="barangay-card-context">
                  <strong>{barangay.classification} barangay</strong>
                  <small>PSGC {barangay.code}</small>
                </span>
              </div>
              <h2>{barangay.name}</h2>
              <div className="barangay-card-meta-lines">
                <p>
                  <span>Punong Barangay:</span>{" "}
                  <strong>{barangay.punongBarangay}</strong>
                </p>
                <p>
                  <span>Population:</span>{" "}
                  <strong>
                    {barangay.population.toLocaleString("en-PH")}
                  </strong>{" "}
                  <small>(2024 POPCEN)</small>
                </p>
              </div>
              <div className="barangay-contacts">
                {barangay.phone && (
                  <a href={`tel:${telephoneHref(barangay.phone)}`}>
                    <Phone />
                    {barangay.phone}
                  </a>
                )}
                {barangay.email && (
                  <a href={`mailto:${barangay.email}`}>
                    <Mail />
                    {barangay.email}
                  </a>
                )}
                {!barangay.phone && !barangay.email && (
                  <span>
                    <CircleAlert />
                    No public contact listed
                  </span>
                )}
              </div>
              <Link
                className="barangay-profile-link"
                to={`/barangays/${barangay.slug}`}
              >
                <span>Open profile</span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function BarangaySourceLink({
  source,
}: {
  source: BarangayMicrositeProfile["psgcSource"];
}) {
  return (
    <a href={source.url} target="_blank" rel="noreferrer">
      {source.label} <ExternalLink />
    </a>
  );
}

function BarangayServiceIcon({ title }: { title: string }) {
  const service = title.toLowerCase();

  if (service.includes("mediation")) return <Scale aria-hidden="true" />;
  if (service.includes("health")) return <HeartPulse aria-hidden="true" />;
  if (service.includes("social welfare")) return <HandHeart aria-hidden="true" />;
  if (service.includes("disaster")) return <ShieldAlert aria-hidden="true" />;
  if (service.includes("environment")) return <Leaf aria-hidden="true" />;
  return <FileCheck2 aria-hidden="true" />;
}

function BarangayMap({ profile }: { profile: BarangayMicrositeProfile }) {
  return <MalaybalayGisMap profile={profile} compactHeader />;
}

type BarangayPopoutState =
  | {
      kind: "snapshot";
      metric: "population" | "share" | "rank" | "bids";
    }
  | {
      kind: "official";
      official: BarangayOfficialRecord;
    }
  | {
      kind: "disclosure";
      item: BarangayDisclosureItem;
    }
  | {
      kind: "bid";
      bid: BidRecord;
    };

function formatPeso(amount: number | null) {
  if (amount === null) return "See PhilGEPS / Bid Abstract";
  return `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function BarangayProfilePage({ slugOverride }: { slugOverride?: string }) {
  const { slug: routeSlug } = useParams();
  const navigate = useNavigate();
  const profile = barangayMicrositeBySlug.get(slugOverride ?? routeSlug ?? "");
  const emergencyContacts = departments.filter((office) => office.emergency);
  const [disclosureState, setDisclosureState] = useState<{
    slug?: string;
    filter: "all" | BarangayDisclosureCategory;
    query: string;
    popout: BarangayPopoutState | null;
  }>({
    slug: profile?.slug,
    filter: "all",
    query: "",
    popout: null,
  });

  const currentSlug = profile?.slug;
  const disclosureFilter =
    disclosureState.slug === currentSlug ? disclosureState.filter : "all";
  const disclosureQuery =
    disclosureState.slug === currentSlug ? disclosureState.query : "";
  const activePopout =
    disclosureState.slug === currentSlug ? disclosureState.popout : null;

  const setDisclosureFilter = useCallback(
    (filter: "all" | BarangayDisclosureCategory) => {
      setDisclosureState((prev) => ({
        slug: currentSlug,
        filter,
        query: prev.slug === currentSlug ? prev.query : "",
        popout: prev.slug === currentSlug ? prev.popout : null,
      }));
    },
    [currentSlug],
  );

  const setDisclosureQuery = useCallback(
    (query: string) => {
      setDisclosureState((prev) => ({
        slug: currentSlug,
        filter: prev.slug === currentSlug ? prev.filter : "all",
        query,
        popout: prev.slug === currentSlug ? prev.popout : null,
      }));
    },
    [currentSlug],
  );

  const setActivePopout = useCallback(
    (popout: BarangayPopoutState | null) => {
      setDisclosureState((prev) => ({
        slug: currentSlug,
        filter: prev.slug === currentSlug ? prev.filter : "all",
        query: prev.slug === currentSlug ? prev.query : "",
        popout,
      }));
    },
    [currentSlug],
  );

  useEffect(() => {
    if (!activePopout) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePopout(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePopout, setActivePopout]);

  useEffect(() => {
    if (!profile) return;
    const previousTitle = document.title;
    document.title = `${profile.name} — BetterMC Barangay Profile`;
    return () => {
      document.title = previousTitle;
    };
  }, [profile]);

  if (!profile) return <NotFoundPage />;

  const roster = profile.officialRoster;
  const disclosure = profile.fullDisclosure;
  const normalizedDisclosureQuery = disclosureQuery.trim().toLowerCase();

  const categoryCounts = {
    all: disclosure.items.length,
    budget: disclosure.items.filter((item) => item.category === "budget").length,
    accomplishments: disclosure.items.filter(
      (item) => item.category === "accomplishments",
    ).length,
    bids: disclosure.items.filter((item) => item.category === "bids").length,
    projects: disclosure.items.filter((item) => item.category === "projects")
      .length,
  };

  const filteredDisclosureItems = disclosure.items.filter((item) => {
    if (disclosureFilter !== "all" && item.category !== disclosureFilter) {
      return false;
    }
    if (!normalizedDisclosureQuery) return true;
    return `${item.title} ${item.referenceNumber} ${item.subcategory} ${item.status} ${item.implementingOffice} ${item.summary}`
      .toLowerCase()
      .includes(normalizedDisclosureQuery);
  });

  return (
    <div className="barangay-site">
      <section className="barangay-hero">
        <div
          className={`barangay-hero-image${profile.heroImage ? " has-photo" : ""}`}
          style={
            profile.heroImage
              ? ({
                  "--barangay-hero-url": `url("${profile.heroImage.url}")`,
                  "--barangay-hero-position":
                    profile.heroImage.position ?? "center",
                } as CSSProperties)
              : undefined
          }
          aria-hidden="true"
        >
          <span className="barangay-hero-image-blur" />
          <span className="barangay-hero-image-sharp" />
        </div>
        <div className="container barangay-hero-content">
          <div className="barangay-brand-lockup">
            <div className="barangay-logo-frame">
              <img
                src={profile.logo}
                width="124"
                height="124"
                decoding="async"
                alt={`${profile.name} mark published by the City Government`}
              />
            </div>
            <div className="barangay-bettermc-mark">
              <img
                src="/bettermc1.png"
                alt=""
                aria-hidden="true"
                decoding="async"
              />
              <span>Powered by BetterMC</span>
            </div>
          </div>
          <div className="barangay-hero-copy">
            <div
              className="barangay-hero-inline-portal"
              role="region"
              aria-label={`${profile.name} embedded subdomain and main portal navigation`}
            >
              {slugOverride ? (
                <a
                  href={MAIN_BETTERMC_PORTAL.url}
                  className="barangay-main-portal-pill"
                >
                  <Landmark aria-hidden="true" />
                  <span><strong>BetterMC Home</strong></span>
                </a>
              ) : (
                <Link to="/" className="barangay-main-portal-pill">
                  <Landmark aria-hidden="true" />
                  <span><strong>BetterMC Home</strong></span>
                </Link>
              )}
              <span className="barangay-active-subdomain-pill" aria-label={`Current barangay site: ${profile.subdomainHost}`}>
                <Globe aria-hidden="true" />
                <strong>{profile.subdomainHost}</strong>
              </span>
              <label className="barangay-profile-picker">
                <MapPin aria-hidden="true" />
                <span className="sr-only">Choose a barangay profile</span>
                <select
                  id="barangay-domain-select"
                  aria-label="Choose a barangay profile"
                  value={profile.slug}
                  onChange={(event) => {
                    const nextSlug = event.target.value;
                    navigate(
                      slugOverride
                        ? `/?subdomain=${nextSlug}`
                        : `/barangays/${nextSlug}`,
                    );
                  }}
                >
                  {barangayMicrosites.map((b) => (
                    <option key={b.slug} value={b.slug}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown aria-hidden="true" />
              </label>
            </div>
            <span>Welcome to Barangay {profile.name}</span>
            <h1>{profile.name}</h1>
            <p>
              {profile.classification} barangay · Malaybalay City.{" "}
              {profile.description}
            </p>
            <div className="barangay-hero-actions">
              {profile.phone && (
                <a
                  className="button primary"
                  href={`tel:${telephoneHref(profile.phone)}`}
                >
                  <Phone /> Call barangay
                </a>
              )}
              <a className="button secondary" href="#disclosure">
                <FileText /> Full disclosure
              </a>
              <a className="button secondary" href="#emergency">
                <ShieldAlert /> Emergency
              </a>
            </div>
          </div>
          <dl className="barangay-facts">
            <div>
              <dt>Population</dt>
              <dd>
                {profile.population.toLocaleString("en-PH")}
                <small>2024 POPCEN · released 2026</small>
              </dd>
            </div>
            <div>
              <dt>PSGC code</dt>
              <dd>{profile.code}</dd>
            </div>
            <div>
              <dt>Punong Barangay</dt>
              <dd>{profile.punongBarangay}</dd>
            </div>
          </dl>
          {profile.heroImage?.source && profile.heroImage.credit && (
            <a
              className="barangay-photo-credit"
              href={profile.heroImage.source.url}
              target="_blank"
              rel="noreferrer"
            >
              {profile.heroImage.credit}
              <ExternalLink aria-hidden="true" />
            </a>
          )}
        </div>
      </section>

      <nav
        className="barangay-local-nav"
        aria-label={`${profile.name} page sections`}
      >
        <div className="container">
          <a href="#about">About</a>
          <a href="#disclosure">Full disclosure</a>
          <a href="#leadership">Leadership (10)</a>
          <a href="#projects">2026 BAC notices</a>
          <a href="#map">Map</a>
          <a href="#committees">Committees</a>
          <a href="#services">Services</a>
          <a href="#contacts">Contacts</a>
          <a href="#emergency">Emergency</a>
        </div>
      </nav>

      <div className="barangay-profile-main container">
        <section id="about" className="barangay-profile-section barangay-about">
          <div className="barangay-about-copy">
            <span className="eyebrow">About the barangay</span>
            <h2>Barangay overview</h2>
            <p>{profile.introduction}</p>
            <div className="barangay-population-note">
              <Clock3 aria-hidden="true" />
              <div>
                <strong>Latest official count available in 2026</strong>
                <p>
                  Reference date {POPULATION_REFERENCE_DATE}; released by PSA
                  on {POPULATION_RELEASE_DATE}.
                </p>
              </div>
            </div>
            <div
              className="barangay-community-snapshot"
              aria-label={`${profile.name} community data summary`}
            >
              <article
                className="is-interactive-card"
                role="button"
                tabIndex={0}
                onClick={() =>
                  setActivePopout({ kind: "snapshot", metric: "population" })
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActivePopout({ kind: "snapshot", metric: "population" });
                  }
                }}
              >
                <div className="barangay-snapshot-head">
                  <span className="barangay-icon-tile is-compact">
                    <Users aria-hidden="true" />
                  </span>
                  <span>Latest official count</span>
                </div>
                <strong>{profile.population.toLocaleString("en-PH")}</strong>
                <p>2024 POPCEN · released Jan 2026</p>
              </article>
              <article
                className="is-interactive-card"
                role="button"
                tabIndex={0}
                onClick={() =>
                  setActivePopout({ kind: "snapshot", metric: "share" })
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActivePopout({ kind: "snapshot", metric: "share" });
                  }
                }}
              >
                <div className="barangay-snapshot-head">
                  <span className="barangay-icon-tile is-compact">
                    <BarChart3 aria-hidden="true" />
                  </span>
                  <span>Share of city population</span>
                </div>
                <strong>{profile.cityPopulationShare.toFixed(2)}%</strong>
                <p>
                  Of {MALAYBALAY_2024_POPULATION.toLocaleString("en-PH")} city
                  total
                </p>
              </article>
              <article
                className="is-interactive-card"
                role="button"
                tabIndex={0}
                onClick={() =>
                  setActivePopout({ kind: "snapshot", metric: "rank" })
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActivePopout({ kind: "snapshot", metric: "rank" });
                  }
                }}
              >
                <div className="barangay-snapshot-head">
                  <span className="barangay-icon-tile is-compact">
                    <TrendingUp aria-hidden="true" />
                  </span>
                  <span>Population rank</span>
                </div>
                <strong>{profile.populationRank} of 46</strong>
                <p>Ranked across 46 barangays</p>
              </article>
              <article
                className="is-interactive-card"
                role="button"
                tabIndex={0}
                onClick={() =>
                  setActivePopout({ kind: "snapshot", metric: "bids" })
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActivePopout({ kind: "snapshot", metric: "bids" });
                  }
                }}
              >
                <div className="barangay-snapshot-head">
                  <span className="barangay-icon-tile is-compact">
                    <FileText aria-hidden="true" />
                  </span>
                  <span>2026 BAC notices</span>
                </div>
                <strong>{profile.bids.length}</strong>
                <p>ITB notices naming {profile.name}</p>
              </article>
            </div>
          </div>
          <aside className="barangay-source-card">
            <span className="barangay-icon-tile">
              <ShieldCheck aria-hidden="true" />
            </span>
            <strong>Where this information comes from</strong>
            <BarangaySourceLink source={profile.psgcSource} />
            <BarangaySourceLink source={profile.populationReleaseSource} />
            <BarangaySourceLink source={profile.leadershipSource} />
            <BarangaySourceLink source={profile.logoSource} />
            <small>
              Barangay sources reviewed through {BARANGAY_PROFILE_REVIEWED_ON}
            </small>
          </aside>
        </section>

        <section
          id="disclosure"
          className="barangay-profile-section barangay-disclosure-section"
        >
          <SectionHeading
            eyebrow="Barangay full disclosure & audit trail"
            title={`Budget, accomplishments, bids, and projects in ${profile.name}`}
          >
            Source-verified records compiled from DBM FY 2026 National Tax
            Allotment (LBM No. 92 / RA 7160 Sec. 285 & 287), the City
            Government Full Disclosure Portal (20% NTA, APP, Bid Results, Trust
            Fund, SEF, LDRRMF), BAC Malaybalay, PhilGEPS, DILG, and COA. Click
            any card to open the full discussion and citations.
          </SectionHeading>

          <div
            className="barangay-disclosure-summary-strip"
            aria-label={`${profile.name} full disclosure summary`}
          >
            <div>
              <span>Combined 2026 BDP allocation</span>
              <strong>{formatPeso(disclosure.bdp2026Budget)}</strong>
              <small>
                {formatPeso(disclosure.barangay20PctBdf2026)} Brgy 20% BDF (RA
                7160 Sec. 287) + ₱1.00M City 20% NTA ({disclosure.bdp2026Status})
              </small>
            </div>
            <div>
              <span>FY 2026 Statutory Barangay NTA</span>
              <strong>{formatPeso(disclosure.barangayNta2026)}</strong>
              <small>
                DBM LBM No. 92 ({profile.population.toLocaleString("en-PH")}{" "}
                pop.) · 10% SK: {formatPeso(disclosure.skFund2026)} · 5% BDRRMF:{" "}
                {formatPeso(disclosure.bdrrmf2026)}
              </small>
            </div>
            <div>
              <span>2025 Q4 BDP accomplishment</span>
              <strong>{disclosure.bdp2025CompletionRate}</strong>
              <small>
                {formatPeso(disclosure.bdp2025CostIncurred)} incurred ·{" "}
                {disclosure.bdp2025Remarks}
              </small>
            </div>
            <div>
              <span>PhilGEPS, BAC & audit citations</span>
              <strong>
                {disclosure.philgepsAwardsCount +
                  disclosure.officialBidResultsCount +
                  profile.bids.length}{" "}
                records
              </strong>
              <small>
                DBM · Full Disclosure · BAC Malaybalay · PhilGEPS · DILG · COA
              </small>
            </div>
          </div>

          <div className="barangay-disclosure-controls">
            <div
              className="barangay-disclosure-tabs"
              role="tablist"
              aria-label={`Filter ${profile.name} disclosure records by category`}
            >
              {(
                [
                  ["all", `All records (${categoryCounts.all})`],
                  ["budget", `Budget (${categoryCounts.budget})`],
                  [
                    "accomplishments",
                    `Accomplishments (${categoryCounts.accomplishments})`,
                  ],
                  ["bids", `Bids & awards (${categoryCounts.bids})`],
                  ["projects", `Projects (${categoryCounts.projects})`],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={disclosureFilter === key}
                  className={disclosureFilter === key ? "is-active" : ""}
                  onClick={() => setDisclosureFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="barangay-disclosure-search">
              <span className="sr-only">
                Search {profile.name} disclosure records
              </span>
              <Search aria-hidden="true" />
              <input
                value={disclosureQuery}
                onChange={(event) => setDisclosureQuery(event.target.value)}
                placeholder={`Filter ${profile.name} budget, accomplishments, bids, or contractors…`}
              />
            </label>
          </div>

          <div className="barangay-disclosure-grid">
            {filteredDisclosureItems.map((item) => (
              <article
                key={item.id}
                className="barangay-disclosure-card is-interactive-card"
                onClick={() => setActivePopout({ kind: "disclosure", item })}
              >
                <div className="barangay-disclosure-card-media">
                  <img
                    src={item.imageUrl}
                    alt={item.imageCaption}
                    loading="lazy"
                    decoding="async"
                  />
                  <img
                    className="barangay-disclosure-seal"
                    src={item.badgeUrl}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                  />
                  <span
                    className={`barangay-disclosure-badge is-${item.category}`}
                  >
                    {item.category === "budget"
                      ? "Budget & allocation"
                      : item.category === "accomplishments"
                        ? "Accomplishment & utilization"
                        : item.category === "bids"
                          ? "Bid & award record"
                          : "Project & program"}
                  </span>
                  <span className="barangay-disclosure-ref">
                    {item.referenceNumber}
                  </span>
                </div>
                <div className="barangay-disclosure-card-body">
                  <small className="barangay-disclosure-sub">
                    {item.subcategory} · {item.period}
                  </small>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <dl className="barangay-disclosure-metrics">
                    <div>
                      <dt>Approved budget / ABC</dt>
                      <dd>{formatPeso(item.approvedBudget)}</dd>
                    </div>
                    <div>
                      <dt>Utilized / Contract amount</dt>
                      <dd>{formatPeso(item.utilizedAmount)}</dd>
                    </div>
                    <div>
                      <dt>Reported progress / Stage</dt>
                      <dd>{item.completionRate}</dd>
                    </div>
                    <div>
                      <dt>Office / Contractor</dt>
                      <dd>{item.implementingOffice}</dd>
                    </div>
                  </dl>
                  <div
                    className="barangay-disclosure-citations"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <a
                      href={item.primarySource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="barangay-primary-citation"
                    >
                      <FileCheck2 aria-hidden="true" />
                      {item.primarySource.label}
                      <ExternalLink aria-hidden="true" />
                    </a>
                    <div className="barangay-backup-citations">
                      <span>Backup references:</span>
                      {item.backupSources.map((backup) => (
                        <a
                          key={`${item.id}-${backup.url}`}
                          href={backup.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {backup.label.split("—")[0].trim()}{" "}
                          <ExternalLink aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="barangay-disclosure-card-footer">
                    <button
                      type="button"
                      className="barangay-popout-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        setActivePopout({ kind: "disclosure", item });
                      }}
                    >
                      Open full details & discussion{" "}
                      <ArrowRight aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="map"
          className="barangay-profile-section barangay-map-section"
        >
          <SectionHeading
            eyebrow="Map"
            title={`${profile.name} boundary reference`}
          >
            The outline is for orientation only. Satellite imagery is available
            from the map control.
          </SectionHeading>
          <BarangayMap profile={profile} />
          <div className="barangay-map-disclaimer">
            <CircleAlert aria-hidden="true" />
            <p>
              Indicative PSA/NAMRIA-derived geometry · PSGC {profile.code} · not
              a legal survey.
            </p>
            <a
              href={profile.boundarySource.url}
              target="_blank"
              rel="noreferrer"
            >
              Review boundary provenance <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </section>

        <section id="projects" className="barangay-profile-section">
          <SectionHeading
            eyebrow="2026 procurement"
            title={`Published projects mentioning ${profile.name}`}
          >
            These are BAC notices linked to this barangay. A notice is not an
            award, expenditure, completion report, or personal achievement.
            Click any notice to inspect its procurement context or open the
            official BAC file.
          </SectionHeading>
          {profile.bids.length ? (
            <div className="barangay-bid-list">
              {profile.bids.slice(0, 6).map((record, index) => (
                <div
                  key={`${record.url}-${index}`}
                  className="barangay-bid-item-card"
                >
                  <a
                    href={record.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{record.stage}</span>
                    <strong>{record.number}</strong>
                    <p>{record.title.replace(/^ITB-2026-\d+\.?\s*/i, "")}</p>
                    <ExternalLink aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    className="barangay-bid-popout-btn"
                    onClick={() =>
                      setActivePopout({ kind: "bid", bid: record })
                    }
                  >
                    Popout discussion & backup links <ArrowRight aria-hidden="true" />
                  </button>
                </div>
              ))}
              {profile.bids.length > 6 && (
                <details>
                  <summary>Show {profile.bids.length - 6} more records</summary>
                  <div>
                    {profile.bids.slice(6).map((record, index) => (
                      <div
                        key={`${record.url}-more-${index}`}
                        className="barangay-bid-item-card"
                      >
                        <a
                          href={record.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>{record.stage}</span>
                          <strong>{record.number}</strong>
                          <p>{record.title.replace(/^ITB-2026-\d+\.?\s*/i, "")}</p>
                          <ExternalLink aria-hidden="true" />
                        </a>
                        <button
                          type="button"
                          className="barangay-bid-popout-btn"
                          onClick={() =>
                            setActivePopout({ kind: "bid", bid: record })
                          }
                        >
                          Popout discussion & backup links <ArrowRight aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          ) : (
            <div className="barangay-project-empty">
              <CircleAlert aria-hidden="true" />
              <p>
                No 2026 BAC notice on the reviewed source page explicitly
                matched this barangay. See the{" "}
                <a href="#disclosure">Full Disclosure section above</a> for{" "}
                {profile.name}’s {formatPeso(disclosure.bdp2026Budget)} combined
                2026 Barangay Development allocation (20% BDF + City 20% NTA
                Counterpart), 2025 Q4 accomplishments, and PhilGEPS records.
              </p>
              <a href={BAC_2026_SOURCE} target="_blank" rel="noreferrer">
                Check the official BAC page <ExternalLink aria-hidden="true" />
              </a>
            </div>
          )}
        </section>

        <section id="leadership" className="barangay-profile-section">
          <SectionHeading
            eyebrow="Current published leadership · DILG directory"
            title={`Who leads Barangay ${profile.name}`}
          >
            All 10 barangay officials below—the Punong Barangay, 7 Sangguniang
            Barangay Members (Kagawads), SK Chairperson, and Barangay
            Secretary—are verified from the DILG Barangay Officials Directory.
            Click any official card to open their full record, statutory role,
            and backup citations.
          </SectionHeading>

          <div className="barangay-leadership-executive-grid">
            {[
              roster.punongBarangay,
              roster.skChairperson,
              roster.barangaySecretary,
            ].map((official) => (
              <article
                key={official.id}
                className="barangay-executive-card is-interactive-card"
                role="button"
                tabIndex={0}
                onClick={() => setActivePopout({ kind: "official", official })}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActivePopout({ kind: "official", official });
                  }
                }}
              >
                <div className="barangay-executive-head">
                  <span className="barangay-icon-tile">
                    <Users aria-hidden="true" />
                  </span>
                  <div className="barangay-executive-role">
                    <span className="barangay-executive-badge">
                      {official.position}
                    </span>
                  </div>
                </div>
                <div className="barangay-executive-identity">
                  <h3>{official.name}</h3>
                </div>
                <div
                  className="barangay-official-contacts"
                  onClick={(event) => event.stopPropagation()}
                >
                  {official.phone ? (
                    <a href={`tel:${telephoneHref(official.phone)}`}>
                      <Phone aria-hidden="true" />
                      <span>{official.phone}</span>
                    </a>
                  ) : (
                    <span className="barangay-contact-muted">
                      No public phone listed
                    </span>
                  )}
                  {official.email && (
                    <a href={`mailto:${official.email}`}>
                      <Mail aria-hidden="true" />
                      <span>{official.email}</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="barangay-kagawad-section">
            <div className="barangay-kagawad-header">
              <h3>
                Sangguniang Barangay Members (7 Kagawads) — Barangay{" "}
                {profile.name}
              </h3>
            </div>
            <div className="barangay-kagawad-grid">
              {roster.sangguniangBarangayMembers.map((kagawad, idx) => (
                <article
                  key={kagawad.id}
                  className="barangay-kagawad-card is-interactive-card"
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    setActivePopout({ kind: "official", official: kagawad })
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActivePopout({ kind: "official", official: kagawad });
                    }
                  }}
                >
                  <div className="barangay-kagawad-top">
                    <span className="barangay-kagawad-badge">
                      Kagawad #{idx + 1}
                    </span>
                  </div>
                  <div className="barangay-kagawad-identity">
                    <h4>{kagawad.name}</h4>
                  </div>
                  <div
                    className="barangay-official-contacts"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {kagawad.phone ? (
                      <a href={`tel:${telephoneHref(kagawad.phone)}`}>
                        <Phone aria-hidden="true" />
                        <span>{kagawad.phone}</span>
                      </a>
                    ) : (
                      <span className="barangay-contact-muted">
                        No public phone listed
                      </span>
                    )}
                    {kagawad.email && (
                      <a href={`mailto:${kagawad.email}`}>
                        <Mail aria-hidden="true" />
                        <span>{kagawad.email}</span>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="committees" className="barangay-profile-section">
          <SectionHeading
            eyebrow="Committee transparency"
            title="Common committee areas"
          >
            While all 7 Sangguniang Barangay Members and the SK Chairperson are
            verified above from the DILG directory, the national directory table
            does not specify which Kagawad chairs each standing committee below.
          </SectionHeading>
          <div className="barangay-committee-grid">
            {profile.committeeAreas.map((committee) => (
              <article key={committee}>
                <span className="barangay-icon-tile is-compact">
                  <Check aria-hidden="true" />
                </span>
                <div>
                  <h3>{committee}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="barangay-profile-section">
          <SectionHeading
            eyebrow="Resident guide"
            title="Services to ask about at the barangay hall"
          >
            Availability, documents, fees, and schedules can vary. Confirm
            directly with the barangay before travelling.
          </SectionHeading>
          <div className="barangay-services-grid">
            {profile.serviceAreas.map((service) => (
              <article key={service.title}>
                <span className="barangay-icon-tile">
                  <BarangayServiceIcon title={service.title} />
                </span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="contacts"
          className="barangay-profile-section barangay-contact-section"
        >
          <div>
            <span className="eyebrow">Contact the barangay</span>
            <h2>Use the published public channels</h2>
            <p>
              These details are reproduced from the reviewed public directory.
              Personal or unverified numbers are not added.
            </p>
          </div>
          <div className="barangay-contact-card">
            <h3>{profile.name} barangay contact</h3>
            {profile.phone ? (
              <a href={`tel:${telephoneHref(profile.phone)}`}>
                <Phone />
                {profile.phone}
              </a>
            ) : (
              <span>
                <CircleAlert />
                No complete public phone listed
              </span>
            )}
            {profile.email ? (
              <a href={`mailto:${profile.email}`}>
                <Mail />
                {profile.email}
              </a>
            ) : (
              <span>
                <CircleAlert />
                No public email listed
              </span>
            )}
            <a
              href="https://www.facebook.com/profile.php?id=100063747444247"
              target="_blank"
              rel="noreferrer"
            >
              <FacebookIcon /> City Government official Facebook
            </a>
            <BarangaySourceLink source={profile.leadershipSource} />
          </div>
        </section>

        <section
          id="emergency"
          className="barangay-profile-section barangay-emergency-section"
        >
          <SectionHeading
            eyebrow="Citywide emergency contacts"
            title="Urgent help across Malaybalay"
          >
            Call the appropriate response office. For immediate danger, clearly
            state your barangay, landmark, and callback number.
          </SectionHeading>
          <div className="barangay-emergency-grid">
            {emergencyContacts.map((office) => (
              <article key={office.name}>
                <span className="barangay-icon-tile is-emergency">
                  <HeartPulse aria-hidden="true" />
                </span>
                <div>
                  <h3>{office.name}</h3>
                  <a href={`tel:${telephoneHref(office.phone)}`}>
                    {office.phone}
                  </a>
                  {office.email && (
                    <a href={`mailto:${office.email}`}>{office.email}</a>
                  )}
                </div>
              </article>
            ))}
          </div>
          <SourceNote
            url={emergencyContacts[0].source.url}
            label="Official City Government contact directory"
            date={VERIFIED_ON}
          />
        </section>
      </div>

      {activePopout && (
        <div
          className="barangay-popout-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${profile.name} detail and discussion popout`}
          onClick={() => setActivePopout(null)}
        >
          <div
            className="barangay-popout-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="barangay-popout-header">
              <div className="barangay-popout-brand">
                <img
                  src={profile.logo}
                  width="44"
                  height="44"
                  alt=""
                  aria-hidden="true"
                />
                <div>
                  <span className="eyebrow">
                    Barangay {profile.name} · PSGC {profile.code}
                  </span>
                  <h3>
                    {activePopout.kind === "disclosure"
                      ? activePopout.item.title
                      : activePopout.kind === "official"
                        ? `${activePopout.official.name} (${activePopout.official.position})`
                        : activePopout.kind === "bid"
                          ? `${activePopout.bid.number} — ${activePopout.bid.title.replace(/^ITB-2026-\d+\.?\s*/i, "")}`
                          : activePopout.metric === "population"
                            ? `Latest Official Population Count: ${profile.population.toLocaleString("en-PH")}`
                            : activePopout.metric === "share"
                              ? `Share of Malaybalay City Population: ${profile.cityPopulationShare.toFixed(2)}%`
                              : activePopout.metric === "rank"
                                ? `Barangay Population Rank: ${profile.populationRank} of 46`
                                : `2026 BAC Procurement Notices Naming ${profile.name}: ${profile.bids.length}`}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                className="barangay-popout-close"
                aria-label="Close popout details"
                onClick={() => setActivePopout(null)}
              >
                <X aria-hidden="true" />
              </button>
            </div>

            <div className="barangay-popout-body">
              {activePopout.kind === "disclosure" && (
                <>
                  <div className="barangay-popout-visual">
                    <img
                      src={activePopout.item.imageUrl}
                      alt={activePopout.item.imageCaption}
                    />
                    <span>{activePopout.item.imageCaption}</span>
                  </div>
                  <dl className="barangay-popout-grid">
                    <div>
                      <dt>Reference number</dt>
                      <dd>{activePopout.item.referenceNumber}</dd>
                    </div>
                    <div>
                      <dt>Disclosure category & period</dt>
                      <dd>
                        {activePopout.item.subcategory} ·{" "}
                        {activePopout.item.period}
                      </dd>
                    </div>
                    <div>
                      <dt>Approved budget / ABC</dt>
                      <dd>{formatPeso(activePopout.item.approvedBudget)}</dd>
                    </div>
                    <div>
                      <dt>Utilized / Contract amount</dt>
                      <dd>{formatPeso(activePopout.item.utilizedAmount)}</dd>
                    </div>
                    <div>
                      <dt>Completion rate / Duration</dt>
                      <dd>
                        {activePopout.item.completionRate} (
                        {activePopout.item.contractDuration})
                      </dd>
                    </div>
                    <div>
                      <dt>Implementing office / Contractor</dt>
                      <dd>{activePopout.item.implementingOffice}</dd>
                    </div>
                  </dl>
                  <div className="barangay-popout-discussion">
                    <h4>What this public record shows</h4>
                    <p>{activePopout.item.discussion.whatThisRecordShows}</p>
                    <h4>Budget, procurement & COA audit discussion</h4>
                    <p>{activePopout.item.discussion.budgetAndAuditContext}</p>
                    <h4>How to verify independently</h4>
                    <p>{activePopout.item.discussion.howToVerify}</p>
                  </div>
                  <div className="barangay-popout-sources">
                    <h4>Primary & backup references</h4>
                    <a
                      href={activePopout.item.primarySource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="barangay-popout-source-primary"
                    >
                      <FileCheck2 aria-hidden="true" />
                      <div>
                        <strong>
                          Primary source: {activePopout.item.primarySource.label}
                        </strong>
                        <small>
                          Verified on{" "}
                          {activePopout.item.primarySource.verifiedOn}
                        </small>
                      </div>
                      <ExternalLink aria-hidden="true" />
                    </a>
                    <div className="barangay-popout-backup-list">
                      {activePopout.item.backupSources.map((source) => (
                        <a
                          key={source.url}
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>Backup reference: {source.label}</span>
                          <ExternalLink aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activePopout.kind === "official" && (() => {
                const roleInfo = getOfficialRoleScope(
                  activePopout.official.position,
                  profile.name,
                );
                return (
                  <>
                    <dl className="barangay-popout-grid">
                      <div>
                        <dt>Official name</dt>
                        <dd>{activePopout.official.name}</dd>
                      </div>
                      <div>
                        <dt>DILG registry full name</dt>
                        <dd>{activePopout.official.fullRegistryName}</dd>
                      </div>
                      <div>
                        <dt>Position</dt>
                        <dd>{roleInfo.badge}</dd>
                      </div>
                      <div>
                        <dt>Barangay & DILG code</dt>
                        <dd>
                          Barangay {profile.name} (PSGC {profile.code} · DILG
                          Brgy Code {activePopout.official.dilgBarangayCode})
                        </dd>
                      </div>
                      <div>
                        <dt>Published telephone</dt>
                        <dd>
                          {activePopout.official.phone ? (
                            <a
                              href={`tel:${telephoneHref(activePopout.official.phone)}`}
                            >
                              {activePopout.official.phone}
                            </a>
                          ) : (
                            activePopout.official.phoneHygieneNote
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt>Published email</dt>
                        <dd>
                          {activePopout.official.email ? (
                            <a href={`mailto:${activePopout.official.email}`}>
                              {activePopout.official.email}
                            </a>
                          ) : (
                            "No individual email published in the DILG directory row"
                          )}
                        </dd>
                      </div>
                    </dl>
                    <div className="barangay-popout-discussion">
                      <h4>Statutory basis & role in Barangay {profile.name}</h4>
                      <p>
                        <strong>{roleInfo.statutoryBasis}:</strong>{" "}
                        {roleInfo.summary}
                      </p>
                      <h4>Editorial & governance context</h4>
                      <p>{roleInfo.governanceNote}</p>
                      <h4>Contact verification note</h4>
                      <p>{activePopout.official.phoneHygieneNote}</p>
                    </div>
                    <div className="barangay-popout-sources">
                      <h4>Primary & backup references</h4>
                      <a
                        href={DILG_DIRECTORY_INDEX_SOURCE.url}
                        target="_blank"
                        rel="noreferrer"
                        className="barangay-popout-source-primary"
                      >
                        <ShieldCheck aria-hidden="true" />
                        <div>
                          <strong>
                            Primary source: {DILG_DIRECTORY_INDEX_SOURCE.label}
                          </strong>
                          <small>
                            Verified on {DILG_DIRECTORY_INDEX_SOURCE.verifiedOn}
                          </small>
                        </div>
                        <ExternalLink aria-hidden="true" />
                      </a>
                      <div className="barangay-popout-backup-list">
                        <a
                          href={activePopout.official.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>
                            Backup reference: DILG BOPS Master Filter API —
                            Barangay {profile.name}
                          </span>
                          <ExternalLink aria-hidden="true" />
                        </a>
                        <a
                          href={CITY_BARANGAY_DIRECTORY_SOURCE.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>
                            Backup reference:{" "}
                            {CITY_BARANGAY_DIRECTORY_SOURCE.label}
                          </span>
                          <ExternalLink aria-hidden="true" />
                        </a>
                        {activePopout.official.position ===
                          "SK Chairperson" && (
                          <a
                            href={SK_FUNCTIONALITY_ORDINANCE_SOURCE.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span>
                              Related local measure:{" "}
                              {SK_FUNCTIONALITY_ORDINANCE_SOURCE.label}
                            </span>
                            <ExternalLink aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}

              {activePopout.kind === "bid" && (
                <>
                  <dl className="barangay-popout-grid">
                    <div>
                      <dt>ITB / Notice number</dt>
                      <dd>{activePopout.bid.number}</dd>
                    </div>
                    <div>
                      <dt>Procurement stage</dt>
                      <dd>{activePopout.bid.stage}</dd>
                    </div>
                    <div>
                      <dt>Matched barangay</dt>
                      <dd>Barangay {profile.name}</dd>
                    </div>
                    <div>
                      <dt>Review date</dt>
                      <dd>{BAC_2026_VERIFIED_ON}</dd>
                    </div>
                  </dl>
                  <div className="barangay-popout-discussion">
                    <h4>What this 2026 BAC notice means</h4>
                    <p>
                      This Invitation to Bid / Request for Quotation (
                      <strong>{activePopout.bid.number}</strong>) was published
                      by the City Government of Malaybalay Bids and Awards
                      Committee (BAC) for 2026 procurement and explicitly names
                      Barangay {profile.name}.
                    </p>
                    <h4>Why a bidding notice is distinct from an award</h4>
                    <p>
                      Under Republic Act No. 9184, an Invitation to Bid (ITB)
                      invites qualified contractors or suppliers to submit
                      sealed bids. To check whether this notice progressed to a
                      contract award or physical completion, compare it against
                      the 2026 Q1/Q2 Bid Results (FDP Form 10a) and 20% NTA
                      Utilization Reports in the Full Disclosure section above.
                    </p>
                  </div>
                  <div className="barangay-popout-sources">
                    <h4>Primary & backup references</h4>
                    <a
                      href={activePopout.bid.url}
                      target="_blank"
                      rel="noreferrer"
                      className="barangay-popout-source-primary"
                    >
                      <FileText aria-hidden="true" />
                      <div>
                        <strong>
                          Primary source: Official BAC Notice File (
                          {activePopout.bid.number})
                        </strong>
                        <small>Verified on {BAC_2026_VERIFIED_ON}</small>
                      </div>
                      <ExternalLink aria-hidden="true" />
                    </a>
                    <div className="barangay-popout-backup-list">
                      <a
                        href={BAC_2026_SOURCE}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>
                          Backup reference: BAC Malaybalay 2026 Bidding
                          Opportunities Index
                        </span>
                        <ExternalLink aria-hidden="true" />
                      </a>
                      <a
                        href="https://sakata.malaybalaycity.gov.ph/wp-content/uploads/2026/09/BID-RESULTS-ON-CIVIL-WORKS-GOOD-AND-SERVICES-AND-CONSULTING-SERVICES2026-Q2.pdf"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>
                          Backup reference: 2026 Q2 Official Bid Results (FDP
                          Form 10a)
                        </span>
                        <ExternalLink aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </>
              )}

              {activePopout.kind === "snapshot" && (
                <>
                  <dl className="barangay-popout-grid">
                    <div>
                      <dt>Latest official count</dt>
                      <dd>{profile.population.toLocaleString("en-PH")}</dd>
                    </div>
                    <div>
                      <dt>Share of city population</dt>
                      <dd>{profile.cityPopulationShare.toFixed(2)}%</dd>
                    </div>
                    <div>
                      <dt>Population rank</dt>
                      <dd>{profile.populationRank} of 46 barangays</dd>
                    </div>
                    <div>
                      <dt>2026 BAC notices</dt>
                      <dd>{profile.bids.length} indexed ITB notices</dd>
                    </div>
                  </dl>
                  <div className="barangay-popout-discussion">
                    <h4>Demographic & statistical provenance</h4>
                    <p>
                      {profile.introduction} {profile.populationSummary}
                    </p>
                    <h4>Classification & procurement note</h4>
                    <p>
                      {profile.classificationNote} Alongside the{" "}
                      {profile.bids.length} 2026 BAC notices naming{" "}
                      {profile.name}, BetterMC indexes{" "}
                      {disclosure.items.length} full disclosure records covering{" "}
                      {profile.name}’s {formatPeso(disclosure.bdp2026Budget)}{" "}
                      combined 2026 Barangay Development allocation (
                      {formatPeso(disclosure.barangay20PctBdf2026)} 20% BDF from{" "}
                      {formatPeso(disclosure.barangayNta2026)} FY 2026 NTA +
                      ₱1,000,000.00 City 20% NTA Counterpart), 2025 Q4
                      accomplishments ({disclosure.bdp2025CompletionRate}), and
                      PhilGEPS contract awards.
                    </p>
                  </div>
                  <div className="barangay-popout-sources">
                    <h4>Primary & backup references</h4>
                    <a
                      href={profile.populationReleaseSource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="barangay-popout-source-primary"
                    >
                      <BarChart3 aria-hidden="true" />
                      <div>
                        <strong>
                          Primary source:{" "}
                          {profile.populationReleaseSource.label}
                        </strong>
                        <small>
                          Reference date {POPULATION_REFERENCE_DATE} · Released{" "}
                          {POPULATION_RELEASE_DATE}
                        </small>
                      </div>
                      <ExternalLink aria-hidden="true" />
                    </a>
                    <div className="barangay-popout-backup-list">
                      <a
                        href={profile.psgcSource.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>
                          Backup reference: {profile.psgcSource.label}
                        </span>
                        <ExternalLink aria-hidden="true" />
                      </a>
                      <a
                        href={BAC_2026_SOURCE}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>
                          Backup reference: BAC Malaybalay 2026 Procurement
                          Index
                        </span>
                        <ExternalLink aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type ServiceSelectOption = {
  value: string;
  label: string;
  group?: string;
};

/**
 * Accessible single-select dropdown with grouped options and type-to-filter.
 * Replaces native <select> so long lists (46 barangays) stay compact, readable
 * and on-brand across desktop and mobile.
 */
function ServiceSelect({
  id,
  label,
  value,
  options,
  onChange,
  searchPlaceholder = "Search…",
  className = "",
}: {
  id: string;
  label: string;
  value: string;
  options: ServiceSelectOption[];
  onChange: (value: string) => void;
  searchPlaceholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = `${id}-listbox`;
  const searchable = options.length > 8;

  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) ||
        option.group?.toLowerCase().includes(needle),
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, [open]);

  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
  }, [open, searchable]);

  useEffect(() => {
    if (!open) return;
    document
      .getElementById(`${id}-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, id, open]);

  const openMenu = () => {
    setQuery("");
    setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
    setOpen(true);
  };

  const choose = (option: ServiceSelectOption) => {
    onChange(option.value);
    setOpen(false);
  };

  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openMenu();
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(filtered.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option) choose(option);
    }
  };

  return (
    <div
      className={`service-select ${className}`.trim()}
      ref={rootRef}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        id={id}
        className="service-select-trigger"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? setOpen(false) : openMenu())}
      >
        <span>{selected?.label ?? "Select"}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      {open && (
        <div className="service-select-menu">
          {searchable && (
            <input
              ref={searchRef}
              type="search"
              className="service-select-search"
              placeholder={searchPlaceholder}
              aria-label={`${label} search`}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
            />
          )}
          <ul id={listId} role="listbox" aria-label={label} className="service-select-list">
            {filtered.length === 0 && (
              <li className="service-select-empty" role="presentation">
                No matches
              </li>
            )}
            {filtered.map((option, index) => {
              const showGroup = option.group && option.group !== filtered[index - 1]?.group;
              return (
                <Fragment key={option.value}>
                  {showGroup && (
                    <li className="service-select-group" role="presentation">
                      {option.group}
                    </li>
                  )}
                  <li
                    id={`${id}-option-${index}`}
                    role="option"
                    aria-selected={option.value === value}
                    className={`service-select-option${index === activeIndex ? " is-active" : ""}${
                      option.value === value ? " is-selected" : ""
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => choose(option)}
                  >
                    <span>{option.label}</span>
                    {option.value === value && <Check aria-hidden="true" />}
                  </li>
                </Fragment>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function barangayOptions(): ServiceSelectOption[] {
  const toOption = (b: (typeof barangayMicrosites)[number], group: string) => ({
    value: b.slug,
    label: `Brgy. ${b.name}`,
    group,
  });
  return [
    { value: "city-center", label: "Malaybalay City Proper (Poblacion)" },
    ...barangayMicrosites.filter((b) => b.classification === "Urban").map((b) => toOption(b, "Urban barangays")),
    ...barangayMicrosites.filter((b) => b.classification === "Rural").map((b) => toOption(b, "Rural barangays")),
  ];
}

function BarangayOriginSelect({
  selectedSlug,
  onChange,
  onDetectLocation,
  isDetecting,
}: {
  selectedSlug: string;
  onChange: (slug: string) => void;
  onDetectLocation?: () => void;
  isDetecting?: boolean;
}) {
  return (
    <div className="service-origin-bar" aria-label="Select your location for nearest service providers">
      <div className="service-origin-info">
        <span className="service-origin-icon" aria-hidden="true">
          <MapPin />
        </span>
        <div>
          <span className="eyebrow">Your Location in Malaybalay City</span>
          <strong>Nearest providers calculated from your barangay</strong>
        </div>
      </div>
      <div className="service-origin-controls">
        <ServiceSelect
          id="service-origin-select"
          className="service-origin-select-wrap"
          label="Select Barangay origin"
          value={selectedSlug}
          options={barangayOptions()}
          onChange={onChange}
          searchPlaceholder="Search barangay…"
        />
        {onDetectLocation && (
          <button
            type="button"
            className="button secondary service-gps-btn"
            onClick={onDetectLocation}
            disabled={isDetecting}
            title="Detect nearest barangay via device GPS"
          >
            <Navigation aria-hidden="true" />
            <span>{isDetecting ? "Locating…" : "Use GPS"}</span>
          </button>
        )}
      </div>
    </div>
  );
}

function TransactionModal({
  provider,
  transaction,
  categoryTitle,
  categorySlug,
  userOriginLabel,
  onClose,
}: {
  provider: ServiceProvider;
  transaction: ServiceTransactionOption;
  categoryTitle: string;
  categorySlug: string;
  userOriginLabel: string;
  onClose: () => void;
}) {
  const [checkedReqs, setCheckedReqs] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const txRef = useMemo(
    () => generateTransactionReference(categorySlug, provider.id, transaction.id),
    [categorySlug, provider.id, transaction.id],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const toggleReq = (req: string) => {
    setCheckedReqs((prev) => ({ ...prev, [req]: !prev[req] }));
  };

  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(txRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // fallback
    }
  };

  const completedCount = transaction.requirements.filter((r) => checkedReqs[r]).length;
  const totalCount = transaction.requirements.length;
  const isAllReady = totalCount > 0 && completedCount === totalCount;
  const sanitizedActionUrl = sanitizeExternalServiceUrl(transaction.actionUrl);

  return (
    <div
      className="barangay-popout-backdrop service-tx-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`${transaction.title} Transaction Guide & Checklist`}
      onClick={onClose}
    >
      <div
        className="barangay-popout-modal service-tx-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="barangay-popout-header">
          <div className="barangay-popout-brand">
            <span className="barangay-icon-tile">
              <ServiceCategoryIcon slug={categorySlug} />
            </span>
            <div>
              <span className="eyebrow">
                {categoryTitle} · {provider.jurisdiction}
              </span>
              <h3>{transaction.title}</h3>
            </div>
          </div>
          <button
            type="button"
            className="barangay-popout-close"
            aria-label="Close transaction guide"
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="barangay-popout-body service-tx-body">
          {/* Reference & Quick Facts Banner */}
          <div className="service-tx-ref-card">
            <div className="service-tx-ref-main">
              <span className="service-tx-ref-label">Official Tracking Reference:</span>
              <code className="service-tx-ref-code">{txRef}</code>
              <button
                type="button"
                className="button secondary service-copy-btn"
                onClick={handleCopyRef}
                title="Copy reference code to clipboard"
              >
                {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>
            <div className="service-tx-badges">
              <span className="service-stat-badge">
                <Clock3 aria-hidden="true" />
                <strong>Processing:</strong> {transaction.processingTime}
              </span>
              <span className="service-stat-badge">
                <ReceiptText aria-hidden="true" />
                <strong>Fees:</strong> {transaction.feeSchedule}
              </span>
              <span className="service-stat-badge is-origin">
                <MapPin aria-hidden="true" />
                <strong>For:</strong> {userOriginLabel}
              </span>
            </div>
          </div>

          {/* Provider Destination Info */}
          <div className="service-tx-facility-summary">
            <strong>Responsible Provider & Cashier:</strong>
            <p>
              {provider.name} · {provider.address} ({provider.hours})
            </p>
            <small>Accepted E-Payment Channels: {provider.epaymentChannel}</small>
          </div>

          {/* Interactive Requirements Checklist */}
          <section className="service-tx-section" aria-label="Requirements checklist">
            <div className="service-tx-section-head">
              <h4>
                <FileCheck2 aria-hidden="true" />
                Documentary Requirements Checklist
              </h4>
              <span className={`service-readiness-pill${isAllReady ? " is-ready" : ""}`}>
                {isAllReady ? (
                  <>
                    <Check aria-hidden="true" />
                    <span>{completedCount} of {totalCount} ready — Ready to file!</span>
                  </>
                ) : (
                  <span>{completedCount} of {totalCount} ready</span>
                )}
              </span>
            </div>
            <p className="service-tx-subtitle">
              Check off each document as you prepare them before visiting the counter or filing online.
            </p>
            <div className="service-req-checklist">
              {transaction.requirements.map((req, idx) => {
                const checked = Boolean(checkedReqs[req]);
                return (
                  <label
                    key={`req-${idx}`}
                    className={`service-req-item${checked ? " is-checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleReq(req)}
                    />
                    <span className="service-req-text">{req}</span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Step-by-Step Procedure Guide */}
          <section className="service-tx-section" aria-label="Step-by-step procedures">
            <div className="service-tx-section-head">
              <h4>
                <Landmark aria-hidden="true" />
                Step-by-Step Transaction Walkthrough
              </h4>
            </div>
            <ol className="service-steps-list">
              {transaction.steps.map((step, idx) => (
                <li key={`step-${idx}`}>
                  <span className="service-step-number">{idx + 1}</span>
                  <div className="service-step-content">
                    <p>{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Actions Bar */}
          <div className="noah-popout-actions service-tx-actions">
            <a
              className="button primary"
              href={sanitizedActionUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{transaction.actionLabel}</span>
              <ExternalLink aria-hidden="true" />
            </a>
            <button
              type="button"
              className="button secondary"
              onClick={() => window.print()}
              title="Print checklist and transaction slip"
            >
              <Printer aria-hidden="true" />
              <span>Print Checklist</span>
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceProviderCard({
  provider,
  onStartTransaction,
}: {
  provider: RankedServiceProvider;
  onStartTransaction: (tx: ServiceTransactionOption) => void;
}) {
  const sanitizedPortalUrl = sanitizeExternalServiceUrl(provider.onlinePortalUrl);

  return (
    <article className={`provider-card${provider.isNearest ? " is-nearest-card" : ""}`}>
      <header className="provider-card-head">
        <div className="provider-card-meta">
          {provider.isNearest && (
            <span className="provider-nearest-badge">Nearest Provider</span>
          )}
          <span className="provider-distance-badge">
            {provider.distanceKm} km · ~{provider.estimatedDriveMinutes} min
          </span>
          <span className="provider-jurisdiction-badge">{provider.jurisdiction}</span>
        </div>
        <h3>{provider.name}</h3>
        <p className="provider-address">{provider.address}</p>
      </header>

      <dl className="provider-facts">
        <div>
          <dt>Hours</dt>
          <dd>{provider.hours}</dd>
        </div>
        {provider.phone && (
          <div>
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${telephoneHref(provider.phone)}`}>{provider.phone}</a>
            </dd>
          </div>
        )}
        {provider.email && (
          <div>
            <dt>Email</dt>
            <dd>
              <a
                className="provider-email-link"
                href={`mailto:${provider.email}`}
                title={provider.email}
              >
                {provider.email}
              </a>
            </dd>
          </div>
        )}
        <div className="provider-facts-wide">
          <dt>Payment</dt>
          <dd>{provider.epaymentChannel}</dd>
        </div>
      </dl>

      <section className="provider-transactions-section" aria-label="Official transactions">
        <h4 className="provider-tx-heading">
          Transactions <span>{provider.transactions.length}</span>
        </h4>
        <ul className="provider-transactions-list">
          {provider.transactions.map((tx) => {
            const isFree =
              tx.feeSchedule.toLowerCase().includes("free") ||
              tx.feeSchedule.includes("₱0.00") ||
              tx.feeSchedule.includes("P0.00");

            return (
              <li key={tx.id} className="provider-tx-row">
                <div className="provider-tx-info">
                  <strong className="provider-tx-title">{tx.title}</strong>
                  <p className="provider-tx-detail">
                    <span>{tx.processingTime}</span>
                    <span className={isFree ? "is-free" : undefined}>{tx.feeSchedule}</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="provider-tx-btn"
                  onClick={() => onStartTransaction(tx)}
                  aria-label={`Make Transaction & Checklist: ${tx.title}`}
                >
                  <span>Start</span>
                  <ArrowRight aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="provider-card-footer">
        <a
          className="provider-link"
          href={provider.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`View ${provider.name} on Google Maps`}
        >
          View on Google Maps
        </a>
        <a
          className="provider-portal-btn"
          href={sanitizedPortalUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{provider.onlinePortalLabel}</span>
          <ExternalLink aria-hidden="true" />
        </a>
      </footer>
    </article>
  );
}

function ServicesQuickFinder() {
  const [selectedCategory, setSelectedCategory] = useState("certificates-ids");
  const [selectedBarangay, setSelectedBarangay] = useState("city-center");

  const originInfo = getBarangayOriginCoordinates(selectedBarangay);
  const ranked = getProvidersForCategory(selectedCategory, originInfo.coords, selectedBarangay);
  const topProvider = ranked[0];

  return (
    <section className="services-quick-finder-card" aria-label="Quick nearest service finder">
      <div className="quick-finder-header">
        <span className="service-category-icon">
          <Navigation aria-hidden="true" />
        </span>
        <div>
          <span className="eyebrow">Direct to Nearest Provider</span>
          <h2>Find the closest facility & start your transaction</h2>
          <p>
            Choose a service and barangay to compare listed providers, review published transaction details, and open the provider’s map listing.
          </p>
        </div>
      </div>
      <div className="quick-finder-controls">
        <div className="quick-finder-field">
          <span id="qf-category-label">I need a service in</span>
          <ServiceSelect
            id="qf-category"
            label="Service category"
            value={selectedCategory}
            options={serviceCategories.map((c) => ({ value: c.slug, label: c.title }))}
            onChange={setSelectedCategory}
          />
        </div>
        <div className="quick-finder-field">
          <span id="qf-barangay-label">My location</span>
          <ServiceSelect
            id="qf-barangay"
            label="My location or barangay"
            value={selectedBarangay}
            options={barangayOptions()}
            onChange={setSelectedBarangay}
            searchPlaceholder="Search barangay…"
          />
        </div>
      </div>
      {topProvider && (
        <div className="quick-finder-result">
          <div className="quick-finder-result-info">
            <span className="provider-nearest-badge">
              Nearest Match
            </span>
            <h3>{topProvider.name}</h3>
            <p className="quick-finder-address">
              <MapPin aria-hidden="true" />
              <span>{topProvider.address} · {topProvider.hours}</span>
            </p>
            <div className="quick-finder-meta">
              <span className="quick-finder-meta-pill">
                <MapPin aria-hidden="true" />
                <span>{topProvider.distanceKm} km away (~{topProvider.estimatedDriveMinutes} mins drive)</span>
              </span>
              <span className="quick-finder-meta-pill">
                <FileCheck2 aria-hidden="true" />
                <span>{topProvider.transactions.length} verified transactions available</span>
              </span>
            </div>
          </div>
          <div className="quick-finder-result-actions">
            <Link className="button primary quick-finder-primary-btn" to={`/services/${selectedCategory}?origin=${selectedBarangay}`}>
              <span>Open Provider & Transactions</span>
              <ArrowRight aria-hidden="true" />
            </Link>
            <a
              className="button secondary quick-finder-secondary-btn"
              href={topProvider.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>View on Google Maps</span>
              <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

function ServicesPage() {
  const [allBodiesVisible, setAllBodiesVisible] = useState(false);
  return (
    <>
      <PageHero
        eyebrow="Public services & transactions"
        title="Start with the official service standard."
        description="Connect directly to nearest service providers across Malaybalay City, complete requirements checklists, and start official online/in-person transactions under the Citizen's Charter and ARTA RA 11032."
      />
      <section className="section container">
        {/* Quick Nearest Provider & Transaction Locator */}
        <ServicesQuickFinder />

        <div className="service-context-strip">
          <p>
            <strong>City context</strong>
            <span>195,046 residents · 46 barangays</span>
            <small>2024 POPCEN, released by PSA in 2026</small>
          </p>
          <a
            href="https://rsso10.psa.gov.ph/content/highlights-population-counts-malaybalay-city-bukidnon-based-2024-census-population"
            target="_blank"
            rel="noreferrer"
          >
            Population source <ExternalLink aria-hidden="true" />
          </a>
          <a
            href="https://sakata.malaybalaycity.gov.ph/citizens-charter/"
            target="_blank"
            rel="noreferrer"
          >
            Citizen’s Charter <ExternalLink aria-hidden="true" />
          </a>
        </div>
        <div className="service-resource-section service-local-section">
          <SectionHeading
            eyebrow="Malaybalay City services"
            title="Local starting points"
          >
            These pathways identify the responsible city office or official
            city resource. BetterMC does not accept applications or payments.
          </SectionHeading>
          <div className="local-service-grid">
            {localServicePathways.map((service) => (
              <article key={service.title}>
                <span className="service-category-icon">
                  <LocalServiceIcon title={service.title} />
                </span>
                <div className="local-service-copy">
                  <small>{service.office}</small>
                  <h3>{service.title}</h3>
                </div>
                <p>{service.description}</p>
                {service.external ? (
                  <a href={service.href} target="_blank" rel="noreferrer">
                    Open city resource <ExternalLink />
                  </a>
                ) : (
                  <Link to={service.href}>
                    Open directory <ArrowRight />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
        <div className="service-resource-section national-service-section">
          <SectionHeading
            eyebrow="National government services & nearest providers"
            title="BetterGov categories for Malaybalay residents"
          >
            Select any category below to locate the nearest service provider in Malaybalay City, review required documentary checklists, and start official online/counter transactions.
          </SectionHeading>
          <ServiceCategoryGrid compact />
          <a
            className="section-source-link"
            href="https://bettergov.ph/services"
            target="_blank"
            rel="noreferrer"
          >
            View all services on BetterGov <ExternalLink />
          </a>
        </div>
        <SectionHeading
          eyebrow="Service standards and forms"
          title="Official resources, ready to open"
        >
          Each item opens the City Government source or the document published
          by that source. BetterMC does not receive or process applications.
        </SectionHeading>
        <div className="service-grid">
          {services.map((service) => (
            <article key={service.title}>
              <BookOpen />
              <span>{service.office}</span>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <a
                className="button secondary"
                href={service.url}
                target="_blank"
                rel="noreferrer"
              >
                Open official resource <ExternalLink />
              </a>
              <small>Source checked {service.verifiedOn}</small>
            </article>
          ))}
        </div>
        <div className="service-resource-section">
          <SectionHeading
            eyebrow="Gender and Development"
            title="Plans, reports, and local protective codes"
          >
            Direct files are reproduced from the official GAD Corner. The
            source currently serves some downloads from its staging file host.
          </SectionHeading>
          <div className="document-link-grid">
            {gadResources.map((resource) => (
              <a key={resource.title} href={resource.url} target="_blank" rel="noreferrer">
                <FileCheck2 />
                <span>{resource.kind}</span>
                <strong>{resource.title}</strong>
                <small>PDF · checked {resource.verifiedOn}</small>
                <ExternalLink />
              </a>
            ))}
          </div>
          <a className="section-source-link" href="https://sakata.malaybalaycity.gov.ph/gad-corner/" target="_blank" rel="noreferrer">
            Open the complete official GAD Corner <ExternalLink />
          </a>
        </div>
        <div className="service-resource-section">
          <SectionHeading
            eyebrow="Local special bodies"
            title="Boards and committees with source-listed constituting orders"
          >
            This is a selected index of readable orders on the official catalog,
            not a claim that every local body or later amendment is represented.
          </SectionHeading>
          <div className={`special-body-grid${allBodiesVisible ? " show-all" : ""}`}>
            {specialBodyOrders.map((body) => (
              <a key={`${body.number}-${body.title}`} href={body.url} target="_blank" rel="noreferrer">
                <span>{body.number}</span>
                <strong>{body.title}</strong>
                <ExternalLink />
              </a>
            ))}
          </div>
          <div className="collection-actions">
            <button
              className="button secondary mobile-resource-toggle"
              type="button"
              aria-expanded={allBodiesVisible}
              onClick={() => setAllBodiesVisible((visible) => !visible)}
            >
              {allBodiesVisible ? "Show fewer bodies" : "Show all bodies"}
              <ChevronDown />
            </button>
            <a className="section-source-link" href="https://sakata.malaybalaycity.gov.ph/local-special-bodies-and-special-committees/" target="_blank" rel="noreferrer">
              Open the official catalog <ExternalLink />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

const safeGetLocalStorage = (key: string): string | null => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // fallback
  }
  return null;
};

const safeSetLocalStorage = (key: string, value: string): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // fallback
  }
};

function ServiceCategoryPage() {
  const { category: categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = serviceCategories.find(
    (item) => item.slug === categorySlug,
  );

  const [selectedBarangay, setSelectedBarangay] = useState<string>(() => {
    return (
      searchParams.get("origin") ||
      safeGetLocalStorage("bettermc_origin_barangay") ||
      "city-center"
    );
  });
  const [isDetecting, setIsDetecting] = useState(false);
  const [activeTx, setActiveTx] = useState<{
    provider: ServiceProvider;
    transaction: ServiceTransactionOption;
  } | null>(null);

  const handleBarangayChange = (slug: string) => {
    setSelectedBarangay(slug);
    safeSetLocalStorage("bettermc_origin_barangay", slug);
    const next = new URLSearchParams(searchParams);
    if (slug === "city-center") next.delete("origin");
    else next.set("origin", slug);
    setSearchParams(next, { replace: true });
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetecting(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let closestSlug = "city-center";
        let closestDist = Infinity;
        for (const [code, [cLng, cLat]] of Object.entries(MALAYBALAY_CENTROIDS)) {
          const d = Math.hypot(lat - cLat, lng - cLng);
          if (d < closestDist) {
            closestDist = d;
            const b = barangayMicrosites.find((item) => item.code === code);
            if (b) closestSlug = b.slug;
          }
        }
        handleBarangayChange(closestSlug);
      },
      () => {
        setIsDetecting(false);
        alert("Could not retrieve GPS location. You can select your barangay manually from the list.");
      },
      { timeout: 8000 },
    );
  };

  if (!category) return <NotFoundPage />;

  const originInfo = getBarangayOriginCoordinates(selectedBarangay);
  const rankedProviders = getProvidersForCategory(category.slug, originInfo.coords, selectedBarangay);

  return (
    <>
      <PageHero
        eyebrow="Government service guide & fast transactions"
        title={category.title}
        description={category.localContext}
        compact
      />
      <section className="section container service-category-page">
        {/* Origin Selector */}
        <BarangayOriginSelect
          selectedSlug={selectedBarangay}
          onChange={handleBarangayChange}
          onDetectLocation={handleDetectLocation}
          isDetecting={isDetecting}
        />

        <div className="service-category-layout">
          <div className="service-category-main-content">
            {/* Nearest Providers & Direct Transactions */}
            <SectionHeading
              eyebrow="Nearest service providers"
              title={`Where to transact in Malaybalay for ${category.title.toLowerCase()}`}
            >
              Listed providers serving {originInfo.label}, ordered by approximate distance from barangay coordinates. Travel times are estimates; confirm the route and current requirements with the provider. Open a transaction for its checklist and published steps.
            </SectionHeading>

            <div className="service-providers-list">
              {rankedProviders.map((provider) => (
                <ServiceProviderCard
                  key={provider.id}
                  provider={provider}
                  onStartTransaction={(transaction) => setActiveTx({ provider, transaction })}
                />
              ))}
            </div>

            {/* National service paths via BetterGov */}
            <div className="service-subcategories-section">
              <SectionHeading
                eyebrow="National service paths"
                title={`Browse ${category.title.toLowerCase()} services`}
              >
                BetterGov organizes these national pathways. Each link opens the matching directory results and the responsible agency’s service entry where available.
              </SectionHeading>
              <div className="service-subcategory-list">
                {category.subcategories.map((subcategory) => (
                  <a
                    key={subcategory.slug}
                    href={betterGovServiceUrl(category.slug, subcategory.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="service-category-icon">
                      <ServiceCategoryIcon slug={category.slug} />
                    </span>
                    <span>
                      <strong>{subcategory.title}</strong>
                      <small>BetterGov national service directory</small>
                    </span>
                    <ExternalLink aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <aside className="service-responsibility-note">
            <ShieldCheck aria-hidden="true" />
            <h2>Check who owns the transaction</h2>
            <p>
              City services, barangay services, and national government
              services have different requirements and offices. Confirm the
              responsible institution before submitting documents or making a
              payment.
            </p>
            <Link to="/services">
              Return to all service categories <ArrowRight />
            </Link>
            <Link to="/government?tab=offices">
              Find a Malaybalay office <ArrowRight />
            </Link>
          </aside>
        </div>

        <div className="service-access-bar">
          <span className="service-category-icon is-emergency">
            <ShieldAlert aria-hidden="true" />
          </span>
          <div>
            <strong>Emergency contacts remain local and immediately accessible.</strong>
            <p>Open the Malaybalay hotline directory for tap-to-call numbers.</p>
          </div>
          <Link to="/government?tab=hotlines">
            Open emergency contacts <ArrowRight />
          </Link>
        </div>
      </section>

      {/* Interactive Transaction Modal */}
      {activeTx && (
        <TransactionModal
          provider={activeTx.provider}
          transaction={activeTx.transaction}
          categorySlug={category.slug}
          categoryTitle={category.title}
          userOriginLabel={originInfo.label}
          onClose={() => setActiveTx(null)}
        />
      )}
    </>
  );
}

function RequestTypeSelect({
  value,
  onChange,
}: {
  value: RequestType;
  onChange: (value: RequestType) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();
  const selectedIndex = requestTypeOptions.findIndex(
    (option) => option.value === value,
  );

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.requestAnimationFrame(() => optionRefs.current[selectedIndex]?.focus());
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open, selectedIndex]);

  const moveFocus = (index: number) => {
    const normalized =
      (index + requestTypeOptions.length) % requestTypeOptions.length;
    optionRefs.current[normalized]?.focus();
  };
  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
    }
  };
  const handleOptionKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveFocus(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveFocus(requestTypeOptions.length - 1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div className="request-select" ref={rootRef}>
      <input type="hidden" name="category" value={value} />
      <button
        ref={triggerRef}
        className="request-select-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={`Request type: ${requestTypeOptions[selectedIndex].label}`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
      >
        {requestTypeOptions[selectedIndex].label}
        <ChevronDown aria-hidden="true" />
      </button>
      {open && (
        <div className="request-select-menu" id={listboxId} role="listbox">
          {requestTypeOptions.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
                triggerRef.current?.focus();
              }}
            >
              <span>{option.label}</span>
              {option.value === value && <Check aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type FeedbackState = "idle" | "submitting" | "success" | "error";
function ParticipatePage() {
  const [requestType, setRequestType] = useState<RequestType>("correction");
  const [state, setState] = useState<FeedbackState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim();
  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget ?? formRef.current;
    setErrors({});
    setServerMessage("");
    if (!formElement) return;
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    const parsed = feedbackSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [
            String(issue.path[0]),
            issue.message,
          ]),
        ),
      );
      setState("error");
      setServerMessage(
        parsed.error.issues[0]?.message ||
          "Please review the form fields and try again.",
      );
      return;
    }
    setState("submitting");
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok)
        throw new Error(result.message ?? "The submission could not be saved.");
      setState("success");
      setServerMessage(result.message ?? "Your submission was received.");
      setRequestType("correction");
      setTurnstileResetKey((current) => current + 1);

      try {
        formElement?.reset?.();
      } catch {
        (formElement ?? formRef.current)
          ?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
            "input, textarea",
          )
          ?.forEach((field) => {
            if (
              field.type !== "hidden" &&
              field.type !== "submit" &&
              field.type !== "button"
            ) {
              field.value = "";
            }
          });
      }
    } catch (error) {
      setState("error");
      setServerMessage(
        error instanceof Error
          ? error.message
          : "The submission could not be saved.",
      );
    }
  }
  return (
    <>
      <PageHero
        eyebrow="Community participation"
        title="Improve the public record with evidence."
        description="Suggest a correction, report a broken official link, or ask the BetterMC research team to locate a public document. Submissions are reviewed before publication."
      />
      <section className="section container participation-grid">
        <div>
          <SectionHeading
            eyebrow="How review works"
            title="Community input is not published automatically."
          />
          <ol className="process-list">
            <li>
              <span>1</span>
              <div>
                <strong>Submit context and a source</strong>
                <p>Give reviewers enough detail to reproduce the issue.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Independent review</strong>
                <p>
                  A moderator checks the claim against an attributable public
                  source.
                </p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Correction history</strong>
                <p>Accepted changes retain their source and review date.</p>
              </div>
            </li>
          </ol>
          <div className="participate-contact-box">
            <span className="participate-contact-label">
              Direct initiative contact
            </span>
            <p>
              For organizational communications, partnerships, or direct
              research inquiries, email the BetterMC volunteer initiative:
            </p>
            <div className="participate-contact-actions">
              <a
                href="mailto:bettermc.org@gmail.com"
                className="participate-contact-link"
              >
                <Mail aria-hidden="true" />
                <span>bettermc.org@gmail.com</span>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61596547555480"
                target="_blank"
                rel="noreferrer"
                className="participate-contact-link"
              >
                <FacebookIcon />
                <span>BetterMC on Facebook</span>
              </a>
            </div>
          </div>
        </div>
        <form
          ref={formRef}
          className="feedback-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2>Submit to the correction desk</h2>
          {serverMessage && (
            <div className={`form-message ${state}`} role="status">
              {state === "success" ? <Check /> : <CircleAlert />}
              {serverMessage}
            </div>
          )}
          <label>
            Request type
            <RequestTypeSelect value={requestType} onChange={setRequestType} />
          </label>
          <label>
            Subject
            <input
              name="subject"
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? "subject-error" : undefined}
            />
            {errors.subject && (
              <small id="subject-error" className="field-error">
                {errors.subject}
              </small>
            )}
          </label>
          <label>
            Details
            <textarea
              name="details"
              rows={6}
              aria-invalid={Boolean(errors.details)}
              aria-describedby={errors.details ? "details-error" : undefined}
            />
            {errors.details && (
              <small id="details-error" className="field-error">
                {errors.details}
              </small>
            )}
          </label>
          <label>
            Supporting source URL <span>(recommended)</span>
            <input
              name="sourceUrl"
              type="url"
              placeholder="https://…"
              aria-invalid={Boolean(errors.sourceUrl)}
            />
            {errors.sourceUrl && (
              <small className="field-error">{errors.sourceUrl}</small>
            )}
          </label>
          <label>
            Email <span>(optional, never published)</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <small className="field-error">{errors.email}</small>
            )}
          </label>
          <label className="honeypot" aria-hidden="true">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          {turnstileSiteKey && (
            <div className="verification-field">
              <span>Human verification</span>
              <input
                type="hidden"
                name="turnstileToken"
                value={turnstileToken}
              />
              <TurnstileWidget
                siteKey={turnstileSiteKey}
                resetKey={turnstileResetKey}
                onTokenChange={handleTurnstileToken}
              />
            </div>
          )}
          <button className="button primary" disabled={state === "submitting"}>
            {state === "submitting" ? "Sending…" : "Send for review"}
            <ArrowRight />
          </button>
          <p className="privacy-note">
            Do not submit confidential, sensitive, or private personal
            information.
          </p>
        </form>
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About BetterMC"
        title="Independent by design. Evidence-led by default."
        description="BetterMC helps residents navigate public information. It does not represent the City Government and does not make legal-compliance findings."
      />
      <section className="section container prose">
        <h2>Editorial and verification policy</h2>
        <p>
          Government-related factual records must identify an inspectable source
          and a review date. Official city sources are preferred, followed by
          national government sources such as COA, DBM, DILG, PSA, PhilGEPS and
          DPWH.
        </p>
        <h2>What “source listed” means</h2>
        <p>
          It means the official Full Disclosure page displayed a record title
          during the review. It does not confirm completeness of the file,
          validate every figure in a PDF, or establish legal compliance.
        </p>
        <h2>Reuse and attribution</h2>
        <p>
          The architecture was informed by the CC0 BetterLosBaños project and
          the BetterGov LGU ecosystem. Malaybalay-specific data is independently
          compiled from its cited sources.
        </p>
        <SourceNote
          url="https://github.com/BetterLosBanos/betterlb"
          label="BetterLosBaños technical reference"
        />
        <h2>Direct contact & editorial desk</h2>
        <p>
          For corrections, verification suggestions, or civic inquiries, reach the
          volunteer team directly at{" "}
          <a href="mailto:bettermc.org@gmail.com">bettermc.org@gmail.com</a>{" "}
          or follow updates on our official{" "}
          <a
            href="https://www.facebook.com/profile.php?id=61596547555480"
            target="_blank"
            rel="noreferrer"
          >
            BetterMC Facebook page
          </a>.
        </p>
      </section>
    </>
  );
}

function NotFoundPage() {
  return (
    <section className="empty-page container">
      <span>404</span>
      <h1>This page is not in the public record.</h1>
      <p>Return to the homepage or search the current directory.</p>
      <Link className="button primary" to="/">
        Return home
      </Link>
    </section>
  );
}

export default function App() {
  const location = useLocation();
  const subdomainSlug =
    typeof window === "undefined"
      ? barangaySlugFromHostname("", location.search)
      : barangaySlugFromHostname(window.location.hostname, location.search);
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            subdomainSlug ? (
              <BarangayProfilePage slugOverride={subdomainSlug} />
            ) : (
              <HomePage />
            )
          }
        />
        <Route path="/transparency" element={<TransparencyPage />} />
        <Route path="/procurement/:category" element={<ProcurementPage />} />
        <Route
          path="/transparency/:year/:quarter/:slug"
          element={<DisclosureDetailPage />}
        />
        <Route path="/legislation" element={<LegislationPage />} />
        <Route path="/legislation/:slug" element={<LegislationDetailPage />} />
        <Route path="/government" element={<GovernmentPage />} />
        <Route path="/barangays" element={<BarangaysPage />} />
        <Route path="/barangays/:slug" element={<BarangayProfilePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:category" element={<ServiceCategoryPage />} />
        <Route path="/participate" element={<ParticipatePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
