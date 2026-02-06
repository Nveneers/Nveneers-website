import {
  getHomeContent,
  type ContactContent,
  type HeroContent,
  type Locale
} from "@/content/home";
import SiteHeader from "@/components/SiteHeader";
import MobileActionBar from "@/components/MobileActionBar";
import LanguageDocument from "@/components/LanguageDocument";
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
type HomepageProps = {
  locale: Locale;
};

export default function Homepage({ locale }: HomepageProps) {
  const homeContent = getHomeContent(locale);
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
    navigation,
    ui
  } = homeContent;
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <div
      className={`bg-white ${direction === "rtl" ? "locale-rtl" : "locale-ltr"}`}
      dir={direction}
      lang={locale}
      data-locale={locale}
    >
      <LanguageDocument locale={locale} />
      <SiteHeader
        navigation={navigation}
        cta={hero.primaryCta}
        brand={brand}
        languageToggle={{
          label: ui.header.languageSwitchLabel,
          ariaLabel: ui.header.languageSwitchAriaLabel,
          href: `/${ui.header.languageSwitchLocale}`
        }}
      />
      <main className="pb-24 md:pb-0">
        <HeroVideoSection content={hero as HeroContent} />
        <SocialProofStrip
          rating={socialProof}
          testimonials={testimonials}
          eyebrow={ui.socialProof.eyebrow}
        />
        <ProductSplitSection content={product} />
        <WhoIsThisForSection
          content={eligibility}
          labels={ui.eligibility}
        />
        <ProcessTimelineSection
          steps={steps}
          process={process}
          labels={ui.process}
        />
        <BeforeAfterSection
          cases={beforeAfterCases}
          filters={beforeAfterFilters}
          disclaimer={galleryDisclaimer}
          labels={ui.beforeAfter}
        />
        <VideoReelsSection videos={videos} labels={ui.videos} />
        <AssessmentToolPlaceholderSection
          content={assessment}
          labels={ui.assessment}
        />
        <FAQSection items={faqs} labels={ui.faq} />
        <ContactSection
          content={contact as ContactContent}
          cta={hero.primaryCta}
          labels={ui.contact}
        />
      </main>
      <MobileActionBar
        whatsapp={contact.whatsapp}
        cta={hero.primaryCta}
      />
    </div>
  );
}
