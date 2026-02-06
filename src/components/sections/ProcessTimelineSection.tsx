import Link from "next/link";
import type { Step } from "@/content/home";

type ProcessTimelineSectionProps = {
  steps: Step[];
  process: {
    timeline: string;
    visits: string[];
    cta: { label: string; href: string };
  };
  labels: {
    eyebrow: string;
    headline: string;
    stepLabel: string;
    visitsTitle: string;
    closingQuestion: string;
  };
};

// Three-step process with timeline placeholders and CTA.
export default function ProcessTimelineSection({
  steps,
  process,
  labels
}: ProcessTimelineSectionProps) {
  return (
    <section id="process" className="section scroll-mt-24 bg-white">
      <div className="container">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-teal/70">
              {labels.eyebrow}
            </p>
            <h2 className="section-title mt-4">{labels.headline}</h2>
          </div>
          <p className="text-sm text-brand-teal/70">{process.timeline}</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="card p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-teal/60">
                {labels.stepLabel} {index + 1}
              </p>
              <h3 className="mt-4 text-lg font-semibold text-brand-teal">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-slate-700">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 card p-6">
          <p className="text-sm font-semibold text-brand-teal">
            {labels.visitsTitle}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {process.visits.map((visit) => (
              <li key={visit} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-gold" />
                <span>{visit}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-brand-teal/10 pt-6">
          <p className="text-sm text-brand-teal/70">
            {labels.closingQuestion}
          </p>
          <Link href={process.cta.href} className="btn-primary">
            {process.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
