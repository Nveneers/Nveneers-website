import type {
  AftercareContent,
  ComparisonContent,
  ContactContent,
  CtaBannerContent,
  EligibilityContent,
  FaqItem,
  FooterContent,
  HeroContent,
  HeroVideoSlide,
  HomeContent,
  HomeUi,
  IntroStripContent,
  Locale,
  ProcessContent,
  ProductContent,
  SocialProof,
  Step,
  Testimonial,
  VideoItem
} from "./types";

import brandEn from "./en/brand.json";
import heroEn from "./en/hero.json";
import socialProofEn from "./en/socialProof.json";
import testimonialsEn from "./en/testimonials.json";
import productEn from "./en/product.json";
import eligibilityEn from "./en/eligibility.json";
import stepsEn from "./en/steps.json";
import processEn from "./en/process.json";
import beforeAfterEn from "./en/beforeAfter.json";
import videosEn from "./en/videos.json";
import assessmentEn from "./en/assessment.json";
import faqsEn from "./en/faqs.json";
import contactEn from "./en/contact.json";
import navigationEn from "./en/navigation.json";
import uiEn from "./en/ui.json";
import introStripEn from "./en/introStrip.json";
import comparisonEn from "./en/comparison.json";
import aftercareEn from "./en/aftercare.json";
import ctaBannerEn from "./en/ctaBanner.json";
import footerEn from "./en/footer.json";

import brandAr from "./ar/brand.json";
import heroAr from "./ar/hero.json";
import socialProofAr from "./ar/socialProof.json";
import testimonialsAr from "./ar/testimonials.json";
import productAr from "./ar/product.json";
import eligibilityAr from "./ar/eligibility.json";
import stepsAr from "./ar/steps.json";
import processAr from "./ar/process.json";
import beforeAfterAr from "./ar/beforeAfter.json";
import videosAr from "./ar/videos.json";
import assessmentAr from "./ar/assessment.json";
import faqsAr from "./ar/faqs.json";
import contactAr from "./ar/contact.json";
import navigationAr from "./ar/navigation.json";
import uiAr from "./ar/ui.json";
import introStripAr from "./ar/introStrip.json";
import comparisonAr from "./ar/comparison.json";
import aftercareAr from "./ar/aftercare.json";
import ctaBannerAr from "./ar/ctaBanner.json";
import footerAr from "./ar/footer.json";

export type {
  AftercareContent,
  AssessmentContent,
  BeforeAfterCase,
  ComparisonContent,
  ContactContent,
  CtaBannerContent,
  EligibilityContent,
  FaqItem,
  FooterContent,
  HeroContent,
  HeroVideoSlide,
  HomeContent,
  HomeUi,
  IntroStripContent,
  Locale,
  ProcessContent,
  ProductContent,
  SocialProof,
  Step,
  Testimonial,
  VideoItem
} from "./types";

const homeContentEn: HomeContent = {
  brand: brandEn,
  hero: heroEn as HeroContent,
  socialProof: socialProofEn as SocialProof,
  testimonials: testimonialsEn as Testimonial[],
  product: productEn as ProductContent,
  eligibility: eligibilityEn as EligibilityContent,
  steps: stepsEn as Step[],
  process: processEn as ProcessContent,
  beforeAfterFilters: beforeAfterEn.filters as string[],
  beforeAfterCases: beforeAfterEn.cases as HomeContent["beforeAfterCases"],
  galleryDisclaimer: beforeAfterEn.disclaimer as string,
  videos: videosEn as VideoItem[],
  assessment: assessmentEn,
  faqs: faqsEn as FaqItem[],
  contact: contactEn as ContactContent,
  navigation: navigationEn as HomeContent["navigation"],
  ui: uiEn as HomeUi,
  introStrip: introStripEn as IntroStripContent,
  comparison: comparisonEn as ComparisonContent,
  aftercare: aftercareEn as AftercareContent,
  ctaBanner: ctaBannerEn as CtaBannerContent,
  footer: footerEn as FooterContent
};

const homeContentAr: HomeContent = {
  brand: brandAr,
  hero: heroAr as HeroContent,
  socialProof: socialProofAr as SocialProof,
  testimonials: testimonialsAr as Testimonial[],
  product: productAr as ProductContent,
  eligibility: eligibilityAr as EligibilityContent,
  steps: stepsAr as Step[],
  process: processAr as ProcessContent,
  beforeAfterFilters: beforeAfterAr.filters as string[],
  beforeAfterCases: beforeAfterAr.cases as HomeContent["beforeAfterCases"],
  galleryDisclaimer: beforeAfterAr.disclaimer as string,
  videos: videosAr as VideoItem[],
  assessment: assessmentAr,
  faqs: faqsAr as FaqItem[],
  contact: contactAr as ContactContent,
  navigation: navigationAr as HomeContent["navigation"],
  ui: uiAr as HomeUi,
  introStrip: introStripAr as IntroStripContent,
  comparison: comparisonAr as ComparisonContent,
  aftercare: aftercareAr as AftercareContent,
  ctaBanner: ctaBannerAr as CtaBannerContent,
  footer: footerAr as FooterContent
};

export const homeContentByLocale: Record<Locale, HomeContent> = {
  en: homeContentEn,
  ar: homeContentAr
};

export const getHomeContent = (locale: Locale): HomeContent =>
  homeContentByLocale[locale] ?? homeContentByLocale.en;
