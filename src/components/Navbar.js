import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const Navbar = () => {
  const { currentUser, currentCommunity, navigate, logout, unreadCount } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!currentUser) return null;

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <nav className="navbar glass-strong">
      <div className="navbar-left">
        <button className="navbar-logo" onClick={() => navigate('dashboard')}>
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="navLogo1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2dd4a8"/>
                <stop offset="100%" stopColor="#22d3ee"/>
              </linearGradient>
              <linearGradient id="navLogo2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1"/>
                <stop offset="100%" stopColor="#818cf8"/>
              </linearGradient>
            </defs>
            <path d="M50 10 L85 75 Q87 80 82 82 L18 82 Q13 80 15 75 Z" fill="#1e293b" stroke="url(#navLogo1)" strokeWidth="2"/>
            <path d="M35 45 Q50 25 65 45 Q75 60 60 65 Q50 68 40 65 Q25 60 35 45Z" fill="url(#navLogo1)" opacity="0.8"/>
            <path d="M40 55 Q50 40 60 55 Q65 65 55 68 Q50 70 45 68 Q35 65 40 55Z" fill="url(#navLogo2)" opacity="0.9"/>
            <circle cx="50" cy="52" r="5" fill="white" opacity="0.9"/>
          </svg>
          <span className="navbar-brand">Localoop</span>
        </button>
        
        {currentCommunity && (
          <div className="navbar-community">
            <span className="navbar-divider">/</span>
            <span className="navbar-community-name">{currentCommunity.name}</span>
          </div>
        )}
      </div>

      <div className="navbar-center">
        <NavButton icon="dashboard" label="Dashboard" page="dashboard" />
        <NavButton icon="listings" label="Listings" page="listings" />
        <NavButton icon="smart" label="Smart Parse" page="smart-parse" />
        <NavButton icon="community" label="Community" page="community" />
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn" onClick={() => navigate('notifications')} id="notifications-btn" title="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </button>
        
        <div className="navbar-user-wrapper">
          <button className="navbar-user-btn" onClick={() => setShowUserMenu(!showUserMenu)} id="user-menu-btn">
            <div className="navbar-avatar">{initials}</div>
            <span className="navbar-username">{currentUser.name}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          
          {showUserMenu && (
            <>
              <div className="menu-overlay" onClick={() => setShowUserMenu(false)}></div>
              <div className="navbar-dropdown animate-scale-in">
                <div className="dropdown-header">
                  <div className="navbar-avatar navbar-avatar-lg">{initials}</div>
                  <div>
                    <div className="dropdown-name">{currentUser.name}</div>
                    <div className="dropdown-email">{currentUser.email}</div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => { navigate('profile'); setShowUserMenu(false); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  My Profile
                </button>
                <button className="dropdown-item" onClick={() => { navigate('my-listings'); setShowUserMenu(false); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                  </svg>
                  My Listings
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item dropdown-item-danger" onClick={() => { logout(); setShowUserMenu(false); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavButton = ({ icon, label, page }) => {
  const { currentPage, navigate } = useApp();
  const isActive = currentPage === page;
  
  const icons = {
    dashboard: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    listings: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    smart: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/>
        <circle cx="12" cy="15" r="2"/>
      </svg>
    ),
    community: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  };

  return (
    <button 
      className={`nav-btn ${isActive ? 'nav-btn-active' : ''}`} 
      onClick={() => navigate(page)}
    >
      {icons[icon]}
      <span>{label}</span>
    </button>
  );
};

export default Navbar;
