import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { legislativeHearingRecords, bacLivestreamEntries } from "./publicInformation";
import {
  barangayMicrosites,
  barangaySlugFromHostname,
  MALAYBALAY_2024_POPULATION,
} from "./barangayProfiles";
import {
  civicRecords,
  officials,
  reportedProcurementSavings,
  unmatchedSuppliedFacebookProfiles,
} from "./data";
import { civicRecordContext } from "./civicRecordContext";
import {
  buildGoogleMapsPlaceUrl,
  essentialNationalServices,
  VERIFIED_SERVICE_PROVIDERS,
} from "./serviceCatalog";
import {
  documentGuides,
  educationInstitutions,
  educationOffices,
  schoolSlugFromHostname,
} from "./civicDirectories";

describe("BetterMC public portal", () => {
  it("opens sourced discussions and BAC video in a dismissible panel", () => {
    render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: /Read discussion: Livestreamed Public Bidding/i }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("button", { name: /Play original Facebook video/i })).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: /Play original Facebook video/i }));
    expect(within(dialog).getByTitle("BAC meeting video, 18 November 2026")).toHaveAttribute("src", expect.stringContaining("facebook.com/plugins/video.php"));
    fireEvent.click(within(dialog).getByRole("button", { name: "Close record" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("combines hearing search and type filters before opening the full record", () => {
    render(<MemoryRouter initialEntries={["/hearings"]}><App /></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText(/Search hearings, topics, or measures/i), { target: { value: "2027" } });
    fireEvent.change(screen.getByLabelText(/Proceeding type/i), { target: { value: "SP Committee Hearing" } });
    expect(screen.getByText(/1 legislative sessions & hearings/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Open hearing: Committee Hearing on the Proposed FY 2027/i }));
    expect(within(screen.getByRole("dialog")).getByText(/Department-by-department presentation/i)).toBeInTheDocument();
  });

  it("opens a bidding notice with its original document link and access note", () => {
    render(<MemoryRouter initialEntries={["/procurement/bidding-opportunities"]}><App /></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText(/Project, office, barangay, or ITB/i), { target: { value: "ITB-2026-206" } });
    fireEvent.click(screen.getByRole("button", { name: /Open procurement record ITB-2026-206/i }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(/may require sign-in/i)).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /Open official document/i })).toHaveAttribute("href", expect.stringContaining("drive.google.com"));
  });

  it("opens separate sourced detail pages for legislative and BAC records", () => {
    const hearing = legislativeHearingRecords[0];
    const hearingView = render(<MemoryRouter initialEntries={[`/hearings/${hearing.id}`]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: hearing.title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Official City Government of Malaybalay Facebook Page/i })).toHaveAttribute("href", hearing.sourceUrl);
    expect(screen.getByText(/No direct playable recording or reviewed transcript/)).toBeInTheDocument();
    hearingView.unmount();

    const procurement = bacLivestreamEntries[0];
    render(<MemoryRouter initialEntries={[`/procurement/livestreams/${procurement.id}`]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: procurement.projectName })).toBeInTheDocument();
    expect(screen.getByText(procurement.referenceCode)).toBeInTheDocument();
  });
  it("keeps source-led education and document routes available without inventing missing details", () => {
    expect(educationInstitutions.length).toBeGreaterThan(10);
    for (const institution of educationInstitutions) {
      expect(institution.source.url).toMatch(/^https:\/\//);
      expect(institution.address.length).toBeGreaterThan(10);
      expect(["Verified", "Partially Verified", "Awaiting Verification", "Community Reported", "Inactive or Closed"]).toContain(institution.status);
    }
    expect(documentGuides).toHaveLength(3);
    expect(documentGuides.some((guide) => guide.scope === "Barangay")).toBe(true);
    render(<MemoryRouter initialEntries={["/education/bukidnon-state-university"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Bukidnon State University" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open map search/i })).toHaveAttribute("href", expect.stringContaining("google.com/maps/search"));
  });

  it("finds Bangcud Central School and opens its sourced profile", async () => {
    const school = educationInstitutions.find((item) => item.slug === "bangcud-central-school");
    expect(school?.schoolId).toBe("126558");
    expect(educationInstitutions.filter((item) => item.schoolId === "126558")).toHaveLength(1);

    const directory = render(<MemoryRouter initialEntries={["/education"]}><App /></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText("Search school name, ID, or address"), {
      target: { value: "Bangcud Central School" },
    });
    expect(await screen.findByRole("heading", { name: "Bangcud Central School" })).toBeInTheDocument();
    directory.unmount();

    render(<MemoryRouter initialEntries={["/education/bangcud-central-school"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Bangcud Central School" })).toBeInTheDocument();
    expect(screen.getByText("126558")).toBeInTheDocument();
    expect(screen.getByText(/Purok 2, Sayre Highway, Bangcud/)).toBeInTheDocument();
  });

  it("keeps the supplied school inventory searchable without duplicate slugs", () => {
    const requiredNames = [
      "Airport Village Elementary School",
      "Malaybalay City Central School",
      "Candiisan Integrated School",
      "Lunokan Integrated School",
      "Bukidnon State University Elementary School Laboratory",
      "Imbayao National High School",
    ];
    for (const name of requiredNames) {
      expect(educationInstitutions.some((school) => school.name === name)).toBe(true);
    }
    expect(new Set(educationInstitutions.map((school) => school.slug)).size).toBe(educationInstitutions.length);
    expect(schoolSlugFromHostname("bangcud-central-school.bettermalaybalay.cloud")).toBe("bangcud-central-school");
    expect(schoolSlugFromHostname("not-a-school.bettermalaybalay.cloud")).toBeNull();
  });

  it("assigns one deterministic subdomain to every education record", () => {
    const hosts = educationInstitutions.map((school) => school.subdomainHost);
    expect(hosts.every((host) => host?.endsWith(".bettermalaybalay.cloud"))).toBe(true);
    expect(new Set(hosts).size).toBe(educationInstitutions.length);
  });

  it("does not expose the removed Babahag school record", () => {
    expect(educationInstitutions.some((school) => school.slug === "babahag-elementary-school")).toBe(false);
    expect(schoolSlugFromHostname("babahag-elementary-school.bettermalaybalay.cloud")).toBeNull();
  });

  it("does not expose the removed Bulonay school record", () => {
    expect(educationInstitutions.some((school) => school.slug === "bulonay-elementary-school")).toBe(false);
    expect(schoolSlugFromHostname("bulonay-elementary-school.bettermalaybalay.cloud")).toBeNull();
  });

  it("uses the updated Caburacanan school name", () => {
    const school = educationInstitutions.find((item) => item.slug === "caburacanan-elementary-school");
    expect(school?.name).toBe("Caburacanan Integrated School");
  });

  it("does not expose the removed Capitan Juan school record", () => {
    expect(educationInstitutions.some((school) => school.slug === "capitan-juan-integrated-school")).toBe(false);
    expect(schoolSlugFromHostname("capitan-juan-integrated-school.bettermalaybalay.cloud")).toBeNull();
  });

  it("adds the Bukidnon National senior high campus and removes Casisang senior high", () => {
    expect(educationInstitutions.some((school) => school.name === "Bukidnon National High School Senior High School Campus")).toBe(true);
    expect(educationInstitutions.some((school) => school.slug === "casisang-senior-high-school")).toBe(false);
    expect(schoolSlugFromHostname("casisang-senior-high-school.bettermalaybalay.cloud")).toBeNull();
  });

  it("uses the supplied BukSU campus address without status badges", () => {
    render(<MemoryRouter initialEntries={["/education?q=Bukidnon%20State%20University%20Elementary"]}><App /></MemoryRouter>);
    const card = screen.getByRole("article");
    expect(card).toHaveTextContent("Casisang, 44J8+JCW, University Road, Malaybalay City, 8700 Bukidnon");
    expect(card).not.toHaveTextContent("Awaiting Verification");
    expect(card).not.toHaveTextContent("Verified");
  });

  it("links every barangay profile to its document-service page", () => {
    render(<MemoryRouter initialEntries={["/barangays/aglayan"]}><App /></MemoryRouter>);
    expect(screen.getByRole("link", { name: /Open Barangay Aglayan document guide/i })).toHaveAttribute("href", "/documents/barangays/aglayan");
  });

  it("keeps Malaybalay City and Bukidnon DepEd office records separate", () => {
    render(<MemoryRouter initialEntries={["/education/offices"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: /Schools Division of Malaybalay City/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Schools Division of Bukidnon/i })).toBeInTheDocument();
    expect(screen.getByText(/Victoria V. Gazo/i)).toBeInTheDocument();
  });

  it("keeps the eight essential national services connected to a local guide", () => {
    expect(essentialNationalServices.map((service) => service.label)).toEqual([
      "BIR", "SSS", "PhilHealth", "Pag-IBIG", "PSA", "LTO", "DTI", "GSIS",
    ]);
    for (const service of essentialNationalServices) {
      expect(VERIFIED_SERVICE_PROVIDERS).toContain(service.provider);
      expect(service.provider.jurisdiction).toMatch(/National Agency/);
      expect(service.provider.transactions.length).toBeGreaterThan(0);
      expect(service.provider.onlinePortalUrl).toMatch(/^https:\/\//);
      expect(service.provider.source.url).toMatch(/^https:\/\//);
    }
  });

  it("opens provider maps as exact coordinate pins", () => {
    for (const provider of VERIFIED_SERVICE_PROVIDERS) {
      const mapUrl = new URL(buildGoogleMapsPlaceUrl(provider.coordinates));
      expect(mapUrl.origin).toBe("https://www.google.com");
      expect(mapUrl.pathname).toBe("/maps/search/");
      expect(mapUrl.searchParams.get("api")).toBe("1");
      expect(mapUrl.searchParams.get("query")).toBe(
        `${provider.coordinates[0]},${provider.coordinates[1]}`,
      );
    }
  });

  it("provides current population context for all 46 barangay profiles", () => {
    const disclosureIds = new Set<string>();
    expect(barangayMicrosites).toHaveLength(46);
    expect(
      barangayMicrosites.reduce(
        (total, barangay) => total + barangay.population,
        0,
      ),
    ).toBe(MALAYBALAY_2024_POPULATION);
    expect(
      new Set(barangayMicrosites.map((barangay) => barangay.populationRank)),
    ).toHaveProperty("size", 46);
    for (const barangay of barangayMicrosites) {
      expect(barangay.introduction).toContain(barangay.name);
      expect(barangay.populationSummary).toContain("46 barangays");
      expect(barangay.cityPopulationShare).toBeGreaterThan(0);
      expect(barangay.populationReleaseSource.url).toContain(
        "rsso10.psa.gov.ph",
      );
      expect(barangay.heroImage?.url).toMatch(/^\/images\//);
      expect(barangay.officialRoster.officials).toHaveLength(10);
      expect(barangay.officialRoster.sangguniangBarangayMembers).toHaveLength(7);
      expect(barangay.officialRoster.punongBarangay.position).toBe(
        "Punong Barangay",
      );
      expect(barangay.officialRoster.skChairperson.position).toBe(
        "SK Chairperson",
      );
      expect(barangay.officialRoster.barangaySecretary.position).toBe(
        "Barangay Secretary",
      );
      expect(barangay.fullDisclosure.items.length).toBeGreaterThanOrEqual(1);
      expect(barangay.fullDisclosure.bdp2026Budget).toBe(1000000);
      expect(barangay.fullDisclosure.historicalSources.length).toBeGreaterThanOrEqual(4);
      for (const source of barangay.fullDisclosure.historicalSources) {
        expect(source.url).toMatch(/^https:\/\//);
        expect(source.label).toMatch(/2023|2024|2025|2026/);
      }
      for (const record of barangay.fullDisclosure.items) {
        expect(disclosureIds.has(record.id)).toBe(false);
        disclosureIds.add(record.id);
        expect(record.barangaySlug).toBe(barangay.slug);
        expect(record.primarySource.url).toMatch(/^https:\/\//);
        expect(record.primarySource.label.length).toBeGreaterThan(10);
        expect(record.backupSources.length).toBeGreaterThan(0);
        expect(record.summary.length).toBeGreaterThan(80);
        expect(record.discussion.howToVerify.length).toBeGreaterThan(40);
        if (record.category === "bids") {
          expect(record.utilizedAmount).toBeNull();
          expect(record.primarySource.label).toMatch(/FDP Form 10a|PhilGEPS award notice/);
          expect(record.summary).toContain("does not establish");
        }
      }
      expect(barangay.subdomainHost).toBe(
        `${barangay.slug}.bettermalaybalay.cloud`,
      );
      expect(barangay.subdomainUrl).toBe(
        `https://${barangay.slug}.bettermalaybalay.cloud`,
      );
      expect(barangay.mainPortalDomain).toBe("bettermalaybalay.cloud");
    }
    expect(barangaySlugFromHostname("dalwangan.bettermalaybalay.cloud")).toBe(
      "dalwangan",
    );
    expect(barangaySlugFromHostname("dalwangan.bettermc.ph")).toBe("dalwangan");
    expect(barangaySlugFromHostname("localhost", "?subdomain=casisang")).toBe(
      "casisang",
    );
    expect(
      barangayMicrosites.filter((barangay) =>
        barangay.heroImage?.url.includes("/barangay-heroes/"),
      ),
    ).toHaveLength(25);
    expect(
      barangayMicrosites.filter(
        (barangay) =>
          barangay.heroImage?.url ===
          "/images/malaybalay-city-hall-background.webp",
      ),
    ).toHaveLength(21);
    expect(disclosureIds.size).toBeGreaterThanOrEqual(46);
  });

  it("renders the independent-platform disclosure and homepage purpose", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByText(/Independent public information platform/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Welcome to BetterMC/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Your city. Your information. Your right to know."),
    ).toBeInTheDocument();
    expect(screen.getByText("Uswag Malaybalay")).toBeInTheDocument();
    expect(
      screen.getByText(/BetterMC is an independent civic technology platform/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Malaybalay time/i)).toBeInTheDocument();
    expect(screen.getByText("₱361.87M")).toBeInTheDocument();
    expect(reportedProcurementSavings.earlierPeriod + reportedProcurementSavings.latestYear).toBe(
      reportedProcurementSavings.amount,
    );
    expect(
      screen.getByRole("heading", { name: /Operating income by source/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Open guide: Business and trade" }),
    ).toHaveAttribute("href", "/services/business-trade");
    expect(screen.getByText("₱1,188,506,575.00")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Reported procurement savings/i }));
    expect(screen.getByRole("heading", { name: /Reported procurement savings, through 2025/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Read the report and its breakdown/i })).toHaveAttribute(
      "href",
      reportedProcurementSavings.source.url,
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Current operating income/i }),
    );
    expect(
      screen.getByRole("heading", { name: "Current operating income" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next image" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByText(/not affiliated with, endorsed by, or operated by/i)
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: /Find every barangay/i }),
    ).toHaveAttribute("href", "/barangays");
  });

  it("searches direct portal destinations across record types", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const search = screen.getByLabelText(/Search all BetterMC/i);

    fireEvent.change(search, { target: { value: "Busdi" } });
    expect(
      screen
        .getAllByRole("link", { name: /Busdi/i })
        .find((link) => link.getAttribute("href") === "/barangays/busdi"),
    ).toBeDefined();

    fireEvent.change(search, { target: { value: "Executive Order No. 19" } });
    expect(
      screen.getByRole("link", { name: /Executive Order No. 19/i }),
    ).toHaveAttribute(
      "href",
      "/legislation/executive-order-no-19-series-of-2026",
    );

    fireEvent.change(search, { target: { value: "ITB-2026-206" } });
    expect(
      screen.getByRole("link", { name: /ITB-2026-206/i }),
    ).toHaveAttribute("href", "/procurement/bidding-opportunities");
  });

  it("provides compact access to every primary portal page", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: /BetterMC site directory/i }));
    const navigation = screen.getByRole("navigation", { name: /BetterMC site directory/i });
    expect(within(navigation).getByRole("link", { name: /Legislation/i })).toHaveAttribute(
      "href",
      "/legislation",
    );
    expect(within(navigation).getByRole("link", { name: /Procurement/i })).toHaveAttribute(
      "href",
      "/procurement/livestreams",
    );
    expect(within(navigation).getByRole("link", { name: /Hearings/i })).toHaveAttribute("href", "/hearings");
    expect(within(navigation).getAllByRole("link")).toHaveLength(12);
  });

  it("lists source-linked transparency records", () => {
    render(
      <MemoryRouter initialEntries={["/transparency"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: /Public records/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Annual Budget Report")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Infrastructure/i }),
    ).toHaveAttribute("href", expect.stringContaining("/infrastructure"));
    expect(
      screen.getAllByRole("link", { name: /View context for/i }).length,
    ).toBeGreaterThan(0);
    fireEvent.click(
      screen.getAllByRole("link", { name: /View context for/i })[0],
    );
    expect(
      screen.getByRole("dialog", { name: /disclosure popout/i }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /Close record popout/i }),
    );
  });

  it("lists DILG-sourced barangay leadership", () => {
    render(
      <MemoryRouter initialEntries={["/barangays"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: /Explore all 46 barangays/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Gregorio D. Jaroy")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /088-813-1357/ })).toHaveAttribute(
      "href",
      "tel:0888131357",
    );
    expect(
      screen.getAllByRole("link", { name: /Open profile/i }).length,
    ).toBe(46);
  });

  it("renders a source-backed barangay landing page", () => {
    render(
      <MemoryRouter initialEntries={["/barangays/dalwangan"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: "Dalwangan", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Powered by BetterMC")).toBeInTheDocument();
    expect(
      screen.getByRole("region", {
        name: /Malaybalay flood, river, and forecast map controls/i,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Map Swivel & Orientation/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Camera swivel bearing/i)).not.toBeInTheDocument();
    expect(
      screen.getAllByText(/dalwangan\.bettermalaybalay\.cloud/i).length,
    ).toBeGreaterThan(0);
    const portalNav = within(screen.getByRole("region", {
      name: /Dalwangan embedded subdomain and main portal navigation/i,
    }));
    expect(portalNav.getByRole("link", { name: /BetterMC Home/i })).toHaveAttribute("href", "/");
    expect(
      screen.queryByRole("combobox", { name: /Choose a barangay profile/i }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("Royville C. Pasco").length).toBeGreaterThan(0);
    expect(screen.getAllByText("7,812").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", {
        name: /Barangay overview/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Share of city population/i)).toBeInTheDocument();
    expect(screen.queryByText(/Latest official count available in 2026/i)).not.toBeInTheDocument();
    const profileSectionOrder = Array.from(
      document.querySelectorAll(".barangay-profile-main > section"),
    ).map((section) => section.id);
    expect(profileSectionOrder.indexOf("leadership")).toBe(
      profileSectionOrder.indexOf("about") + 1,
    );
    expect(
      screen.getByRole("link", {
        name: /2024 POPCEN highlights for Malaybalay City/i,
      }),
    ).toHaveAttribute("href", expect.stringContaining("rsso10.psa.gov.ph"));
    expect(
      screen.getByRole("heading", {
        name: /Common committee areas/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Published projects mentioning Dalwangan/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/ITB-2026-/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", {
        name: /Barangay Dalwangan officials/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Open .* public profile/i })).toHaveLength(10);
    expect(
      screen.getByRole("heading", {
        name: /Source-linked projects and funding in Dalwangan/i,
      }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getAllByRole("button", {
        name: /Open full details & discussion/i,
      })[0],
    );
    expect(
      screen.getByRole("dialog", {
        name: /Dalwangan detail and discussion popout/i,
      }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /Close popout details/i }),
    );
    expect(
      screen.getByRole("heading", { name: /Urgent help across Malaybalay/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", {
        name: /DILG Barangay Officials Directory/i,
      }).length,
    ).toBeGreaterThan(0);
  });

  it("indexes searchable 2026 BAC notices without calling them awards", () => {
    render(
      <MemoryRouter initialEntries={["/procurement/bidding-opportunities"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", {
        name: /2026 bidding opportunities/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/A bidding opportunity is not an award/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Show more records/i })).toBeInTheDocument();
  });

  it("keeps award notices on dedicated internal procurement pages", () => {
    render(
      <MemoryRouter initialEntries={["/procurement/infrastructure-awards"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: /Infrastructure award notices/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("ITB-2024-012")).toBeInTheDocument();
    expect(
      screen.getByText(/does not by itself prove payment/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Goods and services awards/i }),
    ).toHaveAttribute("href", "/procurement/goods-services-awards");
  });

  it("separates mayoral issuances, council ordinances, and institutional recognition", () => {
    render(
      <MemoryRouter initialEntries={["/government?tab=records"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByText("Executive Order No. 23, Series of 2026"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Executive Order No. 19, Series of 2026"),
    ).toBeInTheDocument();
    expect(screen.getByText("Memorandum Circular No. 38")).toBeInTheDocument();
    expect(
      screen.getByText("Ordinance No. 1118, Series of 2026"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Ordinances, executive orders, and memorandum circulars/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /Open BetterMC record/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", { name: /Verified recognition/i }),
    ).toBeInTheDocument();
  });

  it("keeps a sourced plain-language page for each published measure", () => {
    expect(Object.keys(civicRecordContext).sort()).toEqual(
      civicRecords.map((record) => record.number).sort(),
    );
    render(
      <MemoryRouter
        initialEntries={[
          "/legislation/executive-order-no-19-series-of-2026",
        ]}
      >
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", {
        name: "Executive Order No. 19, Series of 2026",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /What this published measure does/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Project Monitoring and Evaluation Information System/i)
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(/not evidence that a particular project was completed/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Open official source/i }),
    ).toHaveAttribute("href", expect.stringContaining("malaybalaycity.gov.ph"));
  });

  it("expands a leader profile with verified office contact details", () => {
    render(
      <MemoryRouter initialEntries={["/government"]}>
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Jay Warren R\. Pabillaran/i }),
    );
    const expandedProfile = document.querySelector("article.expanded");
    expect(expandedProfile).not.toBeNull();
    const profile = within(expandedProfile as HTMLElement);
    expect(profile.getByText("City Mayor’s Office")).toBeInTheDocument();
    expect(
      profile.getByText(/New City Hall, National Highway/i),
    ).toBeInTheDocument();
    expect(
      profile.getByRole("link", { name: /0953-459-1777/ }),
    ).toHaveAttribute("href", "tel:09534591777");
    expect(
      profile.getByText(/City Mayor’s Office issuances/i),
    ).toBeInTheDocument();
  });

  it("publishes distinct councilor contacts and committee assignments", () => {
    const { unmount } = render(
      <MemoryRouter
        initialEntries={[
          "/government?tab=officials&official=jason-chad-j-ayala",
        ]}
      >
        <App />
      </MemoryRouter>,
    );
    const expandedCouncilor = document.querySelector("article.expanded");
    expect(expandedCouncilor).not.toBeNull();
    const councilorProfile = within(expandedCouncilor as HTMLElement);
    expect(
      councilorProfile.getByText("Published constituency contact"),
    ).toBeInTheDocument();
    expect(
      councilorProfile.getByRole("link", { name: /0994-514-3081/ }),
    ).toHaveAttribute("href", "tel:09945143081");
    expect(councilorProfile.getByText("Quasi-Judicial")).toBeInTheDocument();
    expect(
      councilorProfile.getByText(/This profile lists only measures that name this councilor/i),
    ).toBeInTheDocument();
    expect(councilorProfile.queryByText(/City Council measures ·/i)).not.toBeInTheDocument();
    expect(councilorProfile.queryByText(/Ordinance No\. 1050/)).not.toBeInTheDocument();
    expect(
      councilorProfile.getByText("Environment and Natural Resources"),
    ).toBeInTheDocument();
    expect(councilorProfile.getByRole("region", { name: "Committee work" })).toBeInTheDocument();
    expect(councilorProfile.getByRole("region", { name: "Public records" })).toBeInTheDocument();
    expect(councilorProfile.getByRole("link", { name: /Browse city records/i })).toHaveAttribute("href", "/government?tab=records");
    unmount();

    render(
      <MemoryRouter
        initialEntries={[
          "/government?tab=officials&official=julius-n-manghano",
        ]}
      >
        <App />
      </MemoryRouter>,
    );
    const expandedAbcProfile = document.querySelector("article.expanded");
    expect(expandedAbcProfile).not.toBeNull();
    const abcProfile = within(expandedAbcProfile as HTMLElement);
    expect(
      abcProfile.getByText("Published constituency contact"),
    ).toBeInTheDocument();
    expect(
      abcProfile.getByRole("link", { name: /0951-692-1915/ }),
    ).toHaveAttribute("href", "tel:09516921915");
  });

  it("shows individually sourced city ordinances and House bills under the named officials", () => {
    const pagalingRender = render(
      <MemoryRouter
        initialEntries={[
          "/government?tab=officials&official=kathleen-cecille-c-pagaling",
        ]}
      >
        <App />
      </MemoryRouter>,
    );
    const pagalingProfile = within(
      document.querySelector("article.expanded") as HTMLElement,
    );
    expect(pagalingProfile.getByText(/Ordinance No\. 1050/)).toBeInTheDocument();
    expect(pagalingProfile.queryByText(/Also reported by GMA News/i)).not.toBeInTheDocument();
    expect(
      pagalingProfile.getByRole("link", { name: /Philippine News Agency report/i }),
    ).toHaveAttribute("href", expect.stringContaining("edgedavao.net"));
    expect(pagalingProfile.getByText(/exact approval date/i)).toBeInTheDocument();
    expect(
      pagalingProfile.getByRole("heading", { name: /Ordinances · 7/i }),
    ).toBeInTheDocument();
    expect(
      pagalingProfile.getByRole("heading", { name: /Resolutions · 7/i }),
    ).toBeInTheDocument();
    expect(
      pagalingProfile.getByRole("heading", { name: /Partnerships & MOAs · 9 agreements/i }),
    ).toBeInTheDocument();
    expect(
      pagalingProfile.getByRole("heading", { name: /Health & Medical Partnerships · 6 agreements/i }),
    ).toBeInTheDocument();
    expect(
      pagalingProfile.getByRole("heading", { name: /Social Welfare Partnerships · 2 agreements/i }),
    ).toBeInTheDocument();
    expect(
      pagalingProfile.getByRole("heading", { name: /Institutional & Research Partnerships · 1 agreement/i }),
    ).toBeInTheDocument();
    for (const expectedTitle of [
      "Peer Support Groups for Mental Health",
      "Prevention of Adolescent Pregnancy",
      "Additional Benefits for Solo Parents",
      "Anti-OSAEC & CSAEM Ordinance",
      "Barangay Sanitation Inspectors",
      "Expanded 4Ps Beneficiary Benefits",
      "Adopting the Mental Health Act",
      "Solo Parent Data Sharing Agreement",
      "Gender Advocacy — Purple March",
      "Gender Advocacy — Pink October",
      "Gender Advocacy — Blue November",
      /HEALTH PROMOTION FRAMEWORK STRATEGY \(HPFS\) 2030/i,
      /PHILHEALTH \(PHIC\) YAKAP PROVIDER/i,
      "Community Feeding Program",
      "Surgical Condition Support",
      "Zero Open Defecation Campaign",
      "PhilHealth Konsulta Provider",
      "Medical & Dialysis Center",
      "Congenital Condition Support",
      "Child Welfare Services",
      "Women & Child-Friendly Space Kits",
      "Animal Health Risk Monitoring",
    ]) {
      expect(pagalingProfile.getByText(expectedTitle)).toBeInTheDocument();
    }
    pagalingRender.unmount();

    const pagalingLegislativePage = render(
      <MemoryRouter
        initialEntries={["/legislation/officials/kathleen-cecille-c-pagaling"]}
      >
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByText(/Peer Support Groups for Mental Health/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Central Mindanao University/i),
    ).toBeInTheDocument();
    pagalingLegislativePage.unmount();

    const representativeRender = render(
      <MemoryRouter
        initialEntries={[
          "/government?tab=officials&official=jonathan-keith-t-flores",
        ]}
      >
        <App />
      </MemoryRouter>,
    );
    const representativeProfile = within(
      document.querySelector("article.expanded") as HTMLElement,
    );
    expect(
      representativeProfile.getByText(/House Bill No\. 379/),
    ).toBeInTheDocument();
    expect(
      representativeProfile.getByRole("link", { name: /House Bill No\. 379/i }),
    ).toHaveAttribute("href", expect.stringContaining("HB00379"));
    expect(
      representativeProfile.getByText(/Pending with the House Committee on Health since July 29, 2025/i),
    ).toBeInTheDocument();
    representativeRender.unmount();
  });

  it("publishes contribution, city contact, Facebook, and BetterGov links in the footer", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("link", { name: /Contribute on GitHub/i }),
    ).toHaveAttribute("href", "https://github.com/lordzxxxx/BetterMC");
    expect(
      screen.getByRole("link", { name: /BetterMC on Facebook/i }),
    ).toHaveAttribute(
      "href",
      "https://www.facebook.com/profile.php?id=61596547555480",
    );
    expect(
      screen.getByRole("link", { name: /0917 188 4225/i }),
    ).toHaveAttribute("href", "tel:09171884225");
    expect(
      screen.getByRole("link", { name: /Official Facebook page/i }),
    ).toHaveAttribute(
      "href",
      "https://www.facebook.com/profile.php?id=100063747444247",
    );
    expect(
      screen.getByRole("link", { name: /Powered by\s*BetterGov/i }),
    ).toHaveAttribute("href", "https://lgu.bettergov.ph/");
    expect(screen.getByText("Cost of This Website")).toBeInTheDocument();
    expect(screen.getByText("Cost to the People of Malaybalay")).toBeInTheDocument();
    expect(screen.getAllByText("₱0")).toHaveLength(2);
  });

  it("uses an accessible request-type menu with keyboard selection", () => {
    render(
      <MemoryRouter initialEntries={["/participate"]}>
        <App />
      </MemoryRouter>,
    );
    const trigger = screen.getByRole("button", { name: /Request type/i });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const brokenLink = screen.getByRole("option", {
      name: "Report a broken link",
    });
    fireEvent.click(brokenLink);
    expect(trigger).toHaveTextContent("Report a broken link");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps closed mobile navigation out of keyboard interaction", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    const menu = document.getElementById("mobile-navigation");
    expect(menu).toHaveAttribute("inert");

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(menu).not.toHaveAttribute("inert");

    fireEvent.pointerDown(document.body);
    expect(menu).toHaveAttribute("inert");
    expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("submits participation feedback and resets form without errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          message: "Your submission was saved for moderator review.",
        }),
        {
          status: 201,
          headers: { "content-type": "application/json" },
        },
      ),
    );
    render(
      <MemoryRouter initialEntries={["/participate"]}>
        <App />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText(/Subject/i), {
      target: { value: "ayohon" },
    });
    fireEvent.change(screen.getByLabelText(/Details/i), {
      target: { value: "sdadsa" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "pepotsagreda@gmail.com" },
    });
    const form = screen
      .getByRole("button", { name: /Send for review/i })
      .closest("form")!;
    fireEvent.submit(form);
    await waitFor(() => {
      expect(
        screen.getByText(/Your submission was saved for moderator review/i),
      ).toBeInTheDocument();
    });
  });

  it("publishes current service documents and locally stored official portraits", () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={["/services"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("tab", { name: "City resources" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    fireEvent.click(screen.getByRole("tab", { name: "GAD documents" }));
    expect(
      screen.getByRole("link", { name: /2026 GAD Plan and Budget/i }),
    ).toHaveAttribute("href", expect.stringContaining("GPB-2026.pdf"));
    expect(
      screen
        .getAllByRole("link", { name: /Citizen’s Charter/i })
        .some((link) =>
          link.getAttribute("href") ===
          "https://sakata.malaybalaycity.gov.ph/citizens-charter/",
        ),
    ).toBe(true);
    unmount();

    render(
      <MemoryRouter initialEntries={["/government"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("img", {
        name: /Jay Warren R. Pabillaran, City Mayor/i,
      }),
    ).toHaveAttribute(
      "src",
      "/images/officials/mayor-jay-warren-pabillaran.webp",
    );
  });

  it("guides residents to nearest service providers and allows interactive transactions with requirements checklist", () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={["/services"]}>
        <App />
      </MemoryRouter>,
    );

    // Main services page should render the quick finder
    expect(
      screen.getByRole("heading", {
        name: /Find the closest facility & start your transaction/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Nearest Match/i),
    ).toBeInTheDocument();
    unmount();

    // Navigate to a specific service category (Business and Trade)
    render(
      <MemoryRouter initialEntries={["/services/business-trade"]}>
        <App />
      </MemoryRouter>,
    );

    // Shows origin selector with Malaybalay barangays
    expect(
      screen.getByLabelText(/Select your location for nearest service providers/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Nearest providers calculated from your barangay/i),
    ).toBeInTheDocument();

    // Ranks nearest providers (BPLD New City Hall, DTI Bukidnon, SEC/IPOPHL)
    const bpldHeading = screen.getByRole("heading", {
      name: /Business Permits and Licensing Division/i,
    });
    expect(bpldHeading).toBeInTheDocument();
    expect(
      screen.getAllByText(/Nearest Provider/i).length,
    ).toBeGreaterThanOrEqual(1);

    // Renders available transactions with statutory processing time
    expect(
      screen.getByText(/New Business Permit & Mayor’s Permit Registration/i),
    ).toBeInTheDocument();

    // Clicking "Make Transaction & Checklist" on BPLD opens the interactive modal
    const bpldCard = bpldHeading.closest("article")!;
    const bpldTxBtn = within(bpldCard).getAllByRole("button", {
      name: /Make Transaction & Checklist/i,
    })[0];
    fireEvent.click(bpldTxBtn);

    // Transaction modal should display the tracking reference, statutory info, and interactive checklist
    expect(
      screen.getByText(/Official Tracking Reference:/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/BMC-TX-2026-BUS-/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Documentary Requirements Checklist/i,
      }),
    ).toBeInTheDocument();

    // User can check off requirements
    const firstCheckbox = screen.getAllByRole("checkbox")[0];
    expect(firstCheckbox).not.toBeChecked();
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();

    // Step-by-step walkthrough is present
    expect(
      screen.getByRole("heading", {
        name: /Step-by-Step Transaction Walkthrough/i,
      }),
    ).toBeInTheDocument();

    // Action button to launch official government portal is present and secure
    const launchBtn = screen.getByRole("link", {
      name: /Open BPLD Charter & Requirements/i,
    });
    expect(launchBtn).toHaveAttribute(
      "href",
      "https://sakata.malaybalaycity.gov.ph/citizens-charter/",
    );
    expect(launchBtn).toHaveAttribute("target", "_blank");
    expect(launchBtn).toHaveAttribute("rel", "noopener noreferrer");

    // Close button dismisses the modal
    const closeBtn = screen.getByRole("button", {
      name: /Close transaction guide/i,
    });
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/Official Tracking Reference:/i)).not.toBeInTheDocument();
  });

  it("ensures every school and DepEd office has an accurate, localized Malaybalay address and barangay", () => {
    for (const school of educationInstitutions) {
      expect(school.address).not.toMatch(/Address not confirmed|Address not published/i);
      expect(school.address).toMatch(/Malaybalay City/i);
      expect(school.barangay).toBeTruthy();
    }
    for (const office of educationOffices) {
      expect(office.address).not.toMatch(/Address not published/i);
      expect(office.address).toMatch(/Malaybalay City/i);
    }
  });

  it("renders the first-time visitor welcome card, homepage news cards, and civic discussion cards", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", {
        name: /How to navigate Malaybalay City's public records on BetterMC/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Latest news, ordinances, hearings, and procurement updates/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Government discussions and policy context/i,
      }),
    ).toBeInTheDocument();

    // Filter news by category
    fireEvent.click(
      screen.getByRole("tab", { name: "Procurement & Bidding" }),
    );
    expect(
      screen.getByText(/BAC LGU Malaybalay 2026 Bidding Opportunities/i),
    ).toBeInTheDocument();
  });

  it("renders the dedicated BAC LGU Malaybalay livestream monitoring hub with .docx and .txt downloads", () => {
    render(
      <MemoryRouter initialEntries={["/procurement/livestreams"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", {
        name: /BAC bidding records and recordings/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Download Word Report \(\.docx\)/i }),
    ).toHaveAttribute(
      "href",
      "/docs/BAC_LGU_MALAYBALAY_LIVESTREAM_DOCUMENTATION.docx",
    );
    expect(
      screen.getByRole("link", { name: /Download Plain-Text Report \(\.txt\)/i }),
    ).toHaveAttribute(
      "href",
      "/docs/BAC_LGU_MALAYBALAY_LIVESTREAM_DOCUMENTATION.txt",
    );
    expect(
      screen.getByText(/RRN Construction & Development Corporation/i),
    ).toBeInTheDocument();
  });

  it("integrates BetterGov.PH legislative hearings separately from BAC procurement discussions", () => {
    render(
      <MemoryRouter initialEntries={["/hearings"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", {
        name: /Hearings and sessions/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Public record sections" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Published ordinances & executive issuances/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "BAC recordings" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        /Committee Hearing on the Proposed FY 2027 City Annual Budget/i,
      ),
    ).toBeInTheDocument();
  });

  it("integrates BetterGov.PH budget transparency with clear fiscal year and scope separation", () => {
    render(
      <MemoryRouter initialEntries={["/budget"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", {
        name: /Understand where public funds come from and which programs receive funding/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /BetterGov\.PH Budget \(hgab\/2027\/overview\)/i,
      }),
    ).toHaveAttribute("href", "https://budget.bettergov.ph/hgab/2027/overview");
    expect(
      screen.getByText(/46 Barangay Development Projects/i),
    ).toBeInTheDocument();
  });

  it("attaches verified official Facebook pages to all officials including Datu Sumbongan", () => {
    const verifiedOfficials = officials.filter((o) => o.facebookUrl);
    expect(verifiedOfficials).toHaveLength(17);
    const datuSumbongan = officials.find((o) => o.name === "Datu Sumbongan");
    expect(datuSumbongan?.facebookUrl).toBe(
      "https://www.facebook.com/profile.php?id=100080935946632",
    );
    expect(unmatchedSuppliedFacebookProfiles).toHaveLength(0);

    render(
      <MemoryRouter
        initialEntries={[
          "/government?tab=officials&official=alan-ryann-o-legaspi",
        ]}
      >
        <App />
      </MemoryRouter>,
    );
    const modal = within(
      document.querySelector("article.expanded") as HTMLElement,
    );
    expect(
      modal.getByRole("link", { name: /Konsehal Manoy Legaspi/i }),
    ).toHaveAttribute("href", "https://www.facebook.com/KonsehalManoyLegaspi");
    expect(
      screen.getByRole("link", { name: /IPMR Datu Sumbongan/i }),
    ).toHaveAttribute(
      "href",
      "https://www.facebook.com/profile.php?id=100080935946632",
    );
  });

  it("reorganizes Procurement, Transparency, Hearings, and Legislation with distinct purposes and no overlapping sub-navigation", () => {
    // 1. Default Procurement link points to /procurement/livestreams (BAC Records & Recordings)
    const home = render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    const primaryNav = within(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    );
    expect(
      primaryNav.getByRole("link", { name: "Procurement" }),
    ).toHaveAttribute("href", "/procurement/livestreams");
    const mobileTabNav = within(
      screen.getByRole("navigation", { name: "Quick mobile app navigation" }),
    );
    expect(
      mobileTabNav.getByRole("link", { name: "Procurement" }),
    ).toHaveAttribute("href", "/procurement/livestreams");
    home.unmount();

    // 2. Transparency (/transparency) keeps only Full Disclosure Catalog and Budget Transparency Hub
    const transparencyView = render(
      <MemoryRouter initialEntries={["/transparency"]}>
        <App />
      </MemoryRouter>,
    );
    const transparencyNav = within(
      screen.getByRole("navigation", {
        name: "Transparency and budget sections",
      }),
    );
    const transparencyLinks = transparencyNav.getAllByRole("link");
    expect(transparencyLinks).toHaveLength(2);
    expect(
      transparencyNav.getByRole("link", { name: "Full Disclosure Catalog" }),
    ).toHaveAttribute("href", "/transparency");
    expect(
      transparencyNav.getByRole("link", { name: "Budget Transparency Hub" }),
    ).toHaveAttribute("href", "/budget");
    expect(
      transparencyNav.queryByRole("link", {
        name: /BAC Livestreams & Bidding/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      transparencyNav.queryByRole("link", {
        name: /Legislative & Budget Hearings/i,
      }),
    ).not.toBeInTheDocument();
    transparencyView.unmount();

    // 3. Legislation (/legislation) is exclusively for Published Ordinances & Executive Issuances
    const legislationView = render(
      <MemoryRouter initialEntries={["/legislation"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", {
        name: /Published measures, readable inside BetterMC/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Legislative sections" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: /Legislative sessions & public hearings/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Proposed 2027 Annual Budget/i }),
    ).not.toBeInTheDocument();
    legislationView.unmount();
  });
});
