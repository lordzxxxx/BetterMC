import { useEffect, useMemo, useRef, useState } from "react";
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
  sectionLinks: SectionNavLink[];
} {
  if (context.kind === "office") {
    const { office } = context;
    return {
      title: office.shortName,
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
  const links: SectionNavLink[] = [
    { id: "overview", label: "Overview" },
    { id: "facts", label: "School Facts" },
  ];
  if (school.academicOfferings?.length) {
    links.push({ id: "programmes", label: "Programmes" });
  }
  links.push(
    { id: "channels", label: "Channels & Map" },
    { id: "checklist", label: "Checklist" },
    { id: "sources", label: "Sources" },
  );
  return {
    title: school.name,
    sectionLinks: links,
  };
}

export function MicrositeHeader({ context }: { context: MicrositeHeaderContext }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const meta = useMemo(() => resolveHeaderMeta(context), [context]);
  const [activeSectionId, setActiveSectionId] = useState<string>(
    () => meta.sectionLinks[0]?.id ?? "",
  );

  const inProfilePage =
    pathname === "/" ||
    (context.kind === "office" && context.slug === "sp" && pathname === "/transparency");

  const sectionIdsKey = meta.sectionLinks.map((section) => section.id).join("|");
  const resolvedActiveSectionId = meta.sectionLinks.some(
    (section) => section.id === activeSectionId,
  )
    ? activeSectionId
    : (meta.sectionLinks[0]?.id ?? "");

  // Scrollspy synchronization: mirrors CSS `scroll-target-group` (:target-current) to
  // aria-current on supporting browsers, and falls back to IntersectionObserver elsewhere.
  useEffect(() => {
    if (!inProfilePage || typeof window === "undefined") return;
    const ids = sectionIdsKey.split("|").filter(Boolean);
    if (!ids.length) return;

    const supportsScrollTargetGroup =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("scroll-target-group: auto");

    if (supportsScrollTargetGroup) {
      const syncFromNative = () => {
        const navEl = desktopNavRef.current;
        if (!navEl) return;
        try {
          const current = navEl.querySelector<HTMLAnchorElement>("a:target-current");
          const href = current?.getAttribute("href");
          if (href && href.startsWith("#")) {
            setActiveSectionId(href.slice(1));
          }
        } catch {
          // Ignore selector errors on engines lacking :target-current
        }
      };
      syncFromNative();
      document.addEventListener("scrollend", syncFromNative, { passive: true });
      return () => {
        document.removeEventListener("scrollend", syncFromNative);
      };
    }

    if (typeof IntersectionObserver === "undefined") return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .toSorted(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]?.target.id) {
          setActiveSectionId(visible[0].target.id);
        }
      },
      { rootMargin: "-18% 0px -65% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [inProfilePage, sectionIdsKey]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleBtnRef.current?.focus();
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
            <span className="microsite-brand-title">
              <strong>Uswag Malaybalay</strong>
            </span>
          </a>

          <nav
            ref={desktopNavRef}
            className="microsite-section-nav"
            aria-label={`${meta.title} sections`}
          >
            {meta.sectionLinks.map((section) => {
              const isActive = inProfilePage && resolvedActiveSectionId === section.id;
              return inProfilePage ? (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={isActive ? "target-current" : undefined}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setActiveSectionId(section.id)}
                >
                  {section.label}
                </a>
              ) : (
                <Link key={section.id} to={`/#${section.id}`}>
                  {section.label}
                </Link>
              );
            })}
          </nav>

          <div className="microsite-header-utilities">
            <button
              ref={toggleBtnRef}
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
            aria-label={`${meta.title} mobile`}
          >
            <p className="microsite-mobile-drawer-label">On this page · {meta.title}</p>
            <div className="microsite-mobile-sections">
              {meta.sectionLinks.map((section) => {
                const isActive = inProfilePage && resolvedActiveSectionId === section.id;
                return inProfilePage ? (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={isActive ? "target-current" : undefined}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => {
                      setActiveSectionId(section.id);
                      setMenuOpen(false);
                    }}
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
                );
              })}
            </div>
            <div className="microsite-mobile-network">
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
      {menuOpen ? (
        <div
          className="microsite-drawer-backdrop"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
    </>
  );
}
