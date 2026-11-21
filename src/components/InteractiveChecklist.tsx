import { useCallback, useId, useMemo, useState, type ReactNode } from "react";
import { Check, Download, FileStack, RotateCcw } from "lucide-react";
import type { ChecklistSection } from "../requirementTranslations";
import type { ChecklistPdfDocumentInput, ChecklistPdfPacket } from "../utils/checklistPdf";

export type InteractiveChecklistProps = {
  /** Visible heading above the checklist; omit or pass compact when embedded inside an accordion column. */
  title?: string;
  subtitle?: string;
  guideNote?: string;
  sections: ChecklistSection[];
  steps?: string[];
  downloadTitle: string;
  downloadSubtitle?: string;
  entityLabel?: string;
  downloadFilename: string;
  metadata?: Array<{ label: string; value: string }>;
  footerNote?: string;
  compact?: boolean;
  /** Key used for persisting checked items in localStorage (uncontrolled mode). */
  storageKey?: string;
  /** Controlled mode: map keyed by either item.id or item.english. */
  checkedMap?: Record<string, boolean>;
  onToggleItem?: (itemKey: string, itemEnglish: string) => void;
  onResetChecks?: () => void;
  /** Optional custom match key resolver for controlled mode (defaults to "id"). */
  controlledMatchBy?: "id" | "english";
  extraActions?: ReactNode;
  ariaLabel?: string;
};

function readStoredMap(storageKey?: string): Record<string, boolean> {
  if (!storageKey || typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(`bmc:checklist:${storageKey}`);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, boolean>;
    }
  } catch {
    // Storage unavailable or malformed
  }
  return {};
}

export type DownloadAllChecklistsButtonProps = {
  label?: string;
  count: number;
  title: string;
  subtitle?: string;
  entityLabel?: string;
  guideNote?: string;
  metadata?: Array<{ label: string; value: string }>;
  packets: ChecklistPdfPacket[];
  footerNote?: string;
  filename: string;
  className?: string;
};

/**
 * Downloads a combined, multi-service printable bilingual PDF containing every checklist,
 * Bisaya translation, interactive checkbox field, and step-by-step guide in one file.
 */
export function DownloadAllChecklistsButton({
  label,
  count,
  title,
  subtitle,
  entityLabel,
  guideNote,
  metadata,
  packets,
  footerNote,
  filename,
  className = "",
}: DownloadAllChecklistsButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleClick = useCallback(async () => {
    if (packets.length === 0 || downloading) return;
    setDownloading(true);
    try {
      const { downloadChecklistPdf } = await import("../utils/checklistPdf");
      await downloadChecklistPdf({
        title,
        subtitle,
        entityLabel,
        guideNote:
          guideNote ??
          "Complete Printable Packet: Tick requirements as you prepare (English first, Cebuano/Bisaya below) and follow the step-by-step guide for each service.",
        metadata,
        sections: [],
        packets,
        footerNote,
        filename,
      });
    } finally {
      setDownloading(false);
    }
  }, [
    downloading,
    entityLabel,
    filename,
    footerNote,
    guideNote,
    metadata,
    packets,
    subtitle,
    title,
  ]);

  if (count === 0 || packets.length === 0) return null;

  return (
    <button
      type="button"
      className={`bmc-download-all-btn${className ? ` ${className}` : ""}`}
      onClick={() => void handleClick()}
      disabled={downloading}
    >
      <FileStack aria-hidden="true" />
      <span>
        {downloading
          ? `Preparing ${count} Checklists PDF...`
          : label ?? `Download All Checklists (${count})`}
      </span>
    </button>
  );
}

