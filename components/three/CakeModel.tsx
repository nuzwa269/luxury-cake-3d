"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Group,
  CircleGeometry,
  IcosahedronGeometry,
  InstancedMesh,
  LatheGeometry,
  MathUtils,
  Object3D,
  Vector2,
} from "three";
import {
  CAKE_END,
  CAKE_START,
  cakeSector,
  chocolateCurl,
  chocolateShard,
  frostingRosette,
  ganacheCoating,
  ganacheDrips,
  hazelnutGeometry,
  noise,
} from "./cake-geometry";
import type { CakeMaterials } from "./cake-materials";
import type { ScenePointer } from "./CameraRig";
import { heroProgress } from "@/components/motion/hero-progress";

type Props = {
  compact: boolean;
  moving: boolean;
  interactive: boolean;
  pointer: ScenePointer;
  materials: CakeMaterials;
};

export function CakeModel({
  compact,
  moving,
  interactive,
  pointer,
  materials,
}: Props) {
  const cake = useRef<Group>(null);
  const crumbs = useRef<InstancedMesh>(null);
  const time = useRef(0);
  const geometry = useMemo(() => {
    const radial = compact ? 48 : 96;
    return {
      sponge: cakeSector(1.302, 0.39, compact ? 24 : 48, true),
      filling: cakeSector(1.306, 0.11, compact ? 24 : 48),
      top: cakeSector(1.324, 0.135, compact ? 24 : 48),
      coating: ganacheCoating(radial),
      drips: ganacheDrips(compact ? 160 : 256),
      rosette: frostingRosette(compact ? 24 : 40),
      shard: chocolateShard(),
      curl: chocolateCurl(),
      nut: hazelnutGeometry(compact ? 16 : 24),
      nutFace: new CircleGeometry(0.108, 24),
      crumb: new IcosahedronGeometry(1, 0),
      pedestal: new LatheGeometry(
        [
          new Vector2(0, -1.36),
          new Vector2(0.64, -1.36),
          new Vector2(0.72, -1.32),
          new Vector2(0.73, -1.28),
          new Vector2(0.67, -1.24),
          new Vector2(0.4, -1.2),
          new Vector2(0.3, -1.08),
          new Vector2(0.26, -0.84),
          new Vector2(0.34, -0.75),
          new Vector2(0.75, -0.68),
          new Vector2(1.55, -0.66),
          new Vector2(1.66, -0.62),
          new Vector2(1.67, -0.57),
          new Vector2(1.62, -0.535),
          new Vector2(1.45, -0.53),
          new Vector2(0, -0.53),
        ],
        radial,
      ),
    };
  }, [compact]);
  useEffect(
    () => () => Object.values(geometry).forEach((item) => item.dispose()),
    [geometry],
  );
  const crumbCount = compact ? 36 : 70;
  useLayoutEffect(() => {
    if (!crumbs.current) return;
    const dummy = new Object3D();
    for (let i = 0; i < crumbCount; i++) {
      const angle = CAKE_START + noise(i + 91) * (CAKE_END - CAKE_START);
      const radius =
        i < crumbCount * 0.75
          ? 0.28 + noise(i + 10) * 0.72
          : 1.38 + noise(i + 50) * 0.16;
      dummy.position.set(
        Math.cos(angle) * radius,
        radius > 1.3 ? -0.508 : 1.023,
        Math.sin(angle) * radius,
      );
      dummy.rotation.set(noise(i) * 4, noise(i + 8) * 4, noise(i + 5) * 4);
      dummy.scale.setScalar(0.011 + noise(i + 12) * 0.022);
      dummy.updateMatrix();
      crumbs.current.setMatrixAt(i, dummy.matrix);
    }
    crumbs.current.instanceMatrix.needsUpdate = true;
  }, [crumbCount]);
  useFrame((_, delta) => {
    if (!cake.current) return;
    const dt = Math.min(delta, 0.05);
    if (!moving) {
      cake.current.rotation.set(0, 0, 0);
      cake.current.position.y = 0;
      return;
    }
    time.current += dt;
    const x = interactive ? pointer.current.y * MathUtils.degToRad(4) : 0;
    const y =
      (interactive ? pointer.current.x * MathUtils.degToRad(7.3) : 0) +
      Math.sin(time.current * 0.48) * MathUtils.degToRad(compact ? 4.5 : 8) +
      heroProgress.value * MathUtils.degToRad(compact ? 24 : 42);
    cake.current.rotation.x = MathUtils.damp(cake.current.rotation.x, x, 3, dt);
    cake.current.rotation.y = MathUtils.damp(cake.current.rotation.y, y, 3, dt);
    // The cake and pedestal float together, keeping the composition intact.
    cake.current.position.y = (Math.sin(time.current * 0.9) + 1) * (compact ? 0.04 : 0.075);
  });
  const pipingCount = compact ? 13 : 16;
  return (
    <group ref={cake} name="cake-centerpiece" dispose={null}>
      <mesh
        name="ceramic-pedestal"
        geometry={geometry.pedestal}
        material={materials.ceramic}
        castShadow
        receiveShadow
      />
      <group name="cake-motion">
        {[-0.52, -0.02, 0.48].map((y, i) => (
          <mesh
            key={`sponge-${i}`}
            geometry={geometry.sponge}
            material={materials.sponge}
            position={[0, y, 0]}
            castShadow
            receiveShadow
          />
        ))}
        {[-0.13, 0.37].map((y, i) => (
          <mesh
            key={`mousse-${i}`}
            geometry={geometry.filling}
            material={materials.mousse}
            position={[0, y, 0]}
            castShadow
            receiveShadow
          />
        ))}
        <mesh
          geometry={geometry.coating}
          material={materials.ganache}
          position={[0, -0.53, 0]}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={geometry.top}
          material={materials.ganache}
          position={[0, 0.87, 0]}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={geometry.drips}
          material={materials.glaze}
          castShadow
          receiveShadow
        />
        {Array.from({ length: pipingCount }, (_, i) => {
          const angle =
            CAKE_START +
            0.15 +
            (i / (pipingCount - 1)) * (CAKE_END - CAKE_START - 0.3);
          return (
            <mesh
              key={`rosette-${i}`}
              geometry={geometry.rosette}
              material={materials.frosting}
              position={[
                Math.cos(angle) * 1.035,
                1.008,
                Math.sin(angle) * 1.035,
              ]}
              rotation={[0, -angle + i * 0.2, 0]}
              castShadow
              receiveShadow
            />
          );
        })}
        {[
          [-0.3, 1.06, -0.2, -0.22, 0.25, 0.4],
          [0.05, 1.06, -0.32, 0.2, -0.6, -0.27],
          [-0.48, 1.05, 0.04, -0.35, 1.3, -0.3],
          [0.24, 1.02, -0.07, 0.2, 0.7, -0.42],
          [-0.08, 1.09, 0.03, -0.2, -0.1, 0.1],
        ].map((p, i) => (
          <mesh
            key={`shard-${i}`}
            geometry={geometry.shard}
            material={materials.shard}
            position={[p[0], p[1], p[2]]}
            rotation={[p[3], p[4], p[5]]}
            scale={0.8 + i * 0.08}
            castShadow
            receiveShadow
          />
        ))}
        {[
          [-0.57, 1.14, -0.18, 0.1, 0.3, 0.4],
          [0.17, 1.2, -0.48, -0.3, 1.4, -0.2],
          [-0.22, 1.2, 0.21, 0.2, -0.7, 0.5],
        ].map((p, i) => (
          <mesh
            key={`curl-${i}`}
            geometry={geometry.curl}
            material={materials.glaze}
            position={[p[0], p[1], p[2]]}
            rotation={[p[3], p[4], p[5]]}
            castShadow
            receiveShadow
          />
        ))}
        {[
          [-0.65, 1.12, 0.18],
          [0.37, 1.12, -0.35],
          [-0.28, 1.13, 0.49],
          [0.08, 1.13, -0.67],
          [-0.72, 1.1, -0.43],
          [-0.38, 1.12, -0.62],
        ].map((p, i) => (
          <mesh
            key={`nut-${i}`}
            geometry={geometry.nut}
            material={materials.nut}
            position={[p[0], p[1], p[2]]}
            rotation={[i * 0.6, i, 0.3]}
            scale={i % 2 ? 0.85 : 1}
            castShadow
            receiveShadow
          />
        ))}
        <group position={[-0.62, 1.13, 0.45]} rotation={[0.45, 0, -0.35]}>
          <mesh
            geometry={geometry.nut}
            material={materials.nut}
            scale={[1, 0.5, 1]}
            castShadow
          />
          <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.108, 24]} />
            <primitive object={materials.nutInside} attach="material" />
          </mesh>
        </group>
        <instancedMesh
          ref={crumbs}
          args={[undefined, undefined, crumbCount]}
          material={materials.shard}
          castShadow
        >
          <icosahedronGeometry args={[1, 0]} />
        </instancedMesh>
      </group>
    </group>
  );
}
