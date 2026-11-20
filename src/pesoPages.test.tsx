import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { PESO_FACEBOOK_PAGE_URL } from "./pesoData";

describe("Malaybalay Offices, PESO Hub, Job Details & Admin UI", () => {
  beforeEach(() => {
    window.localStorage?.clear();
    vi.restoreAllMocks();
  });

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

    // Active recurring programs are shown initially; expired historical CS Form 9 vacancies toggle via tab
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

  it("allows creating and previewing a new PESO job posting in /admin/peso when storage is unprovisioned", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/peso"]}>
        <App />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/Store Accounting Clerk/i), {
      target: { value: "IT Support Technician — Local Test Firm" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Verified employer name from PESO post/i), {
      target: { value: "Malaybalay Verified Employer" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Transcribe verified details/i), {
      target: { value: "Handles office hardware and LAN maintenance across Malaybalay branch." },
    });
    fireEvent.change(screen.getByPlaceholderText(/BS Accountancy graduate/i), {
      target: { value: "BS Information Technology or NC II CSS" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Publish Opportunity/i }));
    expect(await screen.findByText(/in browser Local Preview/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "IT Support Technician — Local Test Firm" })).toBeInTheDocument();
  });
});
