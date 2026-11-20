import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "./App";
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
    expect(screen.getByText("cho.bettermalaybalay.cloud")).toBeInTheDocument();
    expect(screen.getByText(/Source Cross-Reference Note:/i)).toBeInTheDocument();

    render(
      <MemoryRouter initialEntries={["/?office=cswdo"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: "City Social Welfare and Development Office" }),
    ).toBeInTheDocument();
    expect(screen.getByText("cswdo.bettermalaybalay.cloud")).toBeInTheDocument();
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

  it("prioritizes City Offices and PESO & Jobs in primary navigation, mobile tab bar, and homepage hero", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    const primaryNav = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(primaryNav).getByRole("link", { name: "City Offices" })).toHaveAttribute("href", "/offices");
    expect(within(primaryNav).getByRole("link", { name: "PESO & Jobs" })).toHaveAttribute("href", "/peso");

    const mobileTabs = screen.getByRole("navigation", { name: "Quick mobile app navigation" });
    expect(within(mobileTabs).getByRole("link", { name: "Offices" })).toHaveAttribute("href", "/offices");
    expect(within(mobileTabs).getByRole("link", { name: "PESO" })).toHaveAttribute("href", "/peso");

    const gateways = screen.getByRole("region", { name: "Featured Malaybalay portals" });
    expect(within(gateways).getByRole("link", { name: /Open PESO Hub/i })).toHaveAttribute("href", "/peso");
    expect(within(gateways).getByRole("link", { name: /Explore All 35 Offices/i })).toHaveAttribute("href", "/offices");
  });
});
