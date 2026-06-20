import Link from "next/link";
import LanguageDocument from "@/components/LanguageDocument";
import type { Locale } from "@/content/home";
import type { LegalContent } from "@/content/legal";

type LegalPageProps = {
  locale: Locale;
  content: LegalContent;
};

// Shared layout for the Privacy Policy and Terms pages. Locale-aware: sets
// dir/lang and right-aligns for Arabic, mirroring NotFoundPage.
export default function LegalPage({ locale, content }: LegalPageProps) {
  const isArabic = locale === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  return (
    <div
      className={`min-h-screen bg-brand-warm-white ${isArabic ? "locale-rtl" : "locale-ltr"}`}
      dir={direction}
      lang={locale}
      data-locale={locale}
    >
      <LanguageDocument locale={locale} />
      <main className="section">
        <div className="container max-w-3xl">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-muted transition hover:text-brand-gold"
          >
            <span aria-hidden="true">{isArabic ? "→" : "←"}</span>
            {content.backLabel}
          </Link>

          <h1 className="section-title mt-8">{content.title}</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.05em] text-brand-muted">
            {content.updated}
          </p>
          <div className="divider" />
          <p className="section-lead">{content.intro}</p>

          <div className="mt-10 flex flex-col gap-8">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-lg font-semibold text-brand-deep">
                  {section.heading}
                </h2>
                <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-brand-muted">
                  {section.body.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
