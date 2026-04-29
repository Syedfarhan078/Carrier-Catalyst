import React, { useRef, useState, useCallback } from "react";

/**
 * Rotating3DCard.jsx — Premium CSS-only 3D card effect
 * - No WebGL/Three.js overhead — uses CSS transforms for silky smooth 3D tilt
 * - Animated gradient border + glare shine on hover
 * - Spring-like easing for premium feel
 * - Zero GPU context creation (was the #1 performance bottleneck)
 */

const Rotating3DCard = ({ children, delay = 0 }) => {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) return; // throttle to one update per frame

    rafRef.current = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) { rafRef.current = null; return; }

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Tilt: max ±12 degrees
      const tiltX = (y - 0.5) * -12;
      const tiltY = (x - 0.5) * 12;

      setTilt({ x: tiltX, y: tiltY });
      setGlarePos({ x: x * 100, y: y * 100 });
      rafRef.current = null;
    });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlarePos({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "800px",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: "18px",
          overflow: "hidden",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
          transition: isHovered
            ? "transform 0.1s ease-out"
            : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Animated gradient border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "18px",
            padding: "1px",
            background: isHovered
              ? "linear-gradient(135deg, rgba(99,102,241,0.6), rgba(139,92,246,0.4), rgba(99,102,241,0.6))"
              : "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            transition: "background 0.4s ease, opacity 0.4s ease",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Glare/shine overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "18px",
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        {/* Ambient glow underneath */}
        <div
          style={{
            position: "absolute",
            inset: "-2px",
            borderRadius: "20px",
            background: "radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.4s ease",
            filter: "blur(20px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Rotating3DCard;
