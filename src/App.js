import React from 'react';
import './index.css';
import './App.css';
import { AppProvider, useApp } from './contexts/AppContext';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ListingsPage from './components/ListingsPage';
import CreateListing from './components/CreateListing';
import ListingDetail from './components/ListingDetail';
import CommunityPage from './components/CommunityPage';
import SmartParsePage from './components/SmartParsePage';
import ProfilePage from './components/ProfilePage';
import NotificationsPage from './components/NotificationsPage';
import MyListingsPage from './components/MyListingsPage';

const AppContent = () => {
  const { currentPage, currentUser, toastMessage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'listings':
        return <ListingsPage />;
      case 'create-listing':
        return <CreateListing />;
      case 'listing-detail':
        return <ListingDetail />;
      case 'community':
        return <CommunityPage />;
      case 'smart-parse':
        return <SmartParsePage />;
      case 'profile':
        return <ProfilePage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'my-listings':
        return <MyListingsPage />;
      default:
        return <Dashboard />;
    }
  };

  const isAuthPage = currentPage === 'login' || currentPage === 'register';

  return (
    <div className="app">
      {!isAuthPage && currentUser && <Navbar />}
      <main className={`main-content ${isAuthPage ? 'auth-layout' : 'app-layout'}`}>
        {renderPage()}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`toast toast-${toastMessage.type || 'success'} animate-fade-in-up`}>
          <div className="toast-icon">
            {toastMessage.type === 'error' ? '❌' : '✅'}
          </div>
          <span>{toastMessage.message}</span>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
