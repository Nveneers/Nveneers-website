import Accordion from "@/components/ui/Accordion";
import type { FaqItem } from "@/content/home";

type FAQSectionProps = {
  items: FaqItem[];
};

// FAQ section with accordion disclosure.
export default function FAQSection({ items }: FAQSectionProps) {
  return (
    <section id="faq" className="section scroll-mt-24 bg-white">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-teal/70">
            FAQ
          </p>
          <h2 className="section-title mt-4">Common questions</h2>
          <p className="section-lead">
            Clear answers so you can decide with confidence.
          </p>
        </div>
        <div className="mt-10">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
