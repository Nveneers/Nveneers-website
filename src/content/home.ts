export type HeroContent = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  videoSrc: string;
  videoPoster: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  detail: string;
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

export const brand = {
  name: "Non Prep Veneer",
  logoFull: "/images/brand/logo-full.svg",
  logoMark: "/images/brand/logo-mark.svg",
  logoAlt: "Non Prep Veneer logo"
};

export const hero: HeroContent = {
  eyebrow: "Non Prep Veneer",
  headline: "Non Prep Veneer, Crafted With Precision",
  subheadline:
    "Ultra-thin ceramic veneers designed for natural light, shape, and balance. Minimal alteration when clinically appropriate.",
  primaryCta: { label: "Get assessed", href: "#assessment" },
  secondaryCta: { label: "See real cases", href: "#cases" },
  videoSrc: "/videos/hero.mp4",
  videoPoster: "/images/hero-poster.svg"
};

export const socialProof = {
  rating: "4.9",
  count: "200+ smiles",
  note: "Real patients, consented."
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "The process felt calm and precise. I finally love my smile in photos.",
    name: "Nadia R.",
    detail: "Designer, 6 veneers"
  },
  {
    quote:
      "I was worried about drilling. The team explained everything and kept it minimal.",
    name: "Hassan M.",
    detail: "Consultation to final in 3 visits"
  },
  {
    quote:
      "Natural shade, no bulk. The final result looks like me, just better.",
    name: "Sara L.",
    detail: "Front 8 veneers"
  }
];

export const product = {
  eyebrow: "What They Are",
  headline: "A conservative veneer option for the right cases",
  body: [
    "Non prep veneers are ultra-thin ceramic shells bonded to the front of teeth. The goal is to enhance shape and shade while preserving natural enamel.",
    "Some cases still need light preparation after the clinical exam. We always prioritize long-term health over shortcuts."
  ],
  bullets: [
    {
      title: "Minimal alteration",
      description: "When possible, we preserve natural enamel and avoid aggressive reshaping."
    },
    {
      title: "Natural translucency",
      description: "Layered ceramics that mimic light reflection for a lifelike finish."
    },
    {
      title: "Smile design preview",
      description: "Digital planning to align expectations before any work begins."
    }
  ],
  media: {
    videoSrc: "/videos/product-loop.mp4",
    poster: "/images/product-media.svg",
    alt: "Non prep veneer design preview"
  }
};

export const eligibility: EligibilityContent = {
  goodFit: [
    "Small gaps or minor spacing",
    "Worn or uneven edges",
    "Mild rotation or alignment concerns",
    "Teeth with healthy enamel",
    "Patients seeking a conservative approach"
  ],
  notIdeal: [
    "Severe crowding or bite issues",
    "Active gum disease or decay",
    "Very dark underlying tooth shade",
    "Heavy grinding without protection",
    "Minimal enamel remaining"
  ],
  note: "Final eligibility after clinical exam."
};

export const steps: Step[] = [
  {
    title: "Consult and scan",
    description:
      "We evaluate your goals, take digital scans, and determine if non prep veneers are possible."
  },
  {
    title: "Design and trial",
    description:
      "We create a digital smile plan and a temporary preview so you can approve the look."
  },
  {
    title: "Bond and refine",
    description:
      "Veneers are bonded with precision, then polished for a natural finish."
  }
];

export const process = {
  timeline: "Typical timeline: 2 to 4 weeks, 2 to 3 visits.",
  visits: [
    "Visit 1: consultation, scan, and smile design",
    "Visit 2: try-in or mockup approval",
    "Visit 3: final bonding and finishing"
  ],
  cta: { label: "Schedule a consult", href: "#contact" }
};

export const beforeAfterFilters = ["Gaps", "Shape", "Shade", "Alignment"];

