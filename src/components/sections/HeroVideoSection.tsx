"use client";

import { useEffect, useRef, useState } from "react";
import BrandWave from "@/components/BrandWave";
import type { HeroContent, HomeUi } from "@/content/home";

type HeroVideoSectionProps = {
  content: HeroContent;
  labels: HomeUi["hero"];
};

export default function HeroVideoSection({ content, labels }: HeroVideoSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videos = content.videos;
  const activeVideo = videos[activeIndex];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setIsPlaying(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    if (isPlaying) {
      void video.play().catch(() => {
        if (!cancelled) setIsPlaying(false);
      });
    } else {
      video.pause();
    }
    return () => { cancelled = true; };
  }, [activeIndex, isPlaying]);

  return (
    <section className="hero-stage" aria-labelledby="hero-title">
      <BrandWave />
      <div className="container hero-layout">
        <div className="hero-copy">
          <p className="intro-label">{content.eyebrow}</p>
          <h1 id="hero-title" className="hero-title">{content.headline}</h1>
          <p className="hero-description">{content.body}</p>
          <div className="hero-actions">
            <a href={content.primaryCta.href} className="btn-primary">{content.primaryCta.label}</a>
            <a href={content.secondaryCta.href} className="hero-text-link">
              {content.secondaryCta.label}<span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="hero-note">{content.note}</p>
        </div>

        {activeVideo && (
          <div className="hero-media">
            <div className="hero-frame">
              <video
                key={activeVideo.id}
                ref={videoRef}
                className="h-full w-full object-contain"
                muted
                playsInline
                loop={videos.length === 1}
                poster={activeVideo.poster}
                preload="metadata"
                onEnded={() => setActiveIndex(index => (index + 1) % videos.length)}
                aria-hidden="true"
              >
                <source src={activeVideo.src} type="video/mp4" />
              </video>
            </div>
            <div className="hero-media-controls">
              <div className="flex items-center gap-1" dir="ltr">
                {videos.map((video, index) => (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`${labels.dotAriaLabelPrefix} ${index + 1}`}
                    aria-pressed={index === activeIndex}
                    className="hero-dot"
                  >
                    <span />
                  </button>
                ))}
              </div>
              <button type="button" className="hero-playback" onClick={() => setIsPlaying(value => !value)}>
                <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true">
                  {isPlaying ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="m5 2 9 6-9 6z" />}
                </svg>
                {isPlaying ? labels.pauseLabel : labels.playLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
