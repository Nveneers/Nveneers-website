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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-border px-4 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_24px_rgb(44_81_244/0.06)] lg:hidden" style={{ background: "rgb(var(--color-surface) / 0.96)", backdropFilter: "blur(12px)" }}>
      <div className="flex gap-3">
        <a
          className="btn-secondary flex-1 whitespace-nowrap !px-4 !py-2 !tracking-normal"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
        >
          {whatsapp.label}
        </a>
        <a className="btn-primary flex-1 whitespace-nowrap !px-4 !py-2 !tracking-normal" href={cta.href}>
          {cta.label}
        </a>
      </div>
    </div>
  );
}
