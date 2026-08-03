import { useState, useEffect } from 'react';
import './GoldPrices.css';

const metals = [
  { id: '24k',    name: '24K Gold',  unit: 'per 10g', price: 6245, change: '+1.20%', up: true,  icon: '👑', accent: 'gold'   },
  { id: '22k',    name: '22K Gold',  unit: 'per 10g', price: 5725, change: '+0.80%', up: true,  icon: '👑', accent: 'gold'   },
  { id: '18k',    name: '18K Gold',  unit: 'per 10g', price: 4684, change: '+0.50%', up: true,  icon: '👑', accent: 'gold'   },
  { id: 'silver', name: 'Silver',    unit: 'per 1g',  price: 782,  change: '-0.30%', up: false, icon: '🥈', accent: 'silver' },
  { id: 'used',   name: 'Used Gold', unit: 'per 1g',  price: 900,  change: '-0.30%', up: false, icon: '📈', accent: 'gold'   },
];

function GoldPrices() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = time.toLocaleTimeString('en-US');

  return (
    <section className="gp-section" id="prices">
      <div className="gp-outer">
        <div className="gp-deco" />

        <div className="gp-head">
          <div className="gp-badge">
            <span className="gp-dot" />
            <span>LIVE • Updated in real-time</span>
          </div>
          <h2 className="gp-heading">Today's Gold &amp; Silver Prices</h2>
          <div className="gp-meta">
            <span>📅 {dateStr}</span>
            <span>🕒 {timeStr}</span>
          </div>
          <div className="gp-divider" />
        </div>

        <div className="gp-cards">
          {metals.map(m => (
            <a key={m.id} href={`/chart?metal=${m.id}`} className="gp-card">
              <div className={`gp-card__bar gp-card__bar--${m.accent}`} />
              <div className="gp-card__body">
                <div className="gp-card__top">
                  <div className={`gp-card__icon gp-card__icon--${m.accent}`} aria-hidden="true">{m.icon}</div>
                  <div>
                    <div className="gp-card__name">{m.name}</div>
                    <div className="gp-card__unit">{m.unit}</div>
                  </div>
                </div>
                <div className="gp-card__price">LKR {m.price.toLocaleString()}</div>
                <div className={`gp-card__change ${m.up ? 'up' : 'down'}`}>
                  {m.up ? '▲' : '▼'} {m.change}<span className="gp-today"> today</span>
                </div>
                <div className="gp-card__link">View chart →</div>
              </div>
            </a>
          ))}
        </div>

        <p className="gp-note">Prices are updated in real-time and are for reference only. Actual prices may vary.</p>
      </div>
    </section>
  );
}

export default GoldPrices;
