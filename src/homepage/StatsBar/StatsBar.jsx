import './StatsBar.css';

const stats = [
  { icon: '🏆', value: '500+', label: 'Trusted members', bg: '#fef3c7' },
  { icon: '⏳', value: '25+', label: 'Years of excellence', bg: '#fee2e2' },
  { icon: '✅', value: 'Verified', label: 'Standards & ethics', bg: '#d1fae5' },
  { icon: '🌍', value: 'Nationwide', label: 'Network & support', bg: '#dbeafe' },
];

function StatsBar() {
  return (
    <section className="statsbar">
      <div className="statsbar__inner">
        {stats.map(({ icon, value, label, bg }) => (
          <div className="statsbar__item" key={label}>
            <div className="statsbar__icon" style={{ background: bg }}>
              <span aria-hidden="true">{icon}</span>
            </div>
            <div className="statsbar__text">
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsBar;
