import { ProductCard, type Cake } from "@/components/ui/product-card";
import { Eyebrow } from "@/components/ui/primitives";

const cakes: Cake[] = [
  {
    number: "01 / THE ICON",
    name: "Le Noire",
    description: "Dark chocolate ganache · Cocoa sponge",
    image: "/images/signature-noire.webp",
    alt: "Le Noire chocolate cake with chocolate curls and a cutaway showing its layers",
    note: "Our signature",
    tasting:
      "An unapologetically dark cocoa sponge, wrapped in silky ganache. Rich at first, delicately bittersweet at the finish.",
    allergens: "wheat, eggs, and milk",
  },
  {
    number: "02 / THE SOFT SIDE",
    name: "Noisette Velvet",
    description: "Milk chocolate mousse · Toasted hazelnut",
    image: "/images/noisette-velvet.webp",
    alt: "Milk chocolate hazelnut cake with piped mousse and toasted hazelnuts",
    note: "Soft & nutty",
    tasting:
      "Cloud-soft milk chocolate meets the warm, roasted depth of hazelnut. A little crunch, a long and mellow finish.",
    allergens: "wheat, eggs, milk, and hazelnuts",
  },
  {
    number: "03 / THE GOLDEN HOUR",
    name: "Caramel Minuit",
    description: "Dark cocoa · Salted caramel · Fleur de sel",
    image: "/images/caramel-minuit.webp",
    alt: "Dark chocolate cake finished with glossy caramel and delicate chocolate curls",
    note: "Sweet meets salt",
    tasting:
      "Deep cocoa layers with a ribbon of buttery caramel. A delicate pinch of sea salt brings every note into focus.",
    allergens: "wheat, eggs, and milk",
  },
];

export function SignatureCakes() {
  return (
    <section
      id="collection"
      className="collection section-pad"
      aria-labelledby="collection-title"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <Eyebrow>01 — The collection</Eyebrow>
            <h2 id="collection-title">
              A signature in <em>every slice.</em>
            </h2>
          </div>
          <p>
            Three expressions of chocolate.
            <br />
            One rather delicious obsession.
          </p>
        </div>
        <div className="product-grid">
          {cakes.map((cake) => (
            <ProductCard key={cake.name} cake={cake} />
          ))}
        </div>
        <p className="collection-note">
          <span aria-hidden="true">✳</span> A collection to linger over. Find
          the flavour that feels like you.
        </p>
      </div>
    </section>
  );
}
