import { useNavigate } from 'react-router-dom';
import { metals } from '../metalData';
import './MetalSelector.css';

function formatPercent(changePercent) {
  if (changePercent == null) return '0.00';
  return Math.abs(changePercent).toFixed(2);
}

function MetalSelector({ activeMetal, metals: sourceMetals = metals }) {
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
          <span className="metal-card__price">LKR {m.price.toLocaleString()}</span>
          <span className={`metal-card__change ${m.up ? 'up' : 'down'}`}>
            {m.up ? '▲' : '▼'} {formatPercent(m.changePercent ?? m.change)}%
          </span>
        </button>
      ))}
    </div>
  );
}

export default MetalSelector;
