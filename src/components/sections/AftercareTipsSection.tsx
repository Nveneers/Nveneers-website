import BrandIcon from "@/components/BrandIcon";
import type { AftercareContent } from "@/content/home";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type AftercareTipsSectionProps = {
  content: AftercareContent;
};

// Aftercare tips grid section.
export default function AftercareTipsSection({ content }: AftercareTipsSectionProps) {
  return (
    <section className="section section-canvas">
      <div className="container">
        <RevealOnScroll>
          <div className="mb-14">
            <p className="intro-label">{content.eyebrow}</p>
            <h2 className="section-title mt-4">{content.headline}</h2>
            <div className="divider" />
            <p className="text-[0.97rem] text-brand-text">{content.lead}</p>
          </div>
        </RevealOnScroll>
        <div className="grid gap-6 md:grid-cols-2">
          {content.tips.map((tip, i) => (
            <RevealOnScroll key={tip.title} delay={i * 80}>
              <div className="card flex gap-4 p-6">
                <BrandIcon name={tip.icon} />
                <div>
                  <h4 className="text-brand-heading" style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontSize: "1.05rem",
                    fontWeight: 500,
                    marginBottom: "0.3rem"
                  }}>
                    {tip.title}
                  </h4>
                  <p className="text-[0.88rem] text-brand-muted">{tip.description}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
