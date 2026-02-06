import {
  homeContent,
  type ContactContent,
  type HeroContent
} from "@/content/home";
import SiteHeader from "@/components/SiteHeader";
import MobileActionBar from "@/components/MobileActionBar";
import HeroVideoSection from "@/components/sections/HeroVideoSection";
import SocialProofStrip from "@/components/sections/SocialProofStrip";
import ProductSplitSection from "@/components/sections/ProductSplitSection";
import WhoIsThisForSection from "@/components/sections/WhoIsThisForSection";
import ProcessTimelineSection from "@/components/sections/ProcessTimelineSection";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import VideoReelsSection from "@/components/sections/VideoReelsSection";
import AssessmentToolPlaceholderSection from "@/components/sections/AssessmentToolPlaceholderSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";

// Homepage composition with all sections in the required order.
export default function Homepage() {
  const {
    hero,
    brand,
    socialProof,
    testimonials,
    product,
    eligibility,
    steps,
    process,
    beforeAfterFilters,
    beforeAfterCases,
    galleryDisclaimer,
    videos,
    assessment,
    faqs,
    contact,
    navigation
  } = homeContent;

  return (
    <div className="bg-white">
      <SiteHeader navigation={navigation} cta={hero.primaryCta} brand={brand} />
      <main className="pb-24 md:pb-0">
        <HeroVideoSection content={hero as HeroContent} />
        <SocialProofStrip
          rating={socialProof}
          testimonials={testimonials}
        />
        <ProductSplitSection content={product} />
        <WhoIsThisForSection content={eligibility} />
        <ProcessTimelineSection steps={steps} process={process} />
        <BeforeAfterSection
          cases={beforeAfterCases}
          filters={beforeAfterFilters}
          disclaimer={galleryDisclaimer}
        />
        <VideoReelsSection videos={videos} />
        <AssessmentToolPlaceholderSection content={assessment} />
        <FAQSection items={faqs} />
        <ContactSection content={contact as ContactContent} />
      </main>
      <MobileActionBar
        whatsapp={contact.whatsapp}
        cta={hero.primaryCta}
      />
    </div>
  );
}
