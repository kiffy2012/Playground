import React from 'react';
import { useStore } from '../sim/store';

const PresetBadge: React.FC = () => {
  const preset = useStore((s) => s.preset);
  return <span style={{ marginLeft: 'auto' }}>{preset}</span>;
};

export default PresetBadge;
