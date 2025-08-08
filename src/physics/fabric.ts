import { alphaU, AlphaParams } from './alpha';
import { clamp } from './units';

export interface Grid {
  nx: number;
  ny: number;
  dx: number;
  dy: number;
}

export interface FieldState {
  phi: Float32Array;
  phi_t: Float32Array;
  eps: Float32Array;
  source: Float32Array;
}

export function createField(grid: Grid): FieldState {
  const n = grid.nx * grid.ny;
  return {
    phi: new Float32Array(n),
    phi_t: new Float32Array(n),
    eps: new Float32Array(n),
    source: new Float32Array(n),
  };
}

export function updateEps(state: FieldState, grid: Grid, params: AlphaParams) {
  const { phi, eps } = state;
  const { nx, ny, dx } = grid;
  const epsSmall = 1e-12;
  for (let y = 1; y < ny - 1; y++) {
    for (let x = 1; x < nx - 1; x++) {
      const i = y * nx + x;
      const gx = (phi[i + 1] - phi[i - 1]) / (2 * dx);
      const gy = (phi[i + nx] - phi[i - nx]) / (2 * dx);
      const grad = Math.hypot(gx, gy);
      const l = Math.abs(phi[i]) / (grad + epsSmall);
      const mu = clamp(1 / l, 1e4, 1e20);
      eps[i] = alphaU(mu, params);
    }
  }
}

export function cfl(dt: number, grid: Grid, c: number, epsMax: number) {
  const dim = 2;
  return (c * Math.sqrt(epsMax) * dt) / (grid.dx * Math.sqrt(dim));
}
