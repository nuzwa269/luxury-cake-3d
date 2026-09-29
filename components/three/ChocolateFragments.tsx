"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BoxGeometry, Group, MathUtils } from "three";
import {
  chocolateCurl,
  chocolateShard,
  hazelnutGeometry,
} from "./cake-geometry";
import type { CakeMaterials } from "./cake-materials";
import type { ScenePointer } from "./CameraRig";
import { heroProgress } from "@/components/motion/hero-progress";

const pieces = [
  {
    kind: "square",
    position: [-1.84, 0.75, -0.25],
    rotation: [0.35, 0.2, -0.4],
    scale: 0.72,
  },
  {
    kind: "curl",
    position: [1.6, 1.24, -0.65],
    rotation: [0.1, -0.4, -0.5],
    scale: 0.65,
  },
  {
    kind: "nut",
    position: [1.75, -0.18, 0.16],
    rotation: [0.5, 0.2, 0.3],
    scale: 0.72,
  },
  {
    kind: "shard",
    position: [-1.74, -0.22, 0.6],
    rotation: [0.4, 1.1, -0.65],
    scale: 0.38,
  },
  {
    kind: "nut",
    position: [-1.15, 1.66, -0.45],
    rotation: [0.3, 0.8, 0.7],
    scale: 0.57,
  },
] as const;

export function ChocolateFragments({
  compact,
  moving,
  interactive,
  pointer,
  materials,
}: {
  compact: boolean;
  moving: boolean;
  interactive: boolean;
  pointer: ScenePointer;
  materials: CakeMaterials;
}) {
  const root = useRef<Group>(null),
    time = useRef(0);
  const geometry = useMemo(
    () => ({
      square: new BoxGeometry(0.32, 0.24, 0.055),
      curl: chocolateCurl(),
      nut: hazelnutGeometry(16),
      shard: chocolateShard(),
    }),
    [],
  );
  useEffect(
    () => () => Object.values(geometry).forEach((g) => g.dispose()),
    [geometry],
  );
  useFrame((_, delta) => {
    if (!root.current) return;
    const dt = Math.min(delta, 0.05);
    if (moving) time.current += dt;
    root.current.children.forEach((piece, i) => {
      const base = pieces[i];
      const drift = moving
        ? Math.sin(time.current * 0.8 + i * 1.8) * (compact ? 0.09 : 0.18)
        : 0;
      const spread = moving ? heroProgress.value * (compact ? 0.1 : 0.28) : 0;
      piece.position.y = base.position[1] * (1 + spread) + drift;
      piece.position.x = MathUtils.damp(
        piece.position.x,
        base.position[0] * (1 + spread) +
          (moving ? Math.sin(time.current * 0.55 + i) * 0.06 : 0) +
          (interactive ? pointer.current.x * 0.12 * (i % 2 ? -1 : 1) : 0),
        2.8,
        dt,
      );
      piece.rotation.z =
        base.rotation[2] +
        (moving ? Math.sin(time.current * 0.6 + i) * 0.24 : 0);
      piece.position.z = base.position[2] + (moving ? Math.sin(time.current * 0.7 + i * 2) * (compact ? 0.12 : 0.32) : 0);
      piece.rotation.y = base.rotation[1] + (moving ? Math.sin(time.current * 0.4 + i) * 0.35 : 0);
    });
  });
  return (
    <group ref={root} name="chocolate-fragments" dispose={null}>
      {pieces.slice(0, compact ? 2 : 5).map((piece, i) => (
        <mesh
          key={i}
          geometry={geometry[piece.kind]}
          material={piece.kind === "nut" ? materials.nut : materials.shard}
          position={[...piece.position]}
          rotation={[...piece.rotation]}
          scale={piece.scale}
          castShadow
        />
      ))}
    </group>
  );
}
