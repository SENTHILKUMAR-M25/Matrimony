import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, UserCircle, Users, Search, Heart, 
  MessageCircle, CreditCard, Bell, Settings, LogOut, X
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import useDashboardStore from '../../store/useDashboardStore';
import useAuthStore from '../../store/useAuthStore';

// Utility for merging tailwind classes safely
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', path: '/dashboard/profile', icon: UserCircle },
  { name: 'Matches', path: '/dashboard/matches', icon: Users },
  { name: 'Search Profiles', path: '/dashboard/search', icon: Search },
  { name: 'Interests', path: '/dashboard/interests', icon: Heart },
  { name: 'Messages', path: '/dashboard/messages', icon: MessageCircle },
  { name: 'Subscription', path: '/dashboard/subscription', icon: CreditCard },
  { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSidebarOpen, setSidebarOpen } = useDashboardStore();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 ease-in-out",
          "bg-white/80 backdrop-blur-xl border-r border-gray-200 shadow-xl shadow-gray-200/50",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <span className="text-white font-bold text-xl">J</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              JOD Matrimony
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-pink-50 text-pink-600 font-semibold"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50/50"
                )}
              >
                <item.icon 
                  size={20} 
                  className={cn(
                    "transition-transform duration-300", 
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} 
                />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 bottom-3 w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-500 rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
