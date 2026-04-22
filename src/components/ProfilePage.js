import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const ProfilePage = () => {
  const { currentUser, selectedUser, listings, navigate, handleRateUser, showToast, refreshData } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showRating, setShowRating] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Show selected user's profile or current user's profile
  const viewingUser = selectedUser || currentUser;
  const isOwnProfile = !selectedUser || selectedUser.id === currentUser.id;

  const userListings = listings.filter(l => l.userId === viewingUser.id);

  const handleSave = async () => {
    try {
      const { apiUpdateProfile } = require('../utils/api');
      await apiUpdateProfile(editData);
      setIsEditing(false);
      showToast('Profile updated!');
      await refreshData();
    } catch (err) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const startEdit = () => {
    setEditData({
      name: currentUser.name,
      phone: currentUser.phone || '',
      apartment: currentUser.apartment || '',
      bio: currentUser.bio || '',
    });
    setIsEditing(true);
  };

  const handleRate = () => {
    handleRateUser(viewingUser.id, ratingValue, ratingComment);
    setShowRating(false);
    setRatingComment('');
  };

  const intentColors = {
    sell: { bg: 'rgba(167, 139, 250, 0.15)', text: '#a78bfa', label: 'Selling' },
    buy: { bg: 'rgba(34, 211, 238, 0.15)', text: '#22d3ee', label: 'Buying' },
    service: { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c', label: 'Service' },
    request: { bg: 'rgba(244, 114, 182, 0.15)', text: '#f472b6', label: 'Request' },
  };

  return (
    <div className="page-content">
      <div className="profile-layout animate-fade-in-up">
        {/* Profile Card */}
        <div className="profile-main">
          <div className="profile-hero">
            <div className="profile-cover">
              <div className="profile-cover-gradient"></div>
            </div>
            <div className="profile-avatar-section">
              <div className="profile-avatar-lg">
                {viewingUser.name.charAt(0)}
              </div>
              <div className="profile-identity">
                <h1>
                  {viewingUser.name}
                  {viewingUser.verified && <span className="verified-badge verified-lg" title="Verified">✓</span>}
                </h1>
                <p className="profile-email">{viewingUser.email}</p>
                {viewingUser.bio && <p className="profile-bio">{viewingUser.bio}</p>}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-value">{viewingUser.rating || 0}</div>
              <div className="profile-stat-label">Rating</div>
              <div className="mini-stars">{renderStars(viewingUser.rating || 0)}</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{viewingUser.ratingCount || 0}</div>
              <div className="profile-stat-label">Reviews</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{viewingUser.trustScore || 0}%</div>
              <div className="profile-stat-label">Trust Score</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{userListings.length}</div>
              <div className="profile-stat-label">Listings</div>
            </div>
          </div>

          {/* Details */}
          <div className="profile-details">
            {isEditing ? (
              <div className="edit-form animate-fade-in">
                <h3>Edit Profile</h3>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="form-input" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Apartment</label>
                    <input type="text" value={editData.apartment} onChange={(e) => setEditData({...editData, apartment: e.target.value})} className="form-input" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea value={editData.bio} onChange={(e) => setEditData({...editData, bio: e.target.value})} className="form-textarea" rows="3" />
                </div>
                <div className="form-actions">
                  <button className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button className="btn-primary" onClick={handleSave}>Save Changes</button>
                </div>
              </div>
            ) : (
              <div className="profile-info-grid">
                <div className="info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <span>{viewingUser.email}</span>
                </div>
                {viewingUser.phone && (
                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/>
                    </svg>
                    <span>{viewingUser.phone}</span>
                  </div>
                )}
                {viewingUser.apartment && (
                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <span>{viewingUser.apartment}</span>
                  </div>
                )}
                <div className="info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>Joined {new Date(viewingUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                </div>

                <div className="profile-action-btns">
                  {isOwnProfile ? (
                    <button className="btn-secondary" onClick={startEdit}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit Profile
                    </button>
                  ) : (
                    <button className="btn-primary" onClick={() => setShowRating(!showRating)}>
                      ⭐ Rate {viewingUser.name.split(' ')[0]}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Rating Form */}
            {showRating && !isOwnProfile && (
              <div className="rating-form animate-fade-in" style={{ marginTop: 16 }}>
                <h4>Rate {viewingUser.name}</h4>
                <div className="rating-stars-input">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" className={`star-btn ${star <= ratingValue ? 'star-active' : ''}`} onClick={() => setRatingValue(star)}>★</button>
                  ))}
                </div>
                <textarea placeholder="Leave a comment..." value={ratingComment} onChange={(e) => setRatingComment(e.target.value)} className="form-textarea" rows="2" />
                <button className="btn-primary btn-full" onClick={handleRate}>Submit Rating</button>
              </div>
            )}
          </div>

          {/* User Listings */}
          <div className="profile-listings">
            <h3>{isOwnProfile ? 'Your' : `${viewingUser.name.split(' ')[0]}'s`} Listings ({userListings.length})</h3>
            {userListings.length === 0 ? (
              <div className="empty-mini">
                <p>No listings yet</p>
                {isOwnProfile && (
                  <button className="btn-primary btn-sm" onClick={() => navigate('create-listing')}>Create your first listing</button>
                )}
              </div>
            ) : (
              <div className="profile-listings-grid">
                {userListings.map((listing) => {
                  const intent = intentColors[listing.intent] || intentColors.sell;
                  return (
                    <div key={listing.id} className="profile-listing-card" onClick={() => navigate('listing-detail', { listing })}>
                      <div className="plc-top">
                        <span className="intent-badge" style={{ background: intent.bg, color: intent.text }}>{intent.label}</span>
                        <span className={`status-dot status-${listing.status}`}>{listing.status}</span>
                      </div>
                      <h4>{listing.title}</h4>
                      {listing.price && <span className="plc-price">₹{listing.price.toLocaleString()}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={`star ${i <= Math.round(rating) ? 'star-filled' : ''}`}>★</span>
    );
  }
  return stars;
};

export default ProfilePage;
