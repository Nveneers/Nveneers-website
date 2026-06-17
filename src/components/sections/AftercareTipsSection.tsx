import type { AftercareContent } from "@/content/home";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type AftercareTipsSectionProps = {
  content: AftercareContent;
};

const tipIcons: Record<string, string> = {
  brush: "\uD83E\uDEB5",
  guard: "\uD83E\uDDBA",
  floss: "\uD83E\uDDF5",
  calendar: "\uD83D\uDDD3",
  food: "\uD83E\uDDCA"
};

// Aftercare tips grid section.
export default function AftercareTipsSection({ content }: AftercareTipsSectionProps) {
  return (
    <section className="section section-cream">
      <div className="container">
        <RevealOnScroll>
          <div className="mb-14">
            <p className="intro-label">{content.eyebrow}</p>
            <h2 className="section-title mt-4">{content.headline}</h2>
            <div className="divider" />
            <p className="text-[0.97rem] text-brand-mid">{content.lead}</p>
          </div>
        </RevealOnScroll>
        <div className="grid gap-6 md:grid-cols-2">
          {content.tips.map((tip, i) => (
            <RevealOnScroll key={tip.title} delay={i * 80}>
              <div className="card flex gap-4 p-6">
                <div className="shrink-0 text-2xl">
                  {tipIcons[tip.icon] ?? tip.icon}
                </div>
                <div>
                  <h4 className="text-brand-deep" style={{
                    fontFamily: "var(--font-subjectivity), serif",
                    fontSize: "1.05rem",
                    fontWeight: 600,
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
