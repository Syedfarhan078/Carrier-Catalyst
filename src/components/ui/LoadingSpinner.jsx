import React from 'react';

/**
 * LoadingSpinner — Upgraded to a Premium Skeleton Screen
 * Replaces the old spinner with a pulsing wireframe layout.
 */
export default function LoadingSpinner({ type = 'page' }) {
  // We can render different skeletons based on context, but 'page' is default for lazy routes
  return (
    <div style={s.container}>
      {/* Sidebar Skeleton */}
      <div className="skeleton-sidebar" style={s.sidebar}>
        <div style={{ ...s.pulseBox, height: '40px', width: '70%', marginBottom: '40px', borderRadius: '8px' }} className="cc-skeleton-pulse" />
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{ ...s.pulseBox, height: '24px', width: '100%', marginBottom: '16px', borderRadius: '6px' }} className="cc-skeleton-pulse" />
        ))}
        <div style={{ ...s.pulseBox, height: '24px', width: '60%', marginTop: 'auto', borderRadius: '6px' }} className="cc-skeleton-pulse" />
      </div>

      {/* Main Content Skeleton */}
      <div style={s.main}>
        {/* Header Skeleton */}
        <div style={s.header}>
          <div style={{ ...s.pulseBox, height: '30px', width: '200px', borderRadius: '8px' }} className="cc-skeleton-pulse" />
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ ...s.pulseBox, height: '40px', width: '40px', borderRadius: '50%' }} className="cc-skeleton-pulse" />
            <div style={{ ...s.pulseBox, height: '40px', width: '100px', borderRadius: '8px' }} className="cc-skeleton-pulse" />
          </div>
        </div>

        {/* Hero / Top Section Skeleton */}
        <div style={{ ...s.pulseBox, height: '200px', width: '100%', borderRadius: '16px', marginBottom: '32px' }} className="cc-skeleton-pulse" />

        {/* Grid / Cards Skeleton */}
        <div style={s.grid}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={s.card}>
              <div style={{ ...s.pulseBox, height: '60px', width: '60px', borderRadius: '12px', marginBottom: '24px' }} className="cc-skeleton-pulse" />
              <div style={{ ...s.pulseBox, height: '28px', width: '80%', borderRadius: '6px', marginBottom: '16px' }} className="cc-skeleton-pulse" />
              <div style={{ ...s.pulseBox, height: '16px', width: '100%', borderRadius: '4px', marginBottom: '8px' }} className="cc-skeleton-pulse" />
              <div style={{ ...s.pulseBox, height: '16px', width: '90%', borderRadius: '4px', marginBottom: '24px' }} className="cc-skeleton-pulse" />
              <div style={{ ...s.pulseBox, height: '36px', width: '50%', borderRadius: '8px', marginTop: 'auto' }} className="cc-skeleton-pulse" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Global Animation Styles */}
      <style>{`
        @keyframes skeletonPulse {
          0% { opacity: 1; background-color: rgba(255, 255, 255, 0.03); }
          50% { opacity: 0.6; background-color: rgba(255, 255, 255, 0.06); }
          100% { opacity: 1; background-color: rgba(255, 255, 255, 0.03); }
        }
        .cc-skeleton-pulse {
          animation: skeletonPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @media (max-width: 1024px) {
          .skeleton-sidebar {
            width: 240px !important;
          }
        }
        
        @media (max-width: 768px) {
          .skeleton-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

const s = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0a0a14', /* Matches --bg-primary */
    width: '100%',
    overflow: 'hidden',
  },
  sidebar: {
    width: '280px',
    background: 'linear-gradient(180deg, #0a0a14 0%, #0f0f1a 100%)',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '0 32px 32px 32px',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 0',
    marginBottom: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '300px',
  },
  pulseBox: {
    background: 'rgba(255, 255, 255, 0.03)',
  }
};
