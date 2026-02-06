type MobileActionBarProps = {
  whatsapp: { label: string; number: string; message: string };
  cta: { label: string; href: string };
};

// Mobile sticky action bar with WhatsApp and assessment CTA.
export default function MobileActionBar({ whatsapp, cta }: MobileActionBarProps) {
  const whatsappHref = `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(
    whatsapp.message
  )}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-teal/10 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md gap-3">
        <a
          className="btn-secondary flex-1"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
        >
          {whatsapp.label}
        </a>
        <a className="btn-primary flex-1" href={cta.href}>
          {cta.label}
        </a>
      </div>
    </div>
  );
}
