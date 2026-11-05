
import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../common/SectionTitle.jsx';
import CourseEnquiry from './CourseEnquiry.jsx';

const courses = [
  {
    title: 'Soft Skills',
    image: '/assets/courses/soft.png',
    description:
      'Build essential soft skills that are crucial for professional success. Develop your communication abilities, presentation skills, and business etiquette to help you excel in any workplace environment.',
    topics: ['Effective Communication', 'Public Speaking Basics', 'Business English'],
  },
  {
    title: 'Interview Preparation',
    image: '/assets/courses/inter.png',
    description:
      'Master the art of interviewing with our comprehensive preparation course. From technical questions to behavioral assessments, we cover the skills you need to approach interviews with confidence and professionalism.',
    topics: ['Resume Building', 'Mock Interviews', 'HR Interview Preparation'],
  },
  {
    title: 'Personality Development',
    image: '/assets/courses/per.png',
    description:
      'Develop a confident and professional personality through activities that strengthen self-awareness, positive communication, body language, and interpersonal skills.',
    topics: ['Confidence Building', 'Body Language Skills', 'Leadership Skills'],
  },
  {
    title: 'Advanced Communication Skills',
    image: '/assets/courses/com.png',
    description:
      'Improve your professional communication for meetings, presentations, teamwork, and workplace interactions with structured practice and feedback.',
    topics: ['Teamwork Skills', 'Behavioral Interview', 'Problem Solving Skills'],
  },
  {
    title: 'Spoken English',
    image: '/assets/courses/spo.png',
    description:
      'Build fluency and confidence in spoken English with guided speaking practice, vocabulary development, and everyday and professional conversation exercises.',
    topics: ['Everyday Conversation', 'Vocabulary and Fluency', 'Grammar in Speaking'],
  },
  {
    title: 'Campus Readiness Training',
    image: '/assets/courses/cor.png',
    description:
      'Prepare for campus recruitment and the transition from college to work with practical training in employability, communication, and workplace readiness.',
    topics: ['Campus Placement Readiness', 'Group Discussion Practice', 'Workplace Etiquette'],
  },
];

