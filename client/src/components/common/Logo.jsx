import { Link } from 'react-router-dom';

// Original monogram badge (not the official Success Scholar logo).
export function LogoMark({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#000066" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="#f5c542" strokeWidth="1.5" />
      <text x="32" y="43" fontFamily="Georgia, serif" fontSize="32" fontWeight="700" textAnchor="middle" fill="#fff">S</text>
    </svg>
  );
}

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo brand-lockup ${light ? 'logo-light' : ''}`} aria-label="Success Scholar home">
      <img className="brand-logo-image" src="/assets/success-scholar-logo.png" alt="Success Scholar — Your Vision. Our Mission." />
    </Link>
  );
}
