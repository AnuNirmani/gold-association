import { metals } from './metalData';

const baseUrl = (
  import.meta.env.VITE_LARAVEL_API_BASE_URL || 'https://admin.slja.lk'
).replace(/\/+$/, '');
const api = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

function parseNumeric(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace(/,/g, '').trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeCode(value) {
  return String(value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function resolveKaratId(metal, rows) {
  const metalCode = normalizeCode(metal.id);
  const match = rows.find((row) => [row.code, row.label]
    .some((value) => normalizeCode(value).includes(metalCode)));
  return match?.karatId ?? null;
}

function extractRows(payload) {
  const root = payload?.data ?? payload;
  if (Array.isArray(root)) return root;
  if (!root || typeof root !== 'object') return [];
  if ('karat_id' in root || 'prices' in root || 'last_price' in root || 'statistics' in root) {
    return [root];
  }
  return Object.values(root).flatMap((value) =>
    Array.isArray(value) ? value : value && typeof value === 'object' ? [value] : []
  );
}

function parseLatestRows(payload) {
  if (!payload) return [];

  return extractRows(payload)
    .map((row) => {
      const karatId = Number(row?.karat_id);
      const price = parseNumeric(row?.price ?? row?.latest_price ?? row?.amount ?? row?.value);
      const changePercent = parseNumeric(row?.change_percent ?? row?.changePercent ?? row?.change);
      const direction = typeof row?.direction === 'string' ? row.direction.toLowerCase() : null;

      return {
        karatId,
        code: row?.code ?? '',
        label: row?.label ?? '',
        price,
        changePercent,
        direction,
        updatedAt: row?.updated_at ?? row?.recorded_at ?? row?.created_at ?? null,
      };
    })
    .filter((row) => Number.isFinite(row.karatId) && row.karatId > 0);
}

function parseTodayRows(payload) {
  if (!payload) return [];

  return extractRows(payload)
    .map((row) => {
      const karatId = Number(row?.karat_id);
      const stats = row?.statistics && typeof row.statistics === 'object' ? row.statistics : null;
      const source = row?.last_price && typeof row.last_price === 'object' ? row.last_price : row;
      const points = Array.isArray(row?.prices)
        ? row.prices
        : Array.isArray(row?.prices?.data)
          ? row.prices.data
          : [];
      const sortedPoints = [...points].sort((a, b) => {
        const aTime = new Date(a?.updated_at ?? a?.recorded_at ?? a?.created_at ?? 0).getTime();
        const bTime = new Date(b?.updated_at ?? b?.recorded_at ?? b?.created_at ?? 0).getTime();
        return aTime - bTime;
      });
      const latestPoint = sortedPoints[sortedPoints.length - 1];
      const latestUpdatedPointPrice = parseNumeric(latestPoint?.price);
      const recordedPrices = sortedPoints
        .map((point) => parseNumeric(point?.price))
        .filter((pointPrice) => pointPrice !== null);

      const price = parseNumeric(
        source?.price ?? source?.latest_price ?? source?.amount ?? source?.value
      ) ?? latestUpdatedPointPrice ?? parseNumeric(stats?.close);
      const changePercent = parseNumeric(
        source?.change_percent ?? source?.changePercent ?? source?.change ?? stats?.change_percent
      );
      const directionRaw = source?.direction ?? stats?.direction;
      const direction = typeof directionRaw === 'string' ? directionRaw.toLowerCase() : null;

      const open = parseNumeric(stats?.open) ?? recordedPrices[0] ?? null;
      const close = latestUpdatedPointPrice ?? parseNumeric(stats?.close);
      const high = parseNumeric(stats?.high)
        ?? (recordedPrices.length ? Math.max(...recordedPrices) : null);
      const low = parseNumeric(stats?.low)
        ?? (recordedPrices.length ? Math.min(...recordedPrices) : null);
      
      // Change is the gap between high and low
      const change = (high !== null && low !== null) 
        ? Number((high - low).toFixed(2))
        : null;

      const hasDirection = direction === 'up' || direction === 'down';
      const up = hasDirection
        ? direction === 'up'
        : open !== null && close !== null
          ? close >= open
          : null;

      const series = sortedPoints.map((point) => {
        const rawLabel = point?.label ?? point?.time ?? point?.recorded_at ?? point?.updated_at ?? '';
        const date = typeof rawLabel === 'string' ? new Date(rawLabel) : null;
        const label = date && !Number.isNaN(date.getTime()) && rawLabel.includes('T')
          ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : rawLabel;
        return { price: parseNumeric(point?.price), label };
      })
        .filter((point) => point.price !== null);

      return {
        karatId,
        code: row?.code ?? source?.code ?? '',
        label: row?.label ?? source?.label ?? '',
        price,
        changePercent,
        direction,
        updatedAt: source?.updated_at ?? source?.recorded_at ?? source?.created_at
          ?? latestPoint?.updated_at ?? latestPoint?.recorded_at ?? latestPoint?.created_at ?? null,
        series,
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

function toStatsByMetal(rowsByMetal) {
  const byMetal = {};

  for (const metal of metals) {
    const row = rowsByMetal.get(metal.id);
    if (!row) continue;
    byMetal[metal.id] = {
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
  for (const endpoint of new Set(endpoints)) {
    try {
      const res = await fetch(endpoint, {
        cache: 'no-store',
        signal: AbortSignal.timeout(25_000),
        headers: {
          Accept: 'application/json',
        },
      });

      if (!res.ok) continue;

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) continue;

      return await res.json();
    } catch (error) {
      if (error?.name === 'TimeoutError' || error?.name === 'AbortError') return null;
      // Try next endpoint candidate
    }
  }

  return null;
}

let liveMetalsRequest = null;

export function fetchChartLiveMetals() {
  if (!liveMetalsRequest) {
    liveMetalsRequest = loadChartLiveMetals().finally(() => {
      liveMetalsRequest = null;
    });
  }
  return liveMetalsRequest;
}

async function loadChartLiveMetals() {
  const latestAllEndpoints = [
    `${api}/gold-prices`,
    `${api}/gold-prices/latest`,
  ];

  const todayEndpoints = [
    `${api}/gold-prices/today`,
  ];

  const [todayPayload, latestAllPayload] = await Promise.all([
    fetchFirstJson(todayEndpoints),
    fetchFirstJson(latestAllEndpoints),
  ]);
  const todayRows = parseTodayRows(todayPayload);
  const latestRows = parseLatestRows(latestAllPayload);

  const metalRows = [...latestRows, ...todayRows];
  const karatIdByMetal = Object.fromEntries(
    metals.map((metal) => [metal.id, resolveKaratId(metal, metalRows)])
  );
  const rowByKarat = new Map(todayRows.map((row) => [row.karatId, row]));

  for (const latestRow of latestRows) {
    const todayRow = rowByKarat.get(latestRow.karatId);
    rowByKarat.set(latestRow.karatId, {
      ...todayRow,
      ...latestRow,
      price: latestRow.price ?? todayRow?.price ?? null,
      changePercent: latestRow.changePercent ?? todayRow?.changePercent ?? null,
      direction: latestRow.direction ?? todayRow?.direction ?? null,
      updatedAt: latestRow.updatedAt ?? todayRow?.updatedAt ?? null,
      stats: todayRow?.stats ?? {
        open: null,
        close: latestRow.price,
        high: null,
        low: null,
        change: null,
        up: null,
      },
      series: todayRow?.series ?? [],
    });
  }

  const rowByMetal = new Map(metals.flatMap((metal) => {
    const karatId = karatIdByMetal[metal.id];
    const row = karatId == null ? null : rowByKarat.get(karatId);
    return row ? [[metal.id, row]] : [];
  }));
  const statsByMetal = toStatsByMetal(rowByMetal);
  const seriesByMetal = {};
  const rows = metals.map((metal) => {
    const row = rowByMetal.get(metal.id);
    const karatId = karatIdByMetal[metal.id];
    if (!row) return { ...metal, karatId, price: null, changePercent: null, up: null, updatedAt: null };

    seriesByMetal[metal.id] = row.series ?? [];
    const hasDirection = row.direction === 'up' || row.direction === 'down';
    return {
      ...metal,
      karatId,
      price: row.price,
      changePercent: row.changePercent,
      up: hasDirection ? row.direction === 'up' : row.stats?.up,
      updatedAt: row.updatedAt,
    };
  });

  return {
    metals: rows,
    statsByMetal,
    seriesByMetal,
    karatIdByMetal,
  };
}

/**
 * Fetch chart data for a specific karat and time range
 * @param {number} karatId - The ID returned by the `/api/gold-prices` catalog.
 * @param {string} range - The time range ('1D', '1W', '1M', '3M', '1Y')
 * @returns {Promise<{prices: number[], labels: string[]}>} Chart data with prices and labels
 */
async function fetchChartPayload(karatId, range) {
  const endpoints = [
    `${api}/gold-prices/chart/${karatId}?range=${range}`,
  ];
  return fetchFirstJson(endpoints);
}

function parseChartPayload(payload) {
  const chartPayload = payload?.data ?? payload;
  let chartPoints = [];
  if (Array.isArray(chartPayload?.line)) chartPoints = chartPayload.line;
  else if (Array.isArray(chartPayload?.points)) chartPoints = chartPayload.points;
  else if (Array.isArray(chartPayload?.chart_points)) chartPoints = chartPayload.chart_points;
  else if (Array.isArray(chartPayload)) chartPoints = chartPayload;

  const validPoints = chartPoints
    .map((point, index) => ({
      price: parseNumeric(point?.price ?? point?.value ?? point?.amount ?? point?.latest_price),
      label: point?.label ?? point?.time ?? point?.date ?? point?.recorded_at ?? `${index}`,
    }))
    .filter((point) => point.price !== null);

  return {
    prices: validPoints.map((point) => point.price),
    labels: validPoints.map((point) => point.label),
    statistics: chartPayload?.statistics ?? null,
    samples: Array.isArray(chartPayload?.samples) ? chartPayload.samples : [],
  };
}

function latestRecordedDay(samples) {
  const ordered = samples
    .map((sample) => {
      const date = new Date(sample?.recorded_at ?? sample?.updated_at ?? '');
      const price = parseNumeric(sample?.price);
      return price === null || Number.isNaN(date.getTime()) ? null : { price, date };
    })
    .filter(Boolean)
    .sort((a, b) => a.date - b.date);

  if (!ordered.length) return null;
  const lastDay = ordered[ordered.length - 1].date.toDateString();
  const points = ordered.filter((point) => point.date.toDateString() === lastDay);
  const prices = points.map((point) => point.price);
  const open = prices[0];
  const close = prices[prices.length - 1];
  const high = Math.max(...prices);
  const low = Math.min(...prices);
  const dateLabel = points[points.length - 1].date.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return {
    prices,
    labels: points.map((point) => point.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    statistics: {
      open,
      close,
      high,
      low,
      change: high - low,
      change_percent: null,
      direction: close >= open ? 'up' : 'down',
    },
    fallbackDate: dateLabel,
  };
}

export async function fetchChartRangeData(karatId, range = '1D', latestUpdatedAt = null) {
  if (!karatId || karatId <= 0) {
    return { prices: [], labels: [], statistics: null, fallbackDate: null };
  }

  const latestDate = latestUpdatedAt ? new Date(latestUpdatedAt) : null;
  const latestIsNotToday = range === '1D'
    && latestDate
    && !Number.isNaN(latestDate.getTime())
    && latestDate.toDateString() !== new Date().toDateString();
  const requestRange = latestIsNotToday ? '1Y' : range;
  const payload = await fetchChartPayload(karatId, requestRange);
  const chartData = payload ? parseChartPayload(payload) : { prices: [], labels: [], samples: [], statistics: null };

  if (latestIsNotToday) {
    const latestDay = latestRecordedDay(chartData.samples);
    return latestDay ?? { ...chartData, fallbackDate: null };
  }

  if (range !== '1D' || chartData.prices.length > 0) {
    return { ...chartData, fallbackDate: null };
  }

  return { ...chartData, fallbackDate: null };
}
