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

  return null;
}
