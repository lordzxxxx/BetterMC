import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import { PDFCheckBox, PDFDocument } from "pdf-lib";

async function verifyChecklistBehaviorAndPdf(
  page: Page,
  expectedMinCheckboxes = 2,
) {
  const card = page.locator(".bmc-checklist-card").first();
  await expect(card).toBeVisible();

  const checkboxes = card.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  expect(count).toBeGreaterThanOrEqual(expectedMinCheckboxes);

  // Verify bilingual formatting: smaller, muted Bisaya translation underneath primary English text
  const typography = await card.evaluate((el) => {
    const en = el.querySelector(".bmc-checklist-en");
    const bis = el.querySelector(".bmc-checklist-bisaya");
    if (!en || !bis) return null;
    const enStyle = window.getComputedStyle(en);
    const bisStyle = window.getComputedStyle(bis);
    return {
      enSize: parseFloat(enStyle.fontSize),
      bisSize: parseFloat(bisStyle.fontSize),
      enColor: enStyle.color,
      bisColor: bisStyle.color,
      enTop: en.getBoundingClientRect().top,
      bisTop: bis.getBoundingClientRect().top,
    };
  });
  expect(typography).not.toBeNull();
  expect(typography!.bisSize).toBeLessThan(typography!.enSize);
  expect(typography!.bisColor).not.toBe(typography!.enColor);
  expect(typography!.bisTop).toBeGreaterThan(typography!.enTop);

  // Toggle first two checkboxes independently
  const firstBox = checkboxes.nth(0);
  const secondBox = checkboxes.nth(1);
  await expect(firstBox).not.toBeChecked();
  await expect(secondBox).not.toBeChecked();

  await firstBox.click();
  await expect(firstBox).toBeChecked();
  await expect(secondBox).not.toBeChecked();
  await expect(card.locator(".bmc-checklist-item").first()).toHaveClass(/is-checked/);

  // Download genuine PDF document and inspect its AcroForm checkboxes
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    card.getByRole("button", { name: /Download Checklist/i }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  const filePath = await download.path();
  expect(filePath).toBeTruthy();

  const pdfBytes = await readFile(filePath!);
  expect(pdfBytes.subarray(0, 4).toString("ascii")).toBe("%PDF");
  const pdfDoc = await PDFDocument.load(pdfBytes);
  expect(pdfDoc.getPageCount()).toBeGreaterThanOrEqual(1);
  const pdfCheckboxes = pdfDoc
    .getForm()
    .getFields()
    .filter((f): f is PDFCheckBox => f instanceof PDFCheckBox);
  expect(pdfCheckboxes).toHaveLength(count);
  expect(pdfCheckboxes[0].isChecked()).toBe(true);
  expect(pdfCheckboxes[1].isChecked()).toBe(false);

  // Uncheck and reset
  await firstBox.click();
  await expect(firstBox).not.toBeChecked();
}

test.describe("bilingual interactive checklists and PDF downloads across BetterMC & microsites", () => {
  test("verifies City Office & PESO Charter checklists and genuine PDF export", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/offices/peso");
    await verifyChecklistBehaviorAndPdf(page, 2);

    await page.goto("/offices/bpld");
    await verifyChecklistBehaviorAndPdf(page, 4);

    // Standalone office microsite preview & PESO Job Detail checklist
    await page.goto("/?office=ccro");
    await verifyChecklistBehaviorAndPdf(page, 2);

    await page.goto("/jobs/peso-nsrp-jobseeker-registration-matching");
    await verifyChecklistBehaviorAndPdf(page, 2);

    expect(errors).toEqual([]);
  });

  test("verifies /documents custom combined checklist, Barangay guide, and Barangay microsite view", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/documents");
    await verifyChecklistBehaviorAndPdf(page, 8);

    await page.goto("/documents/barangays/casisang");
    await verifyChecklistBehaviorAndPdf(page, 6);

    await page.goto("/?subdomain=aglayan");
    await page.locator("#services .bmc-checklist-card").scrollIntoViewIfNeeded();
    await verifyChecklistBehaviorAndPdf(page, 6);
  });

  test("verifies School profile and standalone School microsite enrollment checklist", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/education/bukidnon-state-university");
    await page.locator("#checklist .bmc-checklist-card").scrollIntoViewIfNeeded();
    await verifyChecklistBehaviorAndPdf(page, 5);

    await page.goto("/?school=bangcud-central-school");
    await page.locator("#checklist .bmc-checklist-card").scrollIntoViewIfNeeded();
    await verifyChecklistBehaviorAndPdf(page, 4);
  });

  test("verifies /services transaction modal checklist + Bisaya translations + PDF export", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/services/business-trade");
    await page
      .getByRole("button", { name: /Make Transaction & Checklist/i })
      .first()
      .click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await verifyChecklistBehaviorAndPdf(page, 4);
    await expect(modal.getByRole("button", { name: /Print Checklist/i })).toBeVisible();
  });

  test("verifies responsive checklists across tablet (768px) and mobile (375px & 320px) without overflow", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 768, height: 1024 },
      { width: 375, height: 812 },
      { width: 320, height: 568 },
    ]) {
      await page.setViewportSize(viewport);
      for (const route of ["/offices/peso", "/documents", "/barangays/casisang", "/education/bukidnon-national-high-school"]) {
        await page.goto(route);
        const card = page.locator(".bmc-checklist-card").first();
        await card.scrollIntoViewIfNeeded();
        await expect(card).toBeVisible();
        await expect(card.getByRole("button", { name: /Download Checklist/i })).toBeVisible();
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth + 1,
        );
        expect(overflow, `${route} overflow at ${viewport.width}px`).toBe(false);
      }
    }
  });
});
