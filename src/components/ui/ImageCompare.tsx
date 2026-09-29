"use client";

import { useState } from "react";
import Image from "next/image";
import type { BeforeAfterCase } from "@/content/home";

type ImageCompareProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  crops?: BeforeAfterCase["comparison"];
  labels: {
    compareAriaLabel: string;
    beforeLabel: string;
    afterLabel: string;
  };
};

// Both images keep the same full-width viewport while only the reveal is clipped.
// A native range provides keyboard, mouse, touch and assistive technology support.
export default function ImageCompare({ beforeSrc, afterSrc, beforeAlt, afterAlt, crops, labels }: ImageCompareProps) {
  const [position, setPosition] = useState(50);
  const cropStyle = (crop?: { top: number; height: number }) => crop ? {
    top: `${-crop.top / crop.height * 100}%`,
    height: `${100 / crop.height}%`
  } : { top: 0, height: "100%" };

  return (
    <div className="compare-view relative overflow-hidden rounded-2xl bg-brand-soft" dir="ltr">
      <div className="relative aspect-[3/2]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-0" style={cropStyle(crops?.after)}>
            <Image src={afterSrc} alt={afterAlt} fill draggable={false} className="select-none object-cover" sizes="(min-width: 1024px) 34vw, (min-width: 640px) 55vw, 85vw" />
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <div className="absolute inset-x-0" style={cropStyle(crops?.before)}>
            <Image src={beforeSrc} alt={beforeAlt} fill draggable={false} className="select-none object-cover" sizes="(min-width: 1024px) 34vw, (min-width: 640px) 55vw, 85vw" />
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={event => setPosition(Number(event.target.value))}
          aria-label={`${labels.compareAriaLabel}: ${beforeAlt}`}
          aria-valuetext={`${labels.beforeLabel} ${position}%, ${labels.afterLabel} ${100 - position}%`}
          className="compare-range absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
        />
        <div className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white" style={{ left: `calc(${position}% - 1px)` }} aria-hidden="true">
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 rounded-full border border-white/80 bg-white/95 text-[#0b1020] shadow-md">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m8 8-4 4 4 4m8-8 4 4-4 4M12 6v12" /></svg>
          </span>
        </div>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white">{labels.beforeLabel}</span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white">{labels.afterLabel}</span>
      </div>
    </div>
  );
}
