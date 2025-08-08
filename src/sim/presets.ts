import { AlphaParams, defaultParams } from '../physics/alpha';
import { Preset } from './store';

export interface PresetConfig {
  params: Partial<AlphaParams>;
  grid: { nx: number; ny: number; dx: number; dy: number };
}

export const presets: Record<Preset, PresetConfig> = {
  kepler: {
    params: { ag: 1e-8, aem: 1 / 137, as: 1.5, aw: 0.05 },
    grid: { nx: 64, ny: 64, dx: 1e7, dy: 1e7 },
  },
  atomic: {
    params: { ag: 1e-8, aem: 1 / 137, as: 1.5, aw: 0.03 },
    grid: { nx: 64, ny: 64, dx: 1e-10, dy: 1e-10 },
  },
  strong: {
    params: { ag: 1e-8, aem: 1 / 137, as: 1.8, aw: 0.03 },
    grid: { nx: 64, ny: 64, dx: 1e-15, dy: 1e-15 },
  },
  custom: {
    params: {},
    grid: { nx: 64, ny: 64, dx: 1, dy: 1 },
  },
};

export function buildParams(p: Preset): AlphaParams {
  return { ...defaultParams, ...presets[p].params } as AlphaParams;
}
