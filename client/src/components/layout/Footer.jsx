import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SocialLinks from '../common/SocialLinks.jsx';

export default function Footer() {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('/api/analytics/visitors', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch visitor count');
        }

        const data = await response.json();

        if (typeof data.totalVisitors === 'number') {
          setVisitorCount(data.totalVisitors);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Unable to load visitor count:', error);
        }
      }
    };

    fetchVisitorCount();

    return () => controller.abort();
  }, []);

  return (
    <footer className="footer" id="footer">
      <div className="container footer-grid">
        <section
          className="footer-about"
          aria-labelledby="footer-brand-title"
        >
          <div className="footer-brand">
            <img
              className="footer-logo"
              src="/assets/success-scholar-logo.png"
              alt="Success Scholar logo"
            />

            <div className="footer-brand-copy">
              <h3 id="footer-brand-title">Success Scholar</h3>
              <p className="footer-tag">Your Vision. Our Mission.</p>
            </div>
          </div>

          <p className="footer-description">
            Empowering students with essential soft skills, leadership
            traits, and real-world readiness to help them thrive in
            today’s competitive environment.
          </p>
        </section>

        <nav
          className="footer-quick-links"
          aria-label="Footer quick links"
        >
          <h4>Quick Links</h4>

          <ul className="footer-link-list">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/expertise">What We Offer</Link></li>
            <li><Link to="/portfolio">Showcase</Link></li>
            <li><Link to="/home#about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <section
          className="footer-contact"
          aria-labelledby="footer-contact-title"
        >
          <h4 id="footer-contact-title">Contact Us</h4>

          <p className="footer-contact-line">
            Email:<br />
            <a href="mailto:info@successscholar.in">
              info@successscholar.in
            </a>
          </p>

          <p className="footer-contact-line">
            <a href="mailto:contact.successscholar@gmail.com">
              contact.successscholar@gmail.com
            </a>
          </p>

          <p className="footer-contact-line">
            Phone:<br />
            <a href="tel:+918276040204">+91 8276040204</a>
          </p>

          <p className="footer-contact-line">
            Address:<br />
            <a
              href="https://maps.app.goo.gl/EQDiuFUH64Cc1CYG7"
              target="_blank"
              rel="noreferrer"
            >
              57/4N, Netaji Subhash Chandra Bose Rd, Nehru Colony,
              Ashok Nagar, Tollygunge, Kolkata, West Bengal 700040
            </a>
          </p>

          <SocialLinks />
        </section>
      </div>

      <div className="footer-bottom">
        <Link to="/privacy-policy">Privacy Policy</Link>

        <span className="footer-visitors" aria-live="polite">
          Total Visitors:{' '}
          <strong>
            {visitorCount === null
              ? 'Loading...'
              : visitorCount.toLocaleString('en-IN')}
          </strong>
        </span>

        <span className="footer-copyright">
          © 2026 Success Scholar.
        </span>
      </div>
    </footer>
  );
}