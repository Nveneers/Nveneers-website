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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-gold/20 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_18px_rgba(0,0,0,0.15)] md:hidden" style={{ background: "rgba(10,22,40,0.95)", backdropFilter: "blur(12px)" }}>
      <div className="flex gap-3">
        <a
          className="btn-secondary flex-1 border-white/20 text-white/70"
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
