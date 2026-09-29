import Image from "next/image";
import { Eyebrow, TextLink } from "@/components/ui/primitives";

export function Craftsmanship() {
  return (
    <section id="craft" className="craft-section" aria-labelledby="craft-title">
      <div className="container craft-grid">
        <div className="craft-visual">
          <div className="craft-image">
            <Image
              src="/images/signature-noire.webp"
              alt="A close look at the cake's hand-finished ganache, fine chocolate curls, and tender cocoa layers"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <span className="craft-caption eyebrow">
            A study in chocolate & texture
          </span>
          <span className="craft-mark" aria-hidden="true">
            The
            <br />
            <em>finer</em>
            <br />
            details.
          </span>
        </div>
        <div className="craft-copy">
          <Eyebrow>02 — Nothing without intention</Eyebrow>
          <h2 id="craft-title">
            Simple ingredients.
            <br />
            <em>Extraordinary</em>
            <br />
            attention.
          </h2>
          <p>
            There is no secret to a memorable cake. Just good chocolate, a
            patient hand, and the belief that every small detail deserves to be
            delicious.
          </p>
          <TextLink href="#story">The philosophy behind the flavour</TextLink>
        </div>
      </div>
      <div className="ingredient-sequence" aria-label="The layers of flavour">
        {[
          { name: "Cocoa", note: "The depth", copy: "It begins with a darker note. Cocoa-rich sponge, tender enough to yield to the lightest fork.", image: "signature-noire", className: "cocoa", detail: "Close detail of dark cocoa sponge and chocolate layers" },
          { name: "Hazelnut", note: "The warmth", copy: "Toasted, golden, quietly fragrant. A little crunch to interrupt all that softness.", image: "noisette-velvet", className: "hazelnut", detail: "Toasted hazelnuts nestled in milk chocolate mousse" },
          { name: "Cream", note: "The softness", copy: "A softer note between the layers. Smooth mousse that lets the chocolate linger.", image: "noisette-velvet", className: "cream", detail: "Silken piped mousse on the Noisette Velvet cake" },
          { name: "Glaze", note: "The finish", copy: "One final sweep of chocolate. A silken finish that catches the light before the first slice.", image: "signature-noire", className: "glaze", detail: "Glossy hand-finished chocolate ganache" },
        ].map((ingredient, index) => (
          <article className={`ingredient-chapter ingredient-${ingredient.className}`} key={ingredient.name}>
            <div className="ingredient-macro">
              <Image src={`/images/${ingredient.image}.webp`} alt={ingredient.detail} fill sizes="(max-width: 900px) 100vw, 55vw" />
            </div>
            <div className="ingredient-copy">
              <p className="eyebrow">0{index + 1} / {ingredient.note}</p>
              <h3>{ingredient.name}<span aria-hidden="true">.</span></h3>
              <p>{ingredient.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
