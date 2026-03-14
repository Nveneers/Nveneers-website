"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { HeroContent } from "@/content/home";

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
      void video.play().catch(() => {
        // Ignore playback failures triggered by browser policies.
      });
    });
  }, [activeIndex, videos.length]);

  const handleEnded = (index: number) => {
    if (index !== activeIndex || videos.length <= 1) {
      return;
    }

    setActiveIndex((previous) => (previous + 1) % videos.length);
  };

  return (
    <section className="relative min-h-[85svh] overflow-hidden sm:min-h-[90svh] md:min-h-screen" style={{ background: "var(--deep)" }}>

      {videos.length > 0 ? (
        <div className="absolute inset-0" dir="ltr" aria-hidden="true">
          <div
            className="flex h-full w-full transition-transform duration-700 ease-out"
            style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
          >
            {videos.map((video, index) => (
              <div key={video.id} className="relative h-full w-full shrink-0">
                <Image
                  src={video.poster}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="absolute inset-0 h-full w-full object-cover"
                  aria-hidden="true"
                />
                <video
                  ref={(node) => {
                    videoRefs.current[index] = node;
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                  muted
                  playsInline
                  preload={index === activeIndex ? "auto" : "metadata"}
                  poster={video.poster}
                  onEnded={() => handleEnded(index)}
                  aria-hidden="true"
                >
                  <source src={video.src} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-brand-deep/40" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <Image
            src="/images/hero-poster.svg"
            alt=""
            fill
            sizes="100vw"
            priority
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-brand-deep/40" />
        </>
      )}

      {videos.length > 1 ? (
        <div className="absolute inset-x-0 bottom-10 z-10 flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-full bg-black/20 px-4 py-2 backdrop-blur-sm">
            {videos.map((video, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`${labels.dotAriaLabelPrefix} ${index + 1}`}
                  aria-pressed={isActive}
                  className={`h-2.5 w-2.5 rounded-full border border-white/80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                    isActive ? "bg-brand-gold" : "bg-transparent"
                  }`}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
