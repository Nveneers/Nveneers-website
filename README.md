# Non Prep Veneers Landing Page
Premium medical landing page built with Next.js App Router and Tailwind CSS.

## Run Commands
```bash
npm install
npm run dev
```

```bash
npm run build
npm run start
```

```bash
npm run lint
```

## Content Editing
All copy and data live in `src/content/home.ts`.

## Local Font Setup
Place Subjectivity Serif font files in `public/fonts`.
Expected file by default: `public/fonts/SubjectivitySerif-Variable.ttf`.
The current file is a placeholder and should be replaced with the licensed font.
If you use separate weights, update `src/app/layout.tsx` to match the files.

## Media Placeholders
Video files are referenced but not included.
Add the following files to `public/videos`:
`hero.mp4`, `product-loop.mp4`, `reel-1.mp4`, `reel-2.mp4`, `reel-3.mp4`, `reel-4.mp4`.
