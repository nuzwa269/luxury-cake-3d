"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { heroProgress } from "./hero-progress";

export function ExperienceMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ all: "(min-width: 0px)", desktop: "(min-width: 901px) and (hover: hover) and (pointer: fine)", reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { desktop, reduce } = context.conditions!;
      if (reduce) return;
      const lenis = new Lenis({ autoRaf: false, smoothWheel: !!desktop, syncTouch: false, lerp: 0.12, anchors: false });
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      const cleanups: (() => void)[] = [];
      const distance = desktop ? 76 : 34;

      // Entrances use separate children from scroll transforms and hover targets.
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-copy > .eyebrow", { y: 20, opacity: 0, duration: 0.8 }, 0.05)
        .from(".hero-copy .motion-line > span", { yPercent: 115, rotation: 3, duration: 1.3, stagger: 0.16 }, 0.12)
        .from(".hero-description", { y: 28, opacity: 0, duration: 0.9 }, 0.55)
        .from(".hero-actions", { y: 34, opacity: 0, duration: 0.9, clearProps: "transform,opacity" }, 0.82)
        .from(".hero-footnote", { y: 20, opacity: 0, duration: 0.8 }, 1.02);
      gsap.to(heroProgress, { value: 1, ease: "none", scrollTrigger: {
        trigger: ".hero", start: "top top", endTrigger: ".cake-visual", end: "bottom 30%", scrub: 0.75,
      } });
      gsap.to(".hero-copy h1", { y: desktop ? -40 : 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.7 } });
      gsap.to(".hero .cake-visual", { y: desktop ? -85 : 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.7 } });
      // Fade the heading as it leaves the viewport; actions keep full contrast.
      gsap.to(".hero-copy h1", { opacity: 0, ease: "none", scrollTrigger: { trigger: ".hero-copy h1", start: "bottom 28%", end: "bottom top", scrub: 0.5 } });
      gsap.to(".hero", { backgroundColor: "#dbc4a8", ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".cake-visual", { "--scene-caption": "#fff1df", ease: "none", scrollTrigger: { trigger: ".cake-visual", start: "top top", end: "bottom 30%", scrub: true } });

      // Ambient motion pauses offscreen, in hidden tabs, and with the existing pause button.
      const ambient: { animation: gsap.core.Tween; visible: boolean }[] = [];
      let paused = document.querySelector(".scene-motion-toggle")?.getAttribute("aria-pressed") === "true";
      const syncAmbient = () => ambient.forEach(item => item.animation.paused(paused || document.hidden || !item.visible));
      const addAmbient = (target: string, trigger: string, vars: gsap.TweenVars) => {
        const item = { animation: gsap.to(target, { ...vars, repeat: -1, yoyo: true, ease: "sine.inOut", paused: true }), visible: false };
        ambient.push(item);
        ScrollTrigger.create({ trigger, start: "top bottom", end: "bottom top", onToggle: self => { item.visible = self.isActive; syncAmbient(); }, onRefresh: self => { item.visible = self.isActive; syncAmbient(); } });
      };
      addAmbient(".hero-aura", ".hero", { xPercent: 14, yPercent: -8, rotation: 14, scale: 1.13, duration: 7 });
      addAmbient(".cta-glow", ".final-cta", { xPercent: 16, yPercent: -8, rotation: 22, scale: 1.18, duration: 8 });
      addAmbient(".cta-orbit", ".final-cta", { rotation: -12, scale: 1.07, duration: 9 });
      const onPause = (event: Event) => { paused = (event as CustomEvent<boolean>).detail; syncAmbient(); };
      window.addEventListener("miette:motion-pause", onPause);
      document.addEventListener("visibilitychange", syncAmbient);
      cleanups.push(() => { window.removeEventListener("miette:motion-pause", onPause); document.removeEventListener("visibilitychange", syncAmbient); });

      const entrance = (element: Element, start = "top 86%") => {
        const timeline = gsap.timeline({ defaults: { duration: 1.15, ease: "power3.out" }, scrollTrigger: { trigger: element, start, once: true } });
        const focus = () => timeline.progress(1);
        element.addEventListener("focusin", focus);
        cleanups.push(() => element.removeEventListener("focusin", focus));
        return timeline;
      };
      const heading = document.querySelector(".section-heading")!;
      entrance(heading).from(heading.querySelectorAll(".eyebrow, h2, :scope > p"), { y: distance, clipPath: "inset(0 0 100% 0)", stagger: 0.14, clearProps: "transform,clipPath" });
      gsap.utils.toArray<HTMLElement>(".product-card").forEach((card, index) => {
        const image = card.querySelector(".product-image")!;
        const copy = card.querySelector(".product-copy")!;
        entrance(card).from(image, { y: distance, scale: 0.92, clipPath: "inset(12% 6% 12% 6%)", clearProps: "transform,clipPath" }, 0)
          .from(copy.children, { y: desktop ? 50 : 26, opacity: 0, stagger: 0.11, clearProps: "transform,opacity" }, 0.18);
        gsap.fromTo(card.querySelector(".product-image-inner"), { yPercent: -6, xPercent: desktop ? (index % 2 ? 2 : -2) : 0, scale: 1.06 }, { yPercent: 6, xPercent: desktop ? (index % 2 ? -2 : 2) : 0, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.7 } });
      });
      entrance(document.querySelector(".craft-grid")!).from(".craft-mark", { y: 60, clipPath: "inset(0 0 100% 0)", clearProps: "transform,clipPath" }, 0)
        .from(".craft-copy > *", { y: distance, stagger: 0.12, clearProps: "transform" }, 0.15);
      gsap.utils.toArray<HTMLElement>(".ingredient-chapter").forEach((chapter, index) => {
        const image = chapter.querySelector(".ingredient-macro")!;
        const title = chapter.querySelector("h3")!;
        entrance(chapter).from(image, { clipPath: `inset(0 ${index % 2 ? 0 : 100}% 0 ${index % 2 ? 100 : 0}%)`, duration: 1.4, clearProps: "clipPath" }, 0)
          .from(chapter.querySelectorAll(".ingredient-copy > p"), { y: 35, opacity: 0, stagger: 0.18, clearProps: "transform,opacity" }, 0.2);
        gsap.fromTo(title, { y: desktop ? 22 : 12, x: desktop ? (index % 2 ? 28 : -28) : 0 }, { y: desktop ? -22 : -12, x: desktop ? (index % 2 ? -20 : 20) : 0, ease: "none", scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: 0.8 } });
        gsap.fromTo(image.querySelector("img"), { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: 0.7 } });
        const destination = ["#241712", "#e7d4b7", "#e4d5bd", "#201411"][index];
        gsap.to(chapter, { backgroundColor: destination, ease: "none", scrollTrigger: { trigger: chapter, start: "top 75%", end: "bottom 25%", scrub: 0.8 } });
      });
      entrance(document.querySelector(".story-copy")!).from(".story-copy .motion-line > span", { yPercent: 110, rotation: 2, stagger: 0.15, clearProps: "transform" }, 0)
        .from(".story-text > p, .story-copy > .text-link", { y: 45, opacity: 0, stagger: 0.12, clearProps: "transform,opacity" }, 0.35);
      entrance(document.querySelector(".story-portrait")!).from(".story-portrait", { clipPath: "inset(18% 10% 18% 10%)", duration: 1.4, clearProps: "clipPath" });
      gsap.fromTo(".story-portrait img", { yPercent: -7, scale: 1.1 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: ".story-section", start: "top bottom", end: "bottom top", scrub: 0.8 } });
      if (desktop) gsap.fromTo(".story-aside", { y: 45 }, { y: -45, ease: "none", scrollTrigger: { trigger: ".story-section", start: "top bottom", end: "bottom top", scrub: 1 } });
      entrance(document.querySelector(".final-cta")!, "top 78%").from(".final-cta .motion-line > span", { yPercent: 115, rotation: 2, stagger: 0.17, duration: 1.4, clearProps: "transform" }, 0)
        .from(".final-cta .eyebrow, .final-cta .cta-action, .final-cta .container > p:last-child", { y: 42, opacity: 0, stagger: 0.16, clearProps: "transform,opacity" }, 0.4);
      if (desktop) {
        gsap.utils.toArray<HTMLElement>(".button").forEach(button => {
          const x = gsap.quickTo(button, "x", { duration: 0.45, ease: "power3.out" });
          const y = gsap.quickTo(button, "y", { duration: 0.45, ease: "power3.out" });
          const move = (event: PointerEvent) => {
            if (event.pointerType !== "mouse" || button.matches(":focus-visible")) return;
            const bounds = button.getBoundingClientRect();
            x((event.clientX - bounds.left - bounds.width / 2) * 0.12);
            y((event.clientY - bounds.top - bounds.height / 2) * 0.2);
          };
          const reset = () => { x(0); y(0); };
          button.addEventListener("pointermove", move); button.addEventListener("pointerleave", reset); button.addEventListener("focus", reset);
          cleanups.push(() => { button.removeEventListener("pointermove", move); button.removeEventListener("pointerleave", reset); button.removeEventListener("focus", reset); x.tween.kill(); y.tween.kill(); });
        });
      }
      let active = true;
      const refresh = () => { if (active) { lenis.resize(); ScrollTrigger.refresh(); } };
      const scheduledRefresh = gsap.delayedCall(0.15, refresh).pause();
      const queueRefresh = () => { scheduledRefresh.restart(true); };
      void document.fonts.ready.then(queueRefresh);
      const observer = new ResizeObserver(queueRefresh);
      const main = document.querySelector("main");
      if (main) observer.observe(main);
      document.addEventListener("toggle", queueRefresh, true);
      document.addEventListener("load", queueRefresh, true);
      window.addEventListener("miette:scene-ready", queueRefresh);
      refresh();
      return () => {
        active = false; observer.disconnect(); scheduledRefresh.kill();
        document.removeEventListener("toggle", queueRefresh, true); document.removeEventListener("load", queueRefresh, true); window.removeEventListener("miette:scene-ready", queueRefresh);
        cleanups.forEach(cleanup => cleanup());
        gsap.ticker.remove(tick); lenis.off("scroll", ScrollTrigger.update);
        // Reset scrolling before destroy: Lenis's pending native-scroll timeout
        // must not restore its CSS classes after a reduced-motion change.
        lenis.stop(); lenis.destroy(); heroProgress.value = 0;
      };
    });
    return () => media.revert();
  }, []);
  return null;
}
