'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import type { LoginCredentials, RegisterData } from '@/types/auth';
import { APP_ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setAuth, clearAuth, setLoading, setUser } =
    useAuthStore();

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { user } = await authService.getUser();
      setUser(user);
    } catch {
      clearAuth();
    }
  }, [setUser, clearAuth, setLoading]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (credentials: LoginCredentials, redirectTo?: string) => {
      try {
        const response = await authService.login(credentials);
        setAuth(response.user, response.token);
        toast.success(response.message);
        router.push(redirectTo || APP_ROUTES.DASHBOARD);
      } catch (error: any) {
        const message = error.response?.data?.message || 'Login failed. Please try again.';
        toast.error(message);
        throw error;
      }
    },
    [setAuth, router]
  );

  const register = useCallback(
    async (data: RegisterData, redirectTo?: string) => {
      try {
        const response = await authService.register(data);
        setAuth(response.user, response.token);
        toast.success(response.message);
        router.push(redirectTo || APP_ROUTES.DASHBOARD);
      } catch (error: any) {
        const message = error.response?.data?.message || 'Registration failed. Please try again.';
        toast.error(message);
        throw error;
      }
    },
    [setAuth, router]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
    } finally {
      clearAuth();
      toast.success('Logged out successfully');
      router.push(APP_ROUTES.LOGIN);
    }
  }, [clearAuth, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
}
