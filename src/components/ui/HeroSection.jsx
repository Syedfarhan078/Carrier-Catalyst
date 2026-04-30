import { useNavigate } from "react-router-dom";
import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import GradientButton from "./GradientButton";

// Lazy-load all WebGL components
const AnimatedBackground = lazy(() => import("../3d/AnimatedBackground"));
const ParticleText3D = lazy(() => import("../3d/ParticleText3D"));
const ShaderOrb = lazy(() => import("../3d/ShaderOrb"));
const ShaderGradientMesh = lazy(() => import("../3d/ShaderGradientMesh"));

const HeroSection = () => {
    const navigate = useNavigate();
    const orbRef = useRef(null);
    const bgRef = useRef(null);
    const heroRef = useRef(null);
    const [heroOpacity, setHeroOpacity] = useState(1);

    useEffect(() => {
      const handleScroll = () => {
        const scrolled = window.scrollY;

        // Parallax orb
        if (orbRef.current) {
          orbRef.current.style.transform = `translate(-50%, calc(-60% + ${scrolled * 0.4}px)) scale(${1 + scrolled * 0.0005})`;
        }
        // Parallax background
        if (bgRef.current) {
          bgRef.current.style.transform = `translateY(${scrolled * 0.15}px)`;
        }

        // Apple-style hero fade out on scroll
        const fadeStart = 100;
        const fadeEnd = 500;
        if (scrolled <= fadeStart) {
          setHeroOpacity(1);
        } else if (scrolled >= fadeEnd) {
          setHeroOpacity(0);
        } else {
          setHeroOpacity(1 - (scrolled - fadeStart) / (fadeEnd - fadeStart));
        }
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  return (
    <section
      ref={heroRef}
      className="cc-hero hero-cinematic"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* ── Layer 0: Shader Gradient Mesh (deepest background) ── */}
      <Suspense fallback={null}>
        <ShaderGradientMesh
          color1="#0a0a2e"
          color2="#1a0840"
          color3="#08183e"
          color4="#150a30"
          speed={0.3}
          scale={2.5}
        />
      </Suspense>

      {/* ── Layer 1: Particle Field ── */}
      <Suspense fallback={null}>
        <AnimatedBackground particleCount={100} />
      </Suspense>

      {/* ── Layer 2: Iridescent Shader Orb (subtle backdrop) ── */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "420px",
        height: "420px",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
        opacity: (0.15 + heroOpacity * 0.07),
        pointerEvents: "none",
        filter: "blur(3px)",
      }}>
        <Suspense fallback={null}>
          <ShaderOrb
            size={1.5}
            color1="#3730a3"
            color2="#5b21b6"
            color3="#0e7490"
            noiseScale={1.0}
            noiseIntensity={0.25}
            fresnelPower={3.5}
            rotationSpeed={0.08}
          />
        </Suspense>
      </div>

      {/* ── Layer 3: Content (highest z-index) ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          opacity: heroOpacity,
          transform: `translateY(${(1 - heroOpacity) * -30}px) scale(${0.95 + heroOpacity * 0.05})`,
          transition: "transform 0.05s linear",
          willChange: "opacity, transform",
        }}
      >
        <div className="cc-hero-bg" ref={bgRef} />
        <div className="cc-hero-orb" ref={orbRef} />

        <div className="cc-badge" style={{ marginBottom: "12px" }}>
          <div className="cc-badge-dot" />
          AI-Powered Career Guidance
        </div>

        <div style={{ marginBottom: "4px" }}>
          <Suspense fallback={null}>
            <ParticleText3D text="Career Catalyst" color="#ffffff" />
          </Suspense>
        </div>

        <h1 className="cc-hero-title" style={{ marginTop: "0" }}>
          Accelerate Your
          <br />
          <span className="cc-hero-title-gradient">Tech Career</span>
        </h1>

        <p className="cc-hero-sub">
          Personalized roadmaps, curated courses, interview prep, and weekly study
          plans — everything you need to land your dream tech job.
        </p>

        <div className="cc-hero-cta">
          <GradientButton variant="primary" onClick={() => navigate("/select-career")}>
            Get Started Free →
          </GradientButton>

          <GradientButton variant="ghost" onClick={() => navigate("/roadmap", { state: { career: "webdev", user: null} })}>
            RoadMap
          </GradientButton>
        </div>
      </div>

      {/* Cinematic bottom fade */}
      <div className="hero-fade-overlay" />

      {/* Scroll indicator */}
      <div className="scroll-indicator" style={{ opacity: heroOpacity }}>
        <span className="scroll-indicator-text">Scroll to explore</span>
        <div className="scroll-indicator-arrow" />
      </div>
    </section>
  );
};

export default HeroSection;