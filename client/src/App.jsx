import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wind, Activity, AlertCircle, CheckCircle2, 
  Waves, Thermometer, Droplets, Info, Map as MapIcon, Settings,
  MapPin as MapPinIcon, TrendingUp, Dumbbell
} from 'lucide-react';

const socket = io('http://localhost:3001');

const getStatus = (value) => {
  if (value < 500) return { 
    label: 'Excelente', 
    color: '#22c55e', 
    bgColor: 'rgba(34, 197, 94, 0.15)',
    advice: 'Condições excelentes! Concentração de gases extremamente baixa. Ideal para treinos de alta intensidade ao ar livre.', 
    icon: <CheckCircle2 className="w-8 h-8 text-green-400" />,
    level: 'Excelente (Ar Limpo)'
  };
  if (value < 600) return { 
    label: 'Bom', 
    color: '#84cc16', 
    bgColor: 'rgba(132, 204, 22, 0.15)',
    advice: 'Qualidade do ar muito boa. Ótimo para caminhadas e treinos moderados nos parques da cidade.', 
    icon: <CheckCircle2 className="w-8 h-8 text-lime-400" />,
    level: 'Bom (Padrão Normal)'
  };
  if (value < 1000) return { 
    label: 'Moderado', 
    color: '#eab308', 
    bgColor: 'rgba(234, 179, 8, 0.15)',
    advice: 'Qualidade aceitável, mas com concentração moderada de CO2/gases. Pessoas hipersensíveis devem evitar esforços prolongados.', 
    icon: <Activity className="w-8 h-8 text-yellow-400" />,
    level: 'Alerta Leve'
  };
  if (value < 2000) return { 
    label: 'Inadequado', 
    color: '#f97316', 
    bgColor: 'rgba(249, 115, 22, 0.15)',
    advice: 'Níveis elevados de impureza. Ar pesado e desconfortável para atividades físicas intensas. Dê preferência a treinos indoor.', 
    icon: <AlertCircle className="w-8 h-8 text-orange-400" />,
    level: 'Insalubre / Alto'
  };
  return { 
    label: 'Perigoso', 
    color: '#ef4444', 
    bgColor: 'rgba(239, 68, 68, 0.15)',
    advice: 'Níveis críticos de poluição e CO2! Risco imediato à saúde. Mantenha as janelas fechadas e evite qualquer exercício ao ar livre.', 
    icon: <AlertCircle className="w-8 h-8 text-red-400" />,
    level: 'Crítico (Muito Alto)'
  };
};

// Curitiba spots mockup configuration
const curitibaSpots = [
  { id: 'tangua', name: 'Parque Tanguá', valueMultiplier: 0.7, x: 50, y: 18, desc: 'Zona Norte. Excelente circulação atmosférica, níveis de CO2 extremamente baixos.', isGreenZone: true },
  { id: 'barigui', name: 'Parque Barigui', valueMultiplier: 0.8, x: 22, y: 42, desc: 'Zona Oeste. Preservado cinturão verde, ideal para corridas e práticas de esporte na grama.', isGreenZone: true },
  { id: 'centro', name: 'Centro (Rua XV)', valueMultiplier: 1.35, x: 50, y: 50, desc: 'Região Central. Concentração de poluentes decorrentes de tráfego intenso e comércio.', isGreenZone: false },
  { id: 'botanico', name: 'Jardim Botânico', valueMultiplier: 0.85, x: 74, y: 55, desc: 'Zona Leste. Ponto turístico com amplo bosque de preservação e excelente dispersão.', isGreenZone: true },
  { id: 'batel', name: 'Avenida Batel', valueMultiplier: 1.2, x: 38, y: 58, desc: 'Região Oeste/Central. Fluxo viário constante produzindo moderada emissão de CO2.', isGreenZone: false },
  { id: 'cic', name: 'Cidade Industrial (CIC)', valueMultiplier: 1.7, x: 26, y: 78, desc: 'Zona Sul. Polo industrial da capital, maior presença histórica de material particulado.', isGreenZone: false },
];

