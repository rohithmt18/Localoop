import React from 'react';
import { useApp } from '../contexts/AppContext';

const MyListingsPage = () => {
  const { listings, currentUser, navigate, handleUpdateListing, handleDeleteListing } = useApp();
  
  const myListings = listings.filter(l => l.userId === currentUser.id);
  const active = myListings.filter(l => l.status === 'active');
  const sold = myListings.filter(l => l.status === 'sold');
  const closed = myListings.filter(l => l.status === 'closed');

  const intentColors = {
    sell: { bg: 'rgba(167, 139, 250, 0.15)', text: '#a78bfa', label: 'Selling' },
    buy: { bg: 'rgba(34, 211, 238, 0.15)', text: '#22d3ee', label: 'Buying' },
    service: { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c', label: 'Service' },
    request: { bg: 'rgba(244, 114, 182, 0.15)', text: '#f472b6', label: 'Request' },
  };

  return (
    <div className="page-content">
      <div className="page-header animate-fade-in">
        <div>
          <h1>My Listings</h1>
          <p className="page-subtitle">Manage your marketplace listings</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('create-listing')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Listing
        </button>
      </div>

      {/* Summary */}
      <div className="my-listings-summary animate-fade-in-up">
        <div className="mls-stat">
          <span className="mls-count" style={{ color: 'var(--status-active)' }}>{active.length}</span>
          <span className="mls-label">Active</span>
        </div>
        <div className="mls-stat">
          <span className="mls-count" style={{ color: 'var(--status-sold)' }}>{sold.length}</span>
          <span className="mls-label">Sold</span>
        </div>
        <div className="mls-stat">
          <span className="mls-count" style={{ color: 'var(--status-closed)' }}>{closed.length}</span>
          <span className="mls-label">Closed</span>
        </div>
      </div>

      {myListings.length === 0 ? (
        <div className="empty-state animate-fade-in-up">
          <div className="empty-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
          </div>
          <h3>No listings yet</h3>
          <p>Create your first listing to start buying or selling in your community</p>
          <button className="btn-primary" onClick={() => navigate('create-listing')}>Create Listing</button>
        </div>
      ) : (
        <div className="my-listings-list animate-fade-in-up">
          {myListings.map((listing, i) => {
            const intent = intentColors[listing.intent] || intentColors.sell;
            return (
              <div key={listing.id} className="my-listing-item" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="mli-main" onClick={() => navigate('listing-detail', { listing })}>
                  <div className="mli-badges">
                    <span className="intent-badge" style={{ background: intent.bg, color: intent.text }}>{intent.label}</span>
                    <span className={`status-badge status-${listing.status}`}>{listing.status}</span>
                    {listing.category && <span className="category-badge">{listing.category}</span>}
                  </div>
                  <h3>{listing.title}</h3>
                  <p className="mli-desc">{listing.description.substring(0, 120)}...</p>
                  <div className="mli-meta">
                    {listing.price && <span className="mli-price">₹{listing.price.toLocaleString()}</span>}
                    <span className="mli-views">👁 {listing.views || 0} views</span>
                    <span className="mli-date">{new Date(listing.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mli-actions">
                  {listing.status === 'active' && (
                    <button className="btn-sm btn-success" onClick={(e) => { e.stopPropagation(); handleUpdateListing(listing.id, { status: 'sold' }); }}>
                      Mark Sold
                    </button>
                  )}
                  {listing.status !== 'active' && (
                    <button className="btn-sm btn-primary" onClick={(e) => { e.stopPropagation(); handleUpdateListing(listing.id, { status: 'active' }); }}>
                      Reactivate
                    </button>
                  )}
                  <button className="btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDeleteListing(listing.id); }}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;
