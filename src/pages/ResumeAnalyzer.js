import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  extractTextFromPDF,
  detectSkills,
  generateAssessments,
  analyzeSkillGap,
  calculateResumeScore,
} from '../utils/resumeAnalyzer';
import { careerPaths, categoryConfig } from '../data/skillsData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const groupByCategory = (skills) => {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
};

const difficultyColor = {
  Beginner:     '#10b981',
  Intermediate: '#f59e0b',
  Advanced:     '#ef4444',
  Expert:       '#8b5cf6',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreRing({ score }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? 'Strong' : score >= 40 ? 'Good' : 'Developing';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.4s' }}
        />
        <text x="65" y="60" textAnchor="middle" fill="#f8fafc" fontSize="26" fontWeight="800" fontFamily="'Syne', sans-serif">
          {score}
        </text>
        <text x="65" y="78" textAnchor="middle" fill="rgba(248,250,252,0.45)" fontSize="11" fontFamily="'JetBrains Mono', monospace">
          / 100
        </text>
      </svg>
      <span style={{
        fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em',
        textTransform: 'uppercase', color, fontFamily: "'JetBrains Mono', monospace"
      }}>
        {label}
      </span>
    </div>
  );
}

function SkillTag({ skill }) {
  const cfg = categoryConfig[skill.category] || categoryConfig['Tools'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '5px 11px',
      borderRadius: '6px',
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      color: cfg.color,
      fontSize: '12px', fontWeight: '600',
      fontFamily: "'JetBrains Mono', monospace",
      whiteSpace: 'nowrap',
    }}>
      {skill.name}
    </span>
  );
}

