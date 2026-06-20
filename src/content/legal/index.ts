import type { LegalContent, LegalPageKey, Locale } from "./types";

import privacyEn from "./en/privacy.json";
import termsEn from "./en/terms.json";
import privacyAr from "./ar/privacy.json";
import termsAr from "./ar/terms.json";

export type { LegalContent, LegalPageKey, LegalSection } from "./types";

const legalContent: Record<Locale, Record<LegalPageKey, LegalContent>> = {
  en: {
    privacy: privacyEn as LegalContent,
    terms: termsEn as LegalContent
  },
  ar: {
    privacy: privacyAr as LegalContent,
    terms: termsAr as LegalContent
  }
};

export const getLegalContent = (
  locale: Locale,
  page: LegalPageKey
): LegalContent => (legalContent[locale] ?? legalContent.en)[page];
