import RevealOnScroll from "@/components/ui/RevealOnScroll";

type ProductSplitSectionProps = {
  content: {
    eyebrow: string;
    headline: string;
    body: string[];
    bullets: { title: string; description: string }[];
  };
};

// Image-free editorial section: left-aligned intro (matching the rest of the
// page) followed by a numbered concept row.
export default function ProductSplitSection({
  content
}: ProductSplitSectionProps) {
  return (
    <section className="section section-cream">
      <div className="container">
        {/* Left-aligned editorial header, matching the other sections */}
        <RevealOnScroll>
          <div>
            <p className="intro-label">{content.eyebrow}</p>
            <h2 className="section-title mt-4">{content.headline}</h2>
            <div className="divider" />
            <div className="max-w-2xl">
              {content.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-[0.97rem] text-brand-mid">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Numbered concept row, left-aligned like the rest of the page */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {content.bullets.map((bullet, index) => (
            <RevealOnScroll key={bullet.title} delay={index * 120}>
              <div className="flex flex-col items-start text-start">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-[var(--cream)]"
                  style={{ borderColor: "var(--gold)" }}
                >
                  <span
                    className="text-xs font-semibold tracking-wider"
                    style={{ color: "var(--gold)" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-4 text-sm font-semibold text-brand-deep">
                  {bullet.title}
                </p>
                <p className="mt-1 text-xs text-brand-muted">
                  {bullet.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
