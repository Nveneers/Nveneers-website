import Link from "next/link";
import LanguageDocument from "@/components/LanguageDocument";
import type { Locale } from "@/content/home";
import UtilityHeader from "@/components/UtilityHeader";
import BrandWave from "@/components/BrandWave";

type NotFoundPageProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  supportText: string;
  supportLink: { label: string; href: string };
};

export default function NotFoundPage({
  locale,
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  supportText,
  supportLink
}: NotFoundPageProps) {
  const isArabic = locale === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const alignmentClass = isArabic ? "items-end text-right" : "items-start text-left";
  const buttonAlignment = isArabic ? "justify-end" : "justify-start";
  const eyebrowClass = isArabic
    ? "text-xs font-semibold text-brand-heading/80"
    : "text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-brand-heading/80";

  return (
    <div
      className={`bg-brand-surface ${isArabic ? "locale-rtl" : "locale-ltr"}`}
      dir={direction}
      lang={locale}
      data-locale={locale}
    >
      <LanguageDocument locale={locale} />
      <UtilityHeader locale={locale} />
      <main className="relative min-h-[80dvh] overflow-hidden bg-brand-canvas px-5">
        <BrandWave className="opacity-[0.08]" />
        <div
          className={`container relative flex min-h-[80dvh] flex-col justify-center gap-8 py-16 ${alignmentClass}`}
        >
          <span
            className={`inline-flex w-fit items-center rounded-full border border-brand-heading/15 bg-brand-surface/80 px-4 py-2 shadow-sm fade-up ${eyebrowClass}`}
          >
            {eyebrow}
          </span>
          <div className="flex flex-col gap-5">
            <span
              className="text-6xl font-semibold text-brand-heading/15 md:text-7xl fade-up"
              style={{ animationDelay: "60ms" }}
            >
              404
            </span>
            <h1
              className="max-w-2xl text-4xl font-semibold text-brand-heading md:text-5xl fade-up"
              style={{ animationDelay: "120ms" }}
            >
              {title}
            </h1>
            <p
              className="max-w-xl text-base text-brand-muted md:text-lg fade-up"
              style={{ animationDelay: "180ms" }}
            >
              {description}
            </p>
          </div>
          <div
            className={`flex flex-wrap gap-4 fade-up ${buttonAlignment}`}
            style={{ animationDelay: "240ms" }}
          >
            <Link href={primaryCta.href} className="btn-primary">
              {primaryCta.label}
            </Link>
            <Link href={secondaryCta.href} className="btn-secondary">
              {secondaryCta.label}
            </Link>
          </div>
          <p
            className={`flex flex-wrap items-center gap-2 text-xs text-brand-muted fade-up ${buttonAlignment}`}
            style={{ animationDelay: "300ms" }}
          >
            <span>{supportText}</span>
            <Link href={supportLink.href} className="font-semibold text-brand-heading transition hover:text-brand-heading/80">
              {supportLink.label}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
