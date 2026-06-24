import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import LoadingScreen from './components/LoadingScreen';
// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import CreateProfile from './pages/dashboard/CreateProfile';
import MyProfile from './pages/dashboard/MyProfile';
import Matches from './pages/dashboard/Matches';
import SearchProfiles from './pages/dashboard/SearchProfiles';
import Interests from './pages/dashboard/Interests';
import Messages from './pages/dashboard/Messages';
import Subscription from './pages/dashboard/Subscription';
import Notifications from './pages/dashboard/Notifications';
import Settings from './pages/dashboard/Settings';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      {!isLoading && (
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="signin" element={<SignInPage />} />
              <Route path="signup" element={<SignUpPage />} />
            </Route>
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="create-profile" element={<CreateProfile />} />
              <Route path="profile" element={<MyProfile />} />
              <Route path="matches" element={<Matches />} />
              <Route path="search" element={<SearchProfiles />} />
              <Route path="interests" element={<Interests />} />
              <Route path="messages" element={<Messages />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      )}
    </>
  );
};

export default App;
