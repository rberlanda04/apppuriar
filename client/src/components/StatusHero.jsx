import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import ScaleLegend from './ScaleLegend';

export default function StatusHero({ displayValue, status, spotName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass hero-card"
      style={{ boxShadow: `0 0 80px ${status.glowColor}` }}
    >
      {/* Ambient glow blob */}
      <div
        className="hero-glow"
        style={{ background: `radial-gradient(circle, ${status.glowColor} 0%, transparent 70%)` }}
      />

      {/* Top row */}
      <div className="hero-top">
        <div className="hero-info">
          <p className="card-label">
            {spotName || 'Estação Principal (Sensor COM45)'}
          </p>
          <motion.h2
            key={status.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="hero-status-label"
            style={{ color: status.color }}
          >
            {status.emoji} {status.label}
          </motion.h2>
          <p className="hero-level">
            <TrendingUp size={14} className="text-blue-400" />
            Índice de Risco: {status.level}
          </p>
        </div>

        <div className="hero-value-block">
          <motion.p
            key={displayValue}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="hero-value"
          >
            {displayValue}
          </motion.p>
          <p className="hero-unit">PPM</p>
        </div>
      </div>

      {/* Advice */}
      <p className="hero-advice">
        {status.advice}
      </p>

      {/* Scale */}
      <ScaleLegend currentValue={displayValue} />
    </motion.div>
  );
}
