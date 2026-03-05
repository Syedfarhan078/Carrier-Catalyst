import React from 'react';

const QuestionCard = ({ question, questionIndex, totalQuestions, selectedAnswer, onAnswerSelect }) => {
  const difficultyColor = {
    'Easy': '#00d4aa',
    'Medium': '#f59e0b',
    'Hard': '#ff4d6d'
  };

  return (
    <div style={{ animation: 'fadeSlideIn 0.3s ease' }}>
      {/* Question Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{
            background: 'rgba(99,102,241,0.15)',
            color: '#818cf8',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontFamily: "'Space Mono', monospace",
            border: '1px solid rgba(99,102,241,0.3)'
          }}>
            Q{questionIndex + 1} / {totalQuestions}
          </span>
          <span style={{
            background: `${difficultyColor[question.difficulty]}18`,
            color: difficultyColor[question.difficulty],
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontFamily: "'Space Mono', monospace",
            border: `1px solid ${difficultyColor[question.difficulty]}40`
          }}>
            {question.difficulty}
          </span>
          <span style={{
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.4)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontFamily: "'Space Mono', monospace",
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {question.topic}
          </span>
        </div>
      </div>

      {/* Question Text */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '28px'
      }}>
        <p style={{
          fontSize: '18px',
          fontWeight: '500',
          color: '#f1f5f9',
          lineHeight: '1.6',
          margin: 0,
          fontFamily: "'Outfit', sans-serif"
        }}>
          {question.question}
        </p>
      </div>

      {/* Answer Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === option;
          const label = String.fromCharCode(65 + i); // A, B, C, D

          return (
            <button
              key={i}
              onClick={() => onAnswerSelect(option)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                padding: '16px 20px',
                background: isSelected
                  ? 'rgba(99,102,241,0.18)'
                  : 'rgba(255,255,255,0.03)',
                border: isSelected
                  ? '1.5px solid #6366f1'
                  : '1.5px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                color: isSelected ? '#a5b4fc' : 'rgba(255,255,255,0.75)',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '15px',
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }
              }}
            >
              {/* Option Label Badge */}
              <span style={{
                minWidth: '30px',
                height: '30px',
                borderRadius: '8px',
                background: isSelected ? '#6366f1' : 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '13px',
                fontFamily: "'Space Mono', monospace",
                color: isSelected ? '#fff' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.2s'
              }}>
                {label}
              </span>
              <span style={{ lineHeight: '1.5' }}>{option}</span>
              {isSelected && (
                <span style={{ marginLeft: 'auto', fontSize: '16px' }}>✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;