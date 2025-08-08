import { alphaU, alphaUPrime, AlphaParams } from './alpha';

export interface Source {
  x: number;
  y: number;
  q: number;
  m: number;
  vx: number;
  vy: number;
}

export interface ForceResult {
  fx: number;
  fy: number;
  r: number;
  alpha: number;
  potential: number;
}

export function pairwiseForce(a: Source, b: Source, p: AlphaParams): ForceResult {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const r2 = dx * dx + dy * dy;
  const r = Math.sqrt(r2) + 1e-12;
  const mu = 1 / r;
  const alpha = alphaU(mu, p);
  const dalpha = alphaUPrime(mu, p);
  const coef = p.G0 * a.q * b.q;
  const fmag = coef * (alpha / (r2) + dalpha / (r2 * r));
  return {
    fx: fmag * (dx / r),
    fy: fmag * (dy / r),
    r,
    alpha,
    potential: -coef * alpha / r,
  };
}
