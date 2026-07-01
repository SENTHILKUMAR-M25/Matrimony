import { useState, useRef, useEffect } from 'react';
import { Menu, Search, UserCircle, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import useDashboardStore from '../../store/useDashboardStore';
import useAuthStore from '../../store/useAuthStore';
import AdminBreadcrumbs from './AdminBreadcrumbs';

const AdminTopbar = () => {
  const { toggleSidebar } = useDashboardStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/signin');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 py-2.5 sm:py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 shrink-0">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          className="lg:hidden p-1.5 sm:p-2 -ml-1.5 sm:-ml-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors shrink-0 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-pink-500 active:scale-95"
        >
          <Menu size={22} className="sm:w-6 sm:h-6" />
        </button>

        <AdminBreadcrumbs pathname={location.pathname} />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <div className="flex items-center rounded-xl bg-gray-100 px-3 py-1.5 gap-2 border border-transparent focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-200 transition-all duration-300 flex-1 max-w-45 sm:max-w-60 md:max-w-none">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none w-full min-w-0"
          />
        </div>

        

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-xl hover:bg-gray-100 transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-pink-500"
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-pink-800 to-pink-500 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm shrink-0">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <UserCircle size={16} className="text-white" />
              )}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-900 max-w-20 truncate">
              {user?.firstName || 'Admin'}
            </span>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50"
              >
                <button
                  onClick={() => { setProfileOpen(false); navigate('/admin/profile'); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-800 transition-colors"
                >
                  <UserCircle size={16} />
                  My Profile
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
