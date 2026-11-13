import { describe, expect, it } from "vitest";
import { barangayDisclosureBySlug } from "./barangayDisclosures";
import { dpwhMalaybalayProjects2026 } from "./dpwhProjects";

describe("DPWH Malaybalay infrastructure ledger", () => {
  it("keeps the audited source snapshot unique and stage-separated", () => {
    expect(dpwhMalaybalayProjects2026).toHaveLength(25);
    expect(new Set(dpwhMalaybalayProjects2026.map((row) => row.contractId)).size).toBe(25);
    expect(
      dpwhMalaybalayProjects2026.filter((row) => row.stage === "active-contract"),
    ).toHaveLength(22);
    expect(
      dpwhMalaybalayProjects2026.filter((row) => row.stage === "for-procurement"),
    ).toHaveLength(3);
  });

  it("does not represent procurement-stage records as zero-value contracts", () => {
    for (const row of dpwhMalaybalayProjects2026) {
      if (row.stage === "for-procurement") {
        expect(row.contractCost).toBeNull();
        expect(row.contractor).toBeNull();
        expect(row.startDate).toBeNull();
        expect(row.accomplishmentPercent).toBeNull();
      } else {
        expect(row.contractCost).toBeGreaterThan(0);
        expect(row.contractor).toBeTruthy();
        expect(row.startDate).toMatch(/^2026-\d{2}-\d{2}$/);
        expect(row.accomplishmentPercent).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("attaches each DPWH record only to its explicitly named barangay", () => {
    for (const row of dpwhMalaybalayProjects2026) {
      const disclosure = barangayDisclosureBySlug.get(row.barangaySlug);
      expect(disclosure, row.barangaySlug).toBeDefined();
      expect(disclosure?.items.some((item) => item.id === `dpwh-${row.contractId.toLowerCase()}`)).toBe(true);

      for (const [slug, otherDisclosure] of barangayDisclosureBySlug) {
        if (slug === row.barangaySlug) continue;
        expect(
          otherDisclosure.items.some((item) => item.id === `dpwh-${row.contractId.toLowerCase()}`),
          `${row.contractId} must not be duplicated into ${slug}`,
        ).toBe(false);
      }
    }
  });

  it("never relabels DPWH records as COA projects", () => {
    const text = JSON.stringify(dpwhMalaybalayProjects2026).toLowerCase();
    expect(text).not.toContain("coa project");
  });
});
