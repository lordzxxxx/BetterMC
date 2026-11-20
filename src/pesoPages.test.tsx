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
});
