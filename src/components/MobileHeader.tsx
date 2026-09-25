"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LanguageToggle from "@/components/LanguageToggle";
import BrandLogo from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeProvider";
import type { Locale } from "@/content/home";
import type { BrandContent } from "@/content/home/types";

type MobileHeaderProps = {
  locale: Locale;
  navigation: { label: string; href: string }[];
  brand: BrandContent;
  themeLabel: string;
  languageToggle: { label: string; href: string; ariaLabel: string };
};
export default function MobileHeader({ locale, navigation, brand, themeLabel, languageToggle }: MobileHeaderProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuLabel = locale === "ar" ? "القائمة" : "Menu";
  const closeLabel = locale === "ar" ? "إغلاق" : "Close";
  const navLabel = locale === "ar" ? "التنقل عبر الهاتف" : "Mobile navigation";
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    focusable()[0]?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab") {
        const elements = focusable();
        const first = elements[0], last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);
  const closeMenu = () => setOpen(false);
  return (
    <header dir="ltr" className="site-header sticky top-0 z-[60] lg:hidden">
      <div className="flex min-h-[72px] items-center justify-between gap-2 px-3 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] min-[360px]:px-4">
        <Link href={`/${locale}`} className="flex items-center" onClick={closeMenu}><BrandLogo brand={brand} className="w-20 min-[360px]:w-28 sm:w-36" priority /></Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <LanguageToggle href={languageToggle.href} label={languageToggle.label} ariaLabel={languageToggle.ariaLabel} />
          <ThemeToggle label={themeLabel} />
          <button ref={triggerRef} type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-border text-brand-heading" aria-expanded={open} aria-controls="mobile-menu" aria-label={menuLabel} onClick={() => setOpen(true)}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>
          </button>
        </div>
      </div>
      {open && (
        <div ref={menuRef} id="mobile-menu" role="dialog" aria-modal="true" aria-label={navLabel} className="fixed inset-0 z-[70] flex h-[100dvh] flex-col overflow-y-auto bg-brand-canvas px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(1.5rem+env(safe-area-inset-top))]">
          <div className="flex items-center justify-between gap-4">
            <Link href={`/${locale}`} onClick={closeMenu}><BrandLogo brand={brand} /></Link>
            <button type="button" className="btn-secondary !px-5 !py-2" onClick={closeMenu}>{closeLabel}</button>
          </div>
          <nav dir={locale === "ar" ? "rtl" : "ltr"} className="mt-12 flex flex-col text-2xl font-medium text-brand-heading">
            {navigation.map(item => <Link key={item.href} href={item.href} onClick={closeMenu} className="border-b border-brand-border py-5 transition hover:text-brand-accent">{item.label}</Link>)}
          </nav>
          <div className="mt-auto flex items-center justify-between gap-4 pt-10">
            <LanguageToggle href={languageToggle.href} label={languageToggle.label} ariaLabel={languageToggle.ariaLabel} onNavigate={closeMenu} />
            <ThemeToggle label={themeLabel} />
          </div>
        </div>
      )}
    </header>
  );
}
