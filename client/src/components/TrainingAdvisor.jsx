import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function TrainingAdvisor({ status, displayValue }) {
  const maskRequired = status.mask;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="glass advisor-card"
    >
      {/* Icon */}
      <div className="advisor-icon-wrapper">
        <div className="advisor-icon" style={{ backgroundColor: `${status.color}15`, color: status.color }}>
          <Dumbbell size={32} strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="advisor-title">Treino & Esportes</h3>

      {/* Recommendation */}
      <div className="advisor-rec" style={{ borderLeftColor: status.color }}>
        <div>
          <p className="advisor-rec-label">RECOMENDAÇÃO</p>
          <p className="advisor-rec-value" style={{ color: status.color }}>
            {status.training}
          </p>
        </div>
      </div>

      {/* Advice text */}
      <p className="advisor-advice">"{status.advice}"</p>

      {/* Details */}
      <div className="advisor-details">
        <div className="advisor-detail-row">
          <span className="advisor-detail-label">Esporte recomendado</span>
          <span className="advisor-detail-value">{status.sport}</span>
        </div>
        <div className="advisor-divider" />
        <div className="advisor-detail-row">
          <span className="advisor-detail-label">Máscara N95</span>
          <span className="advisor-detail-value" style={{ color: maskRequired ? '#ef4444' : '#64748b' }}>
            {maskRequired ? (
              <span className="flex items-center gap-1"><ShieldAlert size={13} /> Recomendada</span>
            ) : (
              <span className="flex items-center gap-1"><ShieldCheck size={13} /> Desnecessária</span>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
