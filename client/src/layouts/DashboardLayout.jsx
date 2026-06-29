import { useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import useAuthStore from '../store/useAuthStore';
import useDashboardStore from '../store/useDashboardStore';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, getProfileCompletion } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen } = useDashboardStore();

  const isBookView = useMemo(
    () => /^\/dashboard\/matches\/\d+$/.test(location.pathname),
    [location.pathname]
  );

  // Close the mobile drawer on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  useEffect(() => {
    if (!isAuthenticated) {
      const currentPath = location.pathname + location.search;
      navigate(`/signin?redirect=${encodeURIComponent(currentPath)}`, { replace: true });
      return;
    }

    const completionPercentage = getProfileCompletion(user);
    if (completionPercentage < 80 && location.pathname !== '/dashboard/create-profile') {
      navigate('/dashboard/create-profile', { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.pathname, getProfileCompletion]);

  if (!isAuthenticated) return null;

  if (isBookView) {
    return (
      <div className="h-screen h-[100dvh] bg-[#FFFBFA] overflow-hidden">
        <main className="h-full overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen h-[100dvh] bg-gray-50 text-gray-900 overflow-hidden font-sans">
      {/* Backdrop for mobile sidebar drawer */}
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar — handles its own positioning via the Sidebar component */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-0 left-1/4 w-56 h-56 sm:w-96 sm:h-96 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 sm:w-96 sm:h-96 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 pointer-events-none" />

        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8 z-10 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;