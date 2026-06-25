import React from 'react';

function Header({ isConnected, totalClassifications }) {
  return (
    <header className="dashboard-header">
      <div className="header-inner">
        <div className="header-brand">
          <span className="header-icon">🗑️</span>
          <div className="header-title-group">
            <h1 className="header-title">Lixeira Inteligente</h1>
            <span className="header-subtitle">Sistema de Classificação por IA</span>
          </div>
        </div>

        <div className="header-right">
          <div className="header-counter">
            <span className="header-counter-label">Classificados</span>
            <span className="header-counter-value" key={totalClassifications}>
              {totalClassifications}
            </span>
          </div>

          <div className={`connection-status ${isConnected ? 'online' : 'offline'}`}>
            <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
            {isConnected ? 'Conectado' : 'Desconectado'}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
