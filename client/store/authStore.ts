import { create } from 'zustand';
import type { User } from '@/types/auth';

// Cookie helpers for server-side middleware protection
function setTokenCookie(token: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

function removeTokenCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  setAuth: (user, token) => {
    localStorage.setItem('auth_token', token);
    setTokenCookie(token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },
  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },
  clearAuth: () => {
    localStorage.removeItem('auth_token');
    removeTokenCookie();
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
