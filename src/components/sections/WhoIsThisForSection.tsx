import type { EligibilityContent } from "@/content/home";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type WhoIsThisForSectionProps = {
  content: EligibilityContent;
  labels: {
    eyebrow: string;
    headline: string;
    goodFitTitle: string;
    notIdealTitle: string;
  };
};

// Eligibility guidance section with pros/cons card layout.
export default function WhoIsThisForSection({
  content,
  labels
}: WhoIsThisForSectionProps) {
  return (
    <section className="section section-ivory">
      <div className="container">
        <RevealOnScroll>
          <div className="mb-10">
            <p className="intro-label">{labels.eyebrow}</p>
            <h2 className="section-title mt-4">{labels.headline}</h2>
            <div className="divider" />
          </div>
        </RevealOnScroll>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Good Fit - dark card */}
          <RevealOnScroll>
            <div className="rounded-2xl p-6 sm:p-8 lg:p-10" style={{ background: "var(--deep)", color: "var(--cream)" }}>
              <h3 className="text-brand-gold-light" style={{
                fontFamily: "var(--font-subjectivity), serif",
                fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
                fontWeight: 400,
                marginBottom: "1.8rem"
              }}>
                {labels.goodFitTitle}
              </h3>
              <ul className="flex flex-col gap-4">
                {content.goodFit.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.92rem] leading-relaxed text-white/75">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
          {/* Not Ideal - light card */}
          <RevealOnScroll delay={80}>
            <div className="card rounded-2xl p-6 sm:p-8 lg:p-10">
              <h3 className="text-brand-deep" style={{
                fontFamily: "var(--font-subjectivity), serif",
                fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
                fontWeight: 400,
                marginBottom: "1.8rem"
              }}>
                {labels.notIdealTitle}
              </h3>
              <ul className="flex flex-col gap-4">
                {content.notIdeal.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.92rem] leading-relaxed text-brand-mid">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-brown" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </div>
        <RevealOnScroll>
          <p className="mt-6 text-sm text-brand-muted">{content.note}</p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
