import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import LoadingScreen from './components/LoadingScreen';
import DashboardHome from './pages/dashboard/DashboardHome';
import CreateProfile from './pages/dashboard/CreateProfile';
import MyProfile from './pages/dashboard/MyProfile';
import Matches from './pages/dashboard/Matches';
import ProfileDetail from './pages/dashboard/ProfileDetail';
import Interests from './pages/dashboard/Interests';
import Subscription from './pages/dashboard/Subscription';
import Notifications from './pages/dashboard/Notifications';
import Settings from './pages/dashboard/Settings';

const AppContent = () => {
  const location = useLocation();
  const [hasShownLoading, setHasShownLoading] = useState(
    () => sessionStorage.getItem('jod_hasShownLoading') === 'true'
  );

  const showLoadingScreen = !hasShownLoading && location.pathname === '/';

  const handleLoadingComplete = () => {
    sessionStorage.setItem('jod_hasShownLoading', 'true');
    setHasShownLoading(true);
  };

  return (
    <>
      {showLoadingScreen && <LoadingScreen onComplete={handleLoadingComplete} />}
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="create-profile" element={<CreateProfile />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="matches" element={<Matches />} />
          <Route path="matches/:id" element={<ProfileDetail />} />
          <Route path="interests" element={<Interests />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
