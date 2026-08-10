import { metals } from '../metalData';
import './PriceTicker.css';

function formatSignedPercent(changePercent) {
  if (changePercent == null) return '0.00%';
  const sign = changePercent > 0 ? '+' : changePercent < 0 ? '-' : '';
  return `${sign}${Math.abs(changePercent).toFixed(2)}%`;
}

function PriceTicker({ metals: sourceMetals = metals }) {
  const tickerItems = [
    ...sourceMetals.map((m) => ({ type: 'price', metal: m })),
    { type: 'highlight', text: 'Today Price', change: 'Live' },
    ...sourceMetals.map((m) => ({ type: 'price', metal: m })),
  ];

  return (
    <div className="ticker" aria-label="Live price ticker">
      <div className="ticker__track">
        {/* duplicated for seamless loop */}
        {[...tickerItems, ...tickerItems].map((item, i) =>
          item.type === 'highlight' ? (
            <span className="ticker__highlight" key={i}>
              {item.text} <span>{item.change}</span>
            </span>
          ) : (
            <span className="ticker__item" key={i}>
              <span className="ticker__name">{item.metal.name}</span>
              <span className="ticker__price">LKR {item.metal.price.toLocaleString()}</span>
              <span className={`ticker__change ${item.metal.up ? 'up' : 'down'}`}>
                {item.metal.up ? '▲' : '▼'} {formatSignedPercent(item.metal.changePercent ?? item.metal.change)}
              </span>
            </span>
          )
        )}
      </div>
    </div>
  );
}

export default PriceTicker;
