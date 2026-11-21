import { expect, test } from "@playwright/test";

const weatherFixture = {
  timezone: "Asia/Manila",
  current: {
    time: "2026-11-07T09:00",
    temperature_2m: 24,
    apparent_temperature: 26,
    relative_humidity_2m: 82,
    precipitation: 0,
    weather_code: 2,
    wind_speed_10m: 5,
  },
  current_units: {
    temperature_2m: "°C",
    apparent_temperature: "°C",
    relative_humidity_2m: "%",
    precipitation: "mm",
    wind_speed_10m: "km/h",
  },
  hourly: {
    time: Array.from({ length: 24 }, (_, index) => {
      const hour = (9 + index) % 24;
      const day = index < 15 ? "07" : "08";
      return `2026-11-${day}T${String(hour).padStart(2, "0")}:00`;
    }),
    temperature_2m: Array.from({ length: 24 }, (_, index) => 24 + (index % 6)),
    apparent_temperature: Array.from({ length: 24 }, (_, index) => 26 + (index % 5)),
    relative_humidity_2m: Array.from({ length: 24 }, (_, index) => 78 + (index % 8)),
    precipitation_probability: Array.from({ length: 24 }, (_, index) => index === 5 ? 65 : 15),
    weather_code: Array.from({ length: 24 }, () => 2),
    wind_speed_10m: Array.from({ length: 24 }, () => 5),
  },
  hourly_units: {
    temperature_2m: "°C",
    apparent_temperature: "°C",
    relative_humidity_2m: "%",
    precipitation_probability: "%",
    wind_speed_10m: "km/h",
  },
};

test("global search uses one surface and reaches specific portal records", async ({ page }) => {
  await page.route("https://api.open-meteo.com/**", (route) =>
    route.fulfill({ json: weatherFixture }),
  );
  await page.goto("/");
  const search = page.getByLabel(/Search all BetterMC/i);
  await expect(search).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await search.fill("Executive Order No. 19");
  await page.getByRole("link", { name: /Executive Order No. 19/i }).click();
  await expect(page).toHaveURL(/\/legislation\/executive-order-no-19-series-of-2026$/);

  await page.goto("/");
  await search.fill("ITB-2026-206");
  await page.getByRole("link", { name: /ITB-2026-206/i }).click();
  await expect(page).toHaveURL(/\/procurement\/bidding-opportunities$/);
});

test("homepage presents current Malaybalay conditions and a 24-hour forecast", async ({ page }) => {
  await page.route("https://api.open-meteo.com/**", (route) =>
    route.fulfill({ json: weatherFixture }),
  );
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Current conditions and the next 24 hours/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Partly cloudy", exact: true })).toBeVisible();
  await expect(page.locator(".weather-hourly button")).toHaveCount(8);
  const currentHour = page.locator(".weather-hourly button.is-current");
  await expect(currentHour).toHaveCount(1);
  await expect(currentHour).toHaveAttribute("aria-current", "time");
  const laterHour = page.locator(".weather-hourly button").nth(1);
  await laterHour.click();
  const details = page.getByRole("dialog");
  await expect(details).toBeVisible();
  await expect(details).toContainText("Feels like");
  await expect(details).toContainText("Humidity");
  await expect(details).toContainText("Rain chance");
  await page.getByRole("button", { name: /Close forecast details/i }).click();
  await expect(details).toBeHidden();
  await expect(laterHour).toBeFocused();
  await expect(page.locator(".weather-source").getByText(/model-based.*may change/i)).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});

test("core public routes are navigable and do not overflow", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Welcome to BetterMC/i }),
  ).toBeVisible();
  await expect(page.locator(".independence-bar .city-clock")).toBeVisible();
  await expect(page.locator(".site-footer .city-clock")).toHaveCount(0);
  if ((page.viewportSize()?.width ?? 0) <= 960) {
    const headerBox = await page.locator(".site-header").boundingBox();
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.locator(".mobile-nav-shell");
    await expect(menu).toBeVisible();
    await page.waitForTimeout(220);
    const menuBox = await menu.boundingBox();
    expect(headerBox).not.toBeNull();
    expect(menuBox).not.toBeNull();
    expect(menuBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height);
    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(menu).toBeHidden();
  }
  await expect(
    page.getByRole("heading", { name: /Where the money came from/i }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Explore transparency/i }).click();
  await expect(
    page.getByRole("heading", { name: /Public records/i }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});

