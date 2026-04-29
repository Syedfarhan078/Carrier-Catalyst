import React from 'react';

/**
 * LoadingSpinner — Premium loading indicator
 * Uses CSS class from global.css instead of injecting style tags
 */
export default function LoadingSpinner() {
  return (
    <div style={s.container}>
      <div style={s.spinnerOuter}>
        <div style={s.spinner} className="cc-spin" />
        <div style={s.spinnerInner} className="cc-spin-reverse" />
      </div>
      <p style={s.text}>Loading...</p>
    </div>
  );
}

const s = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#0f0f1a',
  },
  spinnerOuter: {
    position: 'relative',
    width: '50px',
    height: '50px',
  },
  spinner: {
    position: 'absolute',
    inset: 0,
    border: '3px solid rgba(99,102,241,0.1)',
    borderTop: '3px solid #6366f1',
    borderRadius: '50%',
  },
  spinnerInner: {
    position: 'absolute',
    inset: '6px',
    border: '2px solid rgba(139,92,246,0.1)',
    borderBottom: '2px solid #8b5cf6',
    borderRadius: '50%',
  },
  text: {
    marginTop: '20px',
    color: '#6366f1',
    fontSize: '13px',
    fontFamily: "'DM Sans', 'Inter', 'Segoe UI', system-ui, sans-serif",
    letterSpacing: '0.05em',
    opacity: 0.7,
  },
};
