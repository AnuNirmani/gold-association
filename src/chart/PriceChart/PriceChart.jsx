import { useState } from 'react';
import { metals, periods, getPeriodData } from '../metalData';
import './PriceChart.css';

const PERIOD_KEYS = ['1D', '1W', '1M', '3M', '1Y'];

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

function SparkSVG({ data, metalId }) {
  const W = 760, H = 200;
  const padL = 78, padR = 12, padT = 14, padB = 28;
  const cW = W - padL - padR;
  const cH = H - padT - padB;

  const yMin = Math.min(...data) - 4;
  const yMax = Math.max(...data) + 4;

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
  const [period, setPeriod] = useState('1M');

  const metalInfo = metals.find(m => m.id === metalId) || metals[0];
  const data = getPeriodData(metalId, period);
  const xLabels = periods[period]?.xLabels || periods['1M'].xLabels;

  // For 3M, xLabels length is 90; for 1Y it's 12; normalise to data length
  const labelStep = Math.ceil(xLabels.length / data.length);

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
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <SparkSVG data={data} metalId={metalId} />

      {/* x-axis labels rendered below SVG for flexibility */}
      <div className="price-chart__x-axis">
        {xLabels
          .filter((_, i) => i % Math.max(1, Math.floor(xLabels.length / 12)) === 0 || i === xLabels.length - 1)
          .map((label, i) => (
            <span key={i}>{label}</span>
          ))}
      </div>

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
