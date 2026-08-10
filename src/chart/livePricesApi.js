import { metals as fallbackMetals } from './metalData';

const KARAT_ID_BY_METAL = {
  '24k': 1,
  '22k': 2,
  '18k': 3,
  silver: 4,
  used: 5,
};

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

async function fetchFirstJson(endpoints) {
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
}

export async function fetchChartLiveMetals() {
  const baseUrl = import.meta.env.VITE_LARAVEL_API_BASE_URL?.replace(/\/$/, '');

  const todayEndpoints = [
    '/api/gold-prices/today',
    ...(baseUrl ? [`${baseUrl}/api/gold-prices/today`, `${baseUrl}/gold-prices/today`] : []),
    'http://127.0.0.1:8000/api/gold-prices/today',
    'http://127.0.0.1:8000/gold-prices/today',
  ];

  const latestEndpointsForKarat = (karatId) => [
    `/api/gold-prices/latest/${karatId}`,
    ...(baseUrl ? [`${baseUrl}/api/gold-prices/latest/${karatId}`, `${baseUrl}/gold-prices/latest/${karatId}`] : []),
    `http://127.0.0.1:8000/api/gold-prices/latest/${karatId}`,
    `http://127.0.0.1:8000/gold-prices/latest/${karatId}`,
  ];

    // const todayEndpoints = [
    //   `/api/gold-prices/today/${API_KARAT_ID}`,
    //   `/api/gold-prices/today`,
    //   ...(baseUrl ? [`${baseUrl}/api/gold-prices/today/${API_KARAT_ID}`, `${baseUrl}/api/gold-prices/today`] : []),
    // ];

    // const latestEndpoints = [
    //   `/api/gold-prices/latest/${API_KARAT_ID}`,
    //   ...(baseUrl ? [`${baseUrl}/api/gold-prices/latest/${API_KARAT_ID}`] : []),
    // ];

  const defaultRows = fallbackMetals.map((metal) => ({
    ...metal,
    changePercent: metal.change,
  }));

  const todayPayload = await fetchFirstJson(todayEndpoints);
  const todayRows = parseTodayRows(todayPayload);

  const rowByKarat = new Map(todayRows.map((row) => [row.karatId, row]));

  const rows = await Promise.all(
    defaultRows.map(async (metal) => {
      const karatId = KARAT_ID_BY_METAL[metal.id];
      const todayRow = rowByKarat.get(karatId);

      if (todayRow && todayRow.price != null) {
        const hasDirection = todayRow.direction === 'up' || todayRow.direction === 'down';
        const up = hasDirection ? todayRow.direction === 'up' : (todayRow.changePercent ?? 0) >= 0;

        return {
          ...metal,
          price: todayRow.price,
          changePercent: todayRow.changePercent,
          up,
        };
      }

      const latestPayload = await fetchFirstJson(latestEndpointsForKarat(karatId));
      const latestRow = parseLatestRow(latestPayload);
      if (latestRow.price != null) {
        const hasDirection = latestRow.direction === 'up' || latestRow.direction === 'down';
        const up = hasDirection ? latestRow.direction === 'up' : (latestRow.changePercent ?? 0) >= 0;

        return {
          ...metal,
          price: latestRow.price,
          changePercent: latestRow.changePercent,
          up,
        };
      }

      return metal;
    })
  );

  return rows;
}
