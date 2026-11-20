import { expect, test, type Page } from "@playwright/test";

async function assertAlignedCardGrid(
  page: Page,
  cardSelector: string,
  summarySelector: string,
  trackSelectors: string[],
) {
  const result = await page.evaluate(
    ({ cardSel, sumSel, tracks }) => {
      const cards = Array.from(document.querySelectorAll(cardSel));
      const truncated = cards.filter((c) => {
        const s = c.querySelector(sumSel);
        return s ? s.scrollHeight > s.clientHeight + 2 : false;
      }).length;
      const rows: Array<{ top: number; cards: Element[] }> = [];
      for (const card of cards) {
        const top = card.getBoundingClientRect().top;
        let row = rows.find((r) => Math.abs(r.top - top) < 6);
        if (!row) {
          row = { top, cards: [] };
          rows.push(row);
        }
        row.cards.push(card);
      }
      const mismatches: string[] = [];
      rows.forEach((row, ri) => {
        if (row.cards.length < 2) return;
        const cardHeights = row.cards.map((c) => c.getBoundingClientRect().height);
        if (Math.max(...cardHeights) - Math.min(...cardHeights) > 2) {
          mismatches.push(`row ${ri} height variance: ${cardHeights.join(",")}`);
        }
        for (const sel of tracks) {
          const rects = row.cards
            .map((c) => c.querySelector(sel)?.getBoundingClientRect())
            .filter((r): r is DOMRect => Boolean(r));
          if (rects.length !== row.cards.length) continue;
          const tops = rects.map((r) => r.top);
          const heights = rects.map((r) => r.height);
          if (Math.max(...tops) - Math.min(...tops) > 2) {
            mismatches.push(`row ${ri} ${sel} top variance`);
          }
          if (Math.max(...heights) - Math.min(...heights) > 2) {
            mismatches.push(`row ${ri} ${sel} height variance`);
          }
        }
      });
      return { count: cards.length, truncated, mismatches };
    },
    { cardSel: cardSelector, sumSel: summarySelector, tracks: trackSelectors },
  );
  expect(result.count).toBeGreaterThan(0);
  expect(result.truncated).toBe(0);
  expect(result.mismatches).toEqual([]);
}

