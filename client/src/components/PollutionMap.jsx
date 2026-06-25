import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Map as MapIcon } from 'lucide-react';
import { getStatus } from '../utils/airQuality';
import 'leaflet/dist/leaflet.css';

// Component to fly to selected spot
function FlyToSpot({ spot }) {
  const map = useMap();
  useEffect(() => {
    if (spot) {
      map.flyTo([spot.lat, spot.lng], 14, { duration: 1.2 });
    } else {
      map.flyTo([-25.4284, -49.2733], 12, { duration: 1.2 });
    }
  }, [spot, map]);
  return null;
}

export default function PollutionMap({ spots, sensorValue, selectedSpot, onSelectSpot }) {
  const activeSpot = selectedSpot ? spots.find(s => s.id === selectedSpot) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="glass map-card"
    >
      <div className="map-header">
        <p className="card-label flex items-center gap-2">
          <MapIcon size={14} className="text-blue-400" />
          Mapa Interativo de Curitiba
        </p>
        <p className="map-subtitle">
          Clique nos pontos para ver dados detalhados de qualidade do ar
        </p>
      </div>

      <div className="map-container">
        <MapContainer
          center={[-25.4284, -49.2733]}
          zoom={12}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ height: '100%', width: '100%', borderRadius: '16px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <FlyToSpot spot={activeSpot} />

          {spots.map((spot) => {
            const val = Math.floor(sensorValue * spot.valueMultiplier);
            const spotStatus = getStatus(val);
            const isSelected = selectedSpot === spot.id;

            return (
              <CircleMarker
                key={spot.id}
                center={[spot.lat, spot.lng]}
                radius={isSelected ? 14 : 10}
                pathOptions={{
                  color: spotStatus.color,
                  fillColor: spotStatus.color,
                  fillOpacity: isSelected ? 0.6 : 0.35,
                  weight: isSelected ? 3 : 2,
                }}
                eventHandlers={{
                  click: () => onSelectSpot(isSelected ? null : spot.id),
                }}
              >
                <Popup className="custom-popup">
                  <div style={{ minWidth: 180 }}>
                    <p style={{ 
                      fontWeight: 800, 
                      fontSize: 14, 
                      marginBottom: 4,
                      color: '#f1f5f9',
                      fontFamily: 'Outfit, sans-serif'
                    }}>
                      {spot.name}
                    </p>
                    <p style={{ 
                      fontSize: 28, 
                      fontWeight: 900, 
                      color: spotStatus.color,
                      lineHeight: 1,
                      margin: '8px 0 4px',
                      fontFamily: 'Outfit, sans-serif'
                    }}>
                      {val} <span style={{ fontSize: 12, fontWeight: 600 }}>PPM</span>
                    </p>
                    <p style={{ 
                      fontSize: 11, 
                      fontWeight: 700, 
                      color: spotStatus.color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 8,
                      fontFamily: 'Outfit, sans-serif'
                    }}>
                      {spotStatus.emoji} {spotStatus.label}
                    </p>
                    <p style={{ 
                      fontSize: 11, 
                      color: '#94a3b8',
                      lineHeight: 1.5,
                      fontFamily: 'Outfit, sans-serif'
                    }}>
                      {spot.desc}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </motion.div>
  );
}
