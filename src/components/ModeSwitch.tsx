import React from 'react';
import { useStore } from '../sim/store';

const ModeSwitch: React.FC = () => {
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  return (
    <select value={mode} onChange={(e) => setMode(e.target.value as any)}>
      <option value="pair">Pairwise</option>
      <option value="field">Field</option>
    </select>
  );
};

export default ModeSwitch;
