import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const announcements = [
  {
    id: 1,
    category: 'Internships',
    tag: 'Opportunity',
    title: 'Applications Open: Summer Internship Programme 2027',
    date: '31 October 2026',
    time: '10:30 AM',
    featured: true,
    description:
      'Explore a new learning opportunity designed to help students gain practical experience, build professional skills and work on industry-oriented projects.',
    action: 'View opportunity',
  },
  {
    id: 2,
    category: 'Placements',
    tag: 'Placement update',
    title: 'Upcoming Placement Preparation and Mock Interview Session',
    date: '29 October 2026',
    time: '04:00 PM',
    description:
      'A guided session covering resume shortlisting, common HR questions, interview etiquette and confidence-building techniques.',
    action: 'Read details',
  },
  {
    id: 3,
    category: 'Workshops & Events',
    tag: 'Workshop',
    title: 'Communication Skills: Live Workshop for Students',
    date: '27 October 2026',
    time: '11:00 AM',
    description:
      'Join an interactive workshop focused on business communication, group discussions, presentations and workplace confidence.',
    action: 'View schedule',
  },
  {
    id: 4,
    category: 'Important Notices',
    tag: 'Important',
    title: 'Student Profile and Contact Details Verification',
    date: '24 October 2026',
    time: '09:15 AM',
    description:
      'Please review your profile information and make sure your email address and mobile number are up to date.',
    action: 'Review profile',
  },
  {
    id: 5,
    category: 'Achievements',
    tag: 'Student success',
    title: 'Celebrating Our Students’ Learning Milestones',
    date: '21 October 2026',
    time: '02:30 PM',
    description:
      'We are celebrating the dedication and progress of students who have completed their recent learning milestones.',
    action: 'Read more',
  },
  {
    id: 6,
    category: 'Workshops & Events',
    tag: 'Webinar',
    title: 'Career Readiness: Getting Ready for the Corporate World',
    date: '18 October 2026',
    time: '12:00 PM',
    description:
      'Learn about workplace expectations, professional conduct, teamwork and the skills employers value in fresh graduates.',
    action: 'View details',
  },
];

const categories = [
  'All Updates',
  'Internships',
  'Placements',
  'Workshops & Events',
  'Important Notices',
  'Achievements',
];

const categoryColors = {
  Internships: '#087e70',
  Placements: '#2458b8',
  'Workshops & Events': '#8053b5',
  'Important Notices': '#b66b13',
  Achievements: '#b34d78',
};

export default function StudentAnnouncements() {
  const [activeCategory, setActiveCategory] = useState('All Updates');
  const [search, setSearch] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const filteredAnnouncements = useMemo(() => {
    const term = search.trim().toLowerCase();
    return announcements.filter((item) => {
      const matchesCategory =
        activeCategory === 'All Updates' || item.category === activeCategory;
      const matchesSearch =
        !term ||
        `${item.title} ${item.description} ${item.category}`
          .toLowerCase()
          .includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <main className="updates-page">
      <style>{`
        .updates-page{min-height:100vh;background:#f4f7fc;padding:34px 20px 70px;color:#17243b}
        .updates-container{max-width:1120px;margin:0 auto}
        .updates-topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:28px}
        .updates-back{display:inline-flex;align-items:center;gap:8px;color:#244b8e;text-decoration:none;font-weight:700}
        .updates-back:hover{text-decoration:underline}
        .updates-hero{position:relative;overflow:hidden;background:linear-gradient(120deg,#09285f,#174b91 65%,#2874b8);border-radius:22px;padding:38px 42px;color:#fff;box-shadow:0 16px 40px rgba(17,54,105,.16)}
        .updates-hero:after{content:"";position:absolute;width:260px;height:260px;border:1px solid rgba(255,255,255,.15);border-radius:50%;right:7%;top:-145px;box-shadow:0 0 0 28px rgba(255,255,255,.035),0 0 0 58px rgba(255,255,255,.025)}
        .updates-eyebrow{font-size:12px;letter-spacing:2px;font-weight:800;text-transform:uppercase;color:#b9d8ff;margin:0 0 12px}
        .updates-hero h1{font-size:clamp(30px,4vw,42px);line-height:1.15;margin:0 0 12px;color:#fff}
        .updates-hero p{max-width:650px;line-height:1.7;color:#e0ebfb;margin:0}
        .updates-stats{display:flex;gap:28px;flex-wrap:wrap;margin-top:25px}
        .updates-stat strong{display:block;font-size:22px;color:#fff}
        .updates-stat span{font-size:12px;color:#c6d9f2}
        .updates-tools{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:30px 0 18px}
        .updates-tools h2{font-size:22px;margin:0;color:#17243b}
        .updates-search{width:min(330px,100%);border:1px solid #d9e1ed;border-radius:11px;background:#fff;padding:12px 15px;font:inherit;outline:none}
        .updates-search:focus{border-color:#2b65ad;box-shadow:0 0 0 3px rgba(43,101,173,.12)}
        .updates-filters{display:flex;gap:9px;flex-wrap:wrap;margin-bottom:22px}
        .updates-filter{border:1px solid #dce4ef;background:#fff;color:#52627a;border-radius:999px;padding:9px 15px;font-weight:650;font-size:13px;cursor:pointer}
        .updates-filter.active{background:#123d79;border-color:#123d79;color:#fff}
        .updates-featured{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center;background:#eaf2ff;border:1px solid #d5e4fb;border-radius:15px;padding:19px 22px;margin-bottom:20px}
        .updates-featured-label{display:inline-block;color:#1c559e;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-bottom:7px}
        .updates-featured h3{margin:0 0 5px;font-size:17px;color:#163c70}
        .updates-featured p{margin:0;color:#5a6c85;font-size:13px;line-height:1.55}
        .updates-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
        .update-card{background:#fff;border:1px solid #e4eaf2;border-radius:15px;padding:21px;box-shadow:0 5px 18px rgba(24,48,82,.045);display:flex;flex-direction:column;min-height:220px}
        .update-card-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:15px}
        .update-category{font-size:11px;font-weight:800;letter-spacing:.3px;text-transform:uppercase}
        .update-tag{font-size:11px;background:#f1f4f8;color:#617087;border-radius:999px;padding:6px 9px}
        .update-card h3{font-size:17px;line-height:1.4;margin:0 0 9px;color:#1b2b45}
        .update-card p{font-size:13px;line-height:1.65;color:#66758b;margin:0 0 17px}
        .update-card-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:auto;padding-top:12px;border-top:1px solid #eef1f5}
        .update-date{font-size:11px;color:#8793a5}
        .update-action{border:0;background:none;color:#1e579b;font-weight:750;font-size:12px;cursor:pointer;padding:4px 0}
        .updates-empty{background:#fff;border:1px dashed #ccd7e5;border-radius:15px;padding:42px 20px;text-align:center;color:#697990;grid-column:1/-1}
        .updates-disclaimer{margin:22px 0 0;color:#8995a6;font-size:11px;text-align:center}
        .updates-modal-backdrop{position:fixed;inset:0;z-index:1000;background:rgba(10,22,42,.62);display:flex;align-items:center;justify-content:center;padding:20px}
        .updates-modal{position:relative;width:min(620px,100%);max-height:min(85vh,760px);overflow:auto;background:#fff;border-radius:20px;padding:30px;box-shadow:0 24px 80px rgba(0,0,0,.25);animation:updatesModalIn .18s ease-out}
        .updates-modal-close{position:absolute;right:18px;top:16px;width:36px;height:36px;border:0;border-radius:50%;background:#f0f3f8;color:#40516a;font-size:23px;cursor:pointer}
        .updates-modal h2{font-size:24px;line-height:1.3;color:#172b49;margin:12px 38px 12px 0}
        .updates-modal-meta{font-size:12px;color:#77869b;margin-bottom:20px}
        .updates-modal-description{font-size:14px;line-height:1.8;color:#5d6e85;white-space:pre-line}
        .updates-modal-note{margin-top:22px;padding:15px 17px;border-radius:12px;background:#f1f6fd;color:#315783;font-size:13px;line-height:1.65}
        .updates-modal-footer{display:flex;justify-content:flex-end;gap:10px;margin-top:24px}
        .updates-modal-button{border:0;border-radius:9px;padding:11px 17px;background:#16477f;color:#fff;font-weight:700;cursor:pointer}
        .updates-modal-button.secondary{background:#eef2f7;color:#40516a}
        @keyframes updatesModalIn{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        @media(max-width:520px){.updates-modal{padding:24px 20px}.updates-modal h2{font-size:20px}}
        @media(max-width:700px){.updates-page{padding:20px 14px 45px}.updates-hero{padding:28px 23px}.updates-tools{align-items:stretch;flex-direction:column}.updates-search{width:auto}.updates-grid{grid-template-columns:1fr}.updates-featured{grid-template-columns:1fr}.updates-topbar{margin-bottom:18px}}
      `}</style>

      <div className="updates-container">
        <div className="updates-topbar">
          <Link className="updates-back" to="/student">← Back to Dashboard</Link>
          <span style={{ color: '#77869b', fontSize: 13 }}>Student Portal</span>
        </div>

        <section className="updates-hero">
          <p className="updates-eyebrow">SUCCESS SCHOLAR • STUDENT NOTICEBOARD</p>
          <h1>Latest Updates & Announcements</h1>
          <p>
            Stay informed about internship opportunities, placement activities,
            workshops, important notices and student achievements.
          </p>
          <div className="updates-stats">
            <div className="updates-stat"><strong>{announcements.length}</strong><span>Recent updates</span></div>
            <div className="updates-stat"><strong>5</strong><span>Categories</span></div>
            <div className="updates-stat"><strong>24×7</strong><span>Access to notices</span></div>
          </div>
        </section>

        <div className="updates-tools">
          <h2>Explore announcements</h2>
          <input
            className="updates-search"
            type="search"
            placeholder="Search updates..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search announcements"
          />
        </div>

        <div className="updates-filters" aria-label="Filter announcements">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`updates-filter ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {activeCategory === 'All Updates' && !search && (
          <section className="updates-featured">
            <div>
              <span className="updates-featured-label">★ Featured announcement</span>
              <h3>{announcements[0].title}</h3>
              <p>{announcements[0].description}</p>
            </div>
            <span style={{ color: '#52739d', fontSize: 12, whiteSpace: 'nowrap' }}>31 Oct 2026</span>
          </section>
        )}

        <div className="updates-grid">
          {filteredAnnouncements.map((item) => (
            <article className="update-card" key={item.id}>
              <div className="update-card-top">
                <span className="update-category" style={{ color: categoryColors[item.category] }}>
                  {item.category}
                </span>
                <span className="update-tag">{item.tag}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="update-card-footer">
                <span className="update-date">{item.date} · {item.time}</span>
                <button
                  type="button"
                  className="update-action"
                  onClick={() => setSelectedAnnouncement(item)}
                >
                  {item.action} →
                </button>
              </div>
            </article>
          ))}
          {filteredAnnouncements.length === 0 && (
            <div className="updates-empty">
              <strong>No announcements found</strong>
              <p>Try another keyword or choose a different category.</p>
            </div>
          )}
        </div>

        <p className="updates-disclaimer">
          Demo content for preview only. These sample announcements are not live or official updates.
        </p>

        {selectedAnnouncement && (
          <div
            className="updates-modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedAnnouncement(null);
            }}
          >
            <section
              className="updates-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="announcement-modal-title"
            >
              <button
                type="button"
                className="updates-modal-close"
                aria-label="Close announcement details"
                onClick={() => setSelectedAnnouncement(null)}
              >
                ×
              </button>
              <span
                className="update-category"
                style={{ color: categoryColors[selectedAnnouncement.category] }}
              >
                {selectedAnnouncement.category}
              </span>
              <h2 id="announcement-modal-title">{selectedAnnouncement.title}</h2>
              <div className="updates-modal-meta">
                {selectedAnnouncement.tag} · {selectedAnnouncement.date} · {selectedAnnouncement.time}
              </div>
              <p className="updates-modal-description">{selectedAnnouncement.description}</p>
              <div className="updates-modal-note">
                <strong>What should you do?</strong><br />
                Please read this update carefully and check the official Success Scholar portal or contact the support team for confirmed details. This is currently sample content for website demonstration; no real application, registration, or booking is submitted from this popup.
              </div>
              <div className="updates-modal-footer">
                <button
                  type="button"
                  className="updates-modal-button secondary"
                  onClick={() => setSelectedAnnouncement(null)}
                >
                  Close
                </button>
                {selectedAnnouncement.category === 'Important Notices' && (
                  <Link
                    className="updates-modal-button"
                    style={{ textDecoration: 'none' }}
                    to="/student/profile"
                    onClick={() => setSelectedAnnouncement(null)}
                  >
                    Open My Profile
                  </Link>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
