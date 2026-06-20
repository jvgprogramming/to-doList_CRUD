import axiosInstance from '@/lib/axios';
import { API_ROUTES } from '@/constants/routes';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/types/auth';

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(API_ROUTES.AUTH.REGISTER, data);
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
  },

  async getUser(): Promise<{ user: User }> {
    const response = await axiosInstance.get<{ user: User }>(API_ROUTES.AUTH.USER);
    return response.data;
  },
};
