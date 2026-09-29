# Responsive layout verification

Checked the production build in headless Chrome at 375 x 812, 390 x 844, 768 x 1024, and 1440 x 900. Additional overflow checks cover 320 x 568, 844 x 390, 1024 x 768, and 1920 x 1080.

- No horizontal document overflow, clipped text, broken images, or page runtime errors at the requested widths.
- Inspected screenshots of the hero, collection, product cards, craft, all four ingredients, story, final CTA, and footer.
- Navigation opens without moving the page, closes on selection and Escape, restores focus on Escape, and resets when resized through the desktop breakpoint.
- Section anchors clear the sticky header. The menu remains scrollable within a short landscape viewport.
- Every tasting-note disclosure opens and closes without horizontal overflow.
- Checked animated scrolling, reduced motion, and a no-JavaScript mobile hero fallback. The fallback image clears the heading.
- Production build (including TypeScript) and ESLint pass.

The desktop composition remains intact. Mobile/tablet layouts stack through 900px, with readable copy, proportional images, reduced excess spacing, and larger navigation/link targets. Content can grow vertically rather than being clipped to a fixed screen height.

## Reproduce

Set PLAYWRIGHT_PATH to a local Playwright package directory and TEST_URL to the running site (defaults to http://localhost:3000), then run:

```text
node docs/check-responsive.mjs
node docs/check-responsive-fallback.mjs
```

Screenshots and measured results are in previews/responsive/. These checks use Chromium emulation, not physical iOS or Android devices.
