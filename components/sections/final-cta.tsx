import { ButtonLink, Eyebrow } from "@/components/ui/primitives";

export function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="cta-title">
      <div className="cta-glow" aria-hidden="true" />
      <div className="cta-orbit" aria-hidden="true" />
      <div className="container">
        <Eyebrow>A little moment. A lasting memory.</Eyebrow>
        <h2 id="cta-title">
          <span className="motion-line"><span>There’s always</span></span>
          <span className="motion-line"><span>a reason for <em>cake.</em></span></span>
        </h2>
        <div className="cta-action">
          <ButtonLink href="#collection" light>
            Choose Your Cake
          </ButtonLink>
        </div>
        <p>For someone you love. Yourself included.</p>
      </div>
    </section>
  );
}
