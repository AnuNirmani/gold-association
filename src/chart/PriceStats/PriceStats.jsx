import { metalStats, metals } from '../metalData';
import './PriceStats.css';

function PriceStats({ metal: metalId }) {
  const stats = metalStats[metalId] || metalStats['24k'];
  const info  = metals.find(m => m.id === metalId) || metals[0];

  return (
    <div className="price-stats">
      <h3 className="price-stats__title">Price Statistics (LKR)</h3>

      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-label">Open</span>
          <span className="stat-value">LKR {stats.open.toLocaleString()}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Close</span>
          <span className="stat-value">LKR {stats.close.toLocaleString()}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">High</span>
          <span className="stat-value stat-value--high">LKR {stats.high.toLocaleString()}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Low</span>
          <span className="stat-value stat-value--low">LKR {stats.low.toLocaleString()}</span>
        </div>
      </div>

      <div className={`change-card ${stats.up ? 'up' : 'down'}`}>
        <span className="change-label">Change</span>
        <span className="change-value">
          {stats.up ? '▲' : '▼'} {stats.change.toFixed(2)}%
        </span>
      </div>

      <p className="stats-disclaimer">
        * Reference rates. Actual market rates may vary.
      </p>
    </div>
  );
}

export default PriceStats;
