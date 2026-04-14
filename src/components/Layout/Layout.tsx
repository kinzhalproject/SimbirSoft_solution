import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import './Layout.css';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const isTeamsSection =
    location.pathname.startsWith('/teams') || location.pathname.startsWith('/team/');

  const isDetailPage =
    location.pathname.startsWith('/league/') || location.pathname.startsWith('/team/');

  const activeTab = isTeamsSection ? '/teams' : '/leagues';

  const handleTabClick = (path: string) => {
    setSearchQuery('');
    navigate(path);
  };

  return (
    <div className="layout">
      {/* HEADER */}
      <header className="header">
        <img src="/logoFifa.png" alt="FIFA" className="logo" onClick={() => navigate('/leagues')} />
        <nav className="tabs">
          <button
            className={`tab ${activeTab === '/leagues' ? 'active' : ''}`}
            onClick={() => handleTabClick('/leagues')}
          >
            Лиги
          </button>
          <button
            className={`tab ${activeTab === '/teams' ? 'active' : ''}`}
            onClick={() => handleTabClick('/teams')}
          >
            Команды
          </button>
        </nav>
      </header>

      {/* SEARCH BAR - only on list pages */}
      {!isDetailPage && (
        <div className="search-bar">
          <div className="search-input-wrapper">
            <img src="/searchIcon.png" alt="search" className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="content">
        <div className="container">
          <Outlet context={{ searchQuery }} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
