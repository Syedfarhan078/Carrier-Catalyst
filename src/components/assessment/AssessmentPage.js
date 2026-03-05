import React, { useState, useEffect, useCallback, useRef } from 'react';
import Timer from './Timer';
import QuestionCard from './QuestionCard';
import ProctoringCamera from './ProctoringCamera';
import WarningModal from './WarningModal';
import ResultsPage from './ResultsPage';
import { questions, assessmentConfig } from '../../data/assessmentQuestions';
import { useNavigate } from "react-router-dom";

const MAX_VIOLATIONS = 3;

// ─── Pre-Assessment Lobby ───────────────────────────────────────────────────
const AssessmentLobby = ({ onStart }) => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a14 0%, #0f0f1e 50%, #0a0a14 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    fontFamily: "'Outfit', sans-serif"
  }}>
    <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
      {/* Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(99,102,241,0.12)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '20px',
        padding: '6px 16px',
        marginBottom: '28px'
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: 'pulse 2s infinite' }}/>
        <span style={{ fontSize: '12px', color: '#818cf8', fontFamily: "'Space Mono', monospace", letterSpacing: '0.06em' }}>
          CARRER CATALYST ASSESSMENT PORTAL
        </span>
      </div>

      <h1 style={{
        fontSize: '40px',
        fontWeight: '900',
        color: '#f1f5f9',
        margin: '0 0 12px',
        letterSpacing: '-0.03em',
        lineHeight: '1.1'
      }}>
        Full Stack Developer<br/>
        <span style={{ color: '#6366f1' }}>Assessment</span>
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', marginBottom: '40px' }}>
        AI-proctored exam • {questions.length} questions • 30 minutes
      </p>

      {/* Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '32px', textAlign: 'left' }}>
        {[
          { icon: '🧠', title: 'AI Proctoring', desc: 'Face detection and object recognition monitors your session throughout the test.' },
          { icon: '📸', title: 'Camera Required', desc: 'Your webcam will be active during the exam. Ensure good lighting and a clean background.' },
          { icon: '🚨', title: 'Malpractice Policy', desc: 'More than 3 violations will auto-terminate the test. No tab switching allowed.' },
          { icon: '⏱️', title: '30 Minute Limit', desc: 'The test auto-submits when time runs out. Answer all questions before time expires.' },
        ].map((item, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '18px'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
            <div style={{ fontWeight: '600', color: '#f1f5f9', fontSize: '14px', marginBottom: '4px' }}>{item.title}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', lineHeight: '1.5' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: '#fff',
          border: 'none',
          padding: '16px 56px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer',
          fontFamily: "'Outfit', sans-serif",
          boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.5)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.35)';
        }}
      >
        Start Assessment →
      </button>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '16px' }}>
        By starting, you agree to the proctoring terms and conditions
      </p>
    </div>
  </div>
);

// ─── Main Assessment Page ───────────────────────────────────────────────────
const AssessmentPage = () => {
  const [phase, setPhase] = useState('LOBBY'); // LOBBY | EXAM | RESULTS
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(assessmentConfig.duration);
  const [timeUsed, setTimeUsed] = useState(0);

  // Proctoring state
  const [violationCount, setViolationCount] = useState(0);
  const [activeWarning, setActiveWarning] = useState(null);
  const [isTerminated, setIsTerminated] = useState(false);
  const [violationLog, setViolationLog] = useState([]);

  // Cooldown to avoid spam-warnings from same violation type
  const lastViolationTime = useRef({});
  const VIOLATION_COOLDOWN = 6000; // 6 seconds

  const startTimeRef = useRef(null);

  // ── Tab Visibility Detection ───────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'EXAM') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('TAB_SWITCH', '🔄 Tab switching detected! Stay on the exam page.');
      }
    };

    const handleBlur = () => {
      triggerViolation('WINDOW_BLUR', '🪟 Window focus lost — do not minimize or switch windows.');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [phase]);

  // ── Violation Handler ──────────────────────────────────────────────────────
  const triggerViolation = useCallback((type, message) => {
    const now = Date.now();
    // Enforce per-type cooldown to prevent repeated alerts
    if (lastViolationTime.current[type] && now - lastViolationTime.current[type] < VIOLATION_COOLDOWN) {
      return;
    }
    lastViolationTime.current[type] = now;

    setViolationCount(prev => {
      const newCount = prev + 1;

      setViolationLog(log => [...log, {
        type,
        message,
        count: newCount,
        timestamp: new Date().toLocaleTimeString()
      }]);

      setActiveWarning(message);

      if (newCount >= MAX_VIOLATIONS) {
        setIsTerminated(true);
        // Auto-submit after brief delay
        setTimeout(() => submitAssessment(), 2500);
      }

      return newCount;
    });
  }, []);

  // ── AI Proctoring Callback ─────────────────────────────────────────────────
  const handleProctoringViolation = useCallback((violationType, message) => {
    if (phase !== 'EXAM' || isTerminated) return;
    triggerViolation(violationType, message);
  }, [phase, isTerminated, triggerViolation]);

  // ── Submit Assessment ──────────────────────────────────────────────────────
  const submitAssessment = useCallback(() => {
    const used = assessmentConfig.duration - timeLeft;
    setTimeUsed(used);
    setPhase('RESULTS');
  }, [timeLeft]);

  // ── Timer Up Handler ──────────────────────────────────────────────────────
  const handleTimeUp = useCallback(() => {
    submitAssessment();
  }, [submitAssessment]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  const handleAnswerSelect = (answer) => {
    setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: answer }));
  };

  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[currentIndex];

  // ── Render ─────────────────────────────────────────────────────────────────
  if (phase === 'LOBBY') {
    return (
      <>
        <GlobalStyles />
        <AssessmentLobby onStart={() => {
          startTimeRef.current = Date.now();
          setPhase('EXAM');
        }} />
      </>
    );
  }

  if (phase === 'RESULTS') {
    return (
      <>
        <GlobalStyles />
        <ResultsPage
          answers={answers}
          questions={questions}
          violationCount={violationCount}
          timeUsed={timeUsed}
          onRetry={() => {
            setPhase('LOBBY');
            setCurrentIndex(0);
            setAnswers({});
            setTimeLeft(assessmentConfig.duration);
            setViolationCount(0);
            setActiveWarning(null);
            setIsTerminated(false);
            setViolationLog([]);
            lastViolationTime.current = {};
          }}
        />
      </>
    );
  }

  // ── EXAM Phase ─────────────────────────────────────────────────────────────
  return (
    <>
      <GlobalStyles />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a14 0%, #0f0f1e 100%)',
        color: '#f1f5f9',
        fontFamily: "'Outfit', sans-serif",
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* ── Top Bar ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 28px',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Logo / Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px'
            }}>⚡</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#f1f5f9' }}>SkillPath Assessment</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Mono', monospace" }}>
                Full Stack Developer
              </div>
            </div>
          </div>

          {/* Timer */}
          <Timer
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            onTimeUp={handleTimeUp}
            isActive={phase === 'EXAM' && !isTerminated}
          />

          {/* Violation Badge + Submit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Violation Counter */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: violationCount > 0 ? 'rgba(255,77,109,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${violationCount > 0 ? 'rgba(255,77,109,0.35)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '10px',
              padding: '6px 14px'
            }}>
              <span style={{ fontSize: '14px' }}>🚨</span>
              <span style={{
                fontSize: '12px',
                color: violationCount > 0 ? '#ff4d6d' : 'rgba(255,255,255,0.4)',
                fontFamily: "'Space Mono', monospace",
                fontWeight: '600'
              }}>
                {violationCount}/{MAX_VIOLATIONS} Warnings
              </span>
            </div>

            {/* Answered counter */}
            <div style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: "'Space Mono', monospace'",
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '6px 14px'
            }}>
              {answeredCount}/{questions.length} answered
            </div>

            {/* Submit button */}
            <button
              onClick={submitAssessment}
              style={{
                background: 'linear-gradient(135deg, #00d4aa, #00b896)',
                color: '#000',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif",
                boxShadow: '0 4px 14px rgba(0,212,170,0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '24px',
          padding: '28px',
          flex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box'
        }}>

          {/* Left: Question Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Question Card */}
            <div style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '16px',
              padding: '32px',
              flex: 1
            }}>
              <QuestionCard
                question={currentQuestion}
                questionIndex={currentIndex}
                totalQuestions={questions.length}
                selectedAnswer={answers[currentQuestion.id]}
                onAnswerSelect={handleAnswerSelect}
              />
            </div>

            {/* Navigation */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px'
            }}>
              <button
                onClick={() => goToQuestion(currentIndex - 1)}
                disabled={currentIndex === 0}
                style={{
                  background: currentIndex === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.15)',
                  color: currentIndex === 0 ? 'rgba(255,255,255,0.25)' : '#818cf8',
                  border: `1px solid ${currentIndex === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.35)'}`,
                  padding: '12px 28px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  fontFamily: "'Outfit', sans-serif",
                  transition: 'all 0.2s'
                }}
              >
                ← Previous
              </button>

              {/* Question number dots */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
                {questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => goToQuestion(i)}
                    title={`Q${i+1}${answers[q.id] ? ' ✓' : ''}`}
                    style={{
                      width: '28px', height: '28px',
                      borderRadius: '6px',
                      background: i === currentIndex
                        ? '#6366f1'
                        : answers[q.id]
                          ? 'rgba(0,212,170,0.25)'
                          : 'rgba(255,255,255,0.06)',
                      border: i === currentIndex
                        ? '1.5px solid #818cf8'
                        : answers[q.id]
                          ? '1.5px solid rgba(0,212,170,0.5)'
                          : '1.5px solid rgba(255,255,255,0.1)',
                      color: i === currentIndex ? '#fff' : answers[q.id] ? '#00d4aa' : 'rgba(255,255,255,0.35)',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontFamily: "'Space Mono', monospace",
                      transition: 'all 0.15s',
                      padding: 0
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToQuestion(currentIndex + 1)}
                disabled={currentIndex === questions.length - 1}
                style={{
                  background: currentIndex === questions.length - 1 ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.15)',
                  color: currentIndex === questions.length - 1 ? 'rgba(255,255,255,0.25)' : '#818cf8',
                  border: `1px solid ${currentIndex === questions.length - 1 ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.35)'}`,
                  padding: '12px 28px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: currentIndex === questions.length - 1 ? 'not-allowed' : 'pointer',
                  fontFamily: "'Outfit', sans-serif",
                  transition: 'all 0.2s'
                }}
              >
                Next →
              </button>
            </div>
          </div>

          {/* Right: Proctoring Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ProctoringCamera
              onViolation={handleProctoringViolation}
              isActive={phase === 'EXAM'}
            />

            {/* Violation Log */}
            {violationLog.length > 0 && (
              <div style={{
                background: 'rgba(255,77,109,0.05)',
                border: '1px solid rgba(255,77,109,0.2)',
                borderRadius: '12px',
                padding: '14px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,77,109,0.7)', fontFamily: "'Space Mono', monospace", marginBottom: '10px', letterSpacing: '0.06em' }}>
                  VIOLATION LOG
                </div>
                {violationLog.map((v, i) => (
                  <div key={i} style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.45)',
                    fontFamily: "'Space Mono', monospace",
                    padding: '4px 0',
                    borderBottom: i < violationLog.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                  }}>
                    <span style={{ color: '#ff4d6d' }}>[{v.timestamp}]</span> {v.type}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      <WarningModal
        warning={activeWarning}
        onDismiss={() => setActiveWarning(null)}
        violationCount={violationCount}
        maxViolations={MAX_VIOLATIONS}
      />
    </>
  );
};

// ─── Global Styles ──────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 10px; }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.88); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `}</style>
);

export default AssessmentPage;