import { Source, pairwiseForce } from './forces';
import { AlphaParams } from './alpha';

export function velocityVerlet(sources: Source[], dt: number, p: AlphaParams) {
  const forces: { fx: number; fy: number }[] = sources.map(() => ({ fx: 0, fy: 0 }));
  for (let i = 0; i < sources.length; i++) {
    for (let j = i + 1; j < sources.length; j++) {
      const f = pairwiseForce(sources[i], sources[j], p);
      forces[i].fx += f.fx;
      forces[i].fy += f.fy;
      forces[j].fx -= f.fx;
      forces[j].fy -= f.fy;
    }
  }
  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    const ax = forces[i].fx / s.m;
    const ay = forces[i].fy / s.m;
    s.x += s.vx * dt + 0.5 * ax * dt * dt;
    s.y += s.vy * dt + 0.5 * ay * dt * dt;
    s.vx += ax * dt;
    s.vy += ay * dt;
  }
}
