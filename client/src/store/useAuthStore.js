import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: (userData, token) => set({
        isAuthenticated: true,
        user: userData,
        token: token,
      }),

      logout: () => set({
        isAuthenticated: false,
        user: null,
        token: null,
      }),

      updateProfile: (profileData) => set((state) => ({
        user: { ...state.user, ...profileData },
      })),

      // Calculate profile completion percentage based on key fields
      getProfileCompletion: (user) => {
        if (!user) return 0;
        const requiredFields = [
          'fullName', 'age', 'religion', 'education',
          'occupation', 'country', 'state', 'city', 'profilePhoto',
        ];
        let completed = 0;
        requiredFields.forEach((field) => {
          if (user[field] && String(user[field]).trim() !== '') completed++;
        });
        return Math.round((completed / requiredFields.length) * 100);
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
