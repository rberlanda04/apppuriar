import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Wind, MapPin, Palette } from 'lucide-react';

export default function BrandConcept() {
  const brandPillars = [
    {
      title: 'Jardim Botânico',
      desc: 'O ícone central da estufa representa a conexão direta com a capital ecológica do Brasil, Curitiba, fundamentando o projeto na sua identidade local.',
      icon: MapPin,
      color: '#3b82f6',
    },
    {
      title: 'Brisa em Movimento',
      desc: 'As linhas dinâmicas de vento com a flecha ascendente simbolizam o fluxo contínuo do ar e a precisão tecnológica do monitoramento em tempo real.',
      icon: Wind,
      color: '#06b6d4',
    },
    {
      title: 'Folha de Preservação',
      desc: 'A folha verde na base representa o poder do ecossistema natural, a sustentabilidade e a busca pela pureza do ar em áreas urbanas.',
      icon: Leaf,
      color: '#22c55e',
    },
    {
      title: 'Paleta Degradê',
      desc: 'A transição harmônica do verde biofílico ao azul tecnológico reflete a fusão perfeita entre a preservação ambiental e a telemetria moderna.',
      icon: Palette,
      color: '#8b5cf6',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="glass brand-concept-card"
      style={{ padding: 24, display: 'flex', flexDirection: 'col', gap: 16 }}
    >
      <div>
        <p className="card-label">Identidade Visual Breezy</p>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: 8, color: '#fff' }}>
          O Conceito por Trás da Marca
        </h3>
        <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
          A marca **Breezy** nasceu para traduzir tecnologia e natureza em um ecossistema visual fluido e intuitivo. Conheça os pilares de nossa identidade:
        </p>
      </div>

      {/* Logo Showcase with rotating/floating animation */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'relative',
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.04)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          <img 
            src="/breezy_logo.jpg" 
            alt="Breezy Circle Logo" 
            style={{ width: '85%', height: '85%', objectFit: 'contain' }} 
          />
        </motion.div>
      </div>

      {/* Brand Pillars Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {brandPillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              style={{
                display: 'flex',
                gap: 12,
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.03)',
                borderRadius: 14,
                padding: 12,
                alignItems: 'flex-start',
              }}
            >
              <div 
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: `${pillar.color}15`,
                  color: pillar.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <Icon size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#e2e8f0', marginBottom: 2 }}>
                  {pillar.title}
                </h4>
                <p style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                  {pillar.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
