export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface User {
  user_id: number;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}