export default function Courses() {
  const trackRef = useRef(null);

  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [courseEnquiryOpen, setCourseEnquiryOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const pageCount = Math.max(1, Math.ceil(courses.length / perPage));

  // Calculate how many cards fit inside the carousel.
  useEffect(() => {
    const track = trackRef.current;

    if (!track || !window.ResizeObserver) return undefined;

    const updatePerPage = () => {
      const card = track.querySelector('.course-tile');
      if (!card) return;

      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const cardWidth = card.getBoundingClientRect().width;

      if (cardWidth > 0) {
        setPerPage(
          Math.max(
            1,
            Math.floor((track.clientWidth + gap) / (cardWidth + gap))
          )
        );
      }
    };

    const observer = new ResizeObserver(updatePerPage);
    observer.observe(track);
    updatePerPage();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);

  // Preserve the existing modal behavior.
  useEffect(() => {
    if (!selectedCourse && !courseEnquiryOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedCourse(null);
        setCourseEnquiryOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedCourse, courseEnquiryOpen]);

  const updatePage = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;

    const index =
      maxScroll <= 1
        ? 0
        : Math.round((track.scrollLeft / maxScroll) * (pageCount - 1));

    setPage(index);
  }, [pageCount]);

  const goToPage = useCallback(
    (index) => {
      const track = trackRef.current;
      if (!track) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      const card = track.querySelector('.course-tile');
      if (!card) return;

      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const pageOffset =
        index * perPage * (card.getBoundingClientRect().width + gap);

      track.scrollTo({
        left: index === pageCount - 1 ? maxScroll : pageOffset,
        behavior: 'smooth',
      });
    },
    [pageCount, perPage]
  );

  // Start dragging with the mouse.
  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const track = trackRef.current;
    if (!track) return;

    // Do not start dragging from interactive buttons or links.
    if (event.target.closest('button, a')) return;

    dragRef.current = {
      dragging: true,
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
      moved: false,
    };

    track.classList.add('is-dragging');
  };

  // Move the carousel as the pointer moves.
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

  // Stop dragging when the pointer is released.
  const stopDragging = useCallback(() => {
    const track = trackRef.current;

    if (track) {
      track.classList.remove('is-dragging');
    }

    dragRef.current.dragging = false;
    updatePage();
  }, [updatePage]);

  // Prevent a click after a drag from activating a card action.
  const handleClickCapture = (event) => {
    if (!dragRef.current.moved) return;

    event.preventDefault();
    event.stopPropagation();
    dragRef.current.moved = false;
  };

  useEffect(() => {
    const stop = () => stopDragging();

    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);

    return () => {
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, [stopDragging]);

  const closeCourseDetails = () => setSelectedCourse(null);

  const openCourseEnquiry = (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    setSelectedCourse(null);
    setCourseEnquiryOpen(true);
  };

  return (
    <section className="section courses-section" id="courses">
      <SectionTitle>Our Courses</SectionTitle>

      <div className="course-carousel">
        <div
          className="course-track"
          ref={trackRef}
          onScroll={updatePage}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onClickCapture={handleClickCapture}
        >
          {courses.map((course) => (
            <article className="course-tile" key={course.title}>
              <img
                className="course-image"
                src={course.image}
                alt={course.title}
                draggable="false"
              />

              <h3 className="course-title">{course.title}</h3>

              <div className="course-card-actions">
                <Link
                  to="/register"
                  className="course-action-button course-enroll-button"
                >
                  ENROLL NOW
                </Link>

                <button
                  type="button"
                  className="course-action-button course-enquiry-button"
                  onClick={openCourseEnquiry}
                >
                  ENQUIRY
                </button>

                <button
                  type="button"
                  className="course-know-more-button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setCourseEnquiryOpen(false);
                    setSelectedCourse(course);
                  }}
                >
                  Know more
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="course-dots" aria-label="Course pages">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show course page ${index + 1}`}
              aria-current={page === index ? 'true' : undefined}
              className={page === index ? 'active' : ''}
              onClick={() => goToPage(index)}
            />
          ))}
        </div>
      </div>

      <CourseEnquiry
        open={courseEnquiryOpen}
        onClose={() => setCourseEnquiryOpen(false)}
      />

      {selectedCourse && (
        <div
          className="course-details-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeCourseDetails();
            }
          }}
        >
          <section
            className="course-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-details-title"
          >
            <button
              type="button"
              className="course-details-close"
              aria-label="Close course details"
              onClick={closeCourseDetails}
            >
              ×
            </button>

            <div className="course-details-content">
              <h2 id="course-details-title">{selectedCourse.title}</h2>

              <div className="course-details-divider" />

              <p className="course-details-description">
                {selectedCourse.description}
              </p>

              <h3>What You'll Learn:</h3>

              <ul className="course-details-topics">
                {selectedCourse.topics.map((topic) => (
                  <li key={topic}>
                    <span aria-hidden="true">✓</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            <div className="course-details-footer">
              <button
                type="button"
                className="course-details-enquiry"
                onClick={openCourseEnquiry}
              >
                Enquiry
              </button>
            </div>
          </section>
        </div>
      )}

      <style>{`
        .courses-section .course-tile {
          box-sizing: border-box;
          padding: 0;
          height: clamp(290px, 17.7vw, 340px);
          overflow: hidden;
        }

        .courses-section .course-image {
          display: block;
          box-sizing: border-box;
          flex: 0 0 clamp(172px, 10.4vw, 200px);
          width: 100%;
          height: clamp(172px, 10.4vw, 200px);
          object-fit: cover;
          object-position: center top;
          -webkit-user-drag: none;
          user-select: none;
        }

        .courses-section .course-title {
          box-sizing: border-box;
          flex: 1 1 auto;
          min-height: 0;
          margin: 0;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .courses-section .course-card-actions {
          display: none !important;
        }

        .course-card-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          margin-top: 18px;
        }

        .course-action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 44px;
          padding: 10px 14px;
          border: 1px solid #08245f;
          border-radius: 999px;
          background: #08245f;
          color: #fff;
          font: inherit;
          font-size: 14px;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          box-sizing: border-box;
        }

        .course-action-button:hover {
          background: #123b86;
          color: #fff;
        }

        .course-know-more-button {
          align-self: center;
          margin-top: 2px;
          padding: 6px 10px;
          border: 0;
          background: transparent;
          color: #08245f;
          font: inherit;
          cursor: pointer;
        }

        .course-know-more-button:hover {
          text-decoration: underline;
        }

        /* Horizontal drag and swipe support */
        .courses-section .course-track {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          overscroll-behavior-x: contain;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }

        .courses-section .course-track::-webkit-scrollbar {
          display: none;
        }

        .courses-section .course-track.is-dragging {
          cursor: grabbing;
          scroll-behavior: auto;
          scroll-snap-type: none;
        }

        .courses-section .course-tile {
          flex-shrink: 0;
          scroll-snap-align: start;
        }

        .course-details-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, .70);
          box-sizing: border-box;
        }

        .course-details-modal {
          position: relative;
          display: flex;
          flex-direction: column;
          width: min(484px, 100%);
          max-height: min(705px, calc(100vh - 40px));
          overflow: hidden;
          border-radius: 12px;
          background: #fff;
          color: #374151;
          box-shadow: 0 18px 55px rgba(0, 0, 0, .25);
          font-family: Arial, Helvetica, sans-serif;
        }

        .course-details-content {
          min-height: 0;
          overflow-y: auto;
          flex: 1 1 auto;
          padding: 65px 32px 26px;
          scrollbar-width: thin;
        }

        .course-details-close {
          position: absolute;
          top: 10px;
          right: 14px;
          z-index: 2;
          width: 32px;
          height: 32px;
          border: 0;
          background: transparent;
          color: #111827;
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
        }

        .course-details-modal h2 {
          margin: 0;
          color: #08245f;
          text-align: center;
          font-size: 27px;
          line-height: 1.3;
          font-weight: 800;
        }

        .course-details-divider {
          height: 1px;
          margin: 46px 0 32px;
          background: #e5e7eb;
        }

        .course-details-description {
          margin: 0 0 26px;
          font-size: 16px;
          line-height: 1.7;
        }

        .course-details-modal h3 {
          margin: 0 0 16px;
          color: #08245f;
          font-size: 21px;
        }

        .course-details-topics {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .course-details-topics li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 13px 0;
          border-bottom: 1px solid #e5e7eb;
          font-size: 15px;
          line-height: 1.5;
        }

        .course-details-topics li span {
          color: #22a447;
          font-size: 20px;
          font-weight: 700;
        }

        .course-details-footer {
          flex: 0 0 auto;
          padding: 18px 32px 22px;
          border-top: 1px solid #e5e7eb;
          background: #fff;
        }

        .course-details-enquiry {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 46px;
          border: 2px solid #08245f;
          border-radius: 6px;
          background: #fff;
          color: #08245f;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }

        .course-details-enquiry:hover {
          background: #08245f;
          color: #fff;
        }

        @media (max-width: 520px) {
          .courses-section .course-tile {
            height: 320px;
          }

          .courses-section .course-image {
            flex-basis: 190px;
            height: 190px;
          }

          .course-details-modal {
            max-height: calc(100vh - 24px);
          }

          .course-details-content {
            padding: 56px 22px 24px;
          }

          .course-details-modal h2 {
            font-size: 23px;
          }

          .course-details-divider {
            margin: 30px 0 24px;
          }

          .course-details-description {
            font-size: 15px;
          }

          .course-details-footer {
            padding: 14px 22px 18px;
          }
        }
      `}</style>
    </section>
  );
}
