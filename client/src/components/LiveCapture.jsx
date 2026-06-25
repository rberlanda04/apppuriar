import React, { useState, useEffect, useRef } from 'react';

const CATEGORY_CONFIG = {
  organico:   { icon: '🥬', label: 'Orgânico',    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#22c55e' },
  reciclavel: { icon: '♻️', label: 'Reciclável',  gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#3b82f6' },
  eletronico: { icon: '🔌', label: 'Eletrônico',  gradient: 'linear-gradient(135deg, #eab308, #ca8a04)', color: '#eab308' },
};

function LiveCapture({ lastClassification, isProcessing, socket, setIsProcessing }) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [motionActive, setMotionActive] = useState(false);
  
  const canvasRef = useRef(null);
  const prevImageData = useRef(null);
  const motionFrames = useRef(0);
  const idleFrames = useRef(0);
  const isClassifying = useRef(false);

  // Efeito principal: escuta o evento de WebSocket da porta Serial
  useEffect(() => {
    if (!socket) return;

    const handleCameraFrame = (base64Data) => {
      setCameraActive(true);
      setImageUrl(base64Data);

      if (isClassifying.current || isProcessing) return;

      // Análise de Movimento local com canvas oculto
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 320, 240);
        
        const currentData = ctx.getImageData(0, 0, 320, 240).data;
        
        if (prevImageData.current) {
          let diffPixels = 0;
          for (let i = 0; i < currentData.length; i += 16) {
            const diffR = Math.abs(currentData[i] - prevImageData.current[i]);
            const diffG = Math.abs(currentData[i+1] - prevImageData.current[i+1]);
            const diffB = Math.abs(currentData[i+2] - prevImageData.current[i+2]);
            
            if (diffR + diffG + diffB > 100) { 
              diffPixels++;
            }
          }
          
          const totalPixels = currentData.length / 16;
          const motionPercentage = (diffPixels / totalPixels) * 100;
          
          if (motionPercentage > 5) {
            motionFrames.current++;
            idleFrames.current = 0;
            if (motionFrames.current > 2 && !motionActive) {
              setMotionActive(true);
            }
          } else {
            if (motionActive) {
              idleFrames.current++;
              if (idleFrames.current > 3) { // parou
                setMotionActive(false);
                motionFrames.current = 0;
                idleFrames.current = 0;
                triggerClassification(canvas.toDataURL('image/jpeg', 0.8));
              }
            }
          }
        }
        
        prevImageData.current = new Uint8ClampedArray(currentData);
      };
      img.src = base64Data;
    };

    socket.on('camera_frame', handleCameraFrame);

    return () => {
      socket.off('camera_frame', handleCameraFrame);
    };
  }, [socket, isProcessing, motionActive]);

  const triggerClassification = async (base64Image) => {
    isClassifying.current = true;
    setIsProcessing(true);
    setLoading(true);
    try {
      await fetch('http://localhost:3001/classify-base64', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
    } catch (err) {
      console.warn('Erro ao classificar:', err);
    } finally {
      setLoading(false);
      setTimeout(() => { isClassifying.current = false; }, 2000);
    }
  };

  const handleTestClassify = async () => {
    setLoading(true);
    try {
      await fetch('http://localhost:3001/test-classify');
    } catch (err) {
      console.warn('Erro ao testar:', err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const renderContent = () => {
    if (isProcessing) {
      return (
        <div className="processing-state">
          <div className="scan-ring" />
          <span className="processing-text">Analisando Objeto via USB...</span>
        </div>
      );
    }

    return (
      <div className="classification-result">
        <div className="result-image-container" style={{ position: 'relative' }}>
          {imageUrl ? (
            <img
              className="result-image"
              src={imageUrl}
              alt="Câmera ao vivo (USB)"
              style={{ filter: motionActive ? 'brightness(1.2)' : 'none' }}
            />
          ) : (
            <div className="result-image-placeholder">
              {cameraActive ? 'Carregando vídeo...' : '📷 Aguardando Serial...'}
            </div>
          )}
          
          {motionActive && (
            <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(234, 179, 8, 0.8)', padding: '4px 10px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 'bold' }}>
              Detectando movimento...
            </div>
          )}

          {lastClassification && !motionActive && (
             <span
             className="category-badge"
             style={{ background: CATEGORY_CONFIG[lastClassification.category]?.gradient || CATEGORY_CONFIG.organico.gradient }}
           >
             {CATEGORY_CONFIG[lastClassification.category]?.label}
           </span>
          )}
        </div>

        {lastClassification && (
          <div className="result-details" style={{ marginTop: '10px' }}>
            <span className="result-item-name">
              {lastClassification.item || lastClassification.name || 'Item detectado'}
            </span>
            {lastClassification.confidence != null && (
              <div className="result-confidence">
                <span>Confiança:</span>
                <span className="confidence-value" style={{ color: CATEGORY_CONFIG[lastClassification.category]?.color }}>
                  {Math.round(lastClassification.confidence * 100)}%
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="live-capture">
      <div className="live-capture-header">
        <div className="live-capture-title">
          <span className={`live-dot ${cameraActive ? 'online' : 'offline'}`} />
          Câmera USB (Visão Computacional)
        </div>
      </div>

      <div className="live-capture-body">
        <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
        {renderContent()}
      </div>

      <div style={{ padding: '0 22px 18px', textAlign: 'center' }}>
        <button
          className="test-button"
          onClick={handleTestClassify}
          disabled={loading || isProcessing}
        >
          <span>{loading ? 'Enviando...' : '🧪 Forçar Teste Simulado'}</span>
        </button>
      </div>
    </div>
  );
}

export default LiveCapture;
