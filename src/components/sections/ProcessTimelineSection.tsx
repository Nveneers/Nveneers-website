import Link from "next/link";
import type { Step } from "@/content/home";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

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

// Vertical numbered steps timeline with visits card and CTA.
export default function ProcessTimelineSection({
  steps,
  process,
  labels
}: ProcessTimelineSectionProps) {
  return (
    <section
      id="process"
      className="section section-cream scroll-mt-24"
    >
      <div className="container">
        <RevealOnScroll>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="intro-label">{labels.eyebrow}</p>
              <h2 className="section-title mt-4">{labels.headline}</h2>
              <div className="divider" />
            </div>
            <p className="text-sm text-brand-muted sm:text-right">
              {process.timeline}
            </p>
          </div>
        </RevealOnScroll>

        {/* Numbered steps */}
        <div className="mt-10 flex flex-col">
          {steps.map((step, index) => (
            <RevealOnScroll key={step.title} delay={index * 80}>
              <div className="grid grid-cols-[80px_1fr] gap-8 border-b border-brand-border py-10 last:border-b-0">
                <div className="text-brand-gold-light" style={{
                  fontFamily: "var(--font-subjectivity), serif",
                  fontSize: "3.5rem",
                  fontWeight: 300,
                  lineHeight: 1,
                  paddingTop: "0.2rem"
                }}>
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="text-brand-deep" style={{
                    fontFamily: "var(--font-subjectivity), serif",
                    fontSize: "1.35rem",
                    fontWeight: 600,
                    marginBottom: "0.6rem"
                  }}>
                    {step.title}
                  </h3>
                  <p className="text-[0.95rem] text-brand-mid">{step.description}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Visits card */}
        <RevealOnScroll>
          <div className="mt-10 card p-6">
            <p className="text-sm font-medium text-brand-deep">
              {labels.visitsTitle}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-brand-mid">
              {process.visits.map((visit) => (
                <li key={visit} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-gold" />
                  <span>{visit}</span>
                </li>
              ))}
            </ul>
          </div>
        </RevealOnScroll>

        {/* CTA */}
        <RevealOnScroll>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-brand-border pt-6">
            <p className="text-sm text-brand-muted">
              {labels.closingQuestion}
            </p>
            <Link href={process.cta.href} className="btn-primary">
              {process.cta.label}
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
