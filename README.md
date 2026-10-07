# Demir Digital

Obsidian, titanium and electric-blue creative agency website. Next.js static export, React / TypeScript, Three.js, GSAP ScrollTrigger and Lenis. Nine pages include home, projects, four concept case studies, services, studio and contact.

## Develop

Node.js 22+ and Python 3 are required for the packaging / static preview helpers.

```sh
npm ci --no-audit --no-fund
npm run dev
```

Development runs on port 3000 with webpack. Production:

```sh
npm run build
npm run preview
npm test
npm run package
```

Production preview is port 4173; tests use installed Chromium at `/usr/bin/chromium`. Override the test URL with `TEST_URL`. `npm run typecheck` checks TypeScript. Deploy the contents of `out/` to a static host supporting directory `index.html` files. The deployment archive is `downloads/demir-digital-site.zip`; unzip into your hosting `public_html` directory. Opening exported HTML directly with file:// does not support Next.js navigation.

## GitHub Pages

`npm run build:pages` builds with `/s` as base path and copies the result into `docs/`. Pages source: branch `main`, directory `/docs`. `docs/.nojekyll` preserves `_next` assets. Rebuild after changing source. The root-host deployment ZIP is built separately without this base path.

## Brand and contact configuration

Edit `lib/site.ts`: set the verified contact email and social profiles. `site.logo` is deliberately null because the official metallic D/arrow logo was not uploaded. Add the original SVG or transparent PNG under `public/` and set its path; do not redraw the supplied brand mark. Until then the header uses the agency name as text. The 3D sculpture is a design study, not an official logo.

The contact form validates seven fields and prepares an email plus a downloadable text brief. Sending happens in the visitor’s email application; there is no backend or automatic delivery. The current email is a brief placeholder and must be verified before commercial launch.

Portfolio images and showreel are original concept visualizations. Limon Café, Seyban Performance and Ciğer Tarım studies are explicitly labeled concepts; no client engagement or business result is claimed. Asset provenance: `public/media/CREDITS.md`.

Keyboard-accessible navigation, reduced-motion handling, mobile horizontal exhibition scrolling and a non-WebGL fallback are included. No analytics or remote image/font service is required.
