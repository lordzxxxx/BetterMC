import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import {
  barangayMicrosites,
  barangaySlugFromHostname,
  MALAYBALAY_2024_POPULATION,
} from "./barangayProfiles";
import { civicRecords, reportedProcurementSavings } from "./data";
import { civicRecordContext } from "./civicRecordContext";

describe("BetterMC public portal", () => {
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
      expect(barangay.fullDisclosure.historicalSources).toHaveLength(4);
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
          expect(record.primarySource.label).toContain("FDP Form 10a");
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
      "/procurement/bidding-opportunities",
    );
    expect(within(navigation).getAllByRole("link")).toHaveLength(9);
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
    expect(screen.queryByText(/Share of city population/i)).not.toBeInTheDocument();
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
    expect(screen.getByRole("button", { name: /Show all 212 records/i })).toBeInTheDocument();
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
    expect(
      pagalingProfile.getByRole("link", { name: /Philippine News Agency report/i }),
    ).toHaveAttribute("href", expect.stringContaining("edgedavao.net"));
    expect(pagalingProfile.getByText(/exact approval date/i)).toBeInTheDocument();
    pagalingRender.unmount();

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
    expect(
      screen.getByRole("link", { name: /2026 GAD Plan and Budget/i }),
    ).toHaveAttribute("href", expect.stringContaining("GPB-2026.pdf"));
    expect(screen.getByText("195,046 residents · 46 barangays")).toBeInTheDocument();
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
});
