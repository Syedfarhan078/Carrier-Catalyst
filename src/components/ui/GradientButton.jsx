import React from "react";

/**
 * GradientButton
 * Props:
 *  - variant: "primary" | "ghost" | "orange"
 *  - onClick: function
 *  - children: React node
 *  - className: extra class names
 */
const GradientButton = ({ variant = "primary", onClick, children, className = "" }) => {
  const variantClass = {
    primary: "btn-primary",
    ghost: "btn-secondary",
    orange: "btn-orange",
  }[variant] || "btn-primary";

  return (
    <button
      className={`cc-btn ${variantClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default GradientButton;