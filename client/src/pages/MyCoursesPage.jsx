

import { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { api } from '../api.js';

import { useAuth } from '../context/AuthContext.jsx';

import '../styles/my-courses-page.css';
import '../styles/demo-bookings-additions.css';



const API_BASE_URL = (

  import.meta.env.VITE_API_URL || 'http://localhost:5000'

).replace(/\/+$/, '');



const DEFAULT_COURSES = {

  'soft-skills': {

    title: 'Soft Skills',

    category: 'PERSONAL GROWTH',

    image: '/assets/courses/soft.png',

    description:

      'Build confidence, communicate clearly, and develop the professional skills employers value.',

    modules: 8,

  },

  'interview-prep': {

    title: 'Interview Preparation',

    category: 'CAREER DEVELOPMENT',

    image: '/assets/courses/inter.png',

    description:

      'Prepare for interviews with resume guidance, mock interviews, and practical HR preparation.',

    modules: 10,

  },

  'personality-dev': {

    title: 'Personality Development',

    category: 'PERSONAL GROWTH',

    image: '/assets/courses/per.png',

    description:

      'Improve confidence, body language, leadership, and your professional presence.',

    modules: 8,

  },

  'adv-comm': {

    title: 'Advanced Communication Skills',

    category: 'COMMUNICATION',

    image: '/assets/courses/com.png',

    description:

      'Strengthen workplace communication, teamwork, and problem-solving skills.',

    modules: 9,

  },

  'spoken-english': {

    title: 'Spoken English',

    category: 'LANGUAGE',

    image: '/assets/courses/spo.png',

    description:

      'Improve your English fluency, vocabulary, grammar, and everyday conversation.',

    modules: 8,

  },

  'campus-readiness': {

    title: 'Campus Readiness Training',

    category: 'PLACEMENT PREPARATION',

    image: '/assets/courses/cor.png',

    description:

      'Prepare for placements through aptitude practice, group discussions, and interview training.',

    modules: 12,

  },

};



function getCourseId(item) {

  const value =

    item?.courseId ??

    item?.course_id ??

    item?.course?._id ??

    item?.course?.id ??

    item?.courseSlug ??

    item?.course;



  if (value && typeof value === 'object') {

    return String(value._id ?? value.id ?? value.slug ?? '');

  }



  return String(value ?? '');

}



function getCourseTitle(item) {

  return (

    item?.courseName ||

    item?.courseTitle ||

    item?.title ||

    item?.course?.title ||

    item?.name ||

    'My Course'

  );

}



function getPurchaseTimestamp(item) {

  const value =

    item?.purchasedAt ||

    item?.purchaseDate ||

    item?.paidAt ||

    item?.paymentDate ||

    item?.createdAt ||

    item?.date ||

    item?.order?.createdAt ||

    item?.payment?.createdAt;



  if (!value) return 0;



  const timestamp = new Date(value).getTime();

  return Number.isFinite(timestamp) ? timestamp : 0;

}



function getUniqueCourseKey(course) {
  // Prefer the stable course ID; fall back to a normalized title when
  // the API does not provide a course ID.
  const id = String(course?.courseId || '').trim().toLowerCase();
  if (id) return `id:${id}`;

  return `title:${String(course?.title || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')}`;
}


function isPaid(item) {

  const status = String(

    item?.paymentStatus ?? item?.status ?? ''

  ).toLowerCase();



  return (

    !status ||

    ['paid', 'success', 'successful', 'verified', 'completed'].includes(

      status

    )

  );

}



function getProgress(item) {

  const raw =

    item?.progress?.percentage ??

    item?.progressPercentage ??

    item?.completionPercentage;



  const number = Number(raw);



  return Number.isFinite(number)

    ? Math.min(100, Math.max(0, number))

    : 0;

}



function CourseArtwork({ course }) {

  return (

    <div className="mcp-artwork">

      <img

        src={course.image}

        alt={course.title}

        onError={(event) => {

          event.currentTarget.style.display = 'none';

        }}

      />

      <div className="mcp-artwork-shade" />

      <span className="mcp-artwork-category">

        {course.category}

      </span>

      <span className="mcp-artwork-symbol" aria-hidden="true">

        ✦

      </span>

    </div>

  );

}



export default function MyCoursesPage() {

  const { user } = useAuth();

  const navigate = useNavigate();



  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [filter, setFilter] = useState('all');

  const [search, setSearch] = useState('');

  // Demo booking state (used by the existing Demo Bookings section).
  const [demoLoading, setDemoLoading] = useState(true);
  const [demoError, setDemoError] = useState('');
  const [demoBookings, setDemoBookings] = useState([]);


  // Newest purchases are shown first by default.

  const [sortBy, setSortBy] = useState('newest');





  useEffect(() => {

    let cancelled = false;



    async function loadCourses() {

      setLoading(true);

      setError('');



      try {

        const result = await api('/payment/my-courses', {

          auth: true,

        });



        const list = Array.isArray(result)

          ? result

          : result?.courses ||

            result?.purchasedCourses ||

            [];



        if (!cancelled) {

          const mappedCourses = list.filter(isPaid).map((item, index) => {

              const id = getCourseId(item);

              const title = getCourseTitle(item);



              const defaults =

                DEFAULT_COURSES[id] ||

                Object.values(DEFAULT_COURSES).find(

                  (course) =>

                    course.title.toLowerCase() ===

                    title.toLowerCase()

                ) ||

                {};



              return {

                ...item,

                _pageKey: String(

                  item?._id || id || `${title}-${index}`

                ),

                courseId: id,

                title,

                image: item?.image || item?.course?.image || defaults.image ||

                  '/assets/courses/soft.png',

                category:

                  item?.category ||

                  item?.course?.category ||

                  defaults.category ||

                  'YOUR LEARNING JOURNEY',

                description:

                  item?.description ||

                  item?.course?.description ||

                  defaults.description ||

                  'Continue developing your skills with your purchased course.',

                modules:

                  item?.totalModules ||

                  item?.course?.totalModules ||

                  defaults.modules ||

                  null,

                progress: getProgress(item),

              };

            });

          // Keep one card per course. Sort payment records by purchase date
          // first so the newest successful purchase is the one retained.
          const newestFirst = [...mappedCourses].sort(
            (a, b) => getPurchaseTimestamp(b) - getPurchaseTimestamp(a)
          );
          const uniqueCourses = [];
          const seenCourseKeys = new Set();

          newestFirst.forEach((course) => {
            const key = getUniqueCourseKey(course);
            if (key === 'title:') return;
            if (seenCourseKeys.has(key)) return;
            seenCourseKeys.add(key);
            uniqueCourses.push(course);
          });

          setItems(uniqueCourses);

        }

      } catch (err) {

        if (!cancelled) {

          setError(

            err?.message ||

              'Unable to load your courses. Please try again.'

          );

        }

      } finally {

        if (!cancelled) setLoading(false);

      }

    }



    loadCourses();



    return () => {

      cancelled = true;

    };

  }, []);



  useEffect(() => {
    let cancelled = false;

    async function loadDemoBookings() {
      setDemoLoading(true);
      setDemoError('');

      try {
        const result = await api('/payment/my-demo-bookings', { auth: true });
        const list = Array.isArray(result)
          ? result
          : result?.bookings || result?.demoBookings || [];

        if (!cancelled) {
          setDemoBookings(
            list.filter((booking) =>
              ['paid', 'success', 'successful', 'verified', 'completed'].includes(
                String(booking.paymentStatus || booking.status || '').toLowerCase()
              )
            )
          );
        }
      } catch (err) {
        if (!cancelled) {
          setDemoBookings([]);
          setDemoError(err?.message || 'Unable to load your demo bookings.');
        }
      } finally {
        if (!cancelled) setDemoLoading(false);
      }
    }

    loadDemoBookings();
    return () => { cancelled = true; };
  }, []);

  const completed = items.filter(

    (item) => item.progress >= 100

  ).length;



  const inProgress = items.filter(

    (item) => item.progress > 0 && item.progress < 100

  ).length;



  const filteredItems = items.filter((item) => {

    const matchesSearch =

      item.title.toLowerCase().includes(search.toLowerCase()) ||

      item.category.toLowerCase().includes(search.toLowerCase());



    const matchesFilter =

      filter === 'all' ||

      (filter === 'progress' &&

        item.progress > 0 &&

        item.progress < 100) ||

      (filter === 'not-started' && item.progress === 0) ||

      (filter === 'completed' && item.progress >= 100);



    return matchesSearch && matchesFilter;

  });



  const sortedItems = [...filteredItems].sort((a, b) => {

    if (sortBy === 'oldest') {

      return getPurchaseTimestamp(a) - getPurchaseTimestamp(b);

    }



    if (sortBy === 'title-asc') {

      return a.title.localeCompare(b.title);

    }



    if (sortBy === 'title-desc') {

      return b.title.localeCompare(a.title);

    }



    // Default: most recently purchased course first.

    return getPurchaseTimestamp(b) - getPurchaseTimestamp(a);

  });



  return (

    <main className="mcp-page">

      <header className="mcp-topbar">

        <Link to="/student" className="mcp-brand">

          <img

            src="/assets/success-scholar-logo.png"

            alt="Success Scholar"

          />

        </Link>



        <div className="mcp-topbar-right">

          <span className="mcp-student-greeting">

            Welcome, {user?.name?.split(' ')[0] || 'Student'}

          </span>



          <Link to="/student" className="mcp-back-link">

            <span aria-hidden="true">←</span> Dashboard

          </Link>

        </div>

      </header>



      <section className="mcp-hero">

        <div className="mcp-hero-content">

          <div className="mcp-eyebrow">

            <span className="mcp-eyebrow-dot" />

            YOUR PERSONAL LEARNING SPACE

          </div>



          <h1>

            Learn something

            <br />

            <span>extraordinary.</span>

          </h1>



          <p>

            Your goals. Your courses. Your next big opportunity.

            Pick up where you left off and keep moving forward.

          </p>



          <div className="mcp-hero-stats">

            <div>

              <strong>{items.length}</strong>

              <span>Enrolled courses</span>

            </div>



            <div>

              <strong>{inProgress}</strong>

              <span>In progress</span>

            </div>



            <div>

              <strong>{completed}</strong>

              <span>Completed</span>

            </div>

          </div>

        </div>



        <div className="mcp-hero-decoration" aria-hidden="true">

          <div className="mcp-orbit mcp-orbit-one" />

          <div className="mcp-orbit mcp-orbit-two" />

          <div className="mcp-hero-star">✦</div>

          <div className="mcp-floating-card mcp-floating-card-one">

            <span>✧</span>

            <div>

              <strong>Your future</strong>

              <small>Starts with learning</small>

            </div>

          </div>

          <div className="mcp-floating-card mcp-floating-card-two">

            <span>↗</span>

            <div>

              <strong>Keep growing</strong>

              <small>One lesson at a time</small>

            </div>

          </div>

        </div>

      </section>



      <section className="mcp-content">

        <div className="mcp-section-heading">

          <div>

            <span className="mcp-section-kicker">YOUR LIBRARY</span>

            <h2>My Courses<span>.</span></h2>

            <p>

              Everything you have purchased, all in one place.

            </p>

          </div>



          <Link to="/student#courses" className="mcp-explore-link">

            Explore courses <span>↗</span>

          </Link>

        </div>



        <div className="mcp-toolbar">

          <label className="mcp-search">

            <span aria-hidden="true">⌕</span>

            <input

              type="search"

              placeholder="Search your courses..."

              value={search}

              onChange={(event) => setSearch(event.target.value)}

            />

          </label>



          <label
            className="mcp-sort-control"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#52627d',
              fontSize: '13px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort purchased courses"
              style={{
                minHeight: '42px',
                padding: '0 34px 0 12px',
                border: '1px solid #dce4f1',
                borderRadius: '10px',
                background: '#fff',
                color: '#102b63',
                font: 'inherit',
                cursor: 'pointer',
                outlineOffset: '2px',
              }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title-asc">Course name (A–Z)</option>
              <option value="title-desc">Course name (Z–A)</option>
            </select>
          </label>

          <div className="mcp-filters" aria-label="Filter courses">

            {[

              ['all', 'All courses'],

              ['progress', 'In progress'],

              ['not-started', 'Not started'],

              ['completed', 'Completed'],

            ].map(([value, label]) => (

              <button

                key={value}

                type="button"

                className={filter === value ? 'active' : ''}

                onClick={() => setFilter(value)}

                aria-pressed={filter === value}

              >

                {label}

              </button>

            ))}

          </div>

        </div>



        {loading && (

          <div className="mcp-message">

            <div className="mcp-spinner" />

            <h3>Preparing your learning space...</h3>

            <p>Loading your purchased courses.</p>

          </div>

        )}



        {!loading && error && (

          <div className="mcp-message mcp-error">

            <span className="mcp-message-icon">!</span>

            <h3>We couldn't load your courses</h3>

            <p>{error}</p>

            <button

              type="button"

              onClick={() => window.location.reload()}

            >

              Try again

            </button>

          </div>

        )}



        {!loading && !error && items.length === 0 && (

          <div className="mcp-empty">

            <div className="mcp-empty-icon">✦</div>

            <span className="mcp-section-kicker">

              YOUR JOURNEY STARTS HERE

            </span>

            <h3>Your classroom is waiting.</h3>

            <p>

              Once you purchase a course and your payment is

              verified, it will appear here with a button to start

              learning.

            </p>

            <Link to="/student#courses" className="mcp-primary-button">

              Discover courses <span>→</span>

            </Link>

          </div>

        )}



        {!loading && !error && items.length > 0 && (

          <>

            <div className="mcp-results-line">

              <span>

                Showing <strong>{filteredItems.length}</strong>{' '}

                {filteredItems.length === 1 ? 'course' : 'courses'}

              </span>

              <span className="mcp-secure-label">

                <span>✓</span> Your learning library

              </span>

            </div>



            {filteredItems.length === 0 ? (

              <div className="mcp-no-results">

                <h3>No courses match your search.</h3>

                <p>Try another keyword or choose a different filter.</p>

                <button

                  type="button"

                  onClick={() => {

                    setSearch('');

                    setFilter('all');

                  }}

                >

                  Clear filters

                </button>

              </div>

            ) : (

              <div className="mcp-course-grid">

                {sortedItems.map((course) => (

                  <article

                    className="mcp-course-card"

                    key={course._pageKey}

                  >

                    <CourseArtwork course={course} />



                    <div className="mcp-course-body">

                      <div className="mcp-course-meta">

                        <span>{course.category}</span>

                        <span className="mcp-purchased-badge">

                          ✓ ENROLLED

                        </span>

                      </div>



                      <h3>{course.title}</h3>

                      <p className="mcp-course-description">

                        {course.description}

                      </p>



                      <div className="mcp-course-details">

                        {course.modules ? (

                          <span>

                            <span aria-hidden="true">▤</span>{' '}

                            {course.modules} modules

                          </span>

                        ) : (

                          <span>

                            <span aria-hidden="true">▤</span>{' '}

                            Course materials

                          </span>

                        )}



                        <span>

                          <span aria-hidden="true">◷</span>{' '}

                          {course.progress >= 100

                            ? 'Completed'

                            : course.progress > 0

                              ? 'In progress'

                              : 'Ready to start'}

                        </span>

                      </div>



                      <div className="mcp-progress-heading">

                        <span>YOUR PROGRESS</span>

                        <strong>{course.progress}%</strong>

                      </div>



                      <div

                        className="mcp-progress-track"

                        role="progressbar"

                        aria-label={`${course.title} progress`}

                        aria-valuemin={0}

                        aria-valuemax={100}

                        aria-valuenow={course.progress}

                      >

                        <div

                          className="mcp-progress-fill"

                          style={{ width: `${course.progress}%` }}

                        />

                      </div>



                      <button

                        type="button"

                        className="mcp-start-button"

                        onClick={() =>

                          navigate(

                            `/student/learn/${encodeURIComponent(

                              course.courseId || course.title

                            )}`

                          )

                        }

                      >

                        {course.progress >= 100

                          ? 'REVISIT COURSE'

                          : course.progress > 0

                            ? 'CONTINUE LEARNING'

                            : 'START LEARNING'}

                        <span aria-hidden="true">↗</span>

                      </button>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </>

        )}

      </section>

      {/* Keep Demo Bookings styling local to this page so it remains styled even
          if the optional demo-bookings-additions.css file is missing. */}
      <style>{`
        .mcp-page .mcp-demo-section {
          margin: 58px 0 12px;
          padding: 34px;
          border: 1px solid rgba(23, 66, 150, 0.10);
          border-radius: 28px;
          background: radial-gradient(circle at 92% 8%, rgba(55, 113, 242, 0.10), transparent 28%), linear-gradient(135deg, #fff 0%, #f7f9ff 100%);
          box-shadow: 0 18px 50px rgba(14, 39, 91, 0.06);
        }
        .mcp-page .mcp-demo-section > .mcp-section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 24px;
        }
        .mcp-page .mcp-demo-section .mcp-section-heading h2 span { color: #2563eb; }
        .mcp-page .mcp-demo-price {
          display: inline-flex; align-items: center; padding: 11px 16px;
          border: 1px solid #dbe7ff; border-radius: 999px; color: #12316f;
          background: #edf3ff; font-weight: 800; white-space: nowrap;
        }
        .mcp-page .mcp-demo-state, .mcp-page .mcp-demo-empty {
          display: flex; align-items: center; gap: 18px; padding: 24px;
          border: 1px solid #e4eaf5; border-radius: 20px; background: #fff;
        }
        .mcp-page .mcp-demo-state p, .mcp-page .mcp-demo-empty p {
          margin: 6px 0 0; color: #64748b; line-height: 1.65;
        }
        .mcp-page .mcp-demo-error { display: block; border-color: #fecaca; color: #991b1b; }
        .mcp-page .mcp-demo-empty { justify-content: space-between; }
        .mcp-page .mcp-demo-empty h3 { margin: 0; color: #10295f; font-size: 1.1rem; }
        .mcp-page .mcp-demo-icon, .mcp-page .mcp-demo-card-icon {
          display: grid; flex: 0 0 auto; place-items: center; width: 54px; height: 54px;
          border-radius: 17px; color: #fff; background: linear-gradient(135deg, #2463eb, #0b245f);
          font-size: 25px; box-shadow: 0 8px 20px rgba(37, 99, 235, .22);
        }
        .mcp-page .mcp-demo-button {
          display: inline-flex; align-items: center; gap: 10px; padding: 13px 18px;
          border-radius: 12px; color: #fff; background: #0b245f; font-weight: 800;
          text-decoration: none; white-space: nowrap; transition: transform .2s ease, box-shadow .2s ease;
        }
        .mcp-page .mcp-demo-button:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(11,36,95,.2); }
        .mcp-page .mcp-demo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 22px; }
        .mcp-page .mcp-demo-card {
          position: relative; overflow: hidden; padding: 25px; border: 1px solid #e4eaf5;
          border-radius: 22px; background: #fff; box-shadow: 0 12px 35px rgba(14, 39, 91, 0.07);
          transition: transform .22s ease, box-shadow .22s ease;
        }
        .mcp-page .mcp-demo-card:hover { transform: translateY(-4px); box-shadow: 0 20px 44px rgba(14, 39, 91, .12); }
        .mcp-page .mcp-demo-card::before {
          position: absolute; inset: 0 0 auto; height: 5px; content: "";
          background: linear-gradient(90deg, #2563eb, #60a5fa, #0b245f);
        }
        .mcp-page .mcp-demo-card-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 22px; }
        .mcp-page .mcp-demo-card-icon { width: 44px; height: 44px; border-radius: 14px; font-size: 20px; }
        .mcp-page .mcp-demo-paid { padding: 7px 10px; border-radius: 999px; color: #047857; background: #dcfce7; font-size: 10px; font-weight: 900; letter-spacing: .06em; }
        .mcp-page .mcp-demo-kicker { color: #64748b; font-size: 10px; font-weight: 900; letter-spacing: .13em; }
        .mcp-page .mcp-demo-card h3 { margin: 10px 0; color: #10295f; font-size: 1.35rem; font-weight: 850; }
        .mcp-page .mcp-demo-description { min-height: 48px; color: #64748b; line-height: 1.65; font-size: .92rem; }
        .mcp-page .mcp-demo-details { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; padding: 16px 0; border-top: 1px solid #edf1f8; border-bottom: 1px solid #edf1f8; }
        .mcp-page .mcp-demo-details div { display: grid; gap: 6px; }
        .mcp-page .mcp-demo-details span { color: #64748b; font-size: .78rem; }
        .mcp-page .mcp-demo-details strong { color: #10295f; font-size: .95rem; }
        .mcp-page .mcp-demo-payment-id { overflow-wrap: anywhere; color: #94a3b8; font-size: .72rem; }
        .mcp-page .mcp-demo-card-footer { display: flex; justify-content: space-between; gap: 12px; margin-top: 18px; color: #64748b; font-size: .75rem; }
        .mcp-page .mcp-demo-card-footer span:first-child { color: #047857; font-weight: 800; }
        @media (max-width: 640px) {
          .mcp-page .mcp-demo-section { margin-top: 38px; padding: 20px; border-radius: 20px; }
          .mcp-page .mcp-demo-section > .mcp-section-heading, .mcp-page .mcp-demo-empty { align-items: flex-start; flex-direction: column; }
          .mcp-page .mcp-demo-button { width: 100%; justify-content: center; }
          .mcp-page .mcp-demo-card { padding: 20px; }
        }
      `}</style>

      <section className="mcp-demo-section" aria-labelledby="mcp-demo-heading">
        <div className="mcp-section-heading">
          <div>
            <span className="mcp-section-kicker">YOUR APPOINTMENTS</span>
            <h2 id="mcp-demo-heading">Demo Bookings<span>.</span></h2>
            <p>Your successfully paid demo sessions, all in one place.</p>
          </div>
          <span className="mcp-demo-price">₹100 per demo</span>
        </div>

        {demoLoading && (
          <div className="mcp-demo-state" role="status">
            <div className="mcp-spinner" />
            <p>Loading your demo bookings...</p>
          </div>
        )}

        {!demoLoading && demoError && (
          <div className="mcp-demo-state mcp-demo-error" role="alert">
            <strong>We couldn't load demo bookings.</strong>
            <p>{demoError}</p>
          </div>
        )}

        {!demoLoading && !demoError && demoBookings.length === 0 && (
          <div className="mcp-demo-empty">
            <div className="mcp-demo-icon" aria-hidden="true">✦</div>
            <div>
              <h3>No demo bookings yet</h3>
              <p>After you pay for a demo and your payment is verified, your booking will appear here.</p>
            </div>
            <Link to="/student" className="mcp-demo-button">Book a demo <span aria-hidden="true">↗</span></Link>
          </div>
        )}

        {!demoLoading && !demoError && demoBookings.length > 0 && (
          <div className="mcp-demo-grid">
            {demoBookings.map((booking, index) => (
              <article className="mcp-demo-card" key={booking._id || booking.paymentId || booking.orderId || index}>
                <div className="mcp-demo-card-top">
                  <span className="mcp-demo-card-icon" aria-hidden="true">✦</span>
                  <span className="mcp-demo-paid">✓ PAYMENT VERIFIED</span>
                </div>
                <span className="mcp-demo-kicker">SUCCESS SCHOLAR · LIVE SESSION</span>
                <h3>{booking.title || booking.bookingType || 'Demo Class Booking'}</h3>
                <p className="mcp-demo-description">Your demo payment has been confirmed. The Success Scholar team can help you coordinate the session schedule.</p>
                <div className="mcp-demo-details">
                  <div><span>Booking date</span><strong>{booking.bookedAt || booking.createdAt ? new Date(booking.bookedAt || booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Confirmed'}</strong></div>
                  <div><span>Amount paid</span><strong>₹{Number(booking.amountRupees ?? 100).toLocaleString('en-IN')}</strong></div>
                </div>
                {booking.paymentId && <p className="mcp-demo-payment-id">Payment ID: {booking.paymentId}</p>}
                <div className="mcp-demo-card-footer"><span>● Confirmed booking</span><span>Secure payment</span></div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="mcp-footer">

        <Link to="/student" className="mcp-footer-brand">

          SUCCESS SCHOLAR<span>.</span>

        </Link>

        <p>Your vision. Our mission.</p>

        <span className="mcp-footer-copy">

          © {new Date().getFullYear()} Success Scholar

        </span>

      </footer>

    </main>

  );

}
