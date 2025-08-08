import React, { useEffect, useRef } from 'react';
import { useStore } from '../sim/store';

const Canvas2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useStore((s) => s.frame);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = frame.width;
    canvas.height = frame.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new ImageData(frame.width, frame.height);
    img.data.set(frame.pixels);
    ctx.putImageData(img, 0, 0);
  }, [frame]);
  return <canvas ref={canvasRef} style={{ flex: 1 }} />;
};

export default Canvas2D;
