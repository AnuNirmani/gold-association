import { useLivePrices } from '../../chart/livePricesContext';
import './GoldPrices.css';

function formatSignedPercent(changePercent) {
  if (changePercent == null) return '—';
  const sign = changePercent > 0 ? '+' : changePercent < 0 ? '-' : '';
  return `${sign}${Math.abs(changePercent).toFixed(2)}%`;
}

function GoldPrices() {
  const { metals: liveMetals, refreshedAt } = useLivePrices();

  const time = refreshedAt ? new Date(refreshedAt) : null;
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = time ? time.toLocaleTimeString('en-US') : '--:--:--';

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
          {liveMetals.map(m => (
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
                <div className="gp-card__price">LKR {m.price == null ? '--' : m.price.toLocaleString('en-LK', { maximumFractionDigits: 2 })}</div>
                <div className={`gp-card__change ${m.up ? 'up' : 'down'}`}>
                  {m.up == null ? '—' : `${m.up ? '▲' : '▼'} ${formatSignedPercent(m.changePercent)}`}<span className="gp-today"> today</span>
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
