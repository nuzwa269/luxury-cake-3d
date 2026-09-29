# Stage 2 verification

- TypeScript: passed (`npm run typecheck`).
- ESLint: passed with zero warnings (`npm run lint`).
- Production build: passed (`npm run build`); landing page and icon statically prerendered.
- Headless Microsoft Edge responsive checks: 360, 390, 600, 768, 1024, 1440, and 1920 CSS pixels.
- No document horizontal overflow at any tested width.
- All images decoded successfully, all section anchors existed, one h1, and zero Canvas elements.
- Mobile navigation opened, closed with Escape with focus restored, and closed on section selection.
- Product tasting notes expanded and collapsed.
- Keyboard skip link moved focus to main content.
- Reduced-motion preference disabled smooth scrolling.
- axe-core WCAG 2 A/AA and WCAG 2.1 AA scans at 360, 768, and 1440px: zero detected violations after contrast correction.
- Production bundle rechecked at 360 and 1440px: no browser console errors, page errors, failed image loads, hydration errors, or automated accessibility violations.
- Desktop and mobile full-page previews are in `docs/previews/`.

Automated accessibility checks supplement the keyboard and screenshot review; they are not a complete accessibility certification.
