import React from "react";
import { useTextReveal } from "../../hooks/useScrollAnimations";

/**
 * TextReveal — Apple-style word-by-word text reveal on scroll
 * Words fade from dim to bright as you scroll through.
 */
const TextReveal = ({ text, className = "" }) => {
  const [ref, visibleWords] = useTextReveal();
  const words = text.split(" ");

  return (
    <div ref={ref} className={`text-reveal-container ${className}`}>
      <p className="text-reveal-heading">
        {words.map((word, i) => (
          <span
            key={i}
            className={`reveal-word ${i < visibleWords ? "is-revealed" : ""}`}
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
};

export default TextReveal;
