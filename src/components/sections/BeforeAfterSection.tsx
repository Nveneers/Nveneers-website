"use client";

import { useRef } from "react";
import Image from "next/image";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import ImageCompare from "@/components/ui/ImageCompare";
import type { BeforeAfterCase, HomeUi } from "@/content/home";

type BeforeAfterSectionProps = {
  cases: BeforeAfterCase[];
  disclaimer: string;
  labels: HomeUi["beforeAfter"];
};

// Manual navigation keeps each case still while its comparison handle is used.
export default function BeforeAfterSection({ cases, disclaimer, labels }: BeforeAfterSectionProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  function move(direction: number) {
    const track = trackRef.current;
    if (!track) return;
    const rtl = window.getComputedStyle(track).direction === "rtl";
    const card = track.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + parseFloat(window.getComputedStyle(track).columnGap) : track.clientWidth;
    track.scrollBy({
      left: direction * (rtl ? -1 : 1) * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  }

  if (!cases.length) return null;

  return (
    <section id="cases" className="section section-canvas scroll-mt-24">
      <div className="container">
        <RevealOnScroll>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <p className="intro-label">{labels.eyebrow}</p>
              <h2 className="section-title mt-4">{labels.headline}</h2>
              <p className="section-lead">{labels.hint}</p>
            </div>
            {cases.length > 1 && (
              <div className="flex gap-2">
                <button type="button" className="case-navigation" onClick={() => move(-1)} aria-label={labels.previousLabel}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" className="rtl:rotate-180" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
                </button>
                <button type="button" className="case-navigation" onClick={() => move(1)} aria-label={labels.nextLabel}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" className="rtl:rotate-180" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
                </button>
              </div>
            )}
          </div>
        </RevealOnScroll>
        <div ref={trackRef} role="region" aria-label={labels.headline} tabIndex={0} className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scrollbar-hide px-1 pb-5 pt-1">
          {cases.map(item => (
            <figure key={item.id} className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[calc((100%-1.25rem)/2)]">
              {item.comparison ? (
                <ImageCompare beforeSrc={item.image} afterSrc={item.image} beforeAlt={`${item.title} — ${labels.beforeLabel}`} afterAlt={`${item.title} — ${labels.afterLabel}`} crops={item.comparison} labels={labels} />
              ) : (
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-brand-soft">
                  <Image src={item.image} alt={item.title} fill draggable={false} className="object-contain" sizes="(min-width: 1024px) 45vw, 85vw" />
                </div>
              )}
            </figure>
          ))}
        </div>
        <p className="mt-5 text-xs text-brand-muted">{disclaimer}</p>
      </div>
    </section>
  );
}
