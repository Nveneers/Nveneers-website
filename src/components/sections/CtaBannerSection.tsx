import type { CtaBannerContent } from "@/content/home";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import BrandWave from "@/components/BrandWave";

export default function CtaBannerSection({ content }: { content: CtaBannerContent }) {
  return (
    <section className="cta-stage px-4 py-20 sm:px-8 sm:py-28">
      <BrandWave />
      <div className="container relative">
        <div className="cta-content mx-auto max-w-4xl rounded-[2rem] px-6 py-14 text-center sm:px-14 sm:py-20">
          <RevealOnScroll>
            <h2 className="section-title">
              {content.headline}<br />
              <span className="text-brand-accent">{content.highlightedText}</span>
            </h2>
            <p className="mx-auto mb-8 mt-6 max-w-lg text-base text-brand-muted">{content.body}</p>
            <a href={content.cta.href} className="btn-primary">{content.cta.label}</a>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
