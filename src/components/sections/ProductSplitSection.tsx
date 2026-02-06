import Image from "next/image";

type ProductSplitSectionProps = {
  content: {
    eyebrow: string;
    headline: string;
    body: string[];
    bullets: { title: string; description: string }[];
    media: { videoSrc: string; poster: string; alt: string };
  };
};

const iconSvgs = [
  "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z",
  "M12 2 L22 12 L12 22 L2 12 Z",
  "M12 4 L20 20 L4 20 Z"
];

// Split section explaining the product with supporting media.
export default function ProductSplitSection({
  content
}: ProductSplitSectionProps) {
  return (
    <section className="section bg-white">
      <div className="container grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-teal/70">
            {content.eyebrow}
          </p>
          <h2 className="section-title mt-4">{content.headline}</h2>
          {content.body.map((paragraph) => (
            <p key={paragraph} className="section-lead">
              {paragraph}
            </p>
          ))}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {content.bullets.map((bullet, index) => (
              <div key={bullet.title} className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-teal/20">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-brand-teal"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d={iconSvgs[index % iconSvgs.length]} />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-teal">
                    {bullet.title}
                  </p>
                  <p className="text-xs text-slate-600">{bullet.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-teal/5" aria-hidden="true" />
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
      </div>
    </section>
  );
}
