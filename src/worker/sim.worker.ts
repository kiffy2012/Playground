import { alphaU, AlphaParams, defaultParams } from '../physics/alpha';
import { createField, Grid, updateEps } from '../physics/fabric';
import { createGammaMask, stepField } from '../physics/pde_cpu';
import { velocityVerlet } from '../physics/integrators';
import { Source } from '../physics/forces';

interface InitMsg {
  type: 'init';
  grid: Grid;
  params: AlphaParams;
  mode: 'pair' | 'field';
}
interface StartMsg { type: 'start'; }
interface StopMsg { type: 'stop'; }
interface StepMsg { type: 'step'; dt: number; }

type Msg = InitMsg | StartMsg | StopMsg | StepMsg;

let running = false;
let grid: Grid = { nx: 64, ny: 64, dx: 1, dy: 1 };
let params: AlphaParams = defaultParams;
let field = createField(grid);
let gamma = createGammaMask(grid, 0, 8, 0.1);
let mode: 'pair' | 'field' = 'field';
const sources: Source[] = [];

function step(dt: number) {
  if (mode === 'pair') {
    velocityVerlet(sources, dt, params);
  } else {
    stepField(field, grid, { c: 1, gamma, dt });
    updateEps(field, grid, params);
  }
  const pixels = new Uint8ClampedArray(grid.nx * grid.ny * 4);
  for (let i = 0; i < grid.nx * grid.ny; i++) {
    const v = field.phi[i] * 255 + 128;
    pixels[i * 4 + 0] = v;
    pixels[i * 4 + 1] = v;
    pixels[i * 4 + 2] = v;
    pixels[i * 4 + 3] = 255;
  }
  (self as any).postMessage({ type: 'frame', width: grid.nx, height: grid.ny, pixels });
}

function loop() {
  if (!running) return;
  step(0.01);
  setTimeout(loop, 16);
}

(self as any).onmessage = (e: MessageEvent<Msg>) => {
  const m = e.data;
  if (m.type === 'init') {
    grid = m.grid;
    params = m.params;
    mode = m.mode;
    field = createField(grid);
    gamma = createGammaMask(grid, 0, 8, 0.1);
    updateEps(field, grid, params);
  } else if (m.type === 'start') {
    running = true;
    loop();
  } else if (m.type === 'stop') {
    running = false;
  } else if (m.type === 'step') {
    step(m.dt);
  }
};
