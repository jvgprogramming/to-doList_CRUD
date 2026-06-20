export const API_ROUTES = {
  AUTH: {
    REGISTER: '/api/register',
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    USER: '/api/user',
  },
  TASKS: {
    BASE: '/api/tasks',
    STATUSES: '/api/statuses',
  },
} as const;

export const APP_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  TASKS: '/tasks',
} as const;
