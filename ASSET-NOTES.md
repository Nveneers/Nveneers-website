# September 2026 design update — asset notes

## Integrated

- `public/fonts/PingARLT-*.otf`: all seven supplied Ping weights from `Downloads/assets`. Regular and Medium are byte-identical to the existing files; the additional weights are now registered, and Arabic headings use the supplied Bold.
- `public/images/brand/smile-detail.webp`: original `/Im1` photograph extracted from page 8 of `n-veneer-pre new 2.pdf`, exported to WebP. Retained as a brand asset; the product explanation now uses three generated educational visuals.
- `public/images/veneers/*.webp`: four educational images for enamel preservation, translucency, smile planning, and the porcelain macro. Overlays are translated HTML. These are illustrations, not product photographs or patient outcomes. See `docs/veneer-imagery.md` for prompts and numerical sourcing.
- Existing case photographs remain unchanged. `src/content/home/cases.ts` records the before/after crop bounds for the five supplied stacked photographs; `ImageCompare` clips full-width views so dragging does not resize the photographs. Unconfigured new photos retain a static fallback.

## Needed to finish the reference concept

- The October 2026 hero uses the supplied `C1065.MP4` portrait. The original explanatory player and its English/Arabic media are retained but not mounted on the homepage.
- The requested generated porcelain macro now illustrates the “What are N Veneers?” section. An actual product photograph can replace it later if available.
- Licensed PP Formula files if retaining the brand deck’s English/Arabic font pairing. The supplied OTF files are Ping only; the existing PP Formula files have not been replaced.

For video handoff, provide the original blue-screen recordings, or an edited ProRes 4444 MOV with an alpha channel. The MOV extension alone does not guarantee transparency. Keep the whole face in frame, avoid burned-in text, and include a still poster. Web delivery exports should be produced from the originals after reviewing the footage.

Video transparency reference: https://developer.apple.com/videos/play/wwdc2019/506/

## October 2026 portrait hero

- Source: user-supplied `Downloads/C1065.MP4` (kept outside the repository/public assets).
- Both exports use 00:00.5–00:20.5, baked upright rotation, square pixels, H.264/yuv420p, 25 fps, no audio, and MP4 fast-start. FFmpeg's automatic rotation is applied before cropping. The camera's BT.2020/HLG footage is tone-mapped to BT.709 SDR so video and poster colors agree across browsers.
- Desktop: `crop=1080:1080:0:240,scale=960:960,setsar=1,fps=25`; libx264 slow, CRF 25, maxrate 1500k, bufsize 3000k. Output: `public/videos/portrait-hero-desktop.mp4`.
- Mobile: `crop=1080:1728:0:192,scale=640:1024,setsar=1,fps=25`; libx264 slow, CRF 27, maxrate 800k, bufsize 1600k. Output: `public/videos/portrait-hero-mobile.mp4`.
- Matching WebP posters are taken at second 4 of each export, quality 80. The hero uses the same blue backdrop in both themes; CSS handles the edge blend and Arabic placement without flipping the footage.
- After each crop/scale/fps filter, the color conversion is `zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=mobius:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p`, with output color space, primaries and transfer all explicitly tagged `bt709`.
