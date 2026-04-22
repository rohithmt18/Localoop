// ============================================
// LOCAL STORAGE UTILITIES
// ============================================

const KEYS = {
  USERS: 'localoop_users',
  CURRENT_USER: 'localoop_current_user',
  COMMUNITIES: 'localoop_communities',
  LISTINGS: 'localoop_listings',
  NOTIFICATIONS: 'localoop_notifications',
  RATINGS: 'localoop_ratings',
};

// Generic helpers
export const getItem = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

// Generate unique IDs
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// Generate invite code
export const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// --- User Operations ---
export const getUsers = () => getItem(KEYS.USERS) || [];
export const setUsers = (users) => setItem(KEYS.USERS, users);

export const getCurrentUser = () => getItem(KEYS.CURRENT_USER);
export const setCurrentUser = (user) => setItem(KEYS.CURRENT_USER, user);
export const clearCurrentUser = () => localStorage.removeItem(KEYS.CURRENT_USER);

export const registerUser = (userData) => {
  const users = getUsers();
  const exists = users.find(u => u.email === userData.email);
  if (exists) return { success: false, message: 'Email already registered' };
  
  const newUser = {
    id: generateId(),
    ...userData,
    role: 'member',
    rating: 0,
    ratingCount: 0,
    trustScore: 50,
    verified: false,
    joinedCommunities: [],
    createdAt: new Date().toISOString(),
    avatar: null,
  };
  
  users.push(newUser);
  setUsers(users);
  return { success: true, user: newUser };
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { success: false, message: 'Invalid email or password' };
  
  setCurrentUser(user);
  return { success: true, user };
};

export const updateUser = (userId, updates) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates };
  setUsers(users);
  
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    setCurrentUser(users[index]);
  }
  
  return users[index];
};

// --- Community Operations ---
export const getCommunities = () => getItem(KEYS.COMMUNITIES) || [];
export const setCommunities = (communities) => setItem(KEYS.COMMUNITIES, communities);

export const createCommunity = (communityData, creatorId) => {
  const communities = getCommunities();
  const inviteCode = generateInviteCode();
  
  const newCommunity = {
    id: generateId(),
    ...communityData,
    inviteCode,
    adminId: creatorId,
    members: [creatorId],
    createdAt: new Date().toISOString(),
  };
  
  communities.push(newCommunity);
  setCommunities(communities);
  
  // Add community to user's joined list
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === creatorId);
  if (userIndex !== -1) {
    users[userIndex].joinedCommunities.push(newCommunity.id);
    users[userIndex].role = 'admin';
    setUsers(users);
    setCurrentUser(users[userIndex]);
  }
  
  return newCommunity;
};

export const joinCommunity = (inviteCode, userId) => {
  const communities = getCommunities();
  const community = communities.find(c => c.inviteCode === inviteCode);
  
  if (!community) return { success: false, message: 'Invalid invite code' };
  if (community.members.includes(userId)) return { success: false, message: 'Already a member' };
  
  community.members.push(userId);
  setCommunities(communities);
  
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].joinedCommunities.push(community.id);
    setUsers(users);
    setCurrentUser(users[userIndex]);
  }
  
  return { success: true, community };
};

// --- Listing Operations ---
export const getListings = () => getItem(KEYS.LISTINGS) || [];
export const setListings = (listings) => setItem(KEYS.LISTINGS, listings);

export const createListing = (listingData) => {
  const listings = getListings();
  const newListing = {
    id: generateId(),
    ...listingData,
    status: 'active',
    views: 0,
    createdAt: new Date().toISOString(),
  };
  
  listings.unshift(newListing);
  setListings(listings);
  return newListing;
};

export const updateListing = (listingId, updates) => {
  const listings = getListings();
  const index = listings.findIndex(l => l.id === listingId);
  if (index === -1) return null;
  
  listings[index] = { ...listings[index], ...updates };
  setListings(listings);
  return listings[index];
};

export const deleteListing = (listingId) => {
  const listings = getListings().filter(l => l.id !== listingId);
  setListings(listings);
};

// --- Notification Operations ---
export const getNotifications = () => getItem(KEYS.NOTIFICATIONS) || [];
export const setNotifications = (notifs) => setItem(KEYS.NOTIFICATIONS, notifs);

export const addNotification = (notification) => {
  const notifs = getNotifications();
  const newNotif = {
    id: generateId(),
    ...notification,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifs.unshift(newNotif);
  setNotifications(notifs);
  return newNotif;
};

export const markNotificationRead = (notifId) => {
  const notifs = getNotifications();
  const index = notifs.findIndex(n => n.id === notifId);
  if (index !== -1) {
    notifs[index].read = true;
    setNotifications(notifs);
  }
};

export const markAllNotificationsRead = () => {
  const notifs = getNotifications().map(n => ({ ...n, read: true }));
  setNotifications(notifs);
};

// --- Rating Operations ---
export const getRatings = () => getItem(KEYS.RATINGS) || [];
export const setRatings = (ratings) => setItem(KEYS.RATINGS, ratings);

export const addRating = (fromUserId, toUserId, rating, comment) => {
  const ratings = getRatings();
  const existing = ratings.find(r => r.fromUserId === fromUserId && r.toUserId === toUserId);
  
  if (existing) {
    existing.rating = rating;
    existing.comment = comment;
    existing.updatedAt = new Date().toISOString();
  } else {
    ratings.push({
      id: generateId(),
      fromUserId,
      toUserId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    });
  }
  
  setRatings(ratings);
  
  // Update user's average rating
  const userRatings = ratings.filter(r => r.toUserId === toUserId);
  const avgRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
  const trustScore = Math.min(100, 50 + (avgRating * 5) + (userRatings.length * 2));
  
  updateUser(toUserId, { 
    rating: Math.round(avgRating * 10) / 10, 
    ratingCount: userRatings.length,
    trustScore: Math.round(trustScore),
  });
};

export default KEYS;
