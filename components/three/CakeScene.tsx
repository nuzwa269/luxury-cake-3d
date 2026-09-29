"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ACESFilmicToneMapping, PCFShadowMap } from "three";
import { CakeModel } from "./CakeModel";
import { SceneLighting } from "./SceneLighting";
import { ChocolateFragments } from "./ChocolateFragments";
import { CameraRig, type ScenePointer } from "./CameraRig";
import { useCakeMaterials } from "./cake-materials";
import { SceneStill } from "./SceneStill";
import gsap from "gsap";

function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (notify: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", notify);
      return () => media.removeEventListener("change", notify);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function SceneContents({
  compact,
  moving,
  interactive,
  pointer,
  onReady,
}: {
  compact: boolean;
  moving: boolean;
  interactive: boolean;
  pointer: ScenePointer;
  onReady: () => void;
}) {
  const materials = useCakeMaterials();
  const invalidate = useThree((state) => state.invalidate);
  const frames = useRef(0);
  useFrame(() => {
    if (frames.current < 3) {
      frames.current += 1;
      invalidate();
    }
    if (frames.current === 2) onReady();
  });
  return (
    <>
      <CameraRig pointer={pointer} interactive={interactive} moving={moving} compact={compact} />
      <SceneLighting compact={compact} moving={moving} />
      <CakeModel
        compact={compact}
        moving={moving}
        interactive={interactive}
        pointer={pointer}
        materials={materials}
      />
      <ChocolateFragments
        compact={compact}
        moving={moving}
        interactive={interactive}
        pointer={pointer}
        materials={materials}
      />
    </>
  );
}

function SceneFrames({ moving, compact }: { moving: boolean; compact: boolean }) {
  const { advance, size } = useThree();
  useEffect(() => {
    let last = -1;
    let warmup = 0;
    // GSAP owns the only RAF. R3F is manually advanced, including static frames
    // after resize/preference changes; compact devices render at 30 fps.
    const tick = (time: number) => {
      if (!moving && warmup >= 8) return;
      if (compact && time - last < 1 / 30) return;
      last = time;
      warmup += 1;
      advance(time);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [advance, moving, compact, size.width, size.height]);
  return null;
}

export default function CakeScene() {
  const compact = useMediaQuery("(max-width: 900px), (pointer: coarse)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [paused, setPaused] = useState(false),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true),
    [pageVisible, setPageVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const moving = !reducedMotion && !paused && visible && pageVisible;
  const interactive = moving && finePointer && !compact;
  const onReady = useCallback(() => setReady(true), []);
  const fail = useCallback(() => setFailed(true), []);
  const contextCleanup = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (ready) window.dispatchEvent(new Event("miette:scene-ready"));
  }, [ready]);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("miette:motion-pause", { detail: paused }));
  }, [paused]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    if (root.current) observer.observe(root.current);
    const onVisibility = () =>
      setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      contextCleanup.current?.();
    };
  }, []);
  if (failed) return <SceneStill failed />;
  return (
    <div
      ref={root}
      className="cake-scene"
      data-scene-state={ready ? "ready" : "loading"}
      data-quality={compact ? "compact" : "full"}
      data-motion={moving ? "active" : "still"}
      onPointerMove={(event) => {
        if (!interactive || event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.current.x = Math.max(
          -1,
          Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1),
        );
        pointer.current.y = Math.max(
          -1,
          Math.min(1, 1 - ((event.clientY - rect.top) / rect.height) * 2),
        );
      }}
      onPointerLeave={() => {
        pointer.current.x = 0;
        pointer.current.y = 0;
      }}
    >
      <div
        className="cake-canvas"
        role="img"
        aria-label="A three-dimensional chocolate cake with a cutaway revealing sponge and mousse, glossy ganache drips, piped rosettes, chocolate curls and hazelnuts, on an ivory ceramic pedestal."
      >
        <Canvas
          aria-hidden="true"
          dpr={compact ? 1 : [1, 1.5]}
          frameloop="never"
          shadows={compact ? false : { type: PCFShadowMap }}
          camera={{ position: [3, 3, 7], fov: 32, near: 0.1, far: 45 }}
          gl={{
            antialias: !compact,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          fallback={<SceneStill failed />}
          onCreated={({ gl }) => {
            const onLost = (event: Event) => {
              event.preventDefault();
              fail();
            };
            gl.domElement.addEventListener("webglcontextlost", onLost);
            contextCleanup.current = () =>
              gl.domElement.removeEventListener("webglcontextlost", onLost);
          }}
        >
          <SceneFrames moving={moving} compact={compact} />
          <Suspense fallback={null}>
            <SceneContents
              compact={compact}
              moving={moving}
              interactive={interactive}
              pointer={pointer}
              onReady={onReady}
            />
          </Suspense>
        </Canvas>
      </div>
      {!ready && <SceneStill />}
      {ready && !reducedMotion && (
        <button
          className="scene-motion-toggle"
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? (
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path d="m5 3 7 5-7 5Z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
          {paused ? "Resume motion" : "Pause motion"}
        </button>
      )}
    </div>
  );
}
