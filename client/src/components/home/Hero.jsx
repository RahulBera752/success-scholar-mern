
import { Link } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import SocialLinks from '../common/SocialLinks.jsx';
import { useCountUpGroup } from '../common/useCountUp.js';

const certifications = [
  {
    name: 'EGAC accreditation',
    src: '/assets/egac-logo.png',
  },
  {
    name: 'MSME registration',
    src: '/assets/msme-logo.png',
  },
  {
    name: 'International Accreditation Forum',
    src: '/assets/iaf-logo.png',
  },
];

const statistics = [
  {
    value: 5,
    suffix: ' M+',
    label: 'ENGAGEMENTS',
    icon: 'briefcase',
  },
  {
    value: 113,
    suffix: '+',
    label: 'CAMPUS SCORE',
    icon: 'cap',
  },
  {
    value: 17000,
    suffix: '+',
    label: 'MENTORED',
    icon: 'users',
  },
  {
    value: 52000,
    suffix: '+',
    label: 'TRAINED',
    icon: 'star',
  },
];

function HeroStatistics() {
  const targets = statistics.map(({ value }) => value);
  const [ref, values] = useCountUpGroup(targets, 2000);

  return (
    <div className="hero-stat-stack" ref={ref}>
      {statistics.map((stat, index) => (
        <div className="hero-stat" key={stat.label}>
          <span className="hero-stat-icon" aria-hidden="true">
            <Icon name={stat.icon} size={16} />
          </span>

          <div className="hero-stat-copy">
            <strong>
              {Number(values[index] ?? 0).toLocaleString('en-IN')}
              {stat.suffix}
            </strong>

            <span>{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section
      className="hero-reference"
      aria-label="Success Scholar introduction"
    >
      <div className="hero-stage">
        {/* Left-side introduction card */}
        <div className="hero-copy-card">
          <h1>
            Empower. Elevate.
            <br />
            Evolve.
          </h1>

          <p>
            At Success Scholar, we empower learners with essential skills in
            leadership, communication, and real-world problem-solving. Our
            Immersion Program bridges the gap from campus to corporate,
            preparing graduates to meet industry standards. Through a
            transformative learning journey, we shape confident,
            industry-ready professionals equipped to excel and lead in
            today’s dynamic workplace.
          </p>

          <div className="hero-actions">
            <Link to="/login" className="btn btn-outline">
              Log in
            </Link>

            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        </div>

        {/* Student image */}
        <img
          className="hero-student"
          src="/assets/hero-student.webp"
          alt="Student wearing glasses and carrying a yellow notebook"
          fetchPriority="high"
        />

        {/* Certifications, statistics and social links */}
        <aside
          className="hero-credentials"
          aria-label="Accreditations and Success Scholar statistics"
        >
          <img
            className="iso-badge"
            src="/assets/iso-logo.png"
            alt="ISO 9001:2015 certified"
          />

          <div className="credential-row">
            {certifications.map((cert) => (
              <img
                key={cert.name}
                src={cert.src}
                alt={cert.name}
                loading="lazy"
              />
            ))}
          </div>

          <HeroStatistics />

          <SocialLinks />
        </aside>
      </div>
    </section>
  );
}
