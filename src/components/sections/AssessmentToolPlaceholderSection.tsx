import RevealOnScroll from "@/components/ui/RevealOnScroll";

type AssessmentToolPlaceholderSectionProps = {
  content: {
    eyebrow: string;
    headline: string;
    body: string;
    disclaimer: string;
  };
  labels: {
    uploadLabel: string;
    submitLabel: string;
  };
};

// Placeholder assessment tool with disabled form inputs.
export default function AssessmentToolPlaceholderSection({
  content,
  labels
}: AssessmentToolPlaceholderSectionProps) {
  return (
    <section
      id="assessment"
      className="section section-ivory scroll-mt-24"
    >
      <div className="container">
        <RevealOnScroll>
          <div className="card mx-auto max-w-3xl p-6 sm:p-10">
            <p className="intro-label">{content.eyebrow}</p>
            <h2 className="section-title mt-4">{content.headline}</h2>
            <p className="section-lead">{content.body}</p>
            <div className="mt-8 space-y-4">
              <label className="block text-sm font-medium text-brand-deep">
                {labels.uploadLabel}
              </label>
              <input
                type="file"
                disabled
                className="w-full cursor-not-allowed rounded-2xl border border-brand-border bg-brand-warm-white px-4 py-3 text-sm text-brand-muted"
              />
              <button
                type="button"
                disabled
                className="btn-primary w-full cursor-not-allowed opacity-60"
              >
                {labels.submitLabel}
              </button>
              <p className="text-xs text-brand-muted">{content.disclaimer}</p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
