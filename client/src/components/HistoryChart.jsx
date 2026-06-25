import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { getStatus, SCALE_SEGMENTS } from '../utils/airQuality';

export default function HistoryChart({ history }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 16, bottom: 24, left: 44 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Y axis range
    const minY = 0;
    const maxY = 2500;

    // Helper: map value to Y
    const toY = (val) => padding.top + chartH - ((val - minY) / (maxY - minY)) * chartH;
    const toX = (i) => padding.left + (i / (history.length - 1)) * chartW;

    // Draw zone bands
    const zones = [
      { min: 0, max: 400, color: 'rgba(34,197,94,0.05)' },
      { min: 400, max: 700, color: 'rgba(59,130,246,0.05)' },
      { min: 700, max: 1000, color: 'rgba(234,179,8,0.05)' },
      { min: 1000, max: 2000, color: 'rgba(249,115,22,0.05)' },
      { min: 2000, max: 2500, color: 'rgba(239,68,68,0.05)' },
    ];

    zones.forEach((zone) => {
      const y1 = toY(Math.min(zone.max, maxY));
      const y2 = toY(Math.max(zone.min, minY));
      ctx.fillStyle = zone.color;
      ctx.fillRect(padding.left, y1, chartW, y2 - y1);
    });

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    [400, 700, 1000, 2000].forEach((val) => {
      const y = toY(val);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      // Y label
      ctx.fillStyle = 'rgba(148,163,184,0.5)';
      ctx.font = '9px Outfit';
      ctx.textAlign = 'right';
      ctx.fillText(val.toString(), padding.left - 6, y + 3);
    });

    if (history.length < 2) return;

    // Build smooth path
    const points = history.map((val, i) => ({ x: toX(i), y: toY(val) }));

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
    const lastStatus = getStatus(history[history.length - 1]);
    gradient.addColorStop(0, lastStatus.glowColor || 'rgba(59,130,246,0.3)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, h - padding.bottom);
    ctx.lineTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
    }
    ctx.lineTo(points[points.length - 1].x, h - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
    }
    ctx.strokeStyle = lastStatus.color || '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw last point dot
    const last = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = lastStatus.color || '#3b82f6';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(last.x, last.y, 7, 0, Math.PI * 2);
    ctx.strokeStyle = lastStatus.color || '#3b82f6';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // X axis labels
    ctx.fillStyle = 'rgba(148,163,184,0.4)';
    ctx.font = '9px Outfit';
    ctx.textAlign = 'center';
    const labelInterval = Math.max(1, Math.floor(history.length / 5));
    for (let i = 0; i < history.length; i += labelInterval) {
      const seconds = (history.length - 1 - i) * 2;
      ctx.fillText(`-${seconds}s`, toX(i), h - 6);
    }
  }, [history]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="glass chart-card"
    >
      <p className="card-label flex items-center gap-2">
        <Activity size={14} className="text-blue-400" />
        Histórico em Tempo Real
      </p>
      <canvas
        ref={canvasRef}
        className="chart-canvas"
      />
    </motion.div>
  );
}
