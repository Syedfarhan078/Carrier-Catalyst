import React from "react";
import { useNavigate } from "react-router-dom";

const ResumeAnalyzerButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/resume-analyzer");
  };

  return (
    <div style={{ marginBottom: "50px", textAlign: "center", marginTop: "50px" }}>
      <button
        onClick={handleClick}
        style={{
          padding: "16px 34px",
          width: "23%",
          fontSize: "16px",
          fontWeight: 700,
          backgroundColor: "#6C63FF",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(99,102,241,0.4)"
 
        }}
      >
        📄 Analyze Resume with AI
      </button>
    </div>
  );
};

export default ResumeAnalyzerButton;