import fs from "node:fs";
import path from "node:path";

import type { BeforeAfterCase, Locale } from "./types";

const CASES_DIR = path.join(process.cwd(), "public", "images", "cases");
const IMAGE_EXTENSIONS = new Set([".jpeg", ".jpg", ".png", ".webp", ".avif"]);

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
      image: `/images/cases/${file}`
    }));
}
