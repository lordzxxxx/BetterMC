import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PDFCheckBox, PDFDocument } from "pdf-lib";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { InteractiveChecklist } from "./components/InteractiveChecklist";
import { documentGuides, educationInstitutions } from "./civicDirectories";
import { governmentOffices } from "./governmentOffices";
import { INITIAL_PESO_OPPORTUNITIES, PESO_CHARTER_SERVICES_2026 } from "./pesoData";
import {
  REQUIREMENT_BISAYA_MAP,
  buildBarangayChecklistSections,
  buildSchoolChecklistSections,
  groupRequirementsIntoSections,
} from "./requirementTranslations";
import { VERIFIED_SERVICE_PROVIDERS } from "./serviceCatalog";
import { generateChecklistPdfBytes } from "./utils/checklistPdf";

describe("bilingual interactive checklist & downloadable PDF system", () => {
  it("provides curated Cebuano/Bisaya translations for every requirement across all datasets", () => {
    const allReqs = new Set<string>();
    for (const provider of VERIFIED_SERVICE_PROVIDERS) {
      for (const tx of provider.transactions) {
        for (const req of tx.requirements) allReqs.add(req);
      }
    }
    for (const service of PESO_CHARTER_SERVICES_2026) {
      for (const req of service.requirements) allReqs.add(req);
    }
    for (const job of INITIAL_PESO_OPPORTUNITIES) {
      for (const req of job.requirements) allReqs.add(req);
    }
    for (const office of governmentOffices) {
      for (const service of office.services) {
        for (const req of service.requirements ?? []) allReqs.add(req);
      }
    }
    for (const guide of documentGuides) {
      for (const req of guide.requirements) allReqs.add(req);
    }

    const missing: string[] = [];
    for (const req of allReqs) {
      const bisaya = REQUIREMENT_BISAYA_MAP[req];
      if (!bisaya || bisaya.trim() === req.trim()) {
        missing.push(req);
      }
    }
    expect(missing).toEqual([]);
  });

  it("generates genuine PDF documents containing interactive AcroForm checkboxes and bilingual text", async () => {
    const sections = groupRequirementsIntoSections(
      [
        "Valid government-issued ID of the Filipino business owner (18+ years old)",
        "Barangay Business Clearance from the barangay where the business is located",
        "Official Receipt from the City Treasurer’s Office (₱130.00)",
        "DTI Business Name Certificate (Sole Proprietorship) or SEC/CDA Registration",
      ],
      "test-bpld",
    );
    const pdfSections = sections.map((section, sIdx) => ({
      ...section,
      items: section.items.map((item, iIdx) => ({
        ...item,
        checked: sIdx === 0 && iIdx === 0,
      })),
    }));

    const bytes = await generateChecklistPdfBytes({
      title: "Business Permit Documentary Checklist",
      subtitle: "Business Permits and Licensing Division · Malaybalay City",
      entityLabel: "BPLD",
      metadata: [
        { label: "Fee", value: "₱130.00 – Variable" },
        { label: "Processing time", value: "1 Day" },
      ],
      sections: pdfSections,
      filename: "bpld-test-checklist.pdf",
    });

    expect(bytes[0]).toBe(0x25); // '%'
    expect(bytes[1]).toBe(0x50); // 'P'
    expect(bytes[2]).toBe(0x44); // 'D'
    expect(bytes[3]).toBe(0x46); // 'F'

    const loaded = await PDFDocument.load(bytes);
    expect(loaded.getPageCount()).toBeGreaterThanOrEqual(1);

    const fields = loaded.getForm().getFields();
    const checkBoxes = fields.filter((f): f is PDFCheckBox => f instanceof PDFCheckBox);
    expect(checkBoxes).toHaveLength(4);
    expect(checkBoxes[0].isChecked()).toBe(true);
    expect(checkBoxes[1].isChecked()).toBe(false);
  });

  it("supports multi-page pagination and combined multi-service packet PDFs with steps", async () => {
    const longList = Object.keys(REQUIREMENT_BISAYA_MAP).slice(0, 32);
    const bytes = await generateChecklistPdfBytes({
      title: "Combined Public Service Documentary Checklist",
      subtitle: "Malaybalay City Complete Verification Packet",
      sections: groupRequirementsIntoSections(longList, "long-test"),
      steps: [
        "Gather all required documents and valid IDs.",
        "Submit your packet at the designated New City Hall counter.",
      ],
      filename: "long-checklist.pdf",
    });
    const loaded = await PDFDocument.load(bytes);
    expect(loaded.getPageCount()).toBeGreaterThanOrEqual(2);
    expect(loaded.getForm().getFields()).toHaveLength(32);

    // Combined "Download All Checklists" packet mode across multiple PESO Charter services
    const batchBytes = await generateChecklistPdfBytes({
      title: "PESO Malaybalay — All Service Checklists",
      subtitle: "Complete citizen packet",
      sections: [],
      packets: PESO_CHARTER_SERVICES_2026.slice(0, 3).map((s, idx) => ({
        title: s.title,
        whoMayAvail: s.whoMayAvail,
        metadata: [
          { label: "Fee", value: s.fee },
          { label: "Processing time", value: s.processingTime },
        ],
        sections: groupRequirementsIntoSections(s.requirements, `batch-${idx}`),
        steps: s.steps,
      })),
      filename: "peso-batch.pdf",
    });
    const expectedTotalReqs = PESO_CHARTER_SERVICES_2026.slice(0, 3).reduce(
      (sum, s) => sum + s.requirements.length,
      0,
    );
    const batchDoc = await PDFDocument.load(batchBytes);
    expect(batchDoc.getPageCount()).toBeGreaterThanOrEqual(1);
    expect(batchDoc.getForm().getFields()).toHaveLength(expectedTotalReqs);
  });

  it("toggles checkboxes independently, updates completion state, and resets cleanly", () => {
    const sections = buildBarangayChecklistSections("Casisang");
    render(
      <InteractiveChecklist
        title="Barangay Casisang Checklist"
        sections={sections}
        downloadTitle="Barangay Casisang Checklist"
        downloadFilename="casisang.pdf"
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThanOrEqual(6);
    expect(screen.getByText(/0 of 7 checked/i)).toBeInTheDocument();

    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[0].closest("label")).toHaveClass("is-checked");
    expect(screen.getByText(/1 of 7 checked/i)).toBeInTheDocument();

    // Verify Cebuano/Bisaya translation appears right inside the same item label
    expect(
      screen.getByText(/1 ka balido nga ID gikan sa gobyerno/i),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Clear checked items/i }));
    expect(checkboxes[0]).not.toBeChecked();
    expect(screen.getByText(/0 of 7 checked/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download Checklist/i })).toBeEnabled();
  });

  it("builds tailored school checklists for both basic education and state universities", () => {
    const deped = educationInstitutions.find((s) => s.type === "Public")!;
    const buksu = educationInstitutions.find((s) => s.slug === "bukidnon-state-university")!;

    const depedSections = buildSchoolChecklistSections(deped);
    expect(depedSections.flatMap((s) => s.items).some((i) => /DepEd Basic Education/i.test(i.english))).toBe(true);

    const buksuSections = buildSchoolChecklistSections(buksu);
    expect(buksuSections.flatMap((s) => s.items).some((i) => /Good Moral/i.test(i.english))).toBe(true);
  });

  it("renders interactive bilingual checklists on standalone office, school, barangay, and document pages", () => {
    // 1. Document guide page (/documents)
    const docView = render(
      <MemoryRouter initialEntries={["/documents"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThanOrEqual(8);
    expect(screen.getByRole("button", { name: /Download Checklist/i })).toBeEnabled();
    docView.unmount();

    // 2. Office page (/offices/bpld)
    const bpldView = render(
      <MemoryRouter initialEntries={["/offices/bpld"]}>
        <App />
      </MemoryRouter>,
    );
    expect(bpldView.getAllByRole("checkbox").length).toBeGreaterThanOrEqual(4);
    expect(bpldView.getAllByRole("button", { name: /Download Checklist/i }).length).toBeGreaterThanOrEqual(1);
    bpldView.unmount();

    // 3. Barangay profile page (/barangays/casisang)
    const brgyView = render(
      <MemoryRouter initialEntries={["/barangays/casisang"]}>
        <App />
      </MemoryRouter>,
    );
    expect(brgyView.getAllByRole("checkbox").length).toBeGreaterThanOrEqual(6);
    expect(brgyView.getByRole("button", { name: /Download Checklist/i })).toBeEnabled();
    brgyView.unmount();

    // 4. School profile page (/education/bukidnon-state-university)
    const schoolView = render(
      <MemoryRouter initialEntries={["/education/bukidnon-state-university"]}>
        <App />
      </MemoryRouter>,
    );
    expect(schoolView.getAllByRole("checkbox").length).toBeGreaterThanOrEqual(5);
    expect(schoolView.getByRole("button", { name: /Download Checklist/i })).toBeEnabled();
    schoolView.unmount();

    // 5. PESO standalone subdomain (?office=peso)
    vi.stubGlobal("location", { ...window.location, hostname: "peso.bettermalaybalay.cloud", pathname: "/", search: "" });
    const pesoSubdomain = render(
      <MemoryRouter initialEntries={["/?office=peso"]}>
        <App />
      </MemoryRouter>,
    );
    expect(pesoSubdomain.getAllByRole("checkbox").length).toBeGreaterThanOrEqual(2);
    expect(pesoSubdomain.getAllByRole("button", { name: /Download Checklist/i }).length).toBeGreaterThanOrEqual(1);
    pesoSubdomain.unmount();
    vi.unstubAllGlobals();
  });
});
