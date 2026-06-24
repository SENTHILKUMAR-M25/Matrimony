import { create } from 'zustand';

const useDashboardStore = create((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  notificationsCount: 0,
  setNotificationsCount: (count) => set({ notificationsCount: count }),
  incrementNotifications: () => set((state) => ({ notificationsCount: state.notificationsCount + 1 })),
  clearNotifications: () => set({ notificationsCount: 0 }),
}));

export default useDashboardStore;
