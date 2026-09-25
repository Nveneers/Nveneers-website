import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeProvider";
import type { Locale } from "@/content/home/types";
import enBrand from "@/content/home/en/brand.json";
import arBrand from "@/content/home/ar/brand.json";
import enUi from "@/content/home/en/ui.json";
import arUi from "@/content/home/ar/ui.json";

export default function UtilityHeader({ locale = "en" }: { locale?: Locale }) {
  const brand = locale === "ar" ? arBrand : enBrand;
  const ui = locale === "ar" ? arUi : enUi;
  return (
    <header className="site-header px-5 py-5 sm:px-8" dir="ltr">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href={`/${locale}`}><BrandLogo brand={brand} priority /></Link>
        <ThemeToggle label={ui.header.themeToggleLabel} />
      </div>
    </header>
  );
}
