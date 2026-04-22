import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../utils/api';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [currentCommunity, setCurrentCommunity] = useState(null);
  const [listings, setListings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize - check if user is already logged in
  useEffect(() => {
    const initApp = async () => {
      if (api.hasToken()) {
        try {
          const data = await api.apiGetMe();
          if (data.success && data.user) {
            setCurrentUser(data.user);
            setCurrentPage('dashboard');
            await loadUserData(data.user);
          }
        } catch (err) {
          console.log('Session expired or server unavailable');
          api.apiLogout();
        }
      }
      setLoading(false);
    };
    initApp();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserData = useCallback(async (user) => {
    try {
      // Get user's communities
      const commData = await api.apiGetMyCommunities();
      const userCommunities = commData.communities || [];
      setCommunities(userCommunities);

      if (userCommunities.length > 0) {
        const community = userCommunities[0];
        // Get full community with populated members
        const fullComm = await api.apiGetCommunity(community._id || community.id);
        setCurrentCommunity(fullComm.community);

        // Get listings for this community
        const listData = await api.apiGetListings(community._id || community.id);
        setListings(listData.listings || []);

        // Set users from community members
        if (fullComm.community?.members) {
          setUsers(fullComm.community.members);
        }
      }

      // Get notifications
      const notifData = await api.apiGetNotifications();
      setNotifications(notifData.notifications || []);
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const refreshData = useCallback(async () => {
    if (currentUser) {
      try {
        const data = await api.apiGetMe();
        if (data.success) {
          setCurrentUser(data.user);
        }
        await loadUserData(data.user || currentUser);
      } catch (err) {
        console.error('Refresh error:', err);
      }
    }
  }, [currentUser, loadUserData]);

  // Auth
  const login = async (email, password) => {
    try {
      const result = await api.apiLogin(email, password);
      if (result.success) {
        setCurrentUser(result.user);
        setCurrentPage('dashboard');
        await loadUserData(result.user);
        showToast('Welcome back, ' + result.user.name + '!');
      }
      return result;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const result = await api.apiRegister(userData);
      if (result.success) {
        setCurrentUser(result.user);
        setCurrentPage('community');
        showToast('Account created successfully!');
      }
      return result;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    api.apiLogout();
    setCurrentUser(null);
    setCurrentPage('login');
    setCurrentCommunity(null);
    setListings([]);
    setNotifications([]);
    showToast('Logged out successfully');
  };

  // Community
  const handleCreateCommunity = async (data) => {
    try {
      const result = await api.apiCreateCommunity(data);
      if (result.success) {
        await refreshData();
        setCurrentCommunity(result.community);
        setCurrentPage('dashboard');
        showToast('Community "' + result.community.name + '" created!');
        return result.community;
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleJoinCommunity = async (inviteCode) => {
    try {
      const result = await api.apiJoinCommunity(inviteCode);
      if (result.success) {
        await refreshData();
        setCurrentCommunity(result.community);
        setCurrentPage('dashboard');
        showToast('Joined "' + result.community.name + '"!');
      }
      return result;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Listings
  const handleCreateListing = async (data) => {
    if (!currentCommunity) return null;
    try {
      const result = await api.apiCreateListing({
        ...data,
        communityId: currentCommunity._id || currentCommunity.id,
      });
      if (result.success) {
        await refreshData();
        showToast('Listing created successfully!');
        return result.listing;
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateListing = async (listingId, updates) => {
    try {
      await api.apiUpdateListing(listingId, updates);
      await refreshData();
      showToast('Listing updated!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      await api.apiDeleteListing(listingId);
      await refreshData();
      showToast('Listing deleted');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Notifications
  const handleMarkNotifRead = async (notifId) => {
    try {
      await api.apiMarkNotifRead(notifId);
      setNotifications(prev => prev.map(n => n._id === notifId || n.id === notifId ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.apiMarkAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  // Ratings
  const handleRateUser = async (toUserId, rating, comment) => {
    try {
      await api.apiRateUser(toUserId, rating, comment);
      await refreshData();
      showToast('Rating submitted!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Navigation
  const navigate = (page, data) => {
    setCurrentPage(page);
    if (data?.listing) setSelectedListing(data.listing);
    if (data?.user) setSelectedUser(data.user);
    window.scrollTo(0, 0);
  };

  const getUserById = (userId) => {
    // Handle both populated user objects and ObjectId references
    if (typeof userId === 'object' && userId.name) return userId;
    const id = userId?._id || userId?.id || userId;
    return users.find(u => (u._id || u.id) === id);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#0a0f1e', color: '#2dd4a8',
        fontFamily: 'Plus Jakarta Sans, Inter, sans-serif', fontSize: '1.1rem',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '16px', fontSize: '2rem' }}>⟳</div>
          Loading Localoop...
        </div>
      </div>
    );
  }

  const value = {
    currentUser,
    currentPage,
    currentCommunity,
    listings,
    notifications,
    communities,
    users,
    selectedListing,
    selectedUser,
    toastMessage,
    unreadCount,
    login,
    register,
    logout,
    navigate,
    handleCreateCommunity,
    handleJoinCommunity,
    handleCreateListing,
    handleUpdateListing,
    handleDeleteListing,
    handleMarkNotifRead,
    handleMarkAllRead,
    handleRateUser,
    getUserById,
    showToast,
    refreshData,
    setSelectedListing,
    setSelectedUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
