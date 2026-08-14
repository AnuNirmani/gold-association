import { metals as fallbackMetals, chartData, periods, getPeriodData } from './metalData';

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

function parseLatestRows(payload) {
  if (!payload) return [];

  const root = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
  const rows = Array.isArray(root) ? root : [root];

  return rows
    .map((row) => {
      const karatId = Number(row?.karat_id);
      const price = parseNumeric(row?.price ?? row?.latest_price ?? row?.amount ?? row?.value);
      const changePercent = parseNumeric(row?.change_percent ?? row?.changePercent ?? row?.change);
      const direction = typeof row?.direction === 'string' ? row.direction.toLowerCase() : null;

      return {
        karatId,
        price,
        changePercent,
        direction,
      };
    })
    .filter((row) => Number.isFinite(row.karatId) && row.karatId > 0);
}

function parseTodayRows(payload) {
  if (!payload) return [];

  const root = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
  const rows = Array.isArray(root) ? root : [root];

  return rows
    .map((row) => {
      const karatId = Number(row?.karat_id);
      const stats = row?.statistics && typeof row.statistics === 'object' ? row.statistics : null;
      const source = row?.last_price && typeof row.last_price === 'object' ? row.last_price : row;
      const points = Array.isArray(row?.prices) ? row.prices : [];

      let latestUpdatedPointPrice = null;
      if (points.length > 0) {
        const sortedPoints = [...points].sort((a, b) => {
          const aTime = new Date(a?.updated_at ?? 0).getTime();
          const bTime = new Date(b?.updated_at ?? 0).getTime();
          return aTime - bTime;
        });

        latestUpdatedPointPrice = parseNumeric(
          sortedPoints[sortedPoints.length - 1]?.price ?? null
        );
      }

      const price = parseNumeric(
        source?.price ?? source?.latest_price ?? source?.amount ?? source?.value ?? stats?.close
      );
      const changePercent = parseNumeric(
        source?.change_percent ?? source?.changePercent ?? source?.change ?? stats?.change_percent
      );
      const directionRaw = source?.direction ?? stats?.direction;
      const direction = typeof directionRaw === 'string' ? directionRaw.toLowerCase() : null;

      const open = parseNumeric(stats?.open);
      const close = latestUpdatedPointPrice ?? parseNumeric(stats?.close);
      const high = parseNumeric(stats?.high);
      const low = parseNumeric(stats?.low);
      
      // Change is the gap between high and low
      const change = (high !== null && low !== null) 
        ? Number((high - low).toFixed(2))
        : null;

      const hasDirection = direction === 'up' || direction === 'down';
      const up = hasDirection ? direction === 'up' : (change ?? 0) >= 0;

      return {
        karatId,
        price,
        changePercent,
        direction,
        stats: {
          open,
          close,
          high,
          low,
          change,
          up,
          direction,
        },
      };
    })
    .filter((row) => Number.isFinite(row.karatId) && row.karatId > 0);
}

