
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/common/Logo.jsx';
import '../styles/college-dashboard.css';

export default function CollegeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const collegeName =
    user?.collegeName ||
    user?.institutionName ||
    user?.name ||
    'College Account';

  const handleLogout = () => {
    logout();
    navigate('/signin', { replace: true });
  };

  return (
    <div className="college-dashboard">
      {/* Header */}
      <header className="college-header">
        <Link
          to="/"
          className="college-brand"
          aria-label="Success Scholar home"
        >
          <Logo />
        </Link>

        <nav className="college-nav" aria-label="College navigation">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
          <button type="button" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      </header>

      <main className="college-main">
        {/* Welcome Hero */}
        <section className="college-welcome">
          <div className="college-welcome-content">
            <span className="college-eyebrow">
              COLLEGE PARTNER PORTAL
            </span>

            <h1>Welcome back!</h1>

            <p>
              Manage your institution’s connection with Success Scholar
              and explore opportunities for your students.
            </p>

            <div className="college-account-status">
              <span className="college-status-dot" />
              College account active
            </div>
          </div>

          <div className="college-welcome-art" aria-hidden="true">
            <div className="college-art-circle">
              <svg viewBox="0 0 120 120" fill="none">
                <path
                  d="M15 42 60 20l45 22-45 22-45-22Z"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
                <path
                  d="M32 52v25c16 13 40 13 56 0V52M105 43v30"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M47 65h26"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Institution Profile */}
        <section className="college-profile-card">
          <div className="college-profile-icon">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 21h18M5 21V7l7-4 7 4v14M9 10h1m4 0h1m-6 4h1m4 0h1m-5 7v-4h4v4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="college-profile-info">
            <span>YOUR INSTITUTION</span>
            <h2>{collegeName}</h2>
            <p>
              {user?.email || 'Your registered college account'}
            </p>
          </div>

          <div className="college-profile-badge">
            College Partner
          </div>
        </section>

        {/* Dashboard Services */}
        <section className="college-section-heading">
          <div>
            <span className="college-eyebrow">YOUR WORKSPACE</span>
            <h2>College dashboard</h2>
            <p>
              Explore the services available to your institution.
            </p>
          </div>
        </section>

        <section className="college-feature-grid">
          {/* Career Programs */}
          <article className="college-feature-card">
            <div className="college-feature-icon college-icon-blue">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 5.5A2.5 2.5 0 0 1 5.5 3H11v17H5.5A2.5 2.5 0 0 0 3 22V5.5Zm18 0A2.5 2.5 0 0 0 18.5 3H13v17h5.5A2.5 2.5 0 0 1 21 22V5.5Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3>Career-oriented programs</h3>
            <p>
              Explore professional programs designed to help students
              develop practical skills and workplace readiness.
            </p>

            <Link to="/internship" className="college-feature-link">
              Explore programs <span>→</span>
            </Link>
          </article>

          {/* Student Development */}
          <article className="college-feature-card">
            <div className="college-feature-icon college-icon-purple">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m16 0v-2a4 4 0 0 0-3-3.87M14 3.13a4 4 0 0 1 0 7.75M10 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3>Student development</h3>
            <p>
              Learn about opportunities that support student
              employability, communication, and professional growth.
            </p>

            <Link to="/expertise" className="college-feature-link">
              Discover opportunities <span>→</span>
            </Link>
          </article>

          {/* Learning and Certificates */}
          <article className="college-feature-card">
            <div className="college-feature-icon college-icon-green">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 7h8M8 11h8"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3>Certificates and learning</h3>
            <p>
              Find out more about learning programs and certification
              opportunities offered by Success Scholar.
            </p>

            <Link to="/contact" className="college-feature-link">
              Make an enquiry <span>→</span>
            </Link>
          </article>
        </section>

        {/* Contact Banner */}
        <section className="college-contact-banner">
          <div>
            <span>NEED ASSISTANCE?</span>
            <h2>Let’s help your students move forward.</h2>
            <p>
              Contact our team to discuss programs and opportunities
              for your institution.
            </p>
          </div>

          <Link to="/contact" className="college-contact-button">
            Contact our team <span>→</span>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="college-footer">
        <div className="college-footer-brand">
          <strong>SUCCESS SCHOLAR</strong>
          <p>Your Vision. Our Mission.</p>
        </div>

        <nav className="college-footer-links" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </nav>

        <p className="college-footer-copy">
          © 2026 Success Scholar. All rights reserved.
        </p>
      </footer>
    </div>
  );
}