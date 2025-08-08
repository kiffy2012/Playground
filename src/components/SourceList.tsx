import React from 'react';
import { useStore } from '../sim/store';

const SourceList: React.FC = () => {
  const sources = useStore((s) => s.sources);
  return (
    <div>
      <h3>Sources</h3>
      <ul>
        {sources.map((s, i) => (
          <li key={i}>
            q={s.q.toFixed(2)} x={s.x.toFixed(1)} y={s.y.toFixed(1)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SourceList;
