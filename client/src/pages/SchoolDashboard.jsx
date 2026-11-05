import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/school-dashboard.css';

const opportunities = [
  {
    number: '01',
    title: 'Career Awareness',
    description:
      'Help students discover career paths, understand workplace expectations, and make informed decisions about their future.',
    theme: 'blue',
    icon: 'compass',
    link: '/expertise',
    action: 'Explore opportunities',
  },
  {
    number: '02',
    title: 'Essential Life Skills',
    description:
      'Explore communication, teamwork, leadership, confidence, and other practical skills that support student development.',
    theme: 'violet',
    icon: 'people',
    link: '/expertise',
    action: 'View skill areas',
  },
  {
    number: '03',
    title: 'Programs & Workshops',
    description:
      'Discuss workshops and learning programs tailored to your school community and students’ needs.',
    theme: 'green',
    icon: 'book',
    link: '/contact',
    action: 'Discuss a program',
  },
];

function FeatureIcon({ name }) {
  if (name === 'compass') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="m15.8 8.2-2.5 5.1-5.1 2.5 2.5-5.1 5.1-2.5Z" />
      </svg>
    );
  }

  if (name === 'people') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.8 20v-1.5a6.2 6.2 0 0 1 12.4 0V20M16 5a3.5 3.5 0 0 1 0 6.8M18 14a4.5 4.5 0 0 1 3.2 4.3V20" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 3.5h12.5A3.5 3.5 0 0 1 20 7v13H7a3 3 0 0 1-3-3V3.5Z" />
      <path d="M4 17a3 3 0 0 1 3-3h13M8 8h8M8 11h6" />
    </svg>
  );
}

export default function SchoolDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const schoolName =
    user?.schoolName ||
    user?.institutionName ||
    user?.college ||
    user?.name ||
    'School Account';

  const handleLogout = () => {
    logout();
    navigate('/signin', { replace: true });
  };

  return (
    <div className="school-dashboard">
      <header className="school-header">
        <Link to="/" className="school-brand" aria-label="Success Scholar home">
          <span className="school-brand-mark">S</span>
          <span className="school-brand-copy">
            <strong>SUCCESS SCHOLAR</strong>
            <small>Your Vision. Our Mission.</small>
          </span>
        </Link>

        <nav className="school-nav" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/expertise">Programs</Link>
          <Link to="/contact">Contact</Link>
          <button type="button" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      </header>

      <main className="school-main">
        <section className="school-hero">
          <div className="school-hero-copy">
            <span className="school-kicker">SCHOOL PARTNER PORTAL</span>
            <h1>Building brighter futures, together.</h1>
            <p>
              Discover practical learning opportunities that help students
              grow in confidence, strengthen essential skills, and prepare
              for the world beyond the classroom.
            </p>
            <div className="school-hero-actions">
              <Link to="/contact" className="school-primary-button">
                Connect with our team <span aria-hidden="true">→</span>
              </Link>
              <a href="#school-opportunities" className="school-secondary-link">
                Explore opportunities
              </a>
            </div>
            <div className="school-trust-line">
              <span className="school-online-dot" />
              School partner account
            </div>
          </div>

          <div className="school-hero-visual" aria-hidden="true">
            <div className="school-visual-orbit school-orbit-one" />
            <div className="school-visual-orbit school-orbit-two" />
            <div className="school-visual-card">
              <div className="school-visual-cap">✦</div>
              <strong>Learn.</strong>
              <strong>Grow.</strong>
              <strong className="school-visual-accent">Thrive.</strong>
              <span>Every student has potential.</span>
            </div>
            <span className="school-floating-dot school-dot-one" />
            <span className="school-floating-dot school-dot-two" />
          </div>
        </section>

        <section className="school-account-card" aria-label="Account information">
          <div className="school-account-avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h1m4 0h1m-6 4h1m4 0h1m-5 7v-4h4v4" />
            </svg>
          </div>
          <div className="school-account-details">
            <span>WELCOME TO YOUR SCHOOL PORTAL</span>
            <h2>{schoolName}</h2>
            <p>{user?.email || 'Your registered school account'}</p>
          </div>
          <span className="school-partner-badge">
            <span /> School partner
          </span>
        </section>

        <section className="school-opportunities" id="school-opportunities">
          <div className="school-section-heading">
            <div>
              <span className="school-kicker school-kicker-dark">
                WHAT YOU CAN EXPLORE
              </span>
              <h2>Opportunities for your students</h2>
              <p>
                Start a conversation with Success Scholar about the right
                learning experience for your school.
              </p>
            </div>
          </div>

          <div className="school-opportunity-grid">
            {opportunities.map((item) => (
              <article
                className={`school-opportunity-card school-theme-${item.theme}`}
                key={item.number}
              >
                <div className="school-card-topline">
                  <div className="school-feature-icon">
                    <FeatureIcon name={item.icon} />
                  </div>
                  <span className="school-card-number">{item.number}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link to={item.link} className="school-card-link">
                  {item.action} <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="school-contact-banner">
          <div className="school-contact-symbol" aria-hidden="true">✦</div>
          <div className="school-contact-copy">
            <span>LET’S WORK TOGETHER</span>
            <h2>Make learning more meaningful for your students.</h2>
            <p>
              Tell us about your school and goals. Our team can help you
              explore suitable programs and next steps.
            </p>
          </div>
          <Link to="/contact" className="school-banner-button">
            Contact our team <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>

      <footer className="school-footer">
        <div className="school-footer-brand">
          <span className="school-brand-mark">S</span>
          <div>
            <strong>SUCCESS SCHOLAR</strong>
            <p>Your Vision. Our Mission.</p>
          </div>
        </div>
        <nav className="school-footer-links" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/expertise">Programs</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </nav>
        <p className="school-footer-copyright">
          © {new Date().getFullYear()} Success Scholar.
        </p>
      </footer>
    </div>
  );
}
