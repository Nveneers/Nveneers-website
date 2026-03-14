import Accordion from "@/components/ui/Accordion";
import type { FaqItem } from "@/content/home";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

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
    <section id="faq" className="section section-ivory scroll-mt-24">
      <div className="container">
        <RevealOnScroll>
          <div className="max-w-2xl">
            <p className="intro-label">{labels.eyebrow}</p>
            <h2 className="section-title mt-4">{labels.headline}</h2>
            <div className="divider" />
            <p className="section-lead">{labels.lead}</p>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <div className="mt-10">
            <Accordion items={items} />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
