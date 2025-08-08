export const clamp = (x: number, a: number, b: number) => Math.min(Math.max(x, a), b);
export function mppToDomain(mpp: number, nx: number, ny: number) {
  return { width: mpp * nx, height: mpp * ny };
}
