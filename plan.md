App
Non Prep Veneers product landing page plus Smile Assessment tool.

Primary goal
Drive qualified leads to WhatsApp and consultation. Provide proof, eligibility guidance, and a simple assessment entry point.

Brand
- Colors
  - Teal #003b4f
  - Gold #cda349
  - White #ffffff
- Font
  - Subjectivity Serif
- Tone
  - Premium, medical, calm
- UI rules
  - White background dominant
  - Gold only for CTA and small accents
  - Minimal motion
  - Clean spacing, one idea per section

Pages
- /
  - Single homepage composed from modular sections

Section order
1. Hero video section
2. Social proof strip
3. Product explanation split
4. Who this is for
5. 3-step process and timeline
6. Before and after cases gallery with sliders and filters
7. Video proof section
8. Smile assessment tool
9. FAQ accordion
10. Contact and final CTA

Phase 1 scope
Frontend-only.
- Build all homepage sections
- Build assessment tool placeholder section
- Content stored in src/content/home.ts
- Each section in its own file under src/components/sections
- One Homepage composer component imports sections in order
- Accessibility and responsiveness included

Phase 1 deliverables
- Next.js App Router project with TypeScript and Tailwind
- Modular section components
- Custom image compare slider
- Video modal
- Sticky header CTA and mobile sticky action bar
- plan.md and README

Phase 2 scope
Build Smile Assessment tool.
- Multi-step form inside assessment section
- Image upload with preview and guidance
- Server validates file type and size
- Server strips metadata and normalizes image
- Image stored in external storage with expiring or signed link
- WhatsApp deep link sends prefilled message with image link
- Rate limit per IP
- Bot protection with Turnstile
- Privacy copy and link expiry policy

Phase 2 deliverables
- /api/assessment endpoint
- Storage integration
- Rate limiting
- Turnstile verification
- Tool UI components
- Updated plan.md

Architecture
- src/app/page.tsx
  - renders src/components/Homepage.tsx

- src/components/Homepage.tsx
  - imports section components in order

- src/components/sections/*
  - one file per section

- src/components/ui/*
  - ImageCompare, VideoModal, Accordion, Buttons

- src/components/assessment/*
  - tool step components

- src/content/home.ts
  - all copy and arrays for:
    - hero
    - testimonials
    - eligibility
    - steps
    - cases
    - videos
    - faqs
    - contact

- src/lib/*
  - validators, storage, rateLimit, turnstile

Non-functional requirements
- Performance
  - Lazy load below the fold
  - Use next/image
  - Avoid heavy libraries
- Accessibility
  - Keyboard support for sliders and modals
  - Visible focus rings
  - Proper aria labels
- SEO
  - Metadata, OpenGraph, Twitter cards
  - Structured headings
- Analytics placeholder
  - Provide a simple hook point for later

Content notes
- Include a short disclaimer near galleries and tool:
  - Results vary
  - Some cases need light preparation after exam
  - Tool gives preliminary guidance only

WhatsApp flow
- Phase 1
  - Buttons open WhatsApp with a generic prefilled message, no attachment
- Phase 2
  - User uploads image, server returns secure link
  - WhatsApp opens with message containing secure link

Deployment
- Vercel for hosting
- Env vars stored in Vercel project settings for phase 2
