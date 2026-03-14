"use client";

import { useMemo, useState } from "react";
import ImageCompare from "@/components/ui/ImageCompare";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import type { BeforeAfterCase } from "@/content/home";

type BeforeAfterSectionProps = {
  cases: BeforeAfterCase[];
  filters: string[];
  disclaimer: string;
  labels: {
    eyebrow: string;
    headline: string;
    compareAriaLabel: string;
    beforeLabel: string;
    afterLabel: string;
  };
};

// Gallery with filter chips and image compare sliders.
export default function BeforeAfterSection({
  cases,
  filters,
  disclaimer,
  labels
}: BeforeAfterSectionProps) {
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  const visibleCases = useMemo(
    () => cases.filter((item) => item.filters.includes(activeFilter)),
    [cases, activeFilter]
  );

  return (
    <section
      id="cases"
      className="section section-cream scroll-mt-24"
    >
      <div className="container">
        <RevealOnScroll>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="intro-label">{labels.eyebrow}</p>
              <h2 className="section-title mt-4">{labels.headline}</h2>
              <div className="divider" />
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const isActive = filter === activeFilter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    aria-pressed={isActive}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                      isActive
                        ? "border-brand-gold bg-brand-gold text-brand-deep"
                        : "border-brand-border text-brand-deep"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {visibleCases.map((item, i) => (
            <RevealOnScroll key={item.id} delay={i * 80}>
              <div className="card p-6">
                <h3 className="text-lg font-medium text-brand-deep" style={{ fontFamily: "var(--font-subjectivity), serif" }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-brand-muted">{item.description}</p>
                <div className="mt-6">
                  <ImageCompare
                    beforeSrc={item.beforeImage}
                    afterSrc={item.afterImage}
                    beforeAlt={`${item.title} ${labels.beforeLabel}`}
                    afterAlt={`${item.title} ${labels.afterLabel}`}
                    labels={labels}
                  />
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
        <RevealOnScroll>
          <p className="mt-8 text-xs text-brand-muted">{disclaimer}</p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
