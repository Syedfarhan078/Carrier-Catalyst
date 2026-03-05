import React from 'react';

const WarningModal = ({ warning, onDismiss, violationCount, maxViolations }) => {
  if (!warning) return null;

  const isTerminating = violationCount >= maxViolations;
  const remaining = maxViolations - violationCount;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a0a0a 0%, #0f0f1e 100%)',
        border: `2px solid ${isTerminating ? '#ff4d6d' : '#f59e0b'}`,
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '460px',
        width: '90%',
        boxShadow: `0 0 60px ${isTerminating ? 'rgba(255,77,109,0.3)' : 'rgba(245,158,11,0.2)'}`,
        textAlign: 'center',
        animation: 'scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        {/* Icon */}
        <div style={{
          fontSize: '56px',
          marginBottom: '20px',
          animation: isTerminating ? 'none' : 'pulse 1s infinite'
        }}>
          {isTerminating ? '🚫' : '⚠️'}
        </div>

        {/* Title */}
        <h2 style={{
          margin: '0 0 12px',
          fontSize: '22px',
          fontWeight: '800',
          color: isTerminating ? '#ff4d6d' : '#f59e0b',
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '-0.02em'
        }}>
          {isTerminating ? 'Test Terminated' : 'Malpractice Warning'}
        </h2>

        {/* Message */}
        <p style={{
          color: 'rgba(255,255,255,0.75)',
          fontSize: '15px',
          lineHeight: '1.6',
          marginBottom: '24px',
          fontFamily: "'Outfit', sans-serif"
        }}>
          {warning}
        </p>

        {/* Violation Counter */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '24px'
        }}>
          {Array.from({ length: maxViolations }).map((_, i) => (
            <div key={i} style={{
              width: '36px',
              height: '8px',
              borderRadius: '4px',
              background: i < violationCount ? '#ff4d6d' : 'rgba(255,255,255,0.15)',
              transition: 'background 0.3s ease',
              boxShadow: i < violationCount ? '0 0 8px rgba(255,77,109,0.6)' : 'none'
            }}/>
          ))}
        </div>

        {/* Violation count text */}
        <p style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: "'Space Mono', monospace",
          marginBottom: '28px'
        }}>
          {isTerminating
            ? 'Maximum violations exceeded. Your test has been automatically submitted.'
            : `Violation ${violationCount}/${maxViolations} — ${remaining} more will terminate the test.`
          }
        </p>

        {!isTerminating && (
          <button
            onClick={onDismiss}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              border: 'none',
              padding: '14px 36px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.02em',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 20px rgba(245,158,11,0.3)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(245,158,11,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(245,158,11,0.3)';
            }}
          >
            I Understand — Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default WarningModal;