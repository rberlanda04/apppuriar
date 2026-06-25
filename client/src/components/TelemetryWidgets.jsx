import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, Sun, Info } from 'lucide-react';

const widgets = [
  { label: 'Temperatura', value: '19°C', sub: 'Curitiba média', icon: Thermometer, color: '#f97316' },
  { label: 'Umidade', value: '82%', sub: 'Umidade alta', icon: Droplets, color: '#3b82f6' },
  { label: 'Vento', value: '12 km/h', sub: 'Brisa leve', icon: Wind, color: '#06b6d4' },
  { label: 'Índice UV', value: '3', sub: 'Moderado', icon: Sun, color: '#eab308' },
];

export default function TelemetryWidgets() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.5 }}
      className="glass telemetry-card"
    >
      <p className="card-label flex items-center gap-2">
        <Info size={13} className="text-blue-400" />
        Telemetria de Curitiba
      </p>

      <div className="telemetry-grid">
        {widgets.map((w, i) => {
          const Icon = w.icon;
          return (
            <motion.div
              key={w.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="telemetry-widget"
            >
              <div className="telemetry-widget-icon" style={{ color: w.color, backgroundColor: `${w.color}12` }}>
                <Icon size={16} />
              </div>
              <p className="telemetry-widget-label">{w.label}</p>
              <p className="telemetry-widget-value">{w.value}</p>
              <p className="telemetry-widget-sub">{w.sub}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
