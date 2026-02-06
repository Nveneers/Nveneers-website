import Link from "next/link";
import type { HeroContent } from "@/content/home";

type HeroVideoSectionProps = {
  content: HeroContent;
};

// Full-viewport hero with video background and primary CTAs.
export default function HeroVideoSection({ content }: HeroVideoSectionProps) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={content.videoPoster}
        aria-hidden="true"
      >
        <source src={content.videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-brand-teal/60" aria-hidden="true" />
      <div className="container relative z-10 py-24">
        <div className="max-w-3xl text-white fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">
            {content.eyebrow}
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-6xl">
            {content.headline}
          </h1>
          <p className="mt-6 text-base text-white/90 md:text-lg">
            {content.subheadline}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={content.primaryCta.href} className="btn-primary">
              {content.primaryCta.label}
            </Link>
            <Link
              href={content.secondaryCta.href}
              className="btn-secondary border-white/60 text-white hover:bg-white/10"
            >
              {content.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
