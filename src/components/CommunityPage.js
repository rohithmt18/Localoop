import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const CommunityPage = () => {
  const { currentUser, currentCommunity, handleCreateCommunity, handleJoinCommunity, getUserById, navigate, showToast } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [createData, setCreateData] = useState({ name: '', description: '', location: '' });
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!createData.name.trim()) return;
    handleCreateCommunity(createData);
    setShowCreate(false);
    setCreateData({ name: '', description: '', location: '' });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    const result = handleJoinCommunity(joinCode.trim().toUpperCase());
    if (!result.success) {
      setError(result.message);
    } else {
      setShowJoin(false);
      setJoinCode('');
      setError('');
    }
  };

  return (
    <div className="page-content">
      <div className="page-header animate-fade-in">
        <div>
          <h1>Community</h1>
          <p className="page-subtitle">Manage your communities and connect with neighbors</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => { setShowJoin(true); setShowCreate(false); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Join Community
          </button>
          <button className="btn-primary" onClick={() => { setShowCreate(true); setShowJoin(false); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create Community
          </button>
        </div>
      </div>

      {/* Create Community Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Community</h2>
              <button className="modal-close" onClick={() => setShowCreate(false)}>×</button>
            </div>
            <form onSubmit={handleCreate} className="modal-body">
              <div className="form-group">
                <label>Community Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Sunrise Apartments"
                  value={createData.name}
                  onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Describe your community..."
                  value={createData.description}
                  onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                  className="form-textarea"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="e.g., Bangalore, India"
                  value={createData.location}
                  onChange={(e) => setCreateData({ ...createData, location: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Community</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Community Modal */}
      {showJoin && (
        <div className="modal-overlay" onClick={() => setShowJoin(false)}>
          <div className="modal animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Join a Community</h2>
              <button className="modal-close" onClick={() => setShowJoin(false)}>×</button>
            </div>
            <form onSubmit={handleJoin} className="modal-body">
              {error && (
                <div className="auth-error animate-fade-in">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  {error}
                </div>
              )}
              <div className="form-group">
                <label>Invite Code *</label>
                <input
                  type="text"
                  placeholder="Enter 8-character invite code"
                  value={joinCode}
                  onChange={(e) => { setJoinCode(e.target.value); setError(''); }}
                  className="form-input invite-input"
                  maxLength={8}
                  required
                  style={{ textTransform: 'uppercase', letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem' }}
                />
              </div>
              <p className="form-hint">Ask your community admin for the invite code</p>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowJoin(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Join Community</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Current Community */}
      {currentCommunity ? (
        <div className="community-detail animate-fade-in-up">
          <div className="community-hero">
            <div className="community-hero-icon">🏘️</div>
            <div className="community-hero-info">
              <h2>{currentCommunity.name}</h2>
              <p>{currentCommunity.description}</p>
              {currentCommunity.location && (
                <span className="community-location">📍 {currentCommunity.location}</span>
              )}
            </div>
          </div>

          {/* Invite Code Section */}
          <div className="invite-section">
            <div className="invite-box">
              <div className="invite-label">Invite Code</div>
              <div className="invite-code">{currentCommunity.inviteCode}</div>
              <button className="btn-ghost" onClick={() => {
                navigator.clipboard?.writeText(currentCommunity.inviteCode);
                showToast('Invite code copied!');
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </button>
            </div>
            <p className="invite-hint">Share this code with neighbors to invite them</p>
          </div>

          {/* Members List */}
          <div className="members-section">
            <h3>Members ({currentCommunity.members.length})</h3>
            <div className="members-grid">
              {currentCommunity.members.map((memberId, i) => {
                const member = getUserById(memberId);
                if (!member) return null;
                const isAdmin = memberId === currentCommunity.adminId;
                return (
                  <div key={memberId} className="member-card animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="member-avatar" style={{
                      background: isAdmin ? 'var(--gradient-primary)' : 'var(--bg-elevated)'
                    }}>
                      {member.name.charAt(0)}
                    </div>
                    <div className="member-info">
                      <div className="member-name">
                        {member.name}
                        {isAdmin && <span className="admin-badge">Admin</span>}
                        {member.verified && <span className="verified-badge">✓</span>}
                      </div>
                      {member.apartment && <div className="member-apt">📍 {member.apartment}</div>}
                      <div className="member-rating">
                        <span className="star star-filled">★</span>
                        <span>{member.rating || 0}</span>
                        <span className="member-trust">Trust: {member.trustScore}%</span>
                      </div>
                    </div>
                    {memberId !== currentUser.id && (
                      <button className="btn-ghost btn-sm" onClick={() => {
                        navigate('profile', { user: member });
                      }}>
                        View
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="no-community animate-fade-in-up">
          <div className="no-community-card">
            <div className="nc-icon">🏡</div>
            <h2>No Community Yet</h2>
            <p>Create a new community or join an existing one to get started with your neighborhood marketplace.</p>
            <div className="nc-actions">
              <button className="btn-primary" onClick={() => setShowCreate(true)}>
                Create Community
              </button>
              <button className="btn-secondary" onClick={() => setShowJoin(true)}>
                Join with Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
