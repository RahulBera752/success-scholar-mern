import { useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import '../styles/student-enrollment.css';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function loadRazorpayCheckout() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Could not load Razorpay Checkout.')),
        { once: true }
      );
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(
      new Error('Could not load Razorpay Checkout. Check your internet connection.')
    );
    document.body.appendChild(script);
  });
}

const coursesMeta = {
  'soft-skills': 'Soft Skills',
  'interview-prep': 'Interview Preparation',
  'personality-dev': 'Personality Development',
  'adv-comm': 'Advanced Communication Skills',
  'spoken-english': 'Spoken English',
  'campus-readiness': 'Campus Readiness Training'
};

const plansData = [
  {
    id: 'silver',
    type: 'silver',
    title: 'SILVER',
    oldPrice: '₹1,699',
    monthlyPrice: '₹1,529',
    features: [
      { text: 'Communication Mastery', available: true },
      { text: 'Teamwork & Collaboration', available: true },
      { text: 'Critical Thinking & Problem-Solving', available: true },
      { text: '1 Class/Week', available: true },
      { text: 'No Class Reschedule Available', available: false }
    ]
  },
  {
    id: 'gold',
    type: 'gold',
    title: 'GOLD',
    oldPrice: '₹2,999',
    monthlyPrice: '₹2,699',
    features: [
      { text: 'Communication Mastery', available: true },
      { text: 'Teamwork & Collaboration', available: true },
      { text: 'Critical Thinking & Problem-Solving', available: true },
      { text: '2 Class/Week', available: true },
      { text: '1 Class/Month Reschedule', available: true }
    ]
  },
  {
    id: 'platinum',
    type: 'platinum',
    title: 'PLATINUM',
    oldPrice: '₹4,449',
    monthlyPrice: '₹4,004',
    features: [
      { text: 'Communication Mastery', available: true },
      { text: 'Teamwork & Collaboration', available: true },
      { text: 'Critical Thinking & Problem-Solving', available: true },
      { text: '3 Class/Week', available: true },
      { text: '2Class /Month Reschedule', available: true }
    ]
  }
];

