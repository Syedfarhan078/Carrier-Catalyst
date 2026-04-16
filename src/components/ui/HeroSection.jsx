import { useNavigate } from "react-router-dom";
import React from "react";
import GradientButton from "./GradientButton";
// import CoursesPage from "../../pages/CoursesPage";

const HeroSection = () => {
    const navigate = useNavigate();
  return (
    <section className="cc-hero">
      <div className="cc-hero-bg" />
      <div className="cc-hero-orb" />

      <div className="cc-badge">
        <div className="cc-badge-dot" />
        AI-Powered Career Guidance
      </div>

      <h1 className="cc-hero-title">
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
    </section>
  );
};

export default HeroSection;