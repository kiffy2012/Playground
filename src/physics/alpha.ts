export interface AlphaParams {
  mu_em: number;
  mu_s: number;
  mu_w: number;
  k1: number;
  k2: number;
  k3: number;
  ag: number;
  aem: number;
  as: number;
  aw: number;
  G0: number;
}

export const defaultParams: AlphaParams = {
  mu_em: 1e10,
  mu_s: 1e15,
  mu_w: 1e18,
  k1: 3,
  k2: 4,
  k3: 5,
  ag: 1e-8,
  aem: 1 / 137,
  as: 1.5,
  aw: 0.05,
  G0: 0.5,
};

const sigma = (x: number) => 1 / (1 + Math.exp(-x));

export function alphaU(mu: number, p: AlphaParams = defaultParams): number {
  const safeMu = Math.max(mu, 1e-30);
  const term1 = (p.aem - p.ag) * sigma(p.k1 * Math.log(safeMu / p.mu_em));
  const term2 = (p.as - p.aem) * sigma(p.k2 * Math.log(safeMu / p.mu_s));
  const sigw = sigma(p.k3 * Math.log(safeMu / p.mu_w));
  const term3 = p.aw * sigw * Math.exp(-safeMu / p.mu_w);
  return p.ag + term1 + term2 + term3;
}

export function alphaUPrime(mu: number, p: AlphaParams = defaultParams): number {
  const safeMu = Math.max(mu, 1e-30);
  const l1 = Math.log(safeMu / p.mu_em);
  const s1 = sigma(p.k1 * l1);
  const l2 = Math.log(safeMu / p.mu_s);
  const s2 = sigma(p.k2 * l2);
  const l3 = Math.log(safeMu / p.mu_w);
  const s3 = sigma(p.k3 * l3);
  const dsigma = (k: number, s: number) => k * s * (1 - s) / safeMu;
  const d1 = (p.aem - p.ag) * dsigma(p.k1, s1);
  const d2 = (p.as - p.aem) * dsigma(p.k2, s2);
  const dw =
    p.aw * (dsigma(p.k3, s3) * Math.exp(-safeMu / p.mu_w) - s3 * Math.exp(-safeMu / p.mu_w) / p.mu_w);
  return d1 + d2 + dw;
}
