import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const CreateListing = () => {
  const { handleCreateListing, navigate, showToast } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    intent: 'sell',
    condition: '',
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Electronics', 'Furniture', 'Vehicles', 'Clothing', 'Home & Kitchen', 'Books & Education', 'Sports & Fitness', 'Services', 'Food & Groceries', 'Other'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a title', 'error');
      return;
    }
    if (!formData.category) {
      showToast('Please select a category', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      handleCreateListing({
        ...formData,
        price: formData.price ? parseInt(formData.price) : null,
      });
      setIsSubmitting(false);
      navigate('listings');
    }, 500);
  };

  const intentOptions = [
    { value: 'sell', label: 'Selling', icon: '🏷️', desc: 'List an item for sale' },
    { value: 'buy', label: 'Buying', icon: '🛒', desc: 'Looking to purchase' },
    { value: 'service', label: 'Service', icon: '🔧', desc: 'Offering a service' },
    { value: 'request', label: 'Request', icon: '📢', desc: 'Request help or items' },
  ];

  return (
    <div className="page-content">
      <div className="page-header animate-fade-in">
        <div>
          <button className="btn-back" onClick={() => navigate('listings')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>
          <h1>Create New Listing</h1>
          <p className="page-subtitle">Share what you're selling, buying, or need help with</p>
        </div>
      </div>

      <div className="create-listing-container animate-fade-in-up">
        <form onSubmit={handleSubmit} className="create-form">
          {/* Intent Selection */}
          <div className="form-section">
            <h2 className="form-section-title">What type of listing?</h2>
            <div className="intent-grid">
              {intentOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`intent-option ${formData.intent === opt.value ? 'intent-option-active' : ''}`}
                  onClick={() => setFormData({ ...formData, intent: opt.value })}
                >
                  <span className="intent-option-icon">{opt.icon}</span>
                  <span className="intent-option-label">{opt.label}</span>
                  <span className="intent-option-desc">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="form-section">
            <h2 className="form-section-title">Listing Details</h2>
            
            <div className="form-group">
              <label htmlFor="listing-title">Title *</label>
              <input
                id="listing-title"
                name="title"
                type="text"
                placeholder="e.g., Samsung Galaxy S24 Ultra"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="listing-desc">Description *</label>
              <textarea
                id="listing-desc"
                name="description"
                placeholder="Describe your item or service in detail..."
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows="5"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="listing-price">Price (₹)</label>
                <input
                  id="listing-price"
                  name="price"
                  type="number"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="listing-category">Category *</label>
                <select
                  id="listing-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="listing-condition">Condition</label>
              <div className="condition-pills">
                {conditions.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`condition-pill ${formData.condition === c ? 'condition-pill-active' : ''}`}
                    onClick={() => setFormData({ ...formData, condition: c })}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('listings')}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Creating...
                </span>
              ) : (
                'Create Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
