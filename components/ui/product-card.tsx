import Image from "next/image";
import { Arrow } from "@/components/ui/primitives";

export type Cake = {
  number: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  note: string;
  tasting: string;
  allergens: string;
};

export function ProductCard({ cake }: { cake: Cake }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <div className="product-image-inner">
        <Image
          src={cake.image}
          alt={cake.alt}
          fill
          sizes="(max-width: 900px) 100vw, 65vw"
        />
        </div>
        <span className="product-number eyebrow">{cake.number}</span>
        <span className="product-note">{cake.note}</span>
      </div>
      <div className="product-copy">
      <p className="eyebrow product-kicker">{cake.number}</p>
      <div className="product-title">
        <h3>{cake.name}</h3>
        <span className="product-size">6-inch cake</span>
      </div>
      <p className="product-description">{cake.description}</p>
      <p className="product-tasting">{cake.tasting}</p>
      <details className="product-details">
        <summary>
          Tasting notes
          <Arrow diagonal />
        </summary>
        <div>
          <p>{cake.tasting}</p>
          <p className="allergens">Serves 6–8 · Contains {cake.allergens}.</p>
        </div>
      </details>
      </div>
    </article>
  );
}
