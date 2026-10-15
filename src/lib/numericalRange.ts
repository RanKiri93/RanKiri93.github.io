/**
 * The numerical range W(A) = { <Ax, x> : |x| = 1 } of a square complex matrix,
 * computed at build time for the home page picture.
 *
 * For each direction θ, the largest eigenvalue λ(θ) of the Hermitian matrix
 * Re(e^{-iθ}A) = (e^{-iθ}A + e^{iθ}A*) / 2 gives the support line
 * Re(e^{-iθ}z) = λ(θ) of W(A), and a unit eigenvector x for it gives the point
 * <Ax, x> where that line touches the boundary.
 */

export type Complex = readonly [re: number, im: number];
export type Matrix = readonly (readonly Complex[])[];

export interface Support {
  /** Direction of the outer normal. */
  theta: number;
  /** The point where the support line touches W(A). */
  point: Complex;
}

/** Eigenvalues and eigenvectors of a real symmetric matrix (cyclic Jacobi). */
function jacobi(input: number[][]): { values: number[]; vectors: number[][] } {
  const n = input.length;
  const a = input.map((row) => [...row]);
  const v = a.map((_, i) => a.map((_, j): number => (i === j ? 1 : 0)));

  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += a[p][q] ** 2;
    if (off < 1e-22) break;

    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(a[p][q]) < 1e-300) continue;
        const phi = (a[q][q] - a[p][p]) / (2 * a[p][q]);
        const t = Math.sign(phi || 1) / (Math.abs(phi) + Math.sqrt(phi * phi + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = a[k][p];
          const akq = a[k][q];
          a[k][p] = c * akp - s * akq;
          a[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = a[p][k];
          const aqk = a[q][k];
          a[p][k] = c * apk - s * aqk;
          a[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = v[k][p];
          const vkq = v[k][q];
          v[k][p] = c * vkp - s * vkq;
          v[k][q] = s * vkp + c * vkq;
        }
      }
    }
  }

  return { values: a.map((row, i) => row[i]), vectors: v };
}

/** <Ax, x> for a complex vector x. */
function quadratic(A: Matrix, x: Complex[]): Complex {
  let re = 0;
  let im = 0;
  for (let i = 0; i < x.length; i++) {
    for (let j = 0; j < x.length; j++) {
      // conj(x_i) * A_ij * x_j
      const [ar, ai] = A[i][j];
      const [xr, xi] = x[j];
      const yr = ar * xr - ai * xi;
      const yi = ar * xi + ai * xr;
      const [cr, ci] = x[i];
      re += cr * yr + ci * yi;
      im += cr * yi - ci * yr;
    }
  }
  return [re, im];
}

/** Boundary points of W(A) for `samples` equally spaced normal directions. */
export function numericalRange(A: Matrix, samples: number): Support[] {
  const n = A.length;
  return Array.from({ length: samples }, (_, k) => {
    const theta = (2 * Math.PI * k) / samples;
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    // H = Re(e^{-iθ}A), Hermitian; as a real symmetric 2n × 2n matrix [[X, -Y], [Y, X]].
    const big = Array.from({ length: 2 * n }, () => new Array<number>(2 * n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        // e^{-iθ} A_ij and its conjugate-transpose partner e^{iθ} conj(A_ji)
        const [ar, ai] = A[i][j];
        const [br, bi] = A[j][i];
        const re = (c * ar + s * ai + (c * br + s * bi)) / 2;
        const im = (c * ai - s * ar - (c * bi - s * br)) / 2;
        big[i][j] = re;
        big[i + n][j + n] = re;
        big[i + n][j] = im;
        big[i][j + n] = -im;
      }
    }

    const { values, vectors } = jacobi(big);
    const top = values.indexOf(Math.max(...values));
    const x: Complex[] = Array.from({ length: n }, (_, i) => [vectors[i][top], vectors[i + n][top]]);
    const norm = Math.hypot(...x.flat());
    return { theta, point: quadratic(A, x.map(([re, im]) => [re / norm, im / norm])) };
  });
}
