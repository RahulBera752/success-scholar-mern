import { useCallback, useEffect, useRef, useState } from 'react';
import Alert from '../common/Alert.jsx';
import useFetch from '../common/useFetch.js';
import { api } from '../../api.js';
import { referenceTestimonials } from '../../data/testimonials.js';

const avatarByName = {
  'Debadrita Kalsar': '/assets/testimonial-avatars/kakoli.png',
  'Shreya Chandra': '/assets/testimonial-avatars/shreya.png',
  'Piyush Patwari': '/assets/testimonial-avatars/piyush.png',
  'Shreyashi Sarkar': '/assets/testimonial-avatars/shreyashi.png',
  'Aniket Gaurav': '/assets/testimonial-avatars/aniket_gaurav.jpeg',
  'Sanskriti Chatterjee': '/assets/testimonial-avatars/sanskriti.jpeg',
  'Ankur Bhattacharyya': '/assets/testimonial-avatars/ankur.jpeg',
  'Arnab Bhattacharya': '/assets/testimonial-avatars/arnab.jpeg',
};

function getCarouselStops(element) {
  const cards = element.querySelectorAll('.t-card');
  if (!cards.length) return [0];

  const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
  const step = cards[0].getBoundingClientRect().width + gap;
  const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth);
  if (maxScroll <= 1 || step <= 0) return [0];

  const fullSteps = Math.floor(maxScroll / step);
  const remainder = maxScroll - fullSteps * step;
  const includeEndStop = remainder > step * 0.2;
  const count = fullSteps + 1 + (includeEndStop ? 1 : 0);
  const stops = Array.from({ length: count }, (_, index) => (
    index === count - 1 ? maxScroll : Math.min(maxScroll, index * step)
  ));
  return stops.filter((stop, index) => index === 0 || stop - stops[index - 1] > 1);
}

