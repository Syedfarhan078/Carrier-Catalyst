import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { startFaceMonitoring } from '../../ai/faceDetection';
import { startObjectMonitoring } from '../../ai/objectDetection';

const ProctoringCamera = ({ onViolation, isActive }) => {
  const webcamRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState('INITIALIZING');
  const [faceStatus, setFaceStatus] = useState('LOADING');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelLoadError, setModelLoadError] = useState(null);
  const stopFaceMonRef = useRef(null);
  const stopObjectMonRef = useRef(null);

  const handleFaceStatus = useCallback((status, faceCount) => {
    setFaceStatus(status);
    if (status === 'NO_FACE') {
      onViolation('NO_FACE', '⚠️ Face not detected — please stay in frame!');
    } else if (status === 'MULTIPLE_FACES') {
      onViolation('MULTIPLE_FACES', `🚨 ${faceCount} faces detected — only candidate allowed!`);
    } else if (status === 'LOOKING_AWAY') {
      onViolation('LOOKING_AWAY', '👀 You appear to be looking away from screen.');
    }
  }, [onViolation]);

  const handleObjectDetection = useCallback(({ hasPhone, suspiciousItems }) => {
    if (hasPhone) {
      onViolation('PHONE_DETECTED', '📱 Mobile phone detected in frame!');
    } else if (suspiciousItems && suspiciousItems.length > 0) {
      const items = suspiciousItems.map(i => i.class).join(', ');
      onViolation('SUSPICIOUS_OBJECT', `📖 Suspicious item detected: ${items}`);
    }
  }, [onViolation]);

  // Start AI monitoring once webcam is ready
  const handleCameraReady = useCallback(async () => {
    setCameraStatus('ACTIVE');
    setFaceStatus('DETECTING');

    if (!webcamRef.current?.video) return;
    const video = webcamRef.current.video;

    // Small delay for video stream to stabilize
    await new Promise(r => setTimeout(r, 1500));

    try {
      // Start face monitoring
      stopFaceMonRef.current = startFaceMonitoring(video, handleFaceStatus, 1500);

      // Start object monitoring (less frequent to save CPU)
      stopObjectMonRef.current = startObjectMonitoring(video, handleObjectDetection, 4000);

      setModelsLoaded(true);
    } catch (err) {
      console.error('[ProctoringCamera] AI model error:', err);
      setModelLoadError('AI models failed to load. Proctoring limited.');
      setModelsLoaded(false);
    }
  }, [handleFaceStatus, handleObjectDetection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stopFaceMonRef.current) stopFaceMonRef.current();
      if (stopObjectMonRef.current) stopObjectMonRef.current();
    };
  }, []);

  const statusConfig = {
    'OK': { color: '#00d4aa', icon: '●', label: 'Face Detected' },
    'NO_FACE': { color: '#ff4d6d', icon: '●', label: 'No Face Detected' },
    'MULTIPLE_FACES': { color: '#ff4d6d', icon: '●', label: 'Multiple Faces!' },
    'LOOKING_AWAY': { color: '#f59e0b', icon: '●', label: 'Looking Away' },
    'DETECTING': { color: '#6366f1', icon: '◌', label: 'Analyzing...' },
    'LOADING': { color: '#6366f1', icon: '◌', label: 'Loading AI...' },
    'ERROR': { color: '#ff4d6d', icon: '●', label: 'Detection Error' },
  };

  const current = statusConfig[faceStatus] || statusConfig['LOADING'];

  return (
    <div style={{
      background: 'rgba(15,15,25,0.95)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '16px',
      overflow: 'hidden',
      width: '100%'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: cameraStatus === 'ACTIVE' ? '#00d4aa' : '#f59e0b',
            boxShadow: cameraStatus === 'ACTIVE' ? '0 0 6px #00d4aa' : '0 0 6px #f59e0b',
            display: 'inline-block',
            animation: cameraStatus === 'ACTIVE' ? 'pulse 2s infinite' : 'none'
          }}/>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: 'rgba(255,255,255,0.7)',
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            AI Proctoring Active
          </span>
        </div>
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono', monospace" }}>
          LIVE
        </span>
      </div>

      {/* Webcam Feed */}
      <div style={{ position: 'relative', background: '#000', aspectRatio: '4/3' }}>
        {isActive && (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 280, height: 210, facingMode: 'user' }}
            onUserMedia={handleCameraReady}
            onUserMediaError={() => {
              setCameraStatus('ERROR');
              setFaceStatus('ERROR');
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)' // Mirror effect
            }}
          />
        )}

        {/* Face Status Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          right: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          padding: '6px 10px'
        }}>
          <span style={{
            color: current.color,
            fontSize: '12px',
            animation: faceStatus === 'NO_FACE' || faceStatus === 'MULTIPLE_FACES' ? 'pulse 0.8s infinite' : 'none'
          }}>
            {current.icon}
          </span>
          <span style={{
            color: current.color,
            fontSize: '11px',
            fontFamily: "'Space Mono', monospace",
            fontWeight: '600'
          }}>
            {current.label}
          </span>
          {modelsLoaded && (
            <span style={{
              marginLeft: 'auto',
              fontSize: '9px',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: "'Space Mono', monospace"
            }}>
              TF.js ✓
            </span>
          )}
        </div>

        {/* Recording indicator */}
        {cameraStatus === 'ACTIVE' && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(0,0,0,0.6)',
            borderRadius: '6px',
            padding: '4px 8px'
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#ff4d6d',
              animation: 'pulse 1s infinite'
            }}/>
            <span style={{ fontSize: '9px', color: '#ff4d6d', fontFamily: "'Space Mono', monospace" }}>REC</span>
          </div>
        )}
      </div>

      {/* Detection Info */}
      {modelLoadError && (
        <div style={{
          padding: '8px 14px',
          background: 'rgba(255,77,109,0.1)',
          borderTop: '1px solid rgba(255,77,109,0.2)',
          fontSize: '10px',
          color: 'rgba(255,100,120,0.8)',
          fontFamily: "'Space Mono', monospace"
        }}>
          ⚠ {modelLoadError}
        </div>
      )}

      {/* Monitoring Info */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono', monospace", marginBottom: '8px' }}>
          MONITORING
        </div>
        {[
          { label: 'Face Detection', active: modelsLoaded, icon: '👤' },
          { label: 'Phone Detection', active: modelsLoaded, icon: '📱' },
          { label: 'Multi-Person', active: modelsLoaded, icon: '👥' },
          { label: 'Tab Switching', active: true, icon: '🔄' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '3px 0',
          }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontFamily: "'Outfit', sans-serif" }}>
              {item.icon} {item.label}
            </span>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: item.active ? '#00d4aa' : '#555',
              display: 'inline-block'
            }}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProctoringCamera;