import heroImg from '../../assets/hero.png';
import './Hero.css';

function SparklineChart() {
  return (
    <svg className="sparkline" viewBox="0 0 200 72" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points="0,72 0,56 40,42 80,32 120,24 160,16 200,8 200,72"
        fill="url(#sparkFill)"
      />
      <polyline
        points="0,56 40,42 80,32 120,24 160,16 200,8"
        fill="none"
        stroke="#14131f"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Hero() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <section className="hero" id="home">
      <div className="hero__bg" style={{ backgroundImage: `url(${heroImg})` }} />
      <div className="hero__overlay" />

      <div className="hero__inner">
        <div className="hero__content">
          <h1 className="hero__heading">
            Welcome to<br />
            <span>Gold Association</span>
          </h1>
          <p className="hero__sub">
            Uniting excellence in the gold and jewelry trade. Join us in our
            mission to promote ethical practices and industry growth.
          </p>
          <a href="#membership" className="hero__btn">Become a Member</a>
        </div>

        <div className="hero__widget">
          <div className="widget__header">
            <div>
              <h3>Today's Live Gold Price</h3>
              <p>Real-time reference rate (24K)</p>
            </div>
            <span className="widget__updated">Updated: {timeStr}</span>
          </div>

          <div className="widget__body">
            <div className="widget__price-panel">
              <div className="widget__metal">
                <div className="metal-icon" aria-hidden="true">👑</div>
                <div className="metal-info">
                  <span className="metal-karat">24K</span>
                  <span className="metal-label">Gold</span>
                </div>
                <span className="metal-badge">Today</span>
              </div>
              <div className="widget__currency">LKR</div>
              <div className="widget__amount">6,245</div>
              <div className="widget__change positive">▲ 1.2% today</div>
              <div className="widget__time">Updated at {timeStr}</div>
            </div>

            <div className="widget__chart-panel">
              <div className="chart__header">
                <span>Today Movement</span>
                <a href="#prices" className="chart__link">Open full chart —</a>
              </div>
              <p className="chart__note">Live price movement</p>
              <SparklineChart />
              <div className="chart__labels">
                <span>Open</span>
                <span>Mid</span>
                <span>Close</span>
              </div>
            </div>
          </div>

          <div className="widget__actions">
            <a href="#prices" className="widget__btn widget__btn--dark">View 24K History</a>
            <a href="#prices" className="widget__btn widget__btn--outline">View Other Gold Prices</a>
          </div>

          <p className="widget__disclaimer">
            Prices are for reference only. Actual market prices may vary.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
