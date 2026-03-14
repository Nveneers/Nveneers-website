import Accordion from "@/components/ui/Accordion";
import type { FaqItem } from "@/content/home";

type FAQSectionProps = {
  items: FaqItem[];
  labels: {
    eyebrow: string;
    headline: string;
    lead: string;
  };
};

// FAQ section with accordion disclosure.
export default function FAQSection({ items, labels }: FAQSectionProps) {
  return (
    <section id="faq" className="section section-surface-soft-2 scroll-mt-24">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-teal/70">
            {labels.eyebrow}
          </p>
          <h2 className="section-title mt-4">{labels.headline}</h2>
          <p className="section-lead">{labels.lead}</p>
        </div>
        <div className="mt-10">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