test.describe("Government Offices Directory, Subdomains & PESO Hub", () => {
  test("renders /offices cleanly across desktop and 320px mobile with valid logo images", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/offices");

    await expect(
      page.getByRole("heading", { name: /City Offices, Divisions & Partner Institutions/i }),
    ).toBeVisible();

    await assertAlignedCardGrid(page, ".office-dir-card", ".office-dir-summary", [
      ".office-dir-top",
      ".office-dir-facts",
      ".office-dir-actions",
    ]);
    await assertAlignedCardGrid(page, ".special-body-card", "p:not(.special-body-meta)", [
      ".special-body-footer",
    ]);

    const missingFactsOrMicrosite = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".office-dir-card")).filter((card) => {
        const text = card.querySelector(".office-dir-facts")?.textContent ?? "";
        const micrositeHref = card
          .querySelector(".office-dir-actions .office-microsite-link")
          ?.getAttribute("href");
        return (
          !text.includes("Location") ||
          !text.includes("Contact") ||
          !text.includes("Email") ||
          !micrositeHref?.startsWith("https://") ||
          !micrositeHref.includes(".bettermalaybalay.cloud")
        );
      }).length;
    });
    expect(missingFactsOrMicrosite).toBe(0);

    const imgs = page.locator(".office-logo-frame img");
    const imgCount = await imgs.count();
    expect(imgCount).toBeGreaterThan(15);
    for (let i = 0; i < imgCount; i += 1) {
      const img = imgs.nth(i);
      await img.scrollIntoViewIfNeeded();
      await expect(async () => {
        const ok = await img.evaluate(
          (el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0,
        );
        expect(ok).toBe(true);
      }).toPass({ timeout: 5000 });
    }

    // 320px narrow mobile overflow check
    await page.setViewportSize({ width: 320, height: 740 });
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow).toBe(false);
  });

  test("navigates PESO hub, filters expired CSC Form 9 archive, and opens job detail", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/peso");

    await expect(
      page.getByRole("heading", { name: "Public Employment Service Office — Malaybalay City" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /peso\.bettermalaybalay\.cloud/i }).first()).toBeVisible();

    await assertAlignedCardGrid(page, ".peso-job-card", ".peso-job-summary", [
      ".peso-job-meta",
      ".peso-job-card-footer",
    ]);

    await page.setViewportSize({ width: 320, height: 740 });
    const overflowOnPeso = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflowOnPeso).toBe(false);

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.getByRole("button", { name: /Expired \/ CS Form No\. 9 Archive/i }).click();
    await page.getByRole("link", { name: "Planning Officer IV" }).click();

    await expect(page).toHaveURL(/\/jobs\/csc-2024-planning-officer-iv-cpdo$/);
    await expect(page.getByRole("alert")).toContainText(/expired/i);

    await page.setViewportSize({ width: 320, height: 740 });
    const overflowOnJobDetail = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflowOnJobDetail).toBe(false);

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/jobs/peso-nsrp-jobseeker-registration-matching");
    const detailMain = page.locator(".job-detail-main");
    await expect(detailMain.getByRole("heading", { name: "Official Contact Details" })).toBeVisible();
    const sidebarPosition = await page
      .locator(".job-detail-sidebar")
      .evaluate((el) => getComputedStyle(el).position);
    expect(sidebarPosition).toBe("static");
    const compactSourceLink = page.locator(".detail-source-link");
    await expect(compactSourceLink).toBeVisible();
    const sourceBox = await compactSourceLink.boundingBox();
    expect(sourceBox?.height ?? 0).toBeLessThan(48);
  });

  test("supports office subdomain query previews (?office=cho, ?office=peso, ?office=treasurer) without warning banners", async ({
    page,
  }) => {
    await page.goto("/?office=mayor");
    await expect(page.getByRole("heading", { name: "Office of the City Mayor" })).toBeVisible();
    const homeButton = page.locator(".microsite-home-button");
    await expect(homeButton).toHaveText("BetterMC Home");
    await expect(homeButton).toHaveAttribute("href", "/");
    await expect(page.locator(".office-hero-breadcrumb")).toHaveCount(0);
    await expect(page.getByText(/City Offices \(\d+\)/i)).toHaveCount(0);

    const actionLayout = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll(".office-hero-actions .button")).map((el) =>
        el.getBoundingClientRect(),
      );
      const gaps: number[] = [];
      for (let i = 1; i < buttons.length; i += 1) {
        if (Math.abs(buttons[i].top - buttons[i - 1].top) < 4) {
          gaps.push(Math.round(buttons[i].left - buttons[i - 1].right));
        }
      }
      return {
        count: buttons.length,
        heights: buttons.map((b) => Math.round(b.height)),
        gaps,
      };
    });
    expect(actionLayout.count).toBe(3);
    expect(Math.max(...actionLayout.heights) - Math.min(...actionLayout.heights)).toBeLessThanOrEqual(2);
    expect(actionLayout.gaps.every((g) => g >= 8)).toBe(true);

    await page.goto("/?office=cho");
    await expect(page.getByRole("heading", { name: "City Health Office" })).toBeVisible();
    await expect(page.getByRole("link", { name: /cho\.bettermalaybalay\.cloud/i }).first()).toBeVisible();
    await expect(page.getByText(/Source Cross-Reference Note:/i)).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Officials & Assigned Personnel" })).toContainText(
      "Dr. Dennis P. Sangalang, MD",
    );

    await page.goto("/?office=peso");
    await expect(
      page.getByRole("heading", { name: "Public Employment Service Office — Malaybalay City" }),
    ).toBeVisible();
    await expect(page.getByText(/Source Cross-Reference Note:/i)).toHaveCount(0);

    await page.goto("/?office=treasurer");
    await expect(page.getByRole("region", { name: "Officials & Assigned Personnel" })).toContainText(
      "Bella Stephanie B. Saavedra, CPA",
    );
    await page.setViewportSize({ width: 320, height: 740 });
    const treasurerOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(treasurerOverflow).toBe(false);
  });

  test("cross-links /services/employment cleanly to /peso and /jobs", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/services/employment");

    await page.getByRole("link", { name: /Open PESO Hub & Jobs/i }).click();
    await expect(page).toHaveURL(/\/peso$/);

    await page.goto("/jobs");
    await expect(
      page.getByRole("heading", { name: /Job Vacancies, Job Fairs & Livelihood Programs/i }),
    ).toBeVisible();
  });

  test("keeps City Offices in primary nav, routes PESO via /offices, and renders personnel cleanly on 320px mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const desktopNav = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(desktopNav.getByRole("link", { name: "City Offices" })).toBeVisible();
    await expect(desktopNav.getByRole("link", { name: "PESO & Jobs" })).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Featured Malaybalay portals" })).toHaveCount(0);

    await page.goto("/?office=budget");
    const personnelSection = page.getByRole("region", { name: "Officials & Assigned Personnel" });
    await expect(personnelSection).toBeVisible();
    await expect(personnelSection.getByText("City Budget Operations Division", { exact: true })).toBeVisible();
    await expect(personnelSection.getByText("Mary Grace R. Alenton")).toBeVisible();

    await page.setViewportSize({ width: 320, height: 740 });
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow).toBe(false);

    const mobileTabs = page.getByRole("navigation", { name: "Quick mobile app navigation" });
    await expect(mobileTabs.getByRole("link", { name: "Offices" })).toBeVisible();
    await expect(mobileTabs.getByRole("link", { name: "Barangays" })).toBeVisible();
    await expect(mobileTabs.getByRole("link", { name: "PESO" })).toHaveCount(0);
  });

  test("organizes Barangay Officials cards cleanly and aligns rows across desktop and mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/barangays/bangcud");

    await expect(page.getByRole("heading", { name: /Barangay Bangcud officials/i })).toBeVisible();
    const roles = await page
      .locator(".barangay-official-card .barangay-official-role span:last-child")
      .allTextContents();
    expect(roles.slice(0, 3)).toEqual(["Punong Barangay", "Barangay Secretary", "SK Chairperson"]);

    await assertAlignedCardGrid(page, ".barangay-official-card", ".barangay-official-name", [
      ".barangay-official-head",
      ".barangay-official-contacts",
      ".barangay-official-footer",
    ]);

    await page.locator(".barangay-official-action").first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /Close popout details/i }).click();

    await page.setViewportSize({ width: 320, height: 740 });
    const hasMobileOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasMobileOverflow).toBe(false);
  });

  test("separates /offices/sp City Office page from sp subdomain microsite and preserves undistorted SP emblem", async ({
    page,
    baseURL,
  }) => {
    const base = new URL(baseURL || "http://127.0.0.1:5173");
    const assertHeroSpLogoUndistorted = async () => {
      const logo = page.locator(".office-logo-frame.is-hero img");
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute("src", "/images/offices/sangguniang-panlungsod.jpg");
      await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.complete)).toBe(true);
      const metrics = await logo.evaluate((img: HTMLImageElement) => {
        const rect = img.getBoundingClientRect();
        return {
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          width: rect.width,
          height: rect.height,
        };
      });
      expect(metrics.complete).toBe(true);
      expect(metrics.naturalWidth).toBeGreaterThan(0);
      expect(metrics.naturalHeight).toBeGreaterThan(0);
      const naturalRatio = metrics.naturalWidth / metrics.naturalHeight;
      const renderedRatio = metrics.width / metrics.height;
      expect(Math.abs(naturalRatio - renderedRatio)).toBeLessThan(0.05);
    };

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/offices/sp");
    await expect(
      page.getByRole("heading", { name: "Office of the Sangguniang Panlungsod & SP Secretariat" }),
    ).toBeVisible();
    const officeHomeBtn = page.locator(".microsite-home-button");
    await expect(officeHomeBtn).toHaveCount(1);
    await expect(officeHomeBtn).toContainText("BetterMC Home");
    await expect(officeHomeBtn).toHaveAttribute("href", "/");
    await assertHeroSpLogoUndistorted();

    await page.setViewportSize({ width: 320, height: 740 });
    const officeMobileOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(officeMobileOverflow).toBe(false);

    const spUrl = new URL(base.toString());
    spUrl.hostname = "sp.localhost";
    spUrl.pathname = "/transparency";

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(spUrl.toString());
    await expect(
      page.getByRole("heading", { name: "Office of the Sangguniang Panlungsod & SP Secretariat" }),
    ).toBeVisible();
    await expect(page.locator(".microsite-home-button")).toHaveCount(0);
    await expect(page.locator(".microsite-home-nav")).toHaveCount(0);
    await expect(page.getByText(/City Offices \(\d+\)/i)).toHaveCount(0);
    await assertHeroSpLogoUndistorted();

    await page.setViewportSize({ width: 320, height: 740 });
    const spMobileOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(spMobileOverflow).toBe(false);
    await expect(page.locator(".microsite-home-button")).toHaveCount(0);

    spUrl.pathname = "/";
    await page.goto(spUrl.toString());
    await expect(
      page.getByRole("heading", { name: "Office of the Sangguniang Panlungsod & SP Secretariat" }),
    ).toBeVisible();
    await expect(page.locator(".microsite-home-button")).toHaveCount(0);

    const mayorUrl = new URL(base.toString());
    mayorUrl.hostname = "mayor.localhost";
    mayorUrl.pathname = "/";
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(mayorUrl.toString());
    await expect(page.getByRole("heading", { name: "Office of the City Mayor" })).toBeVisible();
    const mayorHomeBtn = page.locator(".microsite-home-button");
    await expect(mayorHomeBtn).toHaveCount(1);
    await expect(mayorHomeBtn).toContainText("BetterMC Home");
    await expect(mayorHomeBtn).toHaveAttribute("href", "https://www.bettermalaybalay.cloud");
  });

  test("renders dedicated MicrositeHeader across standalone Office, School, and Barangay microsites without altering internal BetterMC headers", async ({
    page,
    baseURL,
  }) => {
    const base = new URL(baseURL || "http://127.0.0.1:5173");

    const buildSubUrl = (subdomain: string, pathname = "/") => {
      const target = new URL(base.toString());
      target.hostname = `${subdomain}.localhost`;
      target.pathname = pathname;
      return target.toString();
    };

    // 1. Standalone Office, School, and Barangay microsites on desktop + 320px mobile
    for (const entry of [
      {
        url: buildSubUrl("sp", "/transparency"),
        kind: "office",
        heading: "Office of the Sangguniang Panlungsod & SP Secretariat",
        anchorHref: "#services",
        anchorText: "Services",
      },
      {
        url: buildSubUrl("bukidnon-state-university", "/"),
        kind: "school",
        heading: "Bukidnon State University",
        anchorHref: "#facts",
        anchorText: "School Facts",
      },
      {
        url: buildSubUrl("bangcud", "/"),
        kind: "barangay",
        heading: "Bangcud",
        anchorHref: "#disclosure",
        anchorText: "Disclosure",
      },
    ]) {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(entry.url);
      await expect(
        page.getByRole("heading", { name: entry.heading, exact: true, level: 1 }),
      ).toBeVisible();
      await expect(page.locator(".site-header")).toHaveCount(0);
      await expect(page.locator(".independence-bar")).toHaveCount(0);
      await expect(page.locator(".mobile-bottom-app-bar")).toHaveCount(0);

      const msHeader = page.locator(".microsite-header");
      await expect(msHeader).toBeVisible();
      await expect(msHeader).toHaveAttribute("data-microsite-kind", entry.kind);
      await expect(msHeader.locator(".microsite-brand")).toHaveAttribute(
        "href",
        "https://www.bettermalaybalay.cloud",
      );
      await expect(msHeader.locator(".microsite-brand-title")).toContainText("Uswag Malaybalay");
      await expect(msHeader.locator(".microsite-brand-divider")).toHaveCount(0);
      const brandMetrics = await msHeader.evaluate((header) => {
        const brand = header.querySelector(".microsite-brand");
        const assets = header.querySelector(".microsite-brand-assets");
        const main = header.querySelector(".microsite-brand-main");
        const wordmark = header.querySelector(".microsite-brand-wordmark");
        const strong = header.querySelector(".microsite-brand-title strong");
        if (!brand || !assets || !main || !wordmark || !strong) return null;
        return {
          gap: getComputedStyle(brand).gap,
          assetsWidth: assets.getBoundingClientRect().width,
          mainWidth: main.getBoundingClientRect().width,
          mainHeight: main.getBoundingClientRect().height,
          wordmarkWidth: wordmark.getBoundingClientRect().width,
          wordmarkHeight: wordmark.getBoundingClientRect().height,
          titleFontSize: parseFloat(getComputedStyle(strong).fontSize),
        };
      });
      expect(brandMetrics).toEqual({
        gap: "11px",
        assetsWidth: 70,
        mainWidth: 44,
        mainHeight: 34,
        wordmarkWidth: 66,
        wordmarkHeight: 18,
        titleFontSize: 20,
      });
      await expect(
        msHeader.locator(".microsite-section-nav a", { hasText: entry.anchorText }),
      ).toHaveAttribute("href", entry.anchorHref);
      await expect(msHeader.locator(".microsite-directory-pill")).toHaveCount(0);
      await expect(
        msHeader.getByRole("link", { name: /All City Offices|All Barangays|All Schools/i }),
      ).toHaveCount(0);

      // Mobile viewport: test hamburger drawer open + section jump click + zero overflow
      await page.setViewportSize({ width: 320, height: 740 });
      await expect(page.locator(".mobile-bottom-app-bar")).toHaveCount(0);
      const toggle = page.locator(".microsite-menu-toggle");
      await expect(toggle).toBeVisible();
      await toggle.click();
      const drawer = page.locator("#microsite-mobile-nav");
      await expect(drawer).toHaveClass(/is-open/);
      await drawer.locator(`a[href="${entry.anchorHref}"]`).click();
      await expect(drawer).not.toHaveClass(/is-open/);

      const mobileOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(mobileOverflow).toBe(false);
    }

    // 2. Internal BetterMC pages retain .site-header, .independence-bar, and mobile bottom bar
    for (const internalPath of [
      "/offices/sp",
      "/education/bukidnon-state-university",
      "/barangays/bangcud",
    ]) {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(internalPath);
      await expect(page.locator(".site-header")).toBeVisible();
      await expect(page.locator(".independence-bar")).toBeVisible();
      await expect(page.locator(".microsite-header")).toHaveCount(0);
      await expect(
        page.getByRole("navigation", { name: "Primary navigation" }),
      ).toBeVisible();

      await page.setViewportSize({ width: 320, height: 740 });
      await expect(
        page.getByRole("navigation", { name: "Quick mobile app navigation" }),
      ).toBeVisible();
    }
  });

  test("aligns Officials & Assigned Personnel subgrid rows and renders All Verified Contacts & Platforms across City Office microsites", async ({
    page,
    baseURL,
  }) => {
    const base = new URL(baseURL || "http://127.0.0.1:5173");
    const subUrl = (slug: string, path = "/") => {
      const target = new URL(base.toString());
      target.hostname = `${slug}.localhost`;
      target.pathname = path;
      return target.toString();
    };

    // 1. Sangguniang Panlungsod: aligned multi-row personnel subgrid + expand toggle + clean contacts
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(subUrl("sp", "/transparency"));

    const secretariatUnit = page
      .locator(".office-personnel-unit")
      .filter({ hasText: "Office of the Secretariat & Executive Unit" });
    await secretariatUnit.scrollIntoViewIfNeeded();
    await assertAlignedCardGrid(
      page,
      ".office-personnel-unit:nth-of-type(2) .office-personnel-row",
      ".office-person-name",
      [".office-person-role-row", ".office-person-name-row", ".office-person-meta"],
    );

    const expandBtn = page.getByRole("button", { name: /Show remaining 8 personnel \(14 total\)/i });
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();
    await expect(page.getByRole("button", { name: /Show fewer personnel/i })).toBeVisible();

    const spContacts = page.locator("#sources");
    await spContacts.scrollIntoViewIfNeeded();
    await expect(spContacts.locator(".office-platform-card.is-fb")).toHaveAttribute(
      "href",
      "https://www.facebook.com/CityofMalaybalaySP/",
    );
    await expect(spContacts.locator('.office-channel-card[href="tel:0888134350"]')).toBeVisible();

    // 2. Spot-check complex / updated / new office microsites (mayor, engineering, agriculture, assessor, prosecutor, coa, bjmp, parole-probation, bac, deped-division, dilg)
    for (const check of [
      { slug: "mayor", expectWeb: "sakata.malaybalaycity.gov.ph/mayors-corner" },
      { slug: "engineering", expectWeb: "sakata.malaybalaycity.gov.ph/city-engineers-office" },
      { slug: "agriculture", expectWeb: "sakata.malaybalaycity.gov.ph/city-agriculture-office" },
      { slug: "assessor", expectWeb: "sakata.malaybalaycity.gov.ph/city-assessorss-office" },
      { slug: "prosecutor", expectWeb: "doj.gov.ph" },
      { slug: "coa", expectWeb: "region10.coa.gov.ph" },
      { slug: "bjmp", expectWeb: "r10.bjmp.gov.ph" },
      { slug: "parole-probation", expectWeb: "probation.gov.ph" },
      { slug: "bac", expectWeb: "sakata.malaybalaycity.gov.ph/bids-and-awards-committee-structure" },
      { slug: "deped-division", expectWeb: "malaybalay.deped.gov.ph" },
      { slug: "dilg", expectWeb: "region10.dilg.gov.ph" },
    ]) {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(subUrl(check.slug));
      await expect(page.locator(".microsite-directory-pill")).toHaveCount(0);
      await expect(page.locator(".office-personnel-source")).toHaveCount(0);
      await expect(page.getByText(/Verified Staffing Source:/i)).toHaveCount(0);
      await expect(page.getByText(/Source Ledger/i)).toHaveCount(0);
      const sourcesSection = page.locator("#sources");
      await expect(sourcesSection).toBeVisible();
      await expect(sourcesSection).toContainText(check.expectWeb);

      const telLinks = await sourcesSection
        .locator('a[href^="tel:"]')
        .evaluateAll((els) => els.map((e) => e.getAttribute("href") || ""));
      expect(telLinks.length).toBeGreaterThan(0);
      for (const href of telLinks) {
        expect(href.replace(/^tel:/, "").length).toBeLessThanOrEqual(11);
      }

      await page.setViewportSize({ width: 320, height: 740 });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflow).toBe(false);
    }
  });
});
