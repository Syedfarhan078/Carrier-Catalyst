import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { UserIcon, BriefcaseIcon, TargetIcon, ProgressIcon } from "../components/Icons";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch User and Progress concurrently
        // Note: user.id comes from the decoded JWT / stored user
        const userId = user.id || user._id;

        const [userRes, progressRes] = await Promise.all([
          api.get(`/users/${userId}`),
          api.get(`/progress/${userId}`)
        ]);

        setProfileData(userRes.data.data);
        setProgressData(progressRes.data.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        
        // If the user doesn't exist anymore (e.g., backend restarted and memory wiped)
        if (err.response?.status === 404 || err.response?.status === 401) {
          logout();
          return;
        }
        
        setError(err.displayMessage || "Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, navigate]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="profile-error">{error}</div>;
  if (!profileData || !progressData) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name) => {
    return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";
  };

  const joinedDate = profileData.joinedAt 
    ? new Date(profileData.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  return (
    <div className="profile-page-container">
      <div className="profile-header-actions">
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="profile-content-wrapper">
        <div className="profile-sidebar card-glass">
          <div className="profile-avatar">
            {getInitials(profileData.name)}
          </div>
          <h2 className="profile-name">{profileData.name}</h2>
          <p className="profile-email">{profileData.email}</p>
          <div className="profile-badge">
            <UserIcon size={14} /> Member since {joinedDate}
          </div>

          <div className="profile-actions">
            <button className="btn-edit" onClick={() => alert("Edit Profile coming soon!")}>
              Edit Profile
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="profile-main">
          <h3 className="section-title">Your Learning Journey</h3>
          
          <div className="stats-grid">
            <div className="stat-card card-glass">
              <div className="stat-icon-wrapper" style={{ background: "rgba(99, 102, 241, 0.1)" }}>
                <TargetIcon size={24} color="#6366f1" />
              </div>
              <div className="stat-info">
                <h4>Career Track</h4>
                <p className="stat-value highlight">
                  {progressData.career ? progressData.career.charAt(0).toUpperCase() + progressData.career.slice(1) : "None"}
                </p>
              </div>
            </div>

            <div className="stat-card card-glass">
              <div className="stat-icon-wrapper" style={{ background: "rgba(234, 179, 8, 0.1)" }}>
                <BriefcaseIcon size={24} color="#eab308" />
              </div>
              <div className="stat-info">
                <h4>Current Streak</h4>
                <p className="stat-value">{progressData.streakDays || 0} Days 🔥</p>
              </div>
            </div>

            <div className="stat-card card-glass">
              <div className="stat-icon-wrapper" style={{ background: "rgba(34, 197, 94, 0.1)" }}>
                <ProgressIcon size={24} color="#22c55e" />
              </div>
              <div className="stat-info">
                <h4>Hours Learned</h4>
                <p className="stat-value">{progressData.totalHours || 0} Hours</p>
              </div>
            </div>
          </div>

          <div className="progress-section card-glass">
            <h4>Track Progress</h4>
            <div className="progress-bar-container">
              <div className="progress-bar-header">
                <span>{progressData.completedTopics?.length || 0} / 15 Tasks Completed</span>
                <span>{progressData.completionPercentage || 0}%</span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressData.completionPercentage || 0}%` }}
                />
              </div>
            </div>

            {progressData.currentPhase && (
              <div className="current-phase">
                <strong>Current Phase:</strong> <span>{progressData.currentPhase}</span>
              </div>
            )}
          </div>
          
          <div className="recent-activity card-glass">
             <h4>Recent Achievements</h4>
             {progressData.completedTopics && progressData.completedTopics.length > 0 ? (
               <ul className="activity-list">
                 {progressData.completedTopics.slice(-3).map((topic, i) => (
                   <li key={i} className="activity-item">
                     <span className="activity-dot" />
                     Completed <strong>{topic}</strong>
                   </li>
                 ))}
               </ul>
             ) : (
               <p className="empty-state">No recent activity. Keep going!</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
