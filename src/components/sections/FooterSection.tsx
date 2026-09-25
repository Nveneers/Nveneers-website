import Link from "next/link";
import type { FooterContent } from "@/content/home";
import type { BrandContent, Locale } from "@/content/home/types";
import BrandLogo from "@/components/BrandLogo";

type FooterSectionProps = {
  content: FooterContent;
  brand: BrandContent;
  locale: Locale;
};

export default function FooterSection({ content, brand, locale }: FooterSectionProps) {
  return (
    <footer className="border-t border-brand-border bg-brand-canvas px-5 pb-28 pt-12 text-center text-xs text-brand-muted lg:pb-10">
      <Link href={`/${locale}`} className="mb-8 inline-flex"><BrandLogo brand={brand} className="w-36" /></Link>
      {content.links?.length ? (
        <nav className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {content.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center text-brand-muted transition hover:text-brand-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
      <p className="mx-auto max-w-2xl">{content.text}</p>
    </footer>
  );
}
