"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import type { BestCase } from "@/content/home";

type BestCasesSectionProps = {
  cases: BestCase[];
  labels: {
    eyebrow: string;
    headline: string;
    lead: string;
    prevAriaLabel: string;
    nextAriaLabel: string;
    nudge: string;
  };
  toolHref?: string;
};

// A professional infinite slider: two result photos on desktop, one on mobile.
// Arrows slide the track by one image at a time; cloned slides at each end make
// the loop seamless. A subtle nudge bridges visitors into the smile tool below.
export default function BestCasesSection({
  cases,
  labels,
  toolHref = "#assessment"
}: BestCasesSectionProps) {
  const count = cases.length;

  // 1 card per slide on mobile, 2 from the sm breakpoint up.
  const [perView, setPerView] = useState(2);
  // Current track position, in card units, offset by the leading clones.
  const [cur, setCur] = useState(2);
  const [animate, setAnimate] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const lockRef = useRef(false);

  // In RTL the flex track lays slides right-to-left, so the translate must be
  // positive to bring the real slides into view (negative pushes them off-screen).
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    setIsRtl(document.documentElement.dir === "rtl");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const sm = window.matchMedia("(min-width: 640px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const pv = sm.matches ? 2 : 1;
      setPerView(pv);
      // Re-seat at the first real slide without animating across the resize.
      setAnimate(false);
      setCur(pv);
      setReducedMotion(rm.matches);
    };
    apply();
    sm.addEventListener("change", apply);
    rm.addEventListener("change", apply);
    return () => {
      sm.removeEventListener("change", apply);
      rm.removeEventListener("change", apply);
    };
  }, []);

  // Clamp clone counts to what we actually have (handles count < perView).
  const clones = Math.min(perView, count);
  const lead = cases.slice(count - clones); // clones of the last items, placed before
  const tail = cases.slice(0, clones); // clones of the first items, placed after
  const slides = [...lead, ...cases, ...tail];

  // Real items live at indices [clones .. clones + count - 1].
  const cardWidth = 100 / perView;
  const canLoop = count > perView;

  const step = (dir: 1 | -1) => {
    if (lockRef.current || !canLoop) {
      return;
    }
    if (!reducedMotion) {
      lockRef.current = true;
    }
    setAnimate(true);
    setCur((c) => c + dir);
  };

  // After the slide finishes, snap across the clone seam invisibly.
  const handleTransitionEnd = () => {
    lockRef.current = false;
    let resetTo = cur;
    if (cur >= count + clones) {
      resetTo = cur - count;
    } else if (cur < clones) {
      resetTo = cur + count;
    }
    if (resetTo !== cur) {
      setAnimate(false);
      setCur(resetTo);
    }
  };

  // Re-enable the transition on the frame after a seam snap.
  useEffect(() => {
    if (animate) {
      return;
    }
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [animate, cur]);

  const arrowClass =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-border bg-white/80 text-brand-deep backdrop-blur transition hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";

  return (
    <section className="section section-warm-white scroll-mt-24">
      <div className="container">
        <RevealOnScroll>
          <div>
            <p className="intro-label">{labels.eyebrow}</p>
            <h2 className="section-title mt-4">{labels.headline}</h2>
            <div className="divider" />
            <p className="section-lead max-w-xl">{labels.lead}</p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={120}>
          <div className="relative mx-auto mt-10 w-full max-w-5xl">
            <div className="overflow-hidden">
              <div
                className="flex"
                style={{
                  transform: `translateX(${isRtl ? "" : "-"}${cur * cardWidth}%)`,
                  transition: animate && !reducedMotion ? "transform 500ms ease" : "none"
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {slides.map((item, i) => {
                  const isClone = i < clones || i >= clones + count;
                  return (
                    <div
                      key={`${item.id}-${i}`}
                      aria-hidden={isClone || undefined}
                      className="box-border shrink-0 px-2 sm:px-3"
                      style={{ flex: `0 0 ${cardWidth}%` }}
                    >
                      <figure className="card relative aspect-[3/2] overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 640px) 36rem, 100vw"
                        />
                      </figure>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Arrows overlaid at the row edges; loop forever, never disabled. */}
            {canLoop && (
              <>
                <button
                  type="button"
                  aria-label={labels.prevAriaLabel}
                  onClick={() => step(-1)}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 sm:-left-5 ${arrowClass}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label={labels.nextAriaLabel}
                  onClick={() => step(1)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 sm:-right-5 ${arrowClass}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </RevealOnScroll>

        {/* Soft hand-off into the smile tool directly below. */}
        <RevealOnScroll delay={160}>
          <p className="mt-10 text-center text-sm text-brand-muted">
            <a
              href={toolHref}
              className="border-b border-brand-gold/50 pb-0.5 text-brand-deep transition hover:border-brand-gold hover:text-brand-gold"
            >
              {labels.nudge}
            </a>
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
