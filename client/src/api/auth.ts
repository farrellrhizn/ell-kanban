import type { User } from '../types/kanban';
import api from './kanban';

export interface LoginPayload {
  email: string;
  displayName?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const login = (payload: LoginPayload) => api.post<LoginResponse>('/api/auth/login', payload);
export const logout = () => api.post<{ message: string }>('/api/auth/logout');
