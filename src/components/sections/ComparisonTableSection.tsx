import type { ComparisonContent } from "@/content/home";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type ComparisonTableSectionProps = {
  content: ComparisonContent;
};

// Responsive comparison table section.
export default function ComparisonTableSection({ content }: ComparisonTableSectionProps) {
  return (
    <section className="section section-soft">
      <div className="container">
        <RevealOnScroll>
          <div className="mb-14">
            <p className="intro-label">{content.eyebrow}</p>
            <h2 className="section-title mt-4">{content.headline}</h2>
            <div className="divider" />
          </div>
        </RevealOnScroll>
        <RevealOnScroll>
          <div className="overflow-x-auto rounded-2xl border border-brand-border">
            <table className="w-full border-collapse text-[0.85rem] sm:text-[0.9rem]">
              <thead className="bg-brand-soft text-brand-heading">
                <tr>
                  {content.columns.map((col, i) => (
                    <th
                      key={col}
                      className="px-3 py-3 text-start font-medium tracking-[0.02em] sm:px-6 sm:py-4"
                      style={{
                        fontFamily: "var(--font-body), sans-serif",
                        fontSize: "clamp(0.85rem, 2.5vw, 1.05rem)",
                        color: i === 1 ? "var(--accent)" : "var(--heading)"
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.rows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className="border-b border-brand-border last:border-b-0"
                    style={{ background: i % 2 === 1 ? "var(--soft)" : "var(--surface)" }}
                  >
                    <td className="px-3 py-3 font-medium text-brand-heading sm:px-6 sm:py-4">
                      {row.feature}
                    </td>
                    <td className="px-3 py-3 text-brand-text sm:px-6 sm:py-4">{row.nVeneers}</td>
                    <td className="px-3 py-3 text-brand-text sm:px-6 sm:py-4">{row.traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-center text-xs text-brand-muted md:hidden">← scroll to compare →</p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
