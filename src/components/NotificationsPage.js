import React from 'react';
import { useApp } from '../contexts/AppContext';

const NotificationsPage = () => {
  const { notifications, handleMarkNotifRead, handleMarkAllRead, unreadCount } = useApp();

  const typeConfig = {
    listing: { icon: '🛒', color: 'var(--cat-buy)' },
    rating: { icon: '⭐', color: 'var(--status-pending)' },
    community: { icon: '🏘️', color: 'var(--primary-teal)' },
  };

  return (
    <div className="page-content">
      <div className="page-header animate-fade-in">
        <div>
          <h1>Notifications</h1>
          <p className="page-subtitle">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn-secondary" onClick={handleMarkAllRead}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Mark all read
          </button>
        )}
      </div>

      <div className="notifications-list animate-fade-in-up">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <h3>No notifications yet</h3>
            <p>You'll be notified about new listings and interactions</p>
          </div>
        ) : (
          notifications.map((notif, i) => {
            const config = typeConfig[notif.type] || typeConfig.listing;
            return (
              <div
                key={notif.id}
                className={`notification-item ${!notif.read ? 'notification-unread' : ''} animate-fade-in-up`}
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={() => !notif.read && handleMarkNotifRead(notif.id)}
              >
                <div className="notif-icon" style={{ background: `${config.color}20`, color: config.color }}>
                  {config.icon}
                </div>
                <div className="notif-content">
                  <div className="notif-title">{notif.title}</div>
                  <div className="notif-message">{notif.message}</div>
                  <div className="notif-time">{formatTime(notif.createdAt)}</div>
                </div>
                {!notif.read && (
                  <div className="notif-unread-dot"></div>
                )}
              </div>
            );
          })
        )}
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
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default NotificationsPage;
