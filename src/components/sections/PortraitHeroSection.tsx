"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroContent, HomeUi } from "@/content/home";

type PortraitHeroSectionProps = { content: HeroContent; labels: HomeUi["hero"] };

export default function PortraitHeroSection({ content, labels }: PortraitHeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [variant, setVariant] = useState<"desktop" | "mobile" | null>(null);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [manualPlayback, setManualPlayback] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [failed, setFailed] = useState(false);
  const media = content.backgroundVideo;
  const enabled = variant !== null && (!reducedMotion || manualPlayback);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateSize = () => {
      setVariant(desktop.matches ? "desktop" : "mobile");
      setHasFrame(false);
      setFailed(false);
      setPlaying(false);
    };
    const updateMotion = () => {
      setReducedMotion(motion.matches);
      setManualPlayback(false);
      if (motion.matches) { setHasFrame(false); setPlaying(false); }
    };
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateSize();
    updateMotion();
    updateVisibility();
    desktop.addEventListener("change", updateSize);
    motion.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      desktop.removeEventListener("change", updateSize);
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    if (enabled && visible && pageVisible && !userPaused && !failed) {
      void video.play().catch(() => {
        if (!cancelled) {
          setFailed(true);
          setPlaying(false);
          setHasFrame(false);
        }
      });
    } else {
      video.pause();
    }
    return () => { cancelled = true; };
  }, [enabled, visible, pageVisible, userPaused, failed, variant]);

  const togglePlayback = () => {
    if (playing) {
      setUserPaused(true);
    } else {
      setUserPaused(false);
      setManualPlayback(true);
      if (failed) videoRef.current?.load();
      setFailed(false);
    }
  };

  return (
    <section id="home-hero" ref={sectionRef} className="portrait-hero" aria-labelledby="hero-title">
      <div className="portrait-hero-media" aria-hidden="true">
        <picture>
          <source media="(min-width: 1024px)" srcSet={media.desktop.poster} />
          {/* Responsive picture keeps the poster crop aligned with the selected video. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media.mobile.poster} alt="" width="640" height="1024" fetchPriority="high" className="portrait-hero-image" />
        </picture>
        {enabled && variant && (
          <video
            key={variant}
            ref={videoRef}
            src={media[variant].src}
            className={`portrait-hero-video${hasFrame && !failed ? " has-frame" : ""}`}
            muted playsInline loop preload="none" tabIndex={-1}
            onPlaying={() => { setPlaying(true); setHasFrame(true); }}
            onPause={() => setPlaying(false)}
            onError={() => { setFailed(true); setPlaying(false); setHasFrame(false); }}
          />
        )}
      </div>
      <div className="portrait-hero-shade" aria-hidden="true" />
      <div className="portrait-hero-layout">
        <div className="portrait-hero-copy">
          <p className="portrait-hero-eyebrow">{content.eyebrow}</p>
          <h1 id="hero-title" className="portrait-hero-title">{content.headline}</h1>
          <p className="portrait-hero-description">{content.body}</p>
          <div className="portrait-hero-actions">
            <a href={content.primaryCta.href} className="portrait-hero-primary">{content.primaryCta.label}</a>
            <a href={content.secondaryCta.href} className="portrait-hero-secondary">{content.secondaryCta.label}<span aria-hidden="true">↗</span></a>
          </div>
          <p className="portrait-hero-note">{content.note}</p>
        </div>
      </div>
      <button type="button" className="portrait-hero-playback" onClick={togglePlayback} aria-label={playing ? labels.pauseLabel : labels.playLabel}>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
          {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="m5 2 9 6-9 6z" />}
        </svg>
      </button>
    </section>
  );
}
