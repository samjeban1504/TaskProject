import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiCheckSquare, FiUser, FiLogOut, FiMenu, FiX
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const navItems = [
  { to: '/dashboard', icon: <FiGrid />, label: 'Dashboard' },
  { to: '/tasks', icon: <FiCheckSquare />, label: 'My Tasks' },
  { to: '/profile', icon: <FiUser />, label: 'Profile' },
];

const Sidebar = ({ isOpen, onToggle }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div
          onClick={onToggle}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 99, display: 'none'
          }}
          className="sidebar-overlay"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">✅</div>
          <span className="sidebar-brand-name">TaskFlow</span>
        </div>

        {/* User info */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '0.75rem'
        }}>
          <div className="user-avatar" style={{ width: 40, height: 40, fontSize: '1rem' }}>
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {user?.fullName || 'User'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {user?.email}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase',
            letterSpacing: '1px', padding: '0.5rem 1rem 0.25rem', fontWeight: 600 }}>
            Navigation
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' active' : ''}`
              }
              onClick={() => window.innerWidth < 768 && onToggle()}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{ width: '100%', border: 'none', background: 'none',
              cursor: 'pointer', color: '#f87171' }}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
