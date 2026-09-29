# Animation integration verification

The existing sections, assets, animation durations, and 3D scene were preserved. No dependencies were added.

## Actual fixes

- The `.motion-line` wrappers and their children had no CSS. Their inline children could not visibly translate, and the intended heading line breaks collapsed. Added block formatting and clipping for the existing hero, story, and CTA reveal timelines.
- The final CTA entrance and magnetic hover both wrote the button's transform. Moved the entrance to a wrapper so the button retains independent hover motion.
- This installed Lenis version leaves its native-scroll velocity timer pending during `destroy()`. Switching to reduced motion during native scrolling could restore Lenis classes after cleanup. Calling `stop()` before `destroy()` resets the scrolling state and prevents that race.
- The animated hero aura could extend outside the cake figure and create horizontal overflow on mobile. Clipped the animation at the existing figure boundary.

## Verification

- `npm run typecheck`, `npm run lint`, and `npm run build` passed.
- Tested locally in Chrome against the production build at `http://localhost:3001`.
- Sampled the actual Three.js cake, camera, and fragment transforms across idle time, mouse movement, and scrolling. The existing GSAP-driven render loop works; its seconds-based renderer timestamps and milliseconds-based Lenis timestamps are correct.
- Captured and visually reviewed the hero entrance, product reveals, ingredient transitions, story reveal, and final CTA before and after animation.
- Checked live reduced-motion switching, a fresh reduced-motion page load, pause/resume, Lenis scroll interpolation, and mobile overflow.
- Client-only scene loading and the existing selectors work. Ingredient image scales are preserved by GSAP; their CSS transforms did not need replacement.

`docs/check-animations.mjs` uses an already-installed Playwright package supplied through `PLAYWRIGHT_PATH`, with optional `TEST_URL`. Screenshots and measurements are saved under `docs/previews/animation-*`.
