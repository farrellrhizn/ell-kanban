import { useCallback, useEffect, useState } from 'react';
import { login as loginRequest, logout as logoutRequest, type LoginPayload, type LoginResponse } from '../api/auth';
import api from '../api/kanban';
import type { User } from '../types/kanban';

const STORAGE_KEY = 'ell-kanban-auth';

const saveSession = (session: LoginResponse) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

const loadSession = (): LoginResponse | null => {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as LoginResponse;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const clearSession = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const session = loadSession();
    if (session?.user && session.token) {
      setUser(session.user);
      setToken(session.token);
      api.defaults.headers.common.Authorization = `Bearer ${session.token}`;
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { data } = await loginRequest(payload);
      setUser(data.user);
      setToken(data.token);
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      saveSession(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal login';
      setAuthError(message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await logoutRequest();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setUser(null);
      setToken(null);
      clearSession();
      delete api.defaults.headers.common.Authorization;
      setAuthLoading(false);
    }
  }, []);

  return {
    user,
    token,
    authLoading,
    authError,
    login,
    logout,
    clearAuthError: () => setAuthError(null)
  };
};

export type UseAuthReturn = ReturnType<typeof useAuth>;
