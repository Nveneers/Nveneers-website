"use client";

import { useMemo, useState } from "react";
import ImageCompare from "@/components/ui/ImageCompare";
import type { BeforeAfterCase } from "@/content/home";

type BeforeAfterSectionProps = {
  cases: BeforeAfterCase[];
  filters: string[];
  disclaimer: string;
};

// Gallery with filter chips and image compare sliders.
export default function BeforeAfterSection({
  cases,
  filters,
  disclaimer
}: BeforeAfterSectionProps) {
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  const visibleCases = useMemo(
    () => cases.filter((item) => item.filters.includes(activeFilter)),
    [cases, activeFilter]
  );

  return (
    <section id="cases" className="section scroll-mt-24 bg-white">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-teal/70">
              Before and After
            </p>
            <h2 className="section-title mt-4">Real cases, refined outcomes</h2>
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
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "border-brand-gold bg-brand-gold text-brand-teal"
                      : "border-brand-teal/20 text-brand-teal"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {visibleCases.map((item) => (
            <div key={item.id} className="card p-6">
              <h3 className="text-lg font-semibold text-brand-teal">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              <div className="mt-6">
                <ImageCompare
                  beforeSrc={item.beforeImage}
                  afterSrc={item.afterImage}
                  beforeAlt={`${item.title} before`}
                  afterAlt={`${item.title} after`}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-xs text-brand-teal/70">{disclaimer}</p>
      </div>
    </section>
  );
}
