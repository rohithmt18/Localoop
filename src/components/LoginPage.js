import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const LoginPage = () => {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
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
      
      <div className="auth-container animate-fade-in-up">
        <div className="auth-header">
          <div className="auth-logo">
            <LogoIcon />
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to your Localoop account</p>
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
          
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={isLoading}>
            {isLoading ? (
              <span className="btn-loading">
                <span className="spinner"></span>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <button onClick={() => navigate('register')} className="auth-link">Sign up</button></p>
        </div>

        <div className="auth-demo-info">
          <div className="demo-badge">Demo Accounts</div>
          <div className="demo-accounts">
            <button onClick={() => { setEmail('priya@demo.com'); setPassword('demo123'); }} className="demo-account-btn">
              <span className="demo-avatar">PS</span>
              <span>Priya (Admin)</span>
            </button>
            <button onClick={() => { setEmail('rahul@demo.com'); setPassword('demo123'); }} className="demo-account-btn">
              <span className="demo-avatar">RM</span>
              <span>Rahul</span>
            </button>
            <button onClick={() => { setEmail('ananya@demo.com'); setPassword('demo123'); }} className="demo-account-btn">
              <span className="demo-avatar">AP</span>
              <span>Ananya</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogoIcon = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2dd4a8"/>
        <stop offset="100%" stopColor="#22d3ee"/>
      </linearGradient>
      <linearGradient id="logoGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6366f1"/>
        <stop offset="100%" stopColor="#818cf8"/>
      </linearGradient>
    </defs>
    <path d="M50 10 L85 75 Q87 80 82 82 L18 82 Q13 80 15 75 Z" fill="#1e293b" stroke="url(#logoGrad1)" strokeWidth="2"/>
    <path d="M35 45 Q50 25 65 45 Q75 60 60 65 Q50 68 40 65 Q25 60 35 45Z" fill="url(#logoGrad1)" opacity="0.8"/>
    <path d="M40 55 Q50 40 60 55 Q65 65 55 68 Q50 70 45 68 Q35 65 40 55Z" fill="url(#logoGrad2)" opacity="0.9"/>
    <circle cx="50" cy="52" r="5" fill="white" opacity="0.9"/>
  </svg>
);

export default LoginPage;
