/** Shared geometry for the course pictures. All glyphs draw in a 240 × 150 box. */

export const W = 240;
export const H = 150;

export type Pt = readonly [number, number];

export const r = (n: number) => Math.round(n * 10) / 10;

export const toPath = (points: readonly Pt[]) =>
  points.map(([x, y], i) => `${i ? 'L' : 'M'}${r(x)} ${r(y)}`).join('');

/** Same scale on both axes (for geometry), with math point (cx, cy) at the centre. */
export function equalFrame(unit: number, cx = 0, cy = 0) {
  return {
    x: (x: number) => W / 2 + (x - cx) * unit,
    y: (y: number) => H / 2 - (y - cy) * unit,
  };
}

/** Independent axis ranges (for graphs), with some padding. */
export function rangeFrame(x0: number, x1: number, y0: number, y1: number, pad = 8) {
  const kx = (W - 2 * pad) / (x1 - x0);
  const ky = (H - 2 * pad) / (y1 - y0);
  return {
    x: (x: number) => pad + (x - x0) * kx,
    y: (y: number) => H - pad - (y - y0) * ky,
    kx,
    ky,
  };
}

/** One path of equal-length dashes centred on each point, along a screen-space direction. */
export function directionField(points: readonly Pt[], direction: (p: Pt) => Pt, length: number): string {
  return points
    .map(([x, y]) => {
      const [dx, dy] = direction([x, y]);
      const norm = Math.hypot(dx, dy) || 1;
      const ux = (dx / norm) * (length / 2);
      const uy = (dy / norm) * (length / 2);
      return `M${r(x - ux)} ${r(y - uy)}L${r(x + ux)} ${r(y + uy)}`;
    })
    .join('');
}

export function grid(x0: number, x1: number, y0: number, y1: number, step: number): Pt[] {
  const points: Pt[] = [];
  for (let x = x0; x <= x1 + 1e-9; x += step) for (let y = y0; y <= y1 + 1e-9; y += step) points.push([x, y]);
  return points;
}
