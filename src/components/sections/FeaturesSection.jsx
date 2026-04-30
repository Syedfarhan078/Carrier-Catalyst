import React from "react";
import FeatureCard from "../ui/FeatureCard";
import { BriefcaseIcon, ClipboardIcon, TargetIcon, TrendingUpIcon } from "../Icons";

const FeaturesSection = ({ onMentor, onResume, onAssessment }) => {
  return (
    <section className="cc-section">
      <div className="cc-section-label">Premium Features</div>
      <h2 className="cc-section-title">Everything you need to accelerate</h2>
      <p className="cc-section-sub">
        Tools built for serious learners. Pick a path, get mentored, prove your
        skills.
      </p>

      <div className="cc-features-grid">
        {/* Mentor Marketplace — full width, featured */}
        <FeatureCard
          isFeatured
          badge={
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUpIcon size={14} /> Most Popular
            </div>
          }
          badgeVariant="hot"
          icon={<BriefcaseIcon size={32} />}
          title="Mentor Marketplace"
          description="Connect 1:1 with senior engineers, data scientists, and product managers from top companies. Get personalized guidance that courses can't offer."
          ctaText="Explore Mentors →"
          ctaVariant="orange"
          onCTA={onMentor}
          stats={[
            { value: "200+", label: "Mentors" },
            { value: "4.9/5", label: "Avg Rating" },
          ]}
        />

        {/* Resume Analyzer */}
        <FeatureCard
          badge="AI Powered"
          badgeVariant="ai"
          icon={<ClipboardIcon size={32} />}
          title="Resume Analyzer"
          description="Upload your resume. Get instant AI feedback, ATS scoring, and targeted suggestions to stand out."
          ctaText="Analyze Resume →"
          ctaVariant="teal"
          onCTA={onResume}
        />

        {/* AI Assessment */}
        <FeatureCard
          badge="Proctored"
          badgeVariant="new"
          icon={<TargetIcon size={32} />}
          title="AI Assessment"
          description="Validate your skills with a proctored AI test. Earn a certificate that recruiters actually trust."
          ctaText="Start Assessment →"
          ctaVariant="purple"
          onCTA={onAssessment}
        />
      </div>
    </section>
  );
};

export default FeaturesSection;