test("layered homepage hero and detailed finance remain usable", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Next image" })).toHaveCount(0);
  await expect(page.locator(".hero")).toHaveCSS(
    "background-color",
    "rgb(18, 88, 182)",
  );
  const heroLayers = await page.locator(".hero").evaluate((element) => ({
    image: getComputedStyle(element, "::before").backgroundImage,
    imageOpacity: getComputedStyle(element, "::before").opacity,
    imageFilter: getComputedStyle(element, "::before").filter,
    overlay: getComputedStyle(element, "::after").backgroundColor,
  }));
  expect(heroLayers.image).toContain("malaybalay-city-hall-background.webp");
  expect(heroLayers.imageOpacity).toBe("1");
  expect(heroLayers.imageFilter).toContain("blur(");
  expect(heroLayers.overlay).toBe("rgba(9, 75, 166, 0.6)");
  await expect(page.locator("#financial-detail")).toBeVisible();
  await expect(page.getByText("₱1,188,506,575.00")).toBeVisible();
  await page.getByRole("button", { name: /Current operating income/i }).click();
  await expect(
    page.getByRole("heading", {
      name: "Current operating income",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /Internal Revenue Allotment/i })
    .click();
  await expect(page.getByText("86.13%")).toBeVisible();
});

test("homepage adapts collection density to the viewport", async ({ page }) => {
  await page.goto("/");
  const mobile = (page.viewportSize()?.width ?? 0) <= 640;
  const visibleRecords = await page
    .locator(".records-preview article")
    .evaluateAll(
      (items) =>
        items.filter((item) => getComputedStyle(item).display !== "none")
          .length,
    );
  const visibleOffices = await page
    .locator(".office-preview article")
    .evaluateAll(
      (items) =>
        items.filter((item) => getComputedStyle(item).display !== "none")
          .length,
    );
  expect(visibleRecords).toBe(mobile ? 1 : 3);
  expect(visibleOffices).toBe(6);
  await expect(
    page.getByRole("link", { name: /Find every barangay/i }),
  ).toHaveAttribute("href", "/barangays");
  if (mobile) {
    await page.getByRole("button", { name: /Show 2 more measures/i }).click();
    await expect(page.locator(".records-preview article")).toHaveCount(3);
    const expandedRecords = await page
      .locator(".records-preview article")
      .evaluateAll(
        (items) =>
          items.filter((item) => getComputedStyle(item).display !== "none")
            .length,
      );
    expect(expandedRecords).toBe(3);
  }
});

test("homepage exposes local and national service pathways", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Find the right public service/i }),
  ).toBeVisible();
  await expect(page.locator(".service-category-grid.is-compact article")).toHaveCount(12);
  await expect(page.locator("#government-services .home-emergency")).toHaveCount(0);
  await expect(
    page.locator("#government-services").getByRole("heading", { name: "Emergency hotlines" }),
  ).toHaveCount(0);

  const hotlinesSection = page.locator("#emergency-hotlines");
  await expect(hotlinesSection).toBeVisible();
  const isDirectlyAfterWeather = await hotlinesSection.evaluate((el) => {
    const prev = el.previousElementSibling;
    return Boolean(prev && prev.classList.contains("weather-section"));
  });
  expect(isDirectlyAfterWeather).toBe(true);

  await expect(
    hotlinesSection.getByRole("heading", { name: "Emergency hotlines" }),
  ).toBeVisible();
  await expect(
    hotlinesSection.getByRole("link", { name: /Call National Emergency.*911/i }),
  ).toHaveAttribute("href", "tel:911");
  await expect(
    hotlinesSection.getByRole("link", { name: /Call Philippine Red Cross.*143/i }),
  ).toHaveAttribute("href", "tel:143");
  await expect(
    hotlinesSection.getByRole("link", { name: /BUSECO.*0998-843-8335/i }),
  ).toHaveAttribute("href", "tel:09988438335");
  await expect(
    hotlinesSection.getByRole("link", { name: /City Disaster Risk Reduction.*0917-827-6117/i }),
  ).toHaveAttribute("href", "tel:09178276117");
  await expect(
    hotlinesSection.getByRole("link", { name: /All city hotlines/i }),
  ).toHaveAttribute("href", "/offices?sector=Public%20Safety%20%26%20Emergency");
  await expect(hotlinesSection.locator(".home-hotline-card")).toHaveCount(6);
  await page
    .locator(".service-category-grid article")
    .filter({ hasText: "Health" })
    .getByRole("link", { name: /Open guide/i })
    .click();
  await expect(
    page.getByRole("heading", { name: "Health", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Health programs/i }),
  ).toHaveAttribute("href", /bettergov\.ph\/services\?category=health/);
  await expect(
    page.getByRole("link", { name: /Open emergency contacts/i }),
  ).toHaveAttribute("href", "/offices?sector=Public%20Safety%20%26%20Emergency");
});

