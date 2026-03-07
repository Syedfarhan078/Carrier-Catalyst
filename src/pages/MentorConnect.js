import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Data ────────────────────────────────────────────────────────────────────

const MENTOR_ROLES = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    emoji: '🎨',
    accent: '#e85d26',
    description:
      'Craft beautiful, accessible interfaces using React, Vue, or Angular. Masters of CSS, animation, and the user experience.',
    tags: ['React', 'CSS', 'TypeScript'],
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    emoji: '⚙️',
    accent: '#2563eb',
    description:
      'Build the logic, APIs, and databases that power applications. Experts in Node.js, Python, Go, and distributed systems.',
    tags: ['Node.js', 'APIs', 'Databases'],
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    emoji: '🔗',
    accent: '#7c3aed',
    description:
      'Own the entire product — from pixel-perfect UIs to scalable server architecture. The most versatile engineers in tech.',
    tags: ['React', 'Node.js', 'Cloud'],
  },
  {
    id: 'datascientist',
    title: 'Data Scientist',
    emoji: '📊',
    accent: '#059669',
    description:
      'Turn raw data into strategic insights using statistics, machine learning, and compelling data visualisations.',
    tags: ['Python', 'ML', 'Statistics'],
  },
  {
    id: 'aiengineer',
    title: 'AI Engineer',
    emoji: '🤖',
    accent: '#dc2626',
    description:
      'Design and deploy intelligent systems — LLMs, computer vision, NLP — bridging research and production at scale.',
    tags: ['PyTorch', 'LLMs', 'MLOps'],
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    emoji: '🛡️',
    accent: '#0891b2',
    description:
      'Defend systems against threats through penetration testing, threat modelling, and security architecture design.',
    tags: ['Pentesting', 'SIEM', 'Zero Trust'],
  },
  {
    id: 'cloud',
    title: 'Cloud Engineer',
    emoji: '☁️',
    accent: '#d97706',
    description:
      'Architect resilient, cost-efficient cloud infrastructure on AWS, GCP, and Azure using IaC and automation.',
    tags: ['AWS', 'Terraform', 'Kubernetes'],
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    emoji: '🚀',
    accent: '#be185d',
    description:
      'Accelerate delivery by bridging development and operations — CI/CD pipelines, containers, monitoring, and SRE.',
    tags: ['Docker', 'CI/CD', 'Monitoring'],
  },
];

const ROLE_OPTIONS = MENTOR_ROLES.map((r) => r.title);

// ─── Sub-components ───────────────────────────────────────────────────────────

function MentorRoleCard({ role, index }) {
  const [hovered, setHovered] = useState(false);

  const linkedInUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
    role.title
  )}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1.5px solid ${hovered ? role.accent : '#e8e4df'}`,
        borderRadius: '16px',
        padding: '28px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        cursor: 'default',
        transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 12px 40px ${role.accent}22`
          : '0 2px 12px rgba(0,0,0,0.06)',
        animationDelay: `${index * 60}ms`,
        animation: 'cardReveal 0.45s ease both',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `${role.accent}14`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}
        >
          {role.emoji}
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: role.accent,
            background: `${role.accent}12`,
            padding: '4px 10px',
            borderRadius: '20px',
          }}
        >
          IT Role
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '800',
          color: '#1a1614',
          fontFamily: "'Fraunces', Georgia, serif",
          lineHeight: '1.2',
        }}
      >
        {role.title}
      </h3>

      {/* Description */}
      <p
        style={{
          margin: 0,
          fontSize: '13.5px',
          color: '#6b6560',
          lineHeight: '1.65',
          fontFamily: "'DM Sans', sans-serif",
          flex: 1,
        }}
      >
        {role.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {role.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#8a8480',
              background: '#f5f3f1',
              padding: '3px 9px',
              borderRadius: '6px',
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA Button */}
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '4px',
          padding: '11px 16px',
          borderRadius: '10px',
          background: hovered ? role.accent : '#f5f3f1',
          color: hovered ? '#fff' : '#1a1614',
          fontWeight: '700',
          fontSize: '13px',
          fontFamily: "'DM Sans', sans-serif",
          textDecoration: 'none',
          transition: 'background 0.2s ease, color 0.2s ease',
          letterSpacing: '0.01em',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        Find Mentors on LinkedIn
      </a>
    </div>
  );
}

