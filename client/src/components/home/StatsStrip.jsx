import useCountUp from '../common/useCountUp.js';
import Icon from '../common/Icon.jsx';

const stats = [
  { label: 'Engagements', value: 450, suffix: '+', icon: 'briefcase' },
  { label: 'Campus Score', value: 120, suffix: '+', icon: 'cap' },
  { label: 'Mentored', value: 8000, suffix: '+', icon: 'users' },
  { label: 'Trained', value: 100000, suffix: '+', icon: 'star' },
];

function Stat({ label, value, suffix, icon }) {
  const [ref, n] = useCountUp(value);
  return (
    <div className="stat" ref={ref}>
      <Icon name={icon} size={34} />
      <strong>{n.toLocaleString('en-IN')}{suffix}</strong>
      <span>{label}</span>
    </div>
  );
}

export default function StatsStrip() {
  return (
    <section className="stats">
      <div className="container stats-grid">
        {stats.map((s) => <Stat key={s.label} {...s} />)}
      </div>
    </section>
  );
}
