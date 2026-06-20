"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import type { HeroContent } from "@/content/home";

// Hero clips play sped up for a more energetic feel.
const PLAYBACK_RATE = 1.5;

type HeroVideoSectionProps = {
  content: HeroContent;
  labels: {
    dotAriaLabelPrefix: string;
  };
};

// Full-viewport hero with video carousel background and dot navigation.
export default function HeroVideoSection({
  content,
  labels
}: HeroVideoSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const videos = content.videos ?? [];

  useEffect(() => {
    if (videos.length === 0) {
      return;
    }

    setActiveIndex((previous) => (previous < videos.length ? previous : 0));
  }, [videos.length]);

  useEffect(() => {
    if (videos.length === 0) {
      return;
    }

    videoRefs.current.forEach((video, index) => {
      if (!video) {
        return;
      }

      if (index !== activeIndex) {
        if (!video.paused) {
          video.pause();
        }
        video.currentTime = 0;
        return;
      }

      video.currentTime = 0;
      video.playbackRate = PLAYBACK_RATE;
      void video.play().catch(() => {
        // Ignore playback failures triggered by browser policies.
      });
    });
  }, [activeIndex, videos.length]);

  // Browsers reset playbackRate when a source (re)loads, so reassert it whenever
  // a clip loads or starts — this keeps the speed-up from being silently undone.
  const applyRate = (event: SyntheticEvent<HTMLVideoElement>) => {
    event.currentTarget.playbackRate = PLAYBACK_RATE;
  };

  const handleEnded = (index: number) => {
    if (index !== activeIndex || videos.length <= 1) {
      return;
    }

    setActiveIndex((previous) => (previous + 1) % videos.length);
  };

  return (
    <section className="relative w-full overflow-hidden" style={{ background: "var(--deep)" }}>
      {/* Atmospheric stage: a warm gold glow behind the screen plus an edge vignette,
          so the space around the framed video reads as deliberate matte, not empty bars. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 38%, rgba(201,168,76,0.20), transparent 62%), radial-gradient(ellipse 120% 100% at 50% 50%, transparent 55%, rgba(4,10,20,0.85))"
        }}
      />
      {/* Fine grain for texture; soft-light keeps it barely-there over the navy. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
        }}
      />

      {/* Centered stage caps the screen width on large displays so the glow frames it. */}
      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* The frame is true 3:2 and sized by HEIGHT (capped to fit on first screen),
            so width follows the ratio — the whole video is visible on load, no crop. */}
        <div className="relative mx-auto aspect-[3/2] h-[min(calc(100dvh-9rem),calc((100vw-2rem)*2/3))] w-auto max-w-full overflow-hidden rounded-2xl border border-brand-gold/30 shadow-[0_30px_90px_-25px_rgba(0,0,0,0.85)] ring-1 ring-white/5">
          {videos.length > 0 ? (
            <div className="absolute inset-0" dir="ltr" aria-hidden="true">
              <div
                className="flex h-full w-full transition-transform duration-700 ease-out"
                style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
              >
                {videos.map((video, index) => (
                  <div key={video.id} className="relative h-full w-full shrink-0">
                    <video
                      ref={(node) => {
                        videoRefs.current[index] = node;
                      }}
                      className="absolute inset-0 h-full w-full object-cover"
                      muted
                      playsInline
                      preload={index === activeIndex ? "auto" : "metadata"}
                      onLoadedMetadata={applyRate}
                      onPlay={applyRate}
                      onEnded={() => handleEnded(index)}
                      aria-hidden="true"
                    >
                      <source src={video.src} type="video/mp4" />
                    </video>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="absolute inset-0 bg-brand-deep"
              aria-hidden="true"
            />
          )}

          {videos.length > 1 ? (
            <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center px-4">
              <div className="flex items-center gap-3 rounded-full bg-black/25 px-4 py-2 backdrop-blur-sm">
                {videos.map((video, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={video.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`${labels.dotAriaLabelPrefix} ${index + 1}`}
                      aria-pressed={isActive}
                      className="flex h-8 w-8 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      <span className={`h-2.5 w-2.5 rounded-full border border-white/80 transition ${isActive ? "bg-brand-gold" : "bg-transparent"}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
