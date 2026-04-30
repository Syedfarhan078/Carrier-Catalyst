import React, { useEffect, useState } from "react";

/**
 * ScrollProgressBar — Fixed top bar showing page scroll progress
 * Gradient bar that fills left-to-right as user scrolls.
 */
const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="scroll-progress-bar"
      style={{ transform: `scaleX(${progress})`, opacity: progress > 0.01 ? 1 : 0 }}
    />
  );
};

export default ScrollProgressBar;
