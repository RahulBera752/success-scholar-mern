
import { Link } from 'react-router-dom';
import '../styles/corporate-dashboard.css';

const programs = [
  {
    id: 'hospitality',
    title: 'Hospitality Management',
    duration: '6 months',
    focus:
      'Core skills & Digital Readiness. Excludes Registration fee of Rs. 50',
    topics: [
      'Introduction.',
      'Front Office.',
      'Food and Beverage services.',
      'House Keeping.',
      'Food Production.',
      'Laws and Taxes.',
      'Sales and Marketing.',
      'English + Soft Skills.',
      'French.',
    ],
  },
  {
    id: 'sap',
    title: 'SAP',
    duration: '3 months',
    focus:
      'Expanded access to technical skills & problem-solving. Excludes Registration fee of Rs. 50',
    topics: [
      'ERP',
      'SAP Overview',
      'Database Concepts',
      'Advance Database Concepts',
      'Data Warehouse',
      'SAP Data Services',
    ],
  },
];

function BookIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="corporate-program-book"
    >
      <path
        d="M3 5.5A2.5 2.5 0 0 1 5.5 3H11v17H5.5A2.5 2.5 0 0 0 3 22V5.5Z"
        fill="currentColor"
      />
      <path
        d="M21 5.5A2.5 2.5 0 0 0 18.5 3H13v17h5.5A2.5 2.5 0 0 1 21 22V5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function CorporateDashboard() {
  return (
    <div className="corporate-dashboard">

      {/* Header */}
      <header className="corporate-header">
        <div className="corporate-header-inner">
          <Link to="/corporate" className="corporate-brand">
            <img
              src="/assets/success-scholar-logo.png"
              alt="Success Scholar"
              className="corporate-brand-logo"
            />
          </Link>

          <nav className="corporate-nav">
            <Link to="/corporate">HOME</Link>
            <Link to="/contact">CONTACT</Link>
          </nav>
        </div>
      </header>

      {/* Main Corporate Courses */}
      <main className="corporate-main">
        <section
          className="corporate-program-page"
          aria-labelledby="corporate-program-title"
        >
          <div className="corporate-program-panel">
            <h1 id="corporate-program-title">
              CAREER ORIENTED COURSES PROVIDED AT SUCCESS SCHOLAR
            </h1>

            <div className="corporate-program-grid">
              {programs.map((program) => (
                <article
                  className={`corporate-program-card corporate-program-card--${program.id}`}
                  key={program.id}
                >
                  <div className="corporate-program-card-content">
                    <h2>{program.title}</h2>

                    <p className="corporate-program-duration">
                      Total Duration: {program.duration}
                    </p>

                    <p className="corporate-program-focus">
                      Focus: {program.focus}
                    </p>

                    <div className="corporate-program-divider" />

                    <ul className="corporate-program-topics">
                      {program.topics.map((topic) => (
                        <li key={topic}>
                          <BookIcon />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="corporate-program-contact">
                    <Link
                      className="corporate-program-contact-button"
                      to="/contact"
                    >
                      CONTACT US
                    </Link>

                    <div className="corporate-program-phone-block">
                      <strong>For Registration &amp; Queries:</strong>

                      <a href="tel:+918276040204">
                        +91 82760-40204
                      </a>

                      <a href="tel:+919100940542">
                        +91 91009-40542
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="corporate-program-help">
              <div>
                <h2>Need help choosing a program?</h2>
                <p>
                  Contact our team and we’ll help you find the right course
                  for your career goals.
                </p>
              </div>

              <Link
                to="/contact"
                className="corporate-program-help-button"
              >
                Talk to our team
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="corporate-footer">
        <div className="corporate-footer-inner">

          <div className="corporate-footer-brand">
            <img
              src="/assets/success-scholar-logo.png"
              alt="Success Scholar"
              className="corporate-footer-logo"
            />

            <div className="corporate-footer-brand-text">
              <h2>Success Scholar</h2>
              <p className="corporate-footer-tagline">
                Your Vision. Our Mission.
              </p>
              <p className="corporate-footer-description">
                Empowering students with essential soft skills,
                leadership traits, and real-world readiness to help
                them thrive in today’s competitive environment.
              </p>
            </div>
          </div>

          <div className="corporate-footer-links">
            <h3>Quick Links</h3>
            <Link to="/corporate">Home</Link>
            <Link to="/expertise">What We Offer</Link>
            <Link to="/showcase">Showcase</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="corporate-footer-contact">
            <h3>Contact Us</h3>

            <p>
              <strong>Email:</strong>
              <a href="mailto:info@successscholar.in">
                info@successscholar.in
              </a>
              <a href="mailto:contact.successscholar@gmail.com">
                contact.successscholar@gmail.com
              </a>
            </p>

            <p>
              <strong>Phone:</strong>
              <a href="tel:+918276040204">+91 8276040204</a>
            </p>

            <p>
              <strong>Address:</strong>
              57/4N, Netaji Subhash Chandra Bose Rd, Nehru Colony,
              Ashok Nagar, Tollygunge, Kolkata, West Bengal 700040
            </p>
          </div>

        </div>

        <div className="corporate-footer-bottom">
          <Link to="/privacy-policy">Privacy Policy</Link>

          <p>© 2026 Success Scholar.</p>
        </div>
      </footer>

    </div>
  );
}
