import React from "react";
import { useScrollReveal } from "../../hooks/useScrollAnimations";

/**
 * ScrollReveal — Wraps children with Apple-style scroll-triggered reveal
 * @param {string} direction - "up" | "left" | "right" | "scale"
 * @param {number} delay - Stagger delay class (1-5)
 * @param {string} className - Extra classes
 */
const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  className = "",
  threshold = 0.15,
  as: Tag = "div",
  style,
  ...rest
}) => {
  const [ref, isVisible] = useScrollReveal({ threshold });

  const dirClass = {
    up: "scroll-reveal",
    left: "scroll-reveal-left",
    right: "scroll-reveal-right",
    scale: "scroll-reveal-scale",
  }[direction] || "scroll-reveal";

  const delayClass = delay > 0 ? `delay-${delay}` : "";

  return (
    <Tag
      ref={ref}
      className={`${dirClass} ${delayClass} ${isVisible ? "is-visible" : ""} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default ScrollReveal;
