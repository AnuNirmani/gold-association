import heroImg from '../../assets/hero.jpg';
import { useLivePrices } from '../../chart/livePricesContext';
import './Hero.css';

function formatTimeLabel(dateLike) {
  if (!dateLike) return null;
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return null;
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function buildPath(values) {
  const width = 320;
  const height = 120;
  const paddingX = 12;
  const paddingY = 14;
  const minValue = Math.min(...values);
  const span = Math.max(...values) - minValue || 1;
  const step = values.length > 1 ? (width - paddingX * 2) / (values.length - 1) : 0;
  const points = values.map((value, index) => ({
    x: values.length === 1 ? width / 2 : paddingX + index * step,
    y: values.length === 1 ? height / 2 : paddingY + (height - paddingY * 2) * (1 - (value - minValue) / span),
  }));
  const line = `M ${points.map((point) => `${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' L ')}`;
  const last = points[points.length - 1];
  const area = `${line} L ${last.x.toFixed(1)} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;
  return { line, area, last };
}

function MiniChart({ points }) {
  if (points.length === 0) {
    return (
      <svg viewBox="0 0 320 120" className="mini-chart" aria-hidden="true">
        <text x="160" y="60" textAnchor="middle" fill="#6b7280" fontSize="12">
          No chart data available
        </text>
      </svg>
    );
  }

  const { line, area, last } = buildPath(points);
  return (
    <svg viewBox="0 0 320 120" className="mini-chart" aria-hidden="true">
      <g opacity="0.18">
        <line x1="0" y1="20" x2="320" y2="20" stroke="#0B1220" />
        <line x1="0" y1="60" x2="320" y2="60" stroke="#0B1220" />
        <line x1="0" y1="100" x2="320" y2="100" stroke="#0B1220" />
      </g>
      {points.length > 1 && <path d={area} fill="rgba(212,175,55,0.25)" />}
      {points.length > 1 && <path d={line} fill="none" stroke="#0B1220" strokeWidth="3" strokeLinecap="round" />}
      <circle cx={last.x} cy={last.y} r="5" fill="#0B1220" />
      {points.length === 1 && (
        <text x={last.x} y={last.y - 14} textAnchor="middle" fill="#0B1220" fontSize="18">
          LKR {points[0].toLocaleString('en-LK', { maximumFractionDigits: 2 })}
        </text>
      )}
    </svg>
  );
}

function Hero() {
  const { metals, seriesByMetal } = useLivePrices();
  const liveMetal = metals.find((metal) => metal.id === '24k');
  const latestPrice = liveMetal?.price ?? null;
  const changePercent = liveMetal?.changePercent ?? null;
  const priceUpdatedAt = liveMetal?.updatedAt ?? null;
  const todayPoints = (seriesByMetal['24k'] ?? [])
    .map((point) => point.price)
    .filter(Number.isFinite);
  const chartPoints = todayPoints.length > 0
    ? todayPoints
    : Number.isFinite(latestPrice) ? [latestPrice] : [];

  const displayPrice = latestPrice == null
    ? 'Loading...'
    : latestPrice.toLocaleString('en-LK', { maximumFractionDigits: 2 });
  const updatedTime = formatTimeLabel(priceUpdatedAt) ?? '—';
  const changeText = changePercent == null
    ? 'Live'
    : `${changePercent >= 0 ? '▲' : '▼'} ${Math.abs(changePercent).toFixed(2)}%`;
  const changeClass = changePercent == null ? 'change-muted' : (changePercent >= 0 ? 'change-up' : 'change-down');
  const pointCount = chartPoints.length;

  return (
    <section className="hero" id="home">
      <div className="hero__bg" style={{ backgroundImage: `url(${heroImg})` }} />
      <div className="hero__overlay" />
      <div className="hero__inner">
        <div className="hero__text">
          <h1 className="hero__heading">
            Welcome to<br />Gold Association
          </h1>
          <p className="hero__sub">
            Uniting excellence in the gold and jewelry trade. Join us in our
            mission to promote ethical practices and industry growth.
          </p>
          <a href="/contact" className="btn-gold hero__cta">Become a Member</a>
        </div>
        <aside className="hcard">
          <div className="hcard__header">
            <div>
              <h2 className="hcard__title">Today's Live Gold Price</h2>
              <p className="hcard__sub">Real-time reference rate (24K)</p>
            </div>
            <span className="hcard__updated">Updated: {updatedTime}</span>
          </div>
          <div className="hcard__panels">
            <a href="/chart?metal=24k" className="price-block">
              <div className="price-block__top">
                <div className="price-block__icon">👑</div>
                <div>
                  <div className="price-block__karat">24K</div>
                  <div className="price-block__type">Gold</div>
                </div>
                <span className="price-block__badge">Today</span>
              </div>
              <div className="price-block__lkr">LKR</div>
              <div className="price-block__amount">{displayPrice}</div>
              <div className="price-block__change">
                <span className={changeClass}>{changeText}</span>
                <span className="change-muted"> today</span>
              </div>
              <div className="price-block__time">Updated at {updatedTime}</div>
            </a>
            <div className="chart-block">
              <div className="chart-block__top">
                <span>Today Movement</span>
                <a href="/chart?metal=24k" className="chart-block__link">Open full chart →</a>
              </div>
              <p className="chart-block__note">
                {todayPoints.length === 0 && pointCount > 0
                  ? 'Latest available price'
                  : `${pointCount} point${pointCount === 1 ? '' : 's'} (today)`}
                {pointCount === 1 && ' · Waiting for more updates'}
              </p>
              <div className="chart-block__inner">
                <MiniChart points={chartPoints} />
                <div className="chart-block__labels">
                  <span>Open</span><span>Mid</span><span>Close</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hcard__actions">
            <a href="/chart?metal=24k" className="hcard__btn hcard__btn--navy">View 24K History</a>
            <a href="#prices" className="hcard__btn hcard__btn--ghost">View Other Gold Prices</a>
          </div>
          <p className="hcard__disclaimer">
            Prices are for reference only. Actual market prices may vary.
          </p>
        </aside>
      </div>
    </section>
  );
}

export default Hero;