function SectionCard({ title, badge, badgeColor = '#06b6d4', children, style = {} }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <span style={{
          fontSize: '13px', fontWeight: '700', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'rgba(248,250,252,0.6)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {title}
        </span>
        {badge !== undefined && (
          <span style={{
            background: `${badgeColor}20`,
            border: `1px solid ${badgeColor}50`,
            color: badgeColor,
            borderRadius: '20px', padding: '2px 10px',
            fontSize: '12px', fontWeight: '700',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </div>
  );
}

function GapBar({ label, score, color, icon }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: 'rgba(248,250,252,0.75)', fontFamily: "'Syne', sans-serif", fontWeight: '600' }}>
          <span>{icon}</span>{label}
        </span>
        <span style={{ fontSize: '12px', color, fontFamily: "'JetBrains Mono', monospace", fontWeight: '700' }}>
          {score}%
        </span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
        <div style={{
          width: `${score}%`, height: '100%',
          background: `linear-gradient(90deg, ${color}90, ${color})`,
          borderRadius: '4px',
          transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  );
}

// ─── Upload Zone ─────────────────────────────────────────────────────────────

function UploadZone({ onFile, file, analyzing }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type === 'application/pdf') onFile(f);
  }, [onFile]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? '#06b6d4' : file ? '#10b981' : 'rgba(255,255,255,0.15)'}`,
        borderRadius: '16px',
        padding: '48px 32px',
        textAlign: 'center',
        cursor: file ? 'default' : 'pointer',
        background: dragging ? 'rgba(6,182,212,0.06)' : file ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.25s ease',
        position: 'relative',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
      />

      {analyzing ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #06b6d4', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: 'rgba(248,250,252,0.6)', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', margin: 0 }}>
            Extracting & analyzing…
          </p>
        </div>
      ) : file ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '40px' }}>📄</div>
          <p style={{ margin: 0, fontWeight: '700', color: '#10b981', fontFamily: "'Syne', sans-serif", fontSize: '15px' }}>
            {file.name}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(248,250,252,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>
            {(file.size / 1024).toFixed(1)} KB · PDF
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onFile(null); }}
            style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444', borderRadius: '8px', padding: '6px 14px',
              fontSize: '12px', fontWeight: '600', cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '44px', opacity: 0.6 }}>📎</div>
          <p style={{ margin: 0, fontWeight: '700', color: 'rgba(248,250,252,0.75)', fontFamily: "'Syne', sans-serif", fontSize: '16px' }}>
            Drop your resume here
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(248,250,252,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>
            or click to browse · PDF only
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ResumeAnalyzer() {
  const navigate = useNavigate();
  const [file, setFile]                   = useState(null);
  const [analyzing, setAnalyzing]         = useState(false);
  const [error, setError]                 = useState('');
  const [resumeText, setResumeText]       = useState('');
  const [detectedSkills, setDetectedSkills] = useState([]);
  const [assessments, setAssessments]     = useState([]);
  const [resumeScore, setResumeScore]     = useState(0);
  const [selectedPath, setSelectedPath]   = useState('Data Scientist');
  const [gapResult, setGapResult]         = useState(null);
  const [analyzed, setAnalyzed]           = useState(false);
  const resultsRef = useRef(null);

  const handleFile = (f) => {
    setFile(f);
    setAnalyzed(false);
    setError('');
    if (!f) {
      setDetectedSkills([]);
      setAssessments([]);
      setResumeText('');
      setGapResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) { setError('Please upload a PDF resume first.'); return; }
    setError('');
    setAnalyzing(true);

    try {
      const text    = await extractTextFromPDF(file);
      const skills  = detectSkills(text);
      const tests   = generateAssessments(skills);
      const score   = calculateResumeScore(skills, text);
      const gap     = analyzeSkillGap(selectedPath, skills, careerPaths);

      setResumeText(text);
      setDetectedSkills(skills);
      setAssessments(tests);
      setResumeScore(score);
      setGapResult(gap);
      setAnalyzed(true);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err) {
      console.error(err);
      setError('Failed to parse PDF. Please ensure the file is a valid, text-based PDF (not a scanned image).');
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePathChange = (path) => {
    setSelectedPath(path);
    if (detectedSkills.length > 0) {
      setGapResult(analyzeSkillGap(path, detectedSkills, careerPaths));
    }
  };

  const grouped = groupByCategory(detectedSkills);

  return (
    <>
      <GlobalStyles />
      <div style={{
        minHeight: '100vh',
        background: '#080c14',
        color: '#f8fafc',
        fontFamily: "'Syne', sans-serif",
        position: 'relative',
        overflowX: 'hidden',
      }}>
        {/* Grid background */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Glow blobs */}
        <div style={{ position: 'fixed', top: '-200px', left: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '-200px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* ── Nav ── */}
          <nav style={{
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '16px 40px',
            display: 'flex', alignItems: 'center', gap: '10px',
            backdropFilter: 'blur(20px)',
            background: 'rgba(8,12,20,0.7)',
            position: 'sticky', top: 0, zIndex: 50,
          }}>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(248,250,252,0.4)', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 8px', borderRadius: '6px', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,250,252,0.4)'}
            >
              ← Career Catalyst
            </button>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>/</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#06b6d4', fontFamily: "'JetBrains Mono', monospace" }}>
              resume-analyzer
            </span>
          </nav>

          {/* ── Hero ── */}
          <div style={{
            maxWidth: '900px', margin: '0 auto',
            padding: 'clamp(48px, 8vw, 88px) 40px 0',
            textAlign: 'center',
            animation: 'fadeUp 0.6s ease both',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(6,182,212,0.1)',
              border: '1px solid rgba(6,182,212,0.25)',
              borderRadius: '20px', padding: '5px 16px', marginBottom: '24px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06b6d4', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#06b6d4', fontFamily: "'JetBrains Mono', monospace" }}>
                Zero API · 100% Frontend
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(32px, 6vw, 58px)', fontWeight: '900',
              margin: '0 0 16px', lineHeight: '1.05',
              letterSpacing: '-0.03em',
            }}>
              AI Resume +{' '}
              <span style={{ color: '#06b6d4', position: 'relative' }}>
                Skill Analysis
                <span style={{ position: 'absolute', bottom: '-4px', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)' }} />
              </span>
            </h1>

            <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: '16px', lineHeight: '1.65', maxWidth: '520px', margin: '0 auto 48px', fontFamily: "'Syne', sans-serif" }}>
              Upload your PDF resume. Our engine extracts text, detects skills, suggests assessments, and shows your career readiness — entirely offline.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '60px', flexWrap: 'wrap' }}>
              {[
                { val: '70+', label: 'Skills tracked' },
                { val: '8',   label: 'Career paths' },
                { val: '18',  label: 'Assessments' },
                { val: '0',   label: 'API calls' },
              ].map(stat => (
                <div key={stat.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#06b6d4', fontFamily: "'Syne', sans-serif" }}>{stat.val}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(248,250,252,0.35)', fontFamily: "'JetBrains Mono', monospace', letterSpacing: '0.06em', textTransform: 'uppercase'" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Upload Section ── */}
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 40px 40px', animation: 'fadeUp 0.6s ease 0.1s both' }}>
            <SectionCard title="01 · Upload Resume" badge="PDF only" badgeColor="#06b6d4">
              <UploadZone onFile={handleFile} file={file} analyzing={analyzing} />

              {error && (
                <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#ef4444', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace" }}>
                  ⚠ {error}
                </div>
              )}

              {/* Career path selector */}
              <div style={{ marginTop: '24px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(248,250,252,0.4)', marginBottom: '10px', fontFamily: "'JetBrains Mono', monospace" }}>
                  Target Career Path (for gap analysis)
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.entries(careerPaths).map(([name, path]) => (
                    <button
                      key={name}
                      onClick={() => handlePathChange(name)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${selectedPath === name ? path.color + '60' : 'rgba(255,255,255,0.1)'}`,
                        background: selectedPath === name ? `${path.color}18` : 'rgba(255,255,255,0.03)',
                        color: selectedPath === name ? path.color : 'rgba(248,250,252,0.45)',
                        fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                        fontFamily: "'JetBrains Mono', monospace",
                        transition: 'all 0.15s',
                      }}
                    >
                      {path.icon} {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                disabled={!file || analyzing}
                style={{
                  marginTop: '24px',
                  width: '100%', padding: '16px',
                  borderRadius: '12px', border: 'none',
                  background: !file || analyzing
                    ? 'rgba(255,255,255,0.06)'
                    : 'linear-gradient(135deg, #06b6d4, #0891b2)',
                  color: !file || analyzing ? 'rgba(248,250,252,0.25)' : '#fff',
                  fontSize: '15px', fontWeight: '800',
                  cursor: !file || analyzing ? 'not-allowed' : 'pointer',
                  fontFamily: "'Syne', sans-serif",
                  letterSpacing: '0.02em',
                  transition: 'all 0.2s',
                  boxShadow: file && !analyzing ? '0 6px 28px rgba(6,182,212,0.3)' : 'none',
                }}
                onMouseEnter={e => { if (file && !analyzing) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {analyzing ? '⏳  Analyzing...' : '🔍  Analyze Resume'}
              </button>
            </SectionCard>
          </div>

          {/* ── Results ── */}
          {analyzed && (
            <div ref={resultsRef} style={{ maxWidth: '960px', margin: '0 auto', padding: '0 40px 80px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* ─ Score Header ─ */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '32px',
                display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap',
                animation: 'fadeUp 0.5s ease both',
              }}>
                <ScoreRing score={resumeScore} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 6px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(248,250,252,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>
                    Resume Strength Score
                  </p>
                  <h2 style={{ margin: '0 0 12px', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '900', letterSpacing: '-0.02em' }}>
                    {detectedSkills.length} skills detected
                  </h2>
                  <p style={{ margin: 0, color: 'rgba(248,250,252,0.5)', fontSize: '14px', lineHeight: '1.6' }}>
                    Across <strong style={{ color: '#f8fafc' }}>{new Set(detectedSkills.map(s => s.category)).size}</strong> categories —&nbsp;
                    <strong style={{ color: '#f8fafc' }}>{assessments.length}</strong> assessments recommended
                  </p>
                </div>
              </div>

              {/* ─ Detected Skills ─ */}
              <SectionCard
                title="02 · Detected Skills"
                badge={detectedSkills.length}
                badgeColor="#10b981"
                style={{ animation: 'fadeUp 0.5s ease 0.1s both' }}
              >
                {detectedSkills.length === 0 ? (
                  <p style={{ color: 'rgba(248,250,252,0.4)', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>
                    No known skills detected. Try a more detailed resume.
                  </p>
                ) : (
                  Object.entries(grouped).map(([category, skills]) => {
                    const cfg = categoryConfig[category] || categoryConfig['Tools'];
                    return (
                      <div key={category} style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                          <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: cfg.color, fontFamily: "'JetBrains Mono', monospace" }}>
                            {category}
                          </span>
                          <span style={{ fontSize: '11px', color: 'rgba(248,250,252,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>
                            ({skills.length})
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {skills.map(s => <SkillTag key={s.name} skill={s} />)}
                        </div>
                      </div>
                    );
                  })
                )}
              </SectionCard>

              {/* ─ Recommended Assessments ─ */}
              <SectionCard
                title="03 · Recommended Assessments"
                badge={assessments.length}
                badgeColor="#f59e0b"
                style={{ animation: 'fadeUp 0.5s ease 0.15s both' }}
              >
                {assessments.length === 0 ? (
                  <p style={{ color: 'rgba(248,250,252,0.4)', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>
                    No assessments matched. Add more technical skills to your resume.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                    {assessments.map((a, i) => (
                      <div key={i} style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px', padding: '18px',
                        display: 'flex', flexDirection: 'column', gap: '10px',
                        transition: 'border-color 0.2s, transform 0.2s',
                        cursor: 'default',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '24px' }}>{a.icon}</span>
                          <span style={{
                            fontSize: '10px', fontWeight: '700', letterSpacing: '0.06em',
                            padding: '3px 8px', borderRadius: '5px',
                            background: `${difficultyColor[a.difficulty]}20`,
                            border: `1px solid ${difficultyColor[a.difficulty]}40`,
                            color: difficultyColor[a.difficulty],
                            fontFamily: "'JetBrains Mono', monospace",
                          }}>
                            {a.difficulty}
                          </span>
                        </div>
                        <div>
                          <p style={{ margin: '0 0 4px', fontWeight: '700', fontSize: '14px', color: '#f8fafc', fontFamily: "'Syne', sans-serif" }}>
                            {a.title}
                          </p>
                          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(248,250,252,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>
                            ⏱ {a.duration} · Skill: {a.skill}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* ─ Skill Gap Analysis ─ */}
              {gapResult && (
                <SectionCard
                  title={`04 · Skill Gap · ${selectedPath}`}
                  badge={`${gapResult.matchScore}% ready`}
                  badgeColor={gapResult.matchScore >= 70 ? '#10b981' : gapResult.matchScore >= 40 ? '#f59e0b' : '#ef4444'}
                  style={{ animation: 'fadeUp 0.5s ease 0.2s both' }}
                >
                  {/* Readiness bar */}
                  <div style={{ marginBottom: '28px' }}>
                    <GapBar
                      label={`${careerPaths[selectedPath]?.icon} ${selectedPath} Readiness`}
                      score={gapResult.matchScore}
                      color={gapResult.matchScore >= 70 ? '#10b981' : gapResult.matchScore >= 40 ? '#f59e0b' : '#ef4444'}
                      icon=""
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Missing required */}
                    <div>
                      <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ef4444', fontFamily: "'JetBrains Mono', monospace" }}>
                        ✗ Missing Required ({gapResult.missingRequired.length})
                      </p>
                      {gapResult.missingRequired.length === 0 ? (
                        <p style={{ fontSize: '13px', color: '#10b981', fontFamily: "'JetBrains Mono', monospace" }}>✓ All required skills present!</p>
                      ) : (
                        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                          {gapResult.missingRequired.map(s => (
                            <span key={s} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '12px', fontWeight: '600', fontFamily: "'JetBrains Mono', monospace" }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Present skills */}
                    <div>
                      <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#10b981', fontFamily: "'JetBrains Mono', monospace" }}>
                        ✓ You Have ({gapResult.present.length})
                      </p>
                      {gapResult.present.length === 0 ? (
                        <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>No relevant skills detected yet.</p>
                      ) : (
                        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                          {gapResult.present.map(s => (
                            <span key={s} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: '12px', fontWeight: '600', fontFamily: "'JetBrains Mono', monospace" }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Missing preferred */}
                  {gapResult.missingPreferred.length > 0 && (
                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f59e0b', fontFamily: "'JetBrains Mono', monospace" }}>
                        ◎ Recommended to Add ({gapResult.missingPreferred.length})
                      </p>
                      <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                        {gapResult.missingPreferred.map(s => (
                          <span key={s} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', fontSize: '12px', fontWeight: '600', fontFamily: "'JetBrains Mono', monospace" }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </SectionCard>
              )}

              {/* Re-analyze another */}
              <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                <button
                  onClick={() => { handleFile(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(248,250,252,0.6)', borderRadius: '10px',
                    padding: '12px 28px', fontSize: '13px', fontWeight: '600',
                    cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#06b6d4'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(248,250,252,0.6)'; }}
                >
                  ↑ Analyze another resume
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Global Styles ────────────────────────────────────────────────────────────

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
      ::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.3); border-radius: 10px; }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
    `}</style>
  );
}