import { FieldState, Grid } from './fabric';

export interface PDEParams {
  c: number;
  gamma: Float32Array; // same size as grid
  dt: number;
}

export function createGammaMask(grid: Grid, base: number, rim: number, extra: number) {
  const n = grid.nx * grid.ny;
  const g = new Float32Array(n).fill(base);
  for (let y = 0; y < grid.ny; y++) {
    for (let x = 0; x < grid.nx; x++) {
      const i = y * grid.nx + x;
      const dx = Math.min(x, grid.nx - 1 - x);
      const dy = Math.min(y, grid.ny - 1 - y);
      const d = Math.min(dx, dy);
      if (d < rim) {
        const t = (rim - d) / rim;
        g[i] = base + extra * 0.5 * (1 - Math.cos(Math.PI * t));
      }
    }
  }
  return g;
}

export function stepField(state: FieldState, grid: Grid, p: PDEParams) {
  const { phi, phi_t, eps, source } = state;
  const { nx, ny, dx } = grid;
  const { c, gamma, dt } = p;
  const nx1 = nx + 1;
  const ny1 = ny + 1;
  const lap = (x: number, y: number) => {
    const i = y * nx + x;
    const ip = y * nx + (x + 1);
    const im = y * nx + (x - 1);
    const jp = (y + 1) * nx + x;
    const jm = (y - 1) * nx + x;
    const ex1 = 0.5 * (eps[i] + eps[ip]);
    const ex2 = 0.5 * (eps[i] + eps[im]);
    const ey1 = 0.5 * (eps[i] + eps[jp]);
    const ey2 = 0.5 * (eps[i] + eps[jm]);
    return (
      (ex1 * (phi[ip] - phi[i]) - ex2 * (phi[i] - phi[im]) + ey1 * (phi[jp] - phi[i]) - ey2 * (phi[i] - phi[jm])) /
      (dx * dx)
    );
  };
  for (let y = 1; y < ny - 1; y++) {
    for (let x = 1; x < nx - 1; x++) {
      const i = y * nx + x;
      const lapv = lap(x, y);
      const acc = c * c * lapv - gamma[i] * phi_t[i] + source[i];
      phi_t[i] += acc * dt;
      phi[i] += phi_t[i] * dt;
    }
  }
}
