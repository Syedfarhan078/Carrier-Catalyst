import React, { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Homepage.css";
import "../styles/scrollExperience.css";

// Lazy-load WebGL components
const WaveGrid = lazy(() => import("../components/3d/WaveGrid"));

import Navbar from "../components/ui/Navbar";
import HeroSection from "../components/ui/HeroSection";
import ScrollReveal from "../components/ui/ScrollReveal";
import TextReveal from "../components/ui/TextReveal";
import ScrollProgressBar from "../components/ui/ScrollProgressBar";
import StickyShowcase from "../components/sections/StickyShowcase";
import ExperientialStats from "../components/sections/ExperientialStats";
import CareerTracksSection from "../components/sections/CareerTracksSection";

import { BriefcaseIcon, ClipboardIcon, TargetIcon } from "../components/Icons";

/* ─── Feature Showcase Data ─── */
const SHOWCASE_FEATURES = [
  {
    id: "mentors",
    label: "Most Popular",
    color: "orange",
    title: "Mentor Marketplace",
    description:
      "Connect 1:1 with senior engineers, data scientists, and product managers from top companies. Get personalized guidance that courses can't offer.",
    ctaText: "Explore Mentors",
    action: "mentors",
    icon: <BriefcaseIcon size={36} color="#ff7a18" />,
    stats: [
      { value: "200+", label: "Mentors" },
      { value: "4.9/5", label: "Avg Rating" },
    ],
    blobColor: "rgba(255, 122, 24, 0.06)",
    blobColor2: "rgba(255, 170, 92, 0.04)",
  },
  {
    id: "resume",
    label: "AI Powered",
    color: "teal",
    title: "Resume Analyzer",
    description:
      "Upload your resume. Get instant AI feedback, ATS scoring, and targeted suggestions to stand out from the crowd.",
    ctaText: "Analyze Resume",
    action: "resume",
    icon: <ClipboardIcon size={36} color="#2dd4bf" />,
    stats: [
      { value: "AI", label: "Powered" },
      { value: "98%", label: "Accuracy" },
    ],
    blobColor: "rgba(45, 212, 191, 0.06)",
    blobColor2: "rgba(20, 184, 166, 0.04)",
  },
  {
    id: "assessment",
    label: "Proctored",
    color: "purple",
    title: "AI Assessment",
    description:
      "Validate your skills with a proctored AI test. Earn a certificate that recruiters actually trust.",
    ctaText: "Start Assessment",
    action: "assessment",
    icon: <TargetIcon size={36} color="#a78bfa" />,
    stats: [
      { value: "50+", label: "Questions" },
      { value: "100%", label: "Proctored" },
    ],
    blobColor: "rgba(108, 99, 255, 0.06)",
    blobColor2: "rgba(167, 139, 250, 0.04)",
  },
];

export default function HomePage({ navigate, user, onLogout }) {
  const routerNavigate = useNavigate();

  const handleShowcaseCTA = (action) => {
    const routes = {
      mentors: "/mentors",
      resume: "/resume-analyzer",
      assessment: "/assessment",
    };
    if (routes[action]) routerNavigate(routes[action]);
  };

  return (
    <div style={{ background: "#0B0F1A", minHeight: "100vh" }}>
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Navbar */}
      <Navbar user={user} onLogout={onLogout} />

      <main id="main-content" tabIndex="-1" style={{ outline: 'none' }}>
        {/* ═══ ACT 1: Cinematic Hero ═══ */}
        <HeroSection />

      {/* ═══ ACT 2: Mission Statement — Word-by-Word Reveal ═══ */}
      <div className="section-divider-glow" />
      <TextReveal
        text="We built Career Catalyst to give every learner a personalized, AI-powered path from beginner to job-ready — with mentors, assessments, and real-world skills that actually matter."
      />
      <div className="section-divider-glow" />

      {/* ═══ ACT 3: Sticky Feature Showcase (The "Apple" Section) ═══ */}
      <StickyShowcase
        features={SHOWCASE_FEATURES}
        onCTA={handleShowcaseCTA}
      />

      {/* ═══ WebGL Wave Grid Transition ═══ */}
      <Suspense fallback={null}>
        <WaveGrid
          color="#6366f1"
          highColor="#a78bfa"
          amplitude={0.25}
          frequency={0.7}
          segments={60}
          height={250}
        />
      </Suspense>

      {/* ═══ ACT 4: Career Tracks — Scroll Revealed ═══ */}
      <ScrollReveal>
        <CareerTracksSection navigate={navigate} />
      </ScrollReveal>

      {/* ═══ ACT 5: Stats — Count Up on Scroll ═══ */}
      <div className="section-divider-glow" aria-hidden="true" />
      <ExperientialStats />
      </main>
    </div>
  );
}
