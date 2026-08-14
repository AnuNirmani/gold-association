import { useState, useEffect } from 'react';
import { metals, periods } from '../metalData';
import { fetchChartRangeData } from '../livePricesApi';
import './PriceChart.css';

const PERIOD_KEYS = ['1D', '1W', '1M', '3M', '1Y'];

// Map metal ID to karat ID for API calls
const KARAT_ID_BY_METAL = {
  '24k': 1,
  '22k': 2,
  '18k': 3,
  silver: 4,
  used: 5,
};

function buildSmoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1];
    const c = pts[i];
    const cpX = (p.x + c.x) / 2;
    d += ` C ${cpX},${p.y} ${cpX},${c.y} ${c.x},${c.y}`;
  }
  return d;
}

function SparkSVG({ data, metalId, isLoading }) {
  const W = 760, H = 200;
  const padL = 78, padR = 12, padT = 14, padB = 28;
  const cW = W - padL - padR;
  const cH = H - padT - padB;

  // Handle empty or loading state
  if (isLoading || !data || data.length === 0) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="price-chart__svg" aria-hidden="true">
        <text x={W / 2} y={H / 2} textAnchor="middle" fontSize="14" fill="#9ca3af">
          {isLoading ? 'Loading chart data...' : 'No data available'}
        </text>
      </svg>
    );
  }

  // Filter out null values for calculation
  const validData = data.filter(v => v !== null && v !== 0);
  const yMin = (validData.length > 0 ? Math.min(...validData) : 0) - 4;
  const yMax = (validData.length > 0 ? Math.max(...validData) : 0) + 4;

  // Handle all-zero or flat data
  if (yMax <= yMin) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="price-chart__svg" aria-hidden="true">
        <text x={W / 2} y={H / 2} textAnchor="middle" fontSize="14" fill="#9ca3af">
          No price data available
        </text>
      </svg>
    );
  }

  const pts = data.map((v, i) => ({
    x: padL + (i / (data.length - 1)) * cW,
    y: padT + (1 - (v - yMin) / (yMax - yMin)) * cH,
  }));

  const linePath = buildSmoothPath(pts);
  const last = pts[pts.length - 1];
  const areaPath = `${linePath} L ${last.x},${padT + cH} L ${pts[0].x},${padT + cH} Z`;

  // 4 evenly-spaced y-axis ticks
  const yTicks = Array.from({ length: 4 }, (_, i) =>
    yMin + ((yMax - yMin) * i) / 3
  ).reverse();

  const gradId = `cg-${metalId}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="price-chart__svg" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c9a227" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* horizontal grid lines + y labels */}
      {yTicks.map((v, i) => {
        const y = padT + (1 - (v - yMin) / (yMax - yMin)) * cH;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={padL + cW} y2={y} stroke="#f0efe8" strokeWidth="1" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
              LKR {Math.round(v).toLocaleString()}
            </text>
          </g>
        );
      })}

      {/* gradient area fill */}
      <path d={areaPath} fill={`url(#${gradId})`} />

      {/* chart line */}
      <path d={linePath} fill="none" stroke="#c9a227" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function PriceChart({ metal: metalId }) {
  const [period, setPeriod] = useState('1D');
  const [chartData, setChartData] = useState([]);
  const [xLabels, setXLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const metalInfo = metals.find(m => m.id === metalId) || metals[0];
  const karatId = KARAT_ID_BY_METAL[metalId] || 1;

  // Fetch chart data when metal or period changes
  useEffect(() => {
    let isMounted = true;

    const loadChartData = async () => {
      setIsLoading(true);
      try {
        const { prices, labels } = await fetchChartRangeData(karatId, period);
        
        if (isMounted) {
          // Ensure all prices are numbers (convert 0 for missing data)
          const validPrices = prices && prices.length > 0 
            ? prices.map(p => typeof p === 'number' ? p : 0)
            : [];
          
          setChartData(validPrices);
          setXLabels(labels && labels.length > 0 ? labels : []);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
        if (isMounted) {
          setChartData([]);
          setXLabels([]);
          setIsLoading(false);
        }
      }
    };

    loadChartData();

    return () => {
      isMounted = false;
    };
  }, [karatId, period]);

  // Calculate x-axis label positions
  const displayLabels = xLabels && xLabels.length > 0
    ? xLabels.filter((_, i) => i % Math.max(1, Math.floor(xLabels.length / 12)) === 0 || i === xLabels.length - 1)
    : [];

  return (
    <div className="price-chart">
      <div className="price-chart__header">
        <div className="price-chart__title">
          <span className="live-dot" />
          {metalInfo.name} (LKR)
        </div>
        <div className="price-chart__periods">
          {PERIOD_KEYS.map(p => (
            <button
              key={p}
              className={`period-btn${period === p ? ' period-btn--active' : ''}`}
              onClick={() => setPeriod(p)}
              disabled={isLoading}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <SparkSVG data={chartData} metalId={metalId} isLoading={isLoading} />

      {/* x-axis labels rendered below SVG for flexibility */}
      {displayLabels.length > 0 && (
        <div className="price-chart__x-axis">
          {displayLabels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      )}

      <div className="price-chart__footer">
        <div className="chart-legend">
          <span className="legend-up">↑ Up</span>
          <span className="legend-down">↓ Down</span>
        </div>
        <span className="chart-disclaimer">Prices are for informational purposes only.</span>
      </div>
    </div>
  );
}

export default PriceChart;
