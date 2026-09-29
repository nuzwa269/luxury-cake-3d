import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { SignatureCakes } from "@/components/sections/signature-cakes";
import { Craftsmanship } from "@/components/sections/craftsmanship";
import { BrandStory } from "@/components/sections/brand-story";
import { FinalCta } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <SignatureCakes />
        <Craftsmanship />
        <BrandStory />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
