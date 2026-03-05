import React, { useEffect, useCallback } from 'react';

const Timer = ({ timeLeft, setTimeLeft, onTimeUp, isActive }) => {
  const tick = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        onTimeUp();
        return 0;
      }
      return prev - 1;
    });
  }, [setTimeLeft, onTimeUp]);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isActive, tick]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  const percentage = timeLeft > 0 ? (timeLeft / 1800) * 100 : 0;
  const isWarning = timeLeft <= 300 && timeLeft > 60;   // < 5 min
  const isDanger = timeLeft <= 60;                       // < 1 min

  const timerColor = isDanger ? '#ff3b3b' : isWarning ? '#f59e0b' : '#00d4aa';
  const bgColor = isDanger ? 'rgba(255,59,59,0.1)' : isWarning ? 'rgba(245,158,11,0.1)' : 'rgba(0,212,170,0.08)';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: bgColor,
      border: `1.5px solid ${timerColor}`,
      borderRadius: '10px',
      padding: '8px 18px',
      transition: 'all 0.3s ease'
    }}>
      {/* Circular progress */}
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3"/>
        <circle
          cx="18" cy="18" r="14"
          fill="none"
          stroke={timerColor}
          strokeWidth="3"
          strokeDasharray={`${2 * Math.PI * 14}`}
          strokeDashoffset={`${2 * Math.PI * 14 * (1 - percentage / 100)}`}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>

      <div>
        <div style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.45)',
          fontFamily: "'Space Mono', monospace",
          letterSpacing: '0.05em',
          marginBottom: '1px'
        }}>TIME LEFT</div>
        <div style={{
          fontSize: '22px',
          fontWeight: '700',
          fontFamily: "'Space Mono', monospace",
          color: timerColor,
          letterSpacing: '0.05em',
          animation: isDanger ? 'pulse 1s infinite' : 'none'
        }}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {isDanger && (
        <span style={{
          fontSize: '18px',
          animation: 'pulse 0.8s infinite'
        }}>⚠️</span>
      )}
    </div>
  );
};

export default Timer;