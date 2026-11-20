import { describe, expect, it } from "vitest";
import { barangayMicrosites } from "./barangayProfiles";
import { educationInstitutions } from "./civicDirectories";
import {
  governmentOffices,
  localSpecialBodies,
  officeSlugFromHostname,
  resolveOfficeSlug,
} from "./governmentOffices";
import {
  INITIAL_PESO_OPPORTUNITIES,
  PESO_FACEBOOK_PAGE_URL,
  pesoOpportunityInputSchema,
  resolveOpportunityLifecycle,
} from "./pesoData";

describe("Malaybalay government offices & sector directory", () => {
  it("keeps office slugs and aliases collision-free with all barangay and school subdomains", () => {
    const barangaySlugs = new Set(barangayMicrosites.map((b) => b.slug));
    const schoolSlugs = new Set(educationInstitutions.map((s) => s.slug));
    const seenOfficeTokens = new Set<string>();

    for (const office of governmentOffices) {
      expect(seenOfficeTokens.has(office.slug)).toBe(false);
      seenOfficeTokens.add(office.slug);
      expect(barangaySlugs.has(office.slug)).toBe(false);
      expect(schoolSlugs.has(office.slug)).toBe(false);

      for (const alias of office.aliases ?? []) {
        expect(seenOfficeTokens.has(alias)).toBe(false);
        seenOfficeTokens.add(alias);
        expect(barangaySlugs.has(alias)).toBe(false);
        expect(schoolSlugs.has(alias)).toBe(false);
      }
    }
  });

  it("ensures all 35+ offices have mandatory verified metadata and existing local logo assets", () => {
    expect(governmentOffices.length).toBeGreaterThanOrEqual(35);

    for (const office of governmentOffices) {
      expect(office.subdomainHost).toBe(`${office.slug}.bettermalaybalay.cloud`);
      expect(office.overview.length).toBeGreaterThan(25);
      expect(office.mandate.length).toBeGreaterThan(25);
      expect(office.phoneNumbers.length).toBeGreaterThan(0);
      expect(office.services.length).toBeGreaterThan(0);
      expect(office.programs.length).toBeGreaterThan(0);
      expect(office.sources.length).toBeGreaterThan(0);

      if (office.logoStatus === "Verified Local Asset") {
        expect(office.logoPath).toBeTruthy();
        expect(office.logoPath!.startsWith("/images/")).toBe(true);
      }
    }
  });

  it("links every local special body to an existing lead office slug", () => {
    expect(localSpecialBodies.length).toBeGreaterThanOrEqual(15);
    for (const body of localSpecialBodies) {
      expect(resolveOfficeSlug(body.leadOfficeSlug)).not.toBeNull();
    }
  });

  it("resolves office subdomains and preview params deterministically", () => {
    expect(officeSlugFromHostname("peso.bettermalaybalay.cloud")).toBe("peso");
    expect(officeSlugFromHostname("cswdo.bettermalaybalay.cloud")).toBe("cswdo");
    expect(officeSlugFromHostname("engineering.localhost:5173")).toBe("engineering");
    expect(officeSlugFromHostname("www.bettermalaybalay.cloud")).toBeNull();
    expect(officeSlugFromHostname("bettermalaybalay-git-feat.vercel.app")).toBeNull();
    expect(officeSlugFromHostname("localhost:5173", "?office=peso")).toBe("peso");
    expect(officeSlugFromHostname("localhost:5173", "?office=does-not-exist")).toBeNull();
  });

  it("verifies PESO Malaybalay carries the exact verified Facebook URL and 10 Charter services", () => {
    const peso = governmentOffices.find((o) => o.slug === "peso");
    expect(peso).toBeDefined();
    expect(peso?.facebookUrl).toBe(PESO_FACEBOOK_PAGE_URL);
    expect(peso?.emails).toContain("pesomalaybalaycity@gmail.com");
    expect(peso?.services.length).toBe(10);
  });
});

describe("PESO opportunity lifecycle and validation", () => {
  it("automatically computes active, closing-soon, expired, archived, draft, and recurring states", () => {
    const refDate = new Date("2026-11-20T04:00:00Z"); // 12:00 PM Asia/Manila 2026-11-20

    expect(
      resolveOpportunityLifecycle(
        { publicationStatus: "published", deadlineDate: "2026-12-15", isRecurringProgram: false },
        refDate,
      ).displayStatus,
    ).toBe("active");

    expect(
      resolveOpportunityLifecycle(
        { publicationStatus: "published", deadlineDate: "2026-11-24", isRecurringProgram: false },
        refDate,
      ).displayStatus,
    ).toBe("closing-soon");

    const expired = resolveOpportunityLifecycle(
      { publicationStatus: "published", deadlineDate: "2024-08-31", isRecurringProgram: false },
      refDate,
    );
    expect(expired.displayStatus).toBe("expired");
    expect(expired.isExpired).toBe(true);
    expect(expired.isVisibleToPublic).toBe(true);

    expect(
      resolveOpportunityLifecycle(
        { publicationStatus: "draft", deadlineDate: "2026-12-15", isRecurringProgram: false },
        refDate,
      ).isVisibleToPublic,
    ).toBe(false);

    expect(
      resolveOpportunityLifecycle(
        { publicationStatus: "archived", deadlineDate: undefined, isRecurringProgram: false },
        refDate,
      ).displayStatus,
    ).toBe("archived");

    expect(
      resolveOpportunityLifecycle(
        { publicationStatus: "published", deadlineDate: undefined, isRecurringProgram: true },
        refDate,
      ).displayStatus,
    ).toBe("recurring-program");
  });

  it("validates all seeded PESO records strictly against pesoOpportunityInputSchema", () => {
    expect(INITIAL_PESO_OPPORTUNITIES.length).toBeGreaterThanOrEqual(15);
    for (const seed of INITIAL_PESO_OPPORTUNITIES) {
      const result = pesoOpportunityInputSchema.safeParse(seed);
      expect(result.success).toBe(true);
    }
  });
});
