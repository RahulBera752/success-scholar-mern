
import {
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';

import SectionTitle from '../common/SectionTitle.jsx';
import Icon from '../common/Icon.jsx';
import useFetch from '../common/useFetch.js';
import CourseModal from './CourseModal.jsx';

const illustrations = {
  'personality-development': '/assets/expertise/personality-development.png',
  'posh-training': '/assets/expertise/posh-training.png',
  'competitive-aptitude': '/assets/expertise/competitive-aptitude.png',
  'sales-marketing-branding': '/assets/expertise/sales-marketing-branding.png',
  'leadership-training': '/assets/expertise/leadership-training.png',
  gdpi: '/assets/expertise/group-discussion-interview.png',
  'spoken-english': '/assets/expertise/spoken-english.png',
  'corporate-training': '/assets/expertise/corporate-training.png',
  c2c: '/assets/expertise/c2c.png',
  'nlp-fundamentals': '/assets/expertise/nlp-fundamentals.png',
  'film-making': '/assets/expertise/film-making.png',
};

export default function Expertise() {
  const {
    data: courses,
    error,
    loading,
  } = useFetch('/courses');

  const trackRef = useRef(null);
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  const [page, setPage] = useState(0);
  const [, setLayoutVersion] = useState(0);
  const [selected, setSelected] = useState(null);

  const close = useCallback(() => {
    setSelected(null);
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track || !window.ResizeObserver) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      setLayoutVersion((version) => version + 1);
    });

    observer.observe(track);

    return () => observer.disconnect();
  }, [courses?.length]);

  const getCardStep = useCallback(() => {
    const track = trackRef.current;
    const firstCard = track?.querySelector('.exp-card');

    if (!track || !firstCard) return 300;

    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;

    return firstCard.getBoundingClientRect().width + gap;
  }, []);

  const getCardsPerPage = useCallback(() => {
    const track = trackRef.current;

    if (!track) return 1;

    return Math.max(
      1,
      Math.floor(track.clientWidth / getCardStep())
    );
  }, [getCardStep]);

  const pages = courses?.length
    ? Math.ceil(courses.length / getCardsPerPage())
    : 0;

  const updatePage = useCallback(() => {
    const track = trackRef.current;

    if (!track) return;

    const stepSize = getCardsPerPage() * getCardStep();

    const currentPage = Math.round(
      track.scrollLeft / Math.max(1, stepSize)
    );

    setPage(
      Math.max(0, Math.min(currentPage, Math.max(0, pages - 1)))
    );
  }, [getCardStep, getCardsPerPage, pages]);

  const scrollToPage = useCallback(
    (targetPage) => {
      const track = trackRef.current;

      if (!track) return;

      const stepSize = getCardsPerPage() * getCardStep();
      const maxScroll = track.scrollWidth - track.clientWidth;

      track.scrollTo({
        left: Math.min(
          maxScroll,
          Math.max(0, targetPage * stepSize)
        ),
        behavior: 'smooth',
      });
    },
    [getCardStep, getCardsPerPage]
  );

  const moveCards = useCallback(
    (direction) => {
      const track = trackRef.current;

      if (!track) return;

      track.scrollBy({
        left: direction * getCardsPerPage() * getCardStep(),
        behavior: 'smooth',
      });
    },
    [getCardStep, getCardsPerPage]
  );

  const handlePointerDown = (event) => {
    // Mouse dragging only. Touch devices retain native swipe scrolling.
    if (event.pointerType !== 'mouse' || event.button !== 0) return;

    const track = trackRef.current;

    if (!track) return;

    dragRef.current = {
      dragging: true,
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
      moved: false,
    };

    track.classList.add('is-dragging');
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    const track = trackRef.current;

    if (!drag.dragging || !track) return;

    const distance = event.clientX - drag.startX;

    if (Math.abs(distance) > 4) {
      drag.moved = true;
    }

    if (drag.moved) {
      track.scrollLeft = drag.startScrollLeft - distance;
    }
  };

  const stopDragging = useCallback(() => {
    const track = trackRef.current;

    if (track) {
      track.classList.remove('is-dragging');
    }

    dragRef.current.dragging = false;
    updatePage();
  }, [updatePage]);

  const handleClickCapture = (event) => {
    if (!dragRef.current.moved) return;

    event.preventDefault();
    event.stopPropagation();
    dragRef.current.moved = false;
  };

  useEffect(() => {
    window.addEventListener('pointerup', stopDragging);
    window.addEventListener('pointercancel', stopDragging);

    return () => {
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('pointercancel', stopDragging);
    };
  }, [stopDragging]);

  return (
    <section
      className="section expertise-section"
      id="ss_scroll_offers"
    >
      <SectionTitle>Our Expertise</SectionTitle>

      {loading && (
        <p className="center-note">Loading expertise…</p>
      )}

      {error && (
        <p className="center-note error-text">
          {error} (Did you run the seed script?)
        </p>
      )}

      {courses && (
        <div className="carousel container expertise-carousel">
          <button
            type="button"
            className="car-btn left"
            onClick={() => moveCards(-1)}
            aria-label="Previous expertise cards"
          >
            <Icon name="chevL" size={18} />
          </button>

          <div
            className="car-track"
            ref={trackRef}
            onScroll={updatePage}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
onPointerCancel={stopDragging}
            onClickCapture={handleClickCapture}
            role="region"
            aria-label="Expertise courses"
            tabIndex={0}
          >
            {courses.map((course) => (
              <article
                className="card exp-card"
                key={course._id}
              >
                <div className="exp-icon">
                  <img
                    src={illustrations[course.slug]}
                    alt={`${course.title} illustration`}
                    draggable="false"
                  />
                </div>

                <h3>{course.title}</h3>

                <p>{course.summary}</p>

                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() => setSelected(course)}
                >
                  Know More
                </button>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="car-btn right"
            onClick={() => moveCards(1)}
            aria-label="Next expertise cards"
          >
            <Icon name="chevR" size={18} />
          </button>

          <div className="dots">
            {Array.from({ length: pages }).map((_, index) => (
              <button
                type="button"
                key={index}
                className={index === page ? 'active' : ''}
                onClick={() => scrollToPage(index)}
                aria-label={`Page ${index + 1}`}
                aria-current={index === page ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      )}

      <CourseModal course={selected} onClose={close} />
    </section>
  );
}