export function StudentCoursePricing() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState(null);

  const durationOptions = [
    { months: 1, discount: 0.10 },
    { months: 3, discount: 0.05 },
    { months: 6, discount: 0.075 },
    { months: 9, discount: 0.10 }
  ];

  const getPriceNumber = (price) => Number(String(price).replace(/[^0-9]/g, ''));
  const formatINR = (amount) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

  const handleSelectPlan = (plan) => setActivePlan(plan);

  const handleSelectDuration = (months, originalPrice, discountedPrice) => {
    const course = courseId || 'soft-skills';
    const planId = activePlan.id;
    setActivePlan(null);
    navigate(`/student/booking/${course}?plan=${planId}&duration=${months}&price=${Math.round(discountedPrice)}&originalPrice=${Math.round(originalPrice)}`);
  };

  return (
    <div className="student-enrollment-page">
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          background: #f1f3f7;
          overflow-x: hidden;
        }

        .student-enrollment-page {
          min-height: 100vh;
          width: 100%;
          padding: 16px 24px 32px;
          background: #f1f3f7;
          color: #172a4b;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          box-sizing: border-box;
        }

        .student-enrollment-page *,
        .student-enrollment-page *::before,
        .student-enrollment-page *::after {
          box-sizing: border-box;
        }

        /* Top Left Floating Back Button */
        .enrollment-back {
          position: fixed;
          top: 22px;
          left: 22px;
          z-index: 30;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 18px;
          border: 1.5px solid #08245f;
          border-radius: 8px;
          background: #fff;
          color: #08245f;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.15s ease;
        }

        .enrollment-back:hover {
          background: #08245f;
          color: #fff;
        }

        /* Pricing Grid Container */
        .pricing-wrap {
          width: 100%;
          max-width: 1160px;
          margin-top: 4px;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          align-items: stretch;
          width: 100%;
        }

        /* Pricing Card */
        .pricing-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 720px;
          padding: 28px 30px 32px;
          border-radius: 26px;
          background: #fff;
          box-shadow: 0 6px 28px rgba(10, 25, 55, 0.06);
          border: 1px solid rgba(215, 222, 235, 0.6);
          position: relative;
        }

        /* Top Pill Badges */
        .plan-label {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 225px;
          height: 44px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 30px;
        }

        /* Silver Badge: exact soft metallic tone */
        .silver .plan-label {
          background: linear-gradient(135deg, #e4e7ec 0%, #ccd1dc 100%);
          color: #4b5563;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
        }

        /* Gold Badge: exact radiant gold tone */
        .gold .plan-label {
          background: linear-gradient(135deg, #ffd000 0%, #ffdf47 100%);
          color: #4f3b00;
          box-shadow: 0 6px 20px rgba(255, 208, 0, 0.5);
        }

        /* Platinum Badge: exact dual-tone steel gradient */
        .platinum .plan-label {
          background: linear-gradient(135deg, #bac3d2 0%, #8591a6 100%);
          color: #1a222f;
          box-shadow: 0 4px 12px rgba(133, 145, 166, 0.3);
        }

        /* Pricing Typography */
        .old-price {
          margin: 0 0 2px;
          color: #9aa3af;
          font-size: 28px;
          font-weight: 600;
          text-decoration: line-through;
          line-height: 1.15;
        }

        .monthly-price {
          margin: 0;
          color: #08245f;
          font-size: 50px;
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.5px;
        }

        .per-month {
          margin: 4px 0 34px;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }

        /* Features List */
        .plan-features {
          display: flex;
          flex-direction: column;
          width: 100%;
          margin: 0 0 auto;
          padding: 0;
          list-style: none;
          gap: 16px;
        }

        .plan-features li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13.5px;
          line-height: 1.45;
          color: #4b5563;
        }

        /* Square Icon Badges */
        .feature-badge {
          display: grid;
          place-items: center;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 900;
          margin-top: 1px;
        }

        .feature-badge.check {
          background: #86e4b4;
          color: #0b5c33;
        }

        .feature-badge.cross {
          background: #ffb1c2;
          color: #9c1530;
        }

        .plan-features li span:last-child {
          flex: 1;
          text-align: left;
        }

        /* Choose Plan Navy Pill Button */
        .choose-plan {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 78%;
          height: 46px;
          margin-top: 28px;
          border: 0;
          border-radius: 999px;
          background: #08245f;
          color: #fff;
          cursor: pointer;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 6px 18px rgba(8, 36, 95, 0.22);
          transition: all 0.18s ease;
        }

        .choose-plan:hover {
          background: #0e378c;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(8, 36, 95, 0.3);
        }

        /* Enrollment duration popup */
        .duration-backdrop {
          position: fixed; inset: 0; z-index: 9999; display: grid;
          place-items: center; padding: 20px; background: rgba(0, 0, 0, 0.40);
        }
        .duration-dialog {
          position: relative; width: min(646px, 100%); max-height: calc(100vh - 40px);
          overflow-y: auto; padding: 27px 22px 32px; border-radius: 10px;
          background: #fff; color: #292929; box-shadow: 0 12px 35px rgba(0, 0, 0, 0.20);
        }
        .duration-dialog h2 {
          margin: 0 36px 7px 0; color: #292929; font-size: 25px;
          font-weight: 700; line-height: 1.3;
        }
        .duration-dialog > p { margin: 0 0 13px; color: #333; font-size: 16px; line-height: 1.5; }
        .dialog-close {
          position: absolute; top: 17px; right: 17px; border: 0; padding: 0 3px;
          background: transparent; color: #aaa; cursor: pointer; font-size: 27px; line-height: 1;
        }
        .duration-options { display: flex; flex-direction: column; gap: 10px; }
        .duration-options button {
          display: flex; width: 100%; min-height: 41px; align-items: center;
          justify-content: space-between; gap: 12px; padding: 9px 21px; border: 0;
          border-radius: 0; background: #08245f; color: #fff; cursor: pointer;
          font-size: 16px; text-align: left;
        }
        .duration-options button:hover { background: #123b86; }
        .duration-options button:focus-visible, .dialog-close:focus-visible {
          outline: 3px solid #76a9ff; outline-offset: 3px;
        }
        .duration-price { display: flex; align-items: center; justify-content: flex-end; gap: 10px; white-space: nowrap; }
        .duration-price s { color: #aaa; font-size: 14px; }
        .duration-price strong { color: #fff; font-size: 16px; font-weight: 700; }
        @media (max-width: 600px) {
          .duration-dialog { padding: 24px 15px; }
          .duration-dialog h2 { font-size: 21px; }
          .duration-dialog > p { font-size: 14px; }
          .duration-options button { padding: 10px; font-size: 14px; }
          .duration-price { gap: 6px; }
          .duration-price s, .duration-price strong { font-size: 12px; }
        }

        @media (max-width: 960px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 380px;
          }

          .enrollment-back {
            position: static;
            align-self: flex-start;
            margin-bottom: 20px;
          }

          .student-enrollment-page {
            padding: 20px 16px;
          }
        }
      `}</style>

      {/* Top Left Floating Back Button */}
      <Link to="/student" className="enrollment-back">
        &larr; Back
      </Link>

      <div className="pricing-wrap">
        <div className="pricing-grid">
          {plansData.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.type}`}>
              {/* Metallic Pill Badge */}
              <div className="plan-label">{plan.title}</div>

              {/* Price Details */}
              <div className="old-price">{plan.oldPrice}</div>
              <h2 className="monthly-price">{plan.monthlyPrice}</h2>
              <div className="per-month">/month</div>

              {/* Features List with Square Badges */}
              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <span
                      className={`feature-badge ${
                        feature.available ? 'check' : 'cross'
                      }`}
                    >
                      {feature.available ? '✔' : '✖'}
                    </span>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>

              {/* Navy Action Button */}
              <button
                type="button"
                className="choose-plan"
                onClick={() => handleSelectPlan(plan)}
              >
                CHOOSE PLAN
              </button>
            </div>
          ))}
        </div>
      </div>

      {activePlan && (
        <div className="duration-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setActivePlan(null);
        }}>
          <section className="duration-dialog" role="dialog" aria-modal="true" aria-labelledby="duration-title">
            <button type="button" className="dialog-close" aria-label="Close duration selection" onClick={() => setActivePlan(null)}>×</button>
            <h2 id="duration-title">Select Enrollment Duration</h2>
            <p>Choose your preferred duration for the course plan.</p>
            <div className="duration-options">
              {durationOptions.map(({ months, discount }) => {
                const originalPrice = getPriceNumber(activePlan.oldPrice) * months;
                const discountedPrice = Math.round(originalPrice * (1 - discount));
                return (
                  <button type="button" key={months} onClick={() => handleSelectDuration(months, originalPrice, discountedPrice)}>
                    <span>{months} {months === 1 ? 'Month' : 'Months'}</span>
                    <span className="duration-price"><s>{formatINR(originalPrice)}</s><strong>{formatINR(discountedPrice)}</strong></span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export function StudentBooking() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchParams] = useSearchParams();
  const courseDisplayName = coursesMeta[courseId] || 'Course';
  const plan = (searchParams.get('plan') || 'silver').toLowerCase();
  const duration = Math.max(1, Number(searchParams.get('duration') || 1));
  const monthlyPrice = Number(searchParams.get('price') || (plan === 'gold' ? 2699 : plan === 'platinum' ? 4004 : 1529));
  const originalMonthlyPrice = Number(searchParams.get('originalPrice') || (plan === 'gold' ? 2999 : plan === 'platinum' ? 4449 : 1699));
  const formatINR = (value) => `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date(today);
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  });
  const [slotChoice, setSlotChoice] = useState('assigned');
  const [preferredDays, setPreferredDays] = useState([]);
  const [message, setMessage] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const displayedMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthName = displayedMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const firstWeekday = displayedMonth.getDay();
  const daysInMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 0).getDate();
  const calendarCells = [
    ...Array.from({ length: firstWeekday }, (_, i) => ({ key: `blank-${i}`, blank: true })),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), i + 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
      const isPast = date < today;
      return { key, date, day: i + 1, weekday, isPast };
    })
  ];

  const weeklyLimit = plan === 'platinum' ? 3 : plan === 'gold' ? 2 : 1;
  const discount = Math.max(0, originalMonthlyPrice - monthlyPrice);
  const courseFee = originalMonthlyPrice;
  const discountedFee = monthlyPrice;
  const registrationFee = 200;
  const slotFee = slotChoice === 'own' ? 99 : 0;
  const taxable = discountedFee + registrationFee + slotFee;
  const cgst = taxable * 0.09;
  const sgst = taxable * 0.09;
  const totalPayable = taxable + cgst + sgst;
  const selectedDateObject = selectedDate ? new Date(`${selectedDate}T00:00:00`) : null;
  const endDate = selectedDateObject
    ? new Date(selectedDateObject.getFullYear(), selectedDateObject.getMonth() + duration, selectedDateObject.getDate())
    : null;

  const togglePreferredDay = (day) => {
    setPreferredDays((current) => current.includes(day) ? [] : [day]);
    setMessage('');
  };

  const handleProceed = async () => {
    if (isPaying) return;

    if (slotChoice === 'assigned' && preferredDays.length === 0) {
      setMessage('Please select at least one preferred day so the institute can assign your class slot.');
      return;
    }

    if (!selectedDate) {
      setMessage('Please select a preferred starting date.');
      return;
    }

    setIsPaying(true);
    setMessage('');

    try {
      await loadRazorpayCheckout();

      const orderData = await api('/payment/create-order', {
        method: 'POST',
        auth: true,
        body: {
          courseId: courseId || 'soft-skills',
          plan,
          duration,
          slotChoice,
          selectedDate,
          preferredDays: slotChoice === 'assigned' ? preferredDays : [],
        },
      });

      if (!window.Razorpay) {
        throw new Error('Razorpay Checkout did not load. Please refresh and try again.');
      }

      const checkout = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Success Scholar',
        description: `${courseDisplayName} - ${plan.toUpperCase()} Plan`,
        order_id: orderData.orderId,
        notes: {
          course: courseDisplayName,
          plan: plan.toUpperCase(),
          duration: String(duration),
        },
        theme: { color: '#08245f' },
        handler: async (response) => {
          try {
            setMessage('Payment received. Verifying securely...');

            const verifyData = await api('/payment/verify', {
              method: 'POST',
              auth: true,
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });

            if (!verifyData?.verified) {
              throw new Error(
                verifyData?.message ||
                'Payment could not be verified. Please contact support before trying again.'
              );
            }

            setMessage(
              `Payment successful! ${verifyData.courseName || courseDisplayName} has been added to My Courses.`
            );

            setIsPaying(false);
            navigate('/student/my-courses', { replace: true });
          } catch (error) {
            setMessage(
              error.message ||
              'Payment verification failed. You have been logged out.'
            );

            setIsPaying(false);
            logout();
            navigate('/signin', { replace: true });
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
            setMessage('Payment window closed. You can try again when ready.');
          },
        },
      });

      checkout.on('payment.failed', (response) => {
        setIsPaying(false);
        setMessage(
          response.error?.description || 'Payment failed. You have been logged out.'
        );

        logout();
        navigate('/signin', { replace: true });
      });

      checkout.open();
    } catch (error) {
      setIsPaying(false);
      setMessage(error.message || 'Could not start payment. Please try again.');
    }
  };

  return (
    <div className="student-enrollment-page booking-page">
      <Link to={`/student/courses/${courseId || 'soft-skills'}`} className="enrollment-back">
        &larr; Back
      </Link>

      <div className="booking-layout">
        <main className="booking-main">
          <h1>Book Your Learning Slot</h1>
          <p className="booking-subtitle">Select your preferred date and time for an optimal learning experience</p>

          <h2><span aria-hidden="true">🗓️</span> Select Date &amp; Time</h2>

          <div className="availability-panel">
            <strong>Available Period: {today.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} → {new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
            <span>Bookings are available from today onwards</span>
          </div>

          <div className="booking-period-details">
            <p><strong>Number of Months:</strong> {duration}</p>
            {endDate && <p><strong>End Date:</strong> {endDate.toISOString().slice(0, 10)}</p>}
          </div>

          <div className="calendar-toolbar">
            <button type="button" onClick={() => setMonthOffset((value) => Math.max(0, value - 1))} disabled={monthOffset === 0} aria-label="Previous month">‹</button>
            <strong>{monthName}</strong>
            <button type="button" onClick={() => setMonthOffset((value) => value + 1)} aria-label="Next month">›</button>
          </div>

          <div className="calendar-weekdays" aria-hidden="true">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="booking-calendar">
            {calendarCells.map((cell) => cell.blank ? (
              <span key={cell.key} className="calendar-blank" aria-hidden="true" />
            ) : (
              <button
                key={cell.key}
                type="button"
                className={`${cell.isPast ? 'disabled' : ''} ${selectedDate === cell.key ? 'selected' : ''}`}
                disabled={cell.isPast}
                onClick={() => { setSelectedDate(cell.key); setMessage(''); }}
                aria-pressed={selectedDate === cell.key}
                aria-label={`${cell.day} ${monthName}`}
              >
                {String(cell.day).padStart(2, '0')}
                {cell.day === 1 && <small>{displayedMonth.toLocaleDateString('en-IN', { month: 'short' })}</small>}
              </button>
            ))}
          </div>

          <fieldset className="slot-choice">
            <label>
              <input type="radio" name="slot-choice" value="own" checked={slotChoice === 'own'} onChange={() => { setSlotChoice('own'); setMessage(''); }} />
              <span>I want to select my own slot ({formatINR(99).replace('.00', '')})</span>
            </label>
            <label>
              <input type="radio" name="slot-choice" value="assigned" checked={slotChoice === 'assigned'} onChange={() => { setSlotChoice('assigned'); setMessage(''); }} />
              <span>Let institute assign a slot for me (Free)</span>
            </label>
          </fieldset>

          {slotChoice === 'assigned' && (
            <fieldset className="preferred-days">
              <legend>Select Preferred Days:</legend>
              {['Wednesday', 'Friday', 'Saturday'].map((day) => (
                <label key={day}>
                  <input type="checkbox" checked={preferredDays.includes(day)} onChange={() => togglePreferredDay(day)} />
                  <span>{day}</span>
                </label>
              ))}
              <small>Select your preferred days. Final slot is subject to availability.</small>
            </fieldset>
          )}

          {slotChoice === 'own' && (
            <div className="own-slot-note">Your selected starting date is {selectedDate || 'not selected'}. The institute will confirm the available class time.</div>
          )}

          <div className="booking-notice">⚠️ {slotChoice === 'assigned' ? 'Slot will be provided by the institute and is subject to availability.' : 'Your preferred slot request is subject to confirmation.'}</div>
          {message && <p className="booking-message" role="status">{message}</p>}

          <button
            type="button"
            className="proceed-payment"
            onClick={handleProceed}
            disabled={isPaying}
          >
            {isPaying ? 'PROCESSING PAYMENT...' : 'PROCEED TO PAY'}
          </button>
        </main>

        <aside className="booking-summary">
          <h2><span aria-hidden="true">📊</span> Booking Summary</h2>
          <dl>
            <div><dt>Plan Type</dt><dd><span className={`summary-plan ${plan}`}>{plan.toUpperCase()}</span></dd></div>
            <div><dt>Weekly Limit</dt><dd>{weeklyLimit} {weeklyLimit === 1 ? 'slot' : 'slots'}</dd></div>
            <div><dt>Course Fee (before discount)</dt><dd>{formatINR(courseFee)}</dd></div>
            <div><dt>Total Course Fee</dt><dd>{formatINR(discountedFee)}</dd></div>
            <div><dt>Discount</dt><dd>{formatINR(discount)}</dd></div>
            <div><dt>One Time Registration Fee</dt><dd>{formatINR(registrationFee)}</dd></div>
            <div><dt>Slot Booking</dt><dd>{formatINR(slotFee)}</dd></div>
            <div><dt>Months</dt><dd>{duration}</dd></div>
            <div><dt>CGST (9%)</dt><dd>{formatINR(cgst)}</dd></div>
            <div><dt>SGST (9%)</dt><dd>{formatINR(sgst)}</dd></div>
            <div className="summary-total"><dt>Total Payable</dt><dd>{formatINR(totalPayable)}</dd></div>
            <div><dt>Class Days</dt><dd>{slotChoice === 'assigned' ? 'Wednesday, Friday, Saturday' : 'Self-selected slot'}</dd></div>
            <div><dt>Chosen Days</dt><dd>{preferredDays.length ? preferredDays.join(', ') : 'None'}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

export default StudentCoursePricing;
