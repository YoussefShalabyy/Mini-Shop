import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { User } from '@/types';

// ─── Secure Storage Adapter ───────────────────────────────────────────────────

const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  token: string | null;
  user: User | null;
  isHydrated: boolean;

  /** Called after login/register — drives navigation guard automatically */
  setSession: (token: string, user: User) => void;
  /** Called on logout or 401 — drives navigation guard automatically */
  clearSession: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isHydrated: false,

      setSession: (token, user) => set({ token, user }),
      clearSession: () => set({ token: null, user: null }),
    }),
    {
      name: 'mini_shop_auth',
      storage: createJSONStorage(() => secureStorage),
      // Only persist token + user — isHydrated is runtime-only
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) state.isHydrated = true;
      },
    },
  ),
);
