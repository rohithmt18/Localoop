import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const RegisterPage = () => {
  const { register, navigate } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    apartment: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(formData);
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-effects">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
        <div className="auth-orb auth-orb-3"></div>
      </div>

      <div className="auth-container auth-container-wide animate-fade-in-up">
        <div className="auth-header">
          <div className="auth-logo">
            <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="regLogoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2dd4a8"/>
                  <stop offset="100%" stopColor="#22d3ee"/>
                </linearGradient>
                <linearGradient id="regLogoGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#818cf8"/>
                </linearGradient>
              </defs>
              <path d="M50 10 L85 75 Q87 80 82 82 L18 82 Q13 80 15 75 Z" fill="#1e293b" stroke="url(#regLogoGrad1)" strokeWidth="2"/>
              <path d="M35 45 Q50 25 65 45 Q75 60 60 65 Q50 68 40 65 Q25 60 35 45Z" fill="url(#regLogoGrad1)" opacity="0.8"/>
              <path d="M40 55 Q50 40 60 55 Q65 65 55 68 Q50 70 45 68 Q35 65 40 55Z" fill="url(#regLogoGrad2)" opacity="0.9"/>
              <circle cx="50" cy="52" r="5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <h1>Create your account</h1>
          <p>Join Localoop and connect with your community</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-name">Full Name *</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input id="reg-name" name="name" type="text" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="reg-email">Email *</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input id="reg-email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-password">Password *</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input id="reg-password" name="password" type="password" placeholder="Min 6 characters" value={formData.password} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="reg-confirm">Confirm Password *</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <input id="reg-confirm" name="confirmPassword" type="password" placeholder="Repeat your password" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-phone">Phone</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <input id="reg-phone" name="phone" type="tel" placeholder="Your phone number" value={formData.phone} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="reg-apartment">Apartment/Unit</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <input id="reg-apartment" name="apartment" type="text" placeholder="e.g., A-401" value={formData.apartment} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-bio">Bio (optional)</label>
            <textarea id="reg-bio" name="bio" placeholder="Tell your neighbors a bit about yourself..." value={formData.bio} onChange={handleChange} rows="3" className="form-textarea" />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={isLoading}>
            {isLoading ? (
              <span className="btn-loading">
                <span className="spinner"></span>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <button onClick={() => navigate('login')} className="auth-link">Sign in</button></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
