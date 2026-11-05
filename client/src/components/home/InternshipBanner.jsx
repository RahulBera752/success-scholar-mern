import { Link } from 'react-router-dom';

export default function InternshipBanner() {
  return (
    <section className="intern-banner-home">
      <Link
        to="/internship"
        className="intern-banner-home__link"
        aria-label="Explore the Success Scholar Internship 2026"
      >
        <img
          className="intern-banner-home__artwork"
          src="/assets/internship-banner.jpg"
          alt="Success Scholar, an ISO 9001:2015 certified company. Internship 2026 coming soon. Employability Skills, Entrepreneurship, Technical skills."
        />
        <span className="intern-banner-home__circle" aria-hidden="true" />
        <div className="intern-banner-home__mobile-content">
          <span className="intern-banner-home__brand">SUCCESS SCHOLAR</span>
          <span className="intern-banner-home__certification">An ISO 9001:2015 Certified company</span>
          <span className="intern-banner-home__title">INTERNSHIP 2026</span>
          <span className="intern-banner-home__coming">Coming Soon</span>
          <ul className="intern-banner-home__skills">
            <li>Employability Skills</li>
            <li>Entrepreneurship</li>
            <li>Technical skills</li>
          </ul>
        </div>
      </Link>
    </section>
  );
}
