import { useEffect, useState, useRef } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { api } from '../api.js';

import { useAuth } from '../context/AuthContext.jsx';

import '../styles/student-dashboard.css';

import '../styles/student-feedback.css';
import '../styles/student-courses-additions.css';
import CorporateDashboard from './CorporateDashboard.jsx';



const API_BASE_URL = (

  import.meta.env.VITE_API_URL || 'http://localhost:5000'

).replace(/\/+$/, '');



const labels = {

  student: 'Student',

  corporate: 'Corporate',

  college: 'College',

  school: 'School',

};



const coursesData = [

  {

    id: 'soft-skills',

    title: 'Soft Skills',

    popular: true,

    image: '/assets/courses/soft.png',

    features: [

      'Effective Communication',

      'Public Speaking Basics',

      'Business English',

    ],

  },

  {

    id: 'interview-prep',

    title: 'Interview Preparation',

    popular: true,

    image: '/assets/courses/inter.png',

    features: [

      'Resume Building',

      'Mock Interviews',

      'HR Interview Preparation',

    ],

  },

  {

    id: 'personality-dev',

    title: 'Personality Development',

    popular: false,

    image: '/assets/courses/per.png',

    features: [

      'Confidence Building',

      'Body Language Skills',

      'Leadership Skills',

    ],

  },

  {

    id: 'adv-comm',

    title: 'Advanced Communication Skills',

    popular: false,

    image: '/assets/courses/com.png',

    features: [

      'Teamwork Skills',

      'Behavioral Interview Tips',

      'Problem Solving Skills',

    ],

  },

  {

    id: 'spoken-english',

    title: 'Spoken English',

    popular: false,

    image: '/assets/courses/spo.png',

    features: [

      'Grammar & Vocabulary',

      'Fluency Practice',

      'English for Workplace',

    ],

  },

  {

    id: 'campus-readiness',

    title: 'Campus Readiness Training',

    popular: false,

    image: '/assets/courses/cor.png',

    features: [

      'Campus Interview Preparation',

      'Group Discussion Skills',

      'Technical & Aptitude Training',

    ],

  },

];



const initialFeedbackForm = {

  category: 'Website experience',

  rating: '5',

  message: '',

  suggestion: '',

};



function loadRazorpayCheckout() {

  return new Promise((resolve, reject) => {

    if (window.Razorpay) {

      resolve();

      return;

    }



    const scriptUrl =

      'https://checkout.razorpay.com/v1/checkout.js';



    const existingScript = document.querySelector(

      `script[src="${scriptUrl}"]`

    );



    if (existingScript) {

      existingScript.addEventListener(

        'load',

        () => resolve(),

        { once: true }

      );



      existingScript.addEventListener(

        'error',

        () => reject(

          new Error(

            'Unable to load Razorpay. Please check your internet connection.'

          )

        ),

        { once: true }

      );



      return;

    }



    const script = document.createElement('script');

    script.src = scriptUrl;

    script.async = true;



    script.onload = () => resolve();



    script.onerror = () => reject(

      new Error(

        'Unable to load Razorpay. Please check your internet connection.'

      )

    );



    document.body.appendChild(script);

  });

}



function normalizeIndianPhone(value) {

  let phone = String(value || '').replace(/[\s()-]/g, '');



  if (phone.startsWith('+91')) {

    phone = phone.slice(3);

  } else if (phone.startsWith('91') && phone.length === 12) {

    phone = phone.slice(2);

  }



  return phone;

}



