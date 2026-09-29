# Immersive experience verification

Preserves the existing Miette Noire sections, product data, images, and client-only 3D hero. No deployment performed.

- Hero choreography: 25-degree desktop rotation (12 degrees on compact devices), restrained camera approach, outward fragments, cream-to-cocoa color progression, and upward text movement with contrast-preserving fade.
- One GSAP ticker drives Lenis (`autoRaf: false`); native touch and anchor navigation remain enabled. Compact WebGL invalidation uses the same ticker at a maximum of 30 updates per second. Offscreen scene motion pauses.
- Editorial collection, four full-width ingredient chapters, asymmetric brand story, and a scroll-driven cocoa gradient at the final CTA.
- Desktop-only magnetic buttons and image parallax; reduced motion disables scroll animation and Lenis and leaves the hero static.
- TypeScript, ESLint, and production build pass.
- Production Chrome checks at 1440, 768, 390, and 360 CSS pixels: no console errors, hydration errors, runtime exceptions, WebGL errors/context loss, or horizontal overflow.
- Automated axe WCAG 2 A/AA and WCAG 2.1 AA checks: zero violations at every tested size and in reduced-motion mode. Keyboard skip link, menu Escape/focus, disclosure activation, and visible focus passed.
- Wheel scrolling interpolated across 28 intermediate frames, remained monotonic, and settled at its requested distance. Native anchor links retained the header offset. Live reduced-motion changes cleaned up Lenis.
- Existing dependency warnings remain: Three.js Clock deprecation; platform shader precision warnings on desktop. Neither prevented rendering.

Temporary browser scripts and screenshots were removed during deployment preparation; this document preserves the findings. Mobile testing uses Chrome device emulation, not physical devices. Automated accessibility checks supplement keyboard and visual review.
