import React from 'react';
import { FiSun, FiMoon, FiMenu } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ title, onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="sidebar-toggle" onClick={onMenuClick}>
          <FiMenu />
        </button>
        <span className="topbar-title">{title}</span>
      </div>

      <div className="topbar-right">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
          <span style={{ fontSize: '0.8rem' }}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </span>
        </button>

        <div className="user-avatar" title={user?.fullName}>
          {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
