import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { parseMessage } from '../utils/messageParser';

const SmartParsePage = () => {
  const { handleCreateListing, navigate, currentCommunity, showToast } = useApp();
  const [rawText, setRawText] = useState('');
  const [parsedResult, setParsedResult] = useState(null);
  const [editableResult, setEditableResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const exampleMessages = [
    "Selling Samsung Galaxy S24 Ultra for Rs 55000. Like new condition, 6 months old with box",
    "Looking to buy a study table for my home office. Budget around 5000-8000 rupees",
    "I'm a professional plumber available for hire on weekends. Pipe fitting, leak repair. ₹500 per visit",
    "Need help urgently! Can anyone recommend a good electrician? Main switch is not working",
    "Homemade chocolate cake available for Rs 800 per kg. Eggless options available. 2 days advance notice needed",
    "Want to sell my yoga mat and dumbbells set. ₹1200 for both. Barely used, like new condition",
  ];

  const handleParse = () => {
    if (!rawText.trim()) {
      showToast('Please enter a message to parse', 'error');
      return;
    }

    setIsProcessing(true);
    setParsedResult(null);

    // Simulate processing delay for visual effect
    setTimeout(() => {
      const result = parseMessage(rawText);
      setParsedResult(result);
      setEditableResult({
        title: result.title,
        description: result.description,
        price: result.price || '',
        category: result.category,
        intent: result.intent === 'unknown' ? 'sell' : result.intent,
        condition: result.condition || '',
      });
      setIsProcessing(false);
    }, 1200);
  };

  const handleCreateFromParsed = () => {
    if (!currentCommunity) {
      showToast('Join a community first!', 'error');
      return;
    }
    if (!editableResult.title.trim()) {
      showToast('Please provide a title', 'error');
      return;
    }

    handleCreateListing({
      ...editableResult,
      price: editableResult.price ? parseInt(editableResult.price) : null,
    });
    navigate('listings');
  };

  const categories = ['Electronics', 'Furniture', 'Vehicles', 'Clothing', 'Home & Kitchen', 'Books & Education', 'Sports & Fitness', 'Services', 'Food & Groceries', 'Other'];

  return (
    <div className="page-content">
      <div className="page-header animate-fade-in">
        <div>
          <h1>
            <span className="gradient-text">Smart Parse</span> ✨
          </h1>
          <p className="page-subtitle">Convert your casual messages into structured listings using AI-powered text analysis</p>
        </div>
      </div>

      <div className="smart-parse-layout animate-fade-in-up">
        {/* Input Section */}
        <div className="sp-input-section">
          <div className="sp-card">
            <h2>📝 Paste Your Message</h2>
            <p className="sp-hint">Type or paste a message like you would in a WhatsApp group</p>
            
            <textarea
              className="sp-textarea"
              placeholder="e.g., 'Selling my Samsung Galaxy S24 for Rs 55000. Like new condition, barely used for 6 months. Comes with original box and charger.'"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows="6"
            />

            <button 
              className="btn-primary btn-full btn-lg" 
              onClick={handleParse}
              disabled={isProcessing || !rawText.trim()}
            >
              {isProcessing ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Analyzing message...
                </span>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Parse Message
                </>
              )}
            </button>

            {/* Examples */}
            <div className="sp-examples">
              <h3>Try these examples:</h3>
              <div className="example-chips">
                {exampleMessages.map((msg, i) => (
                  <button
                    key={i}
                    className="example-chip"
                    onClick={() => { setRawText(msg); setParsedResult(null); }}
                  >
                    {msg.substring(0, 60)}...
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="sp-result-section">
          {isProcessing && (
            <div className="sp-processing animate-fade-in">
              <div className="processing-animation">
                <div className="processing-dot"></div>
                <div className="processing-dot"></div>
                <div className="processing-dot"></div>
              </div>
              <h3>Analyzing your message...</h3>
              <p>Detecting intent, category, price, and more</p>
            </div>
          )}

          {parsedResult && !isProcessing && (
            <div className="sp-card sp-result animate-fade-in-up">
              <div className="sp-result-header">
                <h2>🎯 Parsed Result</h2>
                <div className="confidence-meter">
                  <span className="confidence-label">Confidence</span>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill" 
                      style={{ 
                        width: `${parsedResult.confidence}%`,
                        background: parsedResult.confidence > 70 ? 'var(--status-active)' : 
                                   parsedResult.confidence > 40 ? 'var(--status-pending)' : 'var(--status-sold)'
                      }}
                    ></div>
                  </div>
                  <span className="confidence-value">{parsedResult.confidence}%</span>
                </div>
              </div>

              {/* Detected Fields */}
              <div className="parsed-fields">
                {parsedResult.parsedFields.map((field, i) => (
                  <span key={field} className="parsed-field-badge animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    ✅ {field.charAt(0).toUpperCase() + field.slice(1)} detected
                  </span>
                ))}
              </div>

              {/* Editable Form */}
              <div className="sp-editable-form">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={editableResult.title}
                    onChange={(e) => setEditableResult({...editableResult, title: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editableResult.description}
                    onChange={(e) => setEditableResult({...editableResult, description: e.target.value})}
                    className="form-textarea"
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Intent</label>
                    <select
                      value={editableResult.intent}
                      onChange={(e) => setEditableResult({...editableResult, intent: e.target.value})}
                      className="form-select"
                    >
                      <option value="sell">Selling</option>
                      <option value="buy">Buying</option>
                      <option value="service">Service</option>
                      <option value="request">Request</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      value={editableResult.price}
                      onChange={(e) => setEditableResult({...editableResult, price: e.target.value})}
                      className="form-input"
                      placeholder="No price detected"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={editableResult.category}
                      onChange={(e) => setEditableResult({...editableResult, category: e.target.value})}
                      className="form-select"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Condition</label>
                    <select
                      value={editableResult.condition}
                      onChange={(e) => setEditableResult({...editableResult, condition: e.target.value})}
                      className="form-select"
                    >
                      <option value="">Not specified</option>
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                </div>

                <button className="btn-primary btn-full btn-lg" onClick={handleCreateFromParsed}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Create Listing from Parsed Data
                </button>
              </div>
            </div>
          )}

          {!parsedResult && !isProcessing && (
            <div className="sp-empty">
              <div className="sp-empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <h3>How it works</h3>
              <div className="sp-steps">
                <div className="sp-step">
                  <div className="sp-step-num">1</div>
                  <div>
                    <strong>Paste a message</strong>
                    <p>Enter text like you'd write in a chat group</p>
                  </div>
                </div>
                <div className="sp-step">
                  <div className="sp-step-num">2</div>
                  <div>
                    <strong>Auto-detection</strong>
                    <p>Our NLP engine detects intent, price, category & more</p>
                  </div>
                </div>
                <div className="sp-step">
                  <div className="sp-step-num">3</div>
                  <div>
                    <strong>Review & post</strong>
                    <p>Edit the parsed result and create a listing instantly</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartParsePage;
