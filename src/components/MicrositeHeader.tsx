import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  GraduationCap,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { MAIN_BETTERMC_URL } from "../governmentOffices";
import { type MicrositeHeaderContext } from "../micrositeContext";

type SectionNavLink = {
  id: string;
  label: string;
};

function resolveHeaderMeta(context: MicrositeHeaderContext): {
  kindLabel: string;
  title: string;
  emblemSrc: string | null;
  directoryPath: string;
  directoryLabel: string;
  sectionLinks: SectionNavLink[];
} {
  if (context.kind === "office") {
    const { office } = context;
    return {
      kindLabel: "City Office",
      title: office.shortName,
      emblemSrc:
        office.logoStatus === "Verified Local Asset" && office.logoPath ? office.logoPath : null,
      directoryPath: "/offices",
      directoryLabel: "All City Offices",
      sectionLinks:
        office.slug === "peso"
          ? [
              { id: "about", label: "About" },
              { id: "services", label: "Services" },
              { id: "job-opportunities", label: "Job Board" },
              { id: "personnel", label: "Personnel" },
              { id: "sources", label: "Contacts" },
            ]
          : [
              { id: "about", label: "About" },
              { id: "personnel", label: "Officials" },
              { id: "mandate", label: "Mandate" },
              { id: "services", label: "Services" },
              { id: "sources", label: "Contacts" },
            ],
    };
  }

  if (context.kind === "barangay") {
    const { barangay } = context;
    return {
      kindLabel: "Barangay",
      title: `Barangay ${barangay.name}`,
      emblemSrc: barangay.logo || null,
      directoryPath: "/barangays",
      directoryLabel: "All Barangays",
      sectionLinks: [
        { id: "about", label: "Overview" },
        { id: "leadership", label: "Officials" },
        { id: "disclosure", label: "Disclosure" },
        { id: "map", label: "Map" },
        { id: "services", label: "Services" },
        { id: "contacts", label: "Contacts" },
      ],
    };
  }

  const { school } = context;
  return {
    kindLabel: "School Profile",
    title: school.name,
    emblemSrc: school.logoUrl ?? null,
    directoryPath: "/education",
    directoryLabel: "All Schools",
    sectionLinks: [
      { id: "overview", label: "Overview" },
      { id: "facts", label: "School Facts" },
      { id: "channels", label: "Channels & Map" },
      { id: "sources", label: "Sources" },
    ],
  };
}

export function MicrositeHeader({ context }: { context: MicrositeHeaderContext }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const meta = resolveHeaderMeta(context);

  const inProfilePage =
    pathname === "/" ||
    (context.kind === "office" && context.slug === "sp" && pathname === "/transparency");

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <header ref={headerRef} className="microsite-header" data-microsite-kind={context.kind}>
        <div className="container microsite-header-inner">
          <Link className="microsite-identity" to="/" onClick={() => setMenuOpen(false)}>
            <span className="microsite-emblem" aria-hidden="true">
              {meta.emblemSrc ? (
                <img src={meta.emblemSrc} alt="" decoding="async" />
              ) : context.kind === "office" ? (
                <Building2 />
              ) : context.kind === "school" ? (
                <GraduationCap />
              ) : (
                <MapPin />
              )}
            </span>
            <span className="microsite-identity-text">
              <span className="microsite-kind-badge">
                <span>{meta.kindLabel}</span>
                <span className="microsite-kind-sep" aria-hidden="true">
                  ·
                </span>
                <span className="microsite-kind-scope">Independent Civic Profile</span>
              </span>
              <strong className="microsite-identity-title">{meta.title}</strong>
            </span>
          </Link>

          <nav className="microsite-section-nav" aria-label={`${meta.title} sections`}>
            {meta.sectionLinks.map((section) =>
              inProfilePage ? (
                <a key={section.id} href={`#${section.id}`}>
                  {section.label}
                </a>
              ) : (
                <Link key={section.id} to={`/#${section.id}`}>
                  {section.label}
                </Link>
              ),
            )}
          </nav>

          <div className="microsite-header-utilities">
            <a
              className="microsite-directory-link"
              href={`${MAIN_BETTERMC_URL}${meta.directoryPath}`}
            >
              <span>{meta.directoryLabel}</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a
              className="microsite-platform-badge"
              href={MAIN_BETTERMC_URL}
              aria-label="BetterMC Malaybalay public information network"
            >
              <span className="microsite-bettermc-glyph" aria-hidden="true" />
              <span>BetterMC</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <button
              type="button"
              className="microsite-menu-toggle"
              aria-label={menuOpen ? "Close microsite menu" : "Open microsite menu"}
              aria-expanded={menuOpen}
              aria-controls="microsite-mobile-nav"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div
          id="microsite-mobile-nav"
          className={`microsite-mobile-drawer${menuOpen ? " is-open" : ""}`}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          <nav
            className="container microsite-mobile-nav"
            aria-label={`${meta.title} mobile navigation`}
          >
            <p className="microsite-mobile-drawer-label">On this page</p>
            <div className="microsite-mobile-sections">
              {meta.sectionLinks.map((section) =>
                inProfilePage ? (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{section.label}</span>
                    <ArrowRight aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    key={section.id}
                    to={`/#${section.id}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{section.label}</span>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                ),
              )}
            </div>
            <div className="microsite-mobile-network">
              <a
                className="microsite-mobile-network-link"
                href={`${MAIN_BETTERMC_URL}${meta.directoryPath}`}
                onClick={() => setMenuOpen(false)}
              >
                <span>{meta.directoryLabel} on BetterMC</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a
                className="microsite-mobile-network-link is-primary"
                href={MAIN_BETTERMC_URL}
                onClick={() => setMenuOpen(false)}
              >
                <span className="microsite-bettermc-glyph" aria-hidden="true" />
                <span>BetterMC Malaybalay Network</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
              <p className="microsite-mobile-civic-note">
                Independent civic microsite · Not an official LGU or school website.
              </p>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
