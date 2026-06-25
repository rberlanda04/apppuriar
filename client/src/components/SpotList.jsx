import React from 'react';
import { motion } from 'framer-motion';
import { getStatus } from '../utils/airQuality';

export default function SpotList({ spots, sensorValue, selectedSpot, onSelectSpot }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="glass spot-list-card"
    >
      <p className="card-label">Regiões Monitoradas</p>

      <div className="spot-list-scroll">
        {spots.map((spot, i) => {
          const val = Math.floor(sensorValue * spot.valueMultiplier);
          const spotStatus = getStatus(val);
          const isSelected = selectedSpot === spot.id;

          return (
            <motion.button
              key={spot.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              onClick={() => onSelectSpot(isSelected ? null : spot.id)}
              className={`spot-item ${isSelected ? 'spot-item-active' : ''}`}
            >
              {/* Color dot */}
              <div className="spot-dot-wrapper">
                <span
                  className="spot-dot"
                  style={{ backgroundColor: spotStatus.color }}
                />
                {isSelected && (
                  <span
                    className="spot-dot-ring"
                    style={{ borderColor: spotStatus.color }}
                  />
                )}
              </div>

              {/* Info */}
              <div className="spot-info">
                <span className="spot-name">{spot.name}</span>
                <span className="spot-zone">
                  {spot.zoneLabel}
                </span>
              </div>

              {/* Value */}
              <div className="spot-value-block">
                <span className="spot-value" style={{ color: spotStatus.color }}>
                  {val}
                </span>
                <span className="spot-unit">PPM</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
