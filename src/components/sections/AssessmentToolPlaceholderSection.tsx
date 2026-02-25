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
      className="section section-surface-soft-2 scroll-mt-24"
    >
      <div className="container">
        <div className="card mx-auto max-w-3xl p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-teal/70">
            {content.eyebrow}
          </p>
          <h2 className="section-title mt-4">{content.headline}</h2>
          <p className="section-lead">{content.body}</p>
          <div className="mt-8 space-y-4">
            <label className="block text-sm font-semibold text-brand-teal">
              {labels.uploadLabel}
            </label>
            <input
              type="file"
              disabled
              className="w-full cursor-not-allowed rounded-2xl border border-brand-teal/20 bg-white px-4 py-3 text-sm text-slate-500"
            />
            <button
              type="button"
              disabled
              className="btn-primary w-full cursor-not-allowed opacity-60"
            >
              {labels.submitLabel}
            </button>
            <p className="text-xs text-brand-teal/70">{content.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
