import React, { useEffect } from 'react';
import { useStore } from './sim/store';
import ControlPanel from './components/ControlPanel';
import Canvas2D from './components/Canvas2D';
import DiagnosticsPanel from './components/DiagnosticsPanel';

const App: React.FC = () => {
  const init = useStore((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ControlPanel />
      <div style={{ flex: 1, display: 'flex' }}>
        <Canvas2D />
        <DiagnosticsPanel />
      </div>
    </div>
  );
};

export default App;
