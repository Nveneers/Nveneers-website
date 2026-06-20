import type { Locale } from "@/content/home";

export type LegalSection = {
  heading: string;
  body: string[];
};

export type LegalContent = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  backLabel: string;
};

export type LegalPageKey = "privacy" | "terms";

export type { Locale };
