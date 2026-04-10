export type Locale = "en" | "ar";

export type HeroVideoSlide = {
  id: string;
  src: string;
  poster: string;
};

export type HeroContent = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  videos: HeroVideoSlide[];
};

export type Testimonial = {
  quote: string;
  name: string;
  detail: string;
};

export type SocialProof = {
  rating: string;
  count: string;
  note: string;
};

export type ProductContent = {
  eyebrow: string;
  headline: string;
  body: string[];
  bullets: { title: string; description: string }[];
  media: { videoSrc: string; poster: string; alt: string };
};

export type EligibilityContent = {
  goodFit: string[];
  notIdeal: string[];
  note: string;
};

export type Step = {
  title: string;
  description: string;
};

export type ProcessContent = {
  timeline: string;
  visits: string[];
  cta: { label: string; href: string };
};

export type BeforeAfterCase = {
  id: string;
  title: string;
  filters: string[];
  beforeImage: string;
  afterImage: string;
  description: string;
};


export type VideoItem = {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  src: string;
};

export type AssessmentContent = {
  eyebrow: string;
  headline: string;
  body: string;
  disclaimer: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ContactContent = {
  headline: string;
  subheadline: string;
  whatsapp: { label: string; number: string; message: string };
  phone: string;
  email: string;
  hours: string;
  disclaimer: string;
  privacyLabel: string;
};

export type HomeUi = {
  header: {
    languageSwitchLabel: string;
    languageSwitchAriaLabel: string;
    languageSwitchLocale: Locale;
  };
  hero: {
    dotAriaLabelPrefix: string;
  };
  socialProof: {
    eyebrow: string;
  };
  eligibility: {
    goodFitTitle: string;
    notIdealTitle: string;
  };
  process: {
    eyebrow: string;
    headline: string;
    stepLabel: string;
    visitsTitle: string;
    closingQuestion: string;
  };
  beforeAfter: {
    eyebrow: string;
    headline: string;
    compareAriaLabel: string;
    beforeLabel: string;
    afterLabel: string;
  };
  videos: {
    eyebrow: string;
    headline: string;
    hint: string;
    playLabel: string;
    closeLabel: string;
    durationLabel: string;
  };
  assessment: {
    uploadLabel: string;
    cameraLabel: string;
    checkLabel: string;
    changePhotoLabel: string;
    validatingLabel: string;
    successTitle: string;
    successBody: string;
    savePhotoLabel: string;
    savePhotoHint: string;
    whatsappLabel: string;
    tryAgainLabel: string;
    fileSizeError: string;
    fileTypeError: string;
  };
  faq: {
    eyebrow: string;
    headline: string;
    lead: string;
  };
  contact: {
    eyebrow: string;
    phoneLabel: string;
    emailLabel: string;
    hoursLabel: string;
  };
};

export type HomeContent = {
  brand: {
    name: string;
    logoFull: string;
    logoMark: string;
    logoAlt: string;
  };
  hero: HeroContent;
  socialProof: SocialProof;
  testimonials: Testimonial[];
  product: ProductContent;
  eligibility: EligibilityContent;
  steps: Step[];
  process: ProcessContent;
  beforeAfterFilters: string[];
  beforeAfterCases: BeforeAfterCase[];
  galleryDisclaimer: string;
  videos: VideoItem[];
  assessment: AssessmentContent;
  faqs: FaqItem[];
  contact: ContactContent;
  navigation: { label: string; href: string }[];
  ui: HomeUi;
};
