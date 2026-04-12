import Image from "next/image";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type ProductSplitSectionProps = {
  content: {
    eyebrow: string;
    headline: string;
    body: string[];
    bullets: { title: string; description: string }[];
    media: { videoSrc: string; poster: string; alt: string };
  };
};

// Split section explaining the product with supporting media.
export default function ProductSplitSection({
  content
}: ProductSplitSectionProps) {
  return (
    <section className="section section-cream">
      <div className="container grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <RevealOnScroll>
          <div>
            <p className="intro-label">{content.eyebrow}</p>
            <h2 className="section-title mt-4">{content.headline}</h2>
            <div className="divider" />
            {content.body.map((paragraph) => (
              <p key={paragraph} className="section-lead">
                {paragraph}
              </p>
            ))}
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {content.bullets.map((bullet, index) => (
                <div key={bullet.title} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--gold)] bg-[var(--gold)]/10">
                    <span className="text-xs font-semibold tracking-wider" style={{ color: "var(--gold)" }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-deep">
                      {bullet.title}
                    </p>
                    <p className="text-xs text-brand-muted">{bullet.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={160}>
          <div className="card relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-deep/5" aria-hidden="true" />
            <div className="relative aspect-[4/3]">
              <Image
                src={content.media.poster}
                alt={content.media.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
              <video
                className="absolute inset-0 z-10 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster={content.media.poster}
              >
                <source src={content.media.videoSrc} type="video/mp4" />
              </video>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
