
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/certificate-portal.css';

const initialForm = {
  collegeName: '',
  registrationNumber: '',
  semester: '',
};

export default function CertificatePortal() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [certificates, setCertificates] = useState([]);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [searched, setSearched] = useState(false);

  const updateField = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
    setMessage('');
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setSearched(true);
    setStatus('loading');
    setCertificates([]);
    setMessage('');

    try {
      const query = new URLSearchParams({
        collegeName: form.collegeName.trim(),
        registrationNumber: form.registrationNumber.trim(),
        semester: form.semester,
      });

      // Requires the backend certificate lookup endpoint.
      const result = await api(
        `/certificates/lookup?${query.toString()}`,
        { auth: true }
      );

      const items = Array.isArray(result)
        ? result
        : result?.certificates || [];

      const available = items.filter(
        (item) => item.pdfUrl || item.downloadUrl
      );

      setCertificates(available);
      setStatus(available.length ? 'success' : 'empty');

      if (!available.length) {
        setMessage(
          'No downloadable certificate was found for these details. Please verify your information or contact Success Scholar.'
        );
      }
    } catch (error) {
      setCertificates([]);
      setStatus('error');
      setMessage(
        error.message ||
          'The certificate service could not be reached. Please try again later.'
      );
    }
  };

  const handleDownload = (certificate) => {
    const url = certificate.pdfUrl || certificate.downloadUrl;

    if (!url) {
      setMessage('A downloadable PDF is not available for this certificate.');
      return;
    }

    // Open only the PDF URL returned by the certificate service.
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="certificate-portal">
      <header className="certificate-topbar">
        <Link to="/student" className="certificate-brand">
          <span className="certificate-brand-mark">S</span>
          <span>
            <strong>SUCCESS SCHOLAR</strong>
            <small>STUDENT SERVICES</small>
          </span>
        </Link>

        <Link to="/student" className="certificate-back-link">
          <span aria-hidden="true">←</span> Dashboard
        </Link>
      </header>

      <section className="certificate-hero">
        <div className="certificate-hero-content">
          <span className="certificate-eyebrow">
            STUDENT DOCUMENT CENTRE
          </span>

          <h1>
            Your achievements.
            <br />
            <span>Your certificate.</span>
          </h1>

          <p>
            Find and download your officially issued Success Scholar
            certificates in a few simple steps.
          </p>

          <div className="certificate-trust-row">
            <span>
              <span className="certificate-check">✓</span>
              Secure student access
            </span>
            <span>
              <span className="certificate-check">✓</span>
              Verified records
            </span>
          </div>
        </div>

        <div className="certificate-hero-art" aria-hidden="true">
          <div className="certificate-orbit certificate-orbit-one" />
          <div className="certificate-orbit certificate-orbit-two" />

          <div className="certificate-preview">
            <div className="certificate-preview-top">
              <span className="certificate-preview-seal">S</span>
              <span>SUCCESS SCHOLAR</span>
            </div>

            <div className="certificate-preview-line" />
            <span className="certificate-preview-kicker">
              CERTIFICATE OF ACHIEVEMENT
            </span>
            <strong className="certificate-preview-title">
              Certificate
              <br />
              of Completion
            </strong>
            <div className="certificate-preview-decoration">✦</div>
            <div className="certificate-preview-signature">
              <span />
              <small>Authorized Signatory</small>
            </div>
          </div>

          <div className="certificate-float-tag">
            <span className="certificate-float-icon">✓</span>
            Official records
          </div>
        </div>
      </section>

      <section className="certificate-main">
        <div className="certificate-section-heading">
          <span>DOWNLOAD CENTRE</span>
          <h2>Find your certificate</h2>
          <p>
            Enter the details exactly as registered with your college
            or Success Scholar.
          </p>
        </div>

        <div className="certificate-search-layout">
          <form
            className="certificate-search-card"
            onSubmit={handleSearch}
          >
            <div className="certificate-card-heading">
              <span className="certificate-card-icon">⌕</span>
              <div>
                <h3>Student verification</h3>
                <p>All fields are required</p>
              </div>
            </div>

            <div className="certificate-form-field">
              <label htmlFor="certificate-student-name">
                Student name
              </label>
              <input
                id="certificate-student-name"
                type="text"
                value={user?.name || ''}
                readOnly
                placeholder="Signed-in student"
              />
              <small>Retrieved from your signed-in account.</small>
            </div>

            <div className="certificate-form-field">
              <label htmlFor="certificate-college">
                College name
              </label>
              <input
                id="certificate-college"
                name="collegeName"
                type="text"
                value={form.collegeName}
                onChange={updateField}
                placeholder="Enter your full college name"
                autoComplete="organization"
                required
                maxLength={150}
              />
            </div>

            <div className="certificate-form-field">
              <label htmlFor="certificate-registration">
                Registration number
              </label>
              <input
                id="certificate-registration"
                name="registrationNumber"
                type="text"
                value={form.registrationNumber}
                onChange={updateField}
                placeholder="e.g. 2024ABC123"
                autoComplete="off"
                required
                maxLength={80}
              />
            </div>

            <div className="certificate-form-field">
              <label htmlFor="certificate-semester">
                Semester
              </label>
              <select
                id="certificate-semester"
                name="semester"
                value={form.semester}
                onChange={updateField}
                required
              >
                <option value="">Select semester</option>
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index + 1} value={String(index + 1)}>
                    Semester {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="certificate-search-button"
              type="submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                'Checking records...'
              ) : (
                <>
                  Find my certificate <span aria-hidden="true">→</span>
                </>
              )}
            </button>

            <p className="certificate-privacy-note">
              Your information is used to locate your certificate
              records. Only certificates returned by the service can
              be downloaded.
            </p>
          </form>

          <aside className="certificate-help-card">
            <div className="certificate-help-icon">?</div>
            <h3>Need help finding your certificate?</h3>
            <p>
              Make sure your college name and registration number
              match the details provided when you enrolled.
            </p>

            <div className="certificate-help-step">
              <span>01</span>
              <div>
                <strong>Verify your details</strong>
                <small>Check spelling and registration number.</small>
              </div>
            </div>

            <div className="certificate-help-step">
              <span>02</span>
              <div>
                <strong>Select your semester</strong>
                <small>Choose the semester for your certificate.</small>
              </div>
            </div>

            <div className="certificate-help-step">
              <span>03</span>
              <div>
                <strong>Download when available</strong>
                <small>Only officially available PDFs are listed.</small>
              </div>
            </div>

            <Link to="/contact" className="certificate-support-link">
              Contact support <span aria-hidden="true">→</span>
            </Link>
          </aside>
        </div>

        {searched && status !== 'loading' && (
          <section
            className={`certificate-results certificate-results-${status}`}
            aria-live="polite"
          >
            {status === 'success' ? (
              <>
                <div className="certificate-results-heading">
                  <div>
                    <span>SEARCH RESULTS</span>
                    <h2>Certificates available</h2>
                  </div>
                  <span className="certificate-result-count">
                    {certificates.length}
                  </span>
                </div>

                {certificates.map((certificate, index) => (
                  <article
                    className="certificate-result-item"
                    key={certificate.id || certificate._id || index}
                  >
                    <div className="certificate-result-file">PDF</div>
                    <div className="certificate-result-details">
                      <strong>
                        {certificate.title ||
                          certificate.certificateName ||
                          'Success Scholar Certificate'}
                      </strong>
                      <span>
                        Semester {certificate.semester || form.semester}
                        {certificate.issuedAt
                          ? ` · Issued ${new Date(
                              certificate.issuedAt
                            ).toLocaleDateString('en-IN')}`
                          : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="certificate-download-button"
                      onClick={() => handleDownload(certificate)}
                    >
                      Download PDF ↓
                    </button>
                  </article>
                ))}
              </>
            ) : (
              <div className="certificate-empty-state">
                <span className="certificate-empty-icon">
                  {status === 'error' ? '!' : '⌕'}
                </span>
                <h2>
                  {status === 'error'
                    ? 'Unable to check certificates'
                    : 'No certificate found yet'}
                </h2>
                <p>{message}</p>
                <button
                  type="button"
                  className="certificate-retry-button"
                  onClick={() => {
                    setSearched(false);
                    setStatus('idle');
                    setMessage('');
                  }}
                >
                  Check details again
                </button>
              </div>
            )}
          </section>
        )}
      </section>

      <footer className="certificate-footer">
        <div>
          <strong>SUCCESS SCHOLAR</strong>
          <p>Your Vision. Our Mission.</p>
        </div>
        <span>© {new Date().getFullYear()} Success Scholar</span>
      </footer>
    </main>
  );
}
