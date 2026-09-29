import { Eyebrow, Monogram, TextLink } from "@/components/ui/primitives";
import Image from "next/image";

export function BrandStory() {
  return (
    <section
      id="story"
      className="story-section section-pad"
      aria-labelledby="story-title"
    >
      <div className="container story-grid">
        <div className="story-aside">
          <Eyebrow>03 — A small piece of our world</Eyebrow>
          <figure className="story-portrait">
            <Image src="/images/caramel-minuit.webp" alt="Caramel Minuit, composed for a moment worth sharing" fill sizes="(max-width: 900px) 90vw, 38vw" />
            <Monogram />
            <figcaption>A little more depth.</figcaption>
          </figure>
          <span className="story-aside-note">
            A love letter
            <br />
            to the last crumb.
          </span>
        </div>
        <div className="story-copy">
          <h2 id="story-title">
            <span className="motion-line"><span>Not just for</span></span>
            <span className="motion-line"><span>the <em>big occasions.</em></span></span>
            <span className="motion-line"><span>For the feeling.</span></span>
          </h2>
          <div className="story-text">
            <p>
              Miette means crumb. Noire is our darker side. Together, they
              capture what we love most: the smallest pleasures, with a little
              more depth.
            </p>
            <p>
              We believe a cake can turn a table into a gathering. An ordinary
              afternoon into a memory. You don’t always need a reason.
              Sometimes, wanting a slice is reason enough.
            </p>
          </div>
          <TextLink href="#collection">
            Make an ordinary day extraordinary
          </TextLink>
        </div>
      </div>
    </section>
  );
}
