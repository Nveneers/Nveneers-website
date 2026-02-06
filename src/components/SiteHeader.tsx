import Link from "next/link";
import Image from "next/image";

type SiteHeaderProps = {
  navigation: { label: string; href: string }[];
  cta: { label: string; href: string };
  brand: { name: string; logoFull: string; logoAlt: string };
};

// Desktop sticky header with primary CTA.
export default function SiteHeader({
  navigation,
  cta,
  brand
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 hidden border-b border-brand-teal/10 bg-white/95 backdrop-blur md:block">
      <div className="container flex h-[6.5rem] items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal"
        >
          <span className="sr-only">{brand.name}</span>
          <Image
            src={brand.logoFull}
            alt={brand.logoAlt}
            width={1280}
            height={320}
            className="h-24 w-auto md:h-28"
            priority
          />
        </Link>
        <nav className="flex items-center gap-8 text-sm text-brand-teal">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-brand-teal/70"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href={cta.href} className="btn-primary">
          {cta.label}
        </Link>
      </div>
    </header>
  );
}
