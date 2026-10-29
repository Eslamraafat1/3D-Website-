# MONOLITH® — experimental architecture studio site

A fictional studio, built as a portfolio piece. Next.js 16 (App Router, Cache Components), React 19, Tailwind 4, GSAP + ScrollTrigger, Framer Motion, React Three Fiber.

```bash
npm install
npm run dev        # http://localhost:3000  (redirects to /en or /ar)
npm run build && npm start
```

## Routes
`/{en|ar}`, `/work`, `/work/[slug]`, `/studio`, `/approach`, `/journal`, `/journal/[slug]`, `/contact`, plus `sitemap.xml`, `robots.txt`.
`proxy.ts` redirects unprefixed paths to the preferred language.

## Structure
- `lib/data` — typed content (projects, plans, articles, team, materials); every string is `{en, ar}`.
- `lib/services` — async service layer (swap for a CMS/API without touching UI). `inquiry.ts` is a **mock**: nothing is sent anywhere.
- `lib/i18n` — dictionaries and locale helpers.
- `components/art/ArchArt.tsx` — procedural SVG imagery (no remote assets). Replace with `next/image` when real photography exists.
- `components/three/Hero3D.tsx` — the 3D monolith (lazy-loaded, desktop/fine-pointer only; SVG fallback otherwise).

All people, clients, awards and figures are fictional demo content.
