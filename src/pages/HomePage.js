import CAREERS from "../data/careers";
import "../styles/Homepage.css";
import { useNavigate } from "react-router-dom";
import { MentorConnectButton } from "./HomePage";
import ResumeAnalyzerButton from "../components/ResumeAnalyzerButton";

import Navbar from "../components/ui/Navbar";
import HeroSection from "../components/ui/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import CareerTracksSection from "../components/sections/CareerTracksSection";
import StatsSection from "../components/sections/StatsSection";


export default function HomePage({ navigate, user, onLogout }) {
  const routerNavigate = useNavigate();

  return (
    <div style={{ background: "#0B0F1A", minHeight: "100vh" }}>

      {/* NEW NAVBAR */}
      <Navbar user={user} onLogout={onLogout} />

      {/* HERO */}
      <HeroSection />

      {/* FEATURES (IMPORTANT SECTION) */}
      <FeaturesSection
        onMentor={() => routerNavigate("/mentors")}
        onResume={() => routerNavigate("/resume-analyzer")}
        onAssessment={() => routerNavigate("/assessment")}
      />

      {/* CAREER TRACKS */}
      <CareerTracksSection navigate={navigate} />

      {/* STATS */}
      <StatsSection />

    </div>
  );
}


