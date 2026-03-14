import type { FooterContent } from "@/content/home";

type FooterSectionProps = {
  content: FooterContent;
};

// Minimal dark footer.
export default function FooterSection({ content }: FooterSectionProps) {
  return (
    <footer className="py-8 text-center text-[0.8rem] tracking-[0.05em] text-white/30" style={{ background: "#050d1a" }}>
      <p>{content.text}</p>
    </footer>
  );
}
