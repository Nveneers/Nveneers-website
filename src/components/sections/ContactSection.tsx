import type { ContactContent } from "@/content/home";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type ContactSectionProps = {
  content: ContactContent;
  cta: { label: string; href: string };
  labels: {
    eyebrow: string;
    phoneLabel: string;
    hoursLabel: string;
  };
};

// Final CTA and contact details.
export default function ContactSection({
  content,
  cta,
  labels
}: ContactSectionProps) {
  const whatsappHref = `https://wa.me/${content.whatsapp.number}?text=${encodeURIComponent(
    content.whatsapp.message
  )}`;

  return (
    <section
      id="contact"
      className="section section-ivory scroll-mt-24"
    >
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <RevealOnScroll>
            <div>
              <p className="intro-label">{labels.eyebrow}</p>
              <h2 className="section-title mt-4">{content.headline}</h2>
              <div className="divider" />
              <p className="section-lead">{content.subheadline}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className="btn-primary" href={cta.href}>
                  {cta.label}
                </a>
                <a
                  className="btn-secondary"
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  {content.whatsapp.label}
                </a>
              </div>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <div className="card overflow-hidden p-0">
              {[
                { label: labels.phoneLabel, value: content.phone, ltr: true },
                { label: labels.hoursLabel, value: content.hours, ltr: false },
              ].map((row, i) => (
                <div
                  key={row.label}
                  className="flex items-start gap-4 px-6 py-5"
                  style={{
                    borderTop: i > 0 ? "1px solid var(--border)" : undefined,
                  }}
                >
                  <div
                    className="mt-1 h-full w-0.5 self-stretch rounded-full"
                    style={{ background: "var(--gold)", minHeight: "2rem" }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="intro-label">{row.label}</p>
                    <p
                      className="mt-1 text-base font-semibold text-brand-deep"
                      dir={row.ltr ? "ltr" : undefined}
                      style={row.ltr ? { unicodeBidi: "embed", textAlign: "start" } : undefined}
                    >
                      {row.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
        <RevealOnScroll>
          <div className="mt-12 border-t border-brand-border pt-6 text-xs text-brand-muted">
            <p>{content.disclaimer}</p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
