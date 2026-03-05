import React from 'react';

const ResultsPage = ({ answers, questions, violationCount, timeUsed, onRetry }) => {
  const score = questions.reduce((acc, q) => {
    return acc + (answers[q.id] === q.answer ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 60;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const topicBreakdown = {};
  questions.forEach(q => {
    if (!topicBreakdown[q.topic]) topicBreakdown[q.topic] = { correct: 0, total: 0 };
    topicBreakdown[q.topic].total++;
    if (answers[q.id] === q.answer) topicBreakdown[q.topic].correct++;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a14 0%, #0f0f1e 50%, #0a0a14 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <div style={{ maxWidth: '680px', width: '100%', animation: 'fadeSlideIn 0.5s ease' }}>
        {/* Result Header */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: `2px solid ${passed ? 'rgba(0,212,170,0.4)' : 'rgba(255,77,109,0.4)'}`,
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          marginBottom: '20px',
          boxShadow: `0 0 60px ${passed ? 'rgba(0,212,170,0.1)' : 'rgba(255,77,109,0.1)'}`
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>
            {passed ? '🎉' : '📚'}
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: passed ? '#00d4aa' : '#ff4d6d',
            margin: '0 0 8px',
            letterSpacing: '-0.02em'
          }}>
            {passed ? 'Assessment Passed!' : 'Keep Practicing!'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 28px', fontSize: '15px' }}>
            Full Stack Developer Assessment — Results
          </p>

          {/* Big Score */}
          <div style={{
            display: 'inline-block',
            background: `${passed ? 'rgba(0,212,170,0.1)' : 'rgba(255,77,109,0.1)'}`,
            border: `1px solid ${passed ? 'rgba(0,212,170,0.3)' : 'rgba(255,77,109,0.3)'}`,
            borderRadius: '16px',
            padding: '20px 48px',
            marginBottom: '28px'
          }}>
            <span style={{
              fontSize: '56px',
              fontWeight: '900',
              color: passed ? '#00d4aa' : '#ff4d6d',
              fontFamily: "'Space Mono', monospace"
            }}>
              {percentage}%
            </span>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontFamily: "'Space Mono', monospace" }}>
              {score} / {questions.length} correct
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { label: 'Time Used', value: formatTime(timeUsed) },
              { label: 'Violations', value: violationCount, danger: violationCount > 0 },
              { label: 'Questions', value: questions.length }
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '10px',
                padding: '12px 20px',
                border: '1px solid rgba(255,255,255,0.08)',
                minWidth: '100px'
              }}>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: stat.danger ? '#f59e0b' : '#f1f5f9',
                  fontFamily: "'Space Mono', monospace"
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Mono', monospace" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Breakdown */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 16px', fontSize: '14px', fontFamily: "'Space Mono', monospace", letterSpacing: '0.08em' }}>
            TOPIC BREAKDOWN
          </h3>
          {Object.entries(topicBreakdown).map(([topic, data]) => {
            const pct = Math.round((data.correct / data.total) * 100);
            return (
              <div key={topic} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: "'Outfit', sans-serif" }}>{topic}</span>
                  <span style={{ fontSize: '13px', color: pct >= 60 ? '#00d4aa' : '#ff4d6d', fontFamily: "'Space Mono', monospace" }}>
                    {data.correct}/{data.total}
                  </span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: pct >= 60 ? 'linear-gradient(90deg, #00d4aa, #00b896)' : 'linear-gradient(90deg, #ff4d6d, #e03355)',
                    borderRadius: '4px',
                    transition: 'width 1s ease'
                  }}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* Question Review */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          maxHeight: '320px',
          overflowY: 'auto'
        }}>
          <h3 style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 16px', fontSize: '14px', fontFamily: "'Space Mono', monospace", letterSpacing: '0.08em' }}>
            ANSWER REVIEW
          </h3>
          {questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.answer;
            return (
              <div key={q.id} style={{
                padding: '12px',
                borderRadius: '8px',
                background: isCorrect ? 'rgba(0,212,170,0.05)' : 'rgba(255,77,109,0.05)',
                border: `1px solid ${isCorrect ? 'rgba(0,212,170,0.15)' : 'rgba(255,77,109,0.15)'}`,
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '14px', minWidth: '20px' }}>{isCorrect ? '✓' : '✗'}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                      Q{i+1}. {q.question}
                    </p>
                    {!isCorrect && (
                      <p style={{ margin: 0, fontSize: '12px', color: '#00d4aa', fontFamily: "'Space Mono', monospace" }}>
                        ✓ {q.answer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onRetry}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#fff',
              border: 'none',
              padding: '14px 36px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
              boxShadow: '0 4px 20px rgba(99,102,241,0.3)'
            }}
          >
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;