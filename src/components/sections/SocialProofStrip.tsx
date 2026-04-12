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
                <div className="flex items-center gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={`star-${index}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      className="h-4 w-4"
                      fill="var(--gold)"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 0 0 .95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 0 0-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 0 0-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.285-3.957a1 1 0 0 0-.364-1.118L2.062 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 0 0 .951-.69L9.049 2.927Z" />
                    </svg>
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
              <div className="card min-w-[72vw] snap-start p-6 sm:min-w-[16.5rem] md:min-w-0">
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
