import type { ContactContent } from "@/content/home";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type ContactSectionProps = {
  content: ContactContent;
  cta: { label: string; href: string };
  labels: {
    eyebrow: string;
    phoneLabel: string;
    emailLabel: string;
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
            <div className="card p-6 sm:p-8">
              <div className="space-y-4 text-sm">
                <div>
                  <p className="intro-label">{labels.phoneLabel}</p>
                  <p className="mt-1 text-base font-semibold text-brand-deep">
                    {content.phone}
                  </p>
                </div>
                <div>
                  <p className="intro-label">{labels.emailLabel}</p>
                  <p className="mt-1 text-base font-semibold text-brand-deep">
                    {content.email}
                  </p>
                </div>
                <div>
                  <p className="intro-label">{labels.hoursLabel}</p>
                  <p className="mt-1 text-base font-semibold text-brand-deep">
                    {content.hours}
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
        <RevealOnScroll>
          <div className="mt-12 border-t border-brand-border pt-6 text-xs text-brand-muted">
            <p>{content.disclaimer}</p>
            <p className="mt-2">{content.privacyLabel}</p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
