import React from 'react';

const ChanceGauge = ({ overallChance, percentage, isBlurred }) => {
  return (
    <div className={`chance-section ${isBlurred ? 'blurred' : ''}`} id="chance-gauge-section">
      <div className="chance-gauge">
        {/* Modern Circular Gauge */}
        <div className="gauge-container">
          <div className="gauge-circle">
            <div className="gauge-center">
              <span className="chance-text" id="gauge-chance-text">{overallChance}</span>
              <span className="chance-percentage" id="gauge-percentage">{percentage}%</span>
            </div>
          </div>
        </div>

        {/* Chance Labels */}
        <div className="chance-labels">
          <div className="chance-label">
            <span className="label-dot reach-dot"></span>
            <span>Reach</span>
          </div>
          <div className="chance-label">
            <span className="label-dot target-dot"></span>
            <span>Target</span>
          </div>
          <div className="chance-label">
            <span className="label-dot likely-dot"></span>
            <span>Likely</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChanceGauge;