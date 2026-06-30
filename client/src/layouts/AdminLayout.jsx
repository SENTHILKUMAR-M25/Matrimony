import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';
import useAuthStore from '../store/useAuthStore';
import useDashboardStore from '../store/useDashboardStore';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } },
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, isAdmin } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen } = useDashboardStore();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

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
    if (!isAdmin()) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.pathname, isAdmin]);

  if (!isAuthenticated || !isAdmin()) return null;

  return (
    <div className="flex h-screen h-[100dvh] bg-gray-50 text-gray-900 overflow-hidden font-sans">
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-0 left-1/4 w-56 h-56 sm:w-96 sm:h-96 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 sm:w-96 sm:h-96 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 pointer-events-none" />

        <AdminTopbar />

        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8 z-10 custom-scrollbar"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;
