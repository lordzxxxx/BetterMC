import { expect, test } from "@playwright/test";

test.describe("Government Offices Directory, Subdomains, PESO Hub & Admin", () => {
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

  test("publishes a PESO opportunity in Admin preview mode and reflects it on /jobs", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/admin/peso");

    await expect(
      page.getByRole("heading", { name: /PESO Job & Livelihood Admin Workspace/i }),
    ).toBeVisible();

    await page.getByPlaceholder(/Store Accounting Clerk/i).fill("Field Enumerator — Local E2E Check");
    await page.getByPlaceholder(/Verified employer name from PESO post/i).fill("Malaybalay Partner Agency");
    await page.getByPlaceholder(/Transcribe verified details/i).fill(
      "Conducts barangay field surveys across assigned puroks in Malaybalay City.",
    );
    await page.getByPlaceholder(/BS Accountancy graduate/i).fill("At least 2 years in college");

    await page.getByRole("button", { name: /Publish Opportunity/i }).click();
    await expect(page.getByText(/in browser Local Preview/i)).toBeVisible();

    await page.goto("/jobs");
    await expect(page.getByRole("link", { name: "Field Enumerator — Local E2E Check" })).toBeVisible();
  });
});
