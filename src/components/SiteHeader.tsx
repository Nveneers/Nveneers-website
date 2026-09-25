import Link from "next/link";
import LanguageToggle from "@/components/LanguageToggle";
import HeaderNav from "@/components/HeaderNav";
import BrandLogo from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeProvider";
import type { BrandContent } from "@/content/home/types";

type SiteHeaderProps = {
  navigation: { label: string; href: string }[];
  cta: { label: string; href: string };
  brand: BrandContent;
  themeLabel: string;
  homeHref: string;
  languageToggle: { label: string; href: string; ariaLabel: string };
};
export default function SiteHeader({ navigation, cta, brand, themeLabel, homeHref, languageToggle }: SiteHeaderProps) {
  return (
    <header dir="ltr" className="site-header sticky top-0 z-40 hidden lg:block">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-6 px-6 xl:px-10">
        <Link href={homeHref} className="flex shrink-0 items-center"><BrandLogo brand={brand} className="w-36 xl:w-40" priority /></Link>
        <HeaderNav navigation={navigation} />
        <div className="flex shrink-0 items-center gap-3">
          <LanguageToggle href={languageToggle.href} label={languageToggle.label} ariaLabel={languageToggle.ariaLabel} />
          <ThemeToggle label={themeLabel} />
          <Link href={cta.href} className="btn-primary !px-5 !text-xs">{cta.label}</Link>
        </div>
      </div>
    </header>
  );
}
