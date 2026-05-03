import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTrends } from "../api/trendsApi";
import { ChartIcon, TrendingUpIcon, AwardIcon, EyeIcon } from "../components/Icons";
import "../styles/TrendsPage.css";

const UpArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

const DownArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);

const StableIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14" />
  </svg>
);

export default function TrendsPage() {
  const navigate = useNavigate();
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Generate fake mini chart data for visual effect (persists across renders)
  const [chartData] = useState(() => 
    Array.from({ length: 8 }).map(() => Array.from({ length: 7 }, () => Math.random() * 100))
  );

  const loadData = async () => {
    try {
      const data = await fetchTrends();
      setTrends(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch trends", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 15 seconds
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const formatJobs = (count) => {
    return (count / 1000).toFixed(1) + "K";
  };

  const filteredTrends = trends.filter(t => 
    filter === "All" || t.demandLevel === filter
  );

  return (
    <div className="trends-container">
      <div className="trends-header">
        <button 
          onClick={() => navigate("/")} 
          className="trends-back-btn"
          style={{ 
            position: 'absolute', 
            left: '0', 
            top: '0', 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            color: '#a1a1aa', 
            padding: '0.5rem 1rem', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            transition: 'all 0.3s' 
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
        >
          ← Back
        </button>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ChartIcon size={36} color="#818cf8" /> Live Market Demand
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Track real-time demand across tech careers
        </motion.p>
      </div>

      <motion.div 
        className="trends-controls"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="trends-filter">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Demand Levels</option>
            <option value="High">High Demand</option>
            <option value="Medium">Medium Demand</option>
            <option value="Low">Low Demand</option>
          </select>
        </div>
        <div className="trends-meta">
          <EyeIcon size={16} />
          {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : "Updating..."}
        </div>
      </motion.div>

      <div className="trends-grid">
        <AnimatePresence mode="popLayout">
          {loading ? (
            // Skeleton Loading State
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div 
                key={`skeleton-${i}`}
                className="trend-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="trend-card-header">
                  <div className="trend-icon-wrapper skeleton" />
                  <div className="trend-role-info" style={{ width: '100%' }}>
                    <div className="skeleton" style={{ height: '20px', width: '70%', marginBottom: '8px' }} />
                    <div className="skeleton" style={{ height: '16px', width: '40%' }} />
                  </div>
                </div>
                <div className="skeleton" style={{ height: '40px', width: '100%', marginBottom: '16px' }} />
                <div className="skeleton" style={{ height: '10px', width: '100%' }} />
              </motion.div>
            ))
          ) : (
            filteredTrends.map((trend, index) => (
              <motion.div 
                key={trend.role}
                className="trend-card"
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="trend-rank">#{index + 1}</div>
                
                <div className="trend-card-header">
                  <div className="trend-icon-wrapper">
                    <AwardIcon size={24} />
                  </div>
                  <div className="trend-role-info">
                    <h3>{trend.role}</h3>
                    <span className={`demand-badge ${trend.demandLevel.toLowerCase()}`}>
                      {trend.demandLevel} Demand
                    </span>
                  </div>
                </div>

                <div className="trend-metrics">
                  <div className="metric">
                    <span className="metric-label">Active Jobs</span>
                    <span className="metric-value">{formatJobs(trend.jobCount)}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Growth (MoM)</span>
                    <span className={`metric-value ${trend.growth > 0 ? 'growth-positive' : trend.growth < 0 ? 'growth-negative' : 'growth-stable'}`}>
                      {trend.growth > 10 ? <TrendingUpIcon size={16} /> : trend.growth > 0 ? <UpArrow /> : trend.growth < 0 ? <DownArrow /> : <StableIcon />}
                      {Math.abs(trend.growth)}%
                    </span>
                  </div>
                </div>

                <div className="trend-score-section">
                  <div className="trend-score-header">
                    <span 
                      className="trend-score-label" 
                      data-tooltip="Calculated based on job volume, growth velocity, and market indicators"
                    >
                      Trend Score ⓘ
                    </span>
                    <span className="trend-score-value">{trend.trendScore}/100</span>
                  </div>
                  <div className="trend-progress-bg">
                    <div 
                      className="trend-progress-fill" 
                      style={{ width: `${trend.trendScore}%` }}
                    />
                  </div>
                </div>

                <div className="trend-mini-chart">
                  {chartData[index % chartData.length].map((val, i) => (
                    <div 
                      key={i} 
                      className="chart-bar" 
                      style={{ height: `${Math.max(10, val * (trend.trendScore / 100))}%` }}
                    />
                  ))}
                </div>

              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