function App() {
  const [sensorValue, setSensorValue] = useState(480); // Default start around 480 PPM
  const [data, setData] = useState({ value: 480, timestamp: null, simulated: true });
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [history, setHistory] = useState(new Array(20).fill(480));

  // Determine current active spot or main sensor
  const activeSpot = selectedSpot ? curitibaSpots.find(s => s.id === selectedSpot) : null;
  const displayValue = activeSpot ? Math.floor(sensorValue * activeSpot.valueMultiplier) : sensorValue;
  const status = getStatus(displayValue);

  useEffect(() => {
    socket.on('air_data', (payload) => {
      setSensorValue(payload.value);
      setData(payload);
      setHistory(prev => [...prev.slice(1), payload.value]);
    });

    return () => socket.off('air_data');
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-12 flex flex-col items-center">
      
      {/* Navbar UI */}
      <nav className="w-full max-w-6xl flex justify-between items-center mb-12 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Waves className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">AIR<span className="text-blue-500">CAST</span></h1>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Curitiba PPM Map</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedSpot(null)}
            className={`badge transition-all flex items-center gap-1.5 ${!selectedSpot ? 'badge-success ring-2 ring-emerald-500/50' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <MapPinIcon size={12} /> Sensor Geral COM45
          </button>
          <div className={`badge ${data.simulated ? 'badge-warning' : 'badge-success'}`}>
            {data.simulated ? 'Simulação' : 'Sensor Online'}
          </div>
        </div>
      </nav>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Dashboard Stats */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Main Air Status Card */}
          <motion.div 
            layout
            className={`glass p-8 relative overflow-hidden flex flex-col min-h-[360px] justify-between transition-shadow duration-500 ${displayValue > 1000 ? 'glow-red' : 'glow-green'}`}
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
            
            <div className="flex justify-between items-start z-10">
              <div>
                <p className="card-title text-slate-500">
                  {selectedSpot ? `Ponto Selecionado: ${activeSpot.name}` : 'Estação Principal (Minha Localização)'}
                </p>
                <h2 className="text-6xl font-black tracking-tighter mb-2" style={{ color: status.color }}>
                  {status.label}
                </h2>
                <p className="text-slate-400 font-medium flex items-center gap-2 italic">
                  <TrendingUp size={16} className="text-blue-400" /> Índice de Risco: {status.level}
                </p>
              </div>
              <div className="text-right">
                <p className="text-8xl font-black text-white leading-none">
                  {displayValue}
                </p>
                <p className="text-sm font-bold text-slate-500 tracking-widest mt-2">PPM (Partes por Milhão)</p>
              </div>
            </div>

            {/* Description & Action */}
            <div className="my-6 z-10 max-w-xl">
              <p className="text-sm text-slate-300">
                {activeSpot ? activeSpot.desc : 'Mostrando índice de referência de gases de poluentes medidos em PPM pelo sensor MQ135 conectado via COM45.'}
              </p>
            </div>

            {/* Scale Visual progress */}
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mt-2 relative">
              <motion.div 
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((displayValue / 2500) * 100, 100)}%` }}
                style={{ backgroundColor: status.color }}
              />
              <div className="absolute top-0 left-[20%] w-[1px] h-full bg-black/40"></div>
              <div className="absolute top-0 left-[24%] w-[1px] h-full bg-black/40"></div>
              <div className="absolute top-0 left-[40%] w-[1px] h-full bg-black/40"></div>
              <div className="absolute top-0 left-[80%] w-[1px] h-full bg-black/40"></div>
            </div>
            
            <div className="flex justify-between text-[9px] text-slate-500 font-bold px-1 mt-1">
              <span>EXCELENTE (400-500)</span>
              <span>BOM (500-600)</span>
              <span>MODERADO (600-1000)</span>
              <span>INADEQUADO (1000-2000)</span>
              <span>PERIGOSO (2000+)</span>
            </div>
          </motion.div>

          {/* Interactive Blueprint Map of Curitiba */}
          <div className="glass p-8 flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MapIcon className="text-blue-400 w-5 h-5" /> Mapa Interativo de Curitiba (Mockup PPM)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Visualização espacial das regiões. Clique nos pontos para focar e ver dados específicos de qualidade do ar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* SVG Blueprint Mockup */}
              <div className="md:col-span-7 bg-[#050b16]/60 rounded-3xl border border-white/5 relative overflow-hidden aspect-[4/3] flex items-center justify-center p-4">
                
                {/* Futuristic grid background */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
                
                {/* Schematic Vector Roads of Curitiba */}
                <svg className="absolute inset-0 w-full h-full text-slate-800/40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Linha Verde */}
                  <path d="M 75 10 Q 60 45 40 90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2,2" />
                  {/* Avenida Visconde de Guarapuava / Sete de Setembro */}
                  <path d="M 10 52 L 90 58" stroke="currentColor" strokeWidth="1" />
                  <path d="M 10 56 L 90 62" stroke="currentColor" strokeWidth="1" />
                  {/* Av. Manoel Ribas */}
                  <path d="M 15 25 Q 35 40 50 50" stroke="currentColor" strokeWidth="1" />
                  {/* North ring connector */}
                  <path d="M 30 15 Q 50 25 80 15" stroke="currentColor" strokeWidth="1" />
                  {/* Center outline ring */}
                  <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                </svg>

                {/* Spot Markers */}
                {curitibaSpots.map((spot) => {
                  const val = Math.floor(sensorValue * spot.valueMultiplier);
                  const spotStatus = getStatus(val);
                  const isSelected = selectedSpot === spot.id;

                  return (
                    <button
                      key={spot.id}
                      onClick={() => setSelectedSpot(spot.id)}
                      className="absolute group transition-transform hover:scale-125 focus:outline-none"
                      style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      {/* Pulse effect */}
                      <span className="absolute inline-flex h-6 w-6 rounded-full opacity-40 animate-ping" style={{ backgroundColor: spotStatus.color }}></span>
                      
                      {/* Base Dot */}
                      <span 
                        className={`relative flex items-center justify-center rounded-full w-5 h-5 border-2 transition-all duration-300 ${isSelected ? 'scale-125 ring-4 ring-white/20' : ''}`}
                        style={{ backgroundColor: '#0b0f19', borderColor: spotStatus.color }}
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: spotStatus.color }}></span>
                      </span>

                      {/* Tooltip Hover card */}
                      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 z-50 bg-[#090f1d] border border-white/10 px-3 py-1.5 rounded-xl shadow-2xl pointer-events-none w-36 text-center">
                        <p className="text-[10px] font-bold text-white whitespace-nowrap">{spot.name}</p>
                        <p className="text-xs font-black" style={{ color: spotStatus.color }}>{val} PPM</p>
                      </div>
                    </button>
                  );
                })}

                <div className="absolute bottom-3 left-3 bg-[#0a0f1d]/90 border border-white/5 px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wider text-slate-400">
                  ESQUEMA MAPA CURITIBA
                </div>
              </div>

              {/* Spot list with High/Low details */}
              <div className="md:col-span-5 flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-1">
                {curitibaSpots.map((spot) => {
                  const val = Math.floor(sensorValue * spot.valueMultiplier);
                  const spotStatus = getStatus(val);
                  const isSelected = selectedSpot === spot.id;

                  return (
                    <div 
                      key={spot.id}
                      onClick={() => setSelectedSpot(spot.id)}
                      className={`flex justify-between items-center p-3.5 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'bg-white/10 border-white/20 shadow-lg' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-xs text-white">{spot.name}</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {spot.isGreenZone ? '🍀 Área Verde (Baixo PPM)' : '🏭 Zona Urbana (Alto PPM)'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-sm block" style={{ color: spotStatus.color }}>{val} PPM</span>
                        <span className="text-[8px] font-bold uppercase text-slate-500 tracking-widest">{spotStatus.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

        {/* Sidebar - Training & Forecast */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Training Advisor card */}
          <div className="glass p-8 flex flex-col items-center text-center relative overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
            <div className="p-5 rounded-3xl bg-blue-600/20 text-blue-400 mb-6 animate-float">
              <Dumbbell size={42} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-2xl font-black mb-4">Treino & Esportes</h3>
            
            <div className="flex items-center gap-3 px-5 py-3.5 bg-white/5 rounded-2xl mb-6 w-full justify-center" style={{ borderLeft: `4px solid ${status.color}` }}>
              <span className="text-2xl">{status.icon}</span>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-500 uppercase leading-none mb-1">RECOMENDAÇÃO</p>
                <p className="font-bold text-base leading-tight" style={{ color: status.color }}>
                  {displayValue < 600 ? 'Treino Recomendado!' : displayValue < 1000 ? 'Cuidado Moderado' : 'Evite Treinar'}
                </p>
              </div>
            </div>

            <p className="text-slate-300 font-medium leading-relaxed text-sm mb-6">
              "{status.advice}"
            </p>

            <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-left flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-bold">Esporte recomendado</span>
                <span className="text-xs font-bold text-white">
                  {displayValue < 500 ? 'Corrida / Ciclismo' : displayValue < 600 ? 'Caminhada rápida' : displayValue < 1000 ? 'Yoga / Alongamento' : 'Treino Indoor'}
                </span>
              </div>
              <div className="w-full h-[1px] bg-white/5"></div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-bold">Filtro de Máscara</span>
                <span className="text-xs font-bold" style={{ color: displayValue > 1000 ? '#ef4444' : '#64748b' }}>
                  {displayValue > 1000 ? 'Recomendado N95' : 'Desnecessário'}
                </span>
              </div>
            </div>

            <button className="w-full mt-6 py-4.5 bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-900/40 transition-all rounded-2xl font-black text-xs uppercase tracking-widest text-white">
              Simular Melhor Horário
            </button>
          </div>

          {/* Quick info widgets */}
          <div className="glass p-6 flex flex-col gap-4">
            <p className="card-title mb-0 flex items-center gap-2"><Info size={14} /> Telemetria de Curitiba</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Temperatura</p>
                <p className="text-lg font-black text-white mt-1">19°C</p>
                <span className="text-[9px] text-slate-400">Curitiba Padrão</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Umidade</p>
                <p className="text-lg font-black text-white mt-1">82%</p>
                <span className="text-[9px] text-slate-400">Umidade alta</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      <footer className="mt-20 pb-8 w-full max-w-6xl flex flex-col md:flex-row justify-between items-center text-slate-600 border-t border-white/5 pt-8 px-4 gap-4">
        <p className="text-xs font-medium">© 2026 AIRCAST PRO SYSTEM. SIMULAÇÃO ESPACIAL DE POLUIÇÃO PARA CURITIBA EM PPM.</p>
        <div className="flex gap-6">
          <Activity size={16} />
          <Wind size={16} />
          <Waves size={16} />
        </div>
      </footer>
    </div>
  );
}

export default App;
