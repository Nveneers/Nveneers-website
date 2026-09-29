import Image from "next/image";
import type { IntroStripContent } from "@/content/home";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type IntroStripSectionProps = { content: IntroStripContent };

export default function IntroStripSection({ content }: IntroStripSectionProps) {
  return (
    <section id="about-veneers" className="section section-soft" aria-labelledby="about-veneers-title">
      <div className="container veneer-intro-grid">
        <RevealOnScroll>
          <div className="veneer-intro-copy">
            <p className="intro-label">{content.eyebrow}</p>
            <h2 id="about-veneers-title" className="section-title mt-4">{content.headline}</h2>
            <div className="divider" />
            <p className="veneer-intro-body">{content.body}</p>
            <dl className="veneer-quick-facts">
              {content.stats.map(stat => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd dir="ltr">{stat.value}<span>{stat.unit}</span></dd>
                </div>
              ))}
            </dl>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={120}>
          <figure className="veneer-macro">
            <div className="veneer-macro-image">
              <Image src={content.image.src} alt={content.image.alt} fill sizes="(min-width: 1024px) 620px, (min-width: 768px) 52vw, 92vw" className="object-cover" />
              <span className="macro-eyebrow">{content.image.eyebrow}</span>
              <svg className="macro-guides" viewBox="0 0 600 500" fill="none" aria-hidden="true" focusable="false">
                <path d="M30 75V30h45m450 0h45v45M155 330h80l35-20" />
                <circle cx="270" cy="310" r="4" />
              </svg>
              <div className="macro-measurement">
                <p className="macro-measurement-label">{content.measurement.label}</p>
                <p className="macro-measurement-value" dir="ltr">{content.measurement.value}<span>{content.measurement.unit}</span></p>
                <p className="macro-measurement-detail">{content.measurement.detail}</p>
              </div>
            </div>
            <figcaption>{content.image.caption}</figcaption>
          </figure>
        </RevealOnScroll>
      </div>
    </section>
  );
}
