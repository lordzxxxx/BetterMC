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
    await expect(page.getByRole("link", { name: /peso\.bettermalaybalay\.cloud/i }).first()).toBeVisible();

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
    await expect(page.getByRole("link", { name: /cho\.bettermalaybalay\.cloud/i }).first()).toBeVisible();

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
});