export function InteractiveChecklist({
  title = "Documentary Requirements Checklist",
  subtitle,
  guideNote,
  sections,
  steps,
  downloadTitle,
  downloadSubtitle,
  entityLabel,
  downloadFilename,
  metadata,
  footerNote,
  compact = false,
  storageKey,
  checkedMap,
  onToggleItem,
  onResetChecks,
  controlledMatchBy = "id",
  extraActions,
  ariaLabel,
}: InteractiveChecklistProps) {
  const headingId = useId();
  const isControlled = checkedMap !== undefined;
  const [internalState, setInternalState] = useState<{
    key: string | undefined;
    map: Record<string, boolean>;
  }>(() => ({ key: storageKey, map: readStoredMap(storageKey) }));
  const [downloading, setDownloading] = useState(false);

  const activeInternalMap = useMemo(
    () => (internalState.key === storageKey ? internalState.map : readStoredMap(storageKey)),
    [internalState, storageKey],
  );

  const activeChecked = isControlled ? checkedMap : activeInternalMap;

  const isItemChecked = useCallback(
    (itemId: string, itemEnglish: string) => {
      if (isControlled) {
        const key = controlledMatchBy === "english" ? itemEnglish : itemId;
        return Boolean(activeChecked[key]);
      }
      return Boolean(activeChecked[itemId]);
    },
    [activeChecked, controlledMatchBy, isControlled],
  );

  const handleToggle = useCallback(
    (itemId: string, itemEnglish: string) => {
      if (isControlled) {
        onToggleItem?.(controlledMatchBy === "english" ? itemEnglish : itemId, itemEnglish);
        return;
      }
      setInternalState((prev) => {
        const base = prev.key === storageKey ? prev.map : readStoredMap(storageKey);
        const next = { ...base, [itemId]: !base[itemId] };
        if (storageKey && typeof window !== "undefined") {
          try {
            window.localStorage.setItem(`bmc:checklist:${storageKey}`, JSON.stringify(next));
          } catch {
            // ignore quota errors
          }
        }
        return { key: storageKey, map: next };
      });
    },
    [controlledMatchBy, isControlled, onToggleItem, storageKey],
  );

  const handleReset = useCallback(() => {
    if (isControlled) {
      onResetChecks?.();
      return;
    }
    setInternalState({ key: storageKey, map: {} });
    if (storageKey && typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(`bmc:checklist:${storageKey}`);
      } catch {
        // ignore storage errors
      }
    }
  }, [isControlled, onResetChecks, storageKey]);

  const allItems = useMemo(() => sections.flatMap((section) => section.items), [sections]);
  const totalCount = allItems.length;
  const completedCount = useMemo(
    () => allItems.filter((item) => isItemChecked(item.id, item.english)).length,
    [allItems, isItemChecked],
  );
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allComplete = totalCount > 0 && completedCount === totalCount;

  const handleDownloadPdf = useCallback(async () => {
    if (totalCount === 0 || downloading) return;
    setDownloading(true);
    try {
      const { downloadChecklistPdf } = await import("../utils/checklistPdf");
      const payload: ChecklistPdfDocumentInput = {
        title: downloadTitle,
        subtitle: downloadSubtitle,
        entityLabel,
        guideNote,
        metadata,
        steps,
        footerNote,
        filename: downloadFilename,
        sections: sections.map((section) => ({
          title: section.title,
          titleBisaya: section.titleBisaya,
          items: section.items.map((item) => ({
            id: item.id,
            english: item.english,
            bisaya: item.bisaya,
            checked: isItemChecked(item.id, item.english),
          })),
        })),
      };
      await downloadChecklistPdf(payload);
    } finally {
      setDownloading(false);
    }
  }, [
    downloadFilename,
    downloadSubtitle,
    downloadTitle,
    downloading,
    entityLabel,
    footerNote,
    guideNote,
    isItemChecked,
    metadata,
    sections,
    steps,
    totalCount,
  ]);

  if (totalCount === 0) return null;

  return (
    <div
      className={`bmc-checklist-card${compact ? " is-compact" : ""}`}
      role="region"
      aria-labelledby={!ariaLabel ? headingId : undefined}
      aria-label={ariaLabel}
    >
      <div className="bmc-checklist-header">
        <div className="bmc-checklist-header-top">
          <div className="bmc-checklist-heading-group">
            <div className="bmc-checklist-title-row">
              <h4 id={headingId} className="bmc-checklist-title">
                {title}
              </h4>
              <span
                className={`bmc-checklist-progress${allComplete ? " is-complete" : ""}`}
                aria-live="polite"
              >
                {allComplete ? (
                  <>
                    <Check aria-hidden="true" />
                    <span>
                      {completedCount}/{totalCount} ready
                    </span>
                  </>
                ) : (
                  <span>
                    {completedCount} of {totalCount} checked
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="bmc-checklist-toolbar">
            {completedCount > 0 ? (
              <button
                type="button"
                className="bmc-checklist-reset-btn"
                onClick={handleReset}
                aria-label="Clear checked items"
              >
                <RotateCcw aria-hidden="true" />
                <span>Reset</span>
              </button>
            ) : null}
            <button
              type="button"
              className="bmc-checklist-download-btn"
              onClick={() => void handleDownloadPdf()}
              disabled={downloading}
            >
              <Download aria-hidden="true" />
              <span>{downloading ? "Preparing PDF..." : "Download Checklist"}</span>
            </button>
            {extraActions}
          </div>
        </div>

        <div className="bmc-checklist-progress-track" aria-hidden="true">
          <span
            className={`bmc-checklist-progress-fill${allComplete ? " is-complete" : ""}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="bmc-checklist-subtitle">
          {subtitle ??
            "Tick items as you prepare them. English requirement on top, Cebuano/Bisaya guide below."}
        </p>
      </div>

      <div className="bmc-checklist-sections">
        {sections.map((section) => {
          const sectionDoneCount = section.items.filter((item) =>
            isItemChecked(item.id, item.english),
          ).length;
          return (
            <div key={section.title} className="bmc-checklist-section">
              <div className="bmc-checklist-section-head">
                <div className="bmc-checklist-section-titles">
                  <h5>{section.title}</h5>
                  {section.titleBisaya ? (
                    <span className="bmc-checklist-section-bisaya">{section.titleBisaya}</span>
                  ) : null}
                </div>
                <span className="bmc-checklist-section-count">
                  {sectionDoneCount}/{section.items.length}
                </span>
              </div>
              <div className="bmc-checklist-items">
                {section.items.map((item) => {
                  const checked = isItemChecked(item.id, item.english);
                  return (
                    <label
                      key={item.id}
                      className={`bmc-checklist-item${checked ? " is-checked" : ""}`}
                    >
                      <input
                        type="checkbox"
                        className="bmc-checklist-checkbox"
                        checked={checked}
                        onChange={() => handleToggle(item.id, item.english)}
                      />
                      <span className="bmc-checklist-text">
                        <span className="bmc-checklist-en">{item.english}</span>
                        <span className="bmc-checklist-bisaya">{item.bisaya}</span>
                      </span>
                      {checked ? (
                        <span className="bmc-checklist-done-badge" aria-hidden="true">
                          <Check aria-hidden="true" />
                        </span>
                      ) : null}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
