import { useState, useEffect } from 'react';
import './GoldPrices.css';

const KARAT_ORDER = [
  { karatId: 1, id: '24k',    name: '24K Gold',  unit: 'per 10g', icon: '👑', accent: 'gold' },
  { karatId: 2, id: '22k',    name: '22K Gold',  unit: 'per 10g', icon: '👑', accent: 'gold' },
  { karatId: 3, id: '18k',    name: '18K Gold',  unit: 'per 10g', icon: '👑', accent: 'gold' },
  { karatId: 4, id: 'silver', name: 'Silver',    unit: 'per 1g',  icon: '🥈', accent: 'silver' },
  { karatId: 5, id: 'used',   name: 'Used Gold', unit: 'per 1g',  icon: '📈', accent: 'gold' },
];

function parseNumeric(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace(/,/g, '').trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function parseLatestRow(payload) {
  if (!payload || typeof payload !== 'object') {
    return { price: null, changePercent: null, direction: null };
  }

  const root = payload.data && typeof payload.data === 'object' ? payload.data : payload;
  const price = parseNumeric(root.price ?? root.latest_price ?? root.amount ?? root.value);
  const changePercent = parseNumeric(root.change_percent ?? root.changePercent ?? root.change);
  const direction = typeof root.direction === 'string' ? root.direction.toLowerCase() : null;

  return { price, changePercent, direction };
}

function parseTodayRows(payload) {
  if (!payload) return [];

  const root = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
  const rows = Array.isArray(root) ? root : [root];

  return rows
    .map((row) => {
      const karatId = Number(row?.karat_id);
      const source = row?.last_price && typeof row.last_price === 'object' ? row.last_price : row;

      const price = parseNumeric(source?.price ?? source?.latest_price ?? source?.amount ?? source?.value);
      const changePercent = parseNumeric(source?.change_percent ?? source?.changePercent ?? source?.change);
      const direction = typeof source?.direction === 'string' ? source.direction.toLowerCase() : null;

      return {
        karatId,
        price,
        changePercent,
        direction,
      };
    })
    .filter((row) => Number.isFinite(row.karatId) && row.karatId > 0);
}

function formatSignedPercent(changePercent) {
  if (changePercent == null) return '0.00%';
  const sign = changePercent > 0 ? '+' : changePercent < 0 ? '-' : '';
  return `${sign}${Math.abs(changePercent).toFixed(2)}%`;
}

function GoldPrices() {
  const [time, setTime] = useState(new Date());
  const [liveMetals, setLiveMetals] = useState(
    KARAT_ORDER.map(item => ({
      ...item,
      price: null,
      changePercent: null,
      up: true,
    }))
  );

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let ignore = false;

    const baseUrl = import.meta.env.VITE_LARAVEL_API_BASE_URL?.replace(/\/$/, '');

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

    const fetchLatestForKarat = async (karat) => {
      const latestEndpoints = [
        `/api/gold-prices/latest/${karat.karatId}`,
        ...(baseUrl ? [`${baseUrl}/api/gold-prices/latest/${karat.karatId}`, `${baseUrl}/gold-prices/latest/${karat.karatId}`] : []),
        `http://127.0.0.1:8000/api/gold-prices/latest/${karat.karatId}`,
        `http://127.0.0.1:8000/gold-prices/latest/${karat.karatId}`,
      ];

      const payload = await fetchFirstJson(latestEndpoints);
      const parsed = parseLatestRow(payload);

      if (parsed.price != null) {
        const hasDirection = parsed.direction === 'up' || parsed.direction === 'down';
        const up = hasDirection ? parsed.direction === 'up' : (parsed.changePercent ?? 0) >= 0;

        return {
          ...karat,
          price: parsed.price,
          changePercent: parsed.changePercent,
          up,
        };
      }

      return {
        ...karat,
        price: null,
        changePercent: null,
        up: true,
      };
    };

    const hydrateCards = async () => {
      const todayEndpoints = [
        '/api/gold-prices/today',
        ...(baseUrl ? [`${baseUrl}/api/gold-prices/today`, `${baseUrl}/gold-prices/today`] : []),
        'http://127.0.0.1:8000/api/gold-prices/today',
        'http://127.0.0.1:8000/gold-prices/today',
      ];

      const todayPayload = await fetchFirstJson(todayEndpoints);
      const todayRows = parseTodayRows(todayPayload);

      if (todayRows.length > 0) {
        const byKarat = new Map(todayRows.map((row) => [row.karatId, row]));
        const rows = await Promise.all(KARAT_ORDER.map(async (karat) => {
          const row = byKarat.get(karat.karatId);
          if (!row || row.price == null) {
            return await fetchLatestForKarat(karat);
          }

          const hasDirection = row.direction === 'up' || row.direction === 'down';
          const up = hasDirection ? row.direction === 'up' : (row.changePercent ?? 0) >= 0;

          return {
            ...karat,
            price: row.price,
            changePercent: row.changePercent,
            up,
          };
        }));

        if (!ignore) {
          setLiveMetals(rows);
        }
        return;
      }

      const rows = await Promise.all(KARAT_ORDER.map(fetchLatestForKarat));
      if (!ignore) {
        setLiveMetals(rows);
      }
    };

    hydrateCards();

    return () => {
      ignore = true;
    };
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
                  {m.up ? '▲' : '▼'} {formatSignedPercent(m.changePercent)}<span className="gp-today"> today</span>
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
