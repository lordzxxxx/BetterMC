import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
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
  title: string;
  directoryPath: string;
  directoryLabel: string;
  sectionLinks: SectionNavLink[];
} {
  if (context.kind === "office") {
    const { office } = context;
    return {
      title: office.shortName,
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
      title: `Barangay ${barangay.name}`,
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
    title: school.name,
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
          <a
            className="microsite-brand"
            href={MAIN_BETTERMC_URL}
            aria-label="BetterMC — Uswag Malaybalay"
            onClick={() => setMenuOpen(false)}
          >
            <span className="microsite-brand-assets" aria-hidden="true">
              <span className="microsite-brand-main" />
              <span className="microsite-brand-wordmark" />
            </span>
            <span className="microsite-brand-divider" aria-hidden="true" />
            <span className="microsite-brand-title">
              <strong>Uswag Malaybalay</strong>
            </span>
          </a>

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
              className="microsite-directory-pill"
              href={`${MAIN_BETTERMC_URL}${meta.directoryPath}`}
            >
              <span>{meta.directoryLabel}</span>
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
            <p className="microsite-mobile-drawer-label">On this page · {meta.title}</p>
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
                <span>Uswag Malaybalay · BetterMC Portal</span>
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
