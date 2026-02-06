"use client";

import { useId, useState } from "react";
import Image from "next/image";

type ImageCompareProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
};

// Accessible image compare slider with draggable handle.
export default function ImageCompare({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt
}: ImageCompareProps) {
  const sliderId = useId();
  const [position, setPosition] = useState(50);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-teal/10 bg-white">
      <div className="relative aspect-[4/3]">
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 40vw, 90vw"
          priority={false}
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <Image
            src={afterSrc}
            alt={afterAlt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 40vw, 90vw"
          />
        </div>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="Compare before and after"
          className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
        />
        <div
          className="absolute inset-y-0 z-20"
          style={{ left: `calc(${position}% - 1px)` }}
        >
          <div className="h-full w-[2px] bg-brand-gold" />
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-gold bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-gold peer-focus-visible:ring-offset-2">
              <div className="h-4 w-4 rounded-full bg-brand-gold" />
            </div>
          </div>
        </div>
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-teal">
          Before
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-teal">
          After
        </div>
      </div>
    </div>
  );
}
