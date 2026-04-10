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
import ProductSplitSection from "@/components/sections/ProductSplitSection";
import SmileAssessmentSection from "@/components/sections/SmileAssessmentSection";
import WhoIsThisForSection from "@/components/sections/WhoIsThisForSection";
import ProcessTimelineSection from "@/components/sections/ProcessTimelineSection";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import VideoReelsSection from "@/components/sections/VideoReelsSection";
import FAQSection from "@/components/sections/FAQSection";
import SocialProofStrip from "@/components/sections/SocialProofStrip";
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
      className={direction === "rtl" ? "locale-rtl" : "locale-ltr"}
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
        <ProductSplitSection content={product} />
        <SmileAssessmentSection
          content={assessment}
          labels={ui.assessment}
          whatsappNumber={contact.whatsapp.number}
          whatsappSuccessMessage="Hi, I just used the smile assessment tool on your website and my photo was approved. I'm attaching it now — could you please review it and let me know next steps?"
        />
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
        <FAQSection items={faqs} labels={ui.faq} />
        <SocialProofStrip
          rating={socialProof}
          testimonials={testimonials}
          eyebrow={ui.socialProof.eyebrow}
        />
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
