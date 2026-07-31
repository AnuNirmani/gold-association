import { useState, useEffect } from 'react';
import './GoldPrices.css';

const metals = [
  { id: '24k', name: '24K Gold', unit: 'per 10g', price: 'LKR 6,245', change: '+1.20%', up: true, icon: '👑' },
  { id: '22k', name: '22K Gold', unit: 'per 10g', price: 'LKR 5,725', change: '+0.80%', up: true, icon: '👑' },
  { id: '18k', name: '18K Gold', unit: 'per 10g', price: 'LKR 4,684', change: '+0.50%', up: true, icon: '👑' },
  { id: 'silver', name: 'Silver', unit: 'per 1g', price: 'LKR 782', change: '-0.30%', up: false, icon: '🥈' },
  { id: 'used', name: 'Used Gold', unit: 'per 1g', price: 'LKR 900', change: '-0.30%', up: false, icon: '📦' },
];

function GoldPrices() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = time.toLocaleTimeString('en-US');

  return (
    <section className="goldprices" id="prices">
      <div className="goldprices__inner">
        <div className="goldprices__badge">
          <span className="live-dot" />
          LIVE • Updated in real-time
        </div>

        <h2 className="goldprices__heading">Today's Gold &amp; Silver Prices</h2>

        <div className="goldprices__meta">
          <span>
            <span aria-hidden="true">📅</span> {dateStr}
          </span>
          <span>
            <span aria-hidden="true">🕐</span> {timeStr}
          </span>
        </div>

        <div className="goldprices__cards">
          {metals.map(m => (
            <div className="price-card" key={m.id}>
              <div className="price-card__header">
                <div className="price-card__icon" aria-hidden="true">{m.icon}</div>
                <div className="price-card__meta">
                  <div className="price-card__name">{m.name}</div>
                  <div className="price-card__unit">{m.unit}</div>
                </div>
                <span className={`price-card__arrow ${m.up ? 'up' : 'down'}`} aria-hidden="true">
                  {m.up ? '▲' : '▼'}
                </span>
              </div>
              <div className="price-card__price">{m.price}</div>
              <div className={`price-card__change ${m.up ? 'up' : 'down'}`}>
                {m.up ? '▲' : '▼'} {m.change} today
              </div>
              <a href={`#chart-${m.id}`} className="price-card__link">View chart →</a>
            </div>
          ))}
        </div>

        <p className="goldprices__note">
          Prices are updated in real-time and are for reference only. Actual prices may vary.
        </p>
      </div>
    </section>
  );
}

export default GoldPrices;
