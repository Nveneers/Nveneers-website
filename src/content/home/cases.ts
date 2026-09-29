import fs from "node:fs";
import path from "node:path";

import type { BeforeAfterCase, Locale } from "./types";

const CASES_DIR = path.join(process.cwd(), "public", "images", "cases");
const IMAGE_EXTENSIONS = new Set([".jpeg", ".jpg", ".png", ".webp", ".avif"]);

// Bounds measured from the supplied stacked photographs. Exclude divider lines
// and keep each original view intact. New, unconfigured photos stay static.
const COMPARISONS: Record<string, NonNullable<BeforeAfterCase["comparison"]>> = {
  "case-1.webp": { before: { top: 0, height: 0.462 }, after: { top: 0.474, height: 0.48 } },
  "case-2.webp": { before: { top: 0, height: 0.51 }, after: { top: 0.514, height: 0.486 } },
  "case-3.webp": { before: { top: 0, height: 0.545 }, after: { top: 0.55, height: 0.45 } },
  "case-4.webp": { before: { top: 0, height: 0.494 }, after: { top: 0.5, height: 0.5 } },
  "case-5.webp": { before: { top: 0, height: 0.496 }, after: { top: 0.502, height: 0.498 } }
};

// Generic alt text per locale — the gallery shows no per-image copy, this is for
// screen readers only.
const ALT_LABEL: Record<Locale, string> = {
  en: "Patient result",
  ar: "نتيجة المريض"
};

// Scans /public/images/cases at build time and returns every image found, so the
// before/after gallery is driven purely by the folder contents — drop a file in
// and it appears; remove one and it disappears. No metadata to maintain.
export function getBeforeAfterCases(locale: Locale): BeforeAfterCase[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(CASES_DIR);
  } catch {
    return [];
  }

  return files
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file, index) => ({
      id: path.parse(file).name,
      title: `${ALT_LABEL[locale]} ${index + 1}`,
      image: `/images/cases/${file}`,
      comparison: COMPARISONS[file]
    }));
}