export const beforeAfterCases: BeforeAfterCase[] = [
  {
    id: "case-gap-1",
    title: "Midline gap closure",
    filters: ["Gaps"],
    beforeImage: "/images/cases/gaps-before.svg",
    afterImage: "/images/cases/gaps-after.svg",
    description: "Closed spacing and softened edges."
  },
  {
    id: "case-gap-2",
    title: "Lateral gap balance",
    filters: ["Gaps"],
    beforeImage: "/images/cases/gaps-before.svg",
    afterImage: "/images/cases/gaps-after.svg",
    description: "Balanced proportions for a cohesive smile."
  },
  {
    id: "case-shape-1",
    title: "Length and symmetry",
    filters: ["Shape"],
    beforeImage: "/images/cases/shape-before.svg",
    afterImage: "/images/cases/shape-after.svg",
    description: "Refined length with natural contouring."
  },
  {
    id: "case-shape-2",
    title: "Edge refinement",
    filters: ["Shape"],
    beforeImage: "/images/cases/shape-before.svg",
    afterImage: "/images/cases/shape-after.svg",
    description: "Smoothed edges with subtle rounding."
  },
  {
    id: "case-shade-1",
    title: "Brightened shade",
    filters: ["Shade"],
    beforeImage: "/images/cases/shade-before.svg",
    afterImage: "/images/cases/shade-after.svg",
    description: "Lifted shade while keeping natural translucency."
  },
  {
    id: "case-align-1",
    title: "Alignment harmony",
    filters: ["Alignment"],
    beforeImage: "/images/cases/alignment-before.svg",
    afterImage: "/images/cases/alignment-after.svg",
    description: "Aligned front teeth for a cleaner line."
  }
];

export const galleryDisclaimer =
  "Results vary. Some cases require light preparation after the clinical exam.";

export const videos: VideoItem[] = [
  {
    id: "reel-1",
    title: "Shape refinement in 2 visits",
    duration: "00:24",
    thumbnail: "/images/reel-1.svg",
    src: "/videos/reel-1.mp4"
  },
  {
    id: "reel-2",
    title: "Shade lift with minimal prep",
    duration: "00:31",
    thumbnail: "/images/reel-2.svg",
    src: "/videos/reel-2.mp4"
  },
  {
    id: "reel-3",
    title: "Smile preview walkthrough",
    duration: "00:18",
    thumbnail: "/images/reel-3.svg",
    src: "/videos/reel-3.mp4"
  },
  {
    id: "reel-4",
    title: "Final polish and finish",
    duration: "00:22",
    thumbnail: "/images/reel-4.svg",
    src: "/videos/reel-4.mp4"
  }
];

export const assessment = {
  eyebrow: "Free Smile Assessment",
  headline: "Free Smile Assessment, coming soon",
  body:
    "Share a clear photo and tell us your goals. We will reply with preliminary guidance before your in-clinic exam.",
  disclaimer:
    "This tool provides preliminary guidance only and does not replace a clinical exam."
};

export const faqs: FaqItem[] = [
  {
    question: "Do non prep veneers damage teeth?",
    answer:
      "When suitable, they preserve enamel and avoid aggressive reshaping. Some cases still require light prep for long-term health."
  },
  {
    question: "How long do they last?",
    answer:
      "With proper care, veneers can last many years. Longevity depends on bite, habits, and maintenance."
  },
  {
    question: "Do veneers stain?",
    answer:
      "Ceramic resists staining, but natural teeth around them can darken. Regular cleanings and good hygiene help maintain color."
  },
  {
    question: "What if I grind my teeth?",
    answer:
      "We may recommend a protective night guard. Grinding can reduce longevity, so we assess this carefully."
  },
  {
    question: "Is any preparation required?",
    answer:
      "Many cases can be done with minimal or no prep, but some require light reshaping for fit and longevity."
  },
  {
    question: "Are non prep veneers reversible?",
    answer:
      "They can be more conservative, but any bonding process should be considered semi-permanent."
  },
  {
    question: "Can veneers be repaired?",
    answer:
      "Minor chips can often be polished or repaired. Major damage may require replacement."
  },
  {
    question: "Will my speech change?",
    answer:
      "Some patients notice a brief adjustment period. Most return to normal speech quickly."
  },
  {
    question: "How do I choose the shade?",
    answer:
      "We use shade mapping and digital previews to select a tone that fits your complexion and goals."
  },
  {
    question: "What happens at the first visit?",
    answer:
      "We examine your teeth, scan your smile, and discuss goals to determine whether non prep veneers are a fit."
  }
];

export const contact: ContactContent = {
  headline: "Ready to refine your smile?",
  subheadline:
    "Book a consultation or send a question on WhatsApp. We respond within one business day.",
  whatsapp: {
    label: "WhatsApp",
    number: "15551234567",
    message: "Hi, I would like a consultation for non prep veneers."
  },
  phone: "+1 (555) 123-4567",
  email: "hello@nonprepveneer.com",
  hours: "Mon to Fri, 9:00 AM to 6:00 PM",
  disclaimer:
    "Medical information on this page is for general guidance only and does not replace a clinical exam.",
  privacyLabel: "Privacy policy (coming soon)"
};

export const navigation = [
  { label: "Process", href: "#process" },
  { label: "Cases", href: "#cases" },
  { label: "Videos", href: "#videos" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" }
];

export const homeContent = {
  brand,
  hero,
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
};
