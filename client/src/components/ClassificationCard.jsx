import React from 'react';

function ClassificationCard({ category, icon, label, color, count, items, gradient, total }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  const recentItems = (items || []).slice(-5).reverse();

  const categoryClass =
    category === 'organico' ? 'organic' :
    category === 'reciclavel' ? 'recyclable' :
    'electronic';

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className={`classification-card ${categoryClass}`}>
      <div className="card-header">
        <div className="card-header-left">
          <span className="card-icon">{icon}</span>
          <span className="card-label">{label}</span>
        </div>
        <span className={`card-count ${categoryClass}`} key={count}>
          {count}
        </span>
      </div>

      <div className="progress-container">
        <div className="progress-bar-header">
          <span className="progress-label">Do total</span>
          <span className="progress-value">{percentage}%</span>
        </div>
        <div className="progress-track">
          <div
            className={`progress-fill ${categoryClass}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="recent-items">
        {recentItems.length > 0 ? (
          recentItems.map((item, index) => (
            <div
              className="recent-item"
              key={item.id || index}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="recent-item-name">{item.name || item.item}</span>
              <span className="recent-item-time">{formatTime(item.timestamp)}</span>
            </div>
          ))
        ) : (
          <p className="no-items-text">Nenhum item classificado ainda</p>
        )}
      </div>
    </div>
  );
}

export default ClassificationCard;
