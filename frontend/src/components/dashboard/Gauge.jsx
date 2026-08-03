import { useEffect, useRef } from 'react';

export default function Gauge({ value, label, subA, subB, meta }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    
    const cx = W / 2, cy = H - 2, r = H - 8;
    const angle = (Math.min(value, 100) / 100) * Math.PI;
    
    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Foreground arc (gradient)
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#ef4444'); // Red
    grad.addColorStop(0.5, '#f59e0b'); // Orange
    grad.addColorStop(1, '#10b981'); // Green
    
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, Math.PI + angle);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 10;
    ctx.stroke();

    // Needle
    const nx = cx + r * 0.7 * Math.cos(Math.PI + angle);
    const ny = cy + r * 0.7 * Math.sin(Math.PI + angle);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;


    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.stroke();
    
    // Center dot
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
    ctx.fill();
  }, [value]);

  return (
    <div className="kpi-gauge-row">
      <div className="gauge-canvas-wrap">
        <canvas ref={canvasRef} width={80} height={45} />
      </div>
      <div className="kpi-gauge-info">
        <div className="kpi-num">{value}%</div>
        {subA !== undefined && (
          <div className="kpi-sub-row">
            <span className="kpi-sub-a">F.A: {subA}%</span>
            <span className="kpi-sub-sep">|</span>
            <span className="kpi-sub-b">F.B: {subB}%</span>
          </div>
        )}
        <div className="kpi-meta">{meta}</div>
      </div>
    </div>
  );
}

