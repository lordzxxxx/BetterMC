import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export type ChecklistPdfItem = {
  id: string;
  english: string;
  bisaya: string;
  checked?: boolean;
};

export type ChecklistPdfSection = {
  title: string;
  titleBisaya?: string;
  items: ChecklistPdfItem[];
};

export type ChecklistPdfDocumentInput = {
  title: string;
  subtitle?: string;
  entityLabel?: string;
  metadata?: Array<{ label: string; value: string }>;
  sections: ChecklistPdfSection[];
  footerNote?: string;
  filename: string;
};

const PAGE_WIDTH = 595.28; // A4 width in pt
const PAGE_HEIGHT = 841.89; // A4 height in pt
const MARGIN_X = 44;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const BOTTOM_LIMIT = 56;
const CHECKBOX_SIZE = 12;
const TEXT_OFFSET_X = CHECKBOX_SIZE + 12;
const ITEM_TEXT_WIDTH = CONTENT_WIDTH - TEXT_OFFSET_X - 4;

/**
 * Normalizes strings for PDF StandardFont (WinAnsi) encoding so Philippine Peso signs,
 * typographic dashes/quotes, and special characters render cleanly without throwing.
 */
export function sanitizePdfText(value: string): string {
  return value
    .replace(/\u20B1/g, "PHP ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2022/g, "-")
    .replace(/\u2265/g, ">=")
    .replace(/\u2264/g, "<=")
    .replace(/[\u00A0\s]+/g, " ")
    .replace(/[^\x20-\xFF]/g, "")
    .trim();
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const clean = sanitizePdfText(text);
  if (!clean) return [];
  const words = clean.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      if (font.widthOfTextAtSize(word, fontSize) <= maxWidth) {
        current = word;
      } else {
        // Hard-break an extra-long token (e.g. URL) cleanly.
        let chunk = "";
        for (const ch of word) {
          const next = `${chunk}${ch}`;
          if (font.widthOfTextAtSize(next, fontSize) <= maxWidth) {
            chunk = next;
          } else {
            if (chunk) lines.push(chunk);
            chunk = ch;
          }
        }
        current = chunk;
      }
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function generateChecklistPdfBytes(
  input: ChecklistPdfDocumentInput,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(sanitizePdfText(input.title));
  doc.setSubject("BetterMC Bilingual Public Service Checklist (English / Cebuano-Bisaya)");
  doc.setCreator("BetterMC — Malaybalay City Civic Information Portal");

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);
  const form = doc.getForm();

  const navy = rgb(0.06, 0.18, 0.36);
  const accentBlue = rgb(0.11, 0.34, 0.72);
  const ink = rgb(0.08, 0.14, 0.24);
  const mutedSlate = rgb(0.35, 0.44, 0.56);
  const sectionBg = rgb(0.94, 0.965, 0.995);
  const hairline = rgb(0.84, 0.89, 0.95);
  const white = rgb(1, 1, 1);

  const pages: PDFPage[] = [];
  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  pages.push(page);
  let y = PAGE_HEIGHT - 44;

  const startContinuationPage = () => {
    page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);
    y = PAGE_HEIGHT - 48;
    page.drawText(sanitizePdfText(`${input.title} (continued)`), {
      x: MARGIN_X,
      y,
      size: 9,
      font: fontBold,
      color: mutedSlate,
    });
    y -= 10;
    page.drawLine({
      start: { x: MARGIN_X, y },
      end: { x: PAGE_WIDTH - MARGIN_X, y },
      thickness: 0.75,
      color: hairline,
    });
    y -= 18;
  };

  // Document Header
  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 8,
    width: PAGE_WIDTH,
    height: 8,
    color: accentBlue,
  });

  const eyebrow = sanitizePdfText(
    input.entityLabel
      ? `BETTERMC CIVIC CHECKLIST - ${input.entityLabel.toUpperCase()}`
      : "BETTERMC CIVIC CHECKLIST - MALAYBALAY CITY",
  );
  page.drawText(eyebrow, {
    x: MARGIN_X,
    y,
    size: 8.5,
    font: fontBold,
    color: accentBlue,
  });
  y -= 20;

  const titleLines = wrapText(input.title, fontBold, 16, CONTENT_WIDTH);
  for (const line of titleLines) {
    page.drawText(line, { x: MARGIN_X, y, size: 16, font: fontBold, color: navy });
    y -= 20;
  }

  if (input.subtitle) {
    const subLines = wrapText(input.subtitle, fontRegular, 10, CONTENT_WIDTH);
    for (const line of subLines) {
      page.drawText(line, { x: MARGIN_X, y, size: 10, font: fontRegular, color: mutedSlate });
      y -= 14;
    }
  }

  if (input.metadata && input.metadata.length > 0) {
    y -= 4;
    const metaText = input.metadata
      .map((entry) => `${sanitizePdfText(entry.label)}: ${sanitizePdfText(entry.value)}`)
      .join("   |   ");
    const metaLines = wrapText(metaText, fontRegular, 8.8, CONTENT_WIDTH - 20);
    const boxHeight = metaLines.length * 12 + 14;
    page.drawRectangle({
      x: MARGIN_X,
      y: y - boxHeight + 10,
      width: CONTENT_WIDTH,
      height: boxHeight,
      color: sectionBg,
      borderColor: hairline,
      borderWidth: 0.75,
    });
    let metaY = y - 6;
    for (const line of metaLines) {
      page.drawText(line, { x: MARGIN_X + 10, y: metaY, size: 8.8, font: fontRegular, color: ink });
      metaY -= 12;
    }
    y -= boxHeight + 8;
  } else {
    y -= 8;
  }

  page.drawLine({
    start: { x: MARGIN_X, y },
    end: { x: PAGE_WIDTH - MARGIN_X, y },
    thickness: 1,
    color: hairline,
  });
  y -= 18;

  let fieldCounter = 0;

  for (const section of input.sections) {
    if (section.items.length === 0) continue;

    // Estimate section header + first item height so a section header isn't orphaned at page bottom.
    const firstItem = section.items[0];
    const firstEnLines = wrapText(firstItem.english, fontBold, 10, ITEM_TEXT_WIDTH);
    const firstBisLines = wrapText(firstItem.bisaya, fontItalic, 8.6, ITEM_TEXT_WIDTH);
    const headerHeight = section.titleBisaya ? 36 : 24;
    const firstItemHeight = Math.max(24, firstEnLines.length * 13.5 + firstBisLines.length * 11.5 + 14);
    if (y - (headerHeight + firstItemHeight) < BOTTOM_LIMIT) {
      startContinuationPage();
    }

    // Section Title Bar
    page.drawRectangle({
      x: MARGIN_X,
      y: y - headerHeight + 8,
      width: CONTENT_WIDTH,
      height: headerHeight - 4,
      color: sectionBg,
      borderColor: hairline,
      borderWidth: 0.6,
    });
    page.drawText(sanitizePdfText(section.title), {
      x: MARGIN_X + 10,
      y: y - 9,
      size: 10,
      font: fontBold,
      color: navy,
    });
    if (section.titleBisaya) {
      page.drawText(sanitizePdfText(section.titleBisaya), {
        x: MARGIN_X + 10,
        y: y - 21,
        size: 8.2,
        font: fontItalic,
        color: mutedSlate,
      });
    }
    y -= headerHeight + 8;

    for (const item of section.items) {
      const enLines = wrapText(item.english, fontBold, 10, ITEM_TEXT_WIDTH);
      const bisLines = wrapText(item.bisaya, fontItalic, 8.6, ITEM_TEXT_WIDTH);
      const itemHeight = Math.max(24, enLines.length * 13.5 + bisLines.length * 11.5 + 14);

      if (y - itemHeight < BOTTOM_LIMIT) {
        startContinuationPage();
      }

      fieldCounter += 1;
      const boxY = y - CHECKBOX_SIZE + 2;

      // Crisp printable empty/checked square backing + interactive AcroForm CheckBox widget
      page.drawRectangle({
        x: MARGIN_X + 2,
        y: boxY,
        width: CHECKBOX_SIZE,
        height: CHECKBOX_SIZE,
        color: white,
        borderColor: accentBlue,
        borderWidth: 1,
      });
      const checkBox = form.createCheckBox(`bmc_item_${fieldCounter}`);
      checkBox.addToPage(page, {
        x: MARGIN_X + 2,
        y: boxY,
        width: CHECKBOX_SIZE,
        height: CHECKBOX_SIZE,
        borderWidth: 1,
        borderColor: accentBlue,
        backgroundColor: white,
      });
      if (item.checked) {
        checkBox.check();
      }

      let lineY = y - 1;
      for (const line of enLines) {
        page.drawText(line, {
          x: MARGIN_X + TEXT_OFFSET_X,
          y: lineY,
          size: 10,
          font: fontBold,
          color: ink,
        });
        lineY -= 13.5;
      }

      lineY -= 1.5;
      for (const line of bisLines) {
        page.drawText(line, {
          x: MARGIN_X + TEXT_OFFSET_X,
          y: lineY,
          size: 8.6,
          font: fontItalic,
          color: mutedSlate,
        });
        lineY -= 11.5;
      }

      y -= itemHeight - 4;
      page.drawLine({
        start: { x: MARGIN_X + TEXT_OFFSET_X, y: y + 4 },
        end: { x: PAGE_WIDTH - MARGIN_X, y: y + 4 },
        thickness: 0.45,
        color: hairline,
      });
      y -= 8;
    }

    y -= 6;
  }

  // Footers across all pages
  const footerText = sanitizePdfText(
    input.footerNote ??
      "Confirm current documentary requirements, fees, and schedules with the issuing office before visiting.",
  );
  const totalPages = pages.length;
  pages.forEach((p, idx) => {
    p.drawLine({
      start: { x: MARGIN_X, y: 38 },
      end: { x: PAGE_WIDTH - MARGIN_X, y: 38 },
      thickness: 0.6,
      color: hairline,
    });
    const clippedNote =
      fontRegular.widthOfTextAtSize(footerText, 7.8) <= CONTENT_WIDTH - 70
        ? footerText
        : `${footerText.slice(0, 92)}...`;
    p.drawText(clippedNote, {
      x: MARGIN_X,
      y: 24,
      size: 7.8,
      font: fontRegular,
      color: mutedSlate,
    });
    const pageLabel = `Page ${idx + 1} of ${totalPages}`;
    const labelWidth = fontBold.widthOfTextAtSize(pageLabel, 8);
    p.drawText(pageLabel, {
      x: PAGE_WIDTH - MARGIN_X - labelWidth,
      y: 24,
      size: 8,
      font: fontBold,
      color: mutedSlate,
    });
  });

  return doc.save();
}

export function slugifyFilename(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "bettermc-checklist";
}

export async function downloadChecklistPdf(input: ChecklistPdfDocumentInput): Promise<void> {
  const bytes = await generateChecklistPdfBytes(input);
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = input.filename.endsWith(".pdf") ? input.filename : `${input.filename}.pdf`;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
