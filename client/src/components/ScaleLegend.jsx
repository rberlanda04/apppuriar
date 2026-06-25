import React from 'react';
import { SCALE_SEGMENTS } from '../utils/airQuality';

export default function ScaleLegend({ currentValue }) {
  // Map value to percentage position (0–3000 range)
  const minVal = 0;
  const maxVal = 3000;
  const pct = Math.min(Math.max(((currentValue - minVal) / (maxVal - minVal)) * 100, 0), 100);

  return (
    <div className="scale-legend">
      {/* Segmented bar */}
      <div className="scale-bar">
        {SCALE_SEGMENTS.map((seg, i) => {
          const segWidth = ((seg.max - seg.min) / (maxVal - minVal)) * 100;
          return (
            <div
              key={seg.label}
              className="scale-segment"
              style={{
                width: `${segWidth}%`,
                backgroundColor: seg.color,
                opacity: 0.8,
                borderRadius: i === 0 ? '6px 0 0 6px' : i === SCALE_SEGMENTS.length - 1 ? '0 6px 6px 0' : '0',
              }}
            />
          );
        })}
        {/* Current position needle */}
        <div
          className="scale-needle"
          style={{ left: `${pct}%` }}
        >
          <div className="scale-needle-head" />
        </div>
      </div>

      {/* Labels */}
      <div className="scale-labels">
        {SCALE_SEGMENTS.map((seg) => (
          <div key={seg.label} className="scale-label-item" style={{ color: seg.color }}>
            <span className="scale-label-name">{seg.label}</span>
            <span className="scale-label-range">{seg.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
