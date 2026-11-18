import { expect, test } from "@playwright/test";

test("council recording card opens its source-linked video and permanent page", async ({ page }) => {
  await page.goto("/hearings");
  await expect(page.locator(".civic-recording-card")).toHaveCount(7);
  await page.getByRole("button", { name: /Open 70th Regular Session/i }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("70th Regular Session");
  await expect(dialog.getByRole("heading", { name: "Purpose and source context" })).toBeVisible();
  await expect(dialog.getByText(/Vice Mayor's public page identifies this/i)).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Transcript and key points" })).toBeVisible();
  await expect(dialog.getByText(/have not verified what was said/i)).toBeVisible();
  await dialog.getByRole("button", { name: /Play original Facebook video/i }).click();
  await expect(dialog.locator("iframe")).toHaveAttribute("src", /1139814078783195/);
  await dialog.getByRole("link", { name: /Open permanent page/i }).click();
  await expect(page).toHaveURL(/\/recordings\/1139814078783195$/);
  await expect(page).toHaveTitle(/70th Regular Session · 10th Sangguniang Panlungsod \| BetterMC/);
  await expect(page.getByRole("link", { name: /Return to recordings/i })).toHaveAttribute("href", "/hearings");
});

test("BAC recordings are separate from bid disclosures and mobile layout does not overflow", async ({ page }) => {
  await page.goto("/procurement/livestreams");
  await expect(page.locator(".civic-recording-card")).toHaveCount(6);
  await page.getByRole("button", { name: /Open Bids and Awards Committee Meeting · 28 October 2026/i }).click();
  await expect(page.getByRole("dialog")).toContainText("28 October 2026");
  await expect(page.getByRole("dialog").getByRole("link", { name: /Publisher-linked price schedule folder/i })).toHaveAttribute("href", /1s4rPTElX-rWrlYeRjCGc56bx0uh4jBUT/);
  await page.getByRole("button", { name: "Close record" }).click();
  await expect(page.locator(".bac-entries-table tbody tr")).toHaveCount(9);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});