function Card({ t, active }) {
  const [more, setMore] = useState(false);
  const [canReadMore, setCanReadMore] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const messageRef = useRef(null);
  const quote = t.message || t.quote || '';
  const initials = t.name.split(' ').map((word) => word[0]).slice(0, 2).join('');
  const avatar = typeof t.avatar === 'string' && t.avatar.trim()
    ? t.avatar.trim()
    : avatarByName[t.name] || '';

  useEffect(() => {
    const element = messageRef.current;
    if (!element) return undefined;

    const measureOverflow = () => {
      if (more) {
        setCanReadMore(true);
        return;
      }

      const fullText = element.cloneNode(true);
      const bounds = element.getBoundingClientRect();
      Object.assign(fullText.style, {
        position: 'fixed',
        left: '-10000px',
        top: '0',
        width: `${bounds.width}px`,
        height: 'auto',
        maxHeight: 'none',
        overflow: 'visible',
        display: 'block',
        WebkitLineClamp: 'unset',
        visibility: 'hidden',
        flex: 'none',
      });
      element.parentElement.appendChild(fullText);
      const fullHeight = fullText.getBoundingClientRect().height;
      const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight) || 24;
      fullText.remove();
      setCanReadMore(fullHeight > lineHeight * 5 + 1);
    };

    const observer = new ResizeObserver(measureOverflow);
    observer.observe(element);
    measureOverflow();
    return () => observer.disconnect();
  }, [more, quote]);

  return (
    <article className={`card t-card${active ? ' is-active' : ''}${canReadMore ? ' has-read-more' : ''}`}>
      <svg className="t-quote" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10.2 11H5.8c.2-2.6 1.6-4.1 4.3-4.7V3.8C5.3 4.4 2.8 7.5 2.8 12.3v6h7.4V11Zm11 0h-4.4c.2-2.6 1.6-4.1 4.3-4.7V3.8c-4.8.6-7.3 3.7-7.3 8.5v6h7.4V11Z" fill="currentColor" />
      </svg>
      <div className="t-card__copy">
        <p ref={messageRef} className={`t-card__message${more ? ' is-expanded' : ''}`}>
          {quote}
        </p>
        {canReadMore && (
          <button className="link-btn" type="button" aria-expanded={more} onClick={() => setMore((value) => !value)}>
            {more ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
      <div className="t-person">
        {avatar && !avatarFailed
          ? <img className="avatar t-avatar" src={avatar} alt={t.name} onError={() => setAvatarFailed(true)} />
          : <div className="avatar" aria-hidden="true">{initials}</div>}
        <div><h4>{t.name}</h4><span>{t.role || 'Student'}</span></div>
      </div>
    </article>
  );
}

function SubmitForm({ onClose, onSubmitted }) {
  const [form, setForm] = useState({ name: '', quote: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const submit = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const quote = form.quote.trim();
    if (!name || !quote) {
      setMsg({ type: 'error', text: 'Please enter your name and your experience.' });
      return;
    }

    setSubmitting(true);
    setMsg({ type: '', text: '' });
    try {
      const response = await api('/testimonials', {
        method: 'POST',
        body: { name, quote, role: 'Student' },
      });
      setForm({ name: '', quote: '' });
      onSubmitted(response.message || 'Thanks! Your testimonial was submitted for review.');
    } catch (error) {
      setMsg({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="testimonial-modal" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="testimonial-dialog" role="dialog" aria-modal="true" aria-labelledby="testimonial-dialog-title">
        <button className="testimonial-modal__close" type="button" aria-label="Close form" onClick={onClose}>×</button>
        <form className="form share-form" onSubmit={submit}>
          <h3 id="testimonial-dialog-title">Share your experience</h3>
          <label>Name<input autoFocus required maxLength="100" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label>Your words<textarea required rows="4" maxLength="600" value={form.quote} onChange={(event) => setForm({ ...form, quote: event.target.value })} /></label>
          <Alert type={msg.type}>{msg.text}</Alert>
          <div className="testimonial-form__actions">
            <button className="btn btn-outline" type="button" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit for review'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function Testimonials({ showForm = true }) {
  const { data, error } = useFetch('/testimonials');
  const track = useRef(null);
  const [activeCard, setActiveCard] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [submissionNotice, setSubmissionNotice] = useState('');
  const approvedTestimonials = Array.isArray(data) ? data : [];
  const testimonials = [
    ...approvedTestimonials.map((testimonial) => ({
      ...testimonial,
      id: testimonial._id || testimonial.id,
      role: testimonial.role || 'Student',
      message: testimonial.message || testimonial.quote || '',
      avatar: typeof testimonial.avatar === 'string' && testimonial.avatar.trim()
        ? testimonial.avatar.trim()
        : avatarByName[testimonial.name] || '',
    })),
    ...referenceTestimonials.map((testimonial) => ({ ...testimonial, _id: testimonial.id })),
  ];

  const updateCarousel = useCallback(() => {
    const element = track.current;
    if (!element) return;

    const cards = [...element.querySelectorAll('.t-card')];
    const trackCenter = element.getBoundingClientRect().left + element.clientWidth / 2;
    let nearestCard = 0;
    let nearestDistance = Infinity;
    cards.forEach((card, index) => {
      const bounds = card.getBoundingClientRect();
      const distance = Math.abs(bounds.left + bounds.width / 2 - trackCenter);
      if (distance < nearestDistance) {
        nearestCard = index;
        nearestDistance = distance;
      }
    });

    const stops = getCarouselStops(element);
    const page = stops.reduce((nearest, position, index) => (
      Math.abs(position - element.scrollLeft) < Math.abs(stops[nearest] - element.scrollLeft) ? index : nearest
    ), 0);

    setActiveCard(nearestCard);
    setPageCount(stops.length);
    setActivePage(page);
  }, []);

  useEffect(() => {
    const element = track.current;
    if (!element) return undefined;
    element.scrollLeft = 0;
    updateCarousel();
    const observer = new ResizeObserver(updateCarousel);
    observer.observe(element);
    element.addEventListener('scroll', updateCarousel, { passive: true });
    return () => {
      observer.disconnect();
      element.removeEventListener('scroll', updateCarousel);
    };
  }, [data, updateCarousel]);

  const goToPage = (page) => {
    const element = track.current;
    if (!element) return;
    const stops = getCarouselStops(element);
    if (page >= stops.length) return;
    element.scrollTo({ left: stops[page], behavior: 'smooth' });
  };

  return (
    <section className="section tinted testimonials-section" id="tt_about">
      <div className="testimonials-heading">
        <h2>The Transformation Journey</h2>
      </div>
      {error && <p className="center-note error-text testimonial-api-note">Showing sample testimonials. {error}</p>}
      <div className="carousel testimonials-carousel">
        <div className="car-track testimonial-track" ref={track}>
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial._id || testimonial.id} t={testimonial} active={index === activeCard} />
          ))}
        </div>
        <div className="testimonial-dots" role="group" aria-label="Testimonial pages">
          {Array.from({ length: pageCount }, (_, page) => (
            <button
              key={page}
              type="button"
              className={page === activePage ? 'active' : ''}
              aria-label={`Go to testimonial page ${page + 1}`}
              aria-current={page === activePage ? 'true' : undefined}
              onClick={() => goToPage(page)}
            />
          ))}
        </div>
      </div>
      {submissionNotice && <div className="testimonial-notice" role="status">{submissionNotice}</div>}
      {showForm && (
        <div className="testimonial-submit-action">
          <button className="btn btn-outline testimonial-share-button" type="button" onClick={() => { setSubmissionNotice(''); setFormOpen(true); }}>
            Share your experience
          </button>
        </div>
      )}
      {formOpen && <SubmitForm onClose={() => setFormOpen(false)} onSubmitted={(message) => { setFormOpen(false); setSubmissionNotice(message); }} />}
    </section>
  );
}