test("transparency and legislation retain local context pages", async ({ page }) => {
  await page.goto("/transparency?year=2026&quarter=Q2");
  await expect(
    page.getByRole("complementary", { name: "Source review and citation" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Open official catalog/i }),
  ).toHaveAttribute("href", "https://sakata.malaybalaycity.gov.ph/full-disclosure/");
  const detailLink = page.getByRole("link", {
    name: /View context for Statement of Receipts and Expenditures/i,
  });
  await expect(detailLink).toHaveAttribute("href", /\/transparency\/2026\/q2\//);
  await detailLink.click();
  await expect(
    page.getByRole("dialog", {
      name: /Statement of Receipts and Expenditures disclosure popout/i,
    }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /Open standalone record page/i })
    .click();
  await expect(
    page.getByRole("heading", { name: "Record availability" }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/transparency\/2026\/q2\//);

  await page.goto("/legislation");
  await expect(
    page.getByRole("heading", { name: /Published measures, readable/i }),
  ).toBeVisible();
  await expect(page.locator(".legislation-records article")).not.toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Ordinance", exact: true }),
  ).toBeVisible();
  const eo19 = page
    .locator(".legislation-records article")
    .filter({ hasText: "Executive Order No. 19, Series of 2026" });
  await eo19.getByRole("link", { name: /Read BetterMC record page/i }).click();
  await expect(page).toHaveURL(
    /\/legislation\/executive-order-no-19-series-of-2026$/,
  );
  await expect(
    page.getByRole("heading", { name: /What this published measure does/i }),
  ).toBeVisible();
  await expect(
    page.getByText(/not evidence that a particular project was completed/i),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Open official source/i }),
  ).toHaveAttribute("href", /malaybalaycity\.gov\.ph/);
});

