import { useState } from 'react';
import { LogoMark } from '../common/Logo.jsx';
import Icon from '../common/Icon.jsx';

export default function CareersHero({ onSearch }) {
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');

  return (
    <section className="careers-hero">
      <div className="container careers-hero-grid">
        <div>
          <div className="careers-brand">
            <LogoMark size={84} />
            <h1>Success Scholar Careers</h1>
          </div>
          <h2>Find your next job at Success Scholar.</h2>
          <form className="job-search" onSubmit={(e) => { e.preventDefault(); onSearch({ q: q.trim(), location: location.trim() }); }}>
            <label className="pill"><Icon name="search" size={20} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Digital Marketing" aria-label="Job keyword" /></label>
            <label className="pill"><Icon name="pin" size={20} /><input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Kolkata" aria-label="Location" /></label>
            <button className="btn btn-primary">Search</button>
          </form>
        </div>
        <div className="team-circle" role="img" aria-label="Decorative team illustration">
          <svg viewBox="0 0 300 300">
            <defs><linearGradient id="tc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1b1bb3" /><stop offset="1" stopColor="#7fd3ff" /></linearGradient></defs>
            <rect width="300" height="300" fill="url(#tc)" />
            {[70, 150, 230].map((x, i) => (
              <g key={x} fill="#fff" opacity={0.9 - i * 0.12}>
                <circle cx={x} cy={125 + (i === 1 ? -15 : 0)} r="28" />
                <path d={`M${x - 46} ${235 + (i === 1 ? -15 : 0)} q46 -92 92 0z`} />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
