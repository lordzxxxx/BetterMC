import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "./App";
import { governmentOffices } from "./governmentOffices";
import { officePersonnelBySlug } from "./officePersonnel";
import { PESO_FACEBOOK_PAGE_URL } from "./pesoData";

describe("Malaybalay Offices, PESO Hub & Job Details UI", () => {
  it("renders the searchable 35+ City Offices & Local Special Bodies directory at /offices", () => {
    render(
      <MemoryRouter initialEntries={["/offices"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /City Offices, Divisions & Partner Institutions/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Local Special Bodies & Special Committees/i)).toBeInTheDocument();
    expect(screen.getByText(/City Development Council \(CDC\)/i)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Search office, acronym/i);
    fireEvent.change(searchInput, { target: { value: "Senior Citizens" } });
    expect(screen.getByRole("link", { name: /Office of the Senior Citizens Affairs/i })).toBeInTheDocument();
  });

  it("renders the standardized Office Landing Page for /offices/cho and subdomain query ?office=cswdo", () => {
    render(
      <MemoryRouter initialEntries={["/offices/cho"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "City Health Office" })).toBeInTheDocument();
    const micrositeNav = within(
      screen.getByRole("navigation", { name: /main portal navigation/i }),
    );
    expect(micrositeNav.getByRole("link", { name: /BetterMC Home/i })).toHaveAttribute("href", "/");
    expect(screen.queryByText(/City Offices \(35\)/i)).not.toBeInTheDocument();
    expect(screen.getAllByText("cho.bettermalaybalay.cloud").length).toBeGreaterThan(0);
    expect(screen.queryByText(/Source Cross-Reference Note:/i)).not.toBeInTheDocument();
    const choPersonnel = screen.getByRole("region", { name: "Officials & Assigned Personnel" });
    expect(within(choPersonnel).getByText("Dr. Dennis P. Sangalang, MD")).toBeInTheDocument();

    cleanup();
    render(
      <MemoryRouter initialEntries={["/?office=cswdo"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: "City Social Welfare and Development Office" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("cswdo.bettermalaybalay.cloud").length).toBeGreaterThan(0);
  });

  it("renders PESO Malaybalay Hub with official Facebook link, Charter services, and Job Board filtering", () => {
    render(
      <MemoryRouter initialEntries={["/?office=peso"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Public Employment Service Office — Malaybalay City" }),
    ).toBeInTheDocument();
    const mainRegion = screen.getByRole("main");
    expect(within(mainRegion).getByRole("link", { name: "Official Facebook Page" })).toHaveAttribute(
      "href",
      PESO_FACEBOOK_PAGE_URL,
    );
    expect(screen.getByText(/Public Services Offered \(10\)/i)).toBeInTheDocument();

    expect(
      screen.queryByRole("link", { name: "Planning Officer IV" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Expired \/ CS Form No\. 9 Archive/i }));
    expect(screen.getByRole("link", { name: "Planning Officer IV" })).toBeInTheDocument();
  });

  it("renders a full Job Opportunity Detail page with clear Expired alert for past CS Form No. 9 posts", () => {
    render(
      <MemoryRouter initialEntries={["/jobs/csc-2024-planning-officer-iv-cpdo"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Planning Officer IV" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(/This posting is expired/i);
    expect(screen.getByText(/Salary Grade 22 — ₱74,836.00 \/ month/i)).toBeInTheDocument();
  });

  it("cross-links /services/employment directly to the PESO Malaybalay Hub", () => {
    render(
      <MemoryRouter initialEntries={["/services/employment"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /Open PESO Hub & Jobs/i })).toHaveAttribute("href", "/peso");
  });

  it("keeps PESO accessible through City Offices instead of main navigation and renders office personnel rosters", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    const primaryNav = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(primaryNav).getByRole("link", { name: "City Offices" })).toHaveAttribute("href", "/offices");
    expect(within(primaryNav).queryByRole("link", { name: "PESO & Jobs" })).not.toBeInTheDocument();

    const mobileTabs = screen.getByRole("navigation", { name: "Quick mobile app navigation" });
    expect(within(mobileTabs).getByRole("link", { name: "Offices" })).toHaveAttribute("href", "/offices");
    expect(within(mobileTabs).getByRole("link", { name: "Barangays" })).toHaveAttribute("href", "/barangays");
    expect(within(mobileTabs).queryByRole("link", { name: "PESO" })).not.toBeInTheDocument();

    expect(screen.queryByRole("region", { name: "Featured Malaybalay portals" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View all 35 offices/i })).toHaveAttribute("href", "/offices");

    cleanup();
    render(
      <MemoryRouter initialEntries={["/?office=budget"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "City Budget Office" })).toBeInTheDocument();
    const personnelSection = screen.getByRole("region", { name: "Officials & Assigned Personnel" });
    expect(within(personnelSection).getByText("Ronny B. Gamao")).toBeInTheDocument();
    expect(within(personnelSection).getByText("City Budget Operations Division")).toBeInTheDocument();
    expect(within(personnelSection).getByText("Mary Grace R. Alenton")).toBeInTheDocument();
    expect(screen.getAllByText("budget.bettermalaybalay.cloud").length).toBeGreaterThan(0);
  });

  it("ensures all 35 government offices have verified headOfOffice, complete personnel rosters, and zero Source Cross-Reference warning banners", () => {
    expect(governmentOffices).toHaveLength(35);
    for (const office of governmentOffices) {
      expect(office.headOfOffice?.trim().length ?? 0, `headOfOffice for ${office.slug}`).toBeGreaterThan(0);
      const roster = officePersonnelBySlug[office.slug];
      expect(roster, `officePersonnelBySlug missing ${office.slug}`).toBeDefined();
      expect(roster.groups.length, `personnel groups for ${office.slug}`).toBeGreaterThan(0);
      expect(roster.sourceUrl, `sourceUrl for ${office.slug}`).toMatch(/^https?:\/\//);
    }

    for (const [entryPath, heading, expectedPerson] of [
      ["/?office=treasurer", "City Treasurer's Office", "Bella Stephanie B. Saavedra, CPA"],
      ["/?office=drrmo", "City Disaster Risk Reduction and Management Office", "Alan J. Comiso"],
      ["/?office=bac", "Bids and Awards Committee & BAC Secretariat", "Atty. Julius Michael G. Barroso"],
      ["/?office=deped-division", "Department of Education — Schools Division of Malaybalay City", "Dr. Cherry Mae L. Limbaco-Reyes, CESO V"],
    ] as const) {
      cleanup();
      render(
        <MemoryRouter initialEntries={[entryPath]}>
          <App />
        </MemoryRouter>,
      );
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
      expect(screen.queryByText(/Source Cross-Reference Note:/i)).not.toBeInTheDocument();
      const region = screen.getByRole("region", { name: "Officials & Assigned Personnel" });
      expect(within(region).getByText(expectedPerson)).toBeInTheDocument();
    }
  });

  it("shows BetterMC Home on /offices/sp, hides it on sp.bettermalaybalay.cloud/transparency, and preserves SP emblem & other microsites", () => {
    const originalLocation = window.location;

    const renderWithHostname = (hostname: string, entryPath: string) => {
      cleanup();
      Object.defineProperty(window, "location", {
        configurable: true,
        value: { ...originalLocation, hostname, pathname: entryPath, search: "" },
      });
      render(
        <MemoryRouter initialEntries={[entryPath]}>
          <App />
        </MemoryRouter>,
      );
    };

    try {
      renderWithHostname("www.bettermalaybalay.cloud", "/offices/sp");
      expect(
        screen.getByRole("heading", {
          name: "Office of the Sangguniang Panlungsod & SP Secretariat",
        }),
      ).toBeInTheDocument();
      expect(screen.getByAltText("Sangguniang Panlungsod official emblem")).toHaveAttribute(
        "src",
        "/images/offices/sangguniang-panlungsod.jpg",
      );
      const officeMain = screen.getByRole("main");
      const officeNav = within(officeMain).getByRole("navigation", {
        name: /main portal navigation/i,
      });
      expect(within(officeNav).getByRole("link", { name: /BetterMC Home/i })).toHaveAttribute(
        "href",
        "/",
      );
      expect(officeMain.querySelectorAll(".microsite-home-button")).toHaveLength(1);

      renderWithHostname("sp.bettermalaybalay.cloud", "/transparency");
      expect(
        screen.getByRole("heading", {
          name: "Office of the Sangguniang Panlungsod & SP Secretariat",
        }),
      ).toBeInTheDocument();
      expect(screen.getByAltText("Sangguniang Panlungsod official emblem")).toHaveAttribute(
        "src",
        "/images/offices/sangguniang-panlungsod.jpg",
      );
      const spTransparencyMain = screen.getByRole("main");
      expect(
        within(spTransparencyMain).queryByRole("navigation", { name: /main portal navigation/i }),
      ).not.toBeInTheDocument();
      expect(
        within(spTransparencyMain).queryByRole("link", { name: /BetterMC Home/i }),
      ).not.toBeInTheDocument();
      expect(document.querySelectorAll(".microsite-home-button")).toHaveLength(0);
      expect(
        screen.queryByRole("heading", { name: /City Transparency/i }),
      ).not.toBeInTheDocument();

      renderWithHostname("sp.bettermalaybalay.cloud", "/");
      expect(
        screen.getByRole("heading", {
          name: "Office of the Sangguniang Panlungsod & SP Secretariat",
        }),
      ).toBeInTheDocument();
      const spRootMain = screen.getByRole("main");
      expect(
        within(spRootMain).queryByRole("link", { name: /BetterMC Home/i }),
      ).not.toBeInTheDocument();
      expect(document.querySelectorAll(".microsite-home-button")).toHaveLength(0);

      renderWithHostname("mayor.bettermalaybalay.cloud", "/");
      expect(screen.getByRole("heading", { name: "Office of the City Mayor" })).toBeInTheDocument();
      const mayorNav = screen.getByRole("navigation", { name: /main portal navigation/i });
      expect(within(mayorNav).getByRole("link", { name: /BetterMC Home/i })).toHaveAttribute(
        "href",
        "https://www.bettermalaybalay.cloud",
      );
    } finally {
      Object.defineProperty(window, "location", {
        configurable: true,
        value: originalLocation,
      });
    }
  });

  it("replaces main BetterMC header with standalone MicrositeHeader across Office, School, and Barangay subdomains while keeping internal headers intact", () => {
    const originalLocation = window.location;

    const renderWithHostname = (hostname: string, entryPath: string) => {
      cleanup();
      Object.defineProperty(window, "location", {
        configurable: true,
        value: { ...originalLocation, hostname, pathname: entryPath, search: "" },
      });
      render(
        <MemoryRouter initialEntries={[entryPath]}>
          <App />
        </MemoryRouter>,
      );
    };

    try {
      // 1. Standalone City Office microsite (PESO)
      renderWithHostname("peso.bettermalaybalay.cloud", "/");
      expect(document.querySelector(".site-header")).not.toBeInTheDocument();
      expect(document.querySelector(".independence-bar")).not.toBeInTheDocument();
      expect(document.querySelector(".mobile-bottom-app-bar")).not.toBeInTheDocument();
      expect(document.querySelector(".office-local-nav")).not.toBeInTheDocument();

      const pesoHeader = document.querySelector(".microsite-header");
      expect(pesoHeader).toBeInTheDocument();
      expect(pesoHeader).toHaveAttribute("data-microsite-kind", "office");
      expect(within(pesoHeader as HTMLElement).getByText("Uswag Malaybalay")).toBeInTheDocument();
      expect(pesoHeader?.querySelector(".microsite-brand-main")).toBeInTheDocument();
      expect(pesoHeader?.querySelector(".microsite-brand-wordmark")).toBeInTheDocument();
      expect(
        within(pesoHeader as HTMLElement).getByRole("link", {
          name: /BetterMC — Uswag Malaybalay/i,
        }),
      ).toHaveAttribute("href", "https://www.bettermalaybalay.cloud");
      expect(
        within(pesoHeader as HTMLElement).getByRole("link", { name: "Job Board" }),
      ).toHaveAttribute("href", "#job-opportunities");
      expect(
        within(pesoHeader as HTMLElement).getByRole("link", { name: /All City Offices/i }),
      ).toHaveAttribute("href", "https://www.bettermalaybalay.cloud/offices");

      const pesoFooter = screen.getByRole("navigation", { name: "Footer navigation" });
      expect(
        within(pesoFooter).getByRole("link", { name: "City Offices & Sectors" }),
      ).toHaveAttribute("href", "https://www.bettermalaybalay.cloud/offices");

      // 2. Standalone School microsite (BukSU)
      renderWithHostname("bukidnon-state-university.bettermalaybalay.cloud", "/");
      expect(document.querySelector(".site-header")).not.toBeInTheDocument();
      expect(document.querySelector(".mobile-bottom-app-bar")).not.toBeInTheDocument();
      const schoolHeader = document.querySelector(".microsite-header");
      expect(schoolHeader).toBeInTheDocument();
      expect(schoolHeader).toHaveAttribute("data-microsite-kind", "school");
      expect(within(schoolHeader as HTMLElement).getByText("Uswag Malaybalay")).toBeInTheDocument();
      expect(
        within(schoolHeader as HTMLElement).getByRole("link", { name: /School Facts/i }),
      ).toHaveAttribute("href", "#facts");
      expect(
        within(schoolHeader as HTMLElement).getByRole("link", { name: /All Schools/i }),
      ).toHaveAttribute("href", "https://www.bettermalaybalay.cloud/education");
      expect(
        screen.getByRole("link", { name: /All Malaybalay schools on BetterMC/i }),
      ).toHaveAttribute("href", "https://www.bettermalaybalay.cloud/education");
      expect(document.title).toBe("Bukidnon State University | BetterMC");

      // 3. Standalone Barangay microsite (Bangcud)
      renderWithHostname("bangcud.bettermalaybalay.cloud", "/");
      expect(document.querySelector(".site-header")).not.toBeInTheDocument();
      expect(document.querySelector(".mobile-bottom-app-bar")).not.toBeInTheDocument();
      expect(document.querySelector(".barangay-local-nav")).not.toBeInTheDocument();
      const brgyHeader = document.querySelector(".microsite-header");
      expect(brgyHeader).toBeInTheDocument();
      expect(brgyHeader).toHaveAttribute("data-microsite-kind", "barangay");
      expect(within(brgyHeader as HTMLElement).getByText("Uswag Malaybalay")).toBeInTheDocument();
      expect(
        within(brgyHeader as HTMLElement).getByRole("link", { name: /All Barangays/i }),
      ).toHaveAttribute("href", "https://www.bettermalaybalay.cloud/barangays");
      expect(
        screen.getByRole("link", { name: /Open Barangay Bangcud document guide/i }),
      ).toHaveAttribute(
        "href",
        "https://www.bettermalaybalay.cloud/documents/barangays/bangcud",
      );
      expect(document.title).toBe("Barangay Bangcud | BetterMC");

      // 4. Verified Contacts, Dialable Phones, Personnel Toggle & Data Integrity on Office Microsites
      renderWithHostname("mayor.bettermalaybalay.cloud", "/");
      const mayorTelLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]'));
      expect(mayorTelLinks.length).toBeGreaterThan(0);
      for (const telLink of mayorTelLinks) {
        const digits = telLink.getAttribute("href")?.replace(/^tel:/, "") ?? "";
        expect(digits.length, `dialable phone digits for ${telLink.textContent}`).toBeLessThanOrEqual(11);
      }
      const mayorSources = document.getElementById("sources") as HTMLElement;
      expect(within(mayorSources).getByRole("link", { name: /Official Facebook Page/i })).toBeInTheDocument();
      expect(within(mayorSources).getByRole("link", { name: /Directions \/ Google Maps/i })).toBeInTheDocument();

      renderWithHostname("sp.bettermalaybalay.cloud", "/transparency");
      expect(screen.queryByText(/Show 1 more assigned personnel/i)).not.toBeInTheDocument();
      const expandCouncillorsBtn = screen.getByRole("button", {
        name: /Show remaining 8 personnel \(14 total\)/i,
      });
      fireEvent.click(expandCouncillorsBtn);
      expect(screen.getByText(/Show fewer personnel/i)).toBeInTheDocument();
      expect(screen.getByText("Assistant SP Secretary")).toBeInTheDocument();

      renderWithHostname("dilg.bettermalaybalay.cloud", "/");
      expect(document.querySelector('a[href^="mailto:dilg.buk.malaybalay@gmail.cm"]')).not.toBeInTheDocument();
      expect(screen.getAllByText("dilg.buk.malaybalay@gmail.cm").length).toBeGreaterThan(0);

      // 5. Internal BetterMC pages keep original Header, MobileAppTabBar, and section bars
      for (const internalPath of [
        "/offices/sp",
        "/education/bukidnon-state-university",
        "/barangays/bangcud",
      ]) {
        renderWithHostname("www.bettermalaybalay.cloud", internalPath);
        expect(document.querySelector(".site-header")).toBeInTheDocument();
        expect(document.querySelector(".independence-bar")).toBeInTheDocument();
        expect(document.querySelector(".mobile-bottom-app-bar")).toBeInTheDocument();
        expect(document.querySelector(".microsite-header")).not.toBeInTheDocument();
      }

      // 6. Data sanity across all 35 City Offices (no broken Charter/BAC URLs or stale counts)
      for (const office of governmentOffices) {
        expect(office.officialWebUrl, `officialWebUrl for ${office.slug}`).not.toContain("bids-and-awards-committee-2");
        for (const src of office.sources) {
          expect(src.url, `source URL for ${office.slug}`).not.toContain("2026/08/CITIZENS-CHARTER");
          expect(src.url, `source URL for ${office.slug}`).not.toContain("bids-and-awards-committee-2");
        }
      }
    } finally {
      Object.defineProperty(window, "location", {
        configurable: true,
        value: originalLocation,
      });
    }
  });
});
