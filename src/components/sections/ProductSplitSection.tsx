import Image from "next/image";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import type { ProductContent } from "@/content/home";

type ProductSplitSectionProps = { content: ProductContent };

function DetailGuides({ kind }: { kind: ProductContent["bullets"][number]["visual"]["kind"] }) {
  return (
    <svg className={`material-guides material-guides-${kind}`} viewBox="0 0 400 400" fill="none" aria-hidden="true" focusable="false">
      {kind === "planning" ? (
        <>
          <path d="M200 70v207M102 156h196M142 230h116" strokeDasharray="4 5" />
          <path d="M151 217v26m98-26v26M157 236q43 21 86 0" />
          <circle cx="200" cy="230" r="4" /><circle cx="151" cy="230" r="3" /><circle cx="249" cy="230" r="3" />
        </>
      ) : kind === "preservation" ? (
        <>
          <path d="M61 125v141m-6-141h12m-12 141h12M290 166h33v78h-19" />
          <circle cx="290" cy="166" r="4" />
          <path d="m84 286 40-17h31" strokeDasharray="3 4" />
        </>
      ) : (
        <>
          <path d="M65 201h68m134 0h67" strokeDasharray="3 5" />
          <path d="m122 196 11 5-11 5m201-10 11 5-11 5M163 90h74" />
          <circle cx="163" cy="90" r="3" /><circle cx="237" cy="90" r="3" />
        </>
      )}
    </svg>
  );
}

export default function ProductSplitSection({ content }: ProductSplitSectionProps) {
  return (
    <section id="veneer-details" className="section section-canvas" aria-labelledby="veneer-details-title">
      <div className="container">
        <RevealOnScroll>
          <div className="product-section-intro">
            <div>
              <p className="intro-label">{content.eyebrow}</p>
              <h2 id="veneer-details-title" className="section-title mt-4">{content.headline}</h2>
            </div>
            <div className="product-section-body">
              {content.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </RevealOnScroll>

        <div className="material-grid">
          {content.bullets.map((bullet, index) => (
            <RevealOnScroll key={bullet.title} delay={index * 100}>
              <article className="material-feature">
                <div className="material-feature-copy">
                  <span className="material-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{bullet.title}</h3>
                  <p>{bullet.description}</p>
                </div>
                <figure className={`material-visual material-visual-${bullet.visual.kind}`}>
                  <Image src={bullet.image.src} alt={bullet.image.alt} fill sizes="(min-width: 1024px) 360px, (min-width: 768px) 30vw, 92vw" className="material-image" />
                  <DetailGuides kind={bullet.visual.kind} />
                  <span className="material-tag"><span aria-hidden="true" />{bullet.visual.tag}</span>
                  {bullet.visual.kind === "translucency" && <div className="porcelain-shades" aria-hidden="true"><i /><i /><i /><i /></div>}
                  <figcaption className="material-readout">
                    <div className="material-value" dir="ltr">{bullet.visual.value}<span>{bullet.visual.unit}</span></div>
                    <div className="material-readout-copy">
                      <p>{bullet.visual.label}</p>
                      <span>{bullet.visual.detail}</span>
                    </div>
                  </figcaption>
                </figure>
              </article>
            </RevealOnScroll>
          ))}
        </div>
        <p className="material-illustration-note">{content.illustrationNote}</p>
      </div>
    </section>
  );
}
