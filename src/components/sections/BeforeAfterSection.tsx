"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import type { BeforeAfterCase } from "@/content/home";

type BeforeAfterSectionProps = {
  cases: BeforeAfterCase[];
  disclaimer: string;
  labels: {
    eyebrow: string;
    headline: string;
  };
};

// Pixels per frame the strip drifts on its own at ~60fps.
const DRIFT_SPEED = 0.4;
// How long after the user stops interacting before auto-drift resumes.
const RESUME_DELAY_MS = 1200;

// Endless, auto-scrolling before/after showcase. The strip drifts on its own,
// can be grabbed/swiped manually, and resumes drifting after a short delay.
export default function BeforeAfterSection({
  cases,
  disclaimer,
  labels
}: BeforeAfterSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  // Sub-pixel scroll position. scrollLeft itself rounds to an integer, so we
  // accumulate the precise offset here and let the browser round only on assign.
  const offsetRef = useRef(0);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInteractingRef = useRef(false);
  const dragRef = useRef<{ active: boolean; startX: number; startScroll: number }>({
    active: false,
    startX: 0,
    startScroll: 0
  });

  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isAutoRunning, setIsAutoRunning] = useState(false);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  // Reduced-motion preference.
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setIsReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  // Only run the loop while the section is on screen.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsSectionVisible(entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Enable auto-drift when visible and motion is allowed.
  useEffect(() => {
    if (isReducedMotion || !isSectionVisible || cases.length === 0) {
      clearResumeTimer();
      setIsAutoRunning(false);
      return;
    }

    setIsAutoRunning((previous) => previous || !isInteractingRef.current);
  }, [cases.length, clearResumeTimer, isReducedMotion, isSectionVisible]);

  // The drift loop: nudge native scrollLeft each frame and wrap seamlessly.
  useEffect(() => {
    if (!isAutoRunning) {
      return;
    }

    const track = trackRef.current;
    if (!track) {
      return;
    }

    const isRtl =
      typeof window !== "undefined" &&
      window.getComputedStyle(track).direction === "rtl";
    const direction = isRtl ? -1 : 1;

    // Start from wherever the strip currently sits (e.g. after a manual drag).
    offsetRef.current = track.scrollLeft;

    const step = () => {
      // The track holds two identical copies; one copy is half the scroll width.
      const halfWidth = track.scrollWidth / 2;

      if (halfWidth > 0) {
        // Accumulate in a float so sub-pixel speeds keep advancing; scrollLeft
        // alone rounds to an integer and would stall at speeds below ~0.5.
        offsetRef.current += DRIFT_SPEED * direction;

        // Wrap around once a full copy has scrolled past, keeping it seamless.
        if (direction > 0 && offsetRef.current >= halfWidth) {
          offsetRef.current -= halfWidth;
        } else if (direction < 0 && offsetRef.current <= -halfWidth) {
          offsetRef.current += halfWidth;
        }

        track.scrollLeft = offsetRef.current;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isAutoRunning]);

  useEffect(() => {
    return () => clearResumeTimer();
  }, [clearResumeTimer]);

  // Pause drift the moment the user grabs/touches the strip.
  const handleInteractStart = useCallback(() => {
    isInteractingRef.current = true;
    clearResumeTimer();
    setIsAutoRunning(false);
  }, [clearResumeTimer]);

  // Resume drift a short delay after the user lets go.
  const handleInteractEnd = useCallback(() => {
    if (!isInteractingRef.current) {
      return;
    }

    isInteractingRef.current = false;
    clearResumeTimer();

    if (isReducedMotion) {
      return;
    }

    resumeTimerRef.current = setTimeout(() => {
      if (isSectionVisible) {
        setIsAutoRunning(true);
      }
    }, RESUME_DELAY_MS);
  }, [clearResumeTimer, isReducedMotion, isSectionVisible]);

  // Click-and-drag horizontal scrolling for desktop pointers.
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // Touch is handled natively; only hijack mouse/pen drags.
      if (event.pointerType === "touch") {
        return;
      }

      const track = trackRef.current;
      if (!track) {
        return;
      }

      dragRef.current = {
        active: true,
        startX: event.clientX,
        startScroll: track.scrollLeft
      };
      track.setPointerCapture(event.pointerId);
      handleInteractStart();
    },
    [handleInteractStart]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const track = trackRef.current;
      if (!track || !dragRef.current.active) {
        return;
      }

      track.scrollLeft =
        dragRef.current.startScroll - (event.clientX - dragRef.current.startX);
    },
    []
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.active) {
        return;
      }

      dragRef.current.active = false;
      const track = trackRef.current;
      if (track && track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }

      // Let go of the grab → schedule the auto-drift to resume after a delay.
      handleInteractEnd();
    },
    [handleInteractEnd]
  );

  return (
    <section id="cases" ref={sectionRef} className="section section-cream scroll-mt-24">
      <div className="container">
        <RevealOnScroll>
          <div>
            <p className="intro-label">{labels.eyebrow}</p>
            <h2 className="section-title mt-4">{labels.headline}</h2>
            <div className="divider" />
          </div>
        </RevealOnScroll>
      </div>

      <RevealOnScroll>
        <div
          ref={trackRef}
          role="region"
          aria-label={labels.headline}
          tabIndex={0}
          onTouchStart={handleInteractStart}
          onTouchEnd={handleInteractEnd}
          onTouchCancel={handleInteractEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="mt-10 flex gap-5 overflow-x-auto scrollbar-hide px-4 cursor-grab active:cursor-grabbing sm:gap-6 sm:px-8"
        >
          {[...cases, ...cases].map((item, i) => {
            const isClone = i >= cases.length;
            return (
              <figure
                key={`${item.id}-${isClone ? "b" : "a"}`}
                aria-hidden={isClone || undefined}
                className="group relative w-[78vw] shrink-0 overflow-hidden rounded-2xl border border-brand-border bg-brand-warm-white sm:w-[20rem] md:w-[22rem]"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    draggable={false}
                    className="select-none object-cover"
                    sizes="(min-width: 768px) 22rem, 78vw"
                  />
                </div>
              </figure>
            );
          })}
        </div>
      </RevealOnScroll>

      <div className="container">
        <RevealOnScroll>
          <p className="mt-8 text-xs text-brand-muted">{disclaimer}</p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