function toStatsByMetal(todayRows) {
  const byMetal = {};

  for (const row of todayRows) {
    const metalId = Object.keys(KARAT_ID_BY_METAL).find((key) => KARAT_ID_BY_METAL[key] === row.karatId);
    if (!metalId) continue;

    byMetal[metalId] = {
      open: row.stats?.open,
      close: row.stats?.close,
      high: row.stats?.high,
      low: row.stats?.low,
      change: row.stats?.change,
      up: row.stats?.up,
      direction: row.stats?.direction,
    };
  }

  return byMetal;
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

  const latestAllEndpoints = [
    '/api/gold-prices/latest',
    ...(baseUrl ? [`${baseUrl}/api/gold-prices/latest`, `${baseUrl}/gold-prices/latest`] : []),
    'http://127.0.0.1:8000/api/gold-prices/latest',
    'http://127.0.0.1:8000/gold-prices/latest',
  ];

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
  const statsByMetal = toStatsByMetal(todayRows);

  const latestAllPayload = await fetchFirstJson(latestAllEndpoints);
  const latestRows = parseLatestRows(latestAllPayload);

  const rowByKarat = new Map(todayRows.map((row) => [row.karatId, row]));
  const latestByKarat = new Map(latestRows.map((row) => [row.karatId, row]));

  const rows = await Promise.all(
    defaultRows.map(async (metal) => {
      const karatId = KARAT_ID_BY_METAL[metal.id];
      const latestRowFromAll = latestByKarat.get(karatId);
      const todayRow = rowByKarat.get(karatId);

      if (latestRowFromAll && latestRowFromAll.price != null) {
        const hasDirection = latestRowFromAll.direction === 'up' || latestRowFromAll.direction === 'down';
        const up = hasDirection ? latestRowFromAll.direction === 'up' : (latestRowFromAll.changePercent ?? 0) >= 0;

        return {
          ...metal,
          price: latestRowFromAll.price,
          changePercent: latestRowFromAll.changePercent,
          up,
        };
      }

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

  return {
    metals: rows,
    statsByMetal,
  };
}

/**
 * Fetch chart data for a specific karat and time range
 * @param {number} karatId - The karat ID (1-5)
 * @param {string} range - The time range ('1D', '1W', '1M', '3M', '1Y')
 * @returns {Promise<{prices: number[], labels: string[]}>} Chart data with prices and labels
 */
export async function fetchChartRangeData(karatId, range = '1D') {
  if (!karatId || karatId <= 0) {
    console.warn('Invalid karatId:', karatId);
    return { prices: [], labels: [] };
  }

  const baseUrl = import.meta.env.VITE_LARAVEL_API_BASE_URL?.replace(/\/$/, '');

  const chartEndpoints = [
    `/api/gold-prices/chart/${karatId}?range=${range}`,
    ...(baseUrl ? [`${baseUrl}/api/gold-prices/chart/${karatId}?range=${range}`, `${baseUrl}/gold-prices/chart/${karatId}?range=${range}`] : []),
    `http://127.0.0.1:8000/api/gold-prices/chart/${karatId}?range=${range}`,
    `http://127.0.0.1:8000/gold-prices/chart/${karatId}?range=${range}`,
  ];

  console.log(`Fetching chart data for karat ${karatId}, range ${range}`);
  
  const payload = await fetchFirstJson(chartEndpoints);

  if (!payload) {
    console.warn('No payload received from backend');
    return { prices: [], labels: [] };
  }

  console.log('Backend response:', payload);

  // Extract chart data from various possible response structures
  let chartPoints = [];
  
  // Try multiple possible response structures
  if (Array.isArray(payload?.data?.points)) {
    chartPoints = payload.data.points;
  } else if (Array.isArray(payload?.data?.chart_points)) {
    chartPoints = payload.data.chart_points;
  } else if (Array.isArray(payload?.points)) {
    chartPoints = payload.points;
  } else if (Array.isArray(payload?.chart_points)) {
    chartPoints = payload.chart_points;
  } else if (Array.isArray(payload?.data)) {
    // If data is directly an array
    chartPoints = payload.data;
  }

  if (chartPoints.length === 0) {
    console.warn('No chart points found in response');
    return { prices: [], labels: [] };
  }

  console.log('Extracted chart points:', chartPoints);

  // Extract prices and labels from chart points
  const prices = chartPoints
    .map((point, idx) => {
      // Log first point to see actual structure
      if (idx === 0) {
        console.log('First chart point structure:', point);
        console.log('Point keys:', Object.keys(point));
      }
      
      // Try multiple possible price field names
      const price = point?.price ?? point?.value ?? point?.amount ?? point?.latest_price ?? 0;
      return parseNumeric(price);
    })
    .map(price => price !== null ? price : 0); // Use 0 for missing prices

  const labels = chartPoints.map((point, index) => {
    // Try multiple possible label field names
    return point?.label ?? point?.time ?? point?.date ?? point?.recorded_at ?? `${index}`;
  });

  console.log('Extracted prices:', prices);
  console.log('Extracted labels:', labels);

  return { prices, labels };
}
