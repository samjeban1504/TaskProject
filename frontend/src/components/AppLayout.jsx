import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const pageTitles = {
  '/dashboard': '📊 Dashboard',
  '/tasks': '✅ My Tasks',
  '/profile': '👤 Profile',
};

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'TaskFlow';

  return (
    <div className="app-wrapper">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((p) => !p)}
      />
      <div className="main-content">
        <Navbar
          title={title}
          onMenuClick={() => setSidebarOpen((p) => !p)}
        />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
