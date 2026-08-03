import { metals } from '../metalData';
import './PriceTicker.css';

const tickerItems = [
  ...metals.map(m => ({ type: 'price', metal: m })),
  { type: 'highlight', text: 'Today Price', change: '▲ 0.8%' },
  ...metals.map(m => ({ type: 'price', metal: m })),
];

function PriceTicker() {
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
            </span>
          )
        )}
      </div>
    </div>
  );
}

export default PriceTicker;
