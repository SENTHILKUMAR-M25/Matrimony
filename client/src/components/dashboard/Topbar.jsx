import { Menu, Bell, User } from 'lucide-react';
import useDashboardStore from '../../store/useDashboardStore';
import useAuthStore from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

const Topbar = () => {
  const { toggleSidebar, notificationsCount } = useDashboardStore();
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="hidden lg:block">
          <h2 className="text-xl font-semibold text-gray-900">Welcome back, {user?.firstName || 'User'}!</h2>
          <p className="text-sm text-gray-500">Find your perfect match today.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors group">
          <Bell size={20} className="group-hover:animate-swing" />
          <AnimatePresence>
            {notificationsCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-pink-600 border-2 border-white rounded-full"
              >
                {notificationsCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-gray-900">{user?.firstName || 'User'}</span>
            <span className="text-xs text-pink-600">Premium Member</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
            {user?.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={20} className="text-white" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
