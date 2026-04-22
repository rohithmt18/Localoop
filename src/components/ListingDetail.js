import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const ListingDetail = () => {
  const { selectedListing, currentUser, navigate, getUserById, handleUpdateListing, handleDeleteListing, handleRateUser, showToast } = useApp();
  const [showRating, setShowRating] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  if (!selectedListing) {
    return (
      <div className="page-content">
        <div className="empty-state animate-fade-in">
          <h3>Listing not found</h3>
          <button className="btn-primary" onClick={() => navigate('listings')}>Back to Listings</button>
        </div>
      </div>
    );
  }

  const listing = selectedListing;
  const owner = getUserById(listing.userId);
  const isOwner = listing.userId === currentUser.id;

  const intentColors = {
    sell: { bg: 'rgba(167, 139, 250, 0.15)', text: '#a78bfa', label: 'Selling' },
    buy: { bg: 'rgba(34, 211, 238, 0.15)', text: '#22d3ee', label: 'Buying' },
    service: { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c', label: 'Service' },
    request: { bg: 'rgba(244, 114, 182, 0.15)', text: '#f472b6', label: 'Request' },
  };

  const intent = intentColors[listing.intent] || intentColors.sell;

  const handleStatusChange = (newStatus) => {
    handleUpdateListing(listing.id, { status: newStatus });
    listing.status = newStatus;
  };

  const handleRate = () => {
    if (!owner) return;
    handleRateUser(owner.id, ratingValue, ratingComment);
    setShowRating(false);
    setRatingComment('');
  };

  return (
    <div className="page-content">
      <button className="btn-back animate-fade-in" onClick={() => navigate('listings')} style={{ marginBottom: 24 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Listings
      </button>

      <div className="detail-layout animate-fade-in-up">
        {/* Main Content */}
        <div className="detail-main">
          <div className="detail-card">
            <div className="detail-badges">
              <span className="intent-badge intent-badge-lg" style={{ background: intent.bg, color: intent.text }}>
                {intent.label}
              </span>
              <span className={`status-badge status-badge-lg status-${listing.status}`}>
                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
              </span>
              {listing.category && (
                <span className="category-badge">{listing.category}</span>
              )}
              {listing.condition && (
                <span className="condition-badge">{listing.condition}</span>
              )}
            </div>

            <h1 className="detail-title">{listing.title}</h1>
            
            {listing.price ? (
              <div className="detail-price">₹{listing.price.toLocaleString()}</div>
            ) : (
              <div className="detail-price detail-price-free">Price Negotiable</div>
            )}

            <div className="detail-description">
              <h3>Description</h3>
              <p>{listing.description}</p>
            </div>

            <div className="detail-meta-grid">
              <div className="detail-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>Posted {formatTimeDetail(listing.createdAt)}</span>
              </div>
              <div className="detail-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>{listing.views || 0} views</span>
              </div>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="detail-actions">
                <h3>Manage Listing</h3>
                <div className="action-buttons">
                  {listing.status === 'active' && (
                    <>
                      <button className="btn-success" onClick={() => handleStatusChange('sold')}>
                        Mark as Sold
                      </button>
                      <button className="btn-secondary" onClick={() => handleStatusChange('closed')}>
                        Close Listing
                      </button>
                    </>
                  )}
                  {listing.status !== 'active' && (
                    <button className="btn-primary" onClick={() => handleStatusChange('active')}>
                      Reactivate
                    </button>
                  )}
                  <button className="btn-danger" onClick={() => { handleDeleteListing(listing.id); navigate('listings'); }}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Seller Info */}
        <div className="detail-sidebar">
          <div className="detail-card seller-card">
            <h3>{isOwner ? 'Your Listing' : 'Posted By'}</h3>
            <div className="seller-info">
              <div className="seller-avatar">
                {owner?.name?.charAt(0) || '?'}
              </div>
              <div className="seller-details">
                <div className="seller-name">
                  {owner?.name || 'Unknown User'}
                  {owner?.verified && <span className="verified-badge" title="Verified">✓</span>}
                </div>
                {owner?.apartment && <div className="seller-apt">📍 {owner.apartment}</div>}
                <div className="seller-rating">
                  <div className="stars">{renderStars(owner?.rating || 0)}</div>
                  <span>{owner?.rating || 0} ({owner?.ratingCount || 0} reviews)</span>
                </div>
                <div className="trust-meter">
                  <div className="trust-label">
                    <span>Trust Score</span>
                    <span>{owner?.trustScore || 0}%</span>
                  </div>
                  <div className="trust-bar">
                    <div className="trust-fill" style={{ width: `${owner?.trustScore || 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {!isOwner && owner && (
              <div className="seller-actions">
                <button className="btn-primary btn-full" onClick={() => {
                  showToast(`Contact ${owner.name} at ${owner.phone || 'N/A'}`);
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Contact Seller
                </button>
                <button className="btn-secondary btn-full" onClick={() => setShowRating(!showRating)}>
                  ⭐ Rate User
                </button>
              </div>
            )}

            {/* Rating Form */}
            {showRating && !isOwner && (
              <div className="rating-form animate-fade-in">
                <h4>Rate {owner?.name}</h4>
                <div className="rating-stars-input">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= ratingValue ? 'star-active' : ''}`}
                      onClick={() => setRatingValue(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Leave a comment (optional)"
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  className="form-textarea"
                  rows="3"
                />
                <button className="btn-primary btn-full" onClick={handleRate}>
                  Submit Rating
                </button>
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

const formatTimeDetail = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

export default ListingDetail;
