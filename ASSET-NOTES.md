# September 2026 design update — asset notes

## Integrated

- `public/fonts/PingARLT-*.otf`: all seven supplied Ping weights from `Downloads/assets`. Regular and Medium are byte-identical to the existing files; the additional weights are now registered, and Arabic headings use the supplied Bold.
- `public/images/brand/smile-detail.webp`: original `/Im1` photograph extracted from page 8 of `n-veneer-pre new 2.pdf`, exported to WebP. Retained as a brand asset; the product explanation now uses three generated educational visuals.
- `public/images/veneers/*.webp`: four educational images for enamel preservation, translucency, smile planning, and the porcelain macro. Overlays are translated HTML. These are illustrations, not product photographs or patient outcomes. See `docs/veneer-imagery.md` for prompts and numerical sourcing.
- Existing case photographs remain unchanged. `src/content/home/cases.ts` records the before/after crop bounds for the five supplied stacked photographs; `ImageCompare` clips full-width views so dragging does not resize the photographs. Unconfigured new photos retain a static fallback.

## Needed to finish the reference concept

- Male and female full-face smiling recordings. The refreshed hero currently retains the existing explanatory videos. The new recordings were not included in the supplied asset folder or embedded in the PDF.
- The requested generated porcelain macro now illustrates the “What are N Veneers?” section. An actual product photograph can replace it later if available.
- Licensed PP Formula files if retaining the brand deck’s English/Arabic font pairing. The supplied OTF files are Ping only; the existing PP Formula files have not been replaced.

For video handoff, provide the original blue-screen recordings, or an edited ProRes 4444 MOV with an alpha channel. The MOV extension alone does not guarantee transparency. Keep the whole face in frame, avoid burned-in text, and include a still poster. Web delivery exports should be produced from the originals after reviewing the footage.

Video transparency reference: https://developer.apple.com/videos/play/wwdc2019/506/
