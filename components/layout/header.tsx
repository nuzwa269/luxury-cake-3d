"use client";

import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/primitives";

const links = [
  { href: "#collection", label: "Our cakes" },
  { href: "#craft", label: "The craft" },
  { href: "#story", label: "Our story" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <div className="nav-shell">
        <a className="wordmark" href="#home" onClick={() => setOpen(false)} aria-label="Miette Noire home">
          miette noire<span>CHOCOLATE, CONSIDERED.</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="#collection">
          Find your indulgence
          <Arrow diagonal />
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span
            className={`menu-lines ${open ? "is-open" : ""}`}
            aria-hidden="true"
          >
            <i />
            <i />
          </span>
        </button>
      </div>
      <nav
        id="mobile-nav"
        className="mobile-nav"
        data-lenis-prevent
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {links.map((link, i) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            <span className="eyebrow">0{i + 1}</span>
            {link.label}
            <Arrow diagonal />
          </a>
        ))}
        <p>For the love of a little indulgence.</p>
      </nav>
    </header>
  );
}
