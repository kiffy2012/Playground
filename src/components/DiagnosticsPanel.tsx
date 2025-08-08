import React from 'react';
import { useStore } from '../sim/store';

const DiagnosticsPanel: React.FC = () => {
  const diagnostics = useStore((s) => s.diagnostics);
  return (
    <div style={{ width: '200px', padding: '0.5rem', background: '#222' }}>
      <div>FPS: {diagnostics.fps.toFixed(1)}</div>
      <div>Energy: {diagnostics.energy.toFixed(3)}</div>
    </div>
  );
};

export default DiagnosticsPanel;
