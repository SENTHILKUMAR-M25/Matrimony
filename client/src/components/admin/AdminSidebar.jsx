import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, UserCheck, Building2,
  CreditCard, Heart, Shield, Settings, UserCircle, LogOut, X, HeartHandshake,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import useDashboardStore from '../../store/useDashboardStore';
import useAuthStore from '../../store/useAuthStore';

const cn = (...inputs) => twMerge(clsx(inputs));

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Profile Approvals', path: '/admin/profile-approvals', icon: UserCheck },
  { name: 'Communities', path: '/admin/communities', icon: Building2 },
  { name: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
  { name: 'Matches', path: '/admin/matches', icon: Heart },
  { name: 'Success Stories', path: '/admin/success-stories', icon: HeartHandshake },
  { name: 'Reports & Support', path: '/admin/reports', icon: Shield },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
  { name: 'Admin Profile', path: '/admin/profile', icon: UserCircle },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSidebarOpen, setSidebarOpen } = useDashboardStore();
  const { logout } = useAuthStore();
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isSidebarOpen, setSidebarOpen]);

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
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-pink-800 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-800/30 flex-shrink-0">
            <span className="text-white font-bold text-base sm:text-xl">A</span>
          </div>
          <span className="text-base sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-800 to-pink-500 truncate">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
          className="lg:hidden p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 active:scale-95"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-5 sm:py-6 px-2 sm:px-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = item.end
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                "flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500",
                isActive
                  ? "bg-pink-100/50 text-pink-800 font-semibold"
                  : "text-gray-600 hover:text-pink-800 hover:bg-pink-100/30"
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

              {isActive && (
                <motion.div
                  layoutId="adminActiveIndicator"
                  className="absolute left-0 bottom-2 sm:bottom-3 w-1 h-6 sm:h-8 bg-gradient-to-b from-pink-800 to-pink-500 rounded-r-full"
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
          className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 active:scale-[0.98]"
        >
          <LogOut size={18} className="sm:w-[20px] sm:h-[20px]" />
          <span className="font-medium text-sm sm:text-base">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
