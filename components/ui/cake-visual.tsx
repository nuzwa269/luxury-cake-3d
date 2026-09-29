import { CakeSceneLoader } from "@/components/three/CakeSceneLoader";

/** This figure retains the Stage 2 dimensions while the client-only scene loads. */
export function CakeVisual() {
  return (
    <figure className="cake-visual" aria-label="Our signature chocolate cake">
      <div className="scene-slot" data-scene-slot="hero">
        <CakeSceneLoader />
      </div>
      <div className="hero-aura" aria-hidden="true" />
      <span className="visual-edition eyebrow">
        The signature collection — No. 01
      </span>
      <span className="visual-seal" aria-hidden="true">
        <span>MADE TO</span>
        <i>be savoured</i>
        <span>NOT RUSHED</span>
      </span>
      <figcaption>
        <span>Le Noire</span>
        <span>Dark chocolate. Pure devotion.</span>
      </figcaption>
    </figure>
  );
}
