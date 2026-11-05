import { useEffect } from 'react';
import { X, Phone, Mail, Clock } from 'lucide-react';

export default function CourseEnquiry({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="course-enquiry-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        className="course-enquiry-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-enquiry-title"
      >
        <button
          type="button"
          className="course-enquiry-close"
          aria-label="Close course enquiry"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <div className="course-enquiry-icon" aria-hidden="true">?</div>
        <h2 id="course-enquiry-title">Course Enquiry</h2>
        <p className="course-enquiry-intro">
          Interested in one of our courses? Contact us and our team will be happy to help.
        </p>

        <div className="course-enquiry-contact-list">
          <a href="tel:+918276040204" className="course-enquiry-contact-item">
            <span className="course-enquiry-contact-icon"><Phone size={19} /></span>
            <span><strong>Call Us</strong><small>+91 8276040204</small></span>
          </a>
          <a href="mailto:contact.successscholar@gmail.com" className="course-enquiry-contact-item">
            <span className="course-enquiry-contact-icon"><Mail size={19} /></span>
            <span><strong>Email Us</strong><small>contact.successscholar@gmail.com</small></span>
          </a>
          <div className="course-enquiry-contact-item">
            <span className="course-enquiry-contact-icon"><Clock size={19} /></span>
            <span><strong>Availability</strong><small>Monday–Saturday, 12 PM–8 PM</small></span>
          </div>
        </div>

        <p className="course-enquiry-note">
          Please call or email us for course details, fees, and registration assistance.
        </p>
        <button type="button" className="course-enquiry-done" onClick={onClose}>
          Close
        </button>
      </section>

      <style>{`
        .course-enquiry-overlay {
          position: fixed;
          inset: 0;
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(8, 15, 40, .68);
          backdrop-filter: blur(4px);
        }
        .course-enquiry-modal {
          position: relative;
          width: min(460px, 100%);
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          padding: 34px 30px 28px;
          border-radius: 18px;
          background: #fff;
          color: #172554;
          box-shadow: 0 24px 80px rgba(0, 0, 0, .28);
          font-family: inherit;
          animation: courseEnquiryIn .18s ease-out;
        }
        @keyframes courseEnquiryIn {
          from { opacity: 0; transform: translateY(8px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .course-enquiry-close {
          position: absolute;
          top: 13px;
          right: 13px;
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 50%;
          background: #f1f5f9;
          color: #172554;
          cursor: pointer;
        }
        .course-enquiry-close:hover { background: #e2e8f0; }
        .course-enquiry-icon {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          margin: 0 auto 14px;
          border-radius: 14px;
          background: #e8edff;
          color: #08245f;
          font-size: 27px;
          font-weight: 800;
        }
        .course-enquiry-modal h2 {
          margin: 0;
          color: #080d68;
          font-size: 27px;
          font-weight: 800;
          text-align: center;
        }
        .course-enquiry-intro {
          margin: 10px 0 23px;
          color: #64748b;
          font-size: 14px;
          line-height: 1.65;
          text-align: center;
        }
        .course-enquiry-contact-list { display: grid; gap: 12px; }
        .course-enquiry-contact-item {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 14px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          color: inherit;
          text-decoration: none;
        }
        .course-enquiry-contact-item:hover { border-color: #a5b4fc; background: #f8faff; }
        .course-enquiry-contact-icon {
          display: grid;
          place-items: center;
          flex: 0 0 42px;
          height: 42px;
          border-radius: 11px;
          background: #eef2ff;
          color: #172a80;
        }
        .course-enquiry-contact-item strong,
        .course-enquiry-contact-item small { display: block; }
        .course-enquiry-contact-item strong { margin-bottom: 4px; font-size: 14px; }
        .course-enquiry-contact-item small { color: #64748b; font-size: 13px; overflow-wrap: anywhere; }
        .course-enquiry-note {
          margin: 18px 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
          text-align: center;
        }
        .course-enquiry-done {
          width: 100%;
          min-height: 45px;
          border: 0;
          border-radius: 999px;
          background: #080d68;
          color: #fff;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }
        .course-enquiry-done:hover { background: #172a80; }
        @media (max-width: 480px) {
          .course-enquiry-modal { padding: 30px 20px 22px; }
          .course-enquiry-modal h2 { font-size: 24px; }
        }
      `}</style>
    </div>
  );
}
