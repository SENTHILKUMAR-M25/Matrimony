import { Bell, User, Menu } from 'lucide-react';
import useDashboardStore from '../../store/useDashboardStore';
import useAuthStore from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

const Topbar = () => {
  const { toggleSidebar, notificationsCount } = useDashboardStore();
  const { user } = useAuthStore();
  const isPremium = user?.subscription_type === 'premium';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 py-2.5 sm:py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Mobile hamburger — toggles sidebar drawer */}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          className="lg:hidden p-1.5 sm:p-2 -ml-1.5 sm:-ml-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B7EBD] active:scale-95"
        >
          <Menu size={22} className="sm:w-[24px] sm:h-[24px]" />
        </button>
        <div className="hidden lg:block min-w-0">
          <h2 className="text-base lg:text-xl font-semibold text-gray-900 truncate">
            Welcome back, {user?.firstName || 'User'}!
          </h2>
          <p className="text-xs lg:text-sm text-gray-500">Find your perfect match today.</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-4 flex-shrink-0">
        <button
          aria-label="Notifications"
          className="relative p-1.5 sm:p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B7EBD] active:scale-95"
        >
          <Bell size={18} className="sm:w-[20px] sm:h-[20px] group-hover:animate-swing" />
          <AnimatePresence>
            {notificationsCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 flex items-center justify-center min-w-[14px] sm:min-w-[16px] h-[14px] sm:h-[16px] px-0.5 text-[8px] sm:text-[10px] font-bold text-white bg-amber-500 border-1.5 sm:border-2 border-white rounded-full"
              >
                {notificationsCount > 9 ? '9+' : notificationsCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-3 pl-1.5 sm:pl-4 border-l border-gray-200 min-w-0">
          <div className="hidden sm:flex flex-col items-end max-w-[100px] lg:max-w-[160px] min-w-0">
            <span className="text-xs lg:text-sm font-medium text-gray-900 truncate w-full text-right">
              {user?.firstName || 'User'}
            </span>
            <span className={`text-[10px] lg:text-xs ${isPremium ? 'text-amber-600 font-semibold' : 'text-slate-500'}`}>
              {isPremium ? 'Premium Member' : 'Free Plan'}
            </span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#3B1E54] to-[#6A3E8C] flex items-center justify-center overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
            {user?.profilePic ? (
              <img src={user.profilePic} alt={user?.firstName || 'Profile'} className="w-full h-full object-cover" />
            ) : (
              <User size={14} className="sm:w-[18px] sm:h-[18px] text-white" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;