import { useNavigate } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import GradientButton from "./GradientButton";
const AnimatedBackground = lazy(() => import("../3d/AnimatedBackground"));
const ParticleText3D = lazy(() => import("../3d/ParticleText3D"));

const HeroSection = () => {
    const navigate = useNavigate();
  return (
    <section className="cc-hero" style={{ position: "relative", overflow: "hidden" }}>
      <Suspense fallback={null}>
        <AnimatedBackground particleCount={120} />
      </Suspense>

      <div style={{ position: "relative", zIndex: 10 }}>
        <div className="cc-hero-bg" />
        <div className="cc-hero-orb" />

        <div className="cc-badge">
        <div className="cc-badge-dot" />
        AI-Powered Career Guidance
      </div>

        <div style={{ marginBottom: "20px" }}>
          <Suspense fallback={null}>
            <ParticleText3D text="SkillPath" color="#6366f1" />
          </Suspense>
        </div>

        <h1 className="cc-hero-title" style={{ marginTop: "10px" }}>
        Find Your
        <br />
        <span className="cc-hero-title-gradient">Career Catalyst</span>
      </h1>

      <p className="cc-hero-sub">
        Personalized roadmaps, curated courses, interview prep, and weekly study
        plans — everything you need to land your dream tech job.
      </p>

      <div className="cc-hero-cta">
        <GradientButton variant="primary" onClick={() => navigate("/select-career")}>
        Get Started Free →
        </GradientButton>

        <GradientButton variant="ghost" onClick={() => navigate("/roadmap", { state: { career: "frontend", user: null} })}>
            RoadMap
        </GradientButton>
      </div>
      </div>
    </section>
  );
};

export default HeroSection;