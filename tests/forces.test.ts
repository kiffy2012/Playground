import { describe, it, expect } from 'vitest';
import { pairwiseForce, Source } from '../src/physics/forces';
import { AlphaParams } from '../src/physics/alpha';

describe('forces', () => {
  it('reduces to inverse square when unified off', () => {
    const params: AlphaParams = {
      mu_em: 1,
      mu_s: 1,
      mu_w: 1,
      k1: 0,
      k2: 0,
      k3: 0,
      ag: 0.1,
      aem: 0.1,
      as: 0.1,
      aw: 0,
      G0: 1,
    };
    const a: Source = { x: 0, y: 0, q: 1, m: 1, vx: 0, vy: 0 };
    const b: Source = { x: 1, y: 0, q: 1, m: 1, vx: 0, vy: 0 };
    const f = pairwiseForce(a, b, params);
    expect(f.fx).toBeCloseTo(0.1, 4); // alpha/r^2 = 0.1
    expect(Math.abs(f.fy)).toBeLessThan(1e-6);
  });
});
