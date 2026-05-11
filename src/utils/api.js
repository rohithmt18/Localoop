// ============================================
// API CLIENT - Connects frontend to backend
// ============================================

const API_BASE = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

// Get stored token
const getToken = () => localStorage.getItem('localoop_token');
const setToken = (token) => localStorage.setItem('localoop_token', token);
const clearToken = () => localStorage.removeItem('localoop_token');

// Generic fetch wrapper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    // If it's a network error (server not running), throw with clear message
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
    }
    throw error;
  }
};

// ========== AUTH ==========
export const apiLogin = async (email, password) => {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.token) setToken(data.token);
  return data;
};

export const apiRegister = async (userData) => {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  if (data.token) setToken(data.token);
  return data;
};

export const apiGetMe = async () => {
  return await apiRequest('/auth/me');
};

export const apiUpdateProfile = async (updates) => {
  return await apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

export const apiGetUser = async (userId) => {
  return await apiRequest(`/auth/user/${userId}`);
};

export const apiLogout = () => {
  clearToken();
};

export const hasToken = () => !!getToken();

// ========== COMMUNITIES ==========
export const apiGetMyCommunities = async () => {
  return await apiRequest('/communities/my');
};

export const apiGetCommunity = async (communityId) => {
  return await apiRequest(`/communities/${communityId}`);
};

export const apiCreateCommunity = async (data) => {
  return await apiRequest('/communities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const apiJoinCommunity = async (inviteCode) => {
  return await apiRequest('/communities/join', {
    method: 'POST',
    body: JSON.stringify({ inviteCode }),
  });
};

// ========== LISTINGS ==========
export const apiGetListings = async (communityId, filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all') params.append(key, value);
  });
  const query = params.toString() ? `?${params.toString()}` : '';
  return await apiRequest(`/listings/community/${communityId}${query}`);
};

export const apiGetListing = async (listingId) => {
  return await apiRequest(`/listings/${listingId}`);
};

export const apiCreateListing = async (data) => {
  return await apiRequest('/listings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const apiUpdateListing = async (listingId, updates) => {
  return await apiRequest(`/listings/${listingId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

export const apiDeleteListing = async (listingId) => {
  return await apiRequest(`/listings/${listingId}`, {
    method: 'DELETE',
  });
};

export const apiGetUserListings = async (userId) => {
  return await apiRequest(`/listings/user/${userId}`);
};

// ========== NOTIFICATIONS ==========
export const apiGetNotifications = async () => {
  return await apiRequest('/notifications');
};

export const apiMarkNotifRead = async (notifId) => {
  return await apiRequest(`/notifications/${notifId}/read`, {
    method: 'PUT',
  });
};

export const apiMarkAllRead = async () => {
  return await apiRequest('/notifications/read-all', {
    method: 'PUT',
  });
};

// ========== RATINGS ==========
export const apiRateUser = async (toUserId, rating, comment) => {
  return await apiRequest('/ratings', {
    method: 'POST',
    body: JSON.stringify({ toUserId, rating, comment }),
  });
};

export const apiGetUserRatings = async (userId) => {
  return await apiRequest(`/ratings/user/${userId}`);
};

// ========== HEALTH CHECK ==========
export const apiHealthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
