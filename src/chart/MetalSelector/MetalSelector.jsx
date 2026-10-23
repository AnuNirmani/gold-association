import { useNavigate } from 'react-router-dom';
import './MetalSelector.css';

function formatPercent(changePercent) {
  if (changePercent == null) return '—';
  return Math.abs(changePercent).toFixed(2);
}

function MetalSelector({ activeMetal, metals: sourceMetals = [] }) {
  const navigate = useNavigate();

  return (
    <div className="metal-selector">
      {sourceMetals.map(m => (
        <button
          key={m.id}
          className={`metal-card${activeMetal === m.id ? ' metal-card--active' : ''}`}
          onClick={() => navigate(`/chart?metal=${m.id}`)}
        >
          <span className="metal-card__name">{m.name}</span>
          <span className="metal-card__price">LKR {m.price == null ? '—' : m.price.toLocaleString()}</span>
          <span className={`metal-card__change ${m.up ? 'up' : 'down'}`}>
            {m.up == null ? '—' : `${m.up ? '▲' : '▼'} ${formatPercent(m.changePercent)}%`}
          </span>
        </button>
      ))}
    </div>
  );
}

export default MetalSelector;
