import heroImg from '../../assets/hero.jpg';
import './Hero.css';
import { useEffect, useMemo, useState } from 'react';

const DEMO_POINTS = [6240, 6248, 6243, 6255, 6249, 6262];

const API_KARAT_ID = 1;

function parseNumeric(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace(/,/g, '').trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function extractLatestPricePayload(payload) {
  if (!payload) return { price: null, changePercent: null, recordedAt: null };

  const row = Array.isArray(payload)
    ? payload[0]
    : payload.data && typeof payload.data === 'object'
      ? payload.data
      : payload;

  const price = parseNumeric(
    row?.price ??
    row?.latest_price ??
    row?.amount ??
    row?.value
  );

  const changePercent = parseNumeric(
    row?.change_percent ??
    row?.changePercent ??
    row?.change
  );

  const recordedAt =
    row?.recorded_at ??
    row?.updated_at ??
    row?.created_at ??
    null;

  return { price, changePercent, recordedAt };
}

function extractTodayPriceSeries(payload, karatId) {
  if (!payload) return [];

  const root = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
  const row = Array.isArray(root)
    ? root.find(item => Number(item?.karat_id) === Number(karatId)) ?? root[0]
    : root;

  const prices = Array.isArray(row?.prices) ? row.prices : [];

  return prices
    .map((entry) => {
      const price = parseNumeric(entry?.price);
      if (price == null) return null;

      const recordedAt = entry?.recorded_at ?? entry?.updated_at ?? entry?.created_at ?? null;
      return {
        price,
        recordedAt,
        changePercent: parseNumeric(entry?.change_percent),
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
}

function formatTimeLabel(dateLike) {
  if (!dateLike) return null;
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return null;
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

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

function MiniChart({ points }) {
  const { line, area, last } = buildPath(points);
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
  const [latestPrice, setLatestPrice] = useState(null);
  const [changePercent, setChangePercent] = useState(null);
  const [priceUpdatedAt, setPriceUpdatedAt] = useState(null);
  const [todayPoints, setTodayPoints] = useState([]);

  useEffect(() => {
    let ignore = false;

    const baseUrl = import.meta.env.VITE_LARAVEL_API_BASE_URL?.replace(/\/$/, '');

    const latestEndpoints = [
      `/api/gold-prices/latest/${API_KARAT_ID}`,
      ...(baseUrl ? [`${baseUrl}/api/gold-prices/latest/${API_KARAT_ID}`, `${baseUrl}/gold-prices/latest/${API_KARAT_ID}`] : []),
      `http://127.0.0.1:8000/api/gold-prices/latest/${API_KARAT_ID}`,
      `http://127.0.0.1:8000/gold-prices/latest/${API_KARAT_ID}`,
    ];

    const todayEndpoints = [
      `/api/gold-prices/today/${API_KARAT_ID}`,
      `/api/gold-prices/today`,
      ...(baseUrl ? [`${baseUrl}/api/gold-prices/today/${API_KARAT_ID}`, `${baseUrl}/api/gold-prices/today`, `${baseUrl}/gold-prices/today/${API_KARAT_ID}`, `${baseUrl}/gold-prices/today`] : []),
      `http://127.0.0.1:8000/api/gold-prices/today/${API_KARAT_ID}`,
      `http://127.0.0.1:8000/api/gold-prices/today`,
      `http://127.0.0.1:8000/gold-prices/today/${API_KARAT_ID}`,
      `http://127.0.0.1:8000/gold-prices/today`,
    ];

    const fetchFirstJson = async (endpoints) => {
      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            headers: {
              Accept: 'application/json',
            },
          });

          if (!res.ok) continue;

          const contentType = res.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) continue;

          return await res.json();
        } catch {
          // Try next endpoint candidate
        }
      }
      return null;
    };

    const hydrateHeroData = async () => {
      const todayPayload = await fetchFirstJson(todayEndpoints);
      const series = extractTodayPriceSeries(todayPayload, API_KARAT_ID);

      if (!ignore && series.length > 0) {
        setTodayPoints(series.map(point => point.price));

        const lastPoint = series[series.length - 1];
        setLatestPrice(lastPoint.price);
        setPriceUpdatedAt(lastPoint.recordedAt);
        if (lastPoint.changePercent != null) {
          setChangePercent(lastPoint.changePercent);
        }
      }

      const latestPayload = await fetchFirstJson(latestEndpoints);
      if (!latestPayload) return;

      const extracted = extractLatestPricePayload(latestPayload);

      if (extracted.price == null) return;

      if (!ignore) {
        setLatestPrice(extracted.price);
        setChangePercent(extracted.changePercent);
        setPriceUpdatedAt(extracted.recordedAt);
      }
    };

    hydrateHeroData();

    return () => {
      ignore = true;
    };
  }, []);

  const chartPoints = useMemo(() => {
    if (todayPoints.length >= 2) return todayPoints;
    return DEMO_POINTS;
  }, [todayPoints]);

  const displayPrice = useMemo(() => {
    if (latestPrice == null) return 'Loading...';
    return latestPrice.toLocaleString('en-LK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }, [latestPrice]);

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const liveTime = formatTimeLabel(priceUpdatedAt) ?? timeStr;

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
              <div className="price-block__amount">{displayPrice}</div>
              <div className="price-block__change">
                <span className={changeClass}>{changeText}</span>
                <span className="change-muted"> today</span>
              </div>
              <div className="price-block__time">Updated at {liveTime}</div>
            </a>
            <div className="chart-block">
              <div className="chart-block__top">
                <span>Today Movement</span>
                <a href="/chart?metal=24k" className="chart-block__link">Open full chart →</a>
              </div>
              <p className="chart-block__note">{pointCount} point{pointCount === 1 ? '' : 's'} (today)</p>
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
