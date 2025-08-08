import { describe, it, expect } from 'vitest';
import { alphaU, alphaUPrime, defaultParams } from '../src/physics/alpha';

describe('alphaU', () => {
  it('approaches plateaus', () => {
    const p = { ...defaultParams };
    const low = alphaU(1e5, p);
    const mid = alphaU(1e12, p);
    const high = alphaU(1e19, p);
    expect(low).toBeCloseTo(p.ag, 5);
    expect(mid).toBeGreaterThan(low);
    expect(high).toBeLessThanOrEqual(p.as + p.aw);
  });
  it('derivative finite', () => {
    const d = alphaUPrime(1e10, defaultParams);
    expect(Number.isFinite(d)).toBe(true);
  });
});
