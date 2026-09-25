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
import BestCasesSection from "@/components/sections/BestCasesSection";
import SmileAssessmentSection from "@/components/sections/SmileAssessmentSection";
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
    beforeAfterCases,
    galleryDisclaimer,
    bestCases,
    // videos,
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
      <a href="#main-content" className="skip-link">{locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}</a>
      <MobileHeader
        locale={locale}
        navigation={navigation}
        brand={brand}
        themeLabel={ui.header.themeToggleLabel}
        languageToggle={{
          label: ui.header.languageSwitchLabel,
          ariaLabel: ui.header.languageSwitchAriaLabel,
          href: `/${ui.header.languageSwitchLocale}`
        }}
      />
      <SiteHeader
        homeHref={`/${locale}`}
        themeLabel={ui.header.themeToggleLabel}
        navigation={navigation}
        cta={hero.primaryCta}
        brand={brand}
        languageToggle={{
          label: ui.header.languageSwitchLabel,
          ariaLabel: ui.header.languageSwitchAriaLabel,
          href: `/${ui.header.languageSwitchLocale}`
        }}
      />
      <main id="main-content">
        <HeroVideoSection content={hero as HeroContent} labels={ui.hero} />
        <IntroStripSection content={introStrip} />
        <ProductSplitSection content={product} />
        <BestCasesSection cases={bestCases} labels={ui.bestCases} />
        <SmileAssessmentSection
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
          disclaimer={galleryDisclaimer}
          labels={ui.beforeAfter}
        />
        <ComparisonTableSection content={comparison} />
        {/* <VideoReelsSection videos={videos} labels={ui.videos} /> */}
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
      <FooterSection content={footer} brand={brand} locale={locale} />
      <MobileActionBar
        whatsapp={contact.whatsapp}
        cta={hero.primaryCta}
      />
    </div>
  );
}
