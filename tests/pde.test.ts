import { describe, it, expect } from 'vitest';
import { createField, Grid } from '../src/physics/fabric';
import { stepField, createGammaMask } from '../src/physics/pde_cpu';

function energy(field: Float32Array, phi_t: Float32Array, grid: Grid, c: number) {
  const { nx, ny, dx } = grid;
  let e = 0;
  for (let y = 1; y < ny - 1; y++) {
    for (let x = 1; x < nx - 1; x++) {
      const i = y * nx + x;
      const gx = (field[i + 1] - field[i - 1]) / (2 * dx);
      const gy = (field[i + nx] - field[i - nx]) / (2 * dx);
      e += 0.5 * phi_t[i] * phi_t[i] + 0.5 * c * c * (gx * gx + gy * gy);
    }
  }
  return e;
}

describe('pde_cpu', () => {
  it('damps energy', () => {
    const grid: Grid = { nx: 16, ny: 16, dx: 1, dy: 1 };
    const state = createField(grid);
    for (let i = 0; i < state.phi.length; i++) state.phi[i] = Math.random() * 0.01;
    const gamma = createGammaMask(grid, 0.1, 0, 0);
    const params = { c: 1, gamma, dt: 0.1 };
    const e0 = energy(state.phi, state.phi_t, grid, params.c);
    for (let n = 0; n < 10; n++) stepField(state, grid, params);
    const e1 = energy(state.phi, state.phi_t, grid, params.c);
    expect(e1).toBeLessThan(e0);
  });
});
