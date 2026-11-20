import {
  barangayMicrositeBySlug,
  barangaySlugFromHostname,
  type BarangayMicrositeProfile,
} from "./barangayProfiles";
import {
  educationInstitutionBySlug,
  schoolSlugFromHostname,
  type EducationInstitution,
} from "./civicDirectories";
import {
  governmentOfficeBySlug,
  officeSlugFromHostname,
  type GovernmentOffice,
} from "./governmentOffices";

export type MicrositeHeaderContext =
  | { kind: "office"; slug: string; office: GovernmentOffice }
  | { kind: "barangay"; slug: string; barangay: BarangayMicrositeProfile }
  | { kind: "school"; slug: string; school: EducationInstitution };

/**
 * Resolves a standalone microsite context strictly from hostname subdomains
 * (City Offices, Barangays, and Schools) while returning null on internal BetterMC hosts.
 */
export function resolveStandaloneMicrosite(hostname: string): MicrositeHeaderContext | null {
  if (!hostname) return null;

  const officeSlug = officeSlugFromHostname(hostname, "");
  if (officeSlug) {
    const office = governmentOfficeBySlug.get(officeSlug);
    if (office) return { kind: "office", slug: officeSlug, office };
  }

  const barangaySlug = barangaySlugFromHostname(hostname, "");
  if (barangaySlug) {
    const barangay = barangayMicrositeBySlug.get(barangaySlug);
    if (barangay) return { kind: "barangay", slug: barangaySlug, barangay };
  }

  const schoolSlug = schoolSlugFromHostname(hostname, "");
  if (schoolSlug) {
    const school = educationInstitutionBySlug.get(schoolSlug);
    if (school) return { kind: "school", slug: schoolSlug, school };
  }

  return null;
}
