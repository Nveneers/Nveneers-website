export type Locale = "en" | "ar";

export type HeroVideoSlide = {
  id: string;
  src: string;
  poster?: string;
};

export type HeroContent = {
  primaryCta: { label: string; href: string };
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
  image: string;
  description?: string;
};

export type BestCase = {
  id: string;
  title: string;
  image: string;
  caption: string;
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
  hours: string;
  disclaimer: string;
  privacyLabel: string;
};

export type IntroStripStat = {
  value: string;
  unit: string;
  label: string;
};

export type IntroStripContent = {
  eyebrow: string;
  headline: string;
  body: string;
  stats: IntroStripStat[];
};

export type ComparisonRow = {
  feature: string;
  nVeneers: string;
  traditional: string;
};

export type ComparisonContent = {
  eyebrow: string;
  headline: string;
  columns: [string, string, string];
  rows: ComparisonRow[];
};

export type AftercareTip = {
  icon: string;
  title: string;
  description: string;
};

export type AftercareContent = {
  eyebrow: string;
  headline: string;
  lead: string;
  tips: AftercareTip[];
};

export type CtaBannerContent = {
  headline: string;
  highlightedText: string;
  body: string;
  cta: { label: string; href: string };
};

export type FooterContent = {
  text: string;
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
    eyebrow: string;
    headline: string;
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
  bestCases: {
    eyebrow: string;
    headline: string;
    lead: string;
    prevAriaLabel: string;
    nextAriaLabel: string;
    nudge: string;
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
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    submitLabel: string;
    submittingLabel: string;
    doneTitle: string;
    doneBody: string;
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
  beforeAfterCases: BeforeAfterCase[];
  galleryDisclaimer: string;
  bestCases: BestCase[];
  videos: VideoItem[];
  assessment: AssessmentContent;
  faqs: FaqItem[];
  contact: ContactContent;
  navigation: { label: string; href: string }[];
  ui: HomeUi;
  introStrip: IntroStripContent;
  comparison: ComparisonContent;
  aftercare: AftercareContent;
  ctaBanner: CtaBannerContent;
  footer: FooterContent;
};
