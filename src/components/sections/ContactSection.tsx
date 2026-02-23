import type { ContactContent } from "@/content/home";

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

// Final CTA and contact details without map.
export default function ContactSection({
  content,
  cta,
  labels
}: ContactSectionProps) {
  const whatsappHref = `https://wa.me/${content.whatsapp.number}?text=${encodeURIComponent(
    content.whatsapp.message
  )}`;

  return (
    <section id="contact" className="section scroll-mt-24 bg-white">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-teal/70">
              {labels.eyebrow}
            </p>
            <h2 className="section-title mt-4">{content.headline}</h2>
            <p className="section-lead">{content.subheadline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="btn-primary"
                href={cta.href}
              >
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
          <div className="card p-6 sm:p-8">
            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-teal/60">
                  {labels.phoneLabel}
                </p>
                <p className="text-base font-semibold text-brand-teal">
                  {content.phone}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-teal/60">
                  {labels.emailLabel}
                </p>
                <p className="text-base font-semibold text-brand-teal">
                  {content.email}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-teal/60">
                  {labels.hoursLabel}
                </p>
                <p className="text-base font-semibold text-brand-teal">
                  {content.hours}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-brand-teal/10 pt-6 text-xs text-brand-teal/70">
          <p>{content.disclaimer}</p>
          <p className="mt-2">{content.privacyLabel}</p>
        </div>
      </div>
    </section>
  );
}
