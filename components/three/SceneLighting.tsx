"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DirectionalLight } from "three";
import { heroProgress } from "@/components/motion/hero-progress";

export function SceneLighting({ compact, moving }: { compact: boolean; moving: boolean }) {
  const highlight = useRef<DirectionalLight>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    if (moving) time.current += Math.min(delta, 0.05);
    const progress = moving ? heroProgress.value * (compact ? 0.65 : 1) : 0;
    if (highlight.current) {
      highlight.current.position.x = 4 + (moving ? Math.sin(time.current * 0.65) * 3 : 0);
      highlight.current.intensity = 1.7 + progress * 0.15 + (moving ? Math.sin(time.current * 0.8) * 0.35 : 0);
    }
  });
  return (
    <>
      <hemisphereLight args={["#ffefda", "#5a4032", 0.65]} />
      <spotLight
        position={[-3.5, 6, 4.5]}
        color="#ffe5c7"
        intensity={85}
        angle={0.6}
        penumbra={1}
        decay={2}
        castShadow={!compact}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.035}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
      />
      <directionalLight ref={highlight} position={[4, 2, 3]} color="#e4e9f0" intensity={1.7} />
      <directionalLight position={[1, 4, -4]} color="#ffdfb4" intensity={2.1} />
      <Environment
        resolution={compact ? 64 : 128}
        frames={1}
        environmentIntensity={0.85}
      >
        <Lightformer
          form="rect"
          intensity={3.5}
          position={[-4, 5, 3]}
          scale={[3, 5, 1]}
          target={[0, 0, 0]}
          color="#fff0d9"
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[4, 2, 2]}
          scale={[2, 4, 1]}
          target={[0, 0, 0]}
          color="#eef1ff"
        />
        <Lightformer
          form="rect"
          intensity={4}
          position={[0, 4, -4]}
          scale={[3, 2, 1]}
          target={[0, 0, 0]}
          color="#ffdfb3"
        />
      </Environment>
      <ContactShadows
        position={[0, -1.365, 0]}
        scale={5}
        opacity={0.16}
        blur={3.2}
        far={4.8}
        resolution={compact ? 256 : 512}
        frames={1}
        color="#593820"
        smooth={!compact}
      />
    </>
  );
}
