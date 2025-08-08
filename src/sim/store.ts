import { useSyncExternalStore } from 'react';
import { defaultParams, AlphaParams } from '../physics/alpha';
import { createField, FieldState, Grid, updateEps } from '../physics/fabric';
import { createGammaMask, stepField } from '../physics/pde_cpu';
import { Source } from '../physics/forces';
import { velocityVerlet } from '../physics/integrators';
import { presets, buildParams } from './presets';

const worker = new Worker(new URL('../worker/sim.worker.ts', import.meta.url), {
  type: 'module',
});

export type Mode = 'pair' | 'field';
export type Preset = 'kepler' | 'atomic' | 'strong' | 'custom';

interface Frame {
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
}

interface Diagnostics {
  fps: number;
  energy: number;
}

interface State {
  mode: Mode;
  preset: Preset;
  running: boolean;
  params: AlphaParams;
  sources: Source[];
  frame: Frame;
  diagnostics: Diagnostics;
  grid: Grid;
  field: FieldState;
  gamma: Float32Array;
  init: () => void;
  start: () => void;
  stop: () => void;
  setMode: (m: Mode) => void;
  applyPreset: (p: Preset) => void;
}

const listeners = new Set<() => void>();

const state: State = {
  mode: 'pair',
  preset: 'kepler',
  running: false,
  params: defaultParams,
  sources: [],
  frame: { width: 256, height: 256, pixels: new Uint8ClampedArray(256 * 256 * 4) },
  diagnostics: { fps: 0, energy: 0 },
  grid: { nx: 64, ny: 64, dx: 1, dy: 1 },
  field: createField({ nx: 64, ny: 64, dx: 1, dy: 1 }),
  gamma: createGammaMask({ nx: 64, ny: 64, dx: 1, dy: 1 }, 0, 8, 0.1),
  init() {
    worker.postMessage({ type: 'init', grid: state.grid, params: state.params, mode: state.mode });
    updateEps(state.field, state.grid, state.params);
  },
  start() {
    state.running = true;
    worker.postMessage({ type: 'start' });
    emit();
  },
  stop() {
    state.running = false;
    worker.postMessage({ type: 'stop' });
    emit();
  },
  setMode(m: Mode) {
    state.mode = m;
    worker.postMessage({ type: 'init', grid: state.grid, params: state.params, mode: state.mode });
    emit();
  },
  applyPreset(p: Preset) {
    state.preset = p;
    state.params = buildParams(p);
    const grid = presets[p].grid;
    state.grid = grid;
    state.field = createField(grid);
    state.gamma = createGammaMask(grid, 0, 8, 0.1);
    updateEps(state.field, state.grid, state.params);
    worker.postMessage({ type: 'init', grid: state.grid, params: state.params, mode: state.mode });
    emit();
  },
};

function emit() {
  listeners.forEach((l) => l());
}

worker.onmessage = (e: MessageEvent<any>) => {
  const m = e.data;
  if (m.type === 'frame') {
    state.frame = { width: m.width, height: m.height, pixels: m.pixels };
    emit();
  }
};

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => selector(state),
  );
}
