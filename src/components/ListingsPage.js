import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';

const ListingsPage = () => {
  const { listings, navigate, getUserById, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [filterIntent, setFilterIntent] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const categories = ['Electronics', 'Furniture', 'Vehicles', 'Clothing', 'Home & Kitchen', 'Books & Education', 'Sports & Fitness', 'Services', 'Food & Groceries', 'Other'];

  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(l => l.status === filterStatus);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category?.toLowerCase().includes(q)
      );
    }

    // Intent filter
    if (filterIntent !== 'all') {
      result = result.filter(l => l.intent === filterIntent);
    }

    // Category filter
    if (filterCategory !== 'all') {
      result = result.filter(l => l.category === filterCategory);
    }

    // Price range
    if (priceRange.min) {
      result = result.filter(l => l.price >= parseInt(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter(l => l.price <= parseInt(priceRange.max));
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'popular':
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        break;
    }

    return result;
  }, [listings, search, filterIntent, filterCategory, filterStatus, sortBy, priceRange]);

  const intentConfig = {
    all: { label: 'All', color: 'var(--text-secondary)' },
    sell: { label: '🏷️ Selling', color: 'var(--cat-sell)' },
    buy: { label: '🛒 Buying', color: 'var(--cat-buy)' },
    service: { label: '🔧 Services', color: 'var(--cat-service)' },
    request: { label: '📢 Requests', color: 'var(--cat-request)' },
  };

  const intentColors = {
    sell: { bg: 'rgba(167, 139, 250, 0.15)', text: '#a78bfa', label: 'Selling' },
    buy: { bg: 'rgba(34, 211, 238, 0.15)', text: '#22d3ee', label: 'Buying' },
    service: { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c', label: 'Service' },
    request: { bg: 'rgba(244, 114, 182, 0.15)', text: '#f472b6', label: 'Request' },
  };

  const statusColors = {
    active: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
    sold: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
    closed: { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8' },
  };

  return (
    <div className="page-content">
      <div className="page-header animate-fade-in">
        <div>
          <h1>Marketplace</h1>
          <p className="page-subtitle">Browse and discover listings in your community</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('create-listing')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Listing
        </button>
      </div>

      {/* Search & Filters */}
      <div className="filters-section animate-fade-in-up">
        <div className="search-bar">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search listings by title, description, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="listings-search"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>×</button>
          )}
        </div>

        {/* Intent Tabs */}
        <div className="intent-tabs">
          {Object.entries(intentConfig).map(([key, config]) => (
            <button
              key={key}
              className={`intent-tab ${filterIntent === key ? 'intent-tab-active' : ''}`}
              onClick={() => setFilterIntent(key)}
              style={filterIntent === key ? { borderColor: config.color, color: config.color } : {}}
            >
              {config.label}
            </button>
          ))}
        </div>

        {/* Filter Row */}
        <div className="filter-row">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="closed">Closed</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Viewed</option>
          </select>

          <div className="price-filter">
            <input
              type="number"
              placeholder="Min ₹"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="price-input"
            />
            <span className="price-sep">–</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="price-input"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="listings-results-info">
        <span>{filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <h3>No listings found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="listings-grid">
          {filteredListings.map((listing, i) => {
            const user = getUserById(listing.userId);
            const intent = intentColors[listing.intent] || intentColors.sell;
            const status = statusColors[listing.status] || statusColors.active;
            const isOwner = listing.userId === currentUser.id;
            return (
              <div
                key={listing.id}
                className="listing-card animate-fade-in-up"
                onClick={() => navigate('listing-detail', { listing })}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="lc-header">
                  <span className="intent-badge" style={{ background: intent.bg, color: intent.text }}>
                    {intent.label}
                  </span>
                  <span className="status-badge" style={{ background: status.bg, color: status.text }}>
                    {listing.status}
                  </span>
                </div>

                <h3 className="lc-title">{listing.title}</h3>
                <p className="lc-desc">{listing.description.substring(0, 100)}...</p>

                {listing.category && (
                  <span className="lc-category">{listing.category}</span>
                )}

                <div className="lc-footer">
                  <div className="lc-user">
                    <div className="mini-avatar">{user?.name?.charAt(0) || '?'}</div>
                    <span>{isOwner ? 'You' : user?.name || 'Unknown'}</span>
                    {user?.verified && <span className="verified-badge" title="Verified">✓</span>}
                  </div>
                  <div className="lc-meta">
                    {listing.price ? (
                      <span className="lc-price">₹{listing.price.toLocaleString()}</span>
                    ) : (
                      <span className="lc-price lc-price-free">Free / Negotiable</span>
                    )}
                  </div>
                </div>
                
                <div className="lc-bottom-meta">
                  <span>👁 {listing.views || 0}</span>
                  <span>{formatTime(listing.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 1) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default ListingsPage;
