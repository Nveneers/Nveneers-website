"use client";

import { useState } from "react";

type AccordionItem = {
  question: string;
  answer: string;
};

type AccordionProps = {
  items: AccordionItem[];
};

// Simple accordion for FAQ content with single-item expansion.
export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        return (
          <div key={item.question} className="card overflow-hidden">
            <button
              type="button"
              className="flex w-full items-center justify-between px-6 py-5 text-start text-sm font-medium text-brand-deep"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span>{item.question}</span>
              <span className="text-brand-gold text-lg">
                {isOpen ? "\u2212" : "+"}
              </span>
            </button>
            <div
              id={panelId}
              className={`px-6 pb-6 text-sm text-brand-mid ${
                isOpen ? "block" : "hidden"
              }`}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
