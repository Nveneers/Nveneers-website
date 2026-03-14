import Link from "next/link";
import Image from "next/image";

type SiteHeaderProps = {
  navigation: { label: string; href: string }[];
  cta: { label: string; href: string };
  brand: { name: string; logoFull: string; logoAlt: string };
  languageToggle: { label: string; href: string; ariaLabel: string };
};

// Desktop sticky header with primary CTA.
export default function SiteHeader({
  navigation,
  cta,
  brand,
  languageToggle
}: SiteHeaderProps) {
  return (
    <header dir="ltr" className="sticky top-0 z-40 hidden overflow-visible border-b border-[var(--border)] bg-white md:block" style={{ backdropFilter: "blur(12px)" }}>
      <div className="flex h-16 items-center justify-between overflow-visible px-16">
        <Link
          href="/"
          className="relative z-10 flex-shrink-0"
        >
          <span className="sr-only">{brand.name}</span>
          <Image
            src={brand.logoFull}
            alt={brand.logoAlt}
            width={1280}
            height={320}
            className="h-[10rem] w-auto"
            priority
          />
        </Link>
        <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-8 text-[0.8rem] uppercase tracking-[0.05em]">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-[var(--muted)] transition hover:text-brand-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href={languageToggle.href}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] transition hover:text-brand-gold"
            aria-label={languageToggle.ariaLabel}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {languageToggle.label}
          </Link>
          <Link href={cta.href} className="btn-primary px-4 py-2 text-xs">
            {cta.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
