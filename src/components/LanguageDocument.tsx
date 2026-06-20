"use client";

import { useEffect } from "react";
import type { Locale } from "@/content/home";

type LanguageDocumentProps = {
  locale: Locale;
};

export default function LanguageDocument({ locale }: LanguageDocumentProps) {
  useEffect(() => {
    const direction = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale]);

  // On a fresh load (e.g. after a language switch), jump to the section named in
  // the URL hash so the reader keeps their place. Instant, not smooth, so it
  // snaps there instead of animating down from the top.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) {
      return;
    }
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "auto" });
    }
  }, []);

  return null;
}
