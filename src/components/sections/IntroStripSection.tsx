import type { IntroStripContent } from "@/content/home";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type IntroStripSectionProps = {
  content: IntroStripContent;
};

// Two-column intro strip with text and stats grid.
export default function IntroStripSection({ content }: IntroStripSectionProps) {
  return (
    <section className="section section-ivory">
      <div className="container grid gap-20 md:grid-cols-2 md:items-center">
        <RevealOnScroll>
          <div>
            <p className="intro-label">{content.eyebrow}</p>
            <h2 className="section-title mt-4">{content.headline}</h2>
            <div className="divider" />
            <p className="text-[0.95rem] text-brand-mid">{content.body}</p>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-2 gap-4">
          {content.stats.map((stat, i) => (
            <RevealOnScroll key={stat.label} delay={i * 80}>
              <div className="card rounded-xl p-6 text-center">
                <div className="text-brand-gold" style={{
                  fontFamily: "var(--font-subjectivity), serif",
                  fontSize: "2.8rem",
                  fontWeight: 600,
                  lineHeight: 1
                }}>
                  {stat.value}
                  {stat.unit ? (
                    <span style={{ fontSize: "1.4rem" }}>{stat.unit}</span>
                  ) : null}
                </div>
                <div className="mt-1 text-[0.78rem] tracking-[0.05em] text-brand-muted">
                  {stat.label}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
