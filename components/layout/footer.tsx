import { Arrow, Monogram } from "@/components/ui/primitives";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <a href="#home" className="footer-wordmark">
              miette noire
            </a>
            <p>A little darker. A little extraordinary.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#collection">Our cakes</a>
            <a href="#craft">Our ingredients</a>
            <a href="#story">Our story</a>
          </nav>
          <Monogram />
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Miette Noire</p>
          <span>Made for the moments that matter.</span>
          <a href="#home">
            Back to top
            <Arrow className="arrow-up" />
          </a>
        </div>
      </div>
    </footer>
  );
}
