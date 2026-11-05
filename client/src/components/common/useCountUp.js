import { useEffect, useRef, useState } from 'react';

// Animates 0 -> target when the element scrolls into view.
export default function useCountUp(target, duration = 1600) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf;
    const run = () => {
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        setValue(Math.floor(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        run();
        io.disconnect();
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return [ref, value];
}

// Animates a group from one shared visibility trigger so the cards count together.
export function useCountUpGroup(targets, duration = 2000) {
  const ref = useRef(null);
  const [values, setValues] = useState(() => targets.map(() => 0));
  const targetKey = targets.join(',');

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let raf = 0;
    let started = false;
    let observer;

    const animate = () => {
      if (started) return;
      started = true;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setValues(targets);
        return;
      }

      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        setValues(targets.map((target) => (
          progress === 1 ? target : Math.floor(target * eased)
        )));

        if (progress < 1) raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      animate();
    } else {
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        animate();
      }, { threshold: 0.15 });
      observer.observe(el);
    }

    return () => {
      observer?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  // targetKey keeps the effect stable while its target list is recreated by render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, targetKey]);

  return [ref, values];
}
