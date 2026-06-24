import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import useAuthStore from '../store/useAuthStore';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, getProfileCompletion } = useAuthStore();

  useEffect(() => {
    // We are simulating authentication here. If not authenticated, redirect.
    // In a real app, this might check a token.
    if (!isAuthenticated) {
      navigate('/signin', { replace: true });
      return;
    }

    // Check profile completion
    const completionPercentage = getProfileCompletion(user);
    if (completionPercentage < 80 && location.pathname !== '/dashboard/create-profile') {
      navigate('/dashboard/create-profile', { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.pathname, getProfileCompletion]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Abstract background decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 pointer-events-none" />
        
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 z-10 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
