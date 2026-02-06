import type { Testimonial } from "@/content/home";

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
    <section className="section">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-6 border-y border-brand-teal/10 py-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-teal/70">
              {eyebrow}
            </p>
            <div className="mt-3 flex items-center gap-3 text-brand-teal">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={`star-${index}`}
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-brand-teal/40"
                    aria-hidden="true"
                  >
                    <span className="h-2 w-2 rounded-full bg-brand-gold" />
                  </span>
                ))}
              </div>
              <span className="text-xl font-semibold">{rating.rating}</span>
              <span className="text-sm text-brand-teal/70">
                {rating.count}
              </span>
            </div>
          </div>
          <p className="text-sm text-brand-teal/70">{rating.note}</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="card p-6">
              <p className="text-base text-slate-700">"{item.quote}"</p>
              <p className="mt-4 text-sm font-semibold text-brand-teal">
                {item.name}
              </p>
              <p className="text-xs text-brand-teal/60">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
