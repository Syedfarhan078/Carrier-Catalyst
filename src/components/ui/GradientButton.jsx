import { motion } from "framer-motion";

/**
 * GradientButton
 * Props:
 *  - variant: "primary" | "ghost" | "orange"
 *  - onClick: function
 *  - children: React node
 *  - className: extra class names
 */
const GradientButton = ({ variant = "primary", onClick, children, className = "", style = {} }) => {
  const variantClass = {
    primary: "btn-primary",
    ghost: "btn-secondary",
    orange: "btn-orange",
  }[variant] || "btn-primary";

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`cc-btn ${variantClass} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </motion.button>
  );
};

export default GradientButton;