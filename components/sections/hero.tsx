import { CakeVisual } from "@/components/ui/cake-visual";
import { ButtonLink, Eyebrow, TextLink } from "@/components/ui/primitives";

export function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <Eyebrow>
          <span className="tiny-star" aria-hidden="true">
            ✳
          </span>{" "}
          The art of a darker indulgence
        </Eyebrow>
        <h1 id="hero-title">
          <span className="motion-line"><span>Life deserves a little</span></span>
          <span className="motion-line"><span><em>more</em> chocolate.</span></span>
        </h1>
      </div>
      <CakeVisual />
      <div className="hero-support">
        <p className="hero-description">
          Deeply chocolate. Beautifully unhurried.
          <br className="desktop-break" /> Cakes for the grand occasions—and the
          quietly wonderful ones.
        </p>
        <div className="hero-actions">
          <ButtonLink href="#collection">Explore our cakes</ButtonLink>
          <TextLink href="#story">Meet Miette Noire</TextLink>
        </div>
        <div className="hero-footnote">
          <span className="little-line" />
          <span>Thoughtfully composed. Joyfully shared.</span>
        </div>
      </div>
      <div className="hero-bottom">
        <span>GOOD THINGS TAKE THEIR TIME.</span>
        <a href="#collection">
          A taste of what awaits<span aria-hidden="true">↓</span>
        </a>
        <span>AND A LITTLE CHOCOLATE.</span>
      </div>
    </section>
  );
}
