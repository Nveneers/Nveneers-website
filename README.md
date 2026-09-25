# Nveneer website
Bilingual dental website built with Next.js App Router and Tailwind CSS.

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
All copy and data live in `src/content/home/`.

## Brand and themes
Semantic colors live in `src/app/globals.css` and are shared with Tailwind.
Light mode is the default. The header toggle persists the visitor's choice under
`nveneer-theme`; an inline head script restores it before paint. Storage failures
leave the control working for the current visit.

`BrandLogo` selects the light/dark vector wordmark. `BrandWave` supplies the
cyan-to-blue ribbon. The outlined logo assets in `public/images/brand` are
extracted from page 3 of the supplied identity PDF. To regenerate them with
Python and pypdf, run `python scripts/extract-brand-assets.py "path/to/n-veneer-pre new.pdf"`.

`src/app/layout.tsx` loads local PP Formula Light 300, Medium 500, and Extrabold
800, plus Ping AR+LT Regular 400 and Medium 500. The Narrow variant is excluded.
The supplied font folders contained no license documents; the client should
retain their website embedding permission. See the
[PP Formula EULA](https://pangrampangram.com/pages/eula) and
[Ping licensing terms](https://tptq-arabic.com/licensing).

Existing clinical content, patient imagery, and video files are retained.
Any old logos embedded in the videos remain pending replacement footage.

## Rebrand verification
Run `npm run test:branding`, `npx tsc --noEmit`, and `npm run build`.
The focused tests cover pre-paint theme selection, unavailable browser storage,
WCAG normal-text contrast for the semantic palettes, and assessment success,
upload validation, and retry states with synthetic data and mocked APIs.

For assessment UI testing without submissions, start Next on port 4013
(`npx next dev -p 4013`) and run `npm run preview:mock` in a second terminal.
Open `http://127.0.0.1:4015/en#assessment` or the Arabic equivalent. Every API
request is intercepted locally; no form writes are forwarded or stored. Type
`success`, `reject`, `busy`, or `error` in the mock server terminal to change its
validation response. Use synthetic images and dummy contact details only.
