// ── Air Quality Utility Functions & Constants ──

export const STATUS_COLORS = {
  excelente: { main: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', glow: 'rgba(34, 197, 94, 0.25)' },
  bom:       { main: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', glow: 'rgba(59, 130, 246, 0.25)' },
  moderado:  { main: '#eab308', bg: 'rgba(234, 179, 8, 0.15)',  glow: 'rgba(234, 179, 8, 0.25)' },
  inadequado:{ main: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', glow: 'rgba(249, 115, 22, 0.25)' },
  perigoso:  { main: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)',  glow: 'rgba(239, 68, 68, 0.25)' },
};

export const SCALE_SEGMENTS = [
  { label: 'Excelente', range: '0–400',    min: 0,    max: 400,  color: STATUS_COLORS.excelente.main },
  { label: 'Bom',       range: '400–700',  min: 400,  max: 700,  color: STATUS_COLORS.bom.main },
  { label: 'Moderado',  range: '700–1000', min: 700,  max: 1000, color: STATUS_COLORS.moderado.main },
  { label: 'Inadequado',range: '1000–2000',min: 1000, max: 2000, color: STATUS_COLORS.inadequado.main },
  { label: 'Perigoso',  range: '2000+',    min: 2000, max: 3000, color: STATUS_COLORS.perigoso.main },
];

export const getStatus = (value) => {
  if (value < 400) return {
    label: 'Excelente',
    color: STATUS_COLORS.excelente.main,
    bgColor: STATUS_COLORS.excelente.bg,
    glowColor: STATUS_COLORS.excelente.glow,
    advice: 'Ar muito limpo, níveis basais naturais. Excelente para treinos cardiovasculares e alta intensidade ao ar livre.',
    level: 'Ar muito limpo',
    emoji: '🌿',
    sport: 'Corrida / Ciclismo',
    mask: false,
    training: 'Treino Recomendado!',
  };
  if (value < 700) return {
    label: 'Bom',
    color: STATUS_COLORS.bom.main,
    bgColor: STATUS_COLORS.bom.bg,
    glowColor: STATUS_COLORS.bom.glow,
    advice: 'Concentração de gases muito boa e segura. Ótimo para caminhadas e treinos.',
    level: 'Concentração muito boa',
    emoji: '🔵',
    sport: 'Corrida / Caminhada',
    mask: false,
    training: 'Treino Recomendado!',
  };
  if (value < 1000) return {
    label: 'Moderado',
    color: STATUS_COLORS.moderado.main,
    bgColor: STATUS_COLORS.moderado.bg,
    glowColor: STATUS_COLORS.moderado.glow,
    advice: 'Concentração aceitável, mas com alerta de cautela para pessoas sensíveis ou treinos extremos de longa duração.',
    level: 'Alerta de Cautela',
    emoji: '⚠️',
    sport: 'Treino Moderado / Alongamento',
    mask: false,
    training: 'Atenção / Moderado',
  };
  if (value < 2000) return {
    label: 'Inadequado',
    color: STATUS_COLORS.inadequado.main,
    bgColor: STATUS_COLORS.inadequado.bg,
    glowColor: STATUS_COLORS.inadequado.glow,
    advice: 'Ar pesado e com índices elevados de gases. O aplicativo aconselhará treinos indoor.',
    level: 'Ar pesado',
    emoji: '🏭',
    sport: 'Treino Indoor',
    mask: true,
    training: 'Treino Indoor Aconselhado',
  };
  return {
    label: 'Perigoso',
    color: STATUS_COLORS.perigoso.main,
    bgColor: STATUS_COLORS.perigoso.bg,
    glowColor: STATUS_COLORS.perigoso.glow,
    advice: 'Níveis altamente insalubres e perigosos. Treinos externos totalmente suspensos.',
    level: 'Altamente Insalubre',
    emoji: '☠️',
    sport: 'Treino Externo Suspenso',
    mask: true,
    training: 'Treinos Suspensos!',
  };
};

// Curitiba monitoring spots with real coordinates and three distinct zone types:
// 1. Green (Parques e Jardins) -> Oscila entre Excelente / Bom (0-700 PPM)
// 2. Urban (Zona Urbana/Comercial) -> Oscila em Moderado (700-1000 PPM)
// 3. Industrial (Cidade Industrial) -> Oscila entre Moderado / Inadequado (700-2000 PPM)
export const curitibaSpots = [
  {
    id: 'tangua',
    name: 'Parque Tanguá',
    valueMultiplier: 0.45, // Excelente / Bom
    lat: -25.3807,
    lng: -49.2825,
    desc: 'Região de preservação com densa cobertura vegetal e excelente circulação de ar puro.',
    zoneType: 'green',
    zoneLabel: '🍀 Parques e Jardins',
  },
  {
    id: 'tingui',
    name: 'Parque Tingui',
    valueMultiplier: 0.52, // Excelente / Bom
    lat: -25.3958,
    lng: -49.3045,
    desc: 'Borda linear verde preservada ao longo do Rio Barigui. Presença abundante de ar puro.',
    zoneType: 'green',
    zoneLabel: '🍀 Parques e Jardins',
  },
  {
    id: 'barigui',
    name: 'Parque Barigui',
    valueMultiplier: 0.58, // Excelente / Bom
    lat: -25.4231,
    lng: -49.3115,
    desc: 'Ampla área verde e lagos que favorecem a purificação natural do ar. Excelente para corrida.',
    zoneType: 'green',
    zoneLabel: '🍀 Parques e Jardins',
  },
  {
    id: 'botanico',
    name: 'Jardim Botânico',
    valueMultiplier: 0.48, // Excelente / Bom
    lat: -25.4414,
    lng: -49.2363,
    desc: 'Estufa icônica cercada por bosques e jardins franceses preservados com excelente qualidade.',
    zoneType: 'green',
    zoneLabel: '🍀 Parques e Jardins',
  },
  {
    id: 'centro',
    name: 'Centro (Rua XV)',
    valueMultiplier: 0.95, // Moderado
    lat: -25.4290,
    lng: -49.2710,
    desc: 'Fluxo constante de pedestres e tráfego urbano típico. Nível aceitável com cautela sutil.',
    zoneType: 'urban',
    zoneLabel: '🏙️ Centro e Comercial',
  },
  {
    id: 'batel',
    name: 'Avenida Batel',
    valueMultiplier: 0.88, // Moderado
    lat: -25.4375,
    lng: -49.2900,
    desc: 'Zona comercial/residencial de alta circulação de veículos. Níveis moderados estáveis.',
    zoneType: 'urban',
    zoneLabel: '🏙️ Centro e Comercial',
  },
  {
    id: 'cic',
    name: 'Cidade Industrial (CIC)',
    valueMultiplier: 1.35, // Moderado / Inadequado
    lat: -25.4950,
    lng: -49.3480,
    desc: 'Região industrial de Curitiba. Níveis de gases oscilando entre moderado e inadequado.',
    zoneType: 'industrial',
    zoneLabel: '🏭 Área Industrial',
  },
];

export const formatTimestamp = (isoString) => {
  if (!isoString) return '--:--:--';
  const d = new Date(isoString);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};
