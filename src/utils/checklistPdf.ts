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

export type ChecklistPdfPacket = {
  title: string;
  subtitle?: string;
  metadata?: Array<{ label: string; value: string }>;
  whoMayAvail?: string;
  sections: ChecklistPdfSection[];
  steps?: string[];
};

export type ChecklistPdfDocumentInput = {
  title: string;
  subtitle?: string;
  entityLabel?: string;
  guideNote?: string;
  metadata?: Array<{ label: string; value: string }>;
  sections: ChecklistPdfSection[];
  steps?: string[];
  /** Optional multi-service batch mode rendered into one combined printable PDF packet. */
  packets?: ChecklistPdfPacket[];
  footerNote?: string;
  filename: string;
};

const PAGE_WIDTH = 595.28; // A4 width in pt
const PAGE_HEIGHT = 841.89; // A4 height in pt
const MARGIN_X = 42;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const BOTTOM_LIMIT = 56;
const CHECKBOX_SIZE = 12;
const TEXT_OFFSET_X = CHECKBOX_SIZE + 12;
const ITEM_TEXT_WIDTH = CONTENT_WIDTH - TEXT_OFFSET_X - 8;

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
  doc.setCreator("BetterMC - Malaybalay City Civic Information Portal");

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);
  const form = doc.getForm();

  const navy = rgb(0.06, 0.17, 0.34);
  const darkBanner = rgb(0.08, 0.21, 0.42);
  const accentBlue = rgb(0.1, 0.33, 0.71);
  const ink = rgb(0.07, 0.13, 0.23);
  const mutedSlate = rgb(0.34, 0.43, 0.55);
  const heroBg = rgb(0.945, 0.968, 0.996);
  const sectionBg = rgb(0.925, 0.955, 0.992);
  const stepBg = rgb(0.972, 0.982, 0.994);
  const boxFill = rgb(0.985, 0.992, 1);
  const hairline = rgb(0.83, 0.885, 0.945);
  const white = rgb(1, 1, 1);

  const pages: PDFPage[] = [];
  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  pages.push(page);
  let y = PAGE_HEIGHT - 36;
  let fieldCounter = 0;

  const startContinuationPage = () => {
    page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);
    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 5,
      width: PAGE_WIDTH,
      height: 5,
      color: accentBlue,
    });
    y = PAGE_HEIGHT - 36;
    page.drawText(sanitizePdfText(`${input.title} (continued)`), {
      x: MARGIN_X,
      y,
      size: 8.8,
      font: fontBold,
      color: mutedSlate,
    });
    y -= 9;
    page.drawLine({
      start: { x: MARGIN_X, y },
      end: { x: PAGE_WIDTH - MARGIN_X, y },
      thickness: 0.75,
      color: hairline,
    });
    y -= 18;
  };

  const ensureSpace = (neededHeight: number) => {
    if (y - neededHeight < BOTTOM_LIMIT) {
      startContinuationPage();
    }
  };

  // Top Civic Banner Header
  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 8,
    width: PAGE_WIDTH,
    height: 8,
    color: accentBlue,
  });

  const titleLines = wrapText(input.title, fontBold, 15.5, CONTENT_WIDTH - 24);
  const subLines = input.subtitle ? wrapText(input.subtitle, fontRegular, 9.6, CONTENT_WIDTH - 24) : [];
  const guideText =
    input.guideNote ??
    "How to use: Tick each box as you prepare (English requirement above, Cebuano/Bisaya guide below). Bring checked papers and follow the steps listed.";
  const guideLines = wrapText(guideText, fontRegular, 8.6, CONTENT_WIDTH - 24);

  const headerCardHeight =
    26 +
    titleLines.length * 19 +
    (subLines.length ? subLines.length * 13 + 4 : 0) +
    guideLines.length * 11.5 +
    16;

  page.drawRectangle({
    x: MARGIN_X,
    y: y - headerCardHeight + 10,
    width: CONTENT_WIDTH,
    height: headerCardHeight,
    color: heroBg,
    borderColor: hairline,
    borderWidth: 0.9,
  });
  page.drawRectangle({
    x: MARGIN_X,
    y: y - headerCardHeight + 10,
    width: 4,
    height: headerCardHeight,
    color: accentBlue,
  });

  let hy = y - 10;
  const eyebrow = sanitizePdfText(
    input.entityLabel
      ? `BETTERMC CIVIC CHECKLIST - ${input.entityLabel.toUpperCase()}`
      : "BETTERMC CIVIC CHECKLIST - MALAYBALAY CITY",
  );
  page.drawText(eyebrow, {
    x: MARGIN_X + 14,
    y: hy,
    size: 8.2,
    font: fontBold,
    color: accentBlue,
  });
  hy -= 18;

  for (const line of titleLines) {
    page.drawText(line, { x: MARGIN_X + 14, y: hy, size: 15.5, font: fontBold, color: navy });
    hy -= 19;
  }

  if (subLines.length > 0) {
    hy -= 2;
    for (const line of subLines) {
      page.drawText(line, { x: MARGIN_X + 14, y: hy, size: 9.6, font: fontRegular, color: mutedSlate });
      hy -= 13;
    }
  }

  hy -= 4;
  for (const line of guideLines) {
    page.drawText(line, { x: MARGIN_X + 14, y: hy, size: 8.6, font: fontItalic, color: ink });
    hy -= 11.5;
  }

  y -= headerCardHeight + 4;

  // Optional Global Metadata Bar
  if (input.metadata && input.metadata.length > 0) {
    const metaText = input.metadata
      .map((entry) => `${sanitizePdfText(entry.label)}: ${sanitizePdfText(entry.value)}`)
      .join("   |   ");
    const metaLines = wrapText(metaText, fontRegular, 8.6, CONTENT_WIDTH - 20);
    const metaHeight = metaLines.length * 12 + 12;
    ensureSpace(metaHeight);
    page.drawRectangle({
      x: MARGIN_X,
      y: y - metaHeight + 8,
      width: CONTENT_WIDTH,
      height: metaHeight,
      color: stepBg,
      borderColor: hairline,
      borderWidth: 0.75,
    });
    let my = y - 7;
    for (const line of metaLines) {
      page.drawText(line, { x: MARGIN_X + 10, y: my, size: 8.6, font: fontRegular, color: ink });
      my -= 12;
    }
    y -= metaHeight + 6;
  }

  const renderSectionsAndSteps = (
    sections: ChecklistPdfSection[],
    steps?: string[],
  ) => {
    for (const section of sections) {
      if (section.items.length === 0) continue;

      const firstItem = section.items[0];
      const firstEnLines = wrapText(firstItem.english, fontBold, 9.8, ITEM_TEXT_WIDTH);
      const firstBisLines = wrapText(firstItem.bisaya, fontItalic, 8.5, ITEM_TEXT_WIDTH);
      const headerHeight = section.titleBisaya ? 32 : 22;
      const firstItemHeight = Math.max(24, firstEnLines.length * 13 + firstBisLines.length * 11.5 + 14);
      ensureSpace(headerHeight + firstItemHeight);

      page.drawRectangle({
        x: MARGIN_X,
        y: y - headerHeight + 8,
        width: CONTENT_WIDTH,
        height: headerHeight - 2,
        color: sectionBg,
        borderColor: hairline,
        borderWidth: 0.65,
      });
      page.drawText(sanitizePdfText(section.title), {
        x: MARGIN_X + 10,
        y: y - 7,
        size: 9.6,
        font: fontBold,
        color: navy,
      });
      if (section.titleBisaya) {
        page.drawText(sanitizePdfText(section.titleBisaya), {
          x: MARGIN_X + 10,
          y: y - 18.5,
          size: 8.1,
          font: fontItalic,
          color: mutedSlate,
        });
      }
      y -= headerHeight + 8;

      for (const item of section.items) {
        const enLines = wrapText(item.english, fontBold, 9.8, ITEM_TEXT_WIDTH);
        const bisLines = wrapText(item.bisaya, fontItalic, 8.5, ITEM_TEXT_WIDTH);
        const itemHeight = Math.max(24, enLines.length * 13 + bisLines.length * 11.5 + 14);

        ensureSpace(itemHeight);

        fieldCounter += 1;
        const boxY = y - CHECKBOX_SIZE + 2;

        page.drawRectangle({
          x: MARGIN_X + 2,
          y: boxY,
          width: CHECKBOX_SIZE,
          height: CHECKBOX_SIZE,
          color: boxFill,
          borderColor: accentBlue,
          borderWidth: 1.05,
        });
        const checkBox = form.createCheckBox(`bmc_item_${fieldCounter}`);
        checkBox.addToPage(page, {
          x: MARGIN_X + 2,
          y: boxY,
          width: CHECKBOX_SIZE,
          height: CHECKBOX_SIZE,
          borderWidth: 1.05,
          borderColor: accentBlue,
          backgroundColor: boxFill,
        });
        if (item.checked) {
          checkBox.check();
        }

        let lineY = y - 1;
        for (const line of enLines) {
          page.drawText(line, {
            x: MARGIN_X + TEXT_OFFSET_X,
            y: lineY,
            size: 9.8,
            font: fontBold,
            color: ink,
          });
          lineY -= 13;
        }

        lineY -= 1.5;
        for (const line of bisLines) {
          page.drawText(line, {
            x: MARGIN_X + TEXT_OFFSET_X,
            y: lineY,
            size: 8.5,
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
      y -= 4;
    }

    // Step-by-Step Procedure Guide (if provided)
    if (steps && steps.length > 0) {
      const stepBlocks = steps.map((step, idx) =>
        wrapText(`${idx + 1}. ${step}`, fontRegular, 8.9, CONTENT_WIDTH - 24),
      );
      const estimatedStepsHeight =
        28 + stepBlocks.reduce((acc, lines) => acc + lines.length * 12 + 4, 0) + 10;

      // Keep step box together cleanly unless huge
      if (estimatedStepsHeight < 260) {
        ensureSpace(estimatedStepsHeight);
      } else {
        ensureSpace(56);
      }

      page.drawText("STEP-BY-STEP PROCEDURE", {
        x: MARGIN_X,
        y: y - 4,
        size: 9.2,
        font: fontBold,
        color: accentBlue,
      });
      y -= 16;

      for (const lines of stepBlocks) {
        const blockHeight = lines.length * 12 + 8;
        ensureSpace(blockHeight + 4);
        page.drawRectangle({
          x: MARGIN_X,
          y: y - blockHeight + 9,
          width: CONTENT_WIDTH,
          height: blockHeight,
          color: stepBg,
          borderColor: hairline,
          borderWidth: 0.6,
        });
        let sy = y - 4;
        for (const line of lines) {
          page.drawText(line, {
            x: MARGIN_X + 10,
            y: sy,
            size: 8.9,
            font: fontRegular,
            color: ink,
          });
          sy -= 12;
        }
        y -= blockHeight + 4;
      }
      y -= 6;
    }
  };

  if (input.packets && input.packets.length > 0) {
    // Summary Index Box listing all included service checklists
    ensureSpace(46);
    page.drawText(`INCLUDED SERVICE CHECKLISTS (${input.packets.length})`, {
      x: MARGIN_X,
      y: y - 4,
      size: 9.2,
      font: fontBold,
      color: accentBlue,
    });
    y -= 16;

    for (let i = 0; i < input.packets.length; i += 1) {
      const pkt = input.packets[i];
      const cleanIndexTitle = pkt.title.replace(/^\d+\.\s+/, "");
      const metaShort = pkt.metadata
        ? ` (${pkt.metadata.map((m) => `${sanitizePdfText(m.label)}: ${sanitizePdfText(m.value)}`).join(" | ")})`
        : "";
      const summaryLines = wrapText(`${i + 1}. ${cleanIndexTitle}${metaShort}`, fontRegular, 8.6, CONTENT_WIDTH - 16);
      ensureSpace(summaryLines.length * 11.5 + 4);
      for (const line of summaryLines) {
        page.drawText(line, { x: MARGIN_X + 8, y, size: 8.6, font: fontRegular, color: ink });
        y -= 11.5;
      }
    }
    y -= 10;

    for (let i = 0; i < input.packets.length; i += 1) {
      const pkt = input.packets[i];
      const pktTitleLines = wrapText(pkt.title, fontBold, 11.5, CONTENT_WIDTH - 20);
      const pktSubParts: string[] = [];
      if (pkt.subtitle) pktSubParts.push(pkt.subtitle);
      if (pkt.whoMayAvail) pktSubParts.push(`Who may avail: ${pkt.whoMayAvail}`);
      if (pkt.metadata?.length) {
        pktSubParts.push(pkt.metadata.map((m) => `${m.label}: ${m.value}`).join(" | "));
      }
      const pktMetaLines = pktSubParts.length
        ? wrapText(pktSubParts.join("  -  "), fontRegular, 8.3, CONTENT_WIDTH - 20)
        : [];
      const bannerHeight = 14 + pktTitleLines.length * 14.5 + (pktMetaLines.length ? pktMetaLines.length * 11 + 4 : 0);

      ensureSpace(bannerHeight + 60);
      page.drawRectangle({
        x: MARGIN_X,
        y: y - bannerHeight + 10,
        width: CONTENT_WIDTH,
        height: bannerHeight,
        color: darkBanner,
      });
      let by = y - 6;
      for (const line of pktTitleLines) {
        page.drawText(line, { x: MARGIN_X + 10, y: by, size: 11.5, font: fontBold, color: white });
        by -= 14.5;
      }
      if (pktMetaLines.length) {
        by -= 2;
        for (const line of pktMetaLines) {
          page.drawText(line, {
            x: MARGIN_X + 10,
            y: by,
            size: 8.3,
            font: fontRegular,
            color: rgb(0.84, 0.9, 0.98),
          });
          by -= 11;
        }
      }
      y -= bannerHeight + 10;

      renderSectionsAndSteps(pkt.sections, pkt.steps);
      y -= 6;
    }
  } else {
    renderSectionsAndSteps(input.sections, input.steps);
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
