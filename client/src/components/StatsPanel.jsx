import React from 'react';

const CATEGORIES = {
  organico:   { label: 'Orgânico',   className: 'organic',    icon: '🥬' },
  reciclavel: { label: 'Reciclável', className: 'recyclable', icon: '♻️' },
  eletronico: { label: 'Eletrônico', className: 'electronic', icon: '🔌' },
};

function StatsPanel({ history, stats }) {
  const { total = 0, organic = 0, recyclable = 0, electronic = 0, avgConfidence = 0 } = stats || {};

  const pctOrganic    = total > 0 ? Math.round((organic / total) * 100) : 0;
  const pctRecyclable = total > 0 ? Math.round((recyclable / total) * 100) : 0;
  const pctElectronic = total > 0 ? Math.round((electronic / total) * 100) : 0;

  const recentHistory = (history || []).slice(-10).reverse();

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getCategoryClass = (category) => {
    if (category === 'organico') return 'organic';
    if (category === 'reciclavel') return 'recyclable';
    return 'electronic';
  };

  const getCategoryLabel = (category) => {
    return CATEGORIES[category]?.label || category;
  };

  return (
    <div className="stats-panel">
      <h3 className="stats-panel-title">
        📊 Painel de Estatísticas
      </h3>

      {/* Stat counters */}
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value total">{total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-item">
          <div className="stat-value organic">{organic}</div>
          <div className="stat-label">Orgânico</div>
        </div>
        <div className="stat-item">
          <div className="stat-value recyclable">{recyclable}</div>
          <div className="stat-label">Reciclável</div>
        </div>
        <div className="stat-item">
          <div className="stat-value electronic">{electronic}</div>
          <div className="stat-label">Eletrônico</div>
        </div>
      </div>

      {/* Distribution bar */}
      <div className="distribution-section">
        <h4 className="distribution-title">Distribuição</h4>
        <div className="distribution-bar-container">
          <div
            className="distribution-segment organic"
            style={{ width: `${pctOrganic}%` }}
          />
          <div
            className="distribution-segment recyclable"
            style={{ width: `${pctRecyclable}%` }}
          />
          <div
            className="distribution-segment electronic"
            style={{ width: `${pctElectronic}%` }}
          />
        </div>
        <div className="distribution-legend">
          <div className="legend-item">
            <span className="legend-dot organic" />
            🥬 Orgânico
            <span className="legend-percentage">{pctOrganic}%</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot recyclable" />
            ♻️ Reciclável
            <span className="legend-percentage">{pctRecyclable}%</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot electronic" />
            🔌 Eletrônico
            <span className="legend-percentage">{pctElectronic}%</span>
          </div>
        </div>
      </div>

      {/* Average confidence */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-item" style={{ gridColumn: '1 / -1' }}>
          <div className="stat-value confidence">
            {avgConfidence > 0 ? `${Math.round(avgConfidence * 100)}%` : '—'}
          </div>
          <div className="stat-label">Confiança Média da IA</div>
        </div>
      </div>

      {/* Recent history */}
      <div className="history-section">
        <h4 className="history-title">Histórico Recente</h4>
        <div className="history-list">
          {recentHistory.length > 0 ? (
            recentHistory.map((item, index) => (
              <div
                className="history-item"
                key={item.id || index}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className={`history-dot ${getCategoryClass(item.category)}`} />
                <div className="history-item-info">
                  <div className="history-item-name">
                    {item.name || item.item || 'Item'}
                  </div>
                  <div className="history-item-category">
                    {getCategoryLabel(item.category)}
                  </div>
                </div>
                <span className="history-item-time">
                  {formatTime(item.timestamp)}
                </span>
              </div>
            ))
          ) : (
            <div className="empty-history">
              Nenhuma classificação registrada ainda
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