function MessageGenerator() {
  const [selectedRole, setSelectedRole] = useState(ROLE_OPTIONS[0]);
  const [copied, setCopied] = useState(false);
  const textRef = useRef(null);

  const message = `Hi [Name],\n\nI'm a computer science student actively exploring a career in ${selectedRole}. I came across your profile and was genuinely impressed by your journey and expertise in this space.\n\nI would really appreciate even 10–15 minutes of your time to hear any advice you could share about getting started in this field — what skills to prioritise, pitfalls to avoid, and how you navigated your early career.\n\nThank you so much for considering this. I look forward to connecting!\n\nBest regards,\n[Your Name]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <section style={{ marginTop: '72px' }}>
      {/* Section header */}
      <div style={{ marginBottom: '36px' }}>
        <span
          style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#e85d26',
            marginBottom: '10px',
            fontFamily: "'DM Mono', monospace",
          }}
        >
          ✦ Message Templates
        </span>
        <h2
          style={{
            margin: '0 0 10px',
            fontSize: 'clamp(26px, 4vw, 36px)',
            fontWeight: '800',
            color: '#1a1614',
            fontFamily: "'Fraunces', Georgia, serif",
            letterSpacing: '-0.02em',
          }}
        >
          Craft the Perfect Cold Message
        </h2>
        <p style={{ margin: 0, color: '#6b6560', fontSize: '15px', fontFamily: "'DM Sans', sans-serif", maxWidth: '520px' }}>
          First impressions matter. Generate a professional outreach message tailored to the role you're targeting.
        </p>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1.5px solid #e8e4df',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
        }}
      >
        {/* Role selector */}
        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: '#8a8480',
              marginBottom: '8px',
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Target Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '340px',
              padding: '11px 16px',
              borderRadius: '10px',
              border: '1.5px solid #e8e4df',
              background: '#faf9f7',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1a1614',
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b6560' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              paddingRight: '36px',
            }}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Generated message */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: '#8a8480',
              marginBottom: '8px',
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Generated Message
          </label>
          <textarea
            ref={textRef}
            readOnly
            value={message}
            rows={10}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: '1.5px solid #e8e4df',
              background: '#faf9f7',
              fontSize: '13.5px',
              lineHeight: '1.7',
              color: '#3d3936',
              fontFamily: "'DM Sans', sans-serif",
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Actions row */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Copy button */}
          <button
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              background: copied ? '#059669' : '#1a1614',
              color: '#fff',
              fontWeight: '700',
              fontSize: '14px',
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer',
              transition: 'background 0.25s ease',
              letterSpacing: '0.01em',
            }}
          >
            {copied ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy to Clipboard
              </>
            )}
          </button>

          {/* Email mentor button */}
          <a
            href={`mailto:mentor@careercatalyst.com?subject=Mentorship Request — ${encodeURIComponent(selectedRole)}&body=${encodeURIComponent(message)}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '10px',
              border: '1.5px solid #e8e4df',
              background: '#faf9f7',
              color: '#1a1614',
              fontWeight: '700',
              fontSize: '14px',
              fontFamily: "'DM Sans', sans-serif",
              textDecoration: 'none',
              transition: 'border-color 0.2s, background 0.2s',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#e85d26';
              e.currentTarget.style.background = '#fff7f4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e8e4df';
              e.currentTarget.style.background = '#faf9f7';
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Email a Mentor
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MentorConnect() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,800;1,9..144,400&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes heroFade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        @media (max-width: 600px) {
          .mc-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: '#faf9f7',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* ── Nav strip ── */}
        <div
          style={{
            borderBottom: '1px solid #e8e4df',
            padding: '16px 40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fff',
          }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#8a8480',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: '600',
              padding: '4px 8px',
              borderRadius: '6px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#1a1614')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8a8480')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Career Catalyst
          </button>
          <span style={{ color: '#d1cdc9', fontSize: '13px' }}>/</span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1614', fontFamily: "'DM Sans', sans-serif" }}>
            Mentor Connect
          </span>
        </div>

        {/* ── Hero ── */}
        <div
          style={{
            background: 'linear-gradient(160deg, #1a1614 0%, #2d2420 100%)',
            padding: 'clamp(48px, 8vw, 88px) 40px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative grain overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(232,93,38,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 30%, rgba(37,99,235,0.1) 0%, transparent 50%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', animation: 'heroFade 0.6s ease both' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(232,93,38,0.15)',
                border: '1px solid rgba(232,93,38,0.3)',
                borderRadius: '20px',
                padding: '6px 16px',
                marginBottom: '24px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e85d26', display: 'inline-block' }} />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#e85d26',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                Mentor Connect
              </span>
            </div>

            <h1
              style={{
                margin: '0 0 16px',
                fontSize: 'clamp(32px, 6vw, 60px)',
                fontWeight: '800',
                color: '#faf9f7',
                fontFamily: "'Fraunces', Georgia, serif",
                letterSpacing: '-0.03em',
                lineHeight: '1.05',
              }}
            >
              Connect with
              <br />
              <em style={{ color: '#e85d26', fontStyle: 'italic' }}>Industry Mentors</em>
            </h1>

            <p
              style={{
                margin: '0 auto',
                maxWidth: '500px',
                fontSize: '16px',
                color: 'rgba(250,249,247,0.6)',
                lineHeight: '1.65',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Skip years of trial-and-error. Find experienced professionals who've walked the path
              you're about to take — and learn directly from them.
            </p>

            {/* Stat pills */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '36px',
                flexWrap: 'wrap',
              }}
            >
              {[
                { num: '8', label: 'IT Roles' },
                { num: '1M+', label: 'Mentors on LinkedIn' },
                { num: 'Free', label: 'Always' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '22px',
                      fontWeight: '800',
                      color: '#faf9f7',
                      fontFamily: "'Fraunces', Georgia, serif",
                    }}
                  >
                    {stat.num}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(250,249,247,0.45)', fontFamily: "'DM Mono', monospace" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div
          style={{
            maxWidth: '1160px',
            margin: '0 auto',
            padding: 'clamp(40px, 6vw, 72px) 40px',
          }}
        >
          {/* Role cards section header */}
          <div style={{ marginBottom: '32px' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#e85d26',
                marginBottom: '10px',
                fontFamily: "'DM Mono', monospace",
              }}
            >
              ✦ Browse by Role
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(22px, 3.5vw, 32px)',
                fontWeight: '800',
                color: '#1a1614',
                fontFamily: "'Fraunces', Georgia, serif",
                letterSpacing: '-0.02em',
              }}
            >
              Which path are you exploring?
            </h2>
          </div>

          {/* Role grid */}
          <div className="mc-grid">
            {MENTOR_ROLES.map((role, i) => (
              <MentorRoleCard key={role.id} role={role} index={i} />
            ))}
          </div>

          {/* Message generator */}
          <MessageGenerator />

          {/* Tips section */}
          <section
            style={{
              marginTop: '72px',
              background: '#1a1614',
              borderRadius: '20px',
              padding: '40px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '28px',
            }}
          >
            <div style={{ gridColumn: '1 / -1', marginBottom: '4px' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#e85d26',
                  marginBottom: '8px',
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                ✦ Pro Tips
              </span>
              <h2
                style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#faf9f7',
                  fontFamily: "'Fraunces', Georgia, serif",
                }}
              >
                How to get a reply
              </h2>
            </div>
            {[
              {
                icon: '🎯',
                title: 'Be specific',
                tip: "Mention exactly what you want to learn. Vague asks get ignored.",
              },
              {
                icon: '⏱️',
                title: 'Respect their time',
                tip: "Ask for 15 minutes, not an hour. Offer to meet on their schedule.",
              },
              {
                icon: '💬',
                title: 'Personalise it',
                tip: "Reference something real from their profile before sending.",
              },
              {
                icon: '🔁',
                title: 'Follow up once',
                tip: "Wait one week, then send one polite follow-up. That's it.",
              },
            ].map((t) => (
              <div key={t.title}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>{t.icon}</div>
                <div
                  style={{
                    fontWeight: '700',
                    color: '#faf9f7',
                    fontSize: '14px',
                    marginBottom: '6px',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {t.title}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(250,249,247,0.5)', lineHeight: '1.6', fontFamily: "'DM Sans', sans-serif" }}>
                  {t.tip}
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            borderTop: '1px solid #e8e4df',
            padding: '24px 40px',
            textAlign: 'center',
            fontFamily: "'DM Mono', monospace",
            fontSize: '12px',
            color: '#b5b0aa',
          }}
        >
          Career Catalyst — Mentor Connect ✦ Built for students, by students
        </div>
      </div>
    </>
  );
}