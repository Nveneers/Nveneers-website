import type { EligibilityContent } from "@/content/home";

type WhoIsThisForSectionProps = {
  content: EligibilityContent;
  labels: {
    goodFitTitle: string;
    notIdealTitle: string;
  };
};

// Eligibility guidance section with good fit and not ideal lists.
export default function WhoIsThisForSection({
  content,
  labels
}: WhoIsThisForSectionProps) {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="card p-8">
            <h3 className="text-xl font-semibold text-brand-teal">
              {labels.goodFitTitle}
            </h3>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {content.goodFit.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-8">
            <h3 className="text-xl font-semibold text-brand-teal">
              {labels.notIdealTitle}
            </h3>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {content.notIdeal.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-teal/60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6 text-sm text-brand-teal/70">{content.note}</p>
      </div>
    </section>
  );
}
