import CAREERS from "../data/careers";
import { useNavigate } from "react-router-dom";
import { Suspense, lazy, useState } from "react";
import "../styles/premium.css";
import { TargetIcon, BookIcon, RoadmapIcon, AwardIcon, CatalystIcon } from "../components/Icons";

const CareerCube3D = lazy(() => import("../components/3d/CareerCube3D"));

export default function CareerSelectPage() {
  const navigate = useNavigate();
  const careerArray = Object.entries(CAREERS).map(([key, career]) => ({
    ...career,
    key,
  }));
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleCareerSelect = (index) => {
    setSelectedIndex(index);
    const careerKey = careerArray[index].key;
    navigate("/", { state: { career: careerKey, page: "roadmap" } });
  };

  return (
    <div className="career-select-container" style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="career-select-bg" />

      <div className="career-select-wrapper">
        {/* Navigation Bar */}
        <div className="career-nav-header" style={{ animation: "fadeInDown 0.4s ease-out" }}>
          <div
            className="navbar-brand"
            onClick={() => navigate("/")}
            style={{ animation: "slideInLeft 0.4s ease-out" }}
          >
            <CatalystIcon size={24} color="#6366f1" />
            <span>Career Catalyst</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="career-nav-back-btn"
            style={{ animation: "slideInRight 0.4s ease-out" }}
          >
            ← Back to Home
          </button>
        </div>

        {/* Hero Section */}
        <div className="career-hero-section" style={{ animation: "fadeInUp 0.5s ease-out 0.1s both" }}>
          <h1
            className="career-hero-title"
            style={{ animation: "fadeInUp 0.5s ease-out 0.2s both" }}
          >
            Choose Your Career Path
          </h1>
          <p
            className="career-hero-subtitle"
            style={{ animation: "fadeInUp 0.5s ease-out 0.3s both" }}
          >
            Explore specialized learning tracks designed to accelerate your growth in today's most in-demand fields. Each path combines foundational knowledge with advanced expertise.
          </p>
          <div
            className="career-hero-cta"
            style={{ animation: "fadeInUp 0.5s ease-out 0.4s both" }}
          >
            <button
              className="career-cta-btn career-cta-primary"
              onClick={() => document.querySelector('.career-grid-premium')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Now
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="career-highlights-grid">
          {[
            { icon: BookIcon, title: "Curated Content", text: "Expert-selected courses and resources" },
            { icon: RoadmapIcon, title: "Clear Roadmap", text: "Structured learning phases from basics to advanced" },
            { icon: AwardIcon, title: "Top Creators", text: "Learn from industry-leading educators" },
            { icon: TargetIcon, title: "Interview Prep", text: "Real questions and expert guidance" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="career-highlight-card"
              style={{ animation: `fadeInUp 0.4s ease-out ${idx * 0.1}s both` }}
            >
              <div className="career-highlight-icon">
                <item.icon size={32} color="#6366f1" />
              </div>
              <div className="career-highlight-title">{item.title}</div>
              <div className="career-highlight-text">{item.text}</div>
            </div>
          ))}
        </div>

        {/* 3D Career Cube Showcase */}
        <div className="career-3d-section" style={{ animation: "fadeInUp 0.5s ease-out 0.3s both" }}>
          <div className="career-3d-container">
            <Suspense fallback={
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "var(--text-tertiary)",
                fontSize: "0.95rem",
                animation: "pulse 2s ease-in-out infinite"
              }}>
                Loading 3D Career Selector...
              </div>
            }>
              <CareerCube3D 
                careers={careerArray}
                onSelect={handleCareerSelect}
                selectedIndex={selectedIndex}
              />
            </Suspense>
          </div>
        </div>

        {/* Career Cards Grid */}
        <div className="career-grid-premium">
          {Object.entries(CAREERS).map(([key, c], idx) => (
            <div
              key={key}
              className="career-card-premium"
              style={{ animation: `fadeInUp 0.5s ease-out ${idx * 0.08}s both` }}
              onClick={() => {
                setSelectedIndex(careerArray.findIndex(car => car.key === key));
                navigate("/", { state: { career: key, page: "roadmap" } });
              }}
            >
              <div className="career-card-content">
                <div className="career-card-icon">
                  {c.icon}
                </div>
                <h2 className="career-card-title" style={{ color: c.color }}>
                  {c.label}
                </h2>
                <p className="career-card-description">
                  {c.description}
                </p>
              </div>
              <div className="career-card-cta">
                Explore Path →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}