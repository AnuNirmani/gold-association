import './StatsBar.css';

const stats = [
  { icon: '🏅', value: '500+',      label: 'Trusted members' },
  { icon: '⏳', value: '25+',       label: 'Years of excellence' },
  { icon: '✅', value: 'Verified',  label: 'Standards & ethics' },
  { icon: '🌍', value: 'Nationwide',label: 'Network & support' },
];

function StatsBar() {
  return (
    <div className="statsbar">
      <div className="statsbar__grad" />
      <div className="statsbar__sheen" />
      <div className="statsbar__inner">
        {stats.map(({ icon, value, label }) => (
          <div className="stat-item" key={label}>
            <div className="stat-item__icon" aria-hidden="true">{icon}</div>
            <div>
              <div className="stat-item__value">{value}</div>
              <div className="stat-item__label">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsBar;
