import { useEffect, useMemo } from "react";
import {
  DataTexture,
  DoubleSide,
  LinearFilter,
  LinearMipmapLinearFilter,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  RepeatWrapping,
  RGBAFormat,
  UnsignedByteType,
} from "three";
import { noise } from "./cake-geometry";

/** Small CPU-authored relief maps; no remote textures, HDR files, or asset fetches. */
function reliefTexture(kind: "sponge" | "ganache" | "nut") {
  const size = 256,
    pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const random = noise(x + y * size + 71);
      let value = 0.5;
      if (kind === "sponge") {
        const grain = noise(Math.floor(x / 3) + Math.floor(y / 3) * 91);
        value = grain < 0.21 ? 0.08 + random * 0.16 : 0.47 + random * 0.4;
      } else if (kind === "ganache") {
        value =
          0.5 +
          Math.sin(y * 0.34 + Math.sin(x * 0.046) * 3) * 0.065 +
          (random - 0.5) * 0.09;
      } else {
        value =
          0.4 + Math.sin(x * 0.38 + Math.sin(y * 0.05)) * 0.15 + random * 0.18;
      }
      const offset = (y * size + x) * 4;
      pixels[offset] =
        pixels[offset + 1] =
        pixels[offset + 2] =
          Math.round(value * 255);
      pixels[offset + 3] = 255;
    }
  }
  const texture = new DataTexture(
    pixels,
    size,
    size,
    RGBAFormat,
    UnsignedByteType,
  );
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(kind === "sponge" ? 1.2 : 1, kind === "sponge" ? 1.2 : 1);
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

export function useCakeMaterials() {
  const materials = useMemo(() => {
    const spongeMap = reliefTexture("sponge"),
      ganacheMap = reliefTexture("ganache"),
      nutMap = reliefTexture("nut");
    const ganache = new MeshPhysicalMaterial({
      color: "#4b281a",
      roughness: 0.34,
      metalness: 0,
      clearcoat: 0.24,
      clearcoatRoughness: 0.36,
      bumpMap: ganacheMap,
      bumpScale: 0.014,
      envMapIntensity: 0.72,
      side: DoubleSide,
    });
    const glaze = new MeshPhysicalMaterial({
      color: "#4e2818",
      roughness: 0.32,
      metalness: 0,
      clearcoat: 0.3,
      clearcoatRoughness: 0.3,
      bumpMap: ganacheMap,
      bumpScale: 0.006,
      envMapIntensity: 0.8,
      side: DoubleSide,
    });
    const sponge = new MeshStandardMaterial({
      color: "#946345",
      map: spongeMap,
      roughness: 0.94,
      metalness: 0,
      bumpMap: spongeMap,
      bumpScale: 0.035,
      envMapIntensity: 0.22,
    });
    const mousse = new MeshPhysicalMaterial({
      color: "#72432b",
      roughness: 0.62,
      metalness: 0,
      bumpMap: ganacheMap,
      bumpScale: 0.014,
      envMapIntensity: 0.35,
    });
    const frosting = new MeshPhysicalMaterial({
      color: "#512b1b",
      roughness: 0.45,
      metalness: 0,
      clearcoat: 0.12,
      clearcoatRoughness: 0.45,
      bumpMap: ganacheMap,
      bumpScale: 0.008,
      envMapIntensity: 0.55,
    });
    const shard = new MeshPhysicalMaterial({
      color: "#2c140e",
      roughness: 0.4,
      metalness: 0,
      clearcoat: 0.14,
      clearcoatRoughness: 0.4,
      envMapIntensity: 0.6,
      side: DoubleSide,
    });
    const nut = new MeshStandardMaterial({
      color: "#c58b4e",
      map: nutMap,
      roughness: 0.74,
      bumpMap: nutMap,
      bumpScale: 0.019,
      envMapIntensity: 0.35,
    });
    const nutInside = new MeshStandardMaterial({
      color: "#d6b37d",
      roughness: 0.85,
      bumpMap: spongeMap,
      bumpScale: 0.015,
    });
    const ceramic = new MeshPhysicalMaterial({
      color: "#d9c9ab",
      roughness: 0.32,
      metalness: 0,
      clearcoat: 0.32,
      clearcoatRoughness: 0.26,
      envMapIntensity: 0.65,
    });
    return {
      ganache,
      glaze,
      sponge,
      mousse,
      frosting,
      shard,
      nut,
      nutInside,
      ceramic,
      textures: [spongeMap, ganacheMap, nutMap],
    };
  }, []);
  useEffect(
    () => () => {
      const { textures, ...surfaceMaterials } = materials;
      Object.values(surfaceMaterials).forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
    },
    [materials],
  );
  return materials;
}
export type CakeMaterials = ReturnType<typeof useCakeMaterials>;
