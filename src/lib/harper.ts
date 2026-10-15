/**
 * Spectrum of H = U + U* + V + V* for unitaries with VU = e^{2πiθ}UV
 * (Harper's operator), at rational θ = p/q: the Hofstadter butterfly.
 *
 * For θ = p/q the spectrum is a union of q bands. Reducing H with Bloch
 * phases gives the q×q matrices
 *   M(ν, k)_{jj} = 2cos(2πθj + ν),  M_{j,j+1} = M_{j+1,j} = 1,  corner e^{iqk},
 * and (Chambers) the j-th eigenvalue sweeps band j as (ν, k) varies, with its
 * extremes where cos(qν) and cos(qk) are ±1, i.e. ν, k ∈ {0, π/q}. Those four
 * matrices are real symmetric, so a Jacobi solver is enough.
 *
 * Runs at build time (the static picture) and in the browser (the slider).
 */

export interface Fraction {
  p: number;
  q: number;
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** All p/q in [0, 1] in lowest terms with q ≤ maxQ, in increasing order. */
export function fractions(maxQ: number): Fraction[] {
  const list: Fraction[] = [];
  for (let q = 1; q <= maxQ; q++) for (let p = 0; p <= q; p++) if (gcd(p, q) === 1) list.push({ p, q });
  return list.sort((a, b) => a.p / a.q - b.p / b.q);
}

function blochMatrix({ p, q }: Fraction, nu: number, corner: 1 | -1): number[][] {
  const M = Array.from({ length: q }, () => new Array<number>(q).fill(0));
  for (let j = 0; j < q; j++) {
    M[j][j] += 2 * Math.cos((2 * Math.PI * p * j) / q + nu);
    const next = (j + 1) % q;
    const weight = j === q - 1 ? corner : 1;
    M[j][next] += weight;
    M[next][j] += weight;
  }
  return M;
}

/** Eigenvalues of a real symmetric matrix (cyclic Jacobi), ascending. */
export function symmetricEigenvalues(input: number[][]): number[] {
  const n = input.length;
  const A = input.map((row) => [...row]);
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2;
    if (off < 1e-22) break;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(A[i][j]) < 1e-15) continue;
        const theta = (A[j][j] - A[i][i]) / (2 * A[i][j]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const aki = A[k][i];
          const akj = A[k][j];
          A[k][i] = c * aki - s * akj;
          A[k][j] = s * aki + c * akj;
        }
        for (let k = 0; k < n; k++) {
          const aik = A[i][k];
          const ajk = A[j][k];
          A[i][k] = c * aik - s * ajk;
          A[j][k] = s * aik + c * ajk;
        }
      }
    }
  }
  return A.map((row, i) => row[i]).sort((a, b) => a - b);
}

/** The q bands [lo, hi] of the spectrum at θ = p/q, ascending. */
export function harperBands(fraction: Fraction): [number, number][] {
  const { q } = fraction;
  const samples = [
    blochMatrix(fraction, 0, 1),
    blochMatrix(fraction, 0, -1),
    blochMatrix(fraction, Math.PI / q, 1),
    blochMatrix(fraction, Math.PI / q, -1),
  ].map(symmetricEigenvalues);
  return Array.from({ length: q }, (_, j) => {
    const values = samples.map((s) => s[j]);
    return [Math.min(...values), Math.max(...values)];
  });
}
