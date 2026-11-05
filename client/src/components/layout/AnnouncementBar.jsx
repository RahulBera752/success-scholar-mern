
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  admissionsNotice,
  announcementMessage,
  desktopExperienceNotice,
  internshipNotice,
} from '../../data/announcement.js';

const messages = [
  admissionsNotice,
  desktopExperienceNotice,
  internshipNotice,
];

const messageHold = 2700;
const slideDuration = 550;

// Update this path if your actual sign-in route is different.
const SIGN_IN_PATH = '/login';

export default function AnnouncementBar({ home = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [sliding, setSliding] = useState(false);

  useEffect(() => {
    if (!home) return undefined;

    let holdTimer;
    let slideTimer;
    let frame;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      const interval = window.setInterval(() => {
        setActiveIndex((index) => (index + 1) % messages.length);
      }, messageHold + slideDuration);

      return () => window.clearInterval(interval);
    }

    const advance = () => {
      holdTimer = window.setTimeout(() => {
        setTransitioning(true);

        frame = window.requestAnimationFrame(() => {
          setSliding(true);
        });

        slideTimer = window.setTimeout(() => {
          setActiveIndex((index) => (index + 1) % messages.length);
          setTransitioning(false);
          setSliding(false);
          advance();
        }, slideDuration);
      }, messageHold);
    };

    advance();

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(slideTimer);
      window.cancelAnimationFrame(frame);
    };
  }, [home]);

  if (!home) {
    const isInternshipAnnouncement =
      announcementMessage.toLowerCase().includes('internship');

    return (
      <div className="announce">
        {isInternshipAnnouncement ? (
          <Link
            to="/internship"
            className="announcement-internship-link"
          >
            {announcementMessage}
          </Link>
        ) : (
          announcementMessage
        )}
      </div>
    );
  }

  const nextIndex = (activeIndex + 1) % messages.length;
  const currentMessage = messages[activeIndex];

  const isAdmissionsMessage = currentMessage === admissionsNotice;
  const isInternshipMessage = currentMessage === internshipNotice;

  return (
    <div className="home-announcement">
      <div
        className="home-announcement__viewport"
        aria-live="polite"
        aria-atomic="true"
      >
        <span
          className={`home-announcement__message${
            transitioning
              ? ` is-exiting${sliding ? ' is-sliding' : ''}`
              : ''
          }`}
          aria-hidden={transitioning}
        >
          {isAdmissionsMessage ? (
            <Link
              to={SIGN_IN_PATH}
              className="announcement-internship-link"
              aria-label="Sign in to Success Scholar"
              tabIndex={transitioning ? -1 : 0}
            >
              {currentMessage}
            </Link>
          ) : isInternshipMessage ? (
            <Link
              to="/internship"
              className="announcement-internship-link"
              aria-label="View the Internship page"
              tabIndex={transitioning ? -1 : 0}
            >
              {currentMessage}
            </Link>
          ) : (
            currentMessage
          )}
        </span>

        {transitioning && (
          <span
            className={`home-announcement__message is-entering${
              sliding ? ' is-sliding' : ''
            }`}
            aria-hidden="true"
          >
            {messages[nextIndex]}
          </span>
        )}
      </div>
    </div>
  );
}
