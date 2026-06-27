import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiCheckCircle, FiClock, FiAlertTriangle, FiList } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardAPI.getStats();
        setStats(res.data.data);
      } catch {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = stats ? [
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      icon: <FiList />,
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.15)',
    },
    {
      label: 'Completed',
      value: stats.completedTasks,
      icon: <FiCheckCircle />,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.15)',
    },
    {
      label: 'Pending',
      value: stats.pendingTasks,
      icon: <FiClock />,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.15)',
    },
    {
      label: 'High Priority',
      value: stats.highPriorityTasks,
      icon: <FiAlertTriangle />,
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.15)',
    },
  ] : [];

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2>{greeting()}, {user?.fullName?.split(' ')[0]}! 👋</h2>
        <p>Here's an overview of your tasks today</p>
      </div>

      {loading ? (
        <div className="spinner-wrapper">
          <div className="spinner" />
          <span>Loading stats...</span>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="stats-grid">
            {statCards.map((card) => (
              <div className="stat-card" key={card.label}>
                <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
                  {card.icon}
                </div>
                <div className="stat-info">
                  <h3 style={{ color: card.color }}>{card.value}</h3>
                  <p>{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Completion Progress */}
          {stats && (
            <div className="progress-container">
              <div className="progress-label">
                <span>📈 Overall Completion</span>
                <strong style={{ color: 'var(--primary-light)' }}>
                  {stats.completionPercentage}%
                </strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${stats.completionPercentage}%` }}
                />
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                {stats.completedTasks} of {stats.totalTasks} tasks completed
              </p>
            </div>
          )}

          {/* Priority Breakdown */}
          {stats && (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '1.25rem'
            }}>
              <div className="section-header">
                <span className="section-title">Priority Breakdown</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                {[
                  { label: 'High Priority', value: stats.highPriorityTasks, color: '#ef4444', total: stats.totalTasks },
                  { label: 'Medium Priority', value: stats.mediumPriorityTasks, color: '#f59e0b', total: stats.totalTasks },
                  { label: 'Low Priority', value: stats.lowPriorityTasks, color: '#10b981', total: stats.totalTasks },
                ].map((item) => {
                  const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
                  return (
                    <div key={item.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between',
                        fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        <span>{item.label}</span>
                        <span style={{ color: item.color }}>{item.value} ({pct}%)</span>
                      </div>
                      <div className="progress-track">
                        <div style={{
                          height: '100%', width: `${pct}%`,
                          background: item.color, borderRadius: '4px',
                          transition: 'width 0.8s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
