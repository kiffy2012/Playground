import React from 'react';
import ModeSwitch from './ModeSwitch';
import PresetBadge from './PresetBadge';
import { useStore } from '../sim/store';

const ControlPanel: React.FC = () => {
  const running = useStore((s) => s.running);
  const start = useStore((s) => s.start);
  const stop = useStore((s) => s.stop);
  const preset = useStore((s) => s.preset);
  const applyPreset = useStore((s) => s.applyPreset);

  return (
    <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', background: '#222' }}>
      <ModeSwitch />
      <button onClick={running ? stop : start}>{running ? 'Pause' : 'Play'}</button>
      <select value={preset} onChange={(e) => applyPreset(e.target.value as any)}>
        <option value="kepler">Kepler</option>
        <option value="atomic">Atomic-ish</option>
        <option value="strong">Strong-ish</option>
        <option value="custom">Custom</option>
      </select>
      <PresetBadge />
    </div>
  );
};

export default ControlPanel;
