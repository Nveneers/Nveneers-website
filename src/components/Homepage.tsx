import {
  getHomeContent,
  type ContactContent,
  type HeroContent,
  type Locale
} from "@/content/home";
import SiteHeader from "@/components/SiteHeader";
import MobileHeader from "@/components/MobileHeader";
import MobileActionBar from "@/components/MobileActionBar";
import LanguageDocument from "@/components/LanguageDocument";
import HeroVideoSection from "@/components/sections/HeroVideoSection";
import IntroStripSection from "@/components/sections/IntroStripSection";
import ProductSplitSection from "@/components/sections/ProductSplitSection";
import AssessmentToolPlaceholderSection from "@/components/sections/AssessmentToolPlaceholderSection";
import ProcessTimelineSection from "@/components/sections/ProcessTimelineSection";
import WhoIsThisForSection from "@/components/sections/WhoIsThisForSection";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import ComparisonTableSection from "@/components/sections/ComparisonTableSection";
import VideoReelsSection from "@/components/sections/VideoReelsSection";
import AftercareTipsSection from "@/components/sections/AftercareTipsSection";
import FAQSection from "@/components/sections/FAQSection";
import SocialProofStrip from "@/components/sections/SocialProofStrip";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import ContactSection from "@/components/sections/ContactSection";
import FooterSection from "@/components/sections/FooterSection";

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
    ui,
    introStrip,
    comparison,
    aftercare,
    ctaBanner,
    footer
  } = homeContent;
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <div
      className={`page-fade-in ${direction === "rtl" ? "locale-rtl" : "locale-ltr"}`}
      dir={direction}
      lang={locale}
      data-locale={locale}
    >
      <LanguageDocument locale={locale} />
      <MobileHeader
        locale={locale}
        navigation={navigation}
        cta={hero.primaryCta}
        brand={brand}
        languageToggle={{
          label: ui.header.languageSwitchLabel,
          ariaLabel: ui.header.languageSwitchAriaLabel,
          href: `/${ui.header.languageSwitchLocale}`
        }}
      />
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
      <main className="pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
        <HeroVideoSection content={hero as HeroContent} labels={ui.hero} />
        <IntroStripSection content={introStrip} />
        <ProductSplitSection content={product} />
        <AssessmentToolPlaceholderSection
          content={assessment}
          labels={ui.assessment}
        />
        <ProcessTimelineSection
          steps={steps}
          process={process}
          labels={ui.process}
        />
        <WhoIsThisForSection
          content={eligibility}
          labels={ui.eligibility}
        />
        <BeforeAfterSection
          cases={beforeAfterCases}
          filters={beforeAfterFilters}
          disclaimer={galleryDisclaimer}
          labels={ui.beforeAfter}
        />
        <ComparisonTableSection content={comparison} />
        <VideoReelsSection videos={videos} labels={ui.videos} />
        <AftercareTipsSection content={aftercare} />
        <FAQSection items={faqs} labels={ui.faq} />
        <SocialProofStrip
          rating={socialProof}
          testimonials={testimonials}
          eyebrow={ui.socialProof.eyebrow}
        />
        <CtaBannerSection content={ctaBanner} />
        <ContactSection
          content={contact as ContactContent}
          cta={hero.primaryCta}
          labels={ui.contact}
        />
      </main>
      <FooterSection content={footer} />
      <MobileActionBar
        whatsapp={contact.whatsapp}
        cta={hero.primaryCta}
      />
    </div>
  );
}
