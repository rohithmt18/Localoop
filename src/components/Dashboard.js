import React from 'react';
import { useApp } from '../contexts/AppContext';

const Dashboard = () => {
  const { currentUser, currentCommunity, listings, notifications, navigate, getUserById } = useApp();

  if (!currentCommunity) {
    return (
      <div className="page-content">
        <div className="empty-state animate-fade-in-up">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h2>Join a Community First</h2>
          <p>Create or join a community to start using the marketplace</p>
          <button className="btn-primary" onClick={() => navigate('community')}>
            Get Started
          </button>
        </div>
      </div>
    );
  }

  const activeListings = listings.filter(l => l.status === 'active');
  const myListings = listings.filter(l => l.userId === currentUser.id);
  const recentListings = activeListings.slice(0, 4);
  const recentNotifs = notifications.slice(0, 5);

  const stats = [
    {
      label: 'Active Listings',
      value: activeListings.length,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
      ),
      color: 'teal',
    },
    {
      label: 'My Listings',
      value: myListings.length,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
        </svg>
      ),
      color: 'blue',
    },
    {
      label: 'Community Members',
      value: currentCommunity.members.length,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      color: 'purple',
    },
    {
      label: 'Trust Score',
      value: currentUser.trustScore + '%',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      color: 'green',
    },
  ];

  const intentColors = {
    sell: { bg: 'rgba(167, 139, 250, 0.15)', text: '#a78bfa', label: 'Selling' },
    buy: { bg: 'rgba(34, 211, 238, 0.15)', text: '#22d3ee', label: 'Buying' },
    service: { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c', label: 'Service' },
    request: { bg: 'rgba(244, 114, 182, 0.15)', text: '#f472b6', label: 'Request' },
  };

  return (
    <div className="page-content">
      {/* Welcome Section */}
      <div className="dashboard-welcome animate-fade-in">
        <div className="welcome-text">
          <h1>Welcome back, {currentUser.name.split(' ')[0]}! 👋</h1>
          <p>Here's what's happening in <strong>{currentCommunity.name}</strong> today</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('create-listing')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Listing
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className={`stat-card stat-card-${stat.color} animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Listings */}
        <div className="dashboard-section animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="section-header">
            <h2>Recent Listings</h2>
            <button className="btn-ghost" onClick={() => navigate('listings')}>View all →</button>
          </div>
          <div className="dashboard-listings">
            {recentListings.length === 0 ? (
              <div className="empty-mini">
                <p>No listings yet. Be the first!</p>
              </div>
            ) : (
              recentListings.map((listing, i) => {
                const user = getUserById(listing.userId);
                const intent = intentColors[listing.intent] || intentColors.sell;
                return (
                  <div 
                    key={listing.id} 
                    className="dashboard-listing-card"
                    onClick={() => navigate('listing-detail', { listing })}
                    style={{ animationDelay: `${(i + 3) * 80}ms` }}
                  >
                    <div className="dlc-top">
                      <span className="intent-badge" style={{ background: intent.bg, color: intent.text }}>
                        {intent.label}
                      </span>
                      {listing.price && (
                        <span className="dlc-price">₹{listing.price.toLocaleString()}</span>
                      )}
                    </div>
                    <h3 className="dlc-title">{listing.title}</h3>
                    <p className="dlc-desc">{listing.description.substring(0, 80)}...</p>
                    <div className="dlc-footer">
                      <div className="dlc-user">
                        <div className="mini-avatar">{user?.name?.charAt(0) || '?'}</div>
                        <span>{user?.name || 'Unknown'}</span>
                      </div>
                      <span className="dlc-time">{formatTime(listing.createdAt)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Activity / Notifications */}
        <div className="dashboard-section animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="section-header">
            <h2>Recent Activity</h2>
            <button className="btn-ghost" onClick={() => navigate('notifications')}>View all →</button>
          </div>
          <div className="activity-list">
            {recentNotifs.length === 0 ? (
              <div className="empty-mini">
                <p>No recent activity</p>
              </div>
            ) : (
              recentNotifs.map((notif) => {
                const typeIcons = {
                  listing: '🛒',
                  rating: '⭐',
                  community: '🏘️',
                };
                return (
                  <div key={notif.id} className={`activity-item ${!notif.read ? 'activity-unread' : ''}`}>
                    <span className="activity-icon">{typeIcons[notif.type] || '📌'}</span>
                    <div className="activity-content">
                      <div className="activity-title">{notif.title}</div>
                      <div className="activity-msg">{notif.message}</div>
                      <div className="activity-time">{formatTime(notif.createdAt)}</div>
                    </div>
                    {!notif.read && <div className="activity-dot"></div>}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="qa-grid">
              <button className="qa-btn" onClick={() => navigate('create-listing')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>Create Listing</span>
              </button>
              <button className="qa-btn" onClick={() => navigate('smart-parse')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <span>Smart Parse</span>
              </button>
              <button className="qa-btn" onClick={() => navigate('community')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cat-service)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span>Community</span>
              </button>
              <button className="qa-btn" onClick={() => navigate('profile')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cat-request)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>My Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default Dashboard;
