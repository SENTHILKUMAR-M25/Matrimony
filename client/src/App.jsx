import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import LoadingScreen from './components/LoadingScreen';
import SuccessStoryDetail from './pages/SuccessStoryDetail';
import DashboardHome from './pages/dashboard/DashboardHome';
import CreateProfile from './pages/dashboard/CreateProfile';
import MyProfile from './pages/dashboard/MyProfile';
import Matches from './pages/dashboard/Matches';
import ProfileDetail from './pages/dashboard/ProfileDetail';
import Interests from './pages/dashboard/Interests';
import Subscription from './pages/dashboard/Subscription';
import Notifications from './pages/dashboard/Notifications';
import Settings from './pages/dashboard/Settings';
import SubmitSuccessStory from './pages/dashboard/SubmitSuccessStory';
import MyStories from './pages/dashboard/MyStories';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import ProfileApprovals from './pages/admin/ProfileApprovals';
import CommunityManagement from './pages/admin/CommunityManagement';
import SubscriptionManagement from './pages/admin/SubscriptionManagement';
import MatchesManagement from './pages/admin/MatchesManagement';
import ReportsAndSupport from './pages/admin/ReportsAndSupport';
import AdminSettings from './pages/admin/Settings';
import AdminProfile from './pages/admin/AdminProfile';
import SuccessStoriesManagement from './pages/admin/SuccessStoriesManagement';

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
          <Route path="story/:id" element={<SuccessStoryDetail />} />
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
          <Route path="submit-story" element={<SubmitSuccessStory />} />
          <Route path="my-stories" element={<MyStories />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="profile-approvals" element={<ProfileApprovals />} />
          <Route path="communities" element={<CommunityManagement />} />
          <Route path="subscriptions" element={<SubscriptionManagement />} />
          <Route path="matches" element={<MatchesManagement />} />
          <Route path="reports" element={<ReportsAndSupport />} />
          <Route path="success-stories" element={<SuccessStoriesManagement />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
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
