import type { Testimonial } from "@/content/home";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type SocialProofStripProps = {
  rating: { rating: string; count: string; note: string };
  testimonials: Testimonial[];
  eyebrow: string;
};

// Social proof strip with rating summary and testimonials.
export default function SocialProofStrip({
  rating,
  testimonials,
  eyebrow
}: SocialProofStripProps) {
  return (
    <section className="section section-cream">
      <div className="container">
        <RevealOnScroll>
          <div className="flex flex-wrap items-center justify-between gap-6 border-y border-brand-border py-6">
            <div>
              <p className="intro-label">{eyebrow}</p>
              <div className="mt-3 flex items-center gap-3 text-brand-deep">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={`star-${index}`}
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-brand-border"
                      aria-hidden="true"
                    >
                      <span className="h-2 w-2 rounded-full bg-brand-gold" />
                    </span>
                  ))}
                </div>
                <span className="text-xl font-semibold">{rating.rating}</span>
                <span className="text-sm text-brand-muted">
                  {rating.count}
                </span>
              </div>
            </div>
            <p className="text-sm text-brand-muted">{rating.note}</p>
          </div>
        </RevealOnScroll>
        <div className="mt-10 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hide px-4 pb-4 sm:gap-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
          {testimonials.map((item, i) => (
            <RevealOnScroll key={item.name} delay={i * 80}>
              <div className="card min-w-[80vw] snap-start p-6 sm:min-w-[16.5rem] md:min-w-0">
                <p className="text-base text-brand-mid">&ldquo;{item.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-brand-deep">
                  {item.name}
                </p>
                <p className="text-xs text-brand-muted">{item.detail}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
