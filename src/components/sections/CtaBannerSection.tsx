import type { CtaBannerContent } from "@/content/home";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type CtaBannerSectionProps = {
  content: CtaBannerContent;
};

// Full-width dark CTA banner with gold gradient.
export default function CtaBannerSection({ content }: CtaBannerSectionProps) {
  return (
    <section className="relative overflow-hidden py-24 text-center" style={{ background: "var(--deep)" }}>
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,168,76,0.12) 0%, transparent 70%)"
      }} />
      <div className="container relative">
        <RevealOnScroll>
          <h2 className="text-brand-warm-white" style={{
            fontFamily: "var(--font-subjectivity), serif",
            fontWeight: 300,
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            lineHeight: 1.2,
            marginBottom: "1rem"
          }}>
            {content.headline}
            <br />
            <em className="text-brand-gold-light" style={{ fontStyle: "italic" }}>
              {content.highlightedText}
            </em>
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <p className="mx-auto max-w-[460px] text-[0.97rem] text-white/50" style={{ marginBottom: "2.5rem" }}>
            {content.body}
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={160}>
          <a href={content.cta.href} className="btn-primary">
            {content.cta.label}
          </a>
        </RevealOnScroll>
      </div>
    </section>
  );
}
