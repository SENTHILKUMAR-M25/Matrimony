import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, UserCircle, Users, Search, Heart,
  CreditCard, Bell, Settings, LogOut, X, HeartHandshake,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import useDashboardStore from '../../store/useDashboardStore';
import useAuthStore from '../../store/useAuthStore';
import API from '../../api/axios';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', path: '/dashboard/profile', icon: UserCircle },
  { name: 'Matches', path: '/dashboard/matches', icon: Users },
  { name: 'Interests', path: '/dashboard/interests', icon: Heart },
  { name: 'Success Stories', path: '/dashboard/my-stories', icon: HeartHandshake },
  { name: 'Subscription', path: '/dashboard/subscription', icon: CreditCard },
  { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSidebarOpen, setSidebarOpen, setNotificationsCount } = useDashboardStore();
  const { logout, token } = useAuthStore();
  const [interestCount, setInterestCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  const sidebarRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isSidebarOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isSidebarOpen, setSidebarOpen]);

  const fetchCounts = useCallback(async () => {
    try {
      const currentToken = token || localStorage.getItem('token');
      if (!currentToken) return;
      const [intRes, visRes] = await Promise.all([
        API.get('/interests/count', { headers: { Authorization: `Bearer ${currentToken}` } }),
        API.get('/views/count', { headers: { Authorization: `Bearer ${currentToken}` } }),
      ]);
      setInterestCount(intRes.data.count || 0);
      setVisitCount(visRes.data.count || 0);
      setNotificationsCount(visRes.data.count || 0);
    } catch (_) {}
  }, [token]);

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 15000);
    return () => clearInterval(interval);
  }, [fetchCounts]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-72 flex flex-col transition-transform duration-300 ease-in-out",
        "bg-white/80 backdrop-blur-xl border-r border-gray-200 shadow-xl shadow-[#3B1E54]/10",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div
        className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#3B1E54] to-[#6A3E8C] flex items-center justify-center shadow-lg shadow-[#3B1E54]/30 flex-shrink-0">
            <span className="text-white font-bold text-base sm:text-xl">J</span>
          </div>
          <span className="text-base sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3B1E54] to-[#9B7EBD] truncate">
            JOD Matrimony
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
          className="lg:hidden p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B7EBD] active:scale-95"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-5 sm:py-6 px-2 sm:px-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          const showInterestBadge = item.name === 'Interests' && interestCount > 0;
          const showVisitBadge = item.name === 'Notifications' && visitCount > 0;

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                "flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B7EBD]",
                isActive
                  ? "bg-[#D4BEE4]/35 text-[#3B1E54] font-semibold"
                  : "text-gray-600 hover:text-[#3B1E54] hover:bg-[#D4BEE4]/20"
              )}
            >
              <item.icon
                size={18}
                className={cn(
                  "sm:w-[20px] sm:h-[20px] transition-transform duration-300 flex-shrink-0",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )}
              />
              <span className="font-medium text-sm sm:text-base truncate">{item.name}</span>

              {showInterestBadge && (
                <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-4.5 sm:min-w-[22px] sm:h-5 px-1 rounded-full bg-rose-500 text-white text-[9px] sm:text-[10px] font-bold shadow-sm flex-shrink-0">
                  {interestCount > 9 ? '9+' : interestCount}
                </span>
              )}
              {showVisitBadge && (
                <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-4.5 sm:min-w-[22px] sm:h-5 px-1 rounded-full bg-amber-500 text-white text-[9px] sm:text-[10px] font-bold shadow-sm flex-shrink-0">
                  {visitCount > 9 ? '9+' : visitCount}
                </span>
              )}

              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 bottom-2 sm:bottom-3 w-1 h-6 sm:h-8 bg-gradient-to-b from-[#3B1E54] to-[#9B7EBD] rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div
        className="p-3 sm:p-4 border-t border-gray-200 flex-shrink-0"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B7EBD] active:scale-[0.98]"
        >
          <LogOut size={18} className="sm:w-[20px] sm:h-[20px]" />
          <span className="font-medium text-sm sm:text-base">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;