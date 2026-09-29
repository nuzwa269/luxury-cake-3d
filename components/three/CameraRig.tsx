"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { heroProgress } from "@/components/motion/hero-progress";

export type ScenePointer = RefObject<{ x: number; y: number }>;

export function CameraRig({
  pointer,
  interactive,
  moving,
  compact,
}: {
  pointer: ScenePointer;
  interactive: boolean;
  moving: boolean;
  compact: boolean;
}) {
  const { camera, size, invalidate } = useThree();
  const home = useRef(new Vector3());
  const target = useRef(new Vector3(0, 0.18, 0));
  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    const aspect = size.width / Math.max(size.height, 1);
    const tangent = Math.tan(MathUtils.degToRad(camera.fov / 2));
    const distance = Math.max(
      1.95 / (tangent * aspect * 0.88),
      1.68 / (tangent * 0.78),
    );
    home.current
      .set(2.8, 2.65, 6.6)
      .normalize()
      .multiplyScalar(distance)
      .add(target.current);
    camera.position.copy(home.current);
    camera.lookAt(target.current);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, invalidate]);
  useFrame((state, delta) => {
    const camera = state.camera;
    const zoom = 1 - (moving ? heroProgress.value * (compact ? 0.045 : 0.105) : 0);
    if (!interactive) camera.position.copy(home.current).sub(target.current).multiplyScalar(zoom).add(target.current);
    else {
      const dt = Math.min(delta, 0.05);
      camera.position.x = MathUtils.damp(
        camera.position.x,
        home.current.x * zoom + pointer.current.x * 0.32,
        3,
        dt,
      );
      camera.position.y = MathUtils.damp(
        camera.position.y,
        target.current.y + (home.current.y - target.current.y) * zoom + pointer.current.y * 0.18,
        3,
        dt,
      );
      camera.position.z = MathUtils.damp(camera.position.z, home.current.z * zoom, 3, dt);
    }
    camera.lookAt(target.current);
  });
  return null;
}
