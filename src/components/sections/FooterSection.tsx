import Link from "next/link";
import type { FooterContent } from "@/content/home";

type FooterSectionProps = {
  content: FooterContent;
};

// Minimal dark footer.
export default function FooterSection({ content }: FooterSectionProps) {
  return (
    <footer className="py-8 text-center text-[0.8rem] tracking-[0.05em] text-white/30" style={{ background: "#050d1a" }}>
      {content.links?.length ? (
        <nav className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {content.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/45 transition hover:text-brand-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
      <p>{content.text}</p>
    </footer>
  );
}
