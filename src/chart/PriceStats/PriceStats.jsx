import './PriceStats.css';

function formatLkr(value) {
  if (value == null || value === '') return '—';
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return '—';
  return num.toLocaleString();
}

function PriceStats({ metal: metalId, statsByMetal = {}, chartStats }) {
  const liveStats = statsByMetal?.[metalId] || {};
  const stats = chartStats ?? liveStats;
  const isUp = typeof stats.up === 'boolean' ? stats.up : true;

  return (
    <div className="price-stats">
      <h3 className="price-stats__title">Price Statistics (LKR)</h3>

      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-label">Open</span>
          <span className="stat-value">LKR {formatLkr(stats.open)}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Close</span>
          <span className="stat-value">LKR {formatLkr(stats.close)}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">High</span>
          <span className="stat-value stat-value--high">LKR {formatLkr(stats.high)}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Low</span>
          <span className="stat-value stat-value--low">LKR {formatLkr(stats.low)}</span>
        </div>
      </div>

      <div className={`change-card ${isUp ? 'up' : 'down'}`}>
        <span className="change-label">Change</span>
        <span className="change-value">
          {typeof stats.up === 'boolean' ? (stats.up ? '▲' : '▼') : '—'} LKR {formatLkr(stats.change)}
        </span>
      </div>

      <p className="stats-disclaimer">
        * Reference rates. Actual market rates may vary.
      </p>
    </div>
  );
}

export default PriceStats;
