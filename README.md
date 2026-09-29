# Miette Noire

An original premium chocolate cake experience built with Next.js App Router, React, TypeScript, Three.js, GSAP, and Lenis.

## Local development and production

Use Node.js 24.x and npm 11.x. Install the locked dependencies with `npm ci`.

```sh
npm run dev
```

For production validation:

```sh
npm run typecheck
npm run lint
npm run build
npm run start
```

`start` runs the standard `next start` server and requires a successful build first. Stop the development server before starting production on the default port (3000), or use `npm run start -- --port 3100` for a separate port. The optional standard `PORT` environment variable also controls the local server port.

## Vercel deployment settings

- Framework preset: **Next.js**.
- Root directory: this project directory, containing `package.json`.
- Node.js: **24.x**, matching `engines.node`.
- Install command: `npm ci`.
- Build command: `npm run build`.
- Output directory: leave at the Next.js preset default.
- Required application environment variables: **none**.

No custom server, `vercel.json`, external local files, writable runtime filesystem, database, or API credentials are required. Vercel serves the Next.js build directly; a custom production start command is unnecessary. Fonts are downloaded by `next/font/google` at build time and served with the application afterward; the build needs network access to Google Fonts and the npm registry for installation.

References: [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs) and [supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

## Application structure

- `app/page.tsx`: landing-page composition and keyboard skip link.
- `app/layout.tsx`: metadata, fonts, and the client motion controller.
- `components/sections/`: existing hero, signature collection, ingredient/craft chapters, brand story, and final CTA.
- `components/three/`: dynamically loaded client-only cake scene, procedural geometry, materials, lighting, and static fallback.
- `components/motion/`: GSAP/ScrollTrigger choreography and Lenis integration using one shared ticker.
- `components/layout/` and `components/ui/`: navigation, footer, reusable typography, links, and product presentation.
- `public/images/`: original WebP assets, referenced with root-relative `/images/` paths.
- `docs/`: art direction and verification records; retained as project documentation.

The hero uses a capped Canvas DPR, compact mobile geometry and fragments, and reduced-motion support. Essential content remains semantic HTML outside WebGL. Native navigation, visible focus, and tasting-note disclosures are preserved.

Cake names and recipe/allergen notes remain concept content. Ordering, payments, inventory, and fulfillment are outside this project; calls to action navigate the collection.
