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
        user: {
          ...userData,
          subscription_type: userData.subscription_type || 'free',
          viewed_profiles: userData.viewed_profiles || 0,
          is_admin: userData.is_admin || false,
        },
        token: token,
      }),

      isAdmin: () => {
        const state = get();
        return state.isAuthenticated && state.user?.is_admin === true;
      },

      logout: () => set({
        isAuthenticated: false,
        user: null,
        token: null,
      }),

      updateProfile: (profileData) => set((state) => ({
        user: { ...state.user, ...profileData },
      })),

      updateSubscription: (data) => set((state) => ({
        user: { ...state.user, ...data },
      })),

      // Calculate profile completion percentage based on key fields
      getProfileCompletion: (user) => {
        if (!user) return 0;
        const requiredFields = [
          'fullName', 'age', 'religion', 'education',
          'occupation', 'country', 'state', 'city', 'profilePhoto',
        ];
        // Astro fields count extra if religion is Hindu
        const isHindu = user.religion && String(user.religion).toLowerCase() === 'hindu';
        if (isHindu) {
          requiredFields.push('rasi');
        }
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