test("leader profiles expose verified contacts and record scope", async ({
  page,
}) => {
  await page.goto("/government");
  await page
    .getByRole("button", { name: /Jay Warren R\. Pabillaran.*open verified profile/i })
    .click();
  const mayorProfile = page.getByRole("dialog", {
    name: /Jay Warren R\. Pabillaran verified profile details/i,
  });
  await expect(mayorProfile).toBeVisible();
  await expect(
    mayorProfile.getByRole("heading", {
      name: "City Mayor’s Office",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    mayorProfile.getByRole("link", { name: /0953-459-1777/ }),
  ).toHaveAttribute("href", "tel:09534591777");
  await expect(
    mayorProfile.getByRole("heading", { name: /City Mayor’s Office issuances/i }),
  ).toBeVisible();

  await page.goto("/government?tab=officials&official=jason-chad-j-ayala");
  const councilorCard = page.getByRole("dialog", {
    name: /Jason Chad J\. Ayala verified profile details/i,
  });
  await expect(councilorCard).toBeVisible();
  await expect(
    councilorCard.getByRole("heading", {
      name: "Jason Chad J. Ayala — City Councilor",
      exact: true,
    }),
  ).toBeVisible();

  await page.goto("/government?tab=officials&official=kathleen-cecille-c-pagaling");
  const pagalingCard = page.getByRole("dialog", {
    name: /Kathleen Cecille C\. Pagaling verified profile details/i,
  });
  await expect(pagalingCard).toBeVisible();
  await expect(pagalingCard.getByRole("heading", { name: /Ordinances · 7/i })).toBeVisible();
  await expect(pagalingCard.getByRole("heading", { name: /Resolutions · 7/i })).toBeVisible();
  await expect(pagalingCard.getByRole("heading", { name: /Partnerships & MOAs · 9 agreements/i })).toBeVisible();
  await expect(pagalingCard.getByText("Peer Support Groups for Mental Health", { exact: true })).toBeVisible();
  await expect(pagalingCard.getByText("Animal Health Risk Monitoring", { exact: true })).toBeVisible();
  await expect(pagalingCard.getByText(/Also reported by GMA News/i)).toHaveCount(0);
  const modalBody = pagalingCard.locator(".barangay-popout-body");
  const hasHorizontalOverflow = await modalBody.evaluate(
    (element) => element.scrollWidth > element.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("barangay profile exposes sourced identity, services, and emergency contacts", async ({
  page,
}) => {
  await page.goto("/barangays/dalwangan");
  await expect(
    page.getByRole("heading", { name: "Dalwangan", level: 1 }),
  ).toBeVisible();
  await expect(page.getByText("Royville C. Pasco").first()).toBeVisible();
  await expect(page.locator(".barangay-facts dd").first()).toContainText(
    "7,812",
  );
  await expect(page.locator(".barangay-facts")).toHaveCSS(
    "background-color",
    "rgba(255, 255, 255, 0.9)",
  );
  await expect(
    page.getByRole("heading", {
      name: /Barangay overview/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("complementary").getByText(/Where this information comes from/i),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /Common committee areas/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/Source-linked projects and funding in Dalwangan/i),
  ).toBeVisible();
  await expect(
    page.getByRole("complementary", { name: /Dalwangan historical procurement archive/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Map", exact: true }),
  ).toHaveAttribute("href", "#map");
  await expect(
    page.getByRole("heading", { name: /Urgent help across Malaybalay/i }),
  ).toBeVisible();
  await expect(page.locator(".barangay-logo-frame img")).toHaveAttribute(
    "src",
    "/images/barangays/dalwangan.webp",
  );
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});

test("footer publishes civic contribution and verified city channels", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: /Contribute on GitHub/i }),
  ).toHaveAttribute("href", "https://github.com/lordzxxxx/BetterMC");
  await expect(
    page.getByRole("link", { name: /0917 188 4225/i }),
  ).toHaveAttribute("href", "tel:09171884225");
  await expect(
    page.getByRole("link", { name: /Powered by\s*BetterGov/i }),
  ).toHaveAttribute("href", "https://lgu.bettergov.ph/");
  await expect(
    page.getByRole("link", { name: /BetterMC on Facebook|BAC LGU Malaybalay Facebook|City Government website|Official Facebook page/i }),
  ).toHaveCount(0);
  await expect(page.getByText("Cost of This Website")).toHaveCount(0);
  await expect(page.getByText("Cost to the People of Malaybalay")).toBeVisible();
  await expect(page.getByText("₱0")).toHaveCount(1);
});

test("transparency and budget section links stay focused on disclosure and budget", async ({ page }) => {
  await page.goto("/transparency");

  const sectionNav = page.getByRole("navigation", { name: "Transparency and budget sections" });
  await expect(sectionNav.getByRole("link")).toHaveCount(2);
  await sectionNav.getByRole("link", { name: "Budget Transparency Hub" }).click();
  await expect(page).toHaveURL(/\/budget$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/transparency$/);
  await expect(page.getByText("Published record does not always mean named authorship")).toHaveCount(0);
});

test("procurement sources preserve record scope", async ({ page }) => {
  await page.goto("/transparency");
  await expect(
    page.getByRole("heading", {
      name: /Award notices and bidding opportunities/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Infrastructure/i }),
  ).toHaveAttribute("href", "/procurement/infrastructure-awards");
  await expect(
    page.getByText(/does not relabel them as awarded projects/i),
  ).toBeVisible();

  await page.getByRole("link", { name: /2026 BAC opportunity index/i }).click();
  await expect(page).toHaveURL(/\/procurement\/bidding-opportunities$/);
  await expect(
    page.getByRole("heading", {
      name: /2026 bidding opportunities/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Show more records/i }),
  ).toBeVisible();
  await expect(page.locator(".bid-record-list button")).toHaveCount(9);
  await page.getByRole("button", { name: /Show more records/i }).click();
  await expect(page.locator(".bid-record-list button")).toHaveCount(18);
  await page
    .getByPlaceholder(/Project, office, barangay, or ITB/i)
    .fill("Cabangahan");
  await expect(page.locator(".procurement-count")).not.toContainText(
    "212 matching records",
  );
  await expect(page.locator(".bid-record-list button").first()).toContainText(
    /Cabangahan/i,
  );
  await page.locator(".bid-record-list button").first().click();
  await expect(page.getByRole("dialog")).toContainText(/Official bidding document/i);
  await expect(page.getByRole("dialog").getByRole("link", { name: /Open official document/i })).toHaveAttribute("href", /^https:\/\//);
  await page.getByRole("button", { name: "Close record" }).click();

  await page
    .getByRole("link", { name: /Infrastructure awards/i })
    .click();
  await expect(page).toHaveURL(/\/procurement\/infrastructure-awards$/);
  await expect(page.getByText("ITB-2024-012")).toBeVisible();
  await expect(
    page.getByText(/does not by itself prove payment/i),
  ).toBeVisible();
});

test("mobile service cards keep details available without a long initial list", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1000) > 640);
  await page.goto("/services/business-trade");
  const firstProvider = page.locator(".provider-card").first();
  const toggle = firstProvider.locator(".provider-mobile-toggle");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(firstProvider.locator(".provider-transactions-section")).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(firstProvider.locator(".provider-transactions-section")).toBeVisible();
  await expect.poll(() => firstProvider.locator(".provider-logo img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
});

test("directory filters reach emergency contacts and government excludes redundant tabs", async ({ page }) => {
  await page.goto("/government");
  const tabList = page.getByRole("tablist", { name: "Government directory views" });
  await expect(tabList.getByRole("tab", { name: "Officials" })).toBeVisible();
  await expect(tabList.getByRole("tab", { name: "Published measures" })).toBeVisible();
  await expect(tabList.getByRole("tab", { name: "Offices" })).toHaveCount(0);
  await expect(tabList.getByRole("tab", { name: "Hotlines" })).toHaveCount(0);

  await page.goto("/government?tab=hotlines");
  await expect(page).toHaveURL(/\/offices\?sector=Public/);
  await expect(
    page.getByRole("heading", { name: /Bureau of Fire Protection — Malaybalay City Fire Station/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /0917-677-7700/ }),
  ).toHaveAttribute("href", /^tel:/);
});

test("global page access remains complete and responsive", async ({
  page,
}) => {
  await page.route("https://api.open-meteo.com/**", (route) =>
    route.fulfill({ json: weatherFixture }),
  );
  await page.goto("/");
  await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute(
    "href",
    "/favicon-bettermc.png",
  );

  if ((page.viewportSize()?.width ?? 0) > 960) {
    const primaryNav = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(primaryNav.getByRole("link", { name: "Budget" })).toHaveAttribute("href", "/budget");
    await expect(primaryNav.getByRole("link", { name: "Legislation" })).toHaveAttribute("href", "/legislation");

    const singleLineNavLinks = await primaryNav.locator("> a").evaluateAll((links) =>
      links.every((link) => {
        const rect = link.getBoundingClientRect();
        return rect.height > 0 && rect.right <= window.innerWidth + 1;
      }),
    );
    expect(singleLineNavLinks).toBe(true);

    await page.getByRole("button", { name: "Open BetterMC site directory" }).click();
    const allPages = page.getByRole("navigation", { name: "BetterMC site directory" });
    await expect(allPages.getByRole("link")).toHaveCount(16);
    await expect(allPages.getByRole("link", { name: /City Offices/i })).toHaveAttribute("href", "/offices");
    await expect(allPages.getByRole("link", { name: /PESO & Jobs/i })).toHaveCount(0);
    await expect(allPages.getByRole("link", { name: /Legislation/i })).toHaveAttribute(
      "href",
      "/legislation",
    );
    await expect(allPages.getByRole("link", { name: /Budget/i })).toHaveAttribute("href", "/budget");
    await expect(allPages.getByRole("link", { name: /Infrastructure/i })).toHaveAttribute(
      "href",
      "/procurement/infrastructure-awards",
    );
    await expect(allPages.getByRole("link", { name: /Emergency contacts/i })).toHaveAttribute(
      "href",
      "/offices?sector=Public%20Safety%20%26%20Emergency",
    );
    await expect(allPages.getByRole("link", { name: /Procurement/i })).toHaveAttribute("href", "/procurement/livestreams");
  } else {
    await page.getByRole("button", { name: "Open menu" }).click();
    const mobileNavigation = page.locator("#mobile-navigation");
    await expect(mobileNavigation.getByRole("link")).toHaveCount(9);
    await mobileNavigation.getByText("More sections").click();
    await expect(mobileNavigation.getByRole("link")).toHaveCount(16);
    await page.getByRole("button", { name: "Close menu" }).click();
  }

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
});

test("budget, hearings, BAC livestreams, and education routes render without overflow across viewports", async ({
  page,
}) => {
  for (const route of ["/budget", "/hearings", "/procurement/livestreams", "/education"]) {
    await page.goto(route);
    await expect(page.locator("h1").first()).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  }
});

test("BAC recording, ordinance text, and weather guidance keep their source boundaries", async ({ page }) => {
  await page.route("https://api.open-meteo.com/**", (route) => route.fulfill({ json: weatherFixture }));
  await page.goto("/procurement/livestreams");
  const card = page.getByRole("button", { name: /Open Bids and Awards Committee Meeting · 18 November 2026/i });
  await expect(card.locator("img")).toHaveAttribute("src", "/images/recordings/1641508124420651.jpg");
  await expect(page.getByText("Video identified / Discussion unreviewed")).toHaveCount(0);
  await expect(page.getByText("Confirmed Official Record")).toHaveCount(0);
  await card.click();
  const recording = page.getByRole("dialog").locator(".record-video");
  await recording.getByRole("button", { name: /Play original Facebook video/ }).click();
  await expect(recording.locator("iframe")).toHaveAttribute("src", /facebook.com\/plugins\/video.php/);

  await page.goto("/legislation/ordinance-no-1118-series-of-2026");
  await expect(page.getByRole("heading", { name: "Inside the published ordinance" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Read the ordinance scan/ })).toHaveAttribute("href", /drive.google.com/);
  await expect(page.getByText("English, Filipino, and Bisaya access")).toHaveCount(0);

  await page.goto("/");
  await expect(page.getByRole("note", { name: "River and heavy rain guidance" })).toContainText("no live Sawaga River gauge");
  await expect(page.getByRole("link", { name: /PAGASA flood bulletins/ })).toHaveAttribute("href", "https://pagasa.dost.gov.ph/flood");
});

test("procurement navigation and original recording sources are accessible", async ({ page }) => {
  await page.goto("/procurement/livestreams");
  await expect(page.getByRole("region", { name: "Official video libraries" })).toHaveCount(0);
  await page.locator(".civic-recording-card button").first().click();
  await expect(page.getByRole("link", { name: /Original video/i }).first()).toHaveAttribute("href", /facebook\.com/);
  await page.getByRole("button", { name: "Close record" }).click();

  if ((page.viewportSize()?.width ?? 1000) <= 760) {
    const tab = page.getByRole("navigation", { name: "Quick mobile app navigation" }).getByRole("link", { name: "Procurement" });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveClass(/active/);
    await tab.click();
    await expect(page).toHaveURL(/\/procurement\/livestreams$/);
    await expect(tab).toHaveAttribute("aria-current", "page");
  }

  await page.goto("/hearings");
  await expect(page.getByRole("region", { name: "Official video libraries" })).toHaveCount(0);
  await page.locator(".civic-recording-card button").first().click();
  await expect(page.getByRole("link", { name: /Original video/i }).first()).toHaveAttribute("href", /facebook\.com/);
});

test("service sectors, city offices, and schools display verified logos, populations, and contact persons without 320px overflow", async ({
  page,
}) => {
  await page.goto("/services/certificates-ids");
  await expect(
    page.getByRole("heading", { name: /Where to transact in Malaybalay for certificates and IDs/i }),
  ).toBeVisible();
  const providerImgs = page.locator(".provider-logo img");
  await expect(providerImgs).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    await providerImgs.nth(i).scrollIntoViewIfNeeded();
    await expect.poll(async () => providerImgs.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  }
  await expect(page.locator(".provider-logo svg")).toHaveCount(0);

  await page.goto("/offices/pnp");
  await expect(page.locator(".office-logo-frame.is-hero img")).toHaveAttribute("src", "/images/agencies/pnp.png");
  await expect(page.getByRole("region", { name: "Who to reach out to" })).toContainText("PLtCol. Joepet Baldonado Paglinawan");

  await page.goto("/education/bukidnon-state-university");
  await expect(page.locator(".education-school-logo").first()).toHaveAttribute("src", "/images/schools/buksu.png");
  await expect(page.getByText(/9,300\+ Main Campus college students/i).first()).toBeVisible();
  await expect(page.getByText(/Dr\. Joy M\. Mirasol/i).first()).toBeVisible();

  await page.goto("/education/bukidnon-national-high-school");
  await expect(page.getByText(/8,840 learners in SY 2024–25/i).first()).toBeVisible();
  await expect(page.getByText(/Dr\. Paul O\. Orong/i).first()).toBeVisible();

  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/services/certificates-ids");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
