import { expect, test } from "@playwright/test";

test.describe("Government Offices Directory, Subdomains & PESO Hub", () => {
  test("renders /offices cleanly across desktop and 320px mobile with valid logo images", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/offices");

    await expect(
      page.getByRole("heading", { name: /City Offices, Divisions & Partner Institutions/i }),
    ).toBeVisible();

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
    await expect(page.getByText("peso.bettermalaybalay.cloud")).toBeVisible();

    await page.getByRole("button", { name: /Expired \/ CS Form No\. 9 Archive/i }).click();
    await page.getByRole("link", { name: "Planning Officer IV" }).click();

    await expect(page).toHaveURL(/\/jobs\/csc-2024-planning-officer-iv-cpdo$/);
    await expect(page.getByRole("alert")).toContainText(/expired/i);

    await page.setViewportSize({ width: 320, height: 740 });
    const overflowOnJobDetail = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflowOnJobDetail).toBe(false);
  });

  test("supports office subdomain query previews (?office=cho and ?office=peso)", async ({ page }) => {
    await page.goto("/?office=cho");
    await expect(page.getByRole("heading", { name: "City Health Office" })).toBeVisible();
    await expect(page.getByText("cho.bettermalaybalay.cloud")).toBeVisible();

    await page.goto("/?office=peso");
    await expect(
      page.getByRole("heading", { name: "Public Employment Service Office — Malaybalay City" }),
    ).toBeVisible();
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

  test("surfaces PESO & Jobs and City Offices in primary nav, home gateways, and 320px mobile bar", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const desktopNav = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(desktopNav.getByRole("link", { name: "City Offices" })).toBeVisible();
    await expect(desktopNav.getByRole("link", { name: "PESO & Jobs" })).toBeVisible();

    const homePortals = page.getByRole("region", { name: "Featured Malaybalay portals" });
    await expect(homePortals.getByRole("link", { name: /Open PESO Hub/i })).toBeVisible();
    await expect(homePortals.getByRole("link", { name: /Explore All 35 Offices/i })).toBeVisible();

    await page.setViewportSize({ width: 320, height: 740 });
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow).toBe(false);

    const mobileTabs = page.getByRole("navigation", { name: "Quick mobile app navigation" });
    await expect(mobileTabs.getByRole("link", { name: "Offices" })).toBeVisible();
    await expect(mobileTabs.getByRole("link", { name: "PESO" })).toBeVisible();
  });
});
