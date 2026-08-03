import heroImg from '../../assets/hero.jpg';
import './Hero.css';

const DEMO_POINTS = [6240, 6248, 6243, 6255, 6249, 6262];

function buildPath(values) {
  const W = 320, H = 120, padX = 12, padY = 14;
  const minV = Math.min(...values);
  const span = (Math.max(...values) - minV) || 1;
  const step = (W - padX * 2) / (values.length - 1);
  const coords = values.map((v, i) => ({
    x: padX + i * step,
    y: padY + (H - padY * 2) * (1 - (v - minV) / span),
  }));
  const line = 'M ' + coords.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ');
  const last = coords[coords.length - 1];
  const area = `${line} L ${last.x.toFixed(1)} ${(H - padY).toFixed(1)} L ${padX} ${(H - padY).toFixed(1)} Z`;
  return { line, area, last };
}

function MiniChart() {
  const { line, area, last } = buildPath(DEMO_POINTS);
  return (
    <svg viewBox="0 0 320 120" className="mini-chart" aria-hidden="true">
      <g opacity="0.18">
        <line x1="0" y1="20" x2="320" y2="20" stroke="#0B1220" />
        <line x1="0" y1="60" x2="320" y2="60" stroke="#0B1220" />
        <line x1="0" y1="100" x2="320" y2="100" stroke="#0B1220" />
      </g>
      <path d={area} fill="rgba(212,175,55,0.25)" />
      <path d={line} fill="none" stroke="#0B1220" strokeWidth="3" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r="5" fill="#0B1220" />
    </svg>
  );
}

function Hero() {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
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
          <a href="/#membership" className="btn-gold hero__cta">Become a Member</a>
        </div>
        <aside className="hcard">
          <div className="hcard__header">
            <div>
              <h2 className="hcard__title">Today's Live Gold Price</h2>
              <p className="hcard__sub">Real-time reference rate (24K)</p>
            </div>
            <span className="hcard__updated">Updated: {timeStr}</span>
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
              <div className="price-block__amount">6,245</div>
              <div className="price-block__change">
                <span className="change-up">▲ 1.2%</span>
                <span className="change-muted"> today</span>
              </div>
              <div className="price-block__time">Updated at {timeStr}</div>
            </a>
            <div className="chart-block">
              <div className="chart-block__top">
                <span>Today Movement</span>
                <a href="/chart?metal=24k" className="chart-block__link">Open full chart →</a>
              </div>
              <p className="chart-block__note">Last 6 points (demo)</p>
              <div className="chart-block__inner">
                <MiniChart />
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
