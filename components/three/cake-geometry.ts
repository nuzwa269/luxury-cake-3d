import {
  BufferGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  LatheGeometry,
  Shape,
  SphereGeometry,
  Vector2,
} from "three";

export const CAKE_START = (85 * Math.PI) / 180;
export const CAKE_END = (395 * Math.PI) / 180;
const TAU = Math.PI * 2;

/** Deterministic geometry: no random changes between renders or quality tiers. */
export function noise(seed: number) {
  const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export function cakeSector(
  radius: number,
  height: number,
  segments: number,
  porous = false,
) {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.lineTo(Math.cos(CAKE_START) * radius, -Math.sin(CAKE_START) * radius);
  shape.absarc(0, 0, radius, -CAKE_START, -CAKE_END, true);
  shape.lineTo(0, 0);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelSize: 0.012,
    bevelThickness: 0.008,
    bevelSegments: 2,
    steps: 1,
    curveSegments: segments,
  });
  geometry.rotateX(-Math.PI / 2);
  if (porous) {
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i),
        y = positions.getY(i),
        z = positions.getZ(i);
      const angle = Math.atan2(z, x);
      const offset =
        0.003 * Math.sin(x * 38 + z * 29) +
        0.004 * Math.sin(angle * 17 + y * 23);
      positions.setXYZ(i, x * (1 + offset), y + offset * 0.4, z * (1 + offset));
    }
    geometry.computeVertexNormals();
  }
  return geometry;
}

export function ganacheCoating(segments: number) {
  const points = Array.from({ length: 36 }, (_, i) => {
    const t = i / 35;
    const roundEdge = Math.sin(Math.PI * t) ** 0.16;
    return new Vector2(
      1.304 + roundEdge * 0.028 + Math.sin(t * 31) * 0.004,
      t * 1.45,
    );
  });
  const geometry = new LatheGeometry(
    points,
    segments,
    Math.PI / 2 - (CAKE_END - TAU),
    CAKE_END - CAKE_START,
  );
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i),
      y = positions.getY(i),
      z = positions.getZ(i);
    const angle = Math.atan2(z, x);
    const sweep =
      1 +
      0.003 * Math.sin(angle * 9 + y * 8) +
      0.002 * Math.sin(angle * 31 - y * 11);
    positions.setXYZ(i, x * sweep, y, z * sweep);
  }
  geometry.computeVertexNormals();
  return geometry;
}

/** One continuous icing skin, with irregular rounded drip valleys. */
export function ganacheDrips(segments: number) {
  const positions: number[] = [],
    uvs: number[] = [],
    indices: number[] = [];
  const rows = 12;
  const drips = Array.from({ length: 19 }, (_, i) => ({
    angle: CAKE_START + 0.12 + (i / 18) * (CAKE_END - CAKE_START - 0.24),
    width: 0.035 + noise(i + 7) * 0.045,
    depth: 0.09 + noise(i + 19) * 0.32,
  }));
  for (let i = 0; i <= segments; i++) {
    const angle = CAKE_START + (i / segments) * (CAKE_END - CAKE_START);
    let depth = 0.08;
    for (const drip of drips)
      depth +=
        drip.depth * Math.exp(-(((angle - drip.angle) / drip.width) ** 2));
    const edgeFade = Math.min(1, i / 5, (segments - i) / 5);
    depth *= edgeFade;
    for (let j = 0; j <= rows; j++) {
      const t = j / rows;
      const radius = 1.337 + Math.sin(Math.PI * t) * 0.024 - t ** 10 * 0.01;
      positions.push(
        Math.cos(angle) * radius,
        1.005 - t * (0.12 + depth),
        Math.sin(angle) * radius,
      );
      uvs.push((i / segments) * 4, t);
      if (i < segments && j < rows) {
        const a = i * (rows + 1) + j,
          b = a + rows + 1;
        indices.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** A twisted, fluted piping tip profile, tapered to a gently curled peak. */
export function frostingRosette(segments: number) {
  const positions: number[] = [],
    uvs: number[] = [],
    indices: number[] = [];
  const rows = 24;
  for (let j = 0; j <= rows; j++) {
    const t = j / rows;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * TAU;
      const flute = 1 + 0.2 * Math.cos(8 * angle + t * 4.6);
      const radius =
        0.163 *
          Math.pow(1 - t, 0.72) *
          (0.85 + 0.28 * Math.sin(t * Math.PI)) *
          flute +
        0.002;
      positions.push(
        Math.cos(angle) * radius + 0.054 * t ** 3,
        t * 0.285,
        Math.sin(angle) * radius + 0.025 * t ** 3,
      );
      uvs.push(i / segments, t);
      if (j < rows && i < segments) {
        const a = j * (segments + 1) + i,
          b = a + segments + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function chocolateShard() {
  const shape = new Shape();
  shape.moveTo(-0.16, 0);
  shape.lineTo(0.12, -0.025);
  shape.lineTo(0.2, 0.33);
  shape.lineTo(0.045, 0.67);
  shape.lineTo(-0.11, 0.46);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.025,
    bevelEnabled: true,
    bevelSize: 0.008,
    bevelThickness: 0.005,
    bevelSegments: 1,
    steps: 6,
  });
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i);
    positions.setZ(i, positions.getZ(i) + Math.sin(y * 3) * 0.11);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function chocolateCurl() {
  const positions: number[] = [],
    uvs: number[] = [],
    indices: number[] = [];
  const segments = 56;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments,
      angle = t * Math.PI * 2.15;
    const radius = 0.08 + t * 0.12;
    for (let j = 0; j < 2; j++) {
      const width = 0.075 * Math.sin(Math.PI * t) + 0.025;
      positions.push(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius + t * 0.21,
        (j - 0.5) * width + t * 0.13,
      );
      uvs.push(t * 2, j);
    }
    if (i < segments) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function hazelnutGeometry(segments: number) {
  const geometry = new SphereGeometry(0.12, segments, 12);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i),
      y = positions.getY(i),
      z = positions.getZ(i);
    const angle = Math.atan2(z, x);
    const groove = 1 + 0.035 * Math.sin(angle * 13 + y * 9);
    positions.setXYZ(i, x * groove, y * 1.08, z * groove * 0.93);
  }
  geometry.computeVertexNormals();
  return geometry;
}
