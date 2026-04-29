import React from 'react';

export default function LoadingSpinner() {
  return (
    <div style={s.container}>
      <div style={s.spinner}></div>
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
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #1e1e3a',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  text: {
    marginTop: '20px',
    color: '#666',
    fontSize: '14px',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

// Add CSS animation to document head for the spinner
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
