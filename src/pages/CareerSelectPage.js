import CAREERS from "../data/careers";
import { useNavigate } from "react-router-dom";
import { Suspense, lazy, useState } from "react";
import "../styles/advancedCareer.css";
import { TargetIcon, BookIcon, RoadmapIcon, AwardIcon } from "../components/Icons";

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
    <div className="advanced-container">
      <div className="advanced-wrapper">
        {/* Navigation Bar */}
        <div className="career-nav-bar">
          <div className="career-nav-brand" onClick={() => navigate("/")}>
            <TargetIcon size={24} color="#6366f1" />
            <span>SkillPath</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="career-nav-back"
          >
            ← Back to Home
          </button>
        </div>

        {/* Hero Section */}
        <div className="career-hero">
          <h1 className="career-hero-title">
            Choose Your Career Path
          </h1>
          <p className="career-hero-subtitle">
            Explore specialized learning tracks designed to accelerate your growth in today's most in-demand fields. Each path combines foundational knowledge with advanced expertise.
          </p>
          <div className="career-hero-cta">
            <button className="career-cta-btn career-cta-primary" onClick={() => document.querySelector('.career-grid')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Now
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="career-highlights">
          <div className="career-highlight">
            <div className="career-highlight-icon">
              <BookIcon size={32} color="#6366f1" />
            </div>
            <div className="career-highlight-title">Curated Content</div>
            <div className="career-highlight-text">Expert-selected courses and resources</div>
          </div>
          <div className="career-highlight">
            <div className="career-highlight-icon">
              <RoadmapIcon size={32} color="#6366f1" />
            </div>
            <div className="career-highlight-title">Clear Roadmap</div>
            <div className="career-highlight-text">Structured learning phases from basics to advanced</div>
          </div>
          <div className="career-highlight">
            <div className="career-highlight-icon">
              <AwardIcon size={32} color="#6366f1" />
            </div>
            <div className="career-highlight-title">Top Creators</div>
            <div className="career-highlight-text">Learn from industry-leading educators</div>
          </div>
          <div className="career-highlight">
            <div className="career-highlight-icon">
              <TargetIcon size={32} color="#6366f1" />
            </div>
            <div className="career-highlight-title">Interview Prep</div>
            <div className="career-highlight-text">Real questions and expert guidance</div>
          </div>
        </div>

        {/* 3D Career Cube Showcase */}
        <div className="career-3d-showcase">
          <div className="career-3d-container">
            <Suspense fallback={
              <div className="career-3d-fallback">
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
        <div className="career-grid career-grid-large">
          {Object.entries(CAREERS).map(([key, c]) => (
            <div
              key={key}
              className="career-card-advanced"
              onClick={() => {
                setSelectedIndex(careerArray.findIndex(car => car.key === key));
                navigate("/", { state: { career: key, page: "roadmap" } });
              }}
            >
              <div>
                <div className="career-card-icon">{c.icon}</div>
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