export default function AccountDashboard({ accountType }) {

  const { user, logout } = useAuth();

  const navigate = useNavigate();



  const [error, setError] = useState('');

  const [menuOpen, setMenuOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);



  const [notice, setNotice] = useState('');



  const [demoOpen, setDemoOpen] = useState(false);

  const [demoPhone, setDemoPhone] = useState('');

  const [demoError, setDemoError] = useState('');

  const [demoPaying, setDemoPaying] = useState(false);



  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const [feedbackBusy, setFeedbackBusy] = useState(false);

  const [feedbackError, setFeedbackError] = useState('');

  const [feedbackForm, setFeedbackForm] = useState({

    ...initialFeedbackForm,

  });



  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const [purchasesError, setPurchasesError] = useState('');

  const feedbackMessageRef = useRef(null);

  const trackRef = useRef(null);

  const phoneInputRef = useRef(null);

  const noticeTimerRef = useRef(null);



  useEffect(() => {

    let cancelled = false;



    api(`/auth/account/${accountType}`, { auth: true }).catch(

      (requestError) => {

        if (!cancelled) {

          setError(requestError.message);

        }

      }

    );



    return () => {

      cancelled = true;

    };

  }, [accountType]);



  useEffect(() => {
    let cancelled = false;

    const loadPurchasedCourses = async () => {
      setPurchasesLoading(true);
      setPurchasesError('');
      try {
        const result = await api('/payment/my-courses', { auth: true });
        const courses = Array.isArray(result)
          ? result
          : Array.isArray(result?.courses)
            ? result.courses
            : [];
        if (!cancelled) setPurchasedCourses(courses);
      } catch (requestError) {
        if (!cancelled) {
          setPurchasedCourses([]);
          setPurchasesError(requestError.message || 'Unable to load your purchased courses.');
        }
      } finally {
        if (!cancelled) setPurchasesLoading(false);
      }
    };

    loadPurchasedCourses();
    return () => { cancelled = true; };
  }, []);

  const getPurchaseForCourse = (course) => purchasedCourses.find((purchase) => {
    const purchasedId = purchase.courseId || purchase.course?.id || purchase.course?._id || purchase.id;
    const purchasedTitle = purchase.courseName || purchase.title || purchase.courseTitle || purchase.course?.title;
    return purchasedId === course.id || String(purchasedTitle || '').trim().toLowerCase() === course.title.toLowerCase();
  });

  useEffect(() => {

    return () => {

      if (noticeTimerRef.current) {

        window.clearTimeout(noticeTimerRef.current);

      }

    };

  }, []);



  const handleLogout = () => {

    logout();

    navigate('/signin');

  };



  const scrollCarousel = (direction) => {

    if (!trackRef.current) return;



    trackRef.current.scrollBy({

      left: direction === 'left' ? -340 : 340,

      behavior: 'smooth',

    });

  };



  const showDemoNotice = (message) => {

    setNotice(message);



    if (noticeTimerRef.current) {

      window.clearTimeout(noticeTimerRef.current);

    }



    noticeTimerRef.current = window.setTimeout(() => {

      setNotice('');

    }, 6000);

  };



  // Lock background scrolling while a modal is open.

  useEffect(() => {

    if (!demoOpen && !feedbackOpen) return undefined;



    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';



    const handleKeyDown = (event) => {

      if (event.key !== 'Escape') return;



      if (demoOpen && !demoPaying) {

        setDemoOpen(false);

        setDemoError('');

      }



      if (feedbackOpen && !feedbackBusy) {

        setFeedbackOpen(false);

        setFeedbackError('');

      }

    };



    window.addEventListener('keydown', handleKeyDown);



    const focusTimer = window.setTimeout(() => {

      if (demoOpen) {

        phoneInputRef.current?.focus();

      } else if (feedbackOpen) {

        feedbackMessageRef.current?.focus();

      }

    }, 100);



    return () => {

      document.body.style.overflow = previousOverflow;

      window.removeEventListener('keydown', handleKeyDown);

      window.clearTimeout(focusTimer);

    };

  }, [demoOpen, feedbackOpen, demoPaying, feedbackBusy]);



  const openDemoModal = () => {

    setDemoPhone(user?.phone || user?.mobile || '');

    setDemoError('');

    setDemoOpen(true);

  };



  const closeDemoModal = () => {

    if (demoPaying) return;



    setDemoOpen(false);

    setDemoError('');

  };



  // Create a ₹100 order, open Razorpay Checkout and verify the payment.

  const handleDemoBooking = async (event) => {

    event.preventDefault();



    if (demoPaying) return;



    const normalizedPhone = normalizeIndianPhone(demoPhone);



    if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {

      setDemoError(

        'Please enter a valid 10-digit Indian mobile number.'

      );

      return;

    }



    setDemoPaying(true);

    setDemoError('');



    try {

      await loadRazorpayCheckout();



      const orderData = await api('/payment/demo/create-order', {
        method: 'POST',
        auth: true,
        body: { phone: normalizedPhone },
      });



      if (

        !orderData.orderId ||

        !orderData.keyId ||

        orderData.amount !== 10000 ||

        orderData.currency !== 'INR'

      ) {

        throw new Error(

          'The server returned invalid payment details. Please try again.'

        );

      }



      if (!window.Razorpay) {

        throw new Error(

          'Razorpay Checkout is unavailable. Please try again.'

        );

      }



      const checkout = new window.Razorpay({

        key: orderData.keyId,

        amount: orderData.amount,

        currency: orderData.currency,

        order_id: orderData.orderId,



        name: 'Success Scholar',

        description: 'Demo Class Booking - ₹100',



        prefill: {

          name: user?.name || '',

          email: user?.email || '',

          contact: normalizedPhone,

        },



        notes: {

          phone: normalizedPhone,

          bookingType: 'Demo Class',

        },



        theme: {

          color: '#08245f',

        },



        modal: {

          ondismiss: () => {

            setDemoPaying(false);

          },

        },



        handler: async (paymentResponse) => {

          try {

            const verifyData = await api('/payment/demo/verify', {
              method: 'POST',
              auth: true,
              body: {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
            });

            if (!verifyData?.verified) {
              throw new Error(
                verifyData?.message ||
                'Payment verification failed. Please contact support before paying again.'
              );
            }



            setDemoPhone(normalizedPhone);

            setDemoOpen(false);



            showDemoNotice(

              `Payment verified successfully. Payment ID: ${verifyData.paymentId}. Please contact Success Scholar to confirm your demo class schedule.`

            );

          } catch (verificationError) {

            setDemoError(

              verificationError.message ||

              'Unable to verify your payment. Please contact support before retrying.'

            );

          } finally {

            setDemoPaying(false);

          }

        },

      });



      checkout.on('payment.failed', (paymentFailure) => {

        setDemoPaying(false);



        setDemoError(

          paymentFailure.error?.description ||

          'Payment failed. Please try again.'

        );

      });



      checkout.open();

    } catch (bookingError) {

      setDemoPaying(false);



      setDemoError(

        bookingError.message ||

        'Unable to start demo payment. Please try again.'

      );

    }

  };



  const openFeedbackForm = () => {

    setFeedbackError('');

    setFeedbackForm({ ...initialFeedbackForm });

    setFeedbackOpen(true);

  };



  const closeFeedbackForm = () => {

    if (feedbackBusy) return;



    setFeedbackOpen(false);

    setFeedbackError('');

  };



  const handleFeedbackSubmit = async (event) => {

    event.preventDefault();

    setFeedbackError('');



    if (!feedbackForm.message.trim()) {

      setFeedbackError(

        'Please tell us about your experience before submitting.'

      );

      return;

    }



    if (feedbackForm.message.trim().length < 10) {

      setFeedbackError(

        'Please enter at least 10 characters so we can understand your feedback.'

      );

      return;

    }



    setFeedbackBusy(true);



    try {

      const response = await api('/feedback', {

        method: 'POST',

        auth: true,

        body: {

          category: feedbackForm.category,

          rating: Number(feedbackForm.rating),

          message: feedbackForm.message.trim(),

          suggestion: feedbackForm.suggestion.trim(),

        },

      });



      setFeedbackOpen(false);

      setFeedbackForm({ ...initialFeedbackForm });



      showDemoNotice(

        response?.message ||

        'Thank you! Your feedback has been submitted to Success Scholar.'

      );

    } catch (requestError) {

      setFeedbackError(

        requestError.message ||

        'Could not submit your feedback. Please try again.'

      );

    } finally {

      setFeedbackBusy(false);

    }

  };



  if (accountType === 'corporate') {
    return <CorporateDashboard />;
  }

  if (accountType !== 'student') {
    return (
      <section className="account-dashboard page-top">
        <div className="card account-dashboard__card">
          <p className="account-signin__eyebrow">Success Scholar</p>
          <h1>{labels[accountType] || 'User'} account</h1>
          <p>Signed in as <strong>{user?.name}</strong>.</p>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </section>
    );
  }



  return (

    <div className="student-dashboard">

      {/* Floating Book Demo and Feedback buttons */}

      <div className="student-floating-actions">

        <button

          type="button"

          className="student-demo-btn"

          onClick={openDemoModal}

        >

          <span>Book Demo</span>

          <small>(₹100)</small>

        </button>



        <button

          type="button"

          className="student-feedback-btn"

          onClick={openFeedbackForm}

        >

          FEEDBACK

        </button>

      </div>



      {/* Book a Demo modal */}

      {demoOpen && (

        <div

          className="demo-modal-overlay"

          onMouseDown={(event) => {

            if (event.target === event.currentTarget) {

              closeDemoModal();

            }

          }}

        >

          <section

            className="demo-modal"

            role="dialog"

            aria-modal="true"

            aria-labelledby="demo-modal-title"

          >

            <button

              type="button"

              className="demo-modal-close"

              aria-label="Close Book a Demo dialog"

              onClick={closeDemoModal}

              disabled={demoPaying}

            >

              ×

            </button>



            <h2 id="demo-modal-title">Book a Demo</h2>



            <div className="demo-modal-divider" />



            <form onSubmit={handleDemoBooking}>

              <div className="demo-modal-information">

                <p>Demo classes: Wed, Fri, Sat</p>

                <p>Demo cost: ₹100 (all inclusive)</p>

              </div>



              <label

                className="demo-phone-label"

                htmlFor="demo-phone"

              >

                Phone

              </label>



              <input

                ref={phoneInputRef}

                id="demo-phone"

                className="demo-phone-input"

                type="tel"

                name="phone"

                autoComplete="tel"

                inputMode="tel"

                placeholder="+91 12345 67890"

                value={demoPhone}

                onChange={(event) => {

                  setDemoPhone(event.target.value);

                  setDemoError('');

                }}

                aria-invalid={Boolean(demoError)}

                aria-describedby={

                  demoError ? 'demo-phone-error' : undefined

                }

                required

                disabled={demoPaying}

              />



              {demoError && (

                <p

                  id="demo-phone-error"

                  className="demo-modal-error"

                  role="alert"

                >

                  {demoError}

                </p>

              )}



              <div className="demo-modal-actions">

                <button

                  type="button"

                  className="demo-cancel-button"

                  onClick={closeDemoModal}

                  disabled={demoPaying}

                >

                  Cancel

                </button>



                <button

                  type="submit"

                  className="demo-book-button"

                  disabled={demoPaying}

                >

                  {demoPaying

                    ? 'Opening Payment...'

                    : 'Book Demo (₹100)'}

                </button>

              </div>

            </form>

          </section>

        </div>

      )}



      {/* Student feedback modal */}

      {feedbackOpen && (

        <div

          className="feedback-modal-overlay"

          onMouseDown={(event) => {

            if (event.target === event.currentTarget) {

              closeFeedbackForm();

            }

          }}

        >

          <section

            className="feedback-modal"

            role="dialog"

            aria-modal="true"

            aria-labelledby="feedback-modal-title"

          >

            <div className="feedback-modal-top">

              <div

                className="feedback-modal-mark"

                aria-hidden="true"

              >

                S

              </div>



              <button

                type="button"

                className="feedback-modal-close"

                onClick={closeFeedbackForm}

                aria-label="Close feedback form"

                disabled={feedbackBusy}

              >

                ×

              </button>



              <p className="feedback-eyebrow">

                YOUR VOICE MATTERS

              </p>



              <h2 id="feedback-modal-title">

                Help us do better.

              </h2>



              <p className="feedback-intro">

                Share your experience with Success Scholar. Your

                feedback will be sent to our admin team.

              </p>

            </div>



            <form

              className="feedback-form"

              onSubmit={handleFeedbackSubmit}

            >

              <div className="feedback-user-summary">

                <span

                  className="feedback-avatar"

                  aria-hidden="true"

                >

                  {(user?.name || 'S')

                    .trim()

                    .charAt(0)

                    .toUpperCase()}

                </span>



                <div>

                  <strong>{user?.name || 'Student'}</strong>

                  <span>{user?.email || 'Signed-in student'}</span>

                </div>



                <span className="feedback-private-label">

                  Student feedback

                </span>

              </div>



              <label className="feedback-field">

                <span>What is your feedback about?</span>



                <select

                  value={feedbackForm.category}

                  onChange={(event) =>

                    setFeedbackForm((current) => ({

                      ...current,

                      category: event.target.value,

                    }))

                  }

                  disabled={feedbackBusy}

                >

                  <option>Website experience</option>

                  <option>Courses and learning</option>

                  <option>Mentorship and support</option>

                  <option>Booking and enrollment</option>

                  <option>Certificates</option>

                  <option>Other</option>

                </select>

              </label>



              <fieldset className="feedback-rating-field">

                <legend>How would you rate your experience?</legend>



                <div className="feedback-rating-options">

                  {[1, 2, 3, 4, 5].map((rating) => (

                    <button

                      key={rating}

                      type="button"

                      className={`feedback-rating-star ${

                        Number(feedbackForm.rating) >= rating

                          ? 'is-selected'

                          : ''

                      }`}

                      onClick={() =>

                        setFeedbackForm((current) => ({

                          ...current,

                          rating: String(rating),

                        }))

                      }

                      aria-label={`${rating} out of 5 stars`}

                      aria-pressed={

                        Number(feedbackForm.rating) === rating

                      }

                      disabled={feedbackBusy}

                    >

                      ★

                    </button>

                  ))}



                  <span>

                    {({

                      1: 'Poor',

                      2: 'Fair',

                      3: 'Good',

                      4: 'Very good',

                      5: 'Excellent',

                    })[feedbackForm.rating]}

                  </span>

                </div>

              </fieldset>



              <label className="feedback-field">

                <span>

                  Tell us about your experience <em>\*</em>

                </span>



                <textarea

                  ref={feedbackMessageRef}

                  rows={4}

                  maxLength={2000}

                  placeholder="What went well? What could we improve?"

                  value={feedbackForm.message}

                  onChange={(event) =>

                    setFeedbackForm((current) => ({

                      ...current,

                      message: event.target.value,

                    }))

                  }

                  disabled={feedbackBusy}

                  required

                />



                <small>

                  {feedbackForm.message.length}/2000 characters

                </small>

              </label>



              <label className="feedback-field">

                <span>

                  Any suggestions? <small>(optional)</small>

                </span>



                <textarea

                  rows={2}

                  maxLength={1000}

                  placeholder="Share any ideas that could make your experience better."

                  value={feedbackForm.suggestion}

                  onChange={(event) =>

                    setFeedbackForm((current) => ({

                      ...current,

                      suggestion: event.target.value,

                    }))

                  }

                  disabled={feedbackBusy}

                />

              </label>



              {feedbackError && (

                <p

                  className="feedback-form-error"

                  role="alert"

                >

                  {feedbackError}

                </p>

              )}



              <div className="feedback-form-footer">

                <p>

                  Your feedback is shared privately with the

                  Success Scholar admin team.

                </p>



                <div className="feedback-form-actions">

                  <button

                    type="button"

                    className="feedback-cancel-btn"

                    onClick={closeFeedbackForm}

                    disabled={feedbackBusy}

                  >

                    Cancel

                  </button>



                  <button

                    type="submit"

                    className="feedback-submit-btn"

                    disabled={feedbackBusy}

                  >

                    {feedbackBusy

                      ? 'Submitting...'

                      : 'Submit feedback'}



                    {!feedbackBusy && (

                      <span aria-hidden="true"> →</span>

                    )}

                  </button>

                </div>

              </div>

            </form>

          </section>

        </div>

      )}



      {/* Header */}

      <header className="student-header">

        <div className="student-brand">

          <img

            className="student-brand-logo"

            src="/assets/success-scholar-logo.png"

            alt="Success Scholar"

          />

        </div>



        <button

          type="button"

          className="student-menu-toggle"

          aria-label="Toggle navigation"

          aria-expanded={menuOpen}

          onClick={() => setMenuOpen((open) => !open)}

        >

          <svg

            width="24"

            height="24"

            fill="none"

            stroke="currentColor"

            strokeWidth="2"

            viewBox="0 0 24 24"

          >

            <path

              strokeLinecap="round"

              strokeLinejoin="round"

              d="M4 6h16M4 12h16M4 18h16"

            />

          </svg>

        </button>



        <nav className={`student-nav ${menuOpen ? 'is-open' : ''}`}>

          <Link

            to="/home"

            onClick={() => {

              setMenuOpen(false);

              setProfileOpen(false);

            }}

          >

            HOME

          </Link>



          <Link

            to="/expertise"

            onClick={() => {

              setMenuOpen(false);

              setProfileOpen(false);

            }}

          >

            WHAT WE OFFER

          </Link>



          <Link

            to="/student/announcements"

            onClick={() => {

              setMenuOpen(false);

              setProfileOpen(false);

            }}

          >

            LATEST UPDATES

          </Link>



          <Link

            to="/contact"

            onClick={() => {

              setMenuOpen(false);

              setProfileOpen(false);

            }}

          >

            CONTACT

          </Link>



          <div className="student-profile-menu">

            <button

              type="button"

              className={`student-profile-trigger ${

                profileOpen ? 'is-open' : ''

              }`}

              aria-haspopup="true"

              aria-expanded={profileOpen}

              onClick={() => setProfileOpen((open) => !open)}

            >

              MY PROFILE



              <svg

                className="student-profile-chevron"

                width="14"

                height="14"

                viewBox="0 0 24 24"

                fill="none"

                stroke="currentColor"

                strokeWidth="2"

                aria-hidden="true"

              >

                <path

                  d="m6 9 6 6 6-6"

                  strokeLinecap="round"

                  strokeLinejoin="round"

                />

              </svg>

            </button>



            {profileOpen && (

              <div

                className="student-profile-dropdown"

                role="menu"

              >

                <Link

                  to="/student/profile"

                  role="menuitem"

                  onClick={() => {

                    setProfileOpen(false);

                    setMenuOpen(false);

                  }}

                >

                  Personal Details

                </Link>



                <Link
                  to="/student/my-courses"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  My Courses
                </Link>

                <Link

                  to="/student/certifications"

                  role="menuitem"

                  onClick={() => {

                    setProfileOpen(false);

                    setMenuOpen(false);

                  }}

                >

                  Certifications

                </Link>



                <button

                  type="button"

                  role="menuitem"

                  onClick={() => {

                    setProfileOpen(false);

                    setMenuOpen(false);

                    handleLogout();

                  }}

                >

                  Log Out

                </button>

              </div>

            )}

          </div>

        </nav>

      </header>



      {error && (

        <div className="student-dashboard-error" role="alert">

          {error}

        </div>

      )}



      {notice && (

        <div

          className="student-dashboard-notice"

          role="status"

        >

          {notice}

        </div>

      )}



      {/* Hero */}

      <section id="home" className="student-hero">

        <div className="student-hero-diagonal" />



        <div className="student-hero-content">

          <div className="student-hero-copy">

            <h1>

              Empower.

              <br />

              Elevate. Evolve.

            </h1>



            <p>

              At Success Scholar, we empower learners with essential

              skills in leadership, communication, and real-world

              problem-solving. Our Immersion Program bridges the gap

              from campus to corporate, preparing graduates to meet

              industry standards. Through a transformative learning

              journey, we shape confident, industry-ready

              professionals equipped to excel and lead in today's

              dynamic workplace.

            </p>



            <div className="student-hero-actions">

              <a

                href="#offer"

                className="student-button student-button-outline"

              >

                Start now

              </a>



              <Link

                to="/student/announcements"

                className="student-button student-button-solid"

              >

                Latest Updates

              </Link>

            </div>

          </div>



          <div className="student-hero-image-wrap">

            <img

              src="/assets/hero-student.webp"

              alt="Success Scholar student"

            />

          </div>

        </div>



        <button

          type="button"

          className="student-certificate"

          onClick={() => navigate('/student/certificate-download')}

          aria-label="Open certificate download portal"

        >

          <span>Click to</span>

          <strong>Download</strong>

          <span>Certificate</span>

          <small

            style={{

              fontSize: '9px',

              marginTop: '2px',

              opacity: 0.85,

            }}

          >

            for College Intern Student

          </small>

        </button>

      </section>



      {/* Feature cards */}

      <section id="offer" className="student-features">

        <div className="student-feature-card">

          <div className="student-feature-image">

            <img

              src="/assets/student-dashboard/career-focused-courses.jpeg"

              alt="Career-Focused Courses"

            />

          </div>



          <div className="student-feature-copy">

            <h2>Career-Focused Courses</h2>

            <p>

              Learn the most in-demand skills with courses designed

              for real-world jobs.

            </p>

          </div>

        </div>



        <div className="student-feature-card">

          <div className="student-feature-image">

            <img

              src="/assets/student-dashboard/m.webp"

              alt="Professional mentor with a communication icon"

            />

          </div>



          <div className="student-feature-copy">

            <h2>Expert Mentorship</h2>

            <p>

              Get guidance from professionals and industry experts

              through live sessions and doubt support.

            </p>

          </div>

        </div>



        <div className="student-feature-card">

          <div className="student-feature-image">

            <img

              src="/assets/student-dashboard/image.png"

              alt="Student with a book and an affordable learning icon"

            />

          </div>



          <div className="student-feature-copy">

            <h2>Affordable Learning</h2>

            <p>

              Achieve your goals without breaking the bank. Quality

              education at budget-friendly prices.

            </p>

          </div>

        </div>

      </section>

      {/* Courses */}
      <section id="courses" className="student-courses">

        <div className="student-section-heading">

          <h2>Available Courses</h2>

        </div>



        <div

          id="courses"

          className="student-courses-carousel"

        >

          <button

            type="button"

            className="student-carousel-arrow student-carousel-prev"

            onClick={() => scrollCarousel('left')}

            aria-label="Previous courses"

          >

            &#10094;

          </button>



          <div className="student-course-track" ref={trackRef}>

            {coursesData.map((course) => (

              <div

                key={course.id}

                className="student-course-card"

              >

                {course.popular && (

                  <div className="student-popular-badge">

                    MOST POPULAR

                  </div>

                )}



                <img

                  src={course.image}

                  alt={course.title}

                  className="student-course-image"

                />



                <h3>{course.title}</h3>



                <ul className="student-course-features">

                  {course.features.map((feature) => (

                    <li key={feature}>

                      <svg

                        width="16"

                        height="16"

                        viewBox="0 0 24 24"

                        fill="none"

                        stroke="currentColor"

                        strokeWidth="2.5"

                        aria-hidden="true"

                      >

                        <polyline points="20 6 9 17 4 12" />

                      </svg>



                      <span>{feature}</span>

                    </li>

                  ))}

                </ul>



                <div className="student-course-actions">
                  {getPurchaseForCourse(course) ? (
                    <button
                      type="button"
                      className="student-course-button"
                      onClick={() => navigate(`/student/learn/${encodeURIComponent(course.id)}`)}
                    >
                      START NOW
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="student-course-button"
                        onClick={() => navigate(`/student/courses/${course.id}`)}
                      >
                        ENROLL NOW
                      </button>
                      <Link to="/contact" className="student-course-button">
                        ENQUIRY
                      </Link>
                    </>
                  )}
                </div>



                <Link

                  to="/expertise"

                  className="student-course-more"

                >

                  Know more

                </Link>

              </div>

            ))}

          </div>



          <button

            type="button"

            className="student-carousel-arrow student-carousel-next"

            onClick={() => scrollCarousel('right')}

            aria-label="Next courses"

          >

            &#10095;

          </button>

        </div>

      </section>



      {/* Footer */}

      <footer id="contact" className="student-footer">

        <div className="student-footer-inner">

          <div id="profile" className="student-footer-brand">

            <img

              className="student-footer-logo"

              src="/assets/success-scholar-logo.png"

              alt="Success Scholar"

            />



            <div>

              <h2>Success Scholar</h2>

              <p>Your Vision. Our Mission</p>



              <p className="student-profile-name">

                Signed in as {user?.name || 'Student'}

              </p>



              <p className="student-footer-description">

                Empowering ambitious students with job-ready

                professional skill sets, interview excellence,

                and mentorship.

              </p>

            </div>

          </div>



          <div>

            <h3>Quick Links</h3>

            <a href="#home">Home</a>

            <a href="#offer">What We Offer</a>

            <a href="#courses">Courses</a>

            <a href="#contact">Contact</a>

          </div>



          <div>

            <h3>Contact Us</h3>

            <p>Email: contact@successscholar.in</p>

            <p>Phone: +91 98765 43210</p>

            <p>Location: Kolkata, West Bengal</p>

          </div>

        </div>



        <div className="student-footer-bottom">

          &copy; {new Date().getFullYear()} Success Scholar.

          All Rights Reserved.

        </div>

      </footer>

    </div>

  );

}