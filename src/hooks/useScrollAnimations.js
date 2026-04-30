import { useEffect, useRef, useState, useCallback } from "react";

/**
 * useScrollReveal — Apple-style scroll-triggered reveal animation
 * Elements fade/slide in when they enter the viewport.
 *
 * @param {Object} options
 * @param {number} options.threshold   - IntersectionObserver threshold (0-1)
 * @param {string} options.rootMargin  - Observer root margin
 * @param {boolean} options.once       - Only trigger once
 */
export function useScrollReveal({
  threshold = 0.15,
  rootMargin = "0px 0px -60px 0px",
  once = true,
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, isVisible];
}

/**
 * useParallax — Scroll-linked parallax transform for an element
 * @param {number} speed - Parallax speed factor (0.1 = slow, 1 = match scroll)
 */
export function useParallax(speed = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const windowH = window.innerHeight;
          // How far into viewport (0 = just entered bottom, 1 = at top)
          const progress = 1 - rect.top / windowH;
          const offset = progress * speed * 100;
          el.style.transform = `translateY(${-offset}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return ref;
}

/**
 * useCountUp — Animates a number from 0 to target when visible
 * @param {number} target  - Target number
 * @param {number} duration - Animation duration in ms
 */
export function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const numericTarget = parseInt(target, 10);
    if (isNaN(numericTarget)) {
      setCount(target);
      return;
    }

    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numericTarget));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [hasStarted, target, duration]);

  return [ref, count];
}

/**
 * useScrollProgress — Returns a 0-1 value of how far an element has scrolled through viewport
 */
export function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const windowH = window.innerHeight;
          const elH = rect.height;
          // 0 when element bottom is at viewport bottom, 1 when element top is at viewport top
          const rawProgress = (windowH - rect.top) / (windowH + elH);
          setProgress(Math.max(0, Math.min(1, rawProgress)));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return [ref, progress];
}

/**
 * useStickyReveal — For pinned/sticky scroll sections where content changes as you scroll
 * @param {number} itemCount - Number of items to reveal
 */
export function useStickyReveal(itemCount) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const scrollableHeight = rect.height - window.innerHeight;
          const scrolledInto = -rect.top;
          const progress = Math.max(0, Math.min(1, scrolledInto / scrollableHeight));
          const index = Math.min(
            itemCount - 1,
            Math.floor(progress * itemCount)
          );
          setActiveIndex(index);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [itemCount]);

  return [containerRef, activeIndex];
}

/**
 * useTextReveal — Splits text and reveals word by word on scroll
 */
export function useTextReveal() {
  const ref = useRef(null);
  const [visibleWords, setVisibleWords] = useState(0);
  const [totalWords, setTotalWords] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll(".reveal-word");
    setTotalWords(words.length);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const windowH = window.innerHeight;
          const elH = rect.height;
          const scrolledInto = windowH - rect.top;
          const totalTravel = windowH * 0.5 + elH;
          const progress = Math.max(0, Math.min(1, scrolledInto / totalTravel));
          const count = Math.round(progress * words.length);
          setVisibleWords(count);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return [ref, visibleWords, totalWords];
}
