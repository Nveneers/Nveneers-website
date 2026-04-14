"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/content/home";

type MobileHeaderProps = {
  locale: Locale;
  navigation: { label: string; href: string }[];
  cta: { label: string; href: string };
  brand: { name: string; logoFull: string; logoAlt: string };
  languageToggle: { label: string; href: string; ariaLabel: string };
};

// Mobile header with slide-over menu.
export default function MobileHeader({
  locale,
  navigation,
  cta,
  brand,
  languageToggle
}: MobileHeaderProps) {
  const [open, setOpen] = useState(false);
  const menuLabel = locale === "ar" ? "\u0627\u0644\u0642\u0627\u0626\u0645\u0629" : "Menu";
  const closeLabel = locale === "ar" ? "\u0625\u063a\u0644\u0627\u0642" : "Close";
  const openLabel = locale === "ar" ? "\u0641\u062a\u062d \u0627\u0644\u0642\u0627\u0626\u0645\u0629" : "Open menu";
  const navLabel =
    locale === "ar" ? "\u0627\u0644\u062a\u0646\u0642\u0644 \u0639\u0628\u0631 \u0627\u0644\u0647\u0627\u062a\u0641" : "Mobile navigation";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header dir="ltr" className="sticky top-0 z-40 md:hidden overflow-visible">
      <div className="border-b border-[var(--border)] bg-white overflow-visible" style={{ backdropFilter: "blur(12px)" }}>
        <div className="flex items-center justify-between px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
          <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
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
          <div className="flex items-center gap-2">
            <Link
              href={languageToggle.href}
              className="rounded-full border border-[var(--border)] px-3 py-2 text-[0.7rem] font-medium text-[var(--muted)] transition hover:border-brand-gold hover:text-brand-gold"
              aria-label={languageToggle.ariaLabel}
            >
              {languageToggle.label}
            </Link>
            <button
              type="button"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--muted)]"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={openLabel}
              onClick={() => setOpen(true)}
            >
              {menuLabel}
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={navLabel}
        aria-hidden={!open}
        onClick={closeMenu}
        className={`fixed inset-0 z-[60] transition duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ background: "rgba(10,22,40,0.96)", backdropFilter: "blur(12px)" }}
      >
        <div
          className="flex h-full flex-col overflow-y-auto px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
              <span className="sr-only">{brand.name}</span>
              <Image
                src={brand.logoFull}
                alt={brand.logoAlt}
                width={640}
                height={160}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <button
              type="button"
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white/60"
              onClick={closeMenu}
            >
              {closeLabel}
            </button>
          </div>

          <nav className="mt-10 flex flex-col gap-5 text-lg font-normal text-white/70">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="transition hover:text-brand-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-3 pt-10">
            <Link href={cta.href} className="btn-primary w-full" onClick={closeMenu}>
              {cta.label}
            </Link>
            <Link
              href={languageToggle.href}
              className="btn-secondary w-full border-white/20 text-white/60"
              aria-label={languageToggle.ariaLabel}
              onClick={closeMenu}
            >
              {languageToggle.label}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
