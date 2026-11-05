import { useState, useCallback, useEffect, useRef } from 'react';
import SectionTitle from '../common/SectionTitle.jsx';
import Icon from '../common/Icon.jsx';
import { gallery } from '../../data/gallery.js';

export default function Portfolio() {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const open = index !== null;
  const move = useCallback((d) => setIndex((i) => (i + d + gallery.length) % gallery.length), []);

  const updateCarousel = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = [...track.querySelectorAll('.portfolio-item')];
    const center = track.getBoundingClientRect().left + track.clientWidth / 2;
    const closest = items.reduce((best, item, itemIndex) => {
      const bounds = item.getBoundingClientRect();
      const distance = Math.abs(center - (bounds.left + bounds.width / 2));
      return distance < best.distance ? { index: itemIndex, distance } : best;
    }, { index: 0, distance: Infinity });
    setActiveIndex(closest.index);

    const maxScroll = track.scrollWidth - track.clientWidth;
    const progress = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
    setActiveDot(Math.round(progress * 4));
  }, []);

  const goToDot = (dotIndex) => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    track.scrollTo({ left: (maxScroll * dotIndex) / 4, behavior: 'smooth' });
  };

  useEffect(() => {
    updateCarousel();
    window.addEventListener('resize', updateCarousel);
    return () => window.removeEventListener('resize', updateCarousel);
  }, [updateCarousel]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setIndex(null);
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, move]);

  return (
    <section className="section portfolio-section" id="showcase">
      <SectionTitle>Portfolio</SectionTitle>
      <div className="portfolio-gallery">
        <div className="portfolio-track" ref={trackRef} onScroll={updateCarousel}>
          {gallery.map((item, i) => (
            <button
              className={`portfolio-item${i === activeIndex ? ' center' : ''}`}
              key={item.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View ${item.title}`}
            >
              <img src={item.image} alt={item.title} loading={i < 5 ? 'eager' : 'lazy'} />
            </button>
          ))}
        </div>
        <div className="portfolio-dots" aria-label="Portfolio pages">
          {Array.from({ length: 5 }, (_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              aria-label={`Show portfolio section ${dotIndex + 1}`}
              aria-current={activeDot === dotIndex ? 'true' : undefined}
              onClick={() => goToDot(dotIndex)}
            />
          ))}
        </div>
      </div>
      {open && (
        <div className="lightbox" onMouseDown={(e) => e.target === e.currentTarget && setIndex(null)}>
          <button className="lb-close" onClick={() => setIndex(null)} aria-label="Close"><Icon name="close" /></button>
          <button className="lb-nav left" onClick={() => move(-1)} aria-label="Previous"><Icon name="chevL" /></button>
          <figure>
            <img className="portfolio-lightbox-image" src={gallery[index].image} alt={gallery[index].title} />
            <figcaption>
              <strong>{gallery[index].title}</strong>
              <span>{gallery[index].caption}</span>
              <div className="dots light">
                {gallery.map((g, i) => (
                  <button key={g.id} className={i === index ? 'active' : ''} onClick={() => setIndex(i)} aria-label={`Item ${i + 1}`} />
                ))}
              </div>
            </figcaption>
          </figure>
          <button className="lb-nav right" onClick={() => move(1)} aria-label="Next"><Icon name="chevR" /></button>
        </div>
      )}
    </section>
  );
}
