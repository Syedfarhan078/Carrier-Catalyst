import CAREERS from "../data/careers";
import PageHeader from "../components/PageHeader";
import { useState } from "react";
import "../styles/advancedCareer.css";
import { BookIcon } from "../components/Icons";

const LEVEL_COLORS = {
  Beginner: "#22c55e",
  Intermediate: "#f59e0b",
  Advanced: "#ef4444",
  "Beginner–Adv": "#8b5cf6",
  Free: "#06b6d4",
  "Free + Cert": "#06b6d4",
  "Self-paced": "#06b6d4",
};

export default function CoursesPage({ career }) {
  const c = CAREERS[career] || Object.values(CAREERS)[0];
  const [activeFilter, setActiveFilter] = useState("All");

  const courses = c?.courses || [];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];
  
  const filteredCourses = activeFilter === "All" 
    ? courses 
    : courses.filter(course => course.level === activeFilter);

  return (
    <div className="advanced-container">
      <div className="advanced-wrapper">
        <PageHeader
          icon="◉"
          title="Curated Courses"
          sub="Hand-picked courses from top providers to accelerate your learning"
          color={c?.color || "#6C63FF"}
        />

        {/* Filters */}
        <div className="courses-filters">
          {levels.map((level) => (
            <button
              key={level}
              className={`filter-btn ${activeFilter === level ? 'active' : ''}`}
              onClick={() => setActiveFilter(level)}
            >
              {level === "All" ? "All Courses" : level}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="courses-grid">
          {filteredCourses.map((course, i) => {
            const lvlColor = LEVEL_COLORS[course.level] || "#888";
            return (
              <div key={i} className="course-card">
                <div className="course-badge-container">
                  <span className="course-badge course-badge-level">
                    {course.level}
                  </span>
                  <span className="course-badge course-badge-duration">
                    ⏱ {course.duration}
                  </span>
                </div>
                
                <h3 className="course-title">{course.title}</h3>
                
                <p className="course-provider">
                  by {course.provider}
                </p>
                
                <p className="course-description">
                  Learn comprehensive skills with this expertly-crafted course from industry professionals.
                </p>
                
                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="course-link"
                >
                  View Course →
                </a>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div style={{ 
            textAlign: "center", 
            padding: "60px 20px",
            color: "rgba(255,255,255,0.6)"
          }}>
            <p style={{ fontSize: "1.1rem" }}>No courses found in this category</p>
            <button 
              className="filter-btn"
              onClick={() => setActiveFilter("All")}
              style={{ marginTop: "20px" }}
            >
              Show All Